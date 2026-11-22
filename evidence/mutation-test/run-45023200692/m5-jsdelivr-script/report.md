# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:42:28.134Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: every entry in page_requests with resource type script was loaded from one of th ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MBAB4H1T2KYY89NZ3DR0Z/dashboard/share/US_HBA8NJZ6NC83SVN1H1XWHM8T8DBGYWT04UDDOI6GNGA8Y3M2KBH4L3LAS270CK0H?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)`  (first seen in Kane's recording as request 3 of 6)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81M93GC5YT838N7YGV6PG63/dashboard/share/US_X7SHCBIQSECSY5ABJLNHGN8VPZLC9SRJ45T1N54MS45CF63TRI44D48DIIN83ECF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/497f8c4d-0ec5-4e67-9f57-739b5045ba7c/evidence/c71e53e5-96fe-44be-9179-0d69002eef7e.evidence`

---
For AI agents: fix the app in `.mutants/m5-jsdelivr-script/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
