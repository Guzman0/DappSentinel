# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:15:29.803Z
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

**Kane says:** The network badge is using the wrong chain number while displaying the Ethereum name.
Correct the network configuration or badge mapping so that Ethereum is shown with chain ID 1, then add a page-load check that verifies the displayed name and chain ID agree.
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Network badge labels chain ID 137 as Ethereum._ The network badge is using the wrong chain number while displaying the Ethereum name. Category: `application_issue/ui_data_defect`, 98% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the network badge at the top of the page shows chain ID exactly 1 and the network name Ethereum."

Failed steps:
- assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

Values Kane read from the page: `{"network_badge_chain_id_check":"137","network_badge_network_name_check":"Ethereum"}`

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86M1P0ER2J4ZT0AFRHRG0QW/dashboard/share/US_64DTAGWCTD3GWB81SLVDAJTQS4Z4VW846PX13CWO016YGBFO8UCGOMF0D0ZPPFXS?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/8cd20930-f73b-4a37-8970-3347e7f4ba47`

---
For AI agents: fix the app in `.mutants/m4-polygon-chain/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
