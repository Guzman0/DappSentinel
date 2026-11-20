// Run with: npm test
"use strict";
const assert = require("assert");
const path = require("path");
const a = require("../lib/analyzers");
const cfg = require("../sentinel.config.json");

// A network log (HAR) recorded by Kane CLI loading the demo dApp.
const har = JSON.parse(require("fs").readFileSync(path.join(__dirname, "fixtures", "demo-network.har"), "utf8"));
const entries = a.harEntries(har);
const site = "localhost:4173";

const key = a.rpcKeyLeak(entries, cfg);
assert.strictEqual(key.status, "failed");
assert.ok(key.findings[0].includes("eth-mainnet.g.alchemy.com/v2/aX7k…GuE"), key.findings[0]);
assert.ok(!key.findings[0].includes("aX7kP2qR9vLm4TnW8yZc3BdF6hJs1GuE"), "key must be masked");

const net = a.testnetRpc(entries, cfg, site);
assert.strictEqual(net.status, "failed");
assert.ok(net.findings[0].includes("ethereum-sepolia-rpc.publicnode.com"));

const scripts = a.unknownScripts(entries, cfg, site);
assert.strictEqual(scripts.status, "failed");
assert.strictEqual(scripts.findings.length, 1);
assert.ok(scripts.findings[0].includes("unpkg.com"));

// A fixed build: own scripts only, keyless mainnet RPC.
const clean = a.harEntries({
  log: {
    entries: [
      { request: { method: "GET", url: "http://localhost:4173/app.js" }, response: { status: 200, content: { mimeType: "text/javascript" } } },
      { request: { method: "POST", url: "https://ethereum-rpc.publicnode.com/" }, response: { status: 200, content: { mimeType: "application/json" } } },
    ],
  },
});
assert.strictEqual(a.rpcKeyLeak(clean, cfg).status, "passed");
assert.strictEqual(a.testnetRpc(clean, cfg, site).status, "passed");
assert.strictEqual(a.unknownScripts(clean, cfg, site).status, "passed");

// Storage, in the shape Kane returns stored values (run_end context.memory).
const pk = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const bad = a.storageSecrets({ local_storage: { extracted_value: `{"session":"{\\"address\\":\\"0xf39F\\",\\"wallet_pk\\":\\"${pk}\\"}","wallet_pk":"${pk}"}` } }, cfg);
assert.strictEqual(bad.status, "failed");
assert.ok(bad.findings.some((f) => f.includes("wallet_pk")));
assert.ok(bad.findings.every((f) => !f.includes(pk)), "private key must be masked");

const seed = a.storageSecrets({ local_storage: { extracted_value: "backup: test test test test test test test test test test test junk" } }, cfg);
assert.strictEqual(seed.status, "failed");

const ok = a.storageSecrets({ local_storage: { extracted_value: '{"session":"{\\"address\\":\\"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266\\"}"}' } }, cfg);
assert.strictEqual(ok.status, "passed", JSON.stringify(ok));

assert.strictEqual(a.storageSecrets({}, cfg).status, "error");

console.log("✅ analyzer tests passed");

// Storage seen live in the browser Kane drove (lib/browser-watch.js).
const snapBad = a.storageSnapshot({ pages: 3, local: { wallet_pk: pk, session: JSON.stringify({ address: "0xf39F", wallet_pk: pk }) }, session: {} }, cfg);
assert.strictEqual(snapBad.status, "failed", JSON.stringify(snapBad));
assert.ok(snapBad.findings.some((f) => f.includes("wallet_pk")));
assert.ok(snapBad.findings.every((f) => !f.includes(pk)));
const snapOk = a.storageSnapshot({ pages: 3, local: { session: JSON.stringify({ address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" }) }, session: {} }, cfg);
assert.strictEqual(snapOk.status, "passed", JSON.stringify(snapOk));
assert.strictEqual(a.storageSnapshot({ pages: 0, local: {}, session: {} }, cfg).status, "error");
console.log("✅ storage snapshot tests passed");

// Real dApps store hashes (order IDs, tx hashes) and long text: those are not secrets.
const hashes = a.storageSnapshot({ pages: 1, local: { orders: JSON.stringify({ id: "0x" + "ab".repeat(32), txHash: "0x" + "cd".repeat(32) }), note: "this is a long sentence of plain words that people write in apps all day long" }, session: {} }, cfg);
assert.strictEqual(hashes.status, "passed", JSON.stringify(hashes));
const named = a.storageSnapshot({ pages: 1, local: { wallet: JSON.stringify({ signerKey: "0x" + "ef".repeat(32) }) }, session: {} }, cfg);
assert.strictEqual(named.status, "failed", JSON.stringify(named));
const seedOnly = a.storageSnapshot({ pages: 1, local: { backup: "test test test test test test test test test test test junk" }, session: {} }, cfg);
assert.strictEqual(seedOnly.status, "failed");
console.log("✅ real-site storage tests passed");
