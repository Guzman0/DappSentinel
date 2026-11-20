// Deterministic checks over what Kane CLI recorded in a real browser:
// its network log (HAR) and the values it stored from the page.

"use strict";

function hostOf(u) {
  try {
    if (/^blob:/i.test(u)) u = u.slice(5); // blob:https://site/… is made by the page itself
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

// "self" means the site's own domain, including its other subdomains: stake.lido.fi trusts
// matomo.lido.fi, but not lido-analytics.com. Local addresses and IPs stay exact.
function ownDomain(siteHost) {
  const h = siteHost.split(":")[0].toLowerCase();
  if (h === "localhost" || /^[\d.]+$/.test(h) || h.includes("[")) return siteHost.toLowerCase();
  const parts = h.split(".");
  const twoPart = /^(co|com|org|net|gov|ac|edu)$/.test(parts[parts.length - 2] || "") && parts.length > 2;
  return parts.slice(twoPart ? -3 : -2).join(".");
}

function unknownScripts(entries, cfg, siteHost) {
  const allowed = (cfg.allowedScriptHosts || ["self"]).map((h) => (h === "self" ? ownDomain(siteHost) : h).toLowerCase());
  const scripts = entries.filter((e) => isScript(e) && !/^data:/i.test(e.url));
  const byHost = new Map();
  for (const e of scripts) {
    const host = hostOf(e.url);
    if (allowed.some((a) => host === a || hostMatches(host, a))) continue;
    if (!byHost.has(host)) byHost.set(host, new Set());
    byHost.get(host).add(e.url);
  }
  const hits = [...byHost].map(([host, urls]) => {
    const first = [...urls][0];
    return urls.size > 1 ? `${host}: ${urls.size} scripts, e.g. ${first}` : `${first}  (from ${host})`;
  });
  const n = [...byHost.values()].reduce((a, u) => a + u.size, 0);
  return hits.length
    ? { status: "failed", summary: `Kane's network recording shows ${n} script${n > 1 ? "s" : ""} loaded from ${hits.length} untrusted host${hits.length > 1 ? "s" : ""}.`, findings: hits }
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
  const hits = findSecrets(typeof raw === "string" ? raw : JSON.stringify(raw), cfg);
  return hits.length
    ? { status: "failed", summary: `Kane read localStorage and found ${hits.length} secret${hits.length > 1 ? "s" : ""} stored in the browser.`, findings: hits }
    : { status: "passed", summary: "Kane read localStorage and found no private keys or seed phrases.", findings: [] };
}

// `seen` comes from lib/browser-watch.js: storage observed live in the browser Kane drove.
// Each item is checked on its own, so a finding can say where the secret sits. A 32-byte hex
// value is only a private key when its name says so: on its own it is usually a hash
// (an order ID, a transaction hash), which dApps store all the time.
const KEYISH = /(priv|secret|mnemonic|seed|signer|^pk$|_pk$|^pk_)/i;
const SEED_ONLY = /^(?:[a-z]{3,8}\s+){11}(?:(?:[a-z]{3,8}\s+){3}){0,4}[a-z]{3,8}$/;

function scanStored(where, name, value, cfg, hits) {
  const names = (cfg.secretKeyNames || []).map((n) => n.toLowerCase());
  let parsed = value;
  if (typeof value === "string" && /^\s*[{[]/.test(value)) {
    try { parsed = JSON.parse(value); } catch { parsed = value; }
  }
  const walk = (v, path, leaf) => {
    if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`, k);
      return;
    }
    const str = v === null || v === undefined ? "" : String(v);
    const keyNamed = leaf && names.includes(String(leaf).toLowerCase());
    const hex = str.match(/^0x[a-fA-F0-9]{64}$/);
    if (keyNamed && str) hits.push(`${path} is named like a secret and holds ${mask(str)}`);
    else if (hex && leaf && KEYISH.test(String(leaf))) hits.push(`${path} holds a value that looks like a private key: ${mask(str)}`);
    else if (typeof v === "string" && SEED_ONLY.test(str.trim())) hits.push(`${path} holds a value that looks like a seed phrase`);
  };
  walk(parsed, `${where}["${name}"]`, name);
}

function storageSnapshot(seen, cfg) {
  if (!seen || !seen.pages) {
    return { status: "error", summary: "The site never loaded in the browser Kane was driving, so storage could not be checked.", findings: [] };
  }
  const items = Object.keys(seen.local || {}).length + Object.keys(seen.session || {}).length;
  const hits = [];
  for (const [k, v] of Object.entries(seen.local || {})) scanStored("localStorage", k, v, cfg, hits);
  for (const [k, v] of Object.entries(seen.session || {})) scanStored("sessionStorage", k, v, cfg, hits);
  const uniq = [...new Set(hits)];
  return uniq.length
    ? { status: "failed", summary: `While Kane used the page, the site saved ${items} item${items === 1 ? "" : "s"} in browser storage, including ${uniq.length} secret${uniq.length > 1 ? "s" : ""} any script on the page could read.`, findings: uniq }
    : { status: "passed", summary: `While Kane used the page, the site saved ${items} item${items === 1 ? "" : "s"} in browser storage and none is a private key or seed phrase.`, findings: [] };
}

// Used on Kane's own localStorage reading (one string).
function findSecrets(text, cfg) {
  const hits = [];
  for (const name of cfg.secretKeyNames || []) {
    const re = new RegExp(`["'\\s{,]${name.replace(/[^\w]/g, "\\$&")}["'\\s\\\\]*[:=]`, "i");
    if (re.test(" " + text)) hits.push(`key named "${name}"`);
  }
  for (const m of text.match(HEX_KEY) || []) hits.push(`value that looks like a private key: ${mask(m)}`);
  if (SEED.test(text)) hits.push("value that looks like a seed phrase");
  return [...new Set(hits)];
}

const NETWORK = { "rpc-key-leak": rpcKeyLeak, "testnet-rpc": testnetRpc, "unknown-scripts": unknownScripts };

module.exports = { harEntries, rpcKeyLeak, testnetRpc, unknownScripts, storageSecrets, storageSnapshot, NETWORK, mask };
