# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:13:20.029Z
- Result: **FAILED**, 5 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ❌ failed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ❌ failed |

## What Kane caught

### ❌ The app targets the right chain (`chain-id`)

**Kane says:** The page loaded successfully, but the network badge is showing the wrong chain number for Ethereum.
Fix the network badge configuration so that Ethereum is paired with chain ID 1, then verify the displayed name and chain ID are taken from the same network setting.
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows chain ID exactly 1. — expected: 1 | observed: {{network_bad
evidence: objective_contradiction: check FAILED: the network badge at the top of the page shows the network name Ethereum. — expected: Ethereum | observed:

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Network badge displays Polygon chain ID while labeled Ethereum._ The page loaded successfully, but the network badge is showing the wrong chain number for Ethereum. Category: `application_issue/ui_data_defect`, 98% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the network badge at the top of the page shows chain ID exactly 1 and the network name Ethereum."

Failed steps:
- assert: the network badge at the top of the page shows chain ID exactly 1 and the networ

Values Kane read from the page: `{"network_badge_network_name_check":"Ethereum","network_badge_chain_id_check":"137"}`

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857CJ21F3XET8S0XJPYATRA/dashboard/share/US_WC64USFJ9WVH89WBS9M3K3CQSWL6PWO4NXUY9Y7373YGGHL04EABSSQL5S066C67?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/aa3e62ca-f814-415d-bc22-e6751da48d0d`

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

Values Kane read from the page: `{"you_receive_amount_check":"1570.28","fee_shown_check":"true","confirmation_you_pay_amount_check":"true"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857ETXFCDQ13TV181SJVHF1/dashboard/share/US_JHRDC5PTULO3K8FKO5B5CGC6WC0JVBZF0ZFOZ17JG5VPVPC7JVD8T6AHHXBZ8RDT?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/27849860-5f55-4c4a-b8ae-9aa10a0a5aa6`

---
For AI agents: fix the app in `.mutants/m4-polygon-chain/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
