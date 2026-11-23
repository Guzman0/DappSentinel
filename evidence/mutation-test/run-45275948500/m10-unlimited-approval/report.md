# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:14:44.747Z
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

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857J4YZHFSV9267PBJX4K4J/dashboard/share/US_S3YPYC4E4SWX81H9SNJVS7ZMJJJ24MRAJ4TTXBH3C9UM58Y1H6Y08XNDTV1199U2?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/0b7bd23e-c381-4acc-98f9-48840f8d4ae1`

### ❌ The app targets the right chain (`chain-id`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857JERPH7YE94BJ2BH206DA/dashboard/share/US_6XW8EACRJXHLXNZUUBX9V6OLUGVIY2510V0QUEXDBGHWOYW7AH5Q01TBPFAXFV2I?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/ade10362-fd01-4a1c-a591-22e3ddae1325`

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857K2AZT2N35M7APB47M4BC/dashboard/share/US_VFOG3O7A7LA94MLKUVXQZXA1891Y8Q4DQIZANCYF3NI8R12O842E6YS1CWWCLPOX?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/6d75c99e-b57d-4b05-9e07-9ab2494047b4`

---
For AI agents: fix the app in `.mutants/m10-unlimited-approval/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
