# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:52:35.934Z
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

**Kane says:** The page loaded a network badge with the wrong chain number. The name says Ethereum, but the displayed chain ID is 137 instead of 1.
Correct the network configuration or badge data source so Ethereum mainnet displays chain ID 1, then add a load-time check that the name and chain ID agree.
evidence: objective_contradiction: check FAILED: The network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad
evidence: objective_contradiction: check FAILED: The network badge at the top of the page shows the network name Ethereum. — expected: Ethereum | observed:

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the network badge at the top of the page shows chain ID exactly 1 and the network name Ethereum."

Failed steps:
- assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

Values Kane read from the page: `{"network_badge_chain_id_check":"137","network_badge_network_name_check":"Ethereum"}`

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MV89Y1JW9Y88XPSDQM719/dashboard/share/US_EZQ4G4QYBR1PVV91M6NRTS6XL1UVGXUB3LAN07RIKLM0F8U47PB44VFX0NVO2HO8?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/ba731d5f-f76c-4691-aa85-c6a8c19cdc27`

---
For AI agents: fix the app in `.mutants/m4-polygon-chain/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
