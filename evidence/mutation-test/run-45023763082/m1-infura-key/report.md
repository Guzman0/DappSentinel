# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:48:52.476Z
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

**Kane's own DevTools verdict:** ❌ failed: assert: No URL in page_requests contains an RPC provider API key, such as a long key aft ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MQ0QSDJ6VZ52S4Y526K91/dashboard/share/US_IK0O6QENF2Q2PCQVTI6SRMZPJ8C934C3MTNWUUBC0GXPUI3QLPK1V9M4YIM7WFBY?type=summary&agentView=true&fqdn=summary-page))

_Kane and DappSentinel both found it._

- `POST https://mainnet.infura.io/v3/3f9c…a65`  (first seen in Kane's recording as request 4 of 5)

_Source: network log (HAR) Kane CLI recorded during the "swap-flow" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MN0HK19PDSRB0G8ZDD0A2/dashboard/share/US_U3F2TI0ZVL8W21ST7WIPPWVIIBRKNP5SFAL7OJJ0BXX4RV6E4BDK5FD4BQX55PQT?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/a16a8f29-b2ed-4b1b-b807-9b7850dddacd/evidence/7ef7d945-2ce1-4b1e-ac08-f3ac66a4c3bb.evidence`

---
For AI agents: fix the app in `.mutants/m1-infura-key/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
