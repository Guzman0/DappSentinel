# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:13:19.977Z
- Result: **FAILED**, 5 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ❌ failed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ❌ failed |

## What Kane caught

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Kane's own DevTools verdict:** ⚠️ inconclusive: Kane did not report this assertion. ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857GS1NEAXH2T7A4ZS1M16M/dashboard/share/US_EWIHUH4YT4PFU24JSC6OU08QCXOQJ27GPUTDHC0I0MX9M6T26TQH7QORURQJIQ5N?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: error._

**DappSentinel's exact check:** Kane's network recording shows 1 script loaded from 1 untrusted host.

- `https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)`  (first seen in Kane's recording as request 3 of 6)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857FT3PMHN4SKD2ADD3QY7R/dashboard/share/US_W0EO68GY3ETEWXAWC6S9I8L4FYK1G5PTBJ0GJ7C1OR8E6I9D4HSD6IUPR28JGW3K?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/befeb64e-5d9e-4f70-9fa3-8ed46aad55a7/evidence/b8259df5-f1eb-43dd-90f6-533b9b94ca91.evidence`

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857FT3PMHN4SKD2ADD3QY7R/dashboard/share/US_W0EO68GY3ETEWXAWC6S9I8L4FYK1G5PTBJ0GJ7C1OR8E6I9D4HSD6IUPR28JGW3K?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/befeb64e-5d9e-4f70-9fa3-8ed46aad55a7`

---
For AI agents: fix the app in `.mutants/m5-jsdelivr-script/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
