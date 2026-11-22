# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:53:42.013Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: every entry in page_requests with resource type script was loaded from one of th ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81N0PFB4V3PFAJ6XG9CVHAE/dashboard/share/US_REUIASDQVJK828QW7K86HIDO29OZDD12C4VMNHBUDIU0QMKSAD481EA4PAOKGVEF?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)`  (first seen in Kane's recording as request 3 of 6)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MYKN3CNBZ52FME5TTGK1Z/dashboard/share/US_FUKCOP1XXUK1S5H5130JUSYKOSPPWB9J5L9C3XX1VG2P4GK6QJ3AV32FTTTCVTBH?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/28eb9ea2-049d-4aea-9b5c-aedae07c88fd/evidence/479b1750-53d7-40b5-9046-4760dbf4e965.evidence`

---
For AI agents: fix the app in `.mutants/m5-jsdelivr-script/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
