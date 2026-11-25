<p><img src="assets/logo-eye.svg" width="120" alt="DappSentinel logo: a sentinel eye in a hexagon"></p>

# DappSentinel

**The gate between your dApp and mainnet. Your dApp doesn't ship until Kane says it's safe.**

> [!TIP]
> **TL;DR**
> - **What:** a pre-launch gate for dApp websites. Kane CLI checks the site in a real browser for mistakes you can't see on screen: leaked RPC keys, testnet endpoints, wrong contracts, wrong chain, untrusted scripts, keys in storage.
> - **The loop:** Kane catches it → Claude Code fixes it → Kane checks again, until every check passes. The agent can't edit the checks to cheat, and after 3 rounds, or when only a person can decide, it hands over.
> - **Kane makes the call on all 7 checks**, with DevTools assertions for the hidden ones. An exact check runs behind it for what Kane's DevTools can't see ([what it checks](#what-dappsentinel-checks)).
> - **What you see is what you sign:** a harmless test wallet in the page records the transaction the site asks the user to sign. It must match what Kane read on the screen and go only to contracts you trust ([how](#what-you-see-is-what-you-sign)).
> - **Real bugs in code we didn't write:** [Polaris #118](#real-world-loop-2-a-bug-reported-on-polariss-issue-tracker) and [Spark](#real-world-loop-a-bug-in-code-we-didnt-write). Plus a [mutation test](#mutation-test-known-answer-mistakes-it-was-never-tuned-for): 8 of 8 on four runs, then 11 of 11 with three wallet mistakes added, and [11 live dApps](#real-world-runs). And a bug in Kane CLI itself, [confirmed by the Kane team](https://github.com/LambdaTest/kane-cli/issues/239#issuecomment-7098306114).
> - **Install:** `uses: Guzman0/DappSentinel@v1.3.0` or `npm i -g github:Guzman0/DappSentinel` · **Site:** [dappsentinel.netlify.app](https://dappsentinel.netlify.app) · **Video:** [3:59](https://youtu.be/FiErWhY495U) · **Every Kane run:** [session viewer](https://dappsentinel.netlify.app/dashboard/)

[![Watch the DappSentinel demo video (3:59)](assets/video-thumb.jpg)](https://youtu.be/FiErWhY495U)

*Click to watch on YouTube (3:59).*

## See it work

On your machine, with [Node.js 20+](https://nodejs.org), Chrome and a free [TestMu AI](https://www.testmuai.com/kane-cli/) account:

```bash
npm install -g @testmuai/kane-cli && kane-cli login
git clone https://github.com/Guzman0/DappSentinel.git && cd DappSentinel && npm install
npm run sentinel     # ❌ 6 of 7 checks fail: Kane finds the demo's hidden mistakes
claude               # then type /sentinel: Claude fixes demo-dapp/, the Stop hook re-runs Kane, ✅ 7 of 7
```

Or watch it happen on GitHub with no human: Kane fails [PR #5](https://github.com/Guzman0/DappSentinel/pull/5) 6 of 7, Claude Code fixes it, and Kane passes it 7 of 7. Kane's own output from both runs and Claude's fix are kept in [`evidence/pr5-closed-loop/`](evidence/pr5-closed-loop/). Reset the demo with `npm run demo:reset`.

<a name="try-it-yourself-in-a-minute"></a>
No install at all: open the [live demo dApp](https://sentinelswap-demo.netlify.app), SentinelSwap, the site DappSentinel checks, with all six mistakes left in on purpose. It looks like a normal swap page; your browser's developer tools show the Alchemy key and the Sepolia RPC in the network tab, the unpkg script, and `wallet_pk` in localStorage. Both secrets are fake.

## Table of contents

- [See it work](#see-it-work)
- [For judges](#for-judges)
- [Confirmed outside this repo](#confirmed-outside-this-repo)
- [Kane's five jobs](#kanes-five-jobs)
- [What DappSentinel checks](#what-dappsentinel-checks)
  - [Why two kinds of check?](#why-two-kinds-of-check)
- [What you see is what you sign](#what-you-see-is-what-you-sign)
- [Real-world loop: a bug in code we didn't write](#real-world-loop-a-bug-in-code-we-didnt-write)
- [Real-world loop 2: a bug reported on Polaris's issue tracker](#real-world-loop-2-a-bug-reported-on-polariss-issue-tracker)
- [Why it matters](#why-it-matters)
- [How the loop works](#how-the-loop-works)
  - [What Claude sees when Kane blocks it](#what-claude-sees-when-kane-blocks-it)
  - [❌ No RPC API keys in network requests (`rpc-key-leak`)](#-no-rpc-api-keys-in-network-requests-rpc-key-leak)
  - [What happens when](#what-happens-when)
- [The agent can't cheat](#the-agent-cant-cheat)
- [When the loop gives up, a person takes over](#when-the-loop-gives-up-a-person-takes-over)
- [Install and run](#install-and-run)
  - [Any live dApp, from any folder](#any-live-dapp-from-any-folder)
  - [In your repo, as a GitHub Action](#in-your-repo-as-a-github-action)
  - [Your own dApp, with Claude Code](#your-own-dapp-with-claude-code)
- [Mutation test (known-answer): mistakes it was never tuned for](#mutation-test-known-answer-mistakes-it-was-never-tuned-for)
  - [What Kane saw (its own screenshots)](#what-kane-saw-its-own-screenshots)
- [Real-world runs](#real-world-runs)
- [Track record](#track-record)
- [What DappSentinel doesn't do](#what-dappsentinel-doesnt-do)
- [What's next](#whats-next)
- [Findings for the Kane CLI team](#findings-for-the-kane-cli-team)
- [Repository layout](#repository-layout)
- [Built with](#built-with)
- [Notes](#notes)
- [Full details (DETAILS.md)](DETAILS.md)
- [Roadmap (ROADMAP.md)](ROADMAP.md)

## For judges

Every judging rule, and where to see the proof. All of it is public; nothing needs a login or credits. Every GitHub run linked in this README also has Kane's output copied into the repo, in [`evidence/ci-runs/`](evidence/ci-runs/), so none of the proof depends on a link.

| Judging rule | Where to see it |
|---|---|
| **Bar: it works end to end** | [Reproduce it yourself](DETAILS.md#reproduce-it-yourself), 7 steps, each with a public run. The published action `@v1.3.0` on Lido, used exactly as another repo would: 5 of 5, "Clear to ship" ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45405975163)) |
| **Bar: Kane caught or proved something** | Kane gives its own verdict on all 7 checks ([what it checks](#what-dappsentinel-checks)). Two real bugs in code we didn't write: [Spark](#real-world-loop-a-bug-in-code-we-didnt-write) and [Polaris #118](#real-world-loop-2-a-bug-reported-on-polariss-issue-tracker). 6 planted mistakes on the demo ([run](https://github.com/Guzman0/DappSentinel/actions/runs/44757974669)), and 7 new ones it was never tuned for, [8 of 8 on four runs, then 11 of 11](#mutation-test-known-answer-mistakes-it-was-never-tuned-for) |
| **Bar: the agent and Kane talk** | Kane's findings go straight to Claude Code, and a Stop hook won't let Claude finish while a check fails ([how the loop works](#how-the-loop-works), [video at 1:52](https://youtu.be/FiErWhY495U?t=112)). On GitHub, Claude gets Kane's report and comments what it changed ([PR #7](https://github.com/Guzman0/DappSentinel/pull/7#issuecomment-7052572418)) |
| **Ships** (25%) | Claude Code (`/sentinel`), the command line, and a GitHub Action ([`@v1.3.0`](https://github.com/Guzman0/DappSentinel/releases/tag/v1.3.0)). A required check blocks merging a broken pull request ([PR #2](https://github.com/Guzman0/DappSentinel/pull/2)) |
| **Verified** (25%) | Polaris #118: caught, fixed as the issue asks, proven twice ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45015619019)). Spark: caught, fixed, re-checked ([run](https://github.com/Guzman0/DappSentinel/actions/runs/44953030392)). The [mutation test](#mutation-test-known-answer-mistakes-it-was-never-tuned-for), with Kane's own screenshots, and [11 live dApps](#real-world-runs). A [wallet check](#what-you-see-is-what-you-sign) catches transactions that don't match the screen (3 of 3). It also found a bug in Kane CLI itself, [confirmed by the Kane team](https://github.com/LambdaTest/kane-cli/issues/239#issuecomment-7098306114) with a fix coming |
| **Closed loop** (25%) | With no human: Kane fails PR #5 6 of 7, Claude fixes and pushes, the PR passes 7 of 7 ([Kane's output and the fix](evidence/pr5-closed-loop/), [forensic trail](DETAILS.md#forensic-trail-the-loop-on-github-step-by-step)). Max 3 rounds; when only a person can decide, Claude [hands over](#when-the-loop-gives-up-a-person-takes-over) ([PR #10](https://github.com/Guzman0/DappSentinel/pull/10#issuecomment-7081463817)). The same loop fixed a wallet transaction that didn't match the screen ([PR #11](https://github.com/Guzman0/DappSentinel/pull/11)). The agent [can't cheat](#the-agent-cant-cheat) ([PR #6](https://github.com/Guzman0/DappSentinel/pull/6)) |
| **Craft** (25%) | Two commands from any folder, or one line in a workflow ([install and run](#install-and-run)). Keys masked in every report ([SECURITY.md](SECURITY.md)). Honest limits in [what DappSentinel doesn't do](#what-dappsentinel-doesnt-do) |
| **No account, no credits** | Nothing here needs a TestMu login to check. `git clone https://github.com/Guzman0/DappSentinel && cd DappSentinel && npm install && npm test` runs the unit tests against Kane's real output, including the 0.10.8 miss and Kane's misjudged triage. Browse every Kane session in the [session viewer](https://dappsentinel.netlify.app/dashboard/), and read Kane's own output for every linked run in [`evidence/ci-runs/`](evidence/ci-runs/). PR #5, Spark, Polaris and each mutation-test variant have full records in [`evidence/`](evidence/) |
| **Dates** | First commit `ed622c0`, 18 Nov 2026, after the 12 Nov start |

## Confirmed outside this repo

What DappSentinel found, and what the people who own that code said about it.

| Where | What DappSentinel found | Their response |
|---|---|---|
| Kane CLI [#239](https://github.com/LambdaTest/kane-cli/issues/239) | On 0.10.8, Kane read "You pay 0.05 ETH" and still passed a check for 0.5 ETH, once in 3 runs | **Confirmed by the Kane CLI team** ([reply](https://github.com/LambdaTest/kane-cli/issues/239#issuecomment-7098306114)): that run compared the values as whole numbers, so 0.05 and 0.5 both became 0. A fix is in progress, and they called DappSentinel's exact check a good workaround until then |
| Polaris [#118](https://github.com/PolarisQ-xyz/polaris-frontend/issues/118) | A production build with a missing setting silently calls localhost and testnet. Kane caught it, Claude fixed it, Kane proved the fix ([record](evidence/realworld-polaris/)) | The maintainers labelled it a security issue and assigned it through their contributor program. The pull request now under review, [#208](https://github.com/PolarisQ-xyz/polaris-frontend/pull/208), fixes it the same way: development defaults stay, and a production build stops and names each missing setting |

## Kane's five jobs

<a name="why-kane-cli-and-not-playwright-plus-a-parser"></a>
Kane CLI isn't only a test step here. A scripted browser like Playwright can record traffic on a site someone wrote the script for; it can't use a dApp it has never seen. Kane takes a plain-English objective and works the page out itself, so it does five jobs, each with public proof.

1. **The gate.** Every check is a Kane run, and a failing check blocks the pull request or stops Claude from finishing ([PR #2](https://github.com/Guzman0/DappSentinel/pull/2)).
2. **The recorder.** Kane drives a real Chrome and records every request and script. That recording is the evidence the exact checks read, and each finding is traced back to its place in Kane's run ([what it checks](#what-dappsentinel-checks)).
3. **The explorer.** On dApps it has never seen, Kane works out the screen and uses it like a person: it filled in Lido's stake form and confirmed 1 ETH = 1 stETH, and dismissed a banner on Aave to read its USDC market. Nobody wrote selectors for either page ([Lido run](https://github.com/Guzman0/DappSentinel/actions/runs/44835470086), [Aave run](https://github.com/Guzman0/DappSentinel/actions/runs/44834742720)).
4. **The inspector.** With its own DevTools assertions, Kane gives its own verdict on the problems you can't see on screen: leaked keys, testnet endpoints, untrusted scripts and keys in storage. How often it catches them alone is [measured below](#why-two-kinds-of-check).
5. **The re-checker.** After Claude Code fixes something, Kane checks again, independently: locally through the Stop hook, on pull requests ([PR #5](https://github.com/Guzman0/DappSentinel/pull/5)), and on real code from Spark and Polaris ([Spark run](https://github.com/Guzman0/DappSentinel/actions/runs/44953030392), [Polaris run](https://github.com/Guzman0/DappSentinel/actions/runs/45015619019)).

<a name="who-catches-what-kane-and-dappsentinel"></a>

## What DappSentinel checks

DappSentinel opens your site in a real browser with [Kane CLI](https://github.com/LambdaTest/kane-cli) and checks what happens *behind* the page: every request, every script, everything left in browser storage. It blocks the release wherever it runs: in Claude Code, on a pull request, and in `npm run deploy`.

These are the mistakes that look fine on screen and cost users money:

| Check | What gets caught | Who decides |
|---|---|---|
| `rpc-key-leak` | RPC provider API keys (Alchemy, Infura, QuickNode…) in network requests | Kane's DevTools assertion, then the exact check |
| `testnet-rpc` | A mainnet build still calling testnet, staging or localhost endpoints | Kane's DevTools assertion, then the exact check |
| `unknown-scripts` | Scripts from hosts you didn't approve, the way drainers get injected | Kane's DevTools assertion, then the exact check |
| `storage-secrets` | Private keys or seed phrases in localStorage or sessionStorage | Kane's DevTools assertion (localStorage), then the exact check (both) |
| `contract-address` | A displayed contract address that doesn't match the real one | Kane, reading the page |
| `chain-id` | The app pointing at the wrong chain | Kane, reading the network badge |
| `swap-flow` | The core user flow breaking, or a transaction that doesn't match the screen | Kane, using the swap; then exact checks on the amount it read and on the transaction sent to the wallet ([below](#what-you-see-is-what-you-sign)) |

### Why two kinds of check?

Kane reads and uses the page, so the visible checks are its verdicts. For what a user can't see, Kane gives its verdict with its own [DevTools assertions](https://www.testmuai.com/docs/kane-cli-checkpoint-devtools), and DappSentinel's code then checks the same evidence exactly: every request in the network log Kane saves, and localStorage and sessionStorage in the Chrome Kane drives. A check fails if either one finds the problem, so the gate fails closed. The exact check is there because Kane's DevTools can't read sessionStorage and can miss a request. Secrets are masked in every report.

**Measured, not claimed:** on the demo, Kane's DevTools assertions failed all 4 hidden checks by themselves in two of three runs ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45023773746), [run](https://github.com/Guzman0/DappSentinel/actions/runs/45210910500)). In the third they failed 3 of 4: they missed the testnet request, and the exact check caught it ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45208847205)). In mutation test run 4 they caught 3 of 4; the fourth, a seed phrase in sessionStorage (which Kane's DevTools can't read), was caught by the exact check ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45023763082)). Kane raised no false alarms on the clean site or on Lido. Every report shows both verdicts side by side, with a link to Kane's own replay ([full comparison](DETAILS.md#who-catches-what-kane-and-dappsentinel)).

## What you see is what you sign

The costliest attack on a dApp website didn't change what users saw. In the Bybit attack, the screen showed a normal transaction while the wallet was asked to sign a different one. So DappSentinel checks the transaction too.

While Kane uses the swap, DappSentinel puts a harmless **test wallet** into the page ([`lib/browser-watch.js`](lib/browser-watch.js)). It signs nothing; it records what the site asks it to sign. Kane's pass only stands if every transaction:

- goes to a contract you trust (`contracts` and `trustedContracts` in `sentinel.config.json`),
- sends exactly the amount Kane read on the confirmation screen, and
- doesn't let an untrusted address spend the user's tokens (an `approve` or `setApprovalForAll` to a stranger is the classic drainer).

**Proven on three new mistakes where the screen looks right** (Kane CLI 0.10.8: [run 5](https://github.com/Guzman0/DappSentinel/actions/runs/45273765898), and [run 6](https://github.com/Guzman0/DappSentinel/actions/runs/45380875057) with all 11 copies, 11 of 11). Kane completed and passed all three swaps, because the screen was fine. The wallet check failed each one:

| Planted mistake | What DappSentinel reported |
|---|---|
| The swap goes to an unknown address | "The site asks the wallet to send 0.5 ETH to 0x9f2c…2f4a, which is not one of your trusted contracts." ([record](evidence/mutation-test/run-45273765898/m8-wrong-recipient/report.md)) |
| The screen says 0.5 ETH, the transaction sends 5 | "Kane saw "0.5 ETH" on the confirmation, but the transaction sent to the wallet is for 5 ETH." ([record](evidence/mutation-test/run-45273765898/m9-hidden-amount/report.md)) |
| An unlimited USDC approval to an unknown address, before the swap | "The site asks the wallet to let 0x9f2c…2f4a spend all of the token at USDC…" ([record](evidence/mutation-test/run-45273765898/m10-unlimited-approval/report.md)) |

**And the loop fixes it with no human** ([PR #11](https://github.com/Guzman0/DappSentinel/pull/11), [record](evidence/pr11-wallet-loop/)). A pull request sent the swap to an unknown address while the screen looked right. Kane passed the screen, the wallet check failed the transaction (1 of 7, [run](https://github.com/Guzman0/DappSentinel/actions/runs/45381084717)), Claude Code changed one line back to the trusted router and [explained why](https://github.com/Guzman0/DappSentinel/pull/11#issuecomment-7129804166), and Kane passed it 7 of 7 ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45382098297)).

In the mutation run the clean site passed, its one transaction matching the screen, and the other copies were judged as before. The demo only ever talks to the test wallet, which it finds by name, so a visitor's real wallet is never asked to sign anything.

## Real-world loop: a bug in code we didn't write

Spark is a large DeFi lending app whose web app code (MIT licence) was public in 2024; [a copy](https://github.com/syt4sh1/spark-app) still is. [One run](https://github.com/Guzman0/DappSentinel/actions/runs/44953030392), every job green:

1. **Kane caught it.** We built Spark's code unchanged, and Kane failed the page: *"The page tries to use an external Ethereum data service from the browser, but that service does not allow requests from this page's address."* The cause: an Alchemy API key written into the source, locked to Spark's domain.
2. **Claude Code fixed it.** It made the RPC URL a setting with a keyless public fallback: 3 lines in 2 files ([the patch](evidence/realworld-spark/run-44953030392/fix.patch)).
3. **Kane proved it.** Rebuilt and checked again: the page loads, and none of the 46 requests carries a key or goes to a testnet.

To be precise: a domain-locked key isn't proof of a leak. The bug is that the published code can't run anywhere else, so every fork or self-hosted build shows an error screen. The same key is still in Spark's live traffic ([scan](https://github.com/Guzman0/DappSentinel/actions/runs/44952359583)), masked throughout. Full record: [`evidence/realworld-spark/`](evidence/realworld-spark/).

<a name="real-world-loop-2-a-bug-the-maintainers-reported"></a>

## Real-world loop 2: a bug reported on Polaris's issue tracker

[Polaris](https://github.com/PolarisQ-xyz/polaris-frontend) is an open-source prediction-market dApp. Its issue [#118](https://github.com/PolarisQ-xyz/polaris-frontend/issues/118) says a production build missing a setting still builds, then silently talks to localhost and testnet. In [one run](https://github.com/Guzman0/DappSentinel/actions/runs/45015619019), Kane failed the build made exactly as the issue describes (*"The page tried to get market and account data from a local service"*). Claude Code then made a production build stop and name the missing setting ([the patch](evidence/realworld-polaris/run-45015619019/fix.patch)), and Kane proved it: the bad build is refused, and a configured build passes Kane's DevTools assertion. What the maintainers did next is in [Confirmed outside this repo](#confirmed-outside-this-repo); the full record is in [`evidence/realworld-polaris/`](evidence/realworld-polaris/).

## Why it matters

The demo video opens with three attacks that hit dApp websites, not smart contracts. Together they took about $1.62 billion from users.

| When | What happened | Lost | Source |
|---|---|---|---|
| Dec 2021 | BadgerDAO: a malicious script was injected into the website through a compromised Cloudflare API key | ~$120M | [The Block](https://www.theblock.co/post/126072/defi-protocol-badgerdao-exploited-for-120-million-in-front-end-attack) |
| Dec 2023 | Ledger Connect Kit: a poisoned npm release shipped a wallet drainer into dApps that load the library | ~$600K | [Ledger's incident report](https://www.ledger.com/blog/security-incident-report), [SlowMist](https://slowmist.medium.com/supply-chain-attack-on-ledger-connect-kit-analyzing-the-impact-and-preventive-measures-1005e39422fd) |
| Feb 2025 | Bybit: tampered JavaScript in the Safe{Wallet} web interface altered a multisig transaction | ~$1.5B | [The Block](https://www.theblock.co/post/343530/lazarus-appears-to-compromise-safe-developer-machine-in-lead-up-to-1-5-billion-bybit-hack-report), [SlowMist](https://slowmist.medium.com/bybits-1-5-billion-theft-unveiled-safe-wallet-front-end-code-tampered-84b78f0fa9c2) |

Figures are approximate and in US dollars at the time of each attack.

## How the loop works

```mermaid
flowchart LR
    A["Claude Code<br/>edits the site"] --> C["Stop hook:<br/>Kane CLI checks<br/>in a real browser"]
    C --> D{"All checks<br/>pass?"}
    D -- yes --> E["Clear to ship"]
    D -- no --> F{"Under 3 rounds and<br/>Claude's fix to make?"}
    F -- yes --> G["Claude is blocked,<br/>gets Kane's findings"]
    G --> A
    F -- no --> H["A person<br/>needs to look"]
```

1. You (or Claude) change the site.
2. When Claude finishes its turn, a Claude Code **Stop hook** (`hooks/sentinel-stop.js`) runs every check with Kane CLI.
3. If anything fails, the hook **blocks Claude from finishing** and hands it Kane's report (`.sentinel/report.md`): what failed, the offending URLs or values, and how to fix it.
4. Claude fixes the code and finishes again, which re-runs the checks. This repeats until everything passes. After 3 rounds, or when the fix needs a person's decision, [a person takes over](#when-the-loop-gives-up-a-person-takes-over).
5. `npm run deploy` only deploys if every check passes.

### What Claude sees when Kane blocks it

This is the hook's real output, word for word (it is JSON; the line breaks are shown here as lines). To capture it, we ran `hooks/sentinel-stop.js` on Kane's real report from mutation test run 4, where the demo site was given an Infura key ([report](evidence/mutation-test/run-45023763082/m1-infura-key/report.md)):

```text
decision: block
reason:
DappSentinel (Kane CLI) round 1/3: 1 of 7 checks failed.
- No RPC API keys in network requests: Kane's network recording shows 1 request carrying an RPC API key in the URL.

Read .sentinel/report.md for Kane's full findings and fix hints, fix the app in demo-dapp/, then finish your turn so the checks re-run.
Do not edit checks/ or sentinel.config.json to make a check pass.
```

Claude then reads Kane's report, which gives Kane's own verdict first, then the exact check's evidence and the fix (excerpt; the key is masked in every report):

```text
### ❌ No RPC API keys in network requests (`rpc-key-leak`)
Kane's own DevTools verdict: ❌ failed: assert: No URL in page_requests contains an RPC provider API key …
Kane and DappSentinel both found it.
DappSentinel's exact check: Kane's network recording shows 1 request carrying an RPC API key in the URL.
- POST https://mainnet.infura.io/v3/3f9c…a65  (first seen in Kane's recording as request 4 of 5)
How to fix: Remove provider API keys from frontend code. Use a keyless public RPC for read calls,
or route keyed calls through a server-side proxy. …
Watch Kane's run, step by step: https://test-manager.lambdatest.com/…
```

On GitHub, Claude gets the same report with [this prompt](.github/workflows/dappsentinel.yml), and both sides of the conversation end up on the pull request: Claude's summary of its fix ([PR #7](https://github.com/Guzman0/DappSentinel/pull/7#issuecomment-7052572418)) or its reason for handing over ([PR #10](https://github.com/Guzman0/DappSentinel/pull/10#issuecomment-7081463817)).

### What happens when

Every situation, locally and on GitHub, from \"every check passes\" to \"the rules were edited\", is in [DETAILS.md](DETAILS.md#what-happens-when). The short version: anything Kane can't decide counts as a failure, never a pass.

## The agent can't cheat

The coding agent is allowed to fix the site. It is not allowed to touch the referee.

- A Claude Code **PreToolUse hook** (`hooks/guard-checks.js`) blocks any edit to `checks/`, `sentinel.config.json`, `bin/`, `lib/`, `hooks/` or `.claude/`, whether through the edit tools or a shell command like `sed -i` or `Set-Content`.
- The gate runs a **tamper check** first: if any of those files differ from the last commit, it refuses to run (exit code `3`) and lists them, and the Stop hook tells the agent to revert them.

So a red check can only turn green by changing the site.

## When the loop gives up, a person takes over

The fix loop never tries forever, and never quietly undoes what a developer meant to do. Claude Code is told what the pull request is for. If passing a check means undoing that, or a decision only a person may make (like trusting a new script host), Claude makes no change and explains why, and DappSentinel comments on the pull request: a person needs to look, here's what still fails, Claude's reasoning, and Kane's run. The same happens after 3 rounds, on GitHub and in the local Stop hook.

**A real handover, [PR #10](https://github.com/Guzman0/DappSentinel/pull/10)** (closed, not merged). The PR adds TradingView's price ticker, which loads 21 untrusted scripts. Kane failed 2 of 7. Claude kept the ticker, didn't touch the rules, and [explained](https://github.com/Guzman0/DappSentinel/pull/10#issuecomment-7081463817) that trusting TradingView is a person's decision ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45038933982)). It also flagged one failure as a likely false alarm, now listed under [what DappSentinel doesn't do](#what-dappsentinel-doesnt-do).

**The 3-round limit, [PR #9](https://github.com/Guzman0/DappSentinel/pull/9)** (closed, not merged), with the three rounds **simulated** by empty commits: in [PR #8](https://github.com/Guzman0/DappSentinel/pull/8), even with 4 steps per round instead of 40, Claude fixed all six mistakes in round 1. On PR #9 the fix job counted 3 rounds and [handed over](https://github.com/Guzman0/DappSentinel/pull/9#issuecomment-7081219978) ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45037005761)).

## Install and run

<a name="try-it-on-any-dapp-from-any-folder"></a><a name="check-any-live-dapp"></a>
### Any live dApp, from any folder

You need Node.js 20+, Chrome, and Kane CLI signed in (`npm i -g @testmuai/kane-cli && kane-cli login`). No clone, no config:

```bash
npm install -g github:Guzman0/DappSentinel
dappsentinel check --url https://stake.lido.fi
```

It runs the 5 checks that need no inside knowledge of the site and writes `.sentinel/report.md`. This exact install, in an empty folder on a fresh GitHub runner, passed Lido 5 of 5 ([run](https://github.com/Guzman0/DappSentinel/actions/runs/44925440855)). Third-party scripts are flagged until you trust their hosts in `allowedScriptHosts`.

<a name="use-it-in-your-own-repo"></a><a name="run-it-in-ci"></a>
### In your repo, as a GitHub Action

Add your TestMu AI username and access key as repository secrets (`LT_USERNAME`, `LT_ACCESS_KEY`), then one step:

```yaml
- uses: Guzman0/DappSentinel@v1.3.0
  with:
    url: https://staging.yourdapp.xyz
    lt-username: ${{ secrets.LT_USERNAME }}
    lt-access-key: ${{ secrets.LT_ACCESS_KEY }}
```

The step fails while any check fails and puts the report in the run summary. Use `site-dir` to check a folder you built instead of a URL, and `config` for your own chain ID, contracts, trusted hosts and checks; with `fetch-depth: 0`, a pull request that changes them is refused, so it can't loosen its own rules. To have Claude Code fix pull requests too, use this repo's [workflow](.github/workflows/dappsentinel.yml) with a `CLAUDE_CODE_OAUTH_TOKEN` secret ([setup](DETAILS.md#run-it-in-ci)).

<a name="quick-start"></a><a name="use-it-on-your-own-dapp"></a><a name="close-the-loop-with-claude-code"></a><a name="commands"></a>
### Your own dApp, with Claude Code

Clone the repo (see [See it work](#see-it-work)), point `siteDir` in `sentinel.config.json` at your build folder or set `url`, and say what "correct" means:

```json
{
  "url": "https://staging.yourdapp.xyz",
  "chainId": 1,
  "networkName": "Ethereum",
  "contracts": { "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  "allowedScriptHosts": ["self", "cdn.yourdapp.xyz"]
}
```

Adjust the plain-English steps in `checks/*.md` to your UI; `{{placeholders}}` are filled in from the config, and `checks/07-swap-flow.md` should walk your main flow, because the network checks read the traffic Kane records during it. Then open Claude Code and ask it to *"run /sentinel and fix everything Kane catches"*, or just change the site and let the Stop hook take over.

`npm run sentinel` runs every check (`sentinel:headed` shows the browser), `npm run demo:reset` puts the demo's mistakes back, and `npm run deploy` deploys only if every check passes. Exit codes: `0` passed, `1` a check failed, `2` setup problem, `3` the rules were changed ([all commands](DETAILS.md#commands)).

## Mutation test (known-answer): mistakes it was never tuned for

A gate is only useful if it's right. So we took the fixed site and made 7 copies, each with **one new mistake** that is different from the demo's (Infura instead of Alchemy, Holesky instead of Sepolia, a swapped digit in the middle of the address instead of the last one, and so on). The clean site must pass everything; each copy must fail exactly its own check and nothing else.

**Four runs, 8 of 8 every time** ([run 1](https://github.com/Guzman0/DappSentinel/actions/runs/44847434698) · [run 2](https://github.com/Guzman0/DappSentinel/actions/runs/44884542975) · [run 3](https://github.com/Guzman0/DappSentinel/actions/runs/44962415067) · [run 4](https://github.com/Guzman0/DappSentinel/actions/runs/45023763082)).

![Mutation test results: the clean site passes 7 of 7, and each of the 7 copies fails exactly its own check, on all four runs](assets/mutation-test.jpg)

| Variant | Planted mistake | Expected | Run 1 | Run 2 | Run 3 | Run 4 | What Kane found |
|---|---|---|---|---|---|---|---|
| `clean` | None: the fixed site | 7 of 7 pass | ✅ | ✅ | ✅ | ✅ | Completed the swap; address and chain ID confirmed |
| `m1-infura-key` | Infura RPC URL with an API key | fail `rpc-key-leak` only | ✅ | ✅ | ✅ | ✅ | `POST mainnet.infura.io/v3/3f9c…a65` in its network recording |
| `m2-holesky-rpc` | Holesky testnet RPC in a mainnet build | fail `testnet-rpc` only | ✅ | ✅ | ✅ | ✅ | A request to `ethereum-holesky-rpc.publicnode.com` |
| `m3-swapped-digits` | Two characters swapped mid USDC address | fail `contract-address` only | ✅ | ✅ | ✅ | ✅ | Failed it both times, but its written reason was about its own step (see below) |
| `m4-polygon-chain` | Chain ID 137 under an Ethereum label | fail `chain-id` only | ✅ | ✅ | ✅ | ✅ | "showing the chain ID for a different network while keeping the Ethereum name" |
| `m5-jsdelivr-script` | Script from the jsDelivr CDN | fail `unknown-scripts` only | ✅ | ✅ | ✅ | ✅ | 1 script from 1 untrusted host, `cdn.jsdelivr.net` |
| `m6-seed-in-session` | Seed phrase in sessionStorage as `backup` | fail `storage-secrets` only | ✅ | ✅ | ✅ | ✅ | `sessionStorage["backup"]` holds a seed phrase |
| `m7-wrong-confirm-amount` | Confirm screen shows a tenth of the amount | fail `swap-flow` only | ✅ | ✅ | ✅ | ✅ | The decimal point is in the wrong place; received amount and fee still match 0.5 ETH |

### What Kane saw (its own screenshots)

Two of the swap-flow runs from mutation test run 4, played back from Kane's own step screenshots. The red boxes are Kane's, marking what it is about to type into or click. The captions follow Kane's step log, and the last card gives the verdict (for the catch, in Kane's own words).

<table>
<tr>
<td width="50%">

**A clean pass** (`clean`): Kane completes the swap and every assertion holds.

![Kane CLI completing the swap on the clean site, step by step, ending in a pass](assets/kane-pass.gif)

*Source: [`clean/screenshots/`](evidence/mutation-test/run-45023763082/clean/screenshots/)*

</td>
<td width="50%">

**A mistake caught** (`m7-wrong-confirm-amount`): the confirmation shows 0.05 ETH for a 0.5 ETH swap, and Kane fails the run.

![Kane CLI catching the wrong amount on the confirmation screen](assets/kane-catch.gif)

*Source: [`m7-wrong-confirm-amount/screenshots/`](evidence/mutation-test/run-45023763082/m7-wrong-confirm-amount/screenshots/)*

</td>
</tr>
</table>

**Runs 5 and 6** (23 and 24 Nov, Kane CLI 0.10.8) added three wallet mistakes, `m8` to `m10` ([what you see is what you sign](#what-you-see-is-what-you-sign)). Run 5 checked six copies: 6 of 6 correct ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45273765898)). Run 6 checked all eleven: **11 of 11 correct** ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45380875057), [record](evidence/mutation-test/run-45380875057/)). One run in between stopped halfway when the account ran out of Kane credits; it isn't counted. **Run 7**, on Kane CLI 0.10.9 (released 24 Nov), checked all eleven again: **11 of 11 correct** ([run](https://github.com/Guzman0/DappSentinel/actions/runs/45400397300), [record](evidence/mutation-test/run-45400397300/)).

**On Kane CLI 0.10.8**, Kane once passed the wrong-amount copy while reading 0.05 ETH: that's [issue #239, confirmed by the Kane team](#confirmed-outside-this-repo). A pass now only stands if the amount Kane stored is exactly 0.5.

**Browse it** in the [session viewer](https://dappsentinel.netlify.app/dashboard/). Kane's screenshot of each mistake and the honest notes are in [the full write-up](DETAILS.md#mutation-test-known-answer-mistakes-it-was-never-tuned-for); every record is in [`evidence/mutation-test/`](evidence/mutation-test/).

## Real-world runs

The `live` profile on 11 live mainnet dApps on 20 and 21 Nov 2026, each a public run. Lido, Yearn and Curve passed 5 of 5 ([Lido](https://github.com/Guzman0/DappSentinel/actions/runs/44762327264)), and Kane also used Lido's stake screen and Aave's USDC market. Keyed Alchemy RPC URLs showed up on CoW Swap ([run](https://github.com/Guzman0/DappSentinel/actions/runs/44762331502)) and Spark ([run](https://github.com/Guzman0/DappSentinel/actions/runs/44952359583)). Most other flags were analytics, support-chat or bot-protection scripts that aren't on the allowlist. Balancer and Sushi stopped the automated browser, so they're reported inconclusive, never clean. Running on real sites also removed three false alarms. Kane's output for each is in [`evidence/ci-runs/`](evidence/ci-runs/). [Every dApp, with what Kane's recording showed](DETAILS.md#real-world-runs).

## Track record

<a name="forensic-trail-the-loop-on-github-step-by-step"></a><a name="reproduce-it-yourself"></a>
Every CI run so far, unfiltered: same input, same verdict. The broken demo failed 6 of 7 every time, the fixed demo passed 7 of 7, Claude's fixes on GitHub turned red into green both times, and Lido passed 5 of 5 on every run. Kane's output for each is in [`evidence/ci-runs/`](evidence/ci-runs/).

- [Every run, and the ones not counted and why](DETAILS.md#track-record)
- [The loop on PR #7, step by step](DETAILS.md#forensic-trail-the-loop-on-github-step-by-step), each step with the job, commit or comment that proves it
- [Reproduce it yourself](DETAILS.md#reproduce-it-yourself): 7 steps, each with what you should see and a public run where it already happened

## What DappSentinel doesn't do

For what DappSentinel collects, masks and uploads, see [SECURITY.md](SECURITY.md). In short: only a redacted report is kept, and Kane's raw evidence is never uploaded unless you opt in.

- **A flagged RPC key isn't proof of a leak.** Many dApps ship keys that only work from their own domain. Treat the finding as a prompt to check the key's restrictions. Spark's key is that kind ([the Spark loop](#real-world-loop-a-bug-in-code-we-didnt-write)).
- **A flagged script host isn't proof of an attack.** It means the host isn't on your allowlist. Look into it, then either trust it in your config or remove the script.
- **It isn't a smart contract audit.** It checks the website, not the contracts behind it.
- **It can't catch every frontend compromise.** It sees what the browser does while Kane uses the page, and the transactions the site asks the test wallet to sign then. Malicious code that only wakes up for certain wallets or transactions, like the code in the Bybit attack, may stay quiet during a check.
- **Some sites block automated browsers.** When Kane can't reach the real page, DappSentinel reports the network checks as inconclusive, never as clean.
- **Testing on `localhost` can trip the testnet check.** It matches words like `localhost` anywhere in a request's address, including where a third-party widget sends the page's own address, as in [PR #10](https://github.com/Guzman0/DappSentinel/pull/10). Check a deployed preview to avoid it.

## What's next

The ideas that would make the biggest difference:

- **Catch targeted attacks.** Let the test wallet use your own wallet address, so code that only wakes up for one target, as in the Bybit attack, shows itself during the check.
- **Watch the live site, not only the release.** Run the check on a schedule and flag any script whose code changes after a known-good day, even from a trusted host.
- **Use more of Kane CLI.** Kane's verdict policies for the final pass or fail, and locked regression tests with auto-healing off.

The rest, from signature requests to more chains, is in [ROADMAP.md](ROADMAP.md).

## Findings for the Kane CLI team

What building DappSentinel taught us about Kane CLI 0.10.7 and 0.10.8. The top three:

- **A pass can contradict Kane's own reading** on 0.10.8: [#239, confirmed by the Kane team](#confirmed-outside-this-repo).
- **Kane's triage can blame the test when the app is wrong.** On the swapped-address copy, Kane failed the check correctly, but its triage called it a test configuration bug, 98% confident, on three runs ([record](evidence/mutation-test/run-45175229208/m3-swapped-digits/)). Reported as [LambdaTest/kane-cli#245](https://github.com/LambdaTest/kane-cli/issues/245); it still happens on 0.10.9 ([record](evidence/mutation-test/run-45400397300/m3-swapped-digits/)). DappSentinel shows Kane's diagnosis labelled as Kane's opinion, warns when it blames the test, and never lets it change the verdict.
- **Network capture resets at every step, and DevTools can't read sessionStorage.** DappSentinel stores the page's requests in the step that reloads it, and watches sessionStorage itself.

[All 9 findings, each with its run](DETAILS.md#findings-for-the-kane-cli-team).

## Repository layout

`demo-dapp/` is the site being guarded; `checks/` and `sentinel.config.json` are the rules; `bin/`, `lib/` and `hooks/` are the gate and the loop; `evidence/` holds the committed records; `docs/` is the website and session viewer. [The full layout](DETAILS.md#repository-layout). Reference material that used to be in this README is in [DETAILS.md](DETAILS.md), word for word.

## Built with

The code was written by **Claude** (Anthropic) as a coding agent (Claude Opus 5.5 in the final sessions), with Kane CLI as the browser that checks its work.

- **Kane CLI** (`@testmuai/kane-cli`, tested on 0.10.7 and 0.10.8): runs every check in a real Chrome, gives its own verdicts, and records the network log, screenshots and replay links that are the evidence.
- **Claude Code**: fixes the site, locally through the Stop hook and `/sentinel`, and on GitHub through [`anthropics/claude-code-action@v1`](https://github.com/anthropics/claude-code-action).
- **Node.js 20**, **Chrome** over the DevTools Protocol, **GitHub Actions**, **Docker** (builds outside code in isolation, with no secrets) and **Netlify** (hosts the [site](https://dappsentinel.netlify.app)).

## Notes

- A full run uses TestMu AI credits; new accounts get free ones. `npm test` needs none.
- Both secrets in the demo are fake on purpose: the Alchemy key was made up, and the private key is the public Hardhat test key (account #0). Never use it for real funds.

Built for the [Kane CLI Online Hackathon](https://www.kaneclihack.sh/) with Claude Code; Kane CLI verifies it, and Kane's result drives the fix. MIT licence.
