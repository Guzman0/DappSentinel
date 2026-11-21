# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T08:28:38.570Z
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

**Finding:** While Kane used the page, the site saved 2 items in browser storage, including 1 secret any script on the page could read.

- `sessionStorage["backup"] holds a value that looks like a seed phrase`

_Source: browser storage, watched live over the Chrome DevTools Protocol in the Chrome that Kane CLI drove._

Values Kane read from the page: `{"you_receive_amount_check":"3140.55"}`

**How to fix:** Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.

Evidence: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M7YKEFS045EC5DHZH0X5X1EC/dashboard/share/US_T0D80VH00NJ5FADDHSR3XHPTLI1OJRR5SRLN6OYN0KT5ISKZ746EUDXJXIJ377FI?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/1c9c1687-15bc-432d-b7d0-5a812a2af64d`

---
For AI agents: fix the app in `.mutants/m6-seed-in-session/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
