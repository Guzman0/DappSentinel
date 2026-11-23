#!/usr/bin/env node
// DappSentinel: a pre-launch safety gate for dApp frontends, powered by Kane CLI.
//
//   dappsentinel check [--url <url>] [--only <id,id>] [--headed]   run every check, write a report
//                      [--config <file>] [--site <folder>]          use another config (and its checksDir),
//                                                                   serve and check a built folder,
//                                                                   e.g. profiles/live for any public dApp URL
//   dappsentinel serve [--port <n>]                                 serve the site folder locally
//   dappsentinel list                                               list the checks
//
// Exit codes: 0 all checks passed, 1 at least one check failed, 2 setup error,
//             3 refused: the checks, config or gate were changed since the last commit.

"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const crypto = require("crypto");
const analyzers = require("../lib/analyzers");
const { readEvidence, readTriage } = require("../lib/evidence");
const { startWatchedChrome } = require("../lib/browser-watch");
const { tamperCheck } = require("../lib/integrity");

const ROOT = process.cwd();
let CONFIG_PATH = path.join(ROOT, "sentinel.config.json");
let CHECKS_DIR = path.join(ROOT, "checks");
const OUT_DIR = path.join(ROOT, ".sentinel");

// ---------- helpers ----------

function die(msg, code = 2) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function loadConfig(args = {}) {
  // Run from any folder (for example with npx) and pass --url: with no config of your own here,
  // use the bundled checks that work on any live dApp.
  if (!args.config && args.url && !fs.existsSync(CONFIG_PATH)) args.config = path.join(__dirname, "..", "profiles", "live");
  if (args.config) {
    CONFIG_PATH = path.resolve(String(args.config));
    if (fs.existsSync(CONFIG_PATH) && fs.statSync(CONFIG_PATH).isDirectory()) CONFIG_PATH = path.join(CONFIG_PATH, "sentinel.config.json");
  }
  if (!fs.existsSync(CONFIG_PATH)) die(`${path.relative(ROOT, CONFIG_PATH)} not found. Run this from your project folder, or check a live site with: dappsentinel check --url https://your-dapp.xyz`);
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (e) {
    die(`${path.relative(ROOT, CONFIG_PATH)} is not valid JSON: ${e.message}`);
  }
  // checksDir is relative to the config file. A config of your own with no checksDir gets the
  // checks that work on any site (profiles/live/checks).
  if (config.checksDir) CHECKS_DIR = path.resolve(path.dirname(CONFIG_PATH), config.checksDir);
  else if (args.config) CHECKS_DIR = path.join(__dirname, "..", "profiles", "live", "checks");
  return config;
}

// A check file is simple frontmatter (key: value lines between ---) plus a plain-English objective.
function loadChecks() {
  if (!fs.existsSync(CHECKS_DIR)) die(`${path.relative(ROOT, CHECKS_DIR)}/ folder not found.`);
  return fs
    .readdirSync(CHECKS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const text = fs.readFileSync(path.join(CHECKS_DIR, file), "utf8").replace(/\r\n/g, "\n");
      const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!m) die(`checks/${file} is missing its --- header.`);
      const meta = {};
      for (const line of m[1].split("\n")) {
        const i = line.indexOf(":");
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
      return {
        file,
        id: meta.id || file,
        name: meta.name || file,
        severity: meta.severity || "high",
        kind: meta.kind || "assert",
        recording: meta.recording || "",
        // A check that only exists to load the page: if it fails, the traffic recorded during it
        // may not be the real page (a bot challenge, an error page), so clean scans don't count.
        gatesRecording: meta.gates === "recording",
        fix: meta.fix || "",
        // expect: name=value; name2=value2. Values Kane must have read and stored during the run.
        // A second, exact check behind Kane's own verdict: if Kane passes the run but the value it
        // stored doesn't match, the check fails anyway.
        expect: (meta.expect || "").split(";").map((x) => x.trim()).filter(Boolean).map((x) => {
          const i = x.indexOf("=");
          return { name: x.slice(0, i).trim(), value: x.slice(i + 1).trim() };
        }).filter((x) => x.name && x.value),
        // wallet: <stored name>. Kane runs with DappSentinel's test wallet in the page, and what the
        // site asks the wallet to sign must match what Kane saw (the amount stored under that name)
        // and go only to trusted contracts.
        wallet: meta.wallet || "",
        body: m[2].trim(),
      };
    });
}

