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

// "self" covers the site's own domain, not look-alikes.
const own = a.harEntries({ log: { entries: [
  { request: { method: "GET", url: "https://matomo.lido.fi/matomo.js" }, response: { status: 200, content: { mimeType: "text/javascript" } } },
  { request: { method: "GET", url: "https://lido.fi.evil.com/x.js" }, response: { status: 200, content: { mimeType: "text/javascript" } } },
] } });
const ownRes = a.unknownScripts(own, cfg, "stake.lido.fi");
assert.strictEqual(ownRes.findings.length, 1, JSON.stringify(ownRes));
assert.ok(ownRes.findings[0].includes("evil.com"));
console.log("✅ own-domain script tests passed");

// Scripts the page makes itself (blob:, data:) are not from another host.
const blobs = a.harEntries({ log: { entries: [
  { request: { method: "GET", url: "blob:https://stake.lido.fi/53ebc042" }, response: { status: 200, content: { mimeType: "text/javascript" } } },
  { request: { method: "GET", url: "data:text/javascript;base64,AAAA" }, response: { status: 200, content: { mimeType: "text/javascript" } } },
] } });
assert.strictEqual(a.unknownScripts(blobs, cfg, "stake.lido.fi").status, "passed");
console.log("✅ blob/data script tests passed");

// Nothing secret reaches a report file.
const leaky = 'Kane saw https://eth-mainnet.g.alchemy.com/v2/aX7kP2qR9vLm4TnW8yZc3BdF6hJs1GuE and wallet_pk 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 and https://x.io/rpc?apikey=ABCDEFGHIJKLMNOPQRST';
const scrubbed = a.redact(leaky, cfg);
assert.ok(!scrubbed.includes("aX7kP2qR9vLm4TnW8yZc3BdF6hJs1GuE"), scrubbed);
assert.ok(!scrubbed.includes("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"), scrubbed);
assert.ok(!scrubbed.includes("ABCDEFGHIJKLMNOPQRST"), scrubbed);
assert.ok(scrubbed.includes("aX7k…GuE"), scrubbed);
console.log("✅ redaction tests passed");

// The exact check behind Kane's verdict. The first case is the real one: on Kane CLI 0.10.8,
// Kane stored "You pay 0.05 ETH" and still passed "the confirmation shows You pay 0.5 ETH"
// (mutation test run 45050499048, m7-wrong-confirm-amount).
assert.strictEqual(a.valueMatches("You pay 0.05 ETH", "0.5"), false);
assert.strictEqual(a.valueMatches("You pay 0.5 ETH", "0.5"), true);
assert.strictEqual(a.valueMatches("0.50", "0.5"), true);
assert.strictEqual(a.valueMatches("5 ETH", "0.5"), false);
assert.strictEqual(a.valueMatches("1,570.28 USDC", "1570.28"), true);
assert.strictEqual(a.valueMatches(undefined, "0.5"), null);
assert.strictEqual(a.valueMatches("", "0.5"), null);
assert.strictEqual(a.valueMatches("Ethereum mainnet", "ethereum"), true);
console.log("✅ exact value tests passed");

// Kane's own triage, read from real failure.yaml files Kane wrote in mutation test run 45174082470.
{
  const { yamlField } = require("../lib/evidence");
  const fs = require("fs");
  const m3 = fs.readFileSync(path.join(__dirname, "fixtures", "kane-failure-m3.yaml"), "utf8");
  const m7 = fs.readFileSync(path.join(__dirname, "fixtures", "kane-failure-m7.yaml"), "utf8");
  const tri = (t) => t.slice(t.indexOf("triage:"));
  assert.strictEqual(yamlField(m3, "title"), "USDC address assertion uses unresolved placeholder");
  assert.strictEqual(yamlField(tri(m3), "category"), "automation_bug/config_issue");
  assert.strictEqual(yamlField(tri(m7), "category"), "application_issue/ui_data_defect");
  assert.ok(yamlField(tri(m7), "root_cause").startsWith("The confirmation screen is displaying the payment amount"));
  assert.strictEqual(Number(yamlField(tri(m7), "confidence")), 0.99);
  console.log("✅ Kane triage tests passed");
}

// What you see is what you sign: the transactions the site asks DappSentinel's test wallet to sign.
{
  const ROUTER = cfg.trustedContracts.SwapRouter;
  const ATTACKER = "0x9F2c4b7A1e3D5f8C0a6B2d4E7f1A3c5B8d0E2f4A";
  const half = "0x" + (5n * 10n ** 17n).toString(16);
  const send = (tx) => ({ method: "eth_sendTransaction", params: [tx] });
  const accounts = { method: "eth_requestAccounts", params: [] };

  const ok = a.walletMatch([accounts, send({ to: ROUTER, value: half, data: "0x" })], { seenAmount: "0.5 ETH", expectTransaction: true }, cfg);
  assert.strictEqual(ok.status, "passed", ok.summary);

  const recipient = a.walletMatch([send({ to: ATTACKER, value: half })], { seenAmount: "0.5", expectTransaction: true }, cfg);
  assert.strictEqual(recipient.status, "failed");
  assert.ok(recipient.findings[0].includes(ATTACKER.toLowerCase()) && recipient.findings[0].includes("not one of your trusted contracts"), recipient.findings[0]);

  const amount = a.walletMatch([send({ to: ROUTER, value: "0x" + (5n * 10n ** 18n).toString(16) })], { seenAmount: "You pay 0.5 ETH", expectTransaction: true }, cfg);
  assert.strictEqual(amount.status, "failed");
  assert.ok(amount.findings[0].includes("0.5") && amount.findings[0].includes("5 ETH"), amount.findings[0]);

  const approval = a.walletMatch(
    [send({ to: cfg.contracts.USDC, data: "0x095ea7b3" + ATTACKER.slice(2).toLowerCase().padStart(64, "0") + "f".repeat(64) }), send({ to: ROUTER, value: half })],
    { seenAmount: "0.5", expectTransaction: true },
    cfg
  );
  assert.strictEqual(approval.status, "failed");
  assert.ok(approval.findings[0].includes("spend all of the token at USDC"), approval.findings[0]);

  // Approving a trusted router for an exact amount is normal.
  const fine = a.walletMatch([send({ to: cfg.contracts.USDC, data: "0x095ea7b3" + ROUTER.slice(2).toLowerCase().padStart(64, "0") + (10n ** 6n).toString(16).padStart(64, "0") })], {}, cfg);
  assert.strictEqual(fine.status, "passed", fine.summary);

  assert.strictEqual(a.walletMatch([], { expectTransaction: true }, cfg).status, "error");
  assert.strictEqual(a.walletMatch([], {}, cfg).status, "passed");
  console.log("✅ wallet (what you see is what you sign) tests passed");
}
