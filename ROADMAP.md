# What's next for DappSentinel

Everything we'd like DappSentinel to do after the hackathon. The [README](README.md#whats-next) highlights the first few; this is the full list.

## Catch more attacks

- **The test wallet as your own address.** Today the test wallet uses a generic test account. Letting a team set it to their own wallet or multisig address means code that only wakes up for one target, as in the Bybit attack, would show itself during the check.
- **Scheduled checks on the live site.** BadgerDAO, Ledger Connect Kit and Bybit all hit live sites after launch. Running the same check hourly or nightly against production turns the pre-launch gate into an alarm.
- **A tamper tripwire for scripts.** Save a fingerprint of every script on a known-good day and flag any script whose code changes later, even from a trusted host. That is the Ledger Connect Kit pattern: a trusted source serving changed code.
- **Signature requests.** Check `permit` and other typed-data signatures, not only transactions; many drainers now ask for a signature instead of an approval.
- **Look-alike wallet pop-ups.** Flag connect dialogs and domains that imitate known wallets.
- **More flows than swaps.** Staking, bridging, lending and NFT mints, each with its own "what you see is what you sign" check.

## Use more of Kane CLI

- **Kane's verdict policies** (`kane-cli evidence verdict --policy`), so Kane's own policy engine makes the final pass or fail from DappSentinel's findings.
- **Locked regression tests** (`kane-cli testmd run --no-adaptive-heal`): once a flow passes, freeze it, so a later change can't be healed away silently.
- **Kane's bug-confirmation mode** (`--bug-detection continue`), to separate real product bugs from test problems before Claude starts fixing.

## Reach more teams

- **More chains.** Solana, and EVM networks beyond Ethereum such as Base, Arbitrum and Polygon, each with its own RPC, explorer and wallet checks.
- **Ready-made setups for common dApp kits**, such as wagmi, RainbowKit and Web3Modal, so a team is checking its site in minutes.
- **More coding agents.** Cursor and Codex hooks, alongside Claude Code.
- **Easier installs.** Publish on npm and the GitHub Marketplace.

## Make results easier to use

- **Alerts** in Slack, Discord or email when a live check fails.
- **A shareable safety report per release**: a page a team can link to, showing users what was checked and when.
