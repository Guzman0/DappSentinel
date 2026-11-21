#!/usr/bin/env node
// Collects what one gate run produced, for the mutation test's public record:
//   node scripts/collect-evidence.js <variant-id> <outDir>
// Keeps the masked report, Kane's step log for every run, the screenshots from Kane's evidence
// packs, and a masked list of the network requests Kane recorded. The raw evidence pack itself is
// not kept (see SECURITY.md): only what is listed here, with keys masked.

"use strict";

const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { newestEvidenceFile } = require("../lib/evidence");
const { redact } = require("../lib/analyzers");

const ROOT = path.join(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "sentinel.config.json"), "utf8"));
const [id, outArg] = process.argv.slice(2);
if (!id || !outArg) {
  console.error("Usage: node scripts/collect-evidence.js <variant-id> <outDir>");
  process.exit(2);
}
const out = path.resolve(outArg);
fs.mkdirSync(path.join(out, "screenshots"), { recursive: true });

const reportJson = path.join(ROOT, ".sentinel", "report.json");
for (const f of ["report.md", "report.json"]) {
  const src = path.join(ROOT, ".sentinel", f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(out, f));
}
const judged = path.join(ROOT, ".mutants", `result-${id}.json`);
if (fs.existsSync(judged)) fs.copyFileSync(judged, path.join(out, `result-${id}.json`));
if (!fs.existsSync(reportJson)) {
  console.log("No report to collect from.");
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(reportJson, "utf8")).results || [];
const steps = [];
const seen = new Set();
const IMG = /\.(png|jpe?g|webp)$/i;

for (const r of results) {
  steps.push(`## ${r.id}: ${r.status}`);
  if (r.summary) steps.push(`Summary: ${r.summary}`);
  for (const s of r.steps || []) steps.push(`- [${s.status}] ${s.step || ""}${s.remark ? `  ->  ${s.remark}` : ""}`);
  for (const f of r.findings || []) steps.push(`- finding: ${f}`);
  steps.push("");

  // Assert runs record a session folder; network checks record the evidence file they read.
  const dir = r.sessionDir || "";
  const file = dir.endsWith(".evidence") ? dir : newestEvidenceFile(dir);
  if (!file || !fs.existsSync(file) || seen.has(file)) continue;
  seen.add(file);

  const zip = new AdmZip(file);
  const entries = zip.getEntries().map((e) => e.entryName.replace(/\\/g, "/"));
  fs.writeFileSync(path.join(out, `evidence-contents-${r.id}.txt`), entries.join("\n") + "\n");

  // Screenshots: Kane takes one per step; keep them all, in step order, named after the check.
  const images = zip.getEntries().filter((e) => IMG.test(e.entryName)).sort((a, b) => a.entryName.localeCompare(b.entryName, "en", { numeric: true }));
  images.forEach((e, i) => {
    const ext = path.extname(e.entryName).toLowerCase();
    fs.writeFileSync(path.join(out, "screenshots", `${r.id}-${String(i + 1).padStart(2, "0")}${ext}`), e.getData());
  });

  // Network requests Kane recorded, masked.
  const lines = [];
  for (const e of zip.getEntries()) {
    if (!/-network\.har$/.test(e.entryName)) continue;
    try {
      for (const x of JSON.parse(e.getData().toString("utf8")).log.entries || []) {
        lines.push(`${x.request && x.request.method} ${x.response ? x.response.status : 0} ${x.request && x.request.url}`);
      }
    } catch {
      /* skip unreadable log */
    }
  }
  if (lines.length) fs.writeFileSync(path.join(out, `network-${r.id}.txt`), redact(lines.join("\n"), config) + "\n");
}

fs.writeFileSync(path.join(out, "kane-steps.md"), redact(`# ${id}: what Kane did and saw\n\n${steps.join("\n")}\n`, config));
console.log(`Collected ${id} into ${out}: ${seen.size} evidence pack(s), ${fs.readdirSync(path.join(out, "screenshots")).length} screenshot(s).`);
