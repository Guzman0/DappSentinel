// Deterministic checks over what Kane CLI recorded in a real browser:
// its network log (HAR) and the values it stored from the page.

"use strict";

function hostOf(u) {
  try {
    return new URL(u).host.toLowerCase();
  } catch {
    return "";
  }
}

function hostMatches(host, domain) {
  const h = host.split(":")[0];
  const d = domain.toLowerCase();
  return h === d || h.endsWith("." + d);
}

// Show enough of a secret to recognise it in the report, but never the whole thing.
function mask(s) {
  if (s.length <= 10) return s.slice(0, 2) + "…";
  return `${s.slice(0, 4)}…${s.slice(-3)}`;
}

function harEntries(har) {
  return ((har && har.log && har.log.entries) || []).map((e) => ({
    method: e.request && e.request.method,
    url: (e.request && e.request.url) || "",
    status: e.response ? e.response.status : 0,
    mime: (e.response && e.response.content && e.response.content.mimeType) || "",
    type: e._resourceType || "",
  }));
}

const KEY_PARAM = /^(api[-_]?key|key|token|access[-_]?token|apikey)$/i;
const RANDOM_SEGMENT = /^[A-Za-z0-9_-]{20,}$/;

function findKeyInUrl(rawUrl, providers) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }
  for (const [name, value] of u.searchParams) {
    if (KEY_PARAM.test(name) && value.length >= 16) return value;
  }
  if (providers.some((p) => hostMatches(u.host.toLowerCase(), p))) {
    const seg = u.pathname.split("/").find((s) => RANDOM_SEGMENT.test(s) && /[0-9]/.test(s) && /[A-Za-z]/.test(s));
    if (seg) return seg;
  }
  return null;
}

function rpcKeyLeak(entries, cfg) {
  const providers = cfg.rpcKeyProviders || [];
  const hits = [];
  const seen = new Set();
  for (const e of entries) {
    const key = findKeyInUrl(e.url, providers);
    if (!key || seen.has(e.url)) continue;
    seen.add(e.url);
    hits.push(`${e.method || "GET"} ${e.url.replace(key, mask(key))}`);
  }
  return hits.length
    ? { status: "failed", summary: `Kane's network recording shows ${hits.length} request${hits.length > 1 ? "s" : ""} carrying an RPC API key in the URL.`, findings: hits }
    : { status: "passed", summary: `None of the ${entries.length} recorded requests carries an RPC API key.`, findings: [] };
}

function testnetRpc(entries, cfg, siteHost) {
  const hints = (cfg.testnetHints || []).map((h) => h.toLowerCase());
  const hits = [];
  const seen = new Set();
  for (const e of entries) {
    const host = hostOf(e.url);
    if (!host || host === siteHost.toLowerCase()) continue;
    const lower = e.url.toLowerCase();
    const hint = hints.find((h) => lower.includes(h));
    if (hint && !seen.has(e.url)) {
      seen.add(e.url);
      hits.push(`${e.method || "GET"} ${e.url}  (matches "${hint}")`);
    }
  }
  return hits.length
    ? { status: "failed", summary: `Kane's network recording shows ${hits.length} request${hits.length > 1 ? "s" : ""} to a testnet, staging or local endpoint.`, findings: hits }
    : { status: "passed", summary: `None of the ${entries.length} recorded requests goes to a testnet, staging or local endpoint.`, findings: [] };
}

function isScript(e) {
  if (e.type && e.type.toLowerCase() === "script") return true;
  if (/javascript|ecmascript/i.test(e.mime)) return true;
  try {
    return /\.m?js$/i.test(new URL(e.url).pathname);
  } catch {
    return false;
  }
}

function unknownScripts(entries, cfg, siteHost) {
  const allowed = (cfg.allowedScriptHosts || ["self"]).map((h) => (h === "self" ? siteHost : h).toLowerCase());
  const scripts = entries.filter(isScript);
  const hits = [];
  for (const e of scripts) {
    const host = hostOf(e.url);
    if (!allowed.some((a) => host === a || hostMatches(host, a))) hits.push(`${e.url}  (from ${host})`);
  }
  return hits.length
    ? { status: "failed", summary: `Kane's network recording shows ${hits.length} script${hits.length > 1 ? "s" : ""} loaded from an untrusted host.`, findings: [...new Set(hits)] }
    : { status: "passed", summary: `All ${scripts.length} scripts came from trusted hosts.`, findings: [] };
}

const HEX_KEY = /0x[a-fA-F0-9]{64}\b/g;
const SEED = /\b(?:[a-z]{3,8}\s+){11}(?:(?:[a-z]{3,8}\s+){12})?[a-z]{3,8}\b/;

// `memory` is Kane's run_end context.memory: { name: { extracted_value, ... } }.
function storageSecrets(memory, cfg) {
  const entry = memory && (memory.local_storage || memory.localStorage);
  const raw = entry && (entry.extracted_value ?? entry.value ?? entry);
  if (raw === undefined || raw === null || (typeof raw === "object" && !Object.keys(raw).length && !entry.extracted_value)) {
    return { status: "error", summary: "Kane did not return the contents of localStorage, so storage could not be checked.", findings: [] };
  }
  const text = typeof raw === "string" ? raw : JSON.stringify(raw);
  const hits = [];
  for (const name of cfg.secretKeyNames || []) {
    const re = new RegExp(`["'\\s{,]${name.replace(/[^\w]/g, "\\$&")}["'\\s]*[:=]`, "i");
    if (re.test(" " + text)) hits.push(`key named "${name}"`);
  }
  for (const m of text.match(HEX_KEY) || []) hits.push(`value that looks like a private key: ${mask(m)}`);
  if (SEED.test(text)) hits.push("value that looks like a seed phrase");
  const unique = [...new Set(hits)];
  return unique.length
    ? { status: "failed", summary: `Kane read localStorage and found ${unique.length} secret${unique.length > 1 ? "s" : ""} stored in the browser.`, findings: unique }
    : { status: "passed", summary: "Kane read localStorage and found no private keys or seed phrases.", findings: [] };
}

const NETWORK = { "rpc-key-leak": rpcKeyLeak, "testnet-rpc": testnetRpc, "unknown-scripts": unknownScripts };

module.exports = { harEntries, rpcKeyLeak, testnetRpc, unknownScripts, storageSecrets, NETWORK, mask };
