# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T13:14:54.468Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} goes to a testnet, staging or local endpoint, meanin ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86TZAGVD35J84TE7ECY1HRH/dashboard/share/US_W0WYXD1EQQZ34T689LMBNH32PM9JJYXHITGAXQS7NNW8FYYZFR7S51BJ9HFP61Z0?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request to a testnet, staging or local endpoint.

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86TWZQC3EAWAJRQ1YV0ZHC6/dashboard/share/US_UAEX20KJ7KZUVQV5110NRC73ELQ8ASD5H157XDE2YHAA9KRX183HWABGD9HF2ZEH?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/9ad5d780-85e7-40ca-a2b8-40141974fcda/evidence/77f8e0f1-9524-40c9-9394-c9916b193d80.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
