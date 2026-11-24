# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:16:26.946Z
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

**Kane says:** The confirmation screen is displaying an amount ten times smaller than the amount entered for the swap.
Do not allow confirmation until the displayed pay amount matches the amount entered. Trace the amount conversion or formatting used when opening the confirmation screen.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: true | observed: {{confirmation_you_pay_amount}}

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Confirmation reduces entered ETH amount by tenfold._ The confirmation screen is displaying an amount ten times smaller than the amount entered for the swap. Category: `application_issue/ui_data_defect`, 99% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH"

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirm_pay_amount":"0.05","confirmation_you_pay_amount":"false"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86M6ND18RJFRQ98YP4NGKG1/dashboard/share/US_0CQXGRWM459963TZKUV3JLMLXEN2L9AUOS7BAYX8MYRZ01VYXUFTCUF7OUG0ONRE?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/6c8cd41b-7463-4a0c-a20b-c52d963179dc`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
