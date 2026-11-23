# PR #5: the closed loop on GitHub, with no human

[PR #5](https://github.com/Guzman0/DappSentinel/pull/5) is a small copy change ("say how often rates update") made on top of the demo site with its six planted mistakes. Nobody touched it after opening it. This folder keeps the proof in the repo, so it doesn't depend on GitHub's logs, which expire.

| Step | What happened | Kept here | Public source |
|---|---|---|---|
| 1 | Kane checks the pull request and fails it: 6 of 7 | [`1-kane-fails-6-of-7.txt`](1-kane-fails-6-of-7.txt) | [gate run](https://github.com/Guzman0/DappSentinel/actions/runs/44819169522) |
| 2 | Claude Code gets Kane's report, with these instructions | [`2-what-claude-was-told.txt`](2-what-claude-was-told.txt) | [fix job](https://github.com/Guzman0/DappSentinel/actions/runs/44819169522/job/136577471662) |
| 3 | Claude changes the site, and only the site: 2 files in `demo-dapp/`, in 8 turns | [`3-claude-fix.patch`](3-claude-fix.patch) | [fix commit](https://github.com/Guzman0/DappSentinel/commit/0b63d8b4eb5a967ea3f869adb8334ee787dad7d9), [PR comment](https://github.com/Guzman0/DappSentinel/pull/5#issuecomment-7050958783) |
| 4 | The fix commit starts the pull request's own gate, and Kane passes it: 7 of 7 | [`4-kane-passes-7-of-7.txt`](4-kane-passes-7-of-7.txt) | [gate run](https://github.com/Guzman0/DappSentinel/actions/runs/44819910638) |

The `.txt` files are the gate's own output, copied from the GitHub Actions logs with only the timestamps removed. Every step Kane took is listed, then its verdict in its own words (the lines starting `→`).

## What Kane said

Before the fix (step 1):

- *"The page could not get mainnet information because its mainnet request was rejected by the browser. It then showed a Sepolia chain ID while still calling the network Ethereum."*
- *"While Kane used the page, the site saved 2 items in browser storage, including 2 secrets any script on the page could read."*
- The Alchemy key, the Sepolia RPC and the unpkg script, each found in Kane's network recording.

After the fix (step 4):

- *"Confirmed that the USDC contract address displayed on the page exactly matches 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48."*
- *"Confirmed that the network badge shows Ethereum with chain ID 1."*
- *"Confirmed the swap successfully; the page displayed "Swap submitted.""*

## Honest notes

- **The address check failed for the right result, with the wrong reason.** In step 1 Kane failed the contract-address check, which is correct (the demo's address has a wrong last character), but its written reason was about its own step: it hadn't saved the address it read. This is the same pattern as the mutation test's `m3` variant ([findings](../../DETAILS.md#findings-for-the-kane-cli-team)).
- **This run is from 20 Nov, before Kane's DevTools assertions were added.** Here the network and storage verdicts are DappSentinel's exact check of what Kane recorded. For runs where Kane also gives its own DevTools verdict on them, see the [mutation test](../mutation-test/).
- **Masked secrets.** The fix patch deletes the demo's fake Alchemy key and the public Hardhat test key. Both are masked here (`aX7k…GuE`, `0xac…f80`), as in every report.
- PR #5 is left open on purpose, as proof. It isn't merged.
