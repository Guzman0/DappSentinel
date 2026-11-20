<p><img src="assets/logo-gate-closed.svg" width="180" alt="DappSentinel barrier gate logo"></p>

# DappSentinel

**The gate between your dApp and mainnet. Your dApp doesn't ship until Kane says it's safe.**

DappSentinel is a pre-launch safety gate for dApp frontends. It uses [Kane CLI](https://github.com/LambdaTest/kane-cli) to open your site in a real browser and check what happens *behind* the page: every network request, every script, everything left in browser storage. When Kane catches a problem, your coding agent (Claude Code) gets the findings, fixes the code, and Kane checks again, until every check passes.

These are the mistakes that look fine on screen and cost users money:

| Check | What gets caught | How Kane proves it |
|---|---|---|
| `rpc-key-leak` | RPC provider API keys (Alchemy, Infura, QuickNode…) in network requests | Network log Kane records in the browser |
| `testnet-rpc` | A mainnet build still calling testnet, staging or localhost endpoints | Network log Kane records in the browser |
| `unknown-scripts` | Scripts loaded from hosts you didn't approve, the way drainers get injected | Network log Kane records in the browser |
| `storage-secrets` | Private keys or seed phrases left in localStorage or sessionStorage | Kane drives a Chrome that DappSentinel watches live |
| `contract-address` | A displayed contract address that doesn't match the real one | Kane asserts on the page |
| `chain-id` | The app pointing at the wrong chain | Kane asserts on the page |
| `swap-flow` | The core user flow breaking after the fixes | Kane runs the flow end to end |

### Why two kinds of check?

Kane is great at plain-English assertions about what's on the page, so the visible checks
(`contract-address`, `chain-id`, `swap-flow`) are Kane assertions. The hidden problems live in
traffic and storage. Asking an agent to reason over a whole network log in one assertion tends to
time out, but Kane already records every request it sees in its evidence pack as a standard HAR
file. So while Kane runs the swap flow, DappSentinel reads that recording and checks every request
deterministically. Kane is still the one in the browser catching it; DappSentinel just reads the
tape.

Storage works the same way. DappSentinel starts Chrome, Kane drives it (`kane-cli --cdp-endpoint`),
and DappSentinel watches that browser's localStorage and sessionStorage live over the Chrome
DevTools Protocol while Kane uses the page. Secrets are masked in the report.

That's 4 Kane runs per round instead of 7, so each fix-and-verify loop is faster and cheaper.

## Try it yourself in a minute

The demo dApp is live with all six mistakes still in it: **https://sentinelswap-demo.netlify.app**

It looks like a normal swap page. Open your browser's developer tools and you'll find the Alchemy key in the network tab, the unpkg script, the Sepolia RPC and `wallet_pk` in localStorage. Or let DappSentinel find them:

```bash
npm run sentinel -- --url https://sentinelswap-demo.netlify.app
```

Both secrets on that page are fake: the Alchemy key was made up and the private key is the public Hardhat test key.

## How the loop works

```
 Claude Code edits the site
          │
          ▼
 Stop hook runs DappSentinel ──► Kane CLI checks the site in a real browser
          ▲                                   │
          │                         all pass? ├── yes ──► ✅ clear to ship
          │                                   │
          └──── Kane's findings + fix hints ◄─┘ no
```

1. You (or Claude) change the site.
2. When Claude finishes its turn, a Claude Code **Stop hook** (`hooks/sentinel-stop.js`) runs every check with Kane CLI.
3. If anything fails, the hook **blocks Claude from finishing** and hands it Kane's report (`.sentinel/report.md`): what failed, the offending URLs or values, and how to fix it.
4. Claude fixes the code and finishes again, which re-runs the checks. This repeats until everything passes (or 5 rounds).
5. `npm run deploy` only deploys if every check passes.

## The agent can't cheat

The coding agent is allowed to fix the site. It is not allowed to touch the referee.

- A Claude Code **PreToolUse hook** (`hooks/guard-checks.js`) blocks any edit to `checks/`, `sentinel.config.json`, `bin/`, `lib/`, `hooks/` or `.claude/`, whether through the edit tools or a shell command like `sed -i` or `Set-Content`.
- The gate runs a **tamper check** first: if any of those files differ from the last commit, it refuses to run (exit code `3`) and lists them, and the Stop hook tells the agent to revert them.

So a red check can only turn green by changing the site.

## Quick start

You need [Node.js 18+](https://nodejs.org), Google Chrome and a free [TestMu AI](https://www.testmuai.com/kane-cli/) account.

```bash
# 1. Install Kane CLI and sign in
npm install -g @testmuai/kane-cli
kane-cli login

# 2. Get DappSentinel
git clone https://github.com/Guzman0/DappSentinel.git
cd DappSentinel
npm install

# 3. Run the gate against the included demo dApp
npm run sentinel
```

The demo dApp (`demo-dapp/`, a simulated ETH → USDC swap page) ships with real-world mistakes in it, so the first run fails and shows you what Kane catches. Open `.sentinel/report.md` to see the findings.

### Close the loop with Claude Code

```bash
npx @testmuai/kane-cli-skill   # optional: teaches Claude Code how to use Kane
claude                          # open Claude Code in this folder
```

Then ask: *"Run /sentinel and fix everything Kane catches."* Or change anything in `demo-dapp/` and let the Stop hook take over.

Want to watch Kane work? `npm run sentinel:headed` runs the checks in a visible browser.

## Use it on your own dApp

1. Point `siteDir` in `sentinel.config.json` at your site's build folder, or set `url` to your staging URL.
2. Set what "correct" means for your app:

```json
{
  "url": "https://staging.yourdapp.xyz",
  "chainId": 1,
  "networkName": "Ethereum",
  "contracts": { "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  "allowedScriptHosts": ["self", "cdn.yourdapp.xyz"]
}
```

3. Adjust the steps in `checks/*.md` to match your app's UI. Kane checks are plain English, so no test code is needed. `{{placeholders}}` are filled in from the config. Make sure `checks/07-swap-flow.md` walks through your main flow, because the network checks scan the traffic Kane records during it.

## Commands

| Command | What it does |
|---|---|
| `npm run sentinel` | Run every check, write `.sentinel/report.md` and `.sentinel/report.json` |
| `npm run sentinel:headed` | Same, with a visible browser |
| `npm run sentinel -- --only rpc-key-leak,chain-id` | Run selected checks |
| `npm run demo` | Serve the demo dApp at http://localhost:4173 |
| `npm run demo:reset` | Put the six planted mistakes back after a fix |
| `npm run checks` | List the checks |
| `npm run deploy` | Run the gate, and deploy to Netlify only if it passes |

Exit codes: `0` all passed, `1` a check failed, `2` setup problem (Kane not installed or not signed in), `3` refused because the checks or the gate were changed.

Turn the Stop hook off for a session with `DAPPSENTINEL_HOOK=off`.

## Notes

- A full round is 4 Kane CLI runs and uses TestMu AI credits. New accounts get free credits.
- `npm test` runs the analyzers against a network log recorded by Kane, with no credits needed.
- Both secrets in the demo are fake on purpose: the Alchemy key was made up, and the private key is the public Hardhat test key (account #0). Never use it for real funds.
- Kane CLI's own localStorage reading timed out in our tests (even on the cookbook's example), so DappSentinel reads storage from the Chrome that Kane drives instead. Kane still does the browsing; the storage is read from its browser.
- DappSentinel checks what a browser can see. It doesn't replace a smart contract audit.

Built for the [Kane CLI Online Hackathon](https://www.kaneclihack.sh/) with Claude Code; Kane CLI verifies it, and Kane's result drives the fix. MIT licence.
