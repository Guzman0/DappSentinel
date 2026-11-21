# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:43:41.211Z
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

**Kane says:** The confirmation screen displays the payment amount with the decimal point in the wrong place.
Fix the confirmation amount formatting so it preserves the entered value of 0.5 ETH, then add a check that the review screen matches the form amount exactly.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: true | observed: {{confirmation_you_pay_0_5_eth}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH"

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH

Values Kane read from the page: `{"you_receive_amount_check":"1570.28","fee_shown":"true","confirmation_you_pay_0_5_eth":"false"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807SVCMQSF5HJ2KY1BHBC5B/dashboard/share/US_54Z07NXJ3RGPV2JFE45BXVRV07YE37ONSLITJTJCW8DJYMFFZ3AISDQDFF8DIOT0?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/b2ae22ae-ed57-42ce-99ca-cf9e290a35dc`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
