# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-24T11:10:12.449Z
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

**Kane says:** The test's address check did not capture the text on the page. It used the unresolved value "{{usdc_contract_address_check}}" as the observed result.
Fix the assertion mapping so it reads the USDC contract text from the page, then compare it case-insensitively with the expected address.

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _USDC address assertion resolves to an unreplaced placeholder._ The test's address check did not capture the text on the page. It used the unresolved value "{{usdc_contract_address_check}}" as the observed result. Category: `automation_bug/config_issue`, 98% confident.

_Kane's triage blames the test here, but the check failed on what the page showed. Look at the site first: in our mutation test, Kane's triage blamed the test when the site really had a swapped digit._

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

Failed steps:
- assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

Values Kane read from the page: `{"usdc_contract_address_check":"0xA0b86991c6218b63c1d19D4a2e9Eb0cE3606eB48"}`

**How to fix:** Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M86KQ795WZNF4GEA8V1HDW1M/dashboard/share/US_JSS4OURW3PCOB6AE7G9VMUQDAQ4IK09ELHIEC5F7HHRB3C9IIUCCAW6LERE3K4J7?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/eeb20d40-cc71-4a65-a1ee-1dd5c81f32c1`

---
For AI agents: fix the app in `.mutants/m3-swapped-digits/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
