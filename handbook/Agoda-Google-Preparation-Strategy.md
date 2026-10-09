# Agoda Staff and Google L5: shared preparation strategy

[Agoda round-wise guide](../agoda/rounds/README.md) · [Google round-wise guide](../google/rounds/README.md) · [Airbnb guide](../airbnb/rounds/README.md)

**Researched October 9, 2026.** This is a study plan based on public interview accounts and official preparation material, not a quantitative labor-market forecast. Source dates and limits are in the [Agoda](../agoda/rounds/Research-Sources.md) and [Google](../google/rounds/Research-Sources.md) registers. No specific interview date, job description, or team has been provided.

## What to prioritize for each target

| Dimension | Agoda Staff track | Google L5 track |
| --- | --- | --- |
| Coding emphasis from reviewed reports | Parsing, monotonic stacks, ranking/maps | Topological modeling, graph paths/connectivity, tree/heap analogues |
| Broader preparation | API coding, platform critique, practical review | Unfamiliar problem statements and changing follow-ups |
| Design emphasis in this plan | Supplier integration, booking correctness, production migration | Cache/feed design, capacity, consistency, changing requirements |
| Leadership preparation | Technical judgment, influence, operational ownership matched to the requisition | Independent project delivery, collaboration, mentoring, ambiguity |
| Evidence limit | Different teams report different loops; one Staff applicant accepted SSE | Candidate reports vary; some include extra rounds or matching delays |

The distinction is our synthesis of the linked accounts. It does not imply exclusive question categories or equivalent levels. Keep common fundamentals and vary the final practice sessions by company.

## Day zero: establish a baseline

Attempt one unseen medium array/interval problem and one graph problem, 45 minutes each, without a solution open. Record the first point where you needed help. Then explain a past system design for 15 minutes. Use the results to adjust the plan; six weeks assumes basic coding fluency. If arrays/maps/traversal are new, add a foundations phase using the [concepts handbook](DSA-CS-AI-Concepts-and-Solutions.md).

Record the requisition, location, intended level, next interview, confirmed round names, time limits, language/runtime, and preparation material from the recruiter. The repository defaults to TypeScript, but the interview platform must support your choice.

## Six-week plan: 2–3 hours, six days per week

| Week | Shared core | Agoda-specific output | Google-specific output |
| --- | --- | --- | --- |
| 1 | Hashing, sorting, intervals, queue/stack mechanics; baseline | Dense ranks, nearest smaller, parser first pass | Course ordering, alien alphabet, BFS |
| 2 | Heaps, trees, monotonic stacks; first timed mock | Nested parser, dictionary operation trade-offs | Connectivity, weighted paths, optimal merge |
| 3 | Sliding window, binary search, DP and backtracking | API pagination/consolidation drill | One unfamiliar variant per core graph pattern |
| 4 | Mixed problems; two project briefs | Supplier API critique and unsafe endpoint review | Distributed cache and changing requirements |
| 5 | Targeted retries and six leadership stories | Aggregation + booking failure design mocks | Feed design + leadership/team-fit rehearsal |
| 6 | Two simulated loops and error-log revision | Coding + platform critique + project discussion | Two coding sessions + design + leadership |

If interviewing with both, solve shared problems once and add company-specific follow-ups. Aim for 4–6 new problems plus retries per week, adjusting to difficulty. The 54 bank entries overlap and are a menu, not a six-week completion quota. Do P0 first, then fill observed gaps with P1; use P2 only after the main patterns are reliable.

**Daily 150-minute session:** 20 minutes retry; 50 minutes new coding; 25 minutes testing/explanation; 35 minutes design or leadership; 20 minutes review and scheduling. Use day six for a mock plus review and reserve one rest/catch-up day.

## Two-week compressed route

Use only if you already pass the baseline. This is prioritization, not a promise of interview readiness.

| Day | Main task |
| --- | --- |
| 1–2 | Shared maps/intervals/heap and target P0 baseline; capture mistakes |
| 3–4 | Agoda: parser + stack; Google: topo + BFS/0–1 BFS |
| 5–6 | Agoda: rank/map + API drill; Google: union-find + tree/heap follow-ups |
| 7 | Timed coding mock and targeted correction |
| 8–9 | Agoda: platform review + booking; Google: cache + feed design |
| 10 | Two project deep dives and leadership evidence |
| 11–12 | Simulated loop for the next scheduled company |
| 13 | Retry unresolved weaknesses without notes |
| 14 | Light revision, setup check, and rest |

When only a coding screen is scheduled, shift immediate effort to coding while retaining brief project/design work. Avoid consuming the final day with entirely new hard patterns.

## Reuse the Airbnb work

- [Airbnb DSA solutions](../airbnb/rounds/01-DSA-Coding-Questions-and-Solutions.md): reuse graph reachability, BFS, windows, flights, and DP; adapt the contract instead of memorizing a company story.
- [Airbnb design workbook](../airbnb/rounds/02-System-Design-Questions-and-Followups.md): reuse booking and messaging fundamentals; add supplier isolation for Agoda and changing scale/consistency requirements for Google.
- [Airbnb project workbook](../airbnb/rounds/03-Project-Deep-Dive.md): reuse factual project evidence; change emphasis, not history.

## Mock rubric and readiness

This is a self-assessment, not either employer's rubric. Score each dimension 0 (missing), 1 (substantial help), 2 (minor correction), or 3 (independent and clear).

| Dimension | Evidence |
| --- | --- |
| Contract | Clarifies inputs, ties, empty cases, mutation, numeric bounds |
| Modeling | Derives the state/invariant; explains a baseline and bottleneck |
| Implementation | Correct, readable code with appropriate data structures |
| Validation | Normal, boundary, adversarial tests; meaningful dry run |
| Complexity / adaptation | Correct bounds; adjusts when requirements change |
| Communication | Explains decisions and handles feedback constructively |

Suggested readiness: three unseen mocks with no zero dimensions and at least 2 in every dimension, plus one changed-requirement follow-up each. Separately require two design mocks that cover data ownership, consistency, failures, and rollout. A high practice score is not an offer predictor.

## Progress log

| Date | Company / problem | Pattern | Independent? | First mistake / correction | Retry +2 days | Retry +7 days |
| --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | Example: nearest smaller | Stack | No | Popped equal elements under the wrong contract | Pending | Pending |

Track model mistakes separately from coding mistakes. If the same pattern fails twice, do a simpler variant, explain its invariant, then return to the harder problem. Re-solving with the answer visible does not count as independent recall.

## TypeScript rehearsal checks

- Use numeric sort comparators; default array sorting is lexical.
- Use a head index for BFS; avoid repeated front-removal from arrays.
- Implement a heap you can explain; do not assume an interview runtime supplies one.
- Use iterative traversal for potentially deep inputs; JavaScript recursion has a finite stack.
- State numeric limits; use `bigint` only when the contract requires it and do not mix numeric types.
- Define code units vs. code points vs. graphemes for string problems; lowercase practice inputs deliberately avoid that ambiguity.
- Separate graph discovery from distance finalization; weighted shortest paths need more than first-visit marking.

## Verify the worked examples

```sh
node examples/check-agoda-google-examples.mjs
```

Run from the repository root with Node.js 22.13+. The checker reads the eight worked solution sections directly, including the heap helper, and compares algorithms with independent small-input references. It performs runtime checks, not static type checking. Links and research should be rechecked when your interview is scheduled; newly discovered reports should retain provenance and date uncertainty.