function templateValues(config, url) {
  const host = new URL(url).host;
  const list = (arr) => (arr || []).join(", ");
  return {
    url,
    siteHost: host,
    chainId: String(config.chainId),
    networkName: config.networkName || "",
    contractsList: Object.entries(config.contracts || {})
      .map(([name, addr]) => `Assert: the ${name} contract address shown on the page is exactly ${addr}. Compare every character; letter case does not matter.`)
      .join("\n"),
    allowedScriptHosts: list((config.allowedScriptHosts || ["self"]).map((h) => (h === "self" ? `${host} (the site itself)` : h))),
    testnetHints: (config.testnetHints || []).join(", ").replace(/, ([^,]*)$/, " or $1"),
    rpcKeyProviders: list(config.rpcKeyProviders),
    secretKeyNames: (config.secretKeyNames || []).map((k) => `'${k}'`).join(", ").replace(/, ([^,]*)$/, " or $1"),
  };
}

function fill(text, values) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in values ? values[k] : `{{${k}}}`));
}

// Kane objectives are passed as a single line so they survive Windows command lines.
function toObjective(body) {
  return body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/"/g, "'");
}

function hashDir(dir) {
  const h = crypto.createHash("sha256");
  const walk = (d) => {
    for (const name of fs.readdirSync(d).sort()) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else {
        h.update(path.relative(dir, p).replace(/\\/g, "/"));
        h.update(fs.readFileSync(p));
      }
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return h.digest("hex");
}

// ---------- static server ----------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function startServer(dir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      let file = path.join(dir, urlPath);
      if (!file.startsWith(path.resolve(dir))) {
        res.writeHead(403).end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file)) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
      fs.createReadStream(file).pipe(res);
    });
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function isLocal(url) {
  const h = new URL(url).hostname;
  return h === "localhost" || h === "127.0.0.1";
}

function portInUse(port) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: "/", timeout: 1500 }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

// ---------- Kane ----------

function kaneSpawn(args, opts) {
  const spawn = require("cross-spawn");
  return spawn("kane-cli", args, opts);
}

function kaneAvailable() {
  return new Promise((resolve) => {
    let child;
    try {
      child = kaneSpawn(["--version"], { stdio: ["ignore", "pipe", "pipe"] });
    } catch {
      resolve(null);
      return;
    }
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("error", () => resolve(null));
    child.on("close", (code) => resolve(code === 0 ? out.trim() || "unknown" : null));
  });
}

let REDACT_CFG = {};

function runKane(objective, { url, timeout, maxSteps, headed, cdpEndpoint }) {
  return new Promise((resolve) => {
    const args = ["run", objective, "--agent", "--url", url, "--timeout", String(timeout), "--max-steps", String(maxSteps)];
    // In CI there is no browser for `kane-cli login`, so Kane takes a username and access key.
    if (process.env.LT_USERNAME && process.env.LT_ACCESS_KEY) args.push("--username", process.env.LT_USERNAME, "--access-key", process.env.LT_ACCESS_KEY);
    if (cdpEndpoint) args.push("--cdp-endpoint", cdpEndpoint);
    else if (!headed) args.push("--headless");
    const child = kaneSpawn(args, { stdio: ["ignore", "pipe", "pipe"] });
    let buf = "";
    let stderr = "";
    let runEnd = null;
    const steps = [];

    const handleLine = (line) => {
      line = line.trim();
      if (!line) return;
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        return;
      }
      if (ev.type === "run_end") runEnd = ev;
      else if (!ev.type && ev.step !== undefined && ev.status && ev.status !== "running") {
        steps.push({ step: ev.step, status: ev.status, remark: ev.remark });
        // Kane's remarks can quote a URL with a key in it, and CI logs are public: mask first.
        process.stdout.write(`      ${ev.status === "failed" ? "✖" : "·"} ${analyzers.redact(String(ev.remark || ""), REDACT_CFG).slice(0, 110)}\n`);
      }
    };

    child.stdout.on("data", (d) => {
      buf += d;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        handleLine(buf.slice(0, i));
        buf = buf.slice(i + 1);
      }
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (e) => resolve({ code: 2, runEnd: null, steps, stderr: String(e.message) }));
    child.on("close", (code) => {
      if (buf) handleLine(buf);
      resolve({ code, runEnd, steps, stderr });
    });
  });
}

// ---------- report ----------

