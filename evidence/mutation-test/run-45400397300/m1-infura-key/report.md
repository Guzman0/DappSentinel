# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T13:14:21.640Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: No URL in {{page_requests}} contains an RPC provider API key, such as a long key ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86TZ5PNRE56SZ62CH2XVZP4/dashboard/share/US_OGFZRY3B79OGMZDJGS1V0ZM23279XXVTEK21DFVTVNN48QK2TGDONOYILXKKHFLD?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request carrying an RPC API key in the URL.

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86TWR6T1PAA2B33KTHC9H7T/dashboard/share/US_2WCRLE83A6Z4TV8C6NO7R410ONNSG161F9F6Q6XO6L2CIIAGEX202L1D0IV9X4VV?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/225d028c-c78e-49a7-83ad-8a7e82239836/evidence/d0c01392-124e-49c0-8e0e-71415a8a90c7.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
