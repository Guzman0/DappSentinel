# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T17:56:57.669Z
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

**Kane says:** The confirmation screen used the wrong payment amount, showing one tenth of the amount entered before the swap was confirmed.
Fix the review/confirmation amount mapping so it preserves the exact entered ETH amount, then add a test that compares the entered amount with the displayed confirmation amount.
evidence: objective_contradiction: check FAILED: the confirmation shows You pay 0.5 ETH. — expected: true | observed: {{confirmation_you_pay_0_5_eth_check}

_Source: Kane CLI assertion in a real browser._

**Reason:** Checkpoint assertion failed: "the confirmation shows You pay 0.5 ETH."

Failed steps:
- assert: the confirmation shows You pay 0.5 ETH.

Values Kane read from the page: `{"you_receive_amount_check":"1570.28","fee_shown_check":"true","confirmation_you_pay_0_5_eth_check":"false"}`

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M826AZWJ5567606KD8YDVM3W/dashboard/share/US_FOAIG6UGD5N3ZUI7ZOX4GFHRTSEC3HJ0IHMN3O79889W1VN1BXBR64U4WS4Y5P2Q?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7fbb7317-7e97-42a6-bb52-2bc9607966e2`

---
For AI agents: fix the app in `.mutants/m7-wrong-confirm-amount/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
