# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:20:23.532Z
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
Kane's own summary: Requested a swap for 0.5 ETH.
Entered 0.5 in the You pay field and confirmed that a positive receive amount (1570.28) and a fee were shown.
Reviewed the confirmation, which showed “You pay 0.5 ETH.”
Confirmed the swap successfully; the page displayed “Swap submitted.”

- `Kane saw "You pay 0.5 ETH" on the confirmation, but the transaction sent to the wallet is for 5 ETH.`

_Source: the transactions the site asked DappSentinel's test wallet to sign while Kane used the swap, compared with what Kane read on the screen._

**Reason:** Objective completed

Values Kane read from the page: `{"you_receive_amount_greater_than_0":"1570.28","fee_shown":"true","confirmation_you_pay_amount":"true","confirm_pay_amount":"You pay 0.5 ETH","swap_submitted_text_visible":"true"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86MDQE7ZDTND8QK4FYSCN61/dashboard/share/US_X7983CAUQ2EI43Z8IB3GW441UWOH7VU2G3BVRORI8X4R24RMHCAXQ3DBLC8ZY6AZ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/003a11ac-84f1-49f5-9d3a-05ab5db4122d`

---
For AI agents: fix the app in `.mutants/m9-hidden-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
