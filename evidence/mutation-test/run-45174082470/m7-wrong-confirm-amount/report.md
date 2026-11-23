# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T12:30:04.365Z
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

**Kane says:** The confirmation screen is displaying the payment amount with the decimal point in the wrong place.
Correct the confirmation amount formatting or value mapping so it preserves the entered 0.5 ETH amount, then add a check that the confirmation payment amount matches the entered amount exactly.
evidence: objective_contradiction: check FAILED: The confirmation shows You pay 0.5 ETH. — expected: 0.5 ETH | observed: {{confirmation_you_pay_amount}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH"

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirm_pay_amount":"0.05 ETH","confirm_pay_amount_2":"0.05 ETH","confirmation_you_pay_amount":"0.05 ETH"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M84609176C4RZ9D8CWZM8G3Z/dashboard/share/US_WI87SD4AFHZ2PLFZ3MAH3V3NIWX5ODIU0JS88ULDN2TUT26W4ZYMR4GY24FGT8J1?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/9ca08d24-8f05-47ef-9543-c7954e6fc1b0`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
