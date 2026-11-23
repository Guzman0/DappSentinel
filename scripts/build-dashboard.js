#!/usr/bin/env node
// Builds the session dashboard's data (docs/dashboard/data.json and cropped screenshots) from the
// mutation test records committed in evidence/mutation-test/. No Kane runs: it only reads records.
//   node scripts/build-dashboard.js        (needs ImageMagick's `convert` for the screenshots)

"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { yamlField } = require("../lib/evidence");

const ROOT = path.join(__dirname, "..");
const EV = path.join(ROOT, "evidence", "mutation-test");
const OUT = path.join(ROOT, "docs", "dashboard");
const REPO = "https://github.com/Guzman0/DappSentinel";
const mutants = JSON.parse(fs.readFileSync(path.join(ROOT, "mutants", "mutants.json"), "utf8"));
const MUT = Object.fromEntries((mutants.variants || mutants).map((m) => [m.id, m]));

const RUNS = [
  { id: "45023763082", title: "Mutation test, run 4", note: "All 8 copies of the site. Kane CLI 0.10.7, 22 Nov 2026." },
  { id: "45050499048", title: "Kane CLI 0.10.8, release day", note: "The run where Kane read 0.05 ETH and still passed it. DappSentinel's exact check on the amount was added after this run, because of it. 22 Nov 2026.", only: ["m7-wrong-confirm-amount"] },
  { id: "45175229208", title: "Kane's triage", note: "Kane read the swapped address correctly; its triage blamed the test. Kane CLI 0.10.8, 23 Nov 2026.", only: ["m3-swapped-digits"] },
];

fs.mkdirSync(path.join(OUT, "shots"), { recursive: true });

function triageFor(dir, checkId) {
  // Per-step failure.yaml files kept by collect-evidence.js, named kane-<check>--…steps__…__failure.yaml
  const f = fs.readdirSync(dir).find((n) => n.startsWith(`kane-${checkId}--`) && /steps__.*__failure\.yaml$/.test(n));
  if (!f) return null;
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  const tri = t.slice(t.indexOf("triage:"));
  return {
    title: yamlField(t, "title"),
    rootCause: yamlField(tri, "root_cause"),
    category: yamlField(tri, "category"),
    confidence: Number(yamlField(tri, "confidence")) || null,
    file: `${REPO}/blob/main/evidence/mutation-test/run-${path.basename(path.dirname(dir)).replace("run-", "")}/${path.basename(dir)}/${f}`,
  };
}

function shotsFor(dir, label, key) {
  const sdir = path.join(dir, "screenshots");
  if (!fs.existsSync(sdir)) return [];
  const files = fs.readdirSync(sdir).filter((n) => n.startsWith(`${label}-`)).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  return files.map((n) => {
    const out = `${key}-${n.replace(/\.(png|jpe?g|webp)$/i, "")}.jpg`;
    const dest = path.join(OUT, "shots", out);
    if (!fs.existsSync(dest)) {
      // Kane's screenshots are 1920x1080 with the swap card in the middle: keep that part.
      execFileSync("convert", [path.join(sdir, n), "-resize", "1920x1080!", "-crop", "720x620+600+40", "+repage", "-resize", "540x", "-strip", "-quality", "68", dest]);
    }
    return `shots/${out}`;
  });
}

const data = { built: new Date().toISOString(), repo: REPO, runs: [] };
for (const run of RUNS) {
  const rdir = path.join(EV, `run-${run.id}`);
  const variants = [];
  for (const v of fs.readdirSync(rdir).filter((n) => fs.statSync(path.join(rdir, n)).isDirectory())) {
    if (run.only && !run.only.includes(v)) continue;
    const dir = path.join(rdir, v);
    const rep = JSON.parse(fs.readFileSync(path.join(dir, "report.json"), "utf8"));
    const m = MUT[v] || {};
    const expect = m.expect || [];
    const failed = rep.results.filter((r) => r.status !== "passed").map((r) => r.id);
    const correct = expect.length ? expect.every((x) => failed.includes(x)) && failed.every((x) => expect.includes(x)) : failed.length === 0;
    const checks = rep.results.map((r) => {
      const label = r.kind === "network" ? null : r.id === "swap-flow" ? "swap-flow-run" : r.id;
      return {
        id: r.id,
        name: r.name,
        kind: r.kind,
        status: r.status,
        summary: r.summary || "",
        findings: r.findings || [],
        trace: r.trace || [],
        kane: r.kane || null,
        agreement: r.agreement || "",
        finalState: r.finalState || {},
        exactCheck: r.exactCheck || null,
        steps: (r.steps || []).map((s) => ({ status: s.status, remark: s.remark })),
        testUrl: r.testUrl || "",
        triage: r.status !== "passed" ? triageFor(dir, r.id === "swap-flow" ? "swap-flow-run" : r.id) : null,
        shots: label ? shotsFor(dir, label, `${run.id}-${v}`) : [],
      };
    });
    variants.push({
      id: v,
      mistake: v === "clean" ? "None: the fixed site. Every check must pass." : m.mistake || v,
      expect,
      verdict: correct ? "correct" : "missed",
      checks,
      record: `${REPO}/tree/main/evidence/mutation-test/run-${run.id}/${v}`,
    });
  }
  variants.sort((a, b) => (a.id === "clean" ? -1 : b.id === "clean" ? 1 : a.id.localeCompare(b.id)));
  const first = JSON.parse(fs.readFileSync(path.join(rdir, variants[0].id, "report.json"), "utf8"));
  data.runs.push({ ...run, kaneVersion: first.kaneVersion || "", runUrl: `${REPO}/actions/runs/${run.id}`, variants });
}
fs.writeFileSync(path.join(OUT, "data.json"), JSON.stringify(data));
const n = data.runs.reduce((a, r) => a + r.variants.length, 0);
console.log(`dashboard data: ${data.runs.length} runs, ${n} variants, ${fs.readdirSync(path.join(OUT, "shots")).length} screenshots`);
