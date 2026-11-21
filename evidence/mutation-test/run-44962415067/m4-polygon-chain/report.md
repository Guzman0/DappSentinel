# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:43:01.207Z
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

**Kane says:** The page displays incompatible network details: the badge names Ethereum but shows chain ID 137, which is not Ethereum's chain ID.
Correct the network configuration or badge mapping so that Ethereum is displayed with chain ID 1, then rerun the check after page load.
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the network badge at the top of the page shows chain ID exactly 1 and the network name Ethereum."

Failed steps:
- assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

Values Kane read from the page: `{"network_badge_chain_id_check":"137","network_badge_network_name_check":"Ethereum"}`

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807NWPMK6JR3Y0DRDP4TCY7/dashboard/share/US_G5YBRH1PUPHQIYD2QAE15RQXC6TDJ3JA96H01LITPKLSDS4RZQ4Y2CQNYGAE4FYR?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/4e65d46b-1970-4879-89f7-dce2e0774259`

---
For AI agents: fix the app in `.mutants/m4-polygon-chain/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
