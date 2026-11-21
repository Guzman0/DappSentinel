# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T08:28:57.829Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ❌ failed |

## What Kane caught

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** The confirmation screen formats the payment amount with the decimal point in the wrong place. The quote's received amount and fee still correspond to the entered 0.5 ETH.
Correct the confirmation amount formatting so it preserves the entered 0.5 ETH value, and add a check that the review and confirmation values match.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH. — expected: 0.5 | observed: {{confirmation_you_pay_amount}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH."

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH.

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirmation_you_pay_amount":"0.05"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Evidence: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M7YKGGMX5M95VJF6MTDW9KDR/dashboard/share/US_I4S6A9R63CYB129W7N13EFYY8ZBZWS1DMEYG5DE6H1HKAY51D0HPW0W9OO6O65QI?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/b9a75f13-b442-43f4-8bac-7499f3469516`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
