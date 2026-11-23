# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T21:57:27.137Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} contains an RPC provider API key, such as a long key ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M856F5VQXAFE2ZP2GH375PDQ/dashboard/share/US_MFBA23FPUBDBS0VPYCXIH0NMIPGIV7EXL1W1GXA58TSGSV5RSSEBZO5LPGYVD8FW?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 request carrying an RPC API key in the URL.

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M856CC5799MA8YG05VJMXNGT/dashboard/share/US_22KWJ2U8JBM5NY34DUEQW9TAEJ09M9KHTMACGSIVDGKO57H7WHX8SNI7BOHGWZGU?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/f4e3ae57-9ab2-4339-b3a0-3e801e32a742/evidence/581d8730-047e-4dd1-be73-572cea54d086.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
