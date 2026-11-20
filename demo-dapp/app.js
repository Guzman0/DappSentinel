// SentinelSwap: a small demo swap page (ETH -> USDC) for DappSentinel.
// The quote and the swap are simulated; no wallet or real transaction is involved.

const CONFIG = {
  networkName: "Ethereum",
  chainId: 1,
  blockRpc: "https://ethereum-rpc.publicnode.com",
  gasRpc: "https://ethereum-rpc.publicnode.com",
  usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  ethUsdcRate: 3150,
  feeRate: 0.003,
};

const $ = (id) => document.getElementById(id);

function formatUsdc(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- Network info ----
$("network-name").textContent = CONFIG.networkName;
$("chain-id").textContent = String(CONFIG.chainId);
$("usdc-contract").textContent = CONFIG.usdcAddress;

async function rpc(url, method) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: [] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function loadNetworkInfo() {
  try {
    const block = await rpc(CONFIG.blockRpc, "eth_blockNumber");
    $("block").textContent = parseInt(block, 16).toLocaleString("en-US");
  } catch {
    $("block").textContent = "unavailable";
  }
  try {
    const gas = await rpc(CONFIG.gasRpc, "eth_gasPrice");
    $("gas").textContent = (parseInt(gas, 16) / 1e9).toFixed(2) + " gwei";
  } catch {
    $("gas").textContent = "unavailable";
  }
}

// ---- Session ----
function restoreSession() {
  let session = JSON.parse(localStorage.getItem("session") || "null");
  if (!session) {
    session = {
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      createdAt: Date.now(),
    };
    localStorage.setItem("session", JSON.stringify(session));
  }
  // Never keep private keys in storage; scrub anything left by older versions.
  if ("wallet_pk" in session) {
    delete session.wallet_pk;
    localStorage.setItem("session", JSON.stringify(session));
  }
  localStorage.removeItem("wallet_pk");
  const when = new Date(session.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  $("session").textContent = `Demo wallet ${session.address.slice(0, 6)}…${session.address.slice(-4)} · since ${when}`;
}

// ---- Swap flow ----
let quote = null;

function updateQuote() {
  const raw = $("pay-amount").value.trim();
  const amount = Number(raw);
  const err = $("pay-error");
  err.hidden = true;

  if (raw === "" || amount === 0) {
    quote = null;
    $("receive-amount").value = "";
    $("fee").textContent = "—";
    $("review-btn").disabled = true;
    return;
  }
  if (!Number.isFinite(amount) || amount < 0) {
    quote = null;
    err.textContent = "Enter a valid amount greater than 0.";
    err.hidden = false;
    $("receive-amount").value = "";
    $("fee").textContent = "—";
    $("review-btn").disabled = true;
    return;
  }

  const gross = amount * CONFIG.ethUsdcRate;
  const fee = gross * CONFIG.feeRate;
  quote = { pay: amount, receive: gross - fee, fee };
  $("receive-amount").value = formatUsdc(quote.receive);
  $("fee").textContent = formatUsdc(fee) + " USDC";
  $("review-btn").disabled = false;
}

function show(id) {
  for (const card of ["swap-card", "confirm-card", "done-card"]) {
    $(card).hidden = card !== id;
  }
}

$("pay-amount").addEventListener("input", updateQuote);

$("review-btn").addEventListener("click", () => {
  if (!quote) return;
  $("confirm-pay").textContent = String(quote.pay);
  $("confirm-receive").textContent = formatUsdc(quote.receive);
  $("confirm-fee").textContent = formatUsdc(quote.fee);
  show("confirm-card");
});

$("back-btn").addEventListener("click", () => show("swap-card"));

$("confirm-btn").addEventListener("click", () => {
  $("done-text").textContent = `Swapped ${quote.pay} ETH for ${formatUsdc(quote.receive)} USDC.`;
  show("done-card");
});

$("again-btn").addEventListener("click", () => {
  $("pay-amount").value = "";
  updateQuote();
  show("swap-card");
});

restoreSession();
loadNetworkInfo();