function writeReport(results, meta, config = {}) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "report.json"), analyzers.redact(JSON.stringify({ ...meta, results }, null, 2), config));

  const failed = results.filter((r) => r.status !== "passed");
  const lines = [];
  lines.push(`# DappSentinel report`);
  lines.push("");
  lines.push(`- Site: ${meta.url}`);
  lines.push(`- Run at: ${meta.finishedAt}`);
  lines.push(`- Result: **${failed.length === 0 ? "PASSED" : "FAILED"}**, ${results.length - failed.length} of ${results.length} checks passed`);
  lines.push("");
  lines.push(`| Check | Severity | Result |`);
  lines.push(`|---|---|---|`);
  for (const r of results) lines.push(`| ${r.name} | ${r.severity} | ${r.status === "passed" ? "✅ passed" : r.status === "error" ? "⚠️ error" : "❌ failed"} |`);
  lines.push("");

  if (failed.length) {
    lines.push(`## What Kane caught`);
    lines.push("");
    for (const r of failed) {
      lines.push(`### ❌ ${r.name} (\`${r.id}\`)`);
      lines.push("");
      // Kane's own verdict comes first; DappSentinel's exact check is shown behind it.
      if (r.kane) lines.push(`**Kane's own DevTools verdict:** ${r.kane.status === "passed" ? "✅ passed" : r.kane.status === "failed" ? "❌ failed" : "⚠️ inconclusive"}${r.kane.remark ? `: ${r.kane.remark}` : ""}${r.kane.testUrl ? ` ([Kane's run](${r.kane.testUrl}))` : ""}\n\n_${r.agreement}_\n`);
      if (r.summary) lines.push(`**${r.kind === "assert" ? "Kane says" : "DappSentinel's exact check"}:** ${r.summary}`);
      if (r.kaneTriage && (r.kaneTriage.title || r.kaneTriage.rootCause)) {
        const k = r.kaneTriage;
        const blamesTest = /automation|test|config|flak|environment/i.test(k.category || "");
        lines.push(`\n**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): ${k.title ? `_${k.title}._ ` : ""}${k.rootCause || ""}${k.category ? ` Category: \`${k.category}\`` : ""}${k.confidence ? `, ${Math.round(k.confidence * 100)}% confident` : ""}.`);
        if (blamesTest) lines.push(`\n_Kane's triage blames the test here, but the check failed on what the page showed. Look at the site first: in our mutation test, Kane's triage blamed the test when the site really had a swapped digit._`);
      }
      if (r.findings && r.findings.length) {
        lines.push("");
        r.findings.forEach((f, i) => lines.push(`- \`${f}\`${r.trace && r.trace[i] ? `  (${r.trace[i]})` : ""}`));
      }
      if (r.source) lines.push(`\n_Source: ${r.source}._`);
      if (r.reason && r.reason !== r.summary) lines.push(`\n**Reason:** ${r.reason}`);
      const failedSteps = (r.steps || []).filter((s) => s.status === "failed");
      if (failedSteps.length) {
        lines.push("");
        lines.push(`Failed steps:`);
        for (const s of failedSteps) lines.push(`- ${s.remark}`);
      }
      if (r.finalState && Object.keys(r.finalState).length) lines.push(`\nValues Kane read from the page: \`${JSON.stringify(r.finalState)}\``);
      lines.push("");
      lines.push(`**How to fix:** ${r.fix}`);
      if (r.testUrl) lines.push(`\nWatch Kane's run, step by step: ${r.testUrl}`);
      if (r.sessionDir) lines.push(`\nLocal evidence: \`${r.sessionDir}\``);
      lines.push("");
    }
    lines.push(`---`);
    lines.push(`For AI agents: fix the app in \`${meta.siteDir}/\` so these checks pass, then run \`npm run sentinel\` again. Do not edit \`checks/\` or \`sentinel.config.json\` to make a check pass.`);
  } else {
    lines.push(`All checks passed. This build is clear to ship.`);
  }
  fs.writeFileSync(path.join(OUT_DIR, "report.md"), analyzers.redact(lines.join("\n") + "\n", config));
}

// Kane's summary can run to several lines; show the one that says what it actually saw.
function keyLine(text) {
  const lines = String(text).split(/\n+/).map((l) => l.trim()).filter(Boolean);
  return lines.find((l) => /^(Confirmed|Verified|Found|Observed|The page (shows|showed|displays|displayed))/i.test(l)) || lines[0] || "";
}

// ---------- commands ----------

