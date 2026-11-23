# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:13:18.192Z
- Result: **FAILED**, 5 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ❌ failed |
| The swap flow works end to end | high | ❌ failed |

## What Kane caught

### ❌ No private keys or seed phrases in browser storage (`storage-secrets`)

**Kane's own DevTools verdict:** ⚠️ inconclusive: Kane did not report this assertion. ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857GS6Q7YY02R622GZF2MRH/dashboard/share/US_4FBA07CA4V6GE7WU445EPJ8Z84LLV0EAQC6GSBRA3ST8W9L6Z83ET5FJJRBIFS74?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: error._

**DappSentinel's exact check:** While Kane used the page, the site saved 2 items in browser storage, including 1 secret any script on the page could read.

- `sessionStorage["backup"] holds a value that looks like a seed phrase`

_Source: browser storage, watched live over the Chrome DevTools Protocol in the Chrome that Kane CLI drove._

Values Kane read from the page: `{"you_receive_amount_check":"3140.55"}`

**How to fix:** Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857EKMJTGPC8NDZR9TZP5JK/dashboard/share/US_JLK2ELD53IRLBRVXVQYGR9K98H1AIHV9MYWYONIK1KDZPSK2JORPHLPFQCTOJM3K?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7e29118a-bab4-4473-a73e-3ba34affc1ef`

### ❌ The swap flow works end to end (`swap-flow`)

**Kane says:** Credits exhausted: {"error":"insufficient credits"}

_Source: Kane CLI assertion in a real browser._

Failed steps:
- agent_info: Credits exhausted: {"error":"insufficient credits"}

**How to fix:** Make sure entering an amount shows a quote, Review swap opens the confirmation, and Confirm swap shows the success message. The transaction sent to the wallet must match the confirmation exactly: the same amount, sent only to your trusted swap contract, with no token approvals for addresses you don't trust.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857FR29W9GCM0RXGBBMHRRK/dashboard/share/US_RG15D3YIB19C7HI8CMQKRQ7S6A9UOXXU2NASF87MRAG35LRCLTVV7IRT5NW5CR0C?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/c51d1e6f-11e8-4d98-9545-0138807f21a1`

---
For AI agents: fix the app in `.mutants/m6-seed-in-session/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
