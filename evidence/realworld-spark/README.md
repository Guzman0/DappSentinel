# Real-world loop: Spark's dApp frontend

Code we didn't write: Spark's web app (MIT licence, Mars Foundation), from [a public copy](https://github.com/syt4sh1/spark-app/tree/0a6a646ff9255ac6774f1446801bc90783d63bb5) of its 2024 source, pinned to commit `0a6a646`. Spark's own repository is no longer public.

Workflow: [`.github/workflows/realworld-spark.yml`](../../.github/workflows/realworld-spark.yml). Run: [44953030392](https://github.com/Guzman0/DappSentinel/actions/runs/44953030392). Every job is green, and the record below was committed by the workflow itself (branch [`realworld-spark-44953030392`](https://github.com/Guzman0/DappSentinel/tree/realworld-spark-44953030392)).

| Step | What happened | Record |
|---|---|---|
| 1. Build as shipped | Spark's code built unchanged, in a job with no secrets | |
| 2. Kane checks it | **Kane failed the page itself:** "The page tries to use an external Ethereum data service from the browser, but that service does not allow requests from this page's address. The app cannot load its required data and shows an error screen." Its evidence is the browser's own error, a blocked request to `eth-mainnet.g.alchemy.com/v2/WVOC…-9L` | [`before/report.md`](run-44953030392/before/report.md) |
| 3. Claude Code fixes the source | Removed the hardcoded Alchemy key. The mainnet RPC now comes from `VITE_MAINNET_RPC_URL`, with a keyless public RPC as the fallback, and `.env.example` documents it. Two files, 3 lines changed | [`fix.patch`](run-44953030392/fix.patch), [`claude-summary.md`](run-44953030392/claude-summary.md) |
| 4. Rebuild and Kane checks again | The page loads. 46 requests, none with an RPC key and none to a testnet. Storage clean | [`after/report.md`](run-44953030392/after/report.md) |

**What the bug was:** the Alchemy key was written into the source, so it ships to every visitor and sits in the repository history. The key is locked to Spark's own domain. That's why the live site works, and why anyone who builds the open-source code gets an error screen instead of the app. Kane caught the second part by using the page; DappSentinel's live scan of [app.spark.fi](https://github.com/Guzman0/DappSentinel/actions/runs/44952359583) caught the first, the key in production traffic.

**Honest notes:**
- This is the 2024 public code, not Spark's current private code. Production still sends the same key ([run](https://github.com/Guzman0/DappSentinel/actions/runs/44952359583)).
- Spark's repository is private now, so the fix can't be offered as a pull request. The key is masked everywhere in this record.
- After the fix, one check still fails: Spark loads Plausible analytics from `plausible.io`, which isn't on DappSentinel's default allowlist. That's a policy choice for Spark's team (add it to `allowedScriptHosts`), not a bug, so we left it alone.
- Claude recommended rotating the key, since it stays in the repository history.
