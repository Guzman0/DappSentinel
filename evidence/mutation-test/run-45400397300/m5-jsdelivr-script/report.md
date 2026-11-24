# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T13:19:21.530Z
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

**Kane's own DevTools verdict:** ✅ passed: assert: every entry in {{page_requests}} with resource type script was loaded from one o ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86V98VF4GJEQ84GKE8FXZN5/dashboard/share/US_YCFL2VRO76J0HB1ZIKY8Y6THQ4F0P81YDWBRSV5AEKMW9IAFGR2ZFF7NYTYIX8HB?type=summary&agentView=true&fqdn=summary-page))

_DappSentinel's exact check found it; Kane's DevTools assertion passed._

**DappSentinel's exact check:** Kane's network recording shows 1 script loaded from 1 untrusted host.

- `https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)`  (first seen in Kane's recording as request 3 of 6)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86V6S6N1ZWP17EPBT1N1607/dashboard/share/US_9NPF2624816I2C0S78XIANF6YQD0SAKXZQ3OAHIS5NLRZYG1R0XRJ6KRTGXKNP9W?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/45056b27-6abb-4aa0-a58b-f3abec04356e/evidence/56e5879d-18a3-49d1-993e-301cd9c06b43.evidence`

---
For AI agents: fix the app in `.mutants/m5-jsdelivr-script/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
