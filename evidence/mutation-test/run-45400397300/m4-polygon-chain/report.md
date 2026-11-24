# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T13:19:54.944Z
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

**Kane says:** The network badge combines the Ethereum name with the wrong chain ID, 137.
Make the badge use Ethereum mainnet’s chain ID, 1, whenever it is labeled Ethereum, and add a page-load check that the name and chain ID come from the same network configuration.
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows the network name Ethereum. — expected: Ethereum | observed:

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Network badge labels Polygon chain ID as Ethereum._ The network badge combines the Ethereum name with the wrong chain ID, 137. Category: `application_issue/ui_state_mismatch`, 99% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the network badge at the top of the page shows chain ID exactly 1 and the network name Ethereum."

Failed steps:
- assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

Values Kane read from the page: `{"network_badge_chain_id_check":"137","network_badge_name_check":"Ethereum"}`

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86V43BF9KMYN31086P9KP2X/dashboard/share/US_A7DZSAD77OTNJ7OT6310I0Q8COPCRNEDCQ7E9AQEP80U0V4HWRO4NAD6B2QDLI3Q?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/16678a1e-d0e0-4ddb-869a-7a10cd80307b`

---
For AI agents: fix the app in `.mutants/m4-polygon-chain/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
