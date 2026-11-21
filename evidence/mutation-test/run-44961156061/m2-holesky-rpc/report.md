# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:22:58.659Z
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

**Kane's own DevTools verdict:** ⚠️ inconclusive: Kane did not report this assertion. ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M806NNVA4S8HPZ9AAHY85W6T/dashboard/share/US_U4U76UMS3C8TBWZNG9MA7S75TAOR2YOPSQG6BRTEXI793P3YBZ84KKYEIVUSP3E9?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: error._

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M806KN66A8V2N752PQBTQ628/dashboard/share/US_YNE2XXMZTM9JYHKZAGU9UFXS2P8APGW5PWICK343DLH1BKF6OH19249JSDIA0FBY?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/af540408-ae5a-414b-a862-b5c0c9daf913/evidence/1b51b255-9dfb-4cc2-aba0-321b57be59c3.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
