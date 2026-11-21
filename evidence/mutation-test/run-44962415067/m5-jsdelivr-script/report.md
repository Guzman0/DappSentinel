# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:43:24.502Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ❌ failed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Finding:** Kane's network recording shows 1 script loaded from 1 untrusted host.

**Kane's own DevTools verdict:** ✅ passed: assert: every request with resource type script was loaded from one of these domains or ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807TSGMKDHEWESZJXN1H5HY/dashboard/share/US_INPQZENR1M3DAKEHV097R7J4DJPTKU48V4VHZBZALLC0YYISVDM7KCWDMLSG16BB?type=summary&agentView=true&fqdn=summary-page))

_DappSentinel's exact check found it; Kane's DevTools assertion passed._

- `https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)`  (first seen in Kane's recording as request 3 of 6)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807RQQX8QM97WC3K6XAGZH8/dashboard/share/US_SC028PC6VEP9DTR2JB9Z2MWRWW79PXIEF1VBORDJL2C93MM1WUPRDXMNCD5K133U?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/c38fdc97-7453-4c41-adc7-d5ae6a6d6557/evidence/9116960f-3336-4191-b5a4-455885e62d3e.evidence`

---
For AI agents: fix the app in `.mutants/m5-jsdelivr-script/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
