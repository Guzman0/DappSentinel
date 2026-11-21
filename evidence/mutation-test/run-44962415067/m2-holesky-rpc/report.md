# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:39:07.487Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no network request was made to a testnet, staging or local endpoint, meaning a h ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807J2CK1792CG6VJ0G98REX/dashboard/share/US_AL9HNQ2UH8LTHV95FD614XCW8CLJCV2NLDUCVYFTM74DVNET3DODUY4L3BX3OUCH?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807FWRCRYZTJ7TEHY46YSV8/dashboard/share/US_IZCADP6EX5L6GFVD6PZFFZ5RXGQGIFFK8A5U4G2XA2TOTDAJQ6OFVV7PMWEI5VI6?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/007f9934-bc81-4370-9485-4bdab0de6bbb/evidence/7a9271a8-2504-4a7c-9ed0-4955bf5b6539.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
