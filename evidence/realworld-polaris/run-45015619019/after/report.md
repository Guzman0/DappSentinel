# DappSentinel report

- Site: http://localhost:4173
- Run at: 2026-11-22T11:15:31.782Z
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

**Finding:** Inconclusive: the "browse" run did not pass (The market and sign-in service does not permit requests from this site, so the page cannot retrieve the data required to), so the recording may not cover the real page.

**Kane's own DevTools verdict:** ✅ passed: assert: no network request URL contains an RPC provider API key, such as a long key afte ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FE5NNP37NFQVJNT9GPXPG/dashboard/share/US_LUJ16NLNA3KQG0AVDIMOUY9151GD0JJ71T0A12CXKRWYETC83ARWAH2OLITYXCMQ?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: passed._

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove provider API keys from frontend code. Use a keyless public RPC for read calls, or route keyed calls through a server-side proxy. Treat any key that was shipped as leaked and rotate it.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FCEAZMKWV1SBRJF2Y7ZMC/dashboard/share/US_BMZ5TXGSV7QBSFZY4X61645DEXZ7CEK1546AUZM1FBSTGXNLCRZVIIDPGHJW8HYF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/d85abc60-3ad7-49d6-838c-823618bed576/evidence/da08a657-c39a-4214-9ae2-46000fbad16d.evidence`

### ❌ No testnet, staging or local endpoints in a mainnet build (`testnet-rpc`)

**Finding:** Inconclusive: the "browse" run did not pass (The market and sign-in service does not permit requests from this site, so the page cannot retrieve the data required to), so the recording may not cover the real page.

**Kane's own DevTools verdict:** ✅ passed: assert: no network request was made to a testnet, staging or local endpoint, meaning a h ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FE5NNP37NFQVJNT9GPXPG/dashboard/share/US_LUJ16NLNA3KQG0AVDIMOUY9151GD0JJ71T0A12CXKRWYETC83ARWAH2OLITYXCMQ?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: passed._

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Point every RPC and API call at production endpoints for  (chain ID 1). Load endpoints from one config per environment so testnet URLs cannot ship to production.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FCEAZMKWV1SBRJF2Y7ZMC/dashboard/share/US_BMZ5TXGSV7QBSFZY4X61645DEXZ7CEK1546AUZM1FBSTGXNLCRZVIIDPGHJW8HYF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/d85abc60-3ad7-49d6-838c-823618bed576/evidence/da08a657-c39a-4214-9ae2-46000fbad16d.evidence`

### ❌ Scripts only load from trusted hosts (`unknown-scripts`)

**Finding:** Inconclusive: the "browse" run did not pass (The market and sign-in service does not permit requests from this site, so the page cannot retrieve the data required to), so the recording may not cover the real page.

**Kane's own DevTools verdict:** ✅ passed: assert: every request with resource type script was loaded from one of these domains or ([Kane's run](https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FE5NNP37NFQVJNT9GPXPG/dashboard/share/US_LUJ16NLNA3KQG0AVDIMOUY9151GD0JJ71T0A12CXKRWYETC83ARWAH2OLITYXCMQ?type=summary&agentView=true&fqdn=summary-page))

_Kane's DevTools verdict: passed._

_Source: network log (HAR) Kane CLI recorded during the "browse" run._

**How to fix:** Remove scripts loaded from third-party CDNs, or bundle them with the app. Every script that runs on a dApp page can read and change what the user signs, so drainers are often injected this way.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FCEAZMKWV1SBRJF2Y7ZMC/dashboard/share/US_BMZ5TXGSV7QBSFZY4X61645DEXZ7CEK1546AUZM1FBSTGXNLCRZVIIDPGHJW8HYF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/d85abc60-3ad7-49d6-838c-823618bed576/evidence/da08a657-c39a-4214-9ae2-46000fbad16d.evidence`

### ❌ The site loads and Kane can browse it (`browse`)

**Kane says:** The market and sign-in service does not permit requests from this site, so the page cannot retrieve the data required to display its main content and instead reaches an error state.
Allow requests from the site’s address in the service configuration, then verify that the market request succeeds and the page replaces the loading or error state with market content.
evidence: console_error: Access to fetch at 'https://polaris-oracle-api.fly.dev/markets' from origin 'http://localhost:4173' has been blocked by 
evidence: objective_contradiction: check FAILED: The page shows its main content. — expected: true | observed: {{main_content_visible}}
evidence: objective_contradiction: check FAILED: The page does not show an error page. — expected: false | observed: {{error_page_visible}}

_Source: Kane CLI assertion in a real browser._

**Reason:** Final verification failed: "the page shows its main content and not an error page"

Failed steps:
- assert: the page shows its main content and not an error page

Values Kane read from the page: `{"page_fits_in_window":"true","main_content_visible":"true","page_taller_than_window":"false","error_page_visible":"true"}`

**How to fix:** The page did not load in a real browser. Check that the URL is right and the site is up.

Watch Kane's run, step by step: https://test-manager.lambdatest.com/projects/01M7R0YTPWWNWG8JS3JMSCYY44/test-cases/01M81FCEAZMKWV1SBRJF2Y7ZMC/dashboard/share/US_BMZ5TXGSV7QBSFZY4X61645DEXZ7CEK1546AUZM1FBSTGXNLCRZVIIDPGHJW8HYF?type=summary&agentView=true&fqdn=summary-page

Local evidence: `/home/runner/.testmuai/kaneai/sessions/d85abc60-3ad7-49d6-838c-823618bed576`

---
For AI agents: fix the app in `undefined/` so these checks pass, then run `npm run sentinel` again. Do not edit `checks/` or `sentinel.config.json` to make a check pass.
