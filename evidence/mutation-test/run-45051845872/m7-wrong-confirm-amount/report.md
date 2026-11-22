# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T17:57:17.611Z
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

**Kane says:** After the user enters 0.5 ETH, the review confirmation displays 0.05 ETH instead. The confirmation amount is wrong by a factor of ten.
Correct the review-confirmation amount calculation or formatting so it preserves the entered 0.5 ETH value, then add a test that compares the input amount with the confirmation amount.
evidence: objective_contradiction: You pay 0.05 ETH
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: 0.5 | observed: {{confirmation_you_pay_amount}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH."

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH.

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirmation_you_pay_amount":"0.05"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M826AZT5YNJVP5XCBMTH0QX8/dashboard/share/US_RT9T368DWE1AW6YXXIPZIN0S195YCV15I94VLCT7WTLZK29MWJPNHOWJ87GIZ43U?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/9be67447-a203-4cdd-870e-fcb9c204701d`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
