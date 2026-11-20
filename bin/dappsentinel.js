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
const { readEvidence } = require("../lib/evidence");
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
  if (args.config) {
    CONFIG_PATH = path.resolve(String(args.config));
    if (fs.existsSync(CONFIG_PATH) && fs.statSync(CONFIG_PATH).isDirectory()) CONFIG_PATH = path.join(CONFIG_PATH, "sentinel.config.json");
  }
  if (!fs.existsSync(CONFIG_PATH)) die(`${path.relative(ROOT, CONFIG_PATH)} not found. Run this from the project folder.`);
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
        fix: meta.fix || "",
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
      .map(([name, addr]) => {
        const key = `${name.toLowerCase().replace(/\W+/g, "_")}_contract`;
        return `Store the full ${name} contract address shown on the page as '${key}'. Assert: the stored ${key} is exactly ${addr}, ignoring letter case.`;
      })
      .join(" "),
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
        process.stdout.write(`      ${ev.status === "failed" ? "✖" : "·"} ${String(ev.remark || "").slice(0, 110)}\n`);
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

function writeReport(results, meta) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify({ ...meta, results }, null, 2));

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
      if (r.summary) lines.push(`**${r.kind === "assert" ? "Kane says" : "Finding"}:** ${r.summary}`);
      if (r.findings && r.findings.length) {
        lines.push("");
        for (const f of r.findings) lines.push(`- \`${f}\``);
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
      if (r.testUrl) lines.push(`\nEvidence: ${r.testUrl}`);
      if (r.sessionDir) lines.push(`\nLocal evidence: \`${r.sessionDir}\``);
      lines.push("");
    }
    lines.push(`---`);
    lines.push(`For AI agents: fix the app in \`${meta.siteDir}/\` so these checks pass, then run \`npm run sentinel\` again. Do not edit \`checks/\` or \`sentinel.config.json\` to make a check pass.`);
  } else {
    lines.push(`All checks passed. This build is clear to ship.`);
  }
  fs.writeFileSync(path.join(OUT_DIR, "report.md"), lines.join("\n") + "\n");
}

// ---------- commands ----------

async function cmdCheck(args) {
  const config = loadConfig(args);
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
  console.log(`\n🛡  DappSentinel: ${checks.length} checks against ${url} (${kaneChecks.length} Kane runs)\n`);

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
  const byId = {};
  const startedAt = new Date().toISOString();
  let n = 0;

  for (const c of kaneChecks) {
    n++;
    console.log(`[${n}/${checks.length}] ${c.name}`);
    const objective = toObjective(fill(c.body, values));

    // Storage: Kane drives a Chrome that DappSentinel started, and DappSentinel watches that
    // browser's storage live while Kane uses the page.
    let watcher = null;
    let seen = null;
    if (c.kind === "storage") {
      try {
        watcher = await startWatchedChrome({ siteOrigin: new URL(url).origin, headed: Boolean(args.headed) });
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

    byId[c.id] = {
      id: c.id,
      name: c.name,
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
    console.log(`      → ${res.status === "passed" ? "✅ passed" : res.status === "error" ? "⚠️  error" : "❌ failed"}${res.summary ? ": " + String(res.summary).slice(0, 140) : ""}\n`);
  }

  // Network checks: scan the HAR network log from Kane's evidence pack for the recording run.
  for (const c of networkChecks) {
    n++;
    console.log(`[${n}/${checks.length}] ${c.name}`);
    const rec = byId[c.recording];
    const ev = rec ? readEvidence(rec.sessionDir) : null;
    let a;
    if (!ev || !ev.har.log.entries.length) {
      a = { status: "error", summary: `No network recording found from the "${c.recording}" Kane run, so this could not be checked.`, findings: [] };
    } else {
      const entries = analyzers.harEntries(ev.har);
      a = analyzers.NETWORK[c.id] ? analyzers.NETWORK[c.id](entries, config, siteHost) : { status: "error", summary: `No analyzer for ${c.id}.`, findings: [] };
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
      source: `network log (HAR) Kane CLI recorded during the "${c.recording}" run`,
      testUrl: rec ? rec.testUrl : "",
      sessionDir: ev ? ev.file : "",
      fix: fill(c.fix, values),
    };
    for (const f of a.findings) console.log(`      ✖ ${f.slice(0, 120)}`);
    console.log(`      → ${a.status === "passed" ? "✅ passed" : a.status === "error" ? "⚠️  error" : "❌ failed"}: ${a.summary}\n`);
  }

  const results = checks.map((c) => byId[c.id]);

  if (server) server.close();

  const meta = { url, siteDir: config.siteDir, kaneVersion: version, startedAt, finishedAt: new Date().toISOString(), siteHash: hashDir(siteDir) };
  writeReport(results, meta);

  const failed = results.filter((r) => r.status !== "passed");
  if (failed.length === 0) {
    if (!args.config) fs.writeFileSync(path.join(OUT_DIR, "last-pass-hash"), meta.siteHash);
    console.log(`✅ All ${results.length} checks passed. Clear to ship.\n   Report: .sentinel/report.md\n`);
    process.exit(0);
  }
  console.log(`❌ ${failed.length} of ${results.length} checks failed. Not safe to ship.\n   Report: .sentinel/report.md\n`);
  process.exit(1);
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
module.exports = { hashDir, loadChecks, templateValues, fill, toObjective };

if (require.main === module) {
  if (cmd === "check") cmdCheck(args);
  else if (cmd === "serve") cmdServe(args);
  else if (cmd === "list") cmdList(args);
  else die(`Unknown command "${cmd}". Use: check, serve or list.`);
}
