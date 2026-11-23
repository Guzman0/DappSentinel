# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T12:37:31.671Z
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

**Kane says:** The confirmation screen displays the payment amount with its decimal point in the wrong place.
Fix the confirmation amount formatting so it preserves the exact ETH amount entered and quoted; add a test that enters 0.5 ETH and verifies the confirmation says 0.5 ETH.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: true | observed: {{confirmation_you_pay_amount}}

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Swap confirmation shifts ETH amount decimal point._ The confirmation screen displays the payment amount with its decimal point in the wrong place. Category: `application_issue/ui_data_defect`, 99% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH"

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirm_pay_amount":"0.05 ETH","confirmation_you_pay_amount":"false"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M846DQVS7ZFZ7B7EWACKYNF1/dashboard/share/US_7B2BRILCD3SR4K4LNQXK4UEPTXEC5XVYQULI5EPEWWBSP0YRBSN4L6O2QPSUOGEL?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/82cd26ab-9200-4be1-818a-6de2d6a56a36`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
