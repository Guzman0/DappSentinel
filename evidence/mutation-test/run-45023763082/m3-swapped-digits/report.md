# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T12:48:25.788Z
- Result: **FAILED**, 6 of 7 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ✅ passed |
| No testnet, staging or local endpoints in a mainnet build | critical | ✅ passed |
| Displayed contract addresses match the expected ones | critical | ❌ failed |
| The app targets the right chain | high | ✅ passed |
| Scripts only load from trusted hosts | critical | ✅ passed |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The swap flow works end to end | high | ✅ passed |

## What Kane caught

### ❌ Displayed contract addresses match the expected ones (`contract-address`)

**Kane says:** The test check did not read the address from the page. Its observed value was the literal placeholder `{{usdc_contract_address_check}}`, so the check was misconfigured.
Fix the assertion configuration so it extracts the displayed USDC contract address before comparing it, rather than comparing the unresolved placeholder.
evidence: objective_contradiction: check FAILED: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 — expect

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

Failed steps:
- assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

Values Kane read from the page: `{"usdc_contract_address_check":"0xA0b86991c6218b63c1d19D4a2e9Eb0cE3606eB48"}`

**How to fix:** Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81MJ0255MZPDM0KY9X65VT7/dashboard/share/US_3NYB0YW1LLHBV42QSUWS0GMO3TQ5GJIX2DVFK46K9TVFFE6T1Z5F3ULMS25R0OU6?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/a3ed031b-b593-4d2a-8108-088da63dbb7f`

---
For AI agents: fix the app in `.mutants/m3-swapped-digits/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
