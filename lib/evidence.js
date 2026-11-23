// Reads Kane CLI's evidence pack (a zip in the run's session folder) and returns
// the network log (HAR) and console log it recorded in the browser.

"use strict";

const fs = require("fs");
const path = require("path");

function newestEvidenceFile(sessionDir) {
  if (!sessionDir) return null;
  const dir = path.join(path.normalize(sessionDir), "evidence");
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".evidence"))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return files[0] || null;
}

function readEvidence(sessionDir) {
  const file = newestEvidenceFile(sessionDir);
  if (!file) return null;
  const AdmZip = require("adm-zip");
  const zip = new AdmZip(file);
  const har = { log: { entries: [] } };
  const consoleLines = [];
  for (const e of zip.getEntries()) {
    const name = e.entryName.replace(/\\/g, "/");
    if (/\/logs\/[^/]*-network\.har$/.test(name)) {
      try {
        har.log.entries.push(...(JSON.parse(e.getData().toString("utf8")).log.entries || []));
      } catch {
        /* skip unreadable log */
      }
    } else if (/\/logs\/[^/]*-console\.ndjson$/.test(name)) {
      for (const line of e.getData().toString("utf8").split("\n")) {
        try {
          const ev = JSON.parse(line);
          if (ev.text) consoleLines.push(ev);
        } catch {
          /* skip */
        }
      }
    }
  }
  return { file, har, console: consoleLines };
}

// Kane's own triage of a failed run: each failed step in the evidence pack has a failure.yaml with
// a title, a root cause, a category (an application issue, or a fault in the test or automation),
// Kane's confidence and a suggested fix. Read only the few fields we show; no YAML library needed.
function yamlField(text, key) {
  const lines = String(text).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(new RegExp(`^(\\s*)${key}:\\s*(.*)$`));
    if (!m) continue;
    const indent = m[1].length;
    const parts = [m[2]];
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (!l.trim()) break;
      const ind = l.match(/^\s*/)[0].length;
      if (ind <= indent || /^\s*[A-Za-z_]+:(\s|$)/.test(l)) break;
      parts.push(l.trim());
    }
    let v = parts.join(" ").trim();
    if (/^['"]/.test(v)) v = v.slice(1, -1).replace(/''/g, "'");
    return v;
  }
  return "";
}

function readTriage(sessionDir) {
  const file = sessionDir && sessionDir.endsWith(".evidence") ? sessionDir : newestEvidenceFile(sessionDir);
  if (!file || !fs.existsSync(file)) return null;
  const AdmZip = require("adm-zip");
  const out = [];
  for (const e of new AdmZip(file).getEntries()) {
    const name = e.entryName.replace(/\\/g, "/");
    if (!/\/steps\/[^/]+\/failure\.yaml$/.test(name)) continue;
    const t = e.getData().toString("utf8");
    const triage = t.slice(t.indexOf("triage:"));
    out.push({
      title: yamlField(t, "title"),
      rootCause: yamlField(triage, "root_cause"),
      category: yamlField(triage, "category"),
      confidence: Number(yamlField(triage, "confidence")) || null,
      severity: yamlField(triage, "severity"),
      suggestedFix: yamlField(triage.slice(triage.indexOf("suggested_fix:")), "summary"),
    });
  }
  return out.length ? out : null;
}

module.exports = { readEvidence, newestEvidenceFile, readTriage, yamlField };