async function cmdCheck(args) {
  const config = loadConfig(args);
  REDACT_CFG = config;
  // --site serves a folder you built (e.g. ./dist) and checks it locally.
  const siteDir = args.site ? path.resolve(String(args.site)) : path.join(ROOT, config.siteDir || "demo-dapp");
  if (args.site) config.siteDir = path.relative(ROOT, siteDir) || ".";
  if (args.site && !fs.existsSync(siteDir)) die(`--site ${args.site} not found.`);
  const url = args.url || (args.site ? "http://localhost:4173" : config.url);
  const all = loadChecks();
  let checks = all;
  if (args.only) {
    const ids = String(args.only).split(",").map((x) => x.trim());
    checks = all.filter((c) => ids.includes(c.id));
    if (!checks.length) die(`No checks match --only ${args.only}`);
    // Network checks read the traffic Kane recorded during another check, so run that one too.
    for (const c of [...checks]) {
      if (c.kind === "network" && !checks.some((x) => x.id === c.recording)) {
        const rec = all.find((x) => x.id === c.recording);
        if (rec) checks.push(rec);
      }
    }
    checks.sort((a, b) => all.indexOf(a) - all.indexOf(b));
  }

  const tamper = tamperCheck(ROOT);
  if (!tamper.ok) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const msg = [
      "# DappSentinel report",
      "",
      `- Result: **REFUSED**. The checks, the config or the gate itself were changed since ${tamper.base ? "`" + tamper.base + "`" : "the last commit"}:`,
      ...tamper.changed.map((f) => `  - \`${f}\``),
      "",
      "A check can only be made to pass by fixing the site. Revert these changes (for example `git checkout -- checks sentinel.config.json`) and run the gate again.",
    ].join("\n");
    fs.writeFileSync(path.join(OUT_DIR, "report.md"), msg + "\n");
    fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify({ refused: true, changed: tamper.changed }, null, 2));
    console.error(`\n⛔ Refused: the referee was changed. These protected files differ from ${tamper.base || "the last commit"}:\n${tamper.changed.map((f) => "   " + f).join("\n")}\n   DappSentinel won't run checks that were edited to pass. Fix the site instead.\n`);
    process.exit(3);
  }
  if (tamper.skipped) console.log(`   (tamper check skipped: ${tamper.skipped})`);

  const kaneChecks = checks.filter((c) => c.kind !== "network");
  const networkChecks = checks.filter((c) => c.kind === "network");
  // Every step printed as [n/steps]: the Kane checks, Kane's DevTools run (when on), then the network checks.
  const hiddenIds = ["rpc-key-leak", "testnet-rpc", "unknown-scripts", "storage-secrets"];
  const devtoolsOn = process.env.DAPPSENTINEL_KANE_DEVTOOLS !== "off" && checks.some((c) => hiddenIds.includes(c.id));
  const steps = checks.length + (devtoolsOn ? 1 : 0);
  console.log(`\n🛡  DappSentinel: ${checks.length} checks against ${url} (${kaneChecks.length + (devtoolsOn ? 1 : 0)} Kane runs)\n`);

  const version = await kaneAvailable();
  if (!version) die("kane-cli was not found. Install it with: npm install -g @testmuai/kane-cli   then sign in with: kane-cli login");

  let server = null;
  if (isLocal(url)) {
    const port = Number(new URL(url).port || 80);
    if (!(await portInUse(port))) {
      server = await startServer(siteDir, port).catch((e) => die(`Could not start the local server on port ${port}: ${e.message}`));
      console.log(`   Serving ${config.siteDir} at ${url}\n`);
    }
  }

  const values = templateValues(config, url);
  const siteHost = new URL(url).host;
  let landedOn = ""; // where the site really ended up, if it forwards to another address
  const byId = {};
  const startedAt = new Date().toISOString();
  let n = 0;

  for (const c of kaneChecks) {
    n++;
    console.log(`[${n}/${steps}] ${c.name}`);
    const objective = toObjective(fill(c.body, values));

    // Storage: Kane drives a Chrome that DappSentinel started, and DappSentinel watches that
    // browser's storage live while Kane uses the page.
    let watcher = null;
    let seen = null;
    if (c.kind === "storage" || c.wallet) {
      try {
        watcher = await startWatchedChrome({ siteOrigin: new URL(url).origin, headed: Boolean(args.headed), wallet: c.wallet ? { chainId: config.chainId } : null });
      } catch (err) {
        console.log(`      ⚠️  Could not start a watched Chrome: ${err.message}`);
      }
    }

    const r = await runKane(objective, {
      url,
      timeout: config.timeoutSeconds || 300,
      maxSteps: config.maxSteps || 30,
      headed: Boolean(args.headed),
      cdpEndpoint: watcher ? watcher.cdpEndpoint : null,
    });
    if (watcher) seen = await watcher.stop();
    if (seen) landedOn = landingFromWatch(seen, url) || landedOn;

    if (!r.runEnd && r.code === 2 && c.kind !== "storage") {
      if (server) server.close();
      die(`Kane could not start (sign-in, Chrome or network problem).\n${r.stderr.trim().slice(-800)}\nTry: kane-cli whoami   and   kane-cli balance`);
    }

    const e = r.runEnd || {};
    const ctx = typeof e.context === "object" && e.context ? e.context : {};
    let status = r.code === 0 ? "passed" : r.code === 1 ? "failed" : "error";
    let summary = e.summary || e.one_liner || (status === "error" ? "Timed out or cancelled." : "");
    let findings = [];
    let source = "Kane CLI assertion in a real browser";

    // Storage: Kane copies localStorage from the real page; DappSentinel scans the copy.
    if (c.kind === "storage") {
      const a = seen ? analyzers.storageSnapshot(seen, config) : analyzers.storageSecrets(ctx.memory || {}, config);
      status = a.status;
      for (const f of a.findings) console.log(`      ✖ ${f.slice(0, 120)}`);
      summary = a.summary;
      if (a.status === "error" && !r.runEnd) summary += ` Kane did not start with the watched browser: ${r.stderr.trim().split("\n").slice(-2).join(" ")}`;
      findings = a.findings;
      source = seen ? "browser storage, watched live over the Chrome DevTools Protocol in the Chrome that Kane CLI drove" : "localStorage as read by Kane CLI";
    }

    // Kane's verdict, checked against what Kane itself read: a pass only stands if every value
    // the check expects was stored by Kane and matches.
    const stored = ctx.memory ? Object.fromEntries(Object.entries(ctx.memory).map(([k, v]) => [k.toLowerCase(), v && v.extracted_value !== undefined ? v.extracted_value : v])) : {};
    let exact = null;
    if (c.kind === "assert" && c.expect.length && status === "passed") {
      for (const x of c.expect) {
        const got = stored[x.name.toLowerCase()];
        const ok = analyzers.valueMatches(got, x.value);
        if (ok === null) {
          status = "error";
          exact = `Kane passed this check but did not store ${x.name}, so its verdict could not be confirmed.`;
        } else if (!ok) {
          status = "failed";
          exact = `Kane passed this check, but the value Kane itself read does not match: ${x.name} is "${String(got)}", expected ${x.value}.`;
        }
        if (exact) break;
      }
      if (exact) {
        summary = `${exact}\nKane's own summary: ${summary}`;
        console.log(`      ✖ ${exact}`);
      }
    }

    // What you see is what you sign: compare what the site asked DappSentinel's test wallet to
    // sign with what Kane read on the screen and with the contracts the config trusts.
    let walletCheck = null;
    if (c.wallet && status === "passed") {
      walletCheck = seen
        ? analyzers.walletMatch(seen.wallet, { seenAmount: stored[c.wallet.toLowerCase()], expectTransaction: true }, config)
        : { status: "error", summary: "The test wallet could not be started, so what the site asks the wallet to sign was not checked.", findings: [] };
      if (walletCheck.status !== "passed") {
        status = walletCheck.status;
        exact = walletCheck.status === "failed" ? `Kane passed this check, but what the user sees is not what the wallet is asked to sign.` : walletCheck.summary;
        findings = walletCheck.findings;
        source = "the transactions the site asked DappSentinel's test wallet to sign while Kane used the swap, compared with what Kane read on the screen";
        summary = `${exact}\nKane's own summary: ${summary}`;
        console.log(`      ✖ ${exact}`);
        for (const f of findings) console.log(`      ✖ ${f.slice(0, 160)}`);
      }
    }

    byId[c.id] = {
      id: c.id,
      name: c.name,
      exactCheck: exact,
      walletCheck,
      severity: c.severity,
      kind: c.kind,
      status,
      exitCode: r.code,
      summary,
      reason: c.kind === "storage" ? "" : e.reason || "",
      findings,
      source,
      finalState: ctx.memory ? Object.fromEntries(Object.entries(ctx.memory).map(([k, v]) => [k, v && v.extracted_value !== undefined ? v.extracted_value : v])) : {},
      testUrl: e.test_url || "",
      sessionDir: e.session_dir || e.run_dir || "",
      credits: e.credits_consumed ?? e.credits ?? null,
      steps: r.steps,
      fix: fill(c.fix, values),
      objective,
    };
    const res = byId[c.id];
    // Kane's own triage of a failed run (its diagnosis, category and confidence). Shown in the
    // report as Kane's opinion; it never changes the verdict.
    if (c.kind === "assert" && res.status !== "passed") {
      try {
        const t = readTriage(res.sessionDir);
        if (t) res.kaneTriage = t[0];
      } catch {
        /* no triage in this pack */
      }
    }
    if (res.walletCheck && res.walletCheck.status === "passed") console.log(`      ✓ What you see is what you sign: ${res.walletCheck.summary}`);
    // When the exact check overrules Kane, lead with it, not with Kane's own (passing) summary.
    const line = res.exactCheck || keyLine(res.summary);
    console.log(`      → ${res.status === "passed" ? "✅ passed" : res.status === "error" ? "⚠️  error" : "❌ failed"}${line ? ": " + line.slice(0, 200) : ""}\n`);
  }

  // Kane's own DevTools verdicts on the hidden checks: one extra Kane run that loads the page and
  // asserts on the network traffic and localStorage Kane captured itself. DappSentinel's code then
  // reads Kane's recording as a second, exact check, and the report shows both verdicts.
  const devtools = {};
  if (devtoolsOn) {
    n++;
    console.log(`[${n}/${steps}] Kane's own DevTools verdicts on the hidden checks`);
    const v = templateValues(config, url);
    const own = analyzers.ownDomain(v.siteHost);
    const hosts = (config.allowedScriptHosts || ["self"]).map((h) => (h === "self" ? own : h)).join(", ");
    const want = (id) => checks.some((c) => c.id === id);
    // Kane's network capture resets at every step, so the requests are stored in the step that
    // reloads the page, and the assertions then check the stored list.
    const asserts = {
      "rpc-key-leak": "Assert: no URL in page_requests contains an RPC provider API key, such as a long key after /v2/ on an alchemy.com host or after /v3/ on an infura.io host.",
      "testnet-rpc": `Assert: no URL in page_requests goes to a testnet, staging or local endpoint, meaning a host containing ${v.testnetHints}, other than ${v.siteHost} itself.`,
      "unknown-scripts": `Assert: every entry in page_requests with resource type script was loaded from one of these domains or their subdomains: ${hosts}.`,
      "storage-secrets": "Assert: no localStorage value is a private key (64 hexadecimal characters, with or without 0x) or a seed phrase of 12 or 24 lowercase words.",
    };
    const match = { "rpc-key-leak": /api key/i, "testnet-rpc": /testnet/i, "unknown-scripts": /resource type script/i, "storage-secrets": /localstorage/i };
    // Kane stops at the first failed assertion, so the ones it never reached get a run of their own.
    let todo = hiddenIds.filter(want);
    for (let round = 0; todo.length && round < 4; round++) {
      const net = todo.some((id) => id !== "storage-secrets");
      const lines = [
        `Go to ${url} and wait until the page has fully loaded.`,
        ...(net ? ["Reload the page and, in that same step, store the full URL and resource type of every network request the page makes while it loads, as page_requests."] : []),
        ...todo.map((id) => asserts[id]),
      ];
      const r = await runKane(lines.join("\n"), { url, timeout: config.timeoutSeconds || 300, maxSteps: 12, headed: Boolean(args.headed) });
      const e = r.runEnd || {};
      for (const id of todo) {
        const st = r.steps.find((x) => /^\s*assert/i.test(String(x.remark)) && match[id].test(String(x.remark)));
        if (st) devtools[id] = { status: st.status === "failed" ? "failed" : /^(passed|success|succeeded|done|completed|ok)$/i.test(String(st.status)) ? "passed" : "error", rawStatus: st.status, remark: String(st.remark || "").trim(), testUrl: e.test_url || "" };
      }
      const left = todo.filter((id) => !devtools[id]);
      if (!r.runEnd || left.length === todo.length) {
        for (const id of left) devtools[id] = { status: "error", remark: r.runEnd ? "Kane did not report this assertion." : "Kane's DevTools run did not finish.", testUrl: e.test_url || "" };
        break;
      }
      todo = left;
    }
  }

  // Network checks: scan the HAR network log from Kane's evidence pack for the recording run.
  let forwardNoted = false;
  for (const c of networkChecks) {
    n++;
    console.log(`[${n}/${steps}] ${c.name}`);
    const rec = byId[c.recording];
    const recCheck = all.find((x) => x.id === c.recording);
    const ev = rec ? readEvidence(rec.sessionDir) : null;
    let a;
    if (!ev || !ev.har.log.entries.length) {
      a = { status: "error", summary: `No network recording found from the "${c.recording}" Kane run, so this could not be checked.`, findings: [] };
    } else {
      const entries = analyzers.harEntries(ev.har);
      const landHost = landedOn || landingFromHar(ev.har.log.entries, url);
      // When the site forwards elsewhere, its own scripts and RPCs come from the new address too.
      const cfg = landHost && landHost !== siteHost && (config.allowedScriptHosts || ["self"]).includes("self")
        ? { ...config, allowedScriptHosts: [...(config.allowedScriptHosts || ["self"]), analyzers.ownDomain(landHost)] }
        : config;
      if (landHost && landHost !== siteHost && !forwardNoted) {
        console.log(`      ↪ ${siteHost} forwarded to ${landHost}; both count as the site itself.`);
        forwardNoted = true;
      }
      a = analyzers.NETWORK[c.id] ? analyzers.NETWORK[c.id](entries.filter((e) => !landHost || c.id !== "testnet-rpc" || analyzers.hostOf(e.url) !== landHost), cfg, siteHost) : { status: "error", summary: `No analyzer for ${c.id}.`, findings: [] };
      if (landHost && landHost !== siteHost) a.summary += ` (${siteHost} forwarded to ${landHost}, which counts as the site itself.)`;
      a.trace = traceFindings(a.findings, ev.har.log.entries);
      // A clean scan only counts if Kane actually got to use the page (e.g. not stuck on a bot check).
      // When the page itself never loaded, findings are as unreliable as clean results (a bot
      // challenge page loads its own scripts), so both become inconclusive.
      const pageNeverLoaded = rec.status !== "passed" && recCheck && recCheck.gatesRecording;
      if ((a.status === "passed" && rec.status === "error") || pageNeverLoaded) {
        a = { status: "error", summary: `Inconclusive: the "${c.recording}" run did not pass (${String(rec.summary || "").slice(0, 120)}), so the recording may not cover the real page.`, findings: [] };
      }
    }
    byId[c.id] = {
      id: c.id,
      name: c.name,
      severity: c.severity,
      kind: c.kind,
      status: a.status,
      summary: a.summary,
      reason: "",
      findings: a.findings,
      trace: a.trace || [],
      source: `network log (HAR) Kane CLI recorded during the "${c.recording}" run`,
      testUrl: rec ? rec.testUrl : "",
      sessionDir: ev ? ev.file : "",
      fix: fill(c.fix, values),
    };
    a.findings.forEach((f, i) => console.log(`      ✖ ${f.slice(0, 120)}${a.trace && a.trace[i] ? `\n        ${a.trace[i]}` : ""}`));
    if (a.status === "failed" && rec && rec.testUrl) console.log(`        Watch Kane's run: ${rec.testUrl}`);
    console.log(`      → ${a.status === "passed" ? "✅ passed" : a.status === "error" ? "⚠️  error" : "❌ failed"}: ${a.summary}\n`);
  }

  // Put Kane's DevTools verdict next to DappSentinel's exact check. Mode "either" (the default)
  // fails a check when either one finds the problem: a security gate fails closed.
  const mode = process.env.DAPPSENTINEL_KANE_DEVTOOLS || "either";
  for (const [id, k] of Object.entries(devtools)) {
    const r = byId[id];
    if (!r) continue;
    r.kane = k;
    const code = r.status;
    if (k.status === "failed" && code === "passed") {
      r.agreement = "Kane's DevTools assertion failed; DappSentinel's exact check found nothing.";
      if (mode === "either") r.status = "failed";
    } else if (k.status === "passed" && code === "failed") r.agreement = "DappSentinel's exact check found it; Kane's DevTools assertion passed.";
    else if (k.status === code && code !== "error") r.agreement = code === "failed" ? "Kane and DappSentinel both found it." : "Kane and DappSentinel both passed it.";
    else r.agreement = `Kane's DevTools verdict: ${k.status}.`;
    console.log(`   ${id}: Kane ${k.status === "passed" ? "✅" : k.status === "failed" ? "❌" : "⚠️"}  DappSentinel ${code === "passed" ? "✅" : code === "failed" ? "❌" : "⚠️"}  ${r.agreement}`);
  }

  const results = checks.map((c) => byId[c.id]);

  if (server) server.close();

  const meta = { url, siteDir: config.siteDir, kaneVersion: version, startedAt, finishedAt: new Date().toISOString(), siteHash: hashDir(siteDir) };
  writeReport(results, meta, config);

  const failed = results.filter((r) => r.status !== "passed");
  if (failed.length === 0) {
    if (!args.config) fs.writeFileSync(path.join(OUT_DIR, "last-pass-hash"), meta.siteHash);
    console.log(`✅ All ${results.length} checks passed. Clear to ship.\n   Report: .sentinel/report.md\n`);
    process.exit(0);
  }
  console.log(`❌ ${failed.length} of ${results.length} checks failed. Not safe to ship.\n   Report: .sentinel/report.md\n`);
  process.exit(1);
}

