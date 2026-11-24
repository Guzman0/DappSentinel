# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:11:23.607Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ❌ failed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ No RPC API keys in network requests (`rpc-key-leak`)

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} contains an RPC provider API key, such as a long key ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86KXBMAFQZKG29D2VT1EGPP/dashboard/share/US_TIVXQSO73D6W5YVHP0OVXJ534EQBOP5C2IAZCCHZQJBBT4VNRTXPS60LIXVO9LES?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request carrying an RPC API key in the URL.

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86KTQ4C5WQHV6567Q405A6J/dashboard/share/US_KP8GSORAHYAZ8UXW9WYXCDX6JRKTTBOSDFH2HUH2N4SRP433AXVBNXH5OE8WI161?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/3f1f9ecb-55fe-4730-b965-44d19098bac8/evidence/ee4baed3-3164-4766-ac9b-cfce489c64ce.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
