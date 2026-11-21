# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T08:28:49.174Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ❌ failed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ The app targets the right chain (`chain-id`)

**Kane says:** The network badge is showing the chain ID for a different network while keeping the Ethereum name.
Correct the network badge so that when it says Ethereum it shows chain ID 1, and add a check that prevents the name and chain ID from disagreeing.
evidence: objective_contradiction: Chain ID: 137
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1 — expected: 1 | observed: {{network_badg

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the network badge at the top of the page shows chain ID exactly 1 and the network name Ethereum"

Failed steps:
- assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

Values Kane read from the page: `{"network_badge_chain_id_check":"137","network_badge_network_name_check":"Ethereum"}`

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Evidence: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M7YKDDTJAS41RH1A6Y8D2H41/dashboard/share/US_TO41GHOK74PCX8ST4PJNOO0FWW25S581PDVPYSRXCX2EZUS5FGYWGJLTGR65ZUHF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/dc4c06d4-f20a-4bbf-9018-f59b10f42b9d`

---
For AI agents: fix the app in `.mutants/m4-polygon-chain/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
