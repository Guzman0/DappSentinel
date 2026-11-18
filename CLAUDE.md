# DappSentinel

A pre-launch safety gate for dApp frontends. Kane CLI checks the site in a real browser for
crypto-specific mistakes that you can't see on screen: leaked RPC keys, testnet endpoints,
wrong contract addresses, wrong chain IDs, untrusted scripts and private keys in storage.

## Layout
- `demo-dapp/`: the site being guarded (SentinelSwap, a simulated ETH to USDC swap page).
- `checks/`: one check per file. `kind: assert` and `kind: storage` are Kane runs; `kind: network` scans the traffic Kane recorded during the `recording` run.
- `sentinel.config.json`: what "correct" means: chain ID, contract addresses, trusted script hosts.
- `lib/analyzers.js`, `lib/evidence.js`: read the network log (HAR) and storage Kane recorded, and check them.
- `bin/dappsentinel.js`: the gate. `npm run sentinel` runs every check and writes `.sentinel/report.md`.
- `hooks/sentinel-stop.js`: the Claude Code Stop hook that closes the loop.

## The loop
When you change files in the site folder and finish your turn, the Stop hook runs the gate.
If Kane catches anything, the hook blocks and gives you the failures. Read `.sentinel/report.md`,
fix the site, and finish your turn again to re-verify. You can also run `/sentinel` at any time.

## Rules
- Never edit `checks/` or `sentinel.config.json` to make a failing check pass. Fix the app.
- Keep the swap flow working (`checks/07-swap-flow.md`).
- The site is plain HTML, CSS and JavaScript with no build step. Keep it that way.
- Commit messages: no AI co-author trailers.
