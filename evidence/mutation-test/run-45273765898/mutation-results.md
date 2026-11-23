# DappSentinel mutation test (known-answer)

**6 of 11 variants judged correctly.** The clean site must pass every check; each mutant has one new mistake and must fail exactly that check.

| Variant | Planted mistake | Should fail | Kane failed | Verdict |
|---|---|---|---|---|
| `clean` | None: the fixed site | nothing | nothing | ✅ correct |
| `m1-infura-key` | An Infura RPC URL with an API key in it (the demo uses Alchemy) | rpc-key-leak | rpc-key-leak | ✅ correct |
| `m2-holesky-rpc` | A Holesky testnet RPC in the mainnet build (the demo uses Sepolia) | testnet-rpc | nothing | ❌ did not run |
| `m3-swapped-digits` | Two characters swapped in the middle of the USDC address (the demo changes the last one) | contract-address | nothing | ❌ did not run |
| `m4-polygon-chain` | Chain ID 137 (Polygon) under an Ethereum label (the demo uses Sepolia's 11155111) | chain-id | nothing | ❌ did not run |
| `m5-jsdelivr-script` | A script loaded from the jsDelivr CDN (the demo uses unpkg) | unknown-scripts | nothing | ❌ did not run |
| `m6-seed-in-session` | A seed phrase saved in sessionStorage under a harmless-looking name (the demo puts a private key in localStorage) | storage-secrets | nothing | ❌ did not run |
| `m7-wrong-confirm-amount` | The confirmation screen shows a tenth of the amount the user typed (a decimals bug) | swap-flow | swap-flow | ✅ correct |
| `m8-wrong-recipient` | The swap is sent to an unknown address instead of the swap router; the screen still looks right | swap-flow | swap-flow | ✅ correct |
| `m9-hidden-amount` | The confirmation shows 0.5 ETH, but the transaction sends ten times that | swap-flow | swap-flow | ✅ correct |
| `m10-unlimited-approval` | Before the swap, the site asks the wallet to let an unknown address spend all of the user's USDC (a classic drainer) | swap-flow | swap-flow | ✅ correct |
