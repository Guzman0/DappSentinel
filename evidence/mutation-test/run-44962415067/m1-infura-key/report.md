# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:39:26.756Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no network request URL contains an RPC provider API key, such as a long key afte ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807J86B4F9DB9D4FR1P7RTG/dashboard/share/US_R36S67BBF3N4R5YCXHW8MM2FUKQWE7FVPMVBPZF2Y7FDCR7PW1YT9T5EHCUX04KB?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807FYBH7ZSWVEMWED1DHZ4W/dashboard/share/US_BH3I2NCLX5GCY512BNOZHVXP94AGL10NPID84MEQX1P41E3QDW9KG6I7RIE3ATSU?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/68b100f7-effc-4ca5-b9c2-ab01ff93c460/evidence/cb3cbcdb-d1c7-4125-90ce-f9e47c7ff9c3.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
