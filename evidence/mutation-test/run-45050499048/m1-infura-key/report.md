# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T17:43:33.312Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: no URL in {{page_requests}} contains an RPC provider API key, such as a long key ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M825HW7SEBY86WAHZYS6JFTE/dashboard/share/US_1QG430IZTE3IZ53MZD2Q38AT1X2ZRZPRNWRET5MJSRAFXHMCLSN3STF1GP1U9Z4L?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M825FRS03FV3R1P79V3J2NB3/dashboard/share/US_8FNAROMBLHRO6NBZMH7Q7GFUQ7MTSTRQZITSJUCJ0A4OF0DKEK39PYIX42T8EVKD?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/cf6f51a4-6d2c-44e9-bc5f-1e5d3f265a7b/evidence/9e76e402-db7d-4c85-9a83-4323d193176b.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
