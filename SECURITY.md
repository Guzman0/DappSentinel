# Security and data handling

DappSentinel looks for secrets in websites, so it has to be careful with what it finds. This page says what it collects, what it keeps, and what it hides.

## What it collects during a check

- **Kane's evidence pack.** Kane CLI records the network traffic of the pages it visits (a HAR file) and its console logs. These are full, raw recordings: if a site leaks a key, the key is in them.
- **Browser storage.** The Chrome that Kane drives is read over the Chrome DevTools Protocol for localStorage and sessionStorage.
- **Kane's run results.** Pass or fail, Kane's summary and the values Kane read off the page (a contract address, a chain ID).

All of this stays on the machine that ran the check: your computer, or the GitHub Actions runner, which is deleted when the job ends.

## What it keeps

Only `.sentinel/report.md` and `.sentinel/report.json`.

- **Every finding is masked.** A key is shown as its first 4 and last 3 characters (`aX7k…GuE`), enough to recognise it and not enough to use it.
- **The whole report is redacted again before it is written.** Any URL carrying a provider key, any `key=`, `token=` or `secret=` parameter and any 32-byte hex value (the shape of a private key) is masked, wherever it appears, including in Kane's own summaries. See `redact()` in `lib/analyzers.js` and its tests in `test/analyzers.test.js`.

## What it uploads in CI

- **By default, only the redacted report**: to the run summary and as the `dappsentinel-report` artifact.
- **Kane's raw evidence is never uploaded unless you opt in**: set the repository variable `DAPPSENTINEL_KEEP_EVIDENCE=true` (in this repo's workflow) or `keep-evidence: true` (in the action). It is then kept for 3 days only. **Leave it off in public repositories**: artifacts of public repos can be downloaded by any signed-in GitHub user.
- **Secrets stay in GitHub secrets.** `LT_USERNAME`, `LT_ACCESS_KEY`, `CLAUDE_CODE_OAUTH_TOKEN` and `DAPPSENTINEL_PUSH_TOKEN` are passed to the steps that need them and are masked in logs by GitHub.

## What it sends where

- Kane CLI runs the browser through your TestMu AI account, under TestMu AI's terms.
- The CI auto-fix sends the redacted report and the files in `demo-dapp/` to Claude Code, under your Claude account.
- Nothing is sent to the site beyond what a normal visitor's browser sends.

## Scope and rate

- **Only check sites you're allowed to test**: your own, your staging deploys, or public pages loaded as an ordinary visitor would.
- A check is one browser session per Kane run (4 runs for the demo, 2 for the live profile), each visiting the site like a single user. There is no crawling, fuzzing or load. Don't run it in a loop against someone else's site.
- Findings on other people's sites are prompts to look, not accusations: many dApps ship RPC keys that only work from their own domain. If you find a real leak, tell the team privately before posting about it.

## Earlier runs

Before this policy, CI runs in this repo uploaded Kane's raw evidence. Those artifacts have been deleted. The demo's keys are fake, and the only real key in them (CoW Swap's Alchemy key) is public in CoW Swap's own website.

## Reporting a problem

Open an issue without including a secret, or contact the maintainer on X: @the_first_guz.
