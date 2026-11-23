# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:10:23.895Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} contains an RPC provider API key, such as a long key ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M85773HFHB647HK8V1TT1EJN/dashboard/share/US_2690BXX83YI1SZM61US0AOZ1RXGJUSGWHBOPGTM2KW5KN2HBVNFOFCGHQQD3SZZT?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request carrying an RPC API key in the URL.

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M857486JXFY5NMWT373PD4B2/dashboard/share/US_UVD0MLODRC45WOGF5QQ7DRUXNN9UB4T5O33OGY99AT2GI9DT3KTT5TBQZ44CRHLJ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/4be907ee-4486-4f2c-8111-f19b44d91873/evidence/c8af2364-9a8f-4b8e-9e67-d9a1758542eb.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
