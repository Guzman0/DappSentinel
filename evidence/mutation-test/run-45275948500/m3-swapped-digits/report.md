# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-23T22:09:49.897Z
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

**Kane says:** The verification was configured with `{{usdc_contract_address_check}}` as its observed value rather than the text displayed on the page. The screenshots show the requested USDC address is present.
Fix the assertion configuration so it extracts the visible USDC contract text, then compare its full value case-insensitively.

**Kane's diagnosis** (Kane's own triage, shown as its opinion; it doesn't change the verdict): _USDC address assertion uses unresolved check placeholder._ The verification was configured with `{{usdc_contract_address_check}}` as its observed value rather than the text displayed on the page. The screenshots show the requested USDC address is present. Category: `automation_bug/config_issue`, 97% confident.

_Kane's triage blames the test here, but the check failed on what the page showed. Look at the site first: in our mutation test, Kane's triage blamed the test when the site really had a swapped digit._

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

Failed steps:
- assert: the USDC contract address shown on the page is exactly 0xA0b86991c6218b36c1d19D4

Values Kane read from the page: `{"usdc_contract_address_check":"0xA0b86991c6218b63c1d19D4a2e9Eb0cE3606eB48"}`

**How to fix:** Use the exact expected contract address for each token, from one verified source of truth. A single wrong character sends users to a different contract.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M8570PWHMTNZ4Z2GMYW0E00Z/dashboard/share/US_RYV9CPHV1CWWQ8H3FFC9HQS0LFW4FYN039F6VS974ZKEOML9DWTB1SDYRNND0BUP?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/934c0a96-9c92-4bd6-9269-d6d593a9e336`

---
For AI agents: fix the app in `.mutants/m3-swapped-digits/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
