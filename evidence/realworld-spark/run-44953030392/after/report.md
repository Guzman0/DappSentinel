# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T21:51:04.131Z
- Result: **FAILED**, 4 of 5 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Scripts only load from trusted hosts | critical | ❌ failed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The site loads and Kane can browse it | high | ✅ passed |

## What Kane caught

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Finding:** Kane's network recording shows 1 script loaded from 1 untrusted host.

- `https://plausible.io/js/script.js  (from plausible.io)`  (first seen in Kane's recording as request 2 of 46, 0.0 s into Kane's run)

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M801D7V90B0GZACGD18EFKXJ/dashboard/share/US_P31PJD71UZNKG6WIHPNGS1P6VTFR4ENO0N8O2QUHUG2NN6L07ZFWI1U74VWCQQFO?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/759c53a9-31ff-4042-b860-67a3dfab4ff4/evidence/b3c4ca35-3b77-44fa-ad61-3630c7126cd6.evidence`

---
For AI agents: fix the app in `spark-dist/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
