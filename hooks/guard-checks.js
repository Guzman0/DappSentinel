#!/usr/bin/env node
// Claude Code "PreToolUse" hook: the agent may fix the app, but it may not touch the referee.
//
// Blocks any edit by the coding agent to the checks, the config that defines "correct",
// or DappSentinel itself (bin/, lib/, hooks/, .claude/). A failing check can only be
// turned green by changing the site.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const PROTECTED = ["checks", "sentinel.config.json", "bin", "lib", "hooks", ".claude", "package.json"];
const REASON =
  "DappSentinel: blocked. The checks, the config and the gate itself are protected, so a failing " +
  "check can only be fixed by changing the site (see siteDir in sentinel.config.json). " +
  "Read .sentinel/report.md and fix the app instead.";

function deny(detail) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `${REASON}\nBlocked: ${detail}`,
      },
    })
  );
  process.exit(0);
}

function isProtected(p) {
  if (!p) return false;
  const abs = path.resolve(ROOT, p);
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  if (rel.startsWith("..")) return false;
  return PROTECTED.some((x) => rel === x || rel.startsWith(x + "/"));
}

// Maintainers editing DappSentinel by hand can set this in their own shell before starting Claude Code.
if (process.env.DAPPSENTINEL_MAINTAINER === "1") process.exit(0);

let input = {};
try {
  input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const tool = input.tool_name || "";
const ti = input.tool_input || {};

if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool)) {
  const p = ti.file_path || ti.notebook_path || ti.path;
  if (isProtected(p)) deny(`${tool} on ${path.relative(ROOT, path.resolve(ROOT, p))}`);
}

if (tool === "Bash" || tool === "PowerShell") {
  const cmd = String(ti.command || "");
  const writes = /(>|\bsed\s+-i|\btee\b|\brm\b|\bdel\b|\bmv\b|\bmove\b|\bcp\b|\bcopy\b|Set-Content|Add-Content|Out-File|Remove-Item|Move-Item|Copy-Item|New-Item|\bgit\s+(checkout|restore|rm|mv|reset|apply|stash)|writeFile|\bperl\s+-[a-z]*i|\bpython\b.*open\()/i;
  const touches = PROTECTED.find((x) => new RegExp(`(^|[\\s"'./\\\\])${x.replace(/\./g, "\\.")}([\\s"'/\\\\]|$)`).test(cmd));
  if (touches && writes.test(cmd)) deny(`shell command that would change ${touches}: ${cmd.slice(0, 160)}`);
}

process.exit(0);
