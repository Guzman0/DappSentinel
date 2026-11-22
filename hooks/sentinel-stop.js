#!/usr/bin/env node
// Claude Code "Stop" hook: closes the loop between the coding agent and Kane CLI.
//
// When Claude finishes a turn, this hook checks whether the site folder changed since
// the last passing run. If it did, it runs the DappSentinel gate. If any check fails,
// it blocks Claude from stopping and hands it Kane's report, so Claude fixes the code
// and stops again, which re-runs the gate. After MAX_ROUNDS (3) it stops
// and hands over to a person, with the checks still failing, instead of looping forever.
//
// Turn it off for a session with: DAPPSENTINEL_HOOK=off

"use strict";

const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");

const MAX_ROUNDS = 3;
const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const OUT_DIR = path.join(ROOT, ".sentinel");
const STATE = path.join(OUT_DIR, "hook-state.json");

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

function allowStop(message) {
  if (message) process.stdout.write(JSON.stringify({ systemMessage: message }));
  process.exit(0);
}

if (String(process.env.DAPPSENTINEL_HOOK).toLowerCase() === "off") allowStop();

const input = readStdin();
process.chdir(ROOT);
const { hashDir } = require(path.join(ROOT, "bin", "dappsentinel.js"));
const config = readJson(path.join(ROOT, "sentinel.config.json"), {});
const siteHash = hashDir(path.join(ROOT, config.siteDir || "demo-dapp"));

fs.mkdirSync(OUT_DIR, { recursive: true });
const lastPass = fs.existsSync(path.join(OUT_DIR, "last-pass-hash")) ? fs.readFileSync(path.join(OUT_DIR, "last-pass-hash"), "utf8").trim() : "";
if (siteHash === lastPass) allowStop();

const state = readJson(STATE, {});
const session = input.session_id || "default";
const s = state[session] || { rounds: 0, lastCheckedHash: "" };

// Nothing changed since the last failed check: don't burn credits re-running it.
if (s.lastCheckedHash === siteHash) {
  allowStop("DappSentinel: a person needs to look at this. Claude Code made no change to the site since Kane's last failed check, so the checks still fail. Kane isn't re-run on an unchanged site. Kane's full report: .sentinel/report.md");
}
if (s.rounds >= MAX_ROUNDS) {
  const last = readJson(path.join(OUT_DIR, "report.json"), { results: [] });
  const still = (last.results || []).filter((r) => r.status !== "passed").map((r) => `- ${r.name}`);
  allowStop([
    `DappSentinel: a person needs to look at this. Claude Code made ${MAX_ROUNDS} rounds of fixes and Kane still finds problems, so the loop stops here instead of trying forever.`,
    ...(still.length ? ["Checks still failing:", ...still] : []),
    "Kane's full report: .sentinel/report.md",
  ].join("\n"));
}

const log = fs.openSync(path.join(OUT_DIR, "last-run.log"), "w");
const run = spawn.sync(process.execPath, [path.join(ROOT, "bin", "dappsentinel.js"), "check"], { cwd: ROOT, stdio: ["ignore", log, log] });
fs.closeSync(log);

s.rounds += 1;
s.lastCheckedHash = siteHash;
state[session] = s;
fs.writeFileSync(STATE, JSON.stringify(state, null, 2));

if (run.status === 0) {
  allowStop(`DappSentinel: all checks passed on round ${s.rounds}. Clear to ship.`);
}
if (run.status === 3) {
  const report = readJson(path.join(OUT_DIR, "report.json"), { changed: [] });
  process.stdout.write(JSON.stringify({
    decision: "block",
    reason: `DappSentinel refused to run: protected files were changed (${(report.changed || []).join(", ")}). ` +
      "The checks and the gate can't be edited to make them pass. Revert those files and fix the site instead.",
  }));
  process.exit(0);
}
if (run.status !== 1) {
  allowStop("DappSentinel could not run Kane (setup problem). See .sentinel/last-run.log.");
}

const report = readJson(path.join(OUT_DIR, "report.json"), { results: [] });
const failed = report.results.filter((r) => r.status !== "passed");
const lines = failed.map((r) => `- ${r.name}: ${r.summary || r.reason || "failed"}`);
const reason = [
  `DappSentinel (Kane CLI) round ${s.rounds}/${MAX_ROUNDS}: ${failed.length} of ${report.results.length} checks failed.`,
  ...lines,
  "",
  `Read .sentinel/report.md for Kane's full findings and fix hints, fix the app in ${config.siteDir || "demo-dapp"}/, then finish your turn so the checks re-run.`,
  "Do not edit checks/ or sentinel.config.json to make a check pass.",
].join("\n");

process.stdout.write(JSON.stringify({ decision: "block", reason }));
process.exit(0);
