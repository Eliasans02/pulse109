# Pulse 109 — consolidated handoff

## Current delivery — 2026-09-11

Branch `review/stack-43-51`, base `deepseek/similar-member-validation` at `66b28b4a61d735ea732a975a1c46b417ab6d936d`. This docs-only successor incorporates and corrects #46; that older review remains open and its findings are historical, not current blockers. Main remains `a6b9443b9927b472e4020d57c789303a6dd38f8b`. No application changes, merges, retargets, approvals or issue closures.

Task contract recorded before edit: P109-09/26/36 review support; goal correct stack/CI/ownership and merge recipe; allowed file `docs/handoff.md`; inputs canonical docs, planning metadata, current PR metadata and diffs; acceptance exact nine heads/bases, source review, seven synthetic checks, next contract; dependencies human merge/security/sample decisions; evidence this document and documentation-only PR. No organizer CSV was read.

## Exact stack snapshot

Checked at 2026-09-11T08:36:38.141764+00:00 using fresh fetch and GitHub API. All nine open, unmerged, mergeable/clean; each check below matches the full head SHA. Submitted review lists were empty. MERGEABLE and green CI are not human approval. No Gemini/layout branch or PR was present on origin; local unpublished work remains unknown.

| PR | Head branch / SHA | Base branch / SHA | Exact-head CI |
|---|---|---|---|
| [#43](https://github.com/Eliasans02/pulse109/pull/43) | `olga/data-coverage` / `e48902fa92dcfdebc0940932ea24966080d3ed29` | `main` / `a6b9443` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34498884660/job/102944294163) |
| [#44](https://github.com/Eliasans02/pulse109/pull/44) | `fix/operator-text-keyboard` / `50a74fdbd3468994e2dddb06ecfac06259866643` | `olga/data-coverage` / `e48902f` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34565975373/job/103158063113) |
| [#45](https://github.com/Eliasans02/pulse109/pull/45) | `deepseek/queue-states` / `f5cb0e7eb1ccdeb7500992c697eee15089d08b5d` | `fix/operator-text-keyboard` / `50a74fd` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34569240800/job/103167600059) |
| [#46](https://github.com/Eliasans02/pulse109/pull/46) | `review/stack-consolidation` / `cb7aa04ae8d110fc37800f7084c943392ea72d9b` | `deepseek/queue-states` / `f5cb0e7` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34572761511/job/103178282083) |
| [#47](https://github.com/Eliasans02/pulse109/pull/47) | `deepseek/queue-row-validation` / `67a9539e71cf53196718e34e42ab29eef7b8848d` | `deepseek/queue-states` / `f5cb0e7` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34574076636/job/103182485802) |
| [#48](https://github.com/Eliasans02/pulse109/pull/48) | `deepseek/similar-race-guard` / `f53ff67485172c476bb0fae6a04f90343b4597f9` | `deepseek/queue-row-validation` / `67a9539` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34574550994/job/103183941238) |
| [#49](https://github.com/Eliasans02/pulse109/pull/49) | `deepseek/classify-race-guard` / `9cd18bb4f29b34ac0e670a733c57479abe3d1009` | `deepseek/similar-race-guard` / `f53ff67` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34577181037/job/103192196865) |
| [#50](https://github.com/Eliasans02/pulse109/pull/50) | `deepseek/confirm-selection-guard` / `7e279ee4bc83fb5598c11c17845d671af02937aa` | `deepseek/classify-race-guard` / `9cd18bb` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34577708132/job/103193849569) |
| [#51](https://github.com/Eliasans02/pulse109/pull/51) | `deepseek/similar-member-validation` / `66b28b4a61d735ea732a975a1c46b417ab6d936d` | `deepseek/confirm-selection-guard` / `7e279ee` | [success](https://github.com/Eliasans02/pulse109/actions/runs/34579368089/job/103199104932) |

Code graph: main → #43 → #44 → #45 → #47 → #48 → #49 → #50 → #51. **#46 is a sibling documentation branch off #45, not a parent of #47.** Adjacent-base `git merge-base --is-ancestor <base-sha> <head-sha>` exited 0 for all nine. `git merge-tree --write-tree cb7aa04ae8d110fc37800f7084c943392ea72d9b 66b28b4a61d735ea732a975a1c46b417ab6d936d` exited 0, tree `5d0494ac3dbb7fba89c3d8e3a04a7a860536ed49`; no working merge performed. Clean text integration does not establish behavioral correctness.

## Merge recipe for Elias / Ilyas — recommendation only

1. Fetch current state and inspect each PR's exact head, base, minimal diff, reviews and required checks again. Record the chosen merge method; only humans approve and merge.
2. Recommended code order: **#43 → #44 → #45 → #47 → #48 → #49 → #50 → #51**. Review #45 with its #47 correction before approval; main at the intermediate #45 state still has the malformed-queue bug, so do not deploy that intermediate state.
3. After each parent merges, inspect the child's ancestry and diff, then retarget that child to main. Preserve its dependency branch until retarget/restack is complete. Run fresh CI on the changed base/head pair even if the head did not change. Do not interpret old green CI as verification of the new integration.
4. If humans preserve ancestry with merge commits, expected child diffs remain their original deltas. If they squash/rebase, stop and let that child's owner restack only its own delta onto the resulting main (fresh branch/PR is acceptable); inspect the diff and rerun CI. Never blindly retarget a cumulative diff or force-push another owner's branch.
5. After #51, fold the **corrected docs-only successor** into the resulting state. It already incorporates #46's useful review/data gates. Do not merge stale #46 afterward and overwrite this handoff; humans may mark #46 superseded once the corrected document lands. Retarget this successor from #51 to main only after verifying its diff is still `docs/handoff.md` alone, then run fresh CI.
6. Before release, review the remaining operator gaps below, run final integrated checks and obtain human security/hosting sign-off. This review authorizes neither a deployment nor release task closure.

Ownership: #43 owns coverage API/metadata/UI/tests and initial HTML/CSS; #44 adds literal rendering/keyboard/CSS/CI; #45 changes app.js/index/operator tests. #47–#51 change **only app.js and operator tests** in an ordered chain. #46 and this successor own handoff only. No simultaneous app.js editors. The next operator task requires explicit index.html ownership agreement with the layout owner; origin absence alone is not that agreement.

## What the review establishes — and does not

- #47 resolves #46's P2: queue members are validated and replacement rows built before committing; malformed rows retain the previous queue with stale disclosure. Fresh tests reproduce the safe behavior. Do not repeat the old bug as an unresolved #51 finding.
- #48 protects similar-response ordering; #49 guards classification by request and selection generation; #50 preserves the selected complaint during delayed confirmation; #51 validates required candidate fields and renders non-string status/origin as unavailable. Fresh existing checks passed for those specific boundaries.
- **Remaining P1/P2 operator work:** queue/card status values are still rendered raw; regions/topics/stats failures are console-only and initial stats HTML shows 0 before evidence. Intake's follow-up complaint fetch is unvalidated. Confirmation success is hidden by selectComplaint for the current card.
- **Additional source-review limits:** classify accepts an array-valued proposal because `typeof [] === "object"` (`app.js:262`); confirmation reads `data.complaint.id` without validating the returned complaint (`app.js:383`). These were identified by inspection, not a new runtime reproduction. The statement “member and envelope validation everywhere” is false; do not claim this lane or security review complete.
- No routing policy, historical resolution cutoff, production authorization, incident semantics or model quality was validated by these UI tests. No new backend/API/schema or dependency change.

## Fresh verification on cumulative 66b28b4

Existing tests unchanged; synthetic fixtures/intercepted responses only. Python 3.12.14 in the isolated existing project venv, external Playwright 1.62.1 with installed Edge. Each command below exited 0 on the permitted rerun; orchestration also exited 0 and removed its synthetic server/DB.

| Command from repository root | Exit | Actual result |
|---|---:|---|
| `python scripts/check_plan.py` | 0 | 42 tasks, 17 requirements, 35 source groups; DAG valid |
| `python scripts/check_coverage.py` | 0 | 10 tests OK |
| `python scripts/smoke.py` | 0 | ALL 14 SMOKE CHECKS PASSED |
| `python scripts/test_audit_received_csv.py` | 0 | 8 synthetic tests OK |
| `node scripts/check_operator_ui.cjs http://127.0.0.1:51830` | 0 | ALL 23 OPERATOR UI CHECKS PASSED |
| `node scripts/check_coverage_ui.cjs http://127.0.0.1:51830` | 0 | UI 1–6 PASS, unchanged keyboard assertions |
| `git diff --check` | 0 | no whitespace errors |

Initial sandboxed attempt: check_plan/audit exited 0, coverage/smoke exited 1 with Windows temporary-directory access errors, UI server could not start and UI suites were not reached. The complete permitted rerun above supersedes that environment failure, not a product assertion. No tests or assertions were weakened. macOS/headless native-select limitation remains unresolved locally; Linux CI is authoritative. Current workflow already selects **Node 22** for QA; separately review Node-runtime deprecation of action versions, not an assumed Node 20 QA setting.

Exact local setup: worktree `work/pulse109-consolidation-v2`; Python `../pulse109/.venv/Scripts/python.exe`; node `C:/Users/oarka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`; `NODE_PATH=C:/Users/oarka/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules`, `P109_BROWSER=msedge`, `PYTHONUTF8=1`. Set `DATABASE_PATH` to a new temporary synthetic SQLite file, start `python -m uvicorn app:app --host 127.0.0.1 --port 51830`, run the two browser commands, then stop only that server. Review runner/logs are outside Git in `work/run_consolidation_v2.py` and `work/consolidation-v2-checks`. Use README for a new venv; Linux CI installs its own requirements and external browser runtime.

## Product / data gates

Working: synthetic intake, mock classification/retrieval, explicit confirmation/audit, inventory-derived coverage. Organizer coverage (8 files / 7 regions / 13 missing) is separate from synthetic SQLite complaint totals. Selector entries do not establish 20-region corpus coverage.

Prior inventory evidence only, not reread: 1,036,858 CSV records, not unique complaints; Akmola request_subject is a candidate (3475/3506 filled, median 24/p95 50 chars); unsupported Karaganda times and 32 unparsed Akmola dates. Original-text meaning/share, RU/KK/mixed counts, rights, hosting, uniqueness and history completeness remain unverified. Unknown is null/unavailable, never zero.

No approved sample fields/size/reviewers/retained summaries supplied. P109-03/04 remain gated by Elias/Ilyas and the exact checklist in `planning/data_contract_request.md`. Do not read organizer CSVs. Sample authorization alone does not authorize full import, hosting or training. Keep rows/identifiers/secrets out of Git/CI/prompts/logs/screenshots. No outcomes/services/labels as invented original text or classifier features.

Unavailable: P109-24 real ingestion, checked P109-19 relationships, P109-20 routing, P109-25/26 verified aggregates, forecasts/bursts/NL/real exports. Both models untrained; mock confidence/checkpoints remain null. Alerts/forecast/query/reports remain honest 501. Two independent fine-tuning runs and real held-out evaluation still required. P109-03/09/26/36 and release/demo 39–42 are not closed by this review.

## Next operator task contract — pending HTML ownership

Issue P109-09/P109-36 partial; goal honest badges and regions/topics/stats recovery. Base freshly verified #51 or its human-approved successor. Allowed files: app.js, index.html **after ownership agreement**, new startup.js, existing operator runner and small startup test module; root retains handoff ownership. At #51 app.js is 418 lines, operator runner 451; extract startup code/tests to stay below 500 per file. No CSS redesign, API/routing/DB change or new dependency.

Acceptance: exact pending/confirmed keep their presentation; missing/non-string/unknown statuses display neutral «—» in card and queue, without changing stored decisions. Each startup resource validates HTTP/JSON/envelope/members before atomic replacement; separate visible loading/error/retry; initial unknown counts «—», real zero 0; failed refresh preserves prior values with stale disclosure. Keyboard retry is GET-only, preserves selection/form input/focus, and latest response wins. Topic recovery refreshes labels without changing stats values or typed service. Synthetic RED tests precede code, including malformed members, invalid counts, stale responses and recovery. Invoke new test module from existing operator runner so Linux CI covers it. Preserve all current assertions.

Operator lane received a bounded read-only contract review; **implementation is not dispatched as running or complete** while HTML ownership is pending. No DeepSeek model capability is claimed. Separate later boundary task should cover intake/confirm payload validation, array-valued classify and success visibility; do not silently broaden this PR.

## Next three bounded tasks

1. Operator owner + Elias/Ilyas: confirm index.html ownership, implement the contract above with RED/GREEN evidence and focused PR, seven checks and exact-head Linux CI. No merge.
2. Lead: synthetic-only ingestion contract implementation/tests: nullable original text/time/region, rejected-row reconciliation, idempotence and path-assigned provenance. No source-field mappings or real import; report unresolved key/version semantics rather than inventing them. Separate PR.
3. Lead: executable training/evaluation artifact validators with failing bad-input tests: time/family split overlap, required fields, separate checkpoint identities, metrics slice/support/unjudged shape. No fake weights/metrics or training claim. Real pilot waits for approved sample, semantic verdict and use conditions.

First-task prompt:
> Fetch current PR heads; read AGENTS.md, this handoff, P109-09/36 in backlog, static/app.js, static/index.html and scripts/check_operator_ui.cjs. Obtain the single index.html owner decision already requested. In a separate operator branch implement only the status/startup contract with synthetic failing tests first, split files when needed, preserve existing assertions, run seven checks, open a focused PR with actual exits and exact-head Linux CI. No organizer CSV, merge, routing change or full-task closure. Leave handoff updates to its coordinated owner.
