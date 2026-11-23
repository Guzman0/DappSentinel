--- https://github.com/Guzman0/DappSentinel/pull/10#issuecomment-7081463817 (2026-11-22T15:38:50Z)
🛑 **DappSentinel: a person needs to look at this.** Kane's checks failed, but Claude Code made no change to the site. Either fixing it needs a decision only a person may make, or the failure comes from the check run itself.

**Claude Code's reasoning:**

I made no changes. Both failing checks come from the TradingView ticker, which is the purpose of this pull request, so a person needs to decide.

- **`unknown-scripts` (critical):** The ticker loads `s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js`. That script then pulls 20 more scripts from `www.tradingview-widget.com`. The only ways to pass are to remove the widget or to add TradingView's hosts to the trusted list in `sentinel.config.json`. Removing it undoes the PR. The config is protected, and trusting a new script host is a decision only a person may make. Third-party scripts on a dApp page can read and change what the user signs. A person should decide whether TradingView is acceptable, and if so add `s3.tradingview.com` and `www.tradingview-widget.com` to the trusted hosts. The alternative is self-hosting or replacing the ticker with a first-party price feed.
- **`testnet-rpc` (critical):** The widget makes a request to `widget-sheriff.tradingview-widget.com/sheriff/api/v1/rules/search?origin=http://localhost:4173`. The check matched "localhost" because the widget puts the page's own origin in that URL, so it appears to be a false positive caused by the test environment. It is not a testnet endpoint, and my code didn't make that request. It would probably go away if the widget were removed, but removing the widget is the thing I shouldn't do. The same person can decide whether to adjust the check's rules.

The other five checks pass, including the swap flow.

**Checks still failing:**

- No testnet, staging or local endpoints in a mainnet build (critical)
- Scripts only load from trusted hosts (critical)

[Latest gate run and report](https://github.com/Guzman0/DappSentinel/actions/runs/45038933982)
 · [Watch Kane's run, step by step](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81YDV00PNQJF879YC0MG1HM/dashboard/share/US_00T8HYDFEHH2ARG81H3PNYXFQFJ1ZRHG6D602XQRY9S1Q71P0RKBEK6VNV95SMD2?type=summary&agentView=true&fqdn=summary-page)

No more automatic fixes will be made on this pull request. Fix the site by hand and push; Kane checks every push.


