# Real-world loop: Polaris, issue #118

Code we didn't write, and a bug already reported on its own issue tracker. [Polaris](https://github.com/PolarisQ-xyz/polaris-frontend) is an open-source (MIT) prediction-market dApp on Stellar, live at polaris-frontend-iota.vercel.app. Its issue [#118](https://github.com/PolarisQ-xyz/polaris-frontend/issues/118), filed 18 Nov 2026 and labelled `security`, says a production build with a missing `NEXT_PUBLIC_*` variable still builds and silently points the site at localhost and testnet.

Workflow: [`.github/workflows/realworld-polaris.yml`](../../.github/workflows/realworld-polaris.yml). Run: [45015619019](https://github.com/Guzman0/DappSentinel/actions/runs/45015619019), every job green. Pinned to `0119e87` (10 Nov), the code the issue was filed against; `src/lib/config.ts` is unchanged on `main` since. Polaris's code is installed, built and served only inside Docker containers with no secrets.

| Step | What happened | Record |
|---|---|---|
| 1. Build it as the issue describes | A production build with the variables missing. It built without complaint | |
| 2. Kane checks it | **Kane failed the page:** "The page tried to get market and account data from a local service, but that service was not accepting connections." **Kane's own DevTools assertion** that no request goes to a testnet, staging or local endpoint **failed** too | [`before/report.md`](run-45015619019/before/report.md) |
| 3. Claude Code fixes it as the issue asks | Production builds now fail with an error naming each missing variable; the localhost and testnet defaults stay for `next dev`; CI sets explicit testnet values; README and `.env.local.example` updated. 4 files | [`fix.patch`](run-45015619019/fix.patch), [`claude-summary.md`](run-45015619019/claude-summary.md) |
| 4. Proof 1: the bad build is refused | The same misconfigured production build now stops: *"Missing required environment variable(s) for a production build: NEXT_PUBLIC_ORACLE_URL, NEXT_PUBLIC_STELLAR_RPC_URL, NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE."* This is the issue's first acceptance criterion | [`after/build-missing.log`](run-45015619019/after/build-missing.log) |
| 5. Proof 2: Kane checks a correctly configured build | Built with the live oracle URL. **Kane's DevTools assertion now passes**: no request goes to localhost or a testnet | [`after/report.md`](run-45015619019/after/report.md) |

**Honest notes:**
- In proof 2 the page still shows an error, and Kane says why: Polaris's live oracle only accepts requests from Polaris's own website, so it refuses our test copy at `localhost`. That's the oracle's access policy working, not the bug. What the fix changes is where the page sends requests, and Kane's DevTools verdict confirms it: before, a request to a local service; after, none.
- **Offered upstream:** on 22 Nov we [commented on issue #118](https://github.com/PolarisQ-xyz/polaris-frontend/issues/118#issuecomment-7079526239) ([as public data](https://api.github.com/repos/PolarisQ-xyz/polaris-frontend/issues/comments/7079526239)) with the tested fix and asked to be assigned, as Polaris's contributor programme expects; we'll open the pull request once a maintainer agrees. Its `ci.yml` hunk was written against 10 Nov code and will be redone against `main`; the rest applies unchanged.
- Polaris's `main` was briefly unbuildable on 22 Nov (merged pull requests imported functions that no longer existed), which is why this run is pinned to the commit the issue was filed against.
