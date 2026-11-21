// Starts a Chrome that Kane CLI drives (via kane-cli --cdp-endpoint), and watches it live
// over the Chrome DevTools Protocol. While Kane uses the page, this records what the site
// keeps in localStorage and sessionStorage, which Kane can't reliably read back itself.

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

function findChrome() {
  const env = process.env.KANE_CLI_CHROME_PATH || process.env.CHROME_PATH;
  const candidates = [env];
  if (process.platform === "win32") {
    for (const base of [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA]) {
      if (base) candidates.push(path.join(base, "Google", "Chrome", "Application", "chrome.exe"));
    }
  } else if (process.platform === "darwin") {
    candidates.push("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");
  } else {
    candidates.push("/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser");
  }
  return candidates.find((p) => p && fs.existsSync(p)) || null;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

function getJson(port, p) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port, path: p, timeout: 2000 }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject)
      .on("timeout", function () {
        this.destroy(new Error("timeout"));
      });
  });
}

async function waitForDevtools(port, ms = 20000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      return await getJson(port, "/json/version");
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error("Chrome did not open its DevTools port in time");
}

const SNAPSHOT_JS = `(() => {
  try {
    const dump = (s) => { const o = {}; for (let i = 0; i < s.length; i++) { const k = s.key(i); o[k] = s.getItem(k); } return o; };
    return JSON.stringify({ origin: location.origin, local: dump(localStorage), session: dump(sessionStorage) });
  } catch (e) { return JSON.stringify({ origin: location.origin, error: String(e) }); }
})()`;

// Launch Chrome, return { cdpEndpoint, stop() }. stop() resolves to the merged storage
// seen on pages of `siteOrigin` while Kane was driving.
async function startWatchedChrome({ siteOrigin, headed }) {
  const chrome = findChrome();
  if (!chrome) throw new Error("Google Chrome was not found. Set KANE_CLI_CHROME_PATH to chrome.exe.");
  const WebSocket = require("ws");
  const port = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "dappsentinel-chrome-"));
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1440,900",
  ];
  if (!headed) args.push("--headless=new");
  if (process.platform === "linux" && ((process.getuid && process.getuid() === 0) || process.env.CI)) args.push("--no-sandbox");
  args.push("about:blank");

  const proc = spawn(chrome, args, { stdio: "ignore" });
  const version = await waitForDevtools(port);
  const ws = new WebSocket(version.webSocketDebuggerUrl, { perMessageDeflate: false });
  await new Promise((res, rej) => {
    ws.once("open", res);
    ws.once("error", rej);
  });

  let id = 0;
  const pending = new Map();
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve) => {
      const msgId = ++id;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params, ...(sessionId ? { sessionId } : {}) }));
    });

  const sessions = new Set();
  const seen = { local: {}, session: {}, pages: 0, origins: {} };

  ws.on("message", (raw) => {
    let m;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
      return;
    }
    if (m.method === "Target.attachedToTarget" && m.params.targetInfo.type === "page") {
      const sid = m.params.sessionId;
      sessions.add(sid);
      send("Runtime.runIfWaitingForDebugger", {}, sid);
    }
    if (m.method === "Target.detachedFromTarget") sessions.delete(m.params.sessionId);
  });

  // Attach to every page Kane opens, in any browser context, without pausing it.
  await send("Target.setDiscoverTargets", { discover: true });
  await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
  ws.on("message", (raw) => {
    let m;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    if (m.method === "Target.targetCreated" && m.params.targetInfo.type === "page" && !m.params.targetInfo.attached) {
      send("Target.attachToTarget", { targetId: m.params.targetInfo.targetId, flatten: true });
    }
  });
  const existing = await send("Target.getTargets");
  for (const t of (existing.result && existing.result.targetInfos) || []) {
    if (t.type === "page" && !t.attached) send("Target.attachToTarget", { targetId: t.targetId, flatten: true });
  }

  const landing = () => {
    const o = Object.entries(seen.origins).sort((a, b) => b[1] - a[1])[0];
    return o ? o[0] : siteOrigin;
  };

  async function snapshot() {
    for (const sid of [...sessions]) {
      const r = await Promise.race([send("Runtime.evaluate", { expression: SNAPSHOT_JS, returnByValue: true }, sid), new Promise((res) => setTimeout(() => res(null), 1500))]);
      const v = r && r.result && r.result.result && r.result.result.value;
      if (!v) continue;
      try {
        const s = JSON.parse(v);
        if (/^https?:/.test(s.origin || "")) seen.origins[s.origin] = (seen.origins[s.origin] || 0) + 1;
        // The site may forward to another address (app.spark.fi -> app.spark.finance). Count the
        // tab's own pages as the site: the configured origin, or where the tab mostly sat.
        if (s.error || (s.origin !== siteOrigin && s.origin !== landing())) continue;
        seen.pages++;
        Object.assign(seen.local, s.local);
        Object.assign(seen.session, s.session);
      } catch {
        /* ignore */
      }
    }
  }

  let polling = true;
  const loop = (async () => {
    while (polling) {
      await snapshot().catch(() => {});
      await new Promise((r) => setTimeout(r, 700));
    }
  })();

  return {
    cdpEndpoint: `http://127.0.0.1:${port}`,
    async stop() {
      polling = false;
      await loop;
      await snapshot().catch(() => {});
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      try {
        proc.kill();
      } catch {
        /* ignore */
      }
      setTimeout(() => fs.rm(profile, { recursive: true, force: true }, () => {}), 1500);
      return seen;
    },
  };
}

module.exports = { startWatchedChrome, findChrome };
