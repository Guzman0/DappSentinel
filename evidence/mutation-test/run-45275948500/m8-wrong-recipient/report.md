# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:14:22.556Z
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

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857HWEE8YA334F8R4DJJEJZ/dashboard/share/US_F2LRYSH9Z7VZ1KMRFTP8WB93427EB17ALMV5EU4G44NCPN8KLR559E56D0SNYFBL?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/59e3b480-3596-4008-9510-2632d2fd5c08`

### ❌ The app targets the right chain (`chain-id`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Set the chain ID to 1 (Ethereum) in the app config, and make the network badge read it from that single config.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857J3GRDXFNW0EC3FM2F3BV/dashboard/share/US_YL8WS408PF2XEWX9EYVODY3RSY0AIVP8Q7R7SWBOCAA8FMDP6HWQNOATOHUNIS40?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/58a2a759-9655-4779-9a60-6628d7c85ee6`

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857JH5QPWV3Q54A685GVY9J/dashboard/share/US_DCHERQP5FGI07DVW8LL85F4PCPAO33ASA9LU5F6OD8IPFR4LJA8T16SL96GXXMXI?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/aceeabc4-751e-4c92-92b4-f5126a187b21`

---
For AI agents: fix the app in `.mutants/m8-wrong-recipient/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
