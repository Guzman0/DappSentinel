# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:42:37.914Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ❌ failed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ No testnet, staging or local endpoints in a mainnet build (`testnet-rpc`)

**Finding:** Kane's network recording shows 1 request to a testnet, staging or local endpoint.

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} goes to a testnet, staging or local endpoint, meanin ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MB8A2BMS0EX9XYHJJJETF/dashboard/share/US_MPQ67X3DYTRHDF4ZM1C9RGD8Z8K9STGUBGB0M2TPEF5HV40LS9IMUV598PIQ8KIH?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81M8ZCDWTADJR51BAMVDACT/dashboard/share/US_3V3PF0BAEVNM8EQ9WZSKWM0S3HC3D43UVQ544JR7UO00NHA4OQK0YXSZ25HZZCF8?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/67007bf4-c940-4db4-8361-0963dc708d83/evidence/07105063-191f-4a0d-a706-c8f9645e245d.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
