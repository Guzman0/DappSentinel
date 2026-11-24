# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:21:27.383Z
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
Kane's own summary: Completed the requested swap of 0.5 ETH.
Entered 0.5 in the You pay field and verified that the receive amount was 1,570.28 with a fee displayed.
Reviewed the confirmation, which showed You pay 0.5 ETH.
Confirmed the swap; the page displayed “Swap submitted.”

- `The site asks the wallet to let 0x9f2c4b7a1e3d5f8c0a6b2d4e7f1a3c5b8d0e2f4a spend all of the token at USDC (0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48), and 0x9f2c4b7a1e3d5f8c0a6b2d4e7f1a3c5b8d0e2f4a is not one of your trusted contracts.`

_Source: the transactions the site asked DappSentinel's test wallet to sign while Kane used the swap, compared with what Kane read on the screen._

**Reason:** Objective completed

Values Kane read from the page: `{"you_receive_amount_greater_than_zero":"1570.28","fee_shown":"true","confirmation_you_pay_amount":"0.5 ETH","confirm_pay_amount":"0.5 ETH","swap_submitted_visible":"true"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86MFNH50JZFPYXP0Y94MBY7/dashboard/share/US_HKNNQX35GDBJVX3AHAX9D6OYKCKG2FYNKI270B99HE585Z2A6RTFIE38RV506UAV?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/bbaf5b7d-99e5-40d3-a816-c057a056be96`

---
For AI agents: fix the app in `.mutants/m10-unlimited-approval/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
