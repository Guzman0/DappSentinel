# The mistakes planted in the demo dApp

SentinelSwap (`demo-dapp/`) ships with six real-world frontend mistakes so the first run of
DappSentinel has something to catch. Each one has caused real incidents on live dApps.

| # | Mistake | Where | Caught by |
|---|---|---|---|
| 1 | An Alchemy-style RPC URL with an API key in it | `app.js`, `blockRpc` | `rpc-key-leak` |
| 2 | A Sepolia testnet RPC in a mainnet build | `app.js`, `gasRpc` | `testnet-rpc` |
| 3 | The USDC contract address with its last character wrong | `app.js`, `usdcAddress` | `contract-address` |
| 4 | Chain ID 11155111 (Sepolia) instead of 1 | `app.js`, `chainId` | `chain-id` |
| 5 | A "date helper" script loaded from a third-party CDN | `index.html`, unpkg script tag | `unknown-scripts` |
| 6 | A private key saved to localStorage as a "session" | `app.js`, `restoreSession()` | `storage-secrets` |

**Both secrets are fake on purpose.** The Alchemy key in mistake 1 was made up for this demo, and the private
key in mistake 6 is the public Hardhat test key (account #0). Neither controls anything real, so there is
nothing to rotate. In a real project, a key found by `rpc-key-leak` should be treated as leaked and rotated.

To put the mistakes back after Claude has fixed them, run `npm run demo:reset`.
