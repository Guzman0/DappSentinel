#!/usr/bin/env node
// DappSentinel: a pre-launch safety gate for dApp frontends, powered by Kane CLI.
//
//   dappsentinel check [--url <url>] [--only <id,id>] [--headed]   run every check, write a report
//   dappsentinel serve [--port <n>]                                 serve the site folder locally
//   dappsentinel list                                               list the checks
//
// Exit codes: 0 all checks passed, 1 at least one check failed, 2 setup error.

"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const crypto = require("crypto");

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "sentinel.config.json");
const CHECKS_DIR = path.join(ROOT, "checks");
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

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) die("sentinel.config.json not found. Run this from the project folder.");
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (e) {
    die(`sentinel.config.json is not valid JSON: ${e.message}`);
  }
}

// A check file is simple frontmatter (key: value lines between ---) plus a plain-English objective.
function loadChecks() {
  if (!fs.existsSync(CHECKS_DIR)) die("checks/ folder not found.");
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
      return { file, id: meta.id || file, name: meta.name || file, severity: meta.severity || "high", fix: meta.fix || "", body: m[2].trim() };
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
    rpcKeyExamples: (config.rpcKeyProviders || []).join(" or "),
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

function runKane(objective, { url, timeout, maxSteps, headed }) {
  return new Promise((resolve) => {
    const args = ["run", objective, "--agent", "--url", url, "--timeout", String(timeout), "--max-steps", String(maxSteps)];
    if (!headed) args.push("--headless");
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
      if (r.summary) lines.push(`**Kane says:** ${r.summary}`);
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
  const config = loadConfig();
  const url = args.url || config.url;
  const siteDir = path.join(ROOT, config.siteDir || "demo-dapp");
  let checks = loadChecks();
  if (args.only) {
    const ids = String(args.only).split(",");
    checks = checks.filter((c) => ids.includes(c.id));
    if (!checks.length) die(`No checks match --only ${args.only}`);
  }

  console.log(`\n🛡  DappSentinel: ${checks.length} checks against ${url}\n`);

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
  const results = [];
  const startedAt = new Date().toISOString();

  for (const [i, c] of checks.entries()) {
    console.log(`[${i + 1}/${checks.length}] ${c.name}`);
    const objective = toObjective(fill(c.body, values));
    const r = await runKane(objective, {
      url,
      timeout: config.timeoutSeconds || 240,
      maxSteps: config.maxSteps || 30,
      headed: Boolean(args.headed),
    });

    if (!r.runEnd && r.code === 2) {
      if (server) server.close();
      die(`Kane could not start (sign-in, Chrome or network problem).\n${r.stderr.trim().slice(-800)}\nTry: kane-cli whoami   and   kane-cli balance`);
    }

    const e = r.runEnd || {};
    const status = r.code === 0 ? "passed" : r.code === 1 ? "failed" : "error";
    results.push({
      id: c.id,
      name: c.name,
      severity: c.severity,
      status,
      exitCode: r.code,
      summary: e.summary || e.one_liner || (status === "error" ? "Timed out or cancelled." : ""),
      reason: e.reason || "",
      finalState: e.final_state || {},
      testUrl: e.test_url || "",
      sessionDir: e.session_dir || e.run_dir || "",
      credits: e.credits_consumed ?? e.credits ?? null,
      steps: r.steps,
      fix: fill(c.fix, values),
      objective,
    });
    console.log(`      → ${status === "passed" ? "✅ passed" : status === "error" ? "⚠️  error" : "❌ failed"}${e.summary ? ": " + String(e.summary).slice(0, 140) : ""}\n`);
  }

  if (server) server.close();

  const meta = { url, siteDir: config.siteDir, kaneVersion: version, startedAt, finishedAt: new Date().toISOString(), siteHash: hashDir(siteDir) };
  writeReport(results, meta);

  const failed = results.filter((r) => r.status !== "passed");
  if (failed.length === 0) {
    fs.writeFileSync(path.join(OUT_DIR, "last-pass-hash"), meta.siteHash);
    console.log(`✅ All ${results.length} checks passed. Clear to ship.\n   Report: .sentinel/report.md\n`);
    process.exit(0);
  }
  console.log(`❌ ${failed.length} of ${results.length} checks failed. Not safe to ship.\n   Report: .sentinel/report.md\n`);
  process.exit(1);
}

async function cmdServe(args) {
  const config = loadConfig();
  const port = Number(args.port || new URL(config.url).port || 4173);
  await startServer(path.join(ROOT, config.siteDir || "demo-dapp"), port).catch((e) => die(e.message));
  console.log(`Serving ${config.siteDir} at http://localhost:${port}  (Ctrl+C to stop)`);
}

function cmdList() {
  for (const c of loadChecks()) console.log(`${c.id.padEnd(18)} ${c.severity.padEnd(9)} ${c.name}`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || "check";
module.exports = { hashDir, loadChecks, templateValues, fill, toObjective };

if (require.main === module) {
  if (cmd === "check") cmdCheck(args);
  else if (cmd === "serve") cmdServe(args);
  else if (cmd === "list") cmdList();
  else die(`Unknown command "${cmd}". Use: check, serve or list.`);
}
