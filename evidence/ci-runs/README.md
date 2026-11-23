# CI runs, kept in the repo

GitHub keeps Actions logs for a limited time, and judges may not be able to open them. So every run the README and [DETAILS.md](../../DETAILS.md) link to has its DappSentinel output copied here: each step Kane took, Kane's verdict in its own words (the lines starting `→`), the findings, and the final result. Timestamps are removed and secrets are masked the same way as in every report; nothing else is changed.

Runs with their own fuller records are elsewhere: [PR #5](../pr5-closed-loop/), [Spark](../realworld-spark/), [Polaris](../realworld-polaris/) and the [mutation test](../mutation-test/).

| Date | What | Result | Record | On GitHub |
|---|---|---|---|---|
| 2026-11-20 | Demo with the fixes (PR #1) | ✅ All 7 checks passed. Clear to ship. | [run-44756869916.txt](run-44756869916.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44756869916) |
| 2026-11-20 | Demo with the six mistakes (`main`) | ❌ 6 of 7 checks failed. Not safe to ship. | [run-44757974669.txt](run-44757974669.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44757974669) |
| 2026-11-20 | Aave, live | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44759641283.txt](run-44759641283.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44759641283) |
| 2026-11-20 | Lido, live (first run, before two false-alarm fixes) | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44759647200.txt](run-44759647200.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44759647200) |
| 2026-11-20 | CoW Swap, live (first run, before two false-alarm fixes) | ❌ 4 of 5 checks failed. Not safe to ship. | [run-44759652548.txt](run-44759652548.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44759652548) |
| 2026-11-20 | CoW Swap, live | ❌ 2 of 5 checks failed. Not safe to ship. | [run-44760471120.txt](run-44760471120.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44760471120) |
| 2026-11-20 | Aave, live | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44760476608.txt](run-44760476608.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44760476608) |
| 2026-11-20 | Lido, live | ✅ All 5 checks passed. Clear to ship. | [run-44762327264.txt](run-44762327264.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44762327264) |
| 2026-11-20 | CoW Swap, live | ❌ 2 of 5 checks failed. Not safe to ship. | [run-44762331502.txt](run-44762331502.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44762331502) |
| 2026-11-20 | Action test before the `v1` tag existed (not counted) | failure | [run-44770752102.txt](run-44770752102.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44770752102) |
| 2026-11-20 | Lido via the action, hit bot protection (not counted) | ❌ 2 of 5 checks failed. Not safe to ship. | [run-44770797794.txt](run-44770797794.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44770797794) |
| 2026-11-20 | Lido via the action | ✅ All 5 checks passed. Clear to ship. | [run-44771371726.txt](run-44771371726.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44771371726) |
| 2026-11-20 | Lido via the action | ✅ All 5 checks passed. Clear to ship. | [run-44776723947.txt](run-44776723947.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44776723947) |
| 2026-11-20 | Demo with the fixes (PR #1), run 2 | ✅ All 7 checks passed. Clear to ship. | [run-44777479949.txt](run-44777479949.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44777479949) |
| 2026-11-20 | Demo with the six mistakes, run 2 | ❌ 6 of 7 checks failed. Not safe to ship. | [run-44777482670.txt](run-44777482670.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44777482670) |
| 2026-11-20 | Broken PR blocked (PR #2) | ❌ 6 of 7 checks failed. Not safe to ship. | [run-44794168901.txt](run-44794168901.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44794168901) |
| 2026-11-20 | PR #3: Kane fails, Claude fixes on GitHub | ❌ 6 of 7 checks failed. Not safe to ship. | [run-44812319363.txt](run-44812319363.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44812319363) |
| 2026-11-20 | PR #3: Kane re-checks, passes | ✅ All 7 checks passed. Clear to ship. | [run-44813042427.txt](run-44813042427.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44813042427) |
| 2026-11-20 | PR #5: Kane fails, Claude fixes on GitHub | ❌ 6 of 7 checks failed. Not safe to ship. | [run-44819169522.txt](run-44819169522.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44819169522) |
| 2026-11-20 | PR #5: Kane re-checks, passes | ✅ All 7 checks passed. Clear to ship. | [run-44819910638.txt](run-44819910638.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44819910638) |
| 2026-11-20 | PR #6: a check was edited, the gate refused | ⛔ Refused: the referee was changed. These protected files differ from origin/main: | [run-44831572149.txt](run-44831572149.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44831572149) |
| 2026-11-20 | PR #7: Kane fails, Claude fixes (forensic trail) | ❌ 6 of 7 checks failed. Not safe to ship. | [run-44831840406.txt](run-44831840406.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44831840406) |
| 2026-11-20 | PR #7: first re-check (honest note in the forensic trail) | ❌ 4 of 7 checks failed. Not safe to ship. | [run-44832463609.txt](run-44832463609.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44832463609) |
| 2026-11-20 | PR #7: re-check passes | ✅ All 7 checks passed. Clear to ship. | [run-44833318875.txt](run-44833318875.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44833318875) |
| 2026-11-20 | Lido with Kane using the stake screen, blocked by bot protection (inconclusive) | ❌ 5 of 6 checks failed. Not safe to ship. | [run-44834739399.txt](run-44834739399.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44834739399) |
| 2026-11-20 | Aave with Kane using the USDC market | ❌ 1 of 6 checks failed. Not safe to ship. | [run-44834742720.txt](run-44834742720.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44834742720) |
| 2026-11-20 | Lido with Kane using the stake screen | ✅ All 6 checks passed. Clear to ship. | [run-44835470086.txt](run-44835470086.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44835470086) |
| 2026-11-21 | The published action `@v1.1.0` on Lido | ✅ All 5 checks passed. Clear to ship. | [run-44909812956.txt](run-44909812956.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44909812956) |
| 2026-11-21 | `npm install -g` from an empty folder, on Lido | ✅ All 5 checks passed. Clear to ship. | [run-44925440855.txt](run-44925440855.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44925440855) |
| 2026-11-21 | Yearn, live | ✅ All 5 checks passed. Clear to ship. | [run-44951344497.txt](run-44951344497.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951344497) |
| 2026-11-21 | Curve, live | ✅ All 5 checks passed. Clear to ship. | [run-44951350211.txt](run-44951350211.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951350211) |
| 2026-11-21 | Sushi, live (inconclusive) | ❌ 4 of 5 checks failed. Not safe to ship. | [run-44951355988.txt](run-44951355988.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951355988) |
| 2026-11-21 | Uniswap, live | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44951361382.txt](run-44951361382.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951361382) |
| 2026-11-21 | Balancer, live (inconclusive, bot protection) | ❌ 4 of 5 checks failed. Not safe to ship. | [run-44951366707.txt](run-44951366707.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951366707) |
| 2026-11-21 | ENS, live | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44951371955.txt](run-44951371955.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951371955) |
| 2026-11-21 | Spark, live (first run, before the redirect fix) | ❌ 3 of 5 checks failed. Not safe to ship. | [run-44951377736.txt](run-44951377736.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951377736) |
| 2026-11-21 | Revoke.cash, live | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44951383161.txt](run-44951383161.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44951383161) |
| 2026-11-21 | Spark, live | ❌ 1 of 5 checks failed. Not safe to ship. | [run-44952359583.txt](run-44952359583.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/44952359583) |
| 2026-11-22 | Lido with Kane DevTools verdicts | ✅ All 5 checks passed. Clear to ship. | [run-45023768462.txt](run-45023768462.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45023768462) |
| 2026-11-22 | Demo with the six mistakes, with Kane DevTools verdicts | ❌ 6 of 7 checks failed. Not safe to ship. | [run-45023773746.txt](run-45023773746.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45023773746) |
| 2026-11-22 | PR #9: the 3-round limit (simulated rounds) and handover | ❌ 6 of 7 checks failed. Not safe to ship. | [run-45037005761.txt](run-45037005761.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45037005761) |
| 2026-11-22 | PR #10: real handover (TradingView ticker) | ❌ 2 of 7 checks failed. Not safe to ship. | [run-45038933982.txt](run-45038933982.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45038933982) |
| 2026-11-22 | Kane stores the value under the name it was told | ✅ All 7 checks passed. Clear to ship. | [run-45052587659.txt](run-45052587659.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45052587659) |
| 2026-11-23 | Mutation test on Kane 0.10.8 (m3 triage) | ❌ 1 of 7 checks failed. Not safe to ship. | [run-45174082470.txt](run-45174082470.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45174082470) |
| 2026-11-23 | Demo with the six mistakes: smoke test of the final code (Kane's DevTools 3 of 4; the exact check caught the testnet request) | ❌ 6 of 7 checks failed. Not safe to ship. | [run-45208847205.txt](run-45208847205.txt) | [run](https://github.com/Guzman0/DappSentinel/actions/runs/45208847205) |

The two handover comments, as posted on the pull requests: [PR #10](pr10-handover-comment.md) (Claude explains why a person must decide) and [PR #9](pr9-handover-comment.md) (3 rounds used).
