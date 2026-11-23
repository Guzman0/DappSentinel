# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T21:56:48.631Z
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
Kane's own summary: Entered 0.5 ETH in the You pay field on the swap page.
Verified that the swap would return 1,570.28 USDC and displayed a 4.73 USDC fee before reviewing the swap.
Reviewed the confirmation, which showed “You pay 0.5 ETH.”
Confirmed the swap successfully; the page displayed “Swap submitted.”

- `The site asks the wallet to send 0.5 ETH to 0x9f2c4b7a1e3d5f8c0a6b2d4e7f1a3c5b8d0e2f4a, which is not one of your trusted contracts.`

_Source: the transactions the site asked DappSentinel's test wallet to sign while Kane used the swap, compared with what Kane read on the screen._

**Reason:** Objective completed

Values Kane read from the page: `{"you_receive_amount_check":"1570.28","fee_shown_check":"true","confirmation_you_pay_amount_check":"true","confirm_pay_amount":"0.5 ETH","swap_submitted_text_visible":"true"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M856CNNSN04ECHBXNKQE0KYB/dashboard/share/US_2Y2IYNHKQOPZSA6P2XIF4ZHQUAFK6XXOPUW6X6NAFANTBZ6DAG7K0MSHUTU8RBE3?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/1b5ea831-8df0-4203-9b8e-9a3652c71966`

---
For AI agents: fix the app in `.mutants/m8-wrong-recipient/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
