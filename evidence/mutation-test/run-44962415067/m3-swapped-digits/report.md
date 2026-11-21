# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T23:38:36.757Z
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

**Kane says:** The address-check value was not filled in by the test. The page's displayed address ends in `B48`, while the assertion recorded `{{usdc_contract_address_check}}` as what it observed.
Fix the assertion to read the USDC contract-address text from the page directly, or define `usdc_contract_address_check` before running the check.
evidence: objective_contradiction: check FAILED: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 — expect

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

Failed steps:
- assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

Values Kane read from the page: `{"usdc_contract_address_check":"0xA0b86991c6218b63c1d19D4a2e9Eb0cE3606eB48"}`

**How to fix:** Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M807C49JPCJZPTEKQS10NS8Y/dashboard/share/US_5Q5A4V976NAYHMEFU6NRPTCXACUXYZAQF4HQCEOF1DIU2GVUK2M01O38SXEDXV3Q?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/b950cb3b-cdd0-4588-9856-1d58b31258d1`

---
For AI agents: fix the app in `.mutants/m3-swapped-digits/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