// Where the site really landed, when the configured address forwards to another one.
// From the watched browser: the http(s) origin the tab sat on most.
function landingFromWatch(seen, url) {
  const o = Object.entries(seen.origins || {}).sort((a, b) => b[1] - a[1])[0];
  if (!o) return "";
  const host = new URL(o[0]).host;
  return host !== new URL(url).host ? host : "";
}

// From Kane's network recording: follow HTTP redirects from the configured address.
function landingFromHar(raw, url) {
  const norm = (u) => u.replace(/\/$/, "");
  let cur = url;
  for (let hop = 0; hop < 6; hop++) {
    const e = raw.find((x) => x.request && norm(x.request.url) === norm(cur));
    const st = e && e.response ? e.response.status : 0;
    if (!e || st < 300 || st > 399) break;
    const loc = e.response.redirectURL || ((e.response.headers || []).find((h) => /^location$/i.test(h.name)) || {}).value;
    if (!loc) break;
    cur = new URL(loc, cur).href;
  }
  const host = new URL(cur).host;
  return host !== new URL(url).host ? host : "";
}

// For each finding from Kane's network recording, say where in Kane's run it happened:
// which request it was and how many seconds into the run, so it can be found in Kane's replay.
function traceFindings(findings, raw) {
  const t0 = raw.length ? Date.parse(raw[0].startedDateTime) : NaN;
  // Some recordings stamp every request with the same time; then the time says nothing.
  const span = raw.length ? (Date.parse(raw[raw.length - 1].startedDateTime) - t0) / 1000 : 0;
  return (findings || []).map((f) => {
    const i = raw.findIndex((e) => {
      const host = analyzers.hostOf((e.request && e.request.url) || "");
      return host && f.includes(host);
    });
    if (i < 0) return "";
    const dt = (Date.parse(raw[i].startedDateTime) - t0) / 1000;
    const when = Number.isFinite(dt) && span >= 0.5 ? `, ${dt.toFixed(1)} s into Kane's run` : "";
    return `first seen in Kane's recording as request ${i + 1} of ${raw.length}${when}`;
  });
}

