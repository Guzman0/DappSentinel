# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:16:54.238Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ❌ failed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ No private keys or seed phrases in browser storage (`storage-secrets`)

**Kane's own DevTools verdict:** ✅ passed: assert: no localStorage value is a private key (64 hexadecimal characters, with or witho ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86M8XT6SA83YWGG7F6C7FVN/dashboard/share/US_E76K731TN7PFESLUGC43206KBYSG244SHKD44B3T5NKQA5FAGT7FV7GRZDGJRUPW?type=summary&agentView=true&fqdn=summary-page))

_DappSentinel's exact check found it; Kane's DevTools assertion passed._

**DappSentinel's exact check:** While Kane used the page, the site saved 2 items in browser storage, including 1 secret any script on the page could read.

- `sessionStorage["backup"] holds a value that looks like a seed phrase`

_Source: browser storage, watched live over the Chrome DevTools Protocol in the Chrome that Kane CLI drove._

Values Kane read from the page: `{"you_receive_amount_check":"3140.55"}`

**How to fix:** Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86M543F7CJWJZWNMDHDFJW1/dashboard/share/US_NZ6U7VH25RSUO3YN94CW0EVOOJ40UK6Z2BZS5FLGPXXVEUNV10SETYUJOVEKAJG6?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/28f827eb-a8d5-4e21-8185-2b60093c7370`

---
For AI agents: fix the app in `.mutants/m6-seed-in-session/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
