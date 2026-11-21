# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-21T21:47:13.198Z
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

**Finding:** Inconclusive: the "browse" run did not pass (The page tries to use an external Ethereum data service from the browser, but that service does not allow requests from ), so the recording may not cover the real page.

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M80167R0Z3X0W314NSXNMJNS/dashboard/share/US_IW97RZM9D6SIBSO1A80RI2NC2IW5BLSFZ5UUZZ3QLMKZWO6MZU9J973SDQN3V0LG?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7370188e-6452-437b-8e43-b3018e7e3807/evidence/9d2c92ac-fbfe-4940-92a6-8dfad1ede23d.evidence`

### ❌ No testnet, staging or local endpoints in a mainnet build (`testnet-rpc`)

**Finding:** Inconclusive: the "browse" run did not pass (The page tries to use an external Ethereum data service from the browser, but that service does not allow requests from ), so the recording may not cover the real page.

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Point every RPC and API call at production endpoints for  (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M80167R0Z3X0W314NSXNMJNS/dashboard/share/US_IW97RZM9D6SIBSO1A80RI2NC2IW5BLSFZ5UUZZ3QLMKZWO6MZU9J973SDQN3V0LG?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7370188e-6452-437b-8e43-b3018e7e3807/evidence/9d2c92ac-fbfe-4940-92a6-8dfad1ede23d.evidence`

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Finding:** Inconclusive: the "browse" run did not pass (The page tries to use an external Ethereum data service from the browser, but that service does not allow requests from ), so the recording may not cover the real page.

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M80167R0Z3X0W314NSXNMJNS/dashboard/share/US_IW97RZM9D6SIBSO1A80RI2NC2IW5BLSFZ5UUZZ3QLMKZWO6MZU9J973SDQN3V0LG?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7370188e-6452-437b-8e43-b3018e7e3807/evidence/9d2c92ac-fbfe-4940-92a6-8dfad1ede23d.evidence`

### ❌ The site loads and Kane can browse it (`browse`)

**Kane says:** The page tries to use an external Ethereum data service from the browser, but that service does not allow requests from this page's address. The app cannot load its required data and shows an error screen.
Configure the external data service or a same-origin server-side proxy to allow the app's requests, then verify that the page renders its normal content when that service is unavailable or blocked.
evidence: console_error: Access to fetch at 'https://eth-mainnet.g.alchemy.com/v2/WVOC…-9L' from origin 'http://localhost
evidence: objective_contradiction: check FAILED: the page shows its main content — expected: true | observed: {{main_content_shown}}
evidence: objective_contradiction: check FAILED: the page does not show an error page — expected: false | observed: {{error_page_shown}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the page shows its main content and not an error page"

Failed steps:
- assert: the page shows its main content and not an error page

Values Kane read from the page: `{"page_fits_in_window":"true","main_content_shown":"true","error_page_shown":"true","page_taller_than_window":"false"}`

**How to fix:** The page did not load in a real browser. Check that the URL is right and the site is up.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M80167R0Z3X0W314NSXNMJNS/dashboard/share/US_IW97RZM9D6SIBSO1A80RI2NC2IW5BLSFZ5UUZZ3QLMKZWO6MZU9J973SDQN3V0LG?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/7370188e-6452-437b-8e43-b3018e7e3807`

---
For AI agents: fix the app in `spark-dist/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
