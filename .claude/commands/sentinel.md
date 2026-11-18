---
description: Run the DappSentinel safety gate and fix whatever Kane CLI catches
---

Run the DappSentinel gate and fix the app until it passes.

1. Run `npm run sentinel`. It runs every check in `checks/` with Kane CLI in a real browser.
2. If it exits 0, every check passed. Say so and stop.
3. If it exits 1, read `.sentinel/report.md`. For each failed check, find the cause in the site folder (see `siteDir` in `sentinel.config.json`) and fix it, following the check's fix hint.
4. Run `npm run sentinel` again. Repeat steps 3 and 4 for at most 5 rounds.
5. If it exits 2, Kane could not start. Show the error and suggest `kane-cli whoami` and `kane-cli balance`. Do not retry.

Rules:
- Never edit `checks/` or `sentinel.config.json` to make a check pass. Fix the app.
- Keep the swap flow working while you fix things.
- Finish with a short table: each check, what Kane caught, what you changed.
