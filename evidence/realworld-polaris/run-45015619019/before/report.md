# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T11:10:20.663Z
- Result: **FAILED**, 1 of 5 checks passed

| Check | Severity | Result |
|---|---|---|
| No RPC API keys in network requests | critical | ⚠️ error |
| No testnet, staging or local endpoints in a mainnet build | critical | ⚠️ error |
| Scripts only load from trusted hosts | critical | ⚠️ error |
| No private keys or seed phrases in browser storage | critical | ✅ passed |
| The site loads and Kane can browse it | high | ❌ failed |

## What Kane caught

### ❌ No RPC API keys in network requests (`rpc-key-leak`)

**Finding:** Inconclusive: the "browse" run did not pass (The page tried to get market and account data from a local service, but that service was not accepting connections.
Star), so the recording may not cover the real page.

**Kane's own DevTools verdict:** ✅ passed: assert: no network request URL contains an RPC provider API key, such as a long key afte ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F3DCH712XRXDN6ZVB6Y2G/dashboard/share/US_LWR2ZN5SFWWRPCVFZ7CJKNQUVISGONQVTF62G7Z9PCKL3B040WIX7FHI8RPW2KCP?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: passed._

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F1XQ0AJY5MDZMP439FB5M/dashboard/share/US_SA7I2IC8N16I19YD9JL3ACXASOH2IDBUJGMDISTWLQJCJ5UZQM2YFBA6NJDW4OBJ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/3754284c-75ca-48eb-b235-3ed7d40a87a0/evidence/be294a5b-a637-416c-9ee4-fc3b5b735ef9.evidence`

### ❌ No testnet, staging or local endpoints in a mainnet build (`testnet-rpc`)

**Finding:** Inconclusive: the "browse" run did not pass (The page tried to get market and account data from a local service, but that service was not accepting connections.
Star), so the recording may not cover the real page.

**Kane's own DevTools verdict:** ❌ failed: assert: no network request was made to a testnet, staging or local endpoint, meaning a h ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F3DCH712XRXDN6ZVB6Y2G/dashboard/share/US_LWR2ZN5SFWWRPCVFZ7CJKNQUVISGONQVTF62G7Z9PCKL3B040WIX7FHI8RPW2KCP?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: failed._

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Point every RPC and API call at production endpoints for  (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F1XQ0AJY5MDZMP439FB5M/dashboard/share/US_SA7I2IC8N16I19YD9JL3ACXASOH2IDBUJGMDISTWLQJCJ5UZQM2YFBA6NJDW4OBJ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/3754284c-75ca-48eb-b235-3ed7d40a87a0/evidence/be294a5b-a637-416c-9ee4-fc3b5b735ef9.evidence`

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Finding:** Inconclusive: the "browse" run did not pass (The page tried to get market and account data from a local service, but that service was not accepting connections.
Star), so the recording may not cover the real page.

**Kane's own DevTools verdict:** ✅ passed: assert: every request with resource type script was loaded from one of these domains or ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F4VEH1SBVWWSGRJQ96B7X/dashboard/share/US_HRCKKZDN8R9BXBJ2TF1QCVCUHKKZWGMWZVUUHBCY6YS59H1PJYRLC1LYBMZED2NZ?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: passed._

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F1XQ0AJY5MDZMP439FB5M/dashboard/share/US_SA7I2IC8N16I19YD9JL3ACXASOH2IDBUJGMDISTWLQJCJ5UZQM2YFBA6NJDW4OBJ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/3754284c-75ca-48eb-b235-3ed7d40a87a0/evidence/be294a5b-a637-416c-9ee4-fc3b5b735ef9.evidence`

### ❌ The site loads and Kane can browse it (`browse`)

**Kane says:** The page tried to get market and account data from a local service, but that service was not accepting connections.
Start or restore the local backend on port 3001, then rerun the check after confirming its markets endpoint responds.
evidence: network_failure: GET http://localhost:3001/markets -> None FAILED (net::ERR_CONNECTION_REFUSED)
evidence: network_failure: GET http://localhost:3001/auth/email/me -> None FAILED (net::ERR_CONNECTION_REFUSED)
evidence: console_error: Failed to load resource: net::ERR_CONNECTION_REFUSED

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the page shows its main content and not an error page."

Failed steps:
- assert: the page shows its main content and not an error page.

Values Kane read from the page: `{"page_fits_in_window":"true","main_content_shown":"true","page_taller_than_window":"false","error_page_shown":"true"}`

**How to fix:** The page did not load in a real browser. Check that the URL is right and the site is up.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81F1XQ0AJY5MDZMP439FB5M/dashboard/share/US_SA7I2IC8N16I19YD9JL3ACXASOH2IDBUJGMDISTWLQJCJ5UZQM2YFBA6NJDW4OBJ?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/3754284c-75ca-48eb-b235-3ed7d40a87a0`

---
For AI agents: fix the app in `undefined/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
