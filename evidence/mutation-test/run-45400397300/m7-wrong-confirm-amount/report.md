# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T13:19:49.460Z
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

**Kane says:** The confirmation screen is showing the payment amount with the decimal point in the wrong place. The quote before review showed 0.5 ETH, but the confirmation showed 0.05 ETH.
Fix the confirmation amount formatting or amount conversion so it carries the entered 0.5 ETH value exactly, then add a test that compares the review and confirmation payment amounts.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: true | observed: {{confirmation_you_pay_0_5_eth}}

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Swap confirmation shifts ETH payment decimal place._ The confirmation screen is showing the payment amount with the decimal point in the wrong place. The quote before review showed 0.5 ETH, but the confirmation showed 0.05 ETH. Category: `application_issue/ui_data_defect`, 99% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH"

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirm_pay_amount":"0.05 ETH","confirmation_you_pay_0_5_eth":"false"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86V8ABCX5KE4DKW2N2A8R3S/dashboard/share/US_DXLCXOY8KCVSX4TVY3GNMVEE9QV33KCFB2ZCVY510XUTB193TZ1R2K6X5PM6VF0C?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/1d1a6975-1996-48b0-8ebe-2d4912311d9c`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
