# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:49:37.017Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} goes to a testnet, staging or local endpoint, meanin ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MR1CVHSQEDCFCG6TSMSDF/dashboard/share/US_6G8BUL2DWKBR5TI37LSPQPBYJ88XCBK4RBZ54L4UHUA4C4D2SZ52M9DV909W0957?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MNPD7TA85FZC5RC74B69T/dashboard/share/US_5Y80Y0OBXSA1NOYHB99B8MFRG4FR7JXSH91RD8FDDI83B4SASHGVV6G6D436OLBM?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/25beb3b3-40bb-42f4-b199-5e7170ee5d0c/evidence/a127b463-c575-498f-8eb8-073b5725e4b7.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
