# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:54:21.649Z
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

**Kane says:** The swap confirmation is displaying the payment amount at one tenth of the amount entered.
Fix the value passed from the swap form to the confirmation screen, then add a check that 0.5 ETH remains 0.5 ETH before submission.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH — expected: You pay 0.5 ETH | observed: {{confirmation_you_pay_amou

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH"

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH

Values Kane read from the page: `{"you_receive_amount_check":"1570.28","fee_visible":"true","confirmation_you_pay_amount_check":"You pay 0.05 ETH"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81N0Q98E8XZ7SHS16MCSXJD/dashboard/share/US_RMON1RNEND6KMMTXSSO7RXMFFNNYLPYKXV7P23OJOXS6L3ZOUWZ35MFC5QLHDM2L?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/2d36e9cc-a948-4a1e-aaba-397ef4fc0eb7`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
