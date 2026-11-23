# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:02:52.756Z
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

**Kane says:** Kane passed this check, but what the user sees is not what the wallet is asked to sign.
Kane's own summary: Requested a swap of 0.5 ETH.
Entered 0.5 in the payment amount; the page showed 1,570.28 in the receive field and displayed a 0.3% fee.
Reviewed the swap confirmation, which showed “You pay 0.5 ETH.”
Confirmed the swap successfully; the page displayed “Swap submitted.”

- `The site asks the wallet to let 0x9f2c4b7a1e3d5f8c0a6b2d4e7f1a3c5b8d0e2f4a spend all of the token at USDC (0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48), and 0x9f2c4b7a1e3d5f8c0a6b2d4e7f1a3c5b8d0e2f4a is not one of your trusted contracts.`

_Source: the transactions the site asked DappSentinel's test wallet to sign while Kane used the swap, compared with what Kane read on the screen._

**Reason:** Objective completed

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirmation_you_pay_amount":"0.5 ETH","confirm_pay_amount":"0.5 ETH","swap_submitted_text_visible":"true"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M856Q75NGY6XEBVNMM8BPVB5/dashboard/share/US_TVORPKYQ3JVUJUJCVLWVGUS75BYB39LE7O82RT3LS3ZVK3IQ02JMN9K4G0KMNZZZ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/4a236618-3768-460c-83b5-f08ec4b3c67d`

---
For AI agents: fix the app in `.mutants/m10-unlimited-approval/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
