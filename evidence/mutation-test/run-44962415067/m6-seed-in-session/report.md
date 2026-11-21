# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:43:06.401Z
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

**Kane's own DevTools verdict:** ✅ passed: assert: no localStorage value is a private key (64 hexadecimal characters, with or witho ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807TK5KKASCV2QZN89K9H46/dashboard/share/US_GAP6YBVNUGM64770THFA62YR1APU49UR4PSNGPV2MGP69KUD4P0YRCH3NJ1TFQBF?type=summary&agentView=true&fqdn=summary-page))

_DappSentinel's exact check found it; Kane's DevTools assertion passed._

- `sessionStorage["backup"] holds a value that looks like a seed phrase`

_Source: browser storage, watched live over the Chrome DevTools Protocol in the Chrome that Kane CLI drove._

Values Kane read from the page: `{"you_receive_amount_greater_than_zero":"3140.55"}`

**How to fix:** Never store private keys, seed phrases or signing secrets in localStorage or sessionStorage. Any script on the page can read them. Keep only public data, such as the wallet address, and leave signing to the wallet.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807QKFWREPWH0JH498N25BE/dashboard/share/US_MGGFDKP5ZCYLNJO70P9UTS62IK9NAQM9BJMQ6ELV9TEYY77XK9ZEOR3L8J28KQZ9?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7489b141-ee4e-440c-89ca-78efcf45d242`

---
For AI agents: fix the app in `.mutants/m6-seed-in-session/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
