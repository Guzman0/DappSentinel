# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:11:27.761Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} goes to a testnet, staging or local endpoint, meanin ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86KXEHBR4XV30A7HF61051Z/dashboard/share/US_8IZKOZN6X5QAY8YUI7A42VT6CZ3MGEYLTZ5RHDY8MBXRQXHYR44UNI7EMRG8729P?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request to a testnet, staging or local endpoint.

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86KTVE1H2ACG1ERPZ72ET7V/dashboard/share/US_WPCSFN7KC51NGOZMHZ83UIC45NNRLOMOUFLS1DOPIJ6BGE23D0UP2QLI6GT4CZ80?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/f5ae4750-cc07-4361-8980-4828f409fada/evidence/6ab1b45b-d690-4742-bf36-947b3ef5d1c1.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
