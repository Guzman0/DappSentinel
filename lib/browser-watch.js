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

// DappSentinel's test wallet: a harmless EIP-1193 wallet put into every page Kane opens. It
// signs nothing. It answers with a test account and a fake transaction hash, and reports every
// request the site makes to it, so DappSentinel can compare what the site asks the wallet to
// sign with what Kane saw on the screen.
function walletScript(chainId) {
  const chain = "0x" + Number(chainId || 1).toString(16);
  return `(() => {
  if (window.__dsTestWallet) return;
  const ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const report = (method, params) => { try { window.__dsWalletRecord(JSON.stringify({ id: Math.random().toString(36).slice(2) + Date.now().toString(36), method, params: params || [], origin: location.origin, at: Date.now() })); } catch (e) {} };
  const provider = {
    isDappSentinelTestWallet: true,
    async request({ method, params }) {
      report(method, params);
      switch (method) {
        case "eth_requestAccounts": case "eth_accounts": return [ACCOUNT];
        case "eth_chainId": return "${chain}";
        case "net_version": return String(${Number(chainId || 1)});
        case "eth_sendTransaction": return "0x" + "ab".repeat(32);
        case "personal_sign": case "eth_sign": case "eth_signTypedData_v4": return "0x" + "00".repeat(65);
        case "wallet_switchEthereumChain": case "wallet_addEthereumChain": return null;
        default: { const e = new Error("Not supported by the DappSentinel test wallet"); e.code = 4200; throw e; }
      }
    },
    on() {}, removeListener() {},
  };
  window.__dsTestWallet = provider;
  if (!window.ethereum) { try { Object.defineProperty(window, "ethereum", { value: provider, configurable: true, writable: true }); } catch (e) {} }
  const info = Object.freeze({ uuid: "5a0f3c1e-7d2b-4e8a-9c6f-1b3d5e7f9a2c", name: "DappSentinel test wallet", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E", rdns: "app.dappsentinel.testwallet" });
  const announce = () => window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail: Object.freeze({ info, provider }) }));
  window.addEventListener("eip6963:requestProvider", announce);
  announce();
})()`;
}

// Launch Chrome, return { cdpEndpoint, stop() }. stop() resolves to the merged storage
// seen on pages of siteOrigin while Kane was driving, and, with `wallet`, every request the
// site made to DappSentinel's test wallet.
async function startWatchedChrome({ siteOrigin, headed, wallet }) {
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
  const seen = { local: {}, session: {}, pages: 0, origins: {}, wallet: [] };
  const WALLET_JS = wallet ? walletScript(wallet.chainId) : null;

  // With the test wallet: add it to a page before the page's own code runs, then let it go on.
  async function prepare(sid) {
    if (WALLET_JS) {
      await send("Runtime.enable", {}, sid);
      await send("Runtime.addBinding", { name: "__dsWalletRecord" }, sid);
      await send("Page.addScriptToEvaluateOnNewDocument", { source: WALLET_JS }, sid);
      send("Runtime.evaluate", { expression: WALLET_JS }, sid);
    }
    send("Runtime.runIfWaitingForDebugger", {}, sid);
  }

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
      prepare(sid).catch(() => {});
    }
    // A page can be watched by more than one session, so each wallet request carries an id.
    if (m.method === "Runtime.bindingCalled" && m.params.name === "__dsWalletRecord") {
      try {
        const rec = JSON.parse(m.params.payload);
        if (!seen.wallet.some((x) => x.id === rec.id)) seen.wallet.push(rec);
      } catch {
        /* ignore */
      }
    }
    // Kane may navigate before the wallet script is registered for new documents. Put the wallet
    // into every new page context as it appears too; the script only installs itself once.
    if (WALLET_JS && m.method === "Runtime.executionContextCreated" && m.sessionId) {
      const ctx = m.params.context || {};
      if (!ctx.auxData || ctx.auxData.isDefault !== false) send("Runtime.evaluate", { expression: WALLET_JS, contextId: ctx.id }, m.sessionId);
    }
    if (m.method === "Target.detachedFromTarget") sessions.delete(m.params.sessionId);
  });

  // Attach to every page Kane opens, in any browser context, without pausing it.
  await send("Target.setDiscoverTargets", { discover: true });
  await send("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: Boolean(WALLET_JS), flatten: true });
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
