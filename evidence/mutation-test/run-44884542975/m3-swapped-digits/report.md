# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T08:25:20.218Z
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

**Kane says:** The test did not store the address it read from the page before running the final check, so the check received '{{usdc_contract_address_check}}' rather than the page value.
Update the test to capture the displayed USDC contract address into usdc_contract_address_check before asserting it, then compare case-insensitively.
evidence: objective_contradiction: expected: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 | observed: {{usdc_contract_address_check}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

Failed steps:
- assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

Values Kane read from the page: `{"usdc_contract_address_check":"0xA0b86991c6218b63c1d19D4a2e9Eb0cE3606eB48"}`

**How to fix:** Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.

Evidence: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M7YK67ZRP1VKPY2XSNVZFWNF/dashboard/share/US_USOOTA9MHV14ENMYADHEJMUJS9DUH741TEYKYNF5DW3VXYC34XG6SVSR3Z7PD9TL?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/b5a07cec-8eb9-474a-aea7-2361cb2388a3`

---
For AI agents: fix the app in `.mutants/m3-swapped-digits/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
