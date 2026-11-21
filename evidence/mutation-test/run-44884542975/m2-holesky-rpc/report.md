# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T08:25:19.189Z
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

- `POST https://ethereum-holesky-rpc.publicnode.com/  (matches "holesky")`

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Point every RPC and API call at production endpoints for Ethereum (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Evidence: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M7YK9D78FM9T79X6SD5K5ZXW/dashboard/share/US_F5L5XSB2WBZL9YAUKY8CHGQ59X8NDVA5BG00AEHZKKA0K0KX6AM9L96TZFU3O27H?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/c5c2f0b7-e9ac-416a-bc02-261025d2ccf9/evidence/e31d47de-2c73-4c8a-9b35-7765644ae5c0.evidence`

---
For AI agents: fix the app in `.mutants/m2-holesky-rpc/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
