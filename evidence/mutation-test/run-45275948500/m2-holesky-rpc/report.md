# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:11:11.208Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} goes to a testnet, staging or local endpoint, meanin ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M85782001GKS0P6TGPV3RQE4/dashboard/share/US_VOFTFXC4HRYJ6B0QNLWTTV3E30ARQA7MQ96SMOPP07GDCJ67OJ9RW4BZOKHRMYUS?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request to a testnet, staging or local endpoint.

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`  (first seen in Kane's recording as request 5 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M8574S3PE89FX096YKZS71TT/dashboard/share/US_C66MKXXXZKSLLFGU28GK2W19ACZB5V2I3WKJ9CVXSKOCSPUOMVM3GWP7GFYI5U67?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/f2d758c1-138b-42a2-b7aa-9f03e3072403/evidence/a7b04d11-d201-4e01-82d2-4882ab7500e8.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
