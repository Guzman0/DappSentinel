# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:15:34.631Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ✅ passed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ❌ failed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Kane's own DevTools verdict:** ❌ failed: assert: every entry in {{page_requests}} with resource type script was loaded from one o ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86M6RWPAX7W1CE6NMJRSDXK/dashboard/share/US_NQL3MF79ZEKRS3U76PNLFMH9Y2IQS18M6Z0AKS2OHYOAZUJFE2AL1ZJJ47YRHUUI?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

**DappSentinel's exact check:** Kane's network recording shows 1 script loaded from 1 untrusted host.

- `https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js  (from cdn.jsdelivr.net)`  (first seen in Kane's recording as request 3 of 6)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86M4GTFC300FQ7WJJ55RNJD/dashboard/share/US_SP9K3Q26GZ0MXEA2M54SHB34XR48XVV9HAZCQXVXZ1ZWQQFQRBTBM7J43S80VKQF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/e551df7a-e6bd-4b59-98a5-c4d3f4c3c058/evidence/6da0f36f-1eef-4543-b1d7-8c68fdaf066a.evidence`

---
For AI agents: fix the app in `.mutants/m5-jsdelivr-script/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
