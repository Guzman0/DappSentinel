# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:14:40.057Z
- Result: **FAILED**, 4 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ❌ failed |
| The app targets the right chain | high | ❌ failed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ❌ failed |

## What Kane caught

### ❌ Displayed contract addresses match the expected ones (`contract-address`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857J0714ZH2WV0066KVFV1J/dashboard/share/US_D7G4GJBQFH6QLTINYZW81TQWTXYYUGDFCOAQKF2VR24JEX8BS50INHZGW030L3DI?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/fbbeb5f5-3c35-47bb-b7cf-5fb1857d30df`

### ❌ The app targets the right chain (`chain-id`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857JA2H7F4SNJ9RR3YM10KN/dashboard/share/US_MESYS4YJ9CTZ0FE3KYE1ITLH7XJWPVAWFWZ6TJDTOFUDGP122MU3GV62JOZRCTGR?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/b504a5ca-e51f-43d4-b487-0c46f7d7fc2e`

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857JXHJNP03RJBQG34R8Y1Y/dashboard/share/US_W4DJ2EDPCF1WLYS537IPPXUMDNENA81MHLVTN2FXZYYSPYJBB67QR7FQXZ9F76RG?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/cb690f60-96a1-4c71-8bf1-3ae08b0ab193`

---
For AI agents: fix the app in `.mutants/m9-hidden-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
