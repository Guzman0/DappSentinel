// Tamper check: before running, the gate makes sure nobody (human or agent) has changed the
// checks, the config or DappSentinel itself since the last commit. Edited referees don't count.

"use strict";

const { spawnSync } = require("child_process");

const PROTECTED = ["checks", "sentinel.config.json", "bin", "lib", "hooks", ".claude/settings.json"];

function tamperCheck(root) {
  if (process.env.DAPPSENTINEL_ALLOW_EDITS === "1") return { ok: true, skipped: "DAPPSENTINEL_ALLOW_EDITS=1" };
  const r = spawnSync("git", ["status", "--porcelain", "--", ...PROTECTED], { cwd: root, encoding: "utf8" });
  if (r.error || r.status !== 0) return { ok: true, skipped: "not a git repository" };
  const changed = r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\S+\s+/, ""));
  return changed.length ? { ok: false, changed } : { ok: true };
}

module.exports = { tamperCheck, PROTECTED };
