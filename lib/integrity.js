// Tamper check: before running, the gate makes sure nobody (human or agent) has changed the
// checks, the config or DappSentinel itself since the last commit. Edited referees don't count.

"use strict";

const { spawnSync } = require("child_process");

const PROTECTED = ["checks", "sentinel.config.json", "bin", "lib", "hooks", ".claude/settings.json", ".github/workflows", "profiles"];

function tamperCheck(root) {
  if (process.env.DAPPSENTINEL_ALLOW_EDITS === "1") return { ok: true, skipped: "DAPPSENTINEL_ALLOW_EDITS=1" };
  const r = spawnSync("git", ["status", "--porcelain", "--", ...PROTECTED], { cwd: root, encoding: "utf8" });
  if (r.error || r.status !== 0) return { ok: true, skipped: "not a git repository" };
  const changed = r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\S+\s+/, ""));
  if (changed.length) return { ok: false, changed };

  // In a pull request, committed edits count too: compare the protected files with the branch
  // the PR targets, so a PR can't change a check and pass its own gate.
  const base = process.env.DAPPSENTINEL_BASE_REF || (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "");
  if (base) {
    const d = spawnSync("git", ["diff", "--name-only", `${base}...HEAD`, "--", ...PROTECTED], { cwd: root, encoding: "utf8" });
    if (d.error || d.status !== 0) return { ok: false, changed: [`(could not compare with ${base}: fetch it, or check out with fetch-depth: 0)`], base };
    const edited = d.stdout.split("\n").map((l) => l.trim()).filter(Boolean);
    if (edited.length) return { ok: false, changed: edited, base };
  }
  return { ok: true };
}

module.exports = { tamperCheck, PROTECTED };
