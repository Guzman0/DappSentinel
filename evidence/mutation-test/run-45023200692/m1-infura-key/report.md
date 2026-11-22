# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:42:36.053Z
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

**Finding:** Kane's network recording shows 1 request carrying an RPC API key in the URL.

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} contains an RPC provider API key, such as a long key ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MB5XF3BE7Z53PCHBKWTYD/dashboard/share/US_9VGGQWB2PS65KC1BKZBRKIPBURX21CY2W9CB141DUU0C4D8NWR185RN1I42U6UKA?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81M91MJHCWD47PDQPQ8R7JM/dashboard/share/US_OETSN82RI43E774VUDW53OKKOPDSNID03RV54BOXZFCZZM0T7UKFECMQGUUWTCK2?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/3ec41ac4-b14c-409e-b394-c6d5f3a1ffc5/evidence/b3c80e1e-77b3-4755-aba0-b22187c3b97d.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
