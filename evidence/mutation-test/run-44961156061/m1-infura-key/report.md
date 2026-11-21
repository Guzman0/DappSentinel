# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:23:06.135Z
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

**Kane's own DevTools verdict:** ⚠️ inconclusive: Kane did not report this assertion. ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M806NPW0VYKX9CG4QBZEM3AH/dashboard/share/US_XLCLSIEA7JI6USCLA22W0VU1MEPG709UCWQTYBM8SPIBL43JZKJ4EGFIS3W5ZJWT?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: error._

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M806KNB7MZ1Y3P0M7AN5HMBJ/dashboard/share/US_NF45OJVAVRD6KQW0TMXA7EF4VV3V5LJAEP4LUZRGFSCO3M7KGHUXZBGTHY12XVTC?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/88ba3170-b3f9-46e8-87cc-5c898066a5df/evidence/7bd0a276-9286-4dc0-8445-2bbe7c3e9b67.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
