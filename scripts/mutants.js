#!/usr/bin/env node
// Known-answer test for DappSentinel (see mutants/mutants.json).
//
//   node scripts/mutants.js list                    print the variant ids (JSON, for a CI matrix)
//   node scripts/mutants.js build <id> [outDir]     write that variant of the site to outDir (default .mutants/<id>)
//   node scripts/mutants.js judge <id> [report]     compare a gate report with what the variant should fail
//   node scripts/mutants.js summary <dir>           build a results table from the judged results in dir
//
// To run one variant locally:
//   node scripts/mutants.js build m3-swapped-digits
//   node bin/dappsentinel.js check --site .mutants/m3-swapped-digits
//   node scripts/mutants.js judge m3-swapped-digits

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, "mutants", "mutants.json"), "utf8"));
const CLEAN = path.join(ROOT, "mutants", "clean");

function variant(id) {
  const v = SPEC.variants.find((x) => x.id === id);
  if (!v) die(`No variant "${id}". Known: ${SPEC.variants.map((x) => x.id).join(", ")}`);
  return v;
}

function die(msg) {
  console.error(msg);
  process.exit(2);
}

function build(id, outDir) {
  const v = variant(id);
  const out = path.resolve(outDir || path.join(ROOT, ".mutants", id));
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(CLEAN, out, { recursive: true });
  for (const e of v.edits) {
    const file = path.join(out, e.file);
    const text = fs.readFileSync(file, "utf8");
    const count = text.split(e.find).length - 1;
    // Each mistake must land exactly once, or the variant isn't what it claims to be.
    if (count !== 1) die(`${id}: expected "${e.find}" once in ${e.file}, found it ${count} times.`);
    fs.writeFileSync(file, text.replace(e.find, e.replace));
  }
  console.log(`Built ${id} in ${path.relative(ROOT, out) || "."}: ${v.mistake}`);
}

function judge(id, reportPath) {
  const v = variant(id);
  const file = path.resolve(reportPath || path.join(ROOT, ".sentinel", "report.json"));
  const result = { id, mistake: v.mistake, expect: v.expect, failed: [], unsure: [], verdict: "no report" };
  if (fs.existsSync(file)) {
    const report = JSON.parse(fs.readFileSync(file, "utf8"));
    const results = report.results || [];
    result.failed = results.filter((r) => r.status === "failed").map((r) => r.id);
    result.unsure = results.filter((r) => r.status !== "failed" && r.status !== "passed").map((r) => `${r.id} (${r.status})`);
    const missed = v.expect.filter((c) => !result.failed.includes(c));
    const extra = result.failed.filter((c) => !v.expect.includes(c));
    if (!missed.length && !extra.length && !result.unsure.length) result.verdict = "correct";
    else if (missed.length) result.verdict = `missed ${missed.join(", ")}`;
    else if (extra.length) result.verdict = `false alarm on ${extra.join(", ")}`;
    else result.verdict = `inconclusive: ${result.unsure.join(", ")}`;
  }
  fs.mkdirSync(path.join(ROOT, ".mutants"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, ".mutants", `result-${id}.json`), JSON.stringify(result, null, 2));
  console.log(`${id}: ${result.verdict}`);
  process.exit(result.verdict === "correct" ? 0 : 1);
}

function summary(dir) {
  const rows = [];
  for (const v of SPEC.variants) {
    const f = path.join(dir, `result-${v.id}.json`);
    rows.push(fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { id: v.id, mistake: v.mistake, expect: v.expect, failed: [], verdict: "did not run" });
  }
  const ok = rows.filter((r) => r.verdict === "correct").length;
  const lines = [
    `# DappSentinel known-answer test`,
    ``,
    `**${ok} of ${rows.length} variants judged correctly.** The clean site must pass every check; each mutant has one new mistake and must fail exactly that check.`,
    ``,
    `| Variant | Planted mistake | Should fail | Kane failed | Verdict |`,
    `|---|---|---|---|---|`,
    ...rows.map((r) => `| \`${r.id}\` | ${r.mistake} | ${r.expect.length ? r.expect.join(", ") : "nothing"} | ${r.failed.length ? r.failed.join(", ") : "nothing"} | ${r.verdict === "correct" ? "✅ correct" : "❌ " + r.verdict} |`),
    ``,
  ];
  const md = lines.join("\n");
  fs.writeFileSync(path.join(dir, "mutation-results.md"), md);
  console.log(md);
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === "list") console.log(JSON.stringify(SPEC.variants.map((v) => v.id)));
else if (cmd === "build" && a) build(a, b);
else if (cmd === "judge" && a) judge(a, b);
else if (cmd === "summary" && a) summary(path.resolve(a));
else die("Usage: node scripts/mutants.js list | build <id> [outDir] | judge <id> [report.json] | summary <dir>");
