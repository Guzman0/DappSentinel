# Mutation test (known-answer): the full record

The fixed SentinelSwap site, plus 7 copies of it with one new mistake each ([`mutants/mutants.json`](../../mutants/mutants.json)).
The clean site must pass all 7 checks. Each copy must fail exactly its own check and nothing else.
None of the mistakes is the same as the ones in the demo, so the checks were not tuned for them.

![Mutation test results](../../assets/mutation-test.jpg)

## Runs

| Run | When (UTC) | Result | Record |
|---|---|---|---|
| [44847434698](https://github.com/Guzman0/DappSentinel/actions/runs/44847434698) | 21 Nov 2026, 01:00 | 8 of 8 correct | [`run-44847434698/`](run-44847434698/): the results table and each variant's gate log, taken from the GitHub log (this run predates the evidence collector) |
| [44884542975](https://github.com/Guzman0/DappSentinel/actions/runs/44884542975) | 21 Nov 2026, 08:22 | 8 of 8 correct | [`run-44884542975/`](run-44884542975/): per variant, the report, Kane's steps, Kane's screenshots and the masked network log. Committed by the workflow itself to branch [`mutation-evidence-44884542975`](https://github.com/Guzman0/DappSentinel/tree/mutation-evidence-44884542975) |
| [44962415067](https://github.com/Guzman0/DappSentinel/actions/runs/44962415067) | 22 Nov 2026 | 8 of 8 correct | [`run-44962415067/`](run-44962415067/): as run 2, plus Kane's own DevTools verdicts on the 4 hidden checks. Kane's assertions caught m1 (Infura key) and m2 (Holesky RPC) themselves and missed m5 (jsDelivr script) and m6 (seed in sessionStorage, which Kane's storage assertion doesn't read); DappSentinel's exact check caught all four. No false alarms from Kane on any other check |
| [45023763082](https://github.com/Guzman0/DappSentinel/actions/runs/45023763082) | 22 Nov 2026 | 8 of 8 correct | [`run-45023763082/`](run-45023763082/): Kane now stores the page's requests in the step that reloads it, because its network capture resets every step. Kane's assertions caught m1, m2 and m5 themselves; only m6 (sessionStorage, which Kane's DevTools don't read) was left to DappSentinel's exact check. No false alarms from Kane |

### Kane CLI 0.10.8 (released 22 Nov 2026), and one miss

Kane CLI 0.10.8 came out on 22 Nov, and these runs check DappSentinel against it. All runs below installed it, except the control.

| Run | Kane CLI | Variants | Result |
|---|---|---|---|
| [45050499048](https://github.com/Guzman0/DappSentinel/actions/runs/45050499048) | 0.10.8 | clean, m1, m7 | clean ✅, m1 ✅, **m7 missed**: see below. Record: [`run-45050499048/`](run-45050499048/) |
| [45051845872](https://github.com/Guzman0/DappSentinel/actions/runs/45051845872) | 0.10.8 | m7 | ✅ Kane failed the wrong amount |
| [45051857432](https://github.com/Guzman0/DappSentinel/actions/runs/45051857432) | 0.10.8 | m7 | ✅ Kane failed the wrong amount |
| [45051867244](https://github.com/Guzman0/DappSentinel/actions/runs/45051867244) | 0.10.7 (control) | m7 | ✅ Kane failed the wrong amount |
| [45052587659](https://github.com/Guzman0/DappSentinel/actions/runs/45052587659) | 0.10.8 | clean, m7 | clean ✅ and m7 ✅, with the new exact check below in place |

**The miss.** In run 45050499048, Kane's own screenshot of the confirmation shows "You pay 0.05 ETH" ([screenshot](run-45050499048/m7-wrong-confirm-amount/screenshots/swap-flow-run-10.jpg)). Kane read it correctly: it stored `"You pay 0.05 ETH"`, and its summary says the review screen "differs from the requested 0.5 ETH amount" ([report](run-45050499048/m7-wrong-confirm-amount/report.md)). It still marked "the confirmation shows You pay 0.5 ETH" as passed, and the run ended as a pass. On the next two runs with the same version, Kane failed it correctly. In total Kane has caught this mistake on 8 of 9 runs. We reported it to the Kane CLI team with this evidence: [LambdaTest/kane-cli#239](https://github.com/LambdaTest/kane-cli/issues/239).

**Confirmed by the Kane CLI team** ([their reply](https://github.com/LambdaTest/kane-cli/issues/239#issuecomment-7098306114), 23 Nov). Kane read the confirmation correctly. The mistake was in the step that compares the value with the expected one: for this check Kane chose to compare them as whole numbers, which dropped everything after the decimal point (0.05 → 0, 0.5 → 0), so 0 equalled 0 and the check passed. Most runs compared them as decimals, which is why it happened in 1 of 3. The fix: number comparisons will keep decimals, and a check will no longer pass when turning a value into a number changes the expected value itself. They called our workaround (store the amount, compare the stored value exactly) a good one until the fix ships.

**What we changed.** The swap check now asks Kane to store the amount it reads on the confirmation (`confirm_pay_amount`), and DappSentinel checks it exactly (`expect: confirm_pay_amount=0.5` in [`checks/07-swap-flow.md`](../../checks/07-swap-flow.md)). Kane still makes the call, but a pass only stands if Kane's own reading matches. In run 45052587659 Kane stored `"0.5 ETH"` on the clean site, and the check passed. A unit test replays the real miss: the value `"You pay 0.05 ETH"` must fail (`npm test`).

## The matrix

| Variant | Planted mistake | Expected | Run 1 | Run 2 | Run 3 | Run 4 | What Kane found (run 2) |
|---|---|---|---|---|---|---|---|
| `clean` | None: the fixed site | 7 of 7 pass | ✅ 7/7 | ✅ 7/7 | ✅ 7/7 | ✅ 7/7 | Completed the swap ("Swap submitted"); address and chain ID confirmed |
| `m1-infura-key` | Infura RPC URL with an API key | fail `rpc-key-leak` only | ✅ | ✅ | ✅ | ✅ | `POST https://mainnet.infura.io/v3/3f9c…a65` in Kane's network recording |
| `m2-holesky-rpc` | Holesky testnet RPC in a mainnet build | fail `testnet-rpc` only | ✅ | ✅ | ✅ | ✅ | `POST https://ethereum-holesky-rpc.publicnode.com/` (matches "holesky") |
| `m3-swapped-digits` | Two characters swapped mid USDC address | fail `contract-address` only | ✅ | ✅ | ✅ | ✅ | Failed, but see the note below |
| `m4-polygon-chain` | Chain ID 137 under an Ethereum label | fail `chain-id` only | ✅ | ✅ | ✅ | ✅ | "The network badge is showing the chain ID for a different network while keeping the Ethereum name." |
| `m5-jsdelivr-script` | Script from the jsDelivr CDN | fail `unknown-scripts` only | ✅ | ✅ | ✅ | ✅ | `cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js`, 1 script from 1 untrusted host |
| `m6-seed-in-session` | Seed phrase in sessionStorage as `backup` | fail `storage-secrets` only | ✅ | ✅ | ✅ | ✅ | `sessionStorage["backup"]` holds a value that looks like a seed phrase |
| `m7-wrong-confirm-amount` | Confirm screen shows a tenth of the amount | fail `swap-flow` only | ✅ | ✅ | ✅ | ✅ | The payment amount has "the decimal point in the wrong place"; the received amount and fee still match 0.5 ETH |

## Honest note on m3

Kane failed the address check on the swapped-digit copy both times and passed it on the clean site both times, so the verdict is right and repeatable.
But its written reason was not "these two characters differ". Both times it said its own comparison step had not stored the value it read from the page.
So we count the verdict, and we don't claim Kane spelled out the swapped characters. The screenshot in `run-44884542975/m3-swapped-digits/screenshots/` shows the wrong address on the page.

## What each variant folder holds (run 2)

- `report.md`, `report.json`: DappSentinel's report, keys masked.
- `kane-steps.md`: every step Kane took for every check, with its remarks.
- `screenshots/`: Kane's screenshots, one per step, named after the run they came from (`swap-flow-run` is the run the network checks read).
- `network-*.txt`: every request Kane recorded, keys masked.
- `evidence-contents-*.txt`: the file list of each Kane evidence pack.
- `result-<id>.json`: the verdict.

The raw evidence packs are not committed. They can hold the very secrets the checks look for (see [SECURITY.md](../../SECURITY.md)), so only the masked parts above are kept.
