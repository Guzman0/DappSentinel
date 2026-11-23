# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T21:56:17.589Z
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

**Kane says:** The confirmation screen is using the wrong payment amount: the amount entered was 0.5 ETH, but the displayed confirmation reduces it to 0.05 ETH.
Fix the confirmation amount mapping so it preserves the entered ETH value exactly, and add a test that enters 0.5 ETH and verifies that both the quote and confirmation show 0.5 ETH.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH. — expected: true | observed: {{confirmation_you_pay_amount_check}}

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _Swap confirmation changes 0.5 ETH to 0.05 ETH._ The confirmation screen is using the wrong payment amount: the amount entered was 0.5 ETH, but the displayed confirmation reduces it to 0.05 ETH. Category: `application_issue/ui_data_defect`, 98% confident.

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH."

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH.

Values Kane read from the page: `{"you_receive_amount_check":"1570.28","fee_shown_check":"true","confirm_pay_amount":"0.05 ETH","confirmation_you_pay_amount_check":"false"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M856C1XSKHTHE42NJNHZPT9P/dashboard/share/US_XCFIPA59SB8A0F9MOC37ZKNPHJG5EYFYDD6OQASIA580QLABMLURRAFNNOE18QWC?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/d975a6ae-fff9-401f-b9e9-eb830da0664d`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