async function cmdServe(args) {
  const config = loadConfig(args);
  const port = Number(args.port || new URL(config.url).port || 4173);
  await startServer(path.join(ROOT, config.siteDir || "demo-dapp"), port).catch((e) => die(e.message));
  console.log(`Serving ${config.siteDir} at http://localhost:${port}  (Ctrl+C to stop)`);
}

function cmdList(args = {}) {
  loadConfig(args);
  for (const c of loadChecks()) console.log(`${c.id.padEnd(18)} ${c.severity.padEnd(9)} ${c.name}`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || "check";
module.exports = { hashDir, loadChecks, templateValues, fill, toObjective, traceFindings, landingFromHar, landingFromWatch, writeReport };

const HELP = `DappSentinel: a pre-launch safety gate for dApp frontends, run by Kane CLI in a real browser.

Usage
  dappsentinel check --url https://your-dapp.xyz   Check any live dApp (no setup in your repo)
  dappsentinel check                               Check the site configured in ./sentinel.config.json
  dappsentinel check --config <dir|file>           Use another config (for example profiles/lido)
  dappsentinel list                                List the checks that would run
  dappsentinel serve                               Serve the configured site locally

Options
  --headed        Watch Kane in a visible browser
  --only <ids>    Run only some checks, comma-separated
  --site <dir>    Check a local folder instead of the configured site

Needs Node.js 20+, Chrome, and Kane CLI signed in: npm i -g @testmuai/kane-cli && kane-cli login
Report: .sentinel/report.md   More: https://github.com/Guzman0/DappSentinel`;

if (require.main === module) {
  if (args.help || cmd === "help") { console.log(HELP); process.exit(0); }
  if (cmd === "check") cmdCheck(args);
  else if (cmd === "serve") cmdServe(args);
  else if (cmd === "list") cmdList(args);
  else die(`Unknown command "${cmd}". Use: check, serve or list.`);
}
