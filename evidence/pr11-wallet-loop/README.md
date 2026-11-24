# PR #11: a transaction that doesn't match the screen, fixed with no human

[PR #11](https://github.com/Guzman0/DappSentinel/pull/11) publishes the fixed demo site, but the swap's transaction goes to an unknown address (`0x9F2c…2f4A`) instead of the swap router. The confirmation screen still shows the right amount, so the page looks fine. It's a test pull request, like #8 and #9, opened on 24 Nov 2026 to check the closed loop with the "what you see is what you sign" check ([how it works](../../README.md#what-you-see-is-what-you-sign)). Nobody touched it after opening it, and it won't be merged.

| Step | What happened | Kept here | Public source |
|---|---|---|---|
| 1 | Kane used the swap and passed the screen. The test wallet recorded the transaction, and DappSentinel failed it: "The site asks the wallet to send 0.5 ETH to 0x9f2c…2f4a, which is not one of your trusted contracts." 1 of 7 failed | [`1-kane-fails-1-of-7.txt`](1-kane-fails-1-of-7.txt) | [gate run](https://github.com/Guzman0/DappSentinel/actions/runs/45381084717) |
| 2 | Claude Code got the report and changed one line in `demo-dapp/`: the transaction goes to the trusted `SWAP_ROUTER` again. It explained the cause on the pull request and said no decision was left for a person | [`2-claude-fix.patch`](2-claude-fix.patch), [`2-claude-explains.md`](2-claude-explains.md) | [fix commit](https://github.com/Guzman0/DappSentinel/commit/af8c5c6406078570fc5dec207a09953c8b00cc74), [PR comment](https://github.com/Guzman0/DappSentinel/pull/11#issuecomment-7129804166) |
| 3 | The fix started the pull request's own gate. Kane passed the screen, and the wallet check passed the transaction: "The site asked the wallet to sign 1 transaction, and each one matches what Kane saw." 7 of 7 | [`3-kane-passes-7-of-7.txt`](3-kane-passes-7-of-7.txt) | [gate run](https://github.com/Guzman0/DappSentinel/actions/runs/45382098297) |

The `.txt` files are the gate's own output from the GitHub Actions logs, with only the timestamps removed.
