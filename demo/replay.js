// dappsentinel demo: replays real, archived Kane CLI runs from this repo.
// No Kane account, no credits, no browser. Every line it prints is read from
// a file in evidence/, and each part names the file and the public CI run.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = c("1"), dim = c("2"), red = c("31"), green = c("32"), yellow = c("33"), cyan = c("36");

function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) throw new Error(`missing evidence file: ${rel}`);
  return fs.readFileSync(p, "utf8");
}
const lines = (rel) => read(rel).split("\n");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pace = 120;
async function say(s = "") { console.log(s); if (pace) await sleep(pace); }
async function source(rel, runUrl) {
  await say(dim(`   source: ${rel}`));
  if (runUrl) await say(dim(`   public run: ${runUrl}`));
}
const RUN_RE = /https:\/\/github\.com\/[^\s)]+\/actions\/runs\/\d+/;
function runUrl(rel) {
  const m = read(rel).match(RUN_RE);
  if (m) return m[0];
  // Otherwise the folder's README lists the run next to the file name.
  const readme = path.join(path.dirname(rel), "README.md");
  if (!fs.existsSync(path.join(ROOT, readme))) return null;
  const row = lines(readme).find((l) => l.includes(path.basename(rel)));
  const r = row && row.match(RUN_RE);
  return r ? r[0] : null;
}
function title(s) { return say("\n" + bold(cyan(s)) + "\n" + dim("─".repeat(Math.min(s.length, 70)))); }

async function loop() {
  const dir = "evidence/pr5-closed-loop/";
  await title("1. The loop: Kane fails the site, Claude Code fixes it, Kane passes it (PR #5)");
  const fail = dir + "1-kane-fails-6-of-7.txt";
  await say(bold("Kane CLI checks the broken site:"));
  for (const l of lines(fail)) {
    if (/→ ❌ failed:/.test(l)) await say("  " + red(l.trim().replace(/^→\s*/, "")));
  }
  const sum = lines(fail).find((l) => /checks failed/.test(l));
  if (sum) await say("  " + bold(red(sum.trim())));
  await source(fail, runUrl(fail));

  const told = dir + "2-what-claude-was-told.txt";
  await say("\n" + bold("Kane's findings go straight to Claude Code:"));
  for (const l of lines(told).filter((x) => x.trim()).slice(0, 4)) await say("  " + dim(l.trim().slice(0, 110)));
  await source(told);

  const patch = dir + "3-claude-fix.patch";
  const files = lines(patch).filter((l) => l.startsWith("+++ b/")).map((l) => l.slice(6));
  const added = lines(patch).filter((l) => /^\+[^+]/.test(l)).length;
  const removed = lines(patch).filter((l) => /^-[^-]/.test(l)).length;
  await say("\n" + bold("Claude commits a fix to the site, never the checks:"));
  await say(`  ${files.join(", ")}  ${green("+" + added)} ${red("-" + removed)}`);
  await source(patch);

  const pass = dir + "4-kane-passes-7-of-7.txt";
  const ok = lines(pass).find((l) => /checks passed/.test(l));
  await say("\n" + bold("Kane checks again:"));
  if (ok) await say("  " + bold(green(ok.trim())));
  await source(pass, runUrl(pass));
}

async function wallet() {
  const dir = "evidence/pr11-wallet-loop/";
  await title("2. What you see is what you sign: a transaction that doesn't match the screen (PR #11)");
  const fail = dir + "1-kane-fails-1-of-7.txt";
  await say(bold("The screen looks right. The test wallet records where the money really goes:"));
  for (const l of lines(fail)) if (/^\s*✖/.test(l)) await say("  " + red(l.trim()));
  const sum = lines(fail).find((l) => /checks failed/.test(l));
  if (sum) await say("  " + bold(red(sum.trim())));
  await source(fail, runUrl(fail));

  const patch = dir + "2-claude-fix.patch";
  await say("\n" + bold("Claude changes one line back to the trusted swap router:"));
  for (const l of lines(patch)) {
    if (/^-[^-]/.test(l)) await say("  " + red(l));
    else if (/^\+[^+]/.test(l)) await say("  " + green(l));
  }
  await source(patch);

  const pass = dir + "3-kane-passes-7-of-7.txt";
  const ok = lines(pass).find((l) => /checks passed/.test(l));
  await say("\n" + bold("Kane and the wallet check run again:"));
  if (ok) await say("  " + bold(green(ok.trim())));
  await source(pass, runUrl(pass));
}

async function mutation() {
  const rel = "evidence/mutation-test/run-45400397300/mutation-results.md";
  await title("3. Mutation test: 10 mistakes the checks were never tuned for (Kane CLI 0.10.9)");
  const rows = lines(rel).filter((l) => /^\| `/.test(l));
  for (const r of rows) {
    const cells = r.split("|").map((x) => x.trim()).filter(Boolean);
    const [variant, mistake, should, got, verdict] = cells;
    const v = variant.replace(/`/g, "");
    const ok = /correct/.test(verdict);
    const what = v === "clean" ? "the fixed site passes every check" : `${mistake.slice(0, 72)}${mistake.length > 72 ? "…" : ""}`;
    const caught = v === "clean" ? "" : dim(` → caught by ${got}`);
    await say(`  ${ok ? green("✓") : red("✗")} ${v.padEnd(24)} ${what}${caught}`);
  }
  const head = lines(rel).find((l) => /variants judged correctly/.test(l));
  if (head) await say("\n  " + bold(green(head.replace(/\*\*/g, "").split(".")[0] + ".")));
  await source(rel, "https://github.com/Guzman0/DappSentinel/actions/runs/45400397300");
}

const PARTS = { loop, wallet, mutation };

module.exports = async function demo(argv = []) {
  if (argv.includes("--fast") || !process.stdout.isTTY) pace = 0;
  const pick = argv.find((a) => PARTS[a]);
  await say(bold("🛡  DappSentinel demo") + dim("  replaying real Kane CLI runs archived in evidence/"));
  await say(dim("   No Kane account, no credits, no browser. Every result below is read from a file."));
  try {
    if (pick) await PARTS[pick]();
    else for (const f of Object.values(PARTS)) await f();
  } catch (e) {
    console.error(red(`\n${e.message}`));
    process.exit(1);
  }
  await say("\n" + bold("Run it live on any dApp:") + "  dappsentinel check --url https://your-dapp.xyz");
  await say(dim("Parts: dappsentinel demo loop | wallet | mutation   ·   add --fast to skip the pacing"));
};

if (require.main === module) module.exports(process.argv.slice(2));
