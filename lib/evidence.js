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

module.exports = { readEvidence, newestEvidenceFile };
