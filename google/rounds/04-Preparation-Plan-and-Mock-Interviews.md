# Google L5 India: preparation plan and mock workbook

[Full interview guide](README.md) · [DSA](01-DSA-Coding-Questions-and-Solutions.md) · [Design](02-System-Design-and-Followups.md) · [Leadership](03-Leadership-and-Team-Matching.md)

**Created October 14, 2026.** Default: 28 days, approximately two hours/day, TypeScript/JavaScript. Your interview date and daily availability are unconfirmed. Days are relative so the plan can start whenever you do. Extend it if the diagnostic exposes fundamentals gaps; compress only if performance supports that. This is a preparation plan, not a promise of clearing L5.

## Day 1: measure before studying

Do not read the worked solutions first. Record how much help you needed, time to a correct model, implementation bugs, missed edge cases and follow-up handling. “I recognize the title” is not evidence of mastery.

1. **45-minute coding diagnostic:** Given services `0..n-1` and directed prerequisite pairs, return a valid deployment order or report impossibility. Ask about edge direction and duplicates. Follow-up at minute 30: dependencies arrive online; explain what must be revalidated. Use a different unseen topological problem if you have memorized this one.
2. **35-minute design diagnostic:** Define a dashboard for the worst queries. Spend five minutes clarifying “worst,” then state a contract, derive capacity, trace writes and reads, and handle duplicates/late data. Record which assumptions remained unstated.
3. **20-minute story diagnostic:** Give a two-minute analytics migration story and answer: “What did you personally decide?”, “How were savings calculated?”, “What would you change?” Capture missing facts.
4. **20-minute debrief:** Score with the rubric below and pick the two biggest gaps. Start a mistake log; do not immediately solve ten easier questions for reassurance.

If coding needs extensive hints or no correct base solution emerges, use a 6–8 week version: repeat each coding week with fresh same-pattern problems, preserve design/story sessions, and run the readiness gate again. If already strong, emphasize unseen variants and spoken mocks.

## Daily routine from Day 2

Use 65 minutes coding (45 timed + 20 debrief), 35 design or story practice, and 20 spaced recall. Weekend/full-loop rehearsal can be split over two sessions if only two hours are available. Revisit failures after 1, 3 and 7 days without notes. A familiar solution counts only when you can derive it, explain its invariant, and handle a change.

During the 45-minute coding attempt: clarify/examples 5; baseline and invariant 7; code 20; trace/tests 8; complexity/follow-up 5. If your algorithm is wrong, stop optimizing and construct a counterexample. Record hints honestly.

## 28-day schedule

Question numbers refer to the DSA bank; Q1–Q6 are the worked local exercises. On paired-problem days, solve the first and explain the second as a transfer drill; add full implementation only if time permits. On mock days, have a partner/coach select an unseen variant.

| Day | Coding work | Design / leadership deliverable |
| --- | --- | --- |
| 1 | Diagnostic above | Initial score and two priorities |
| 2 | #1 Course Schedule II; #2 alien ordering/Q1 | Two-minute recruiter introduction; list exact loop questions |
| 3 | #4 multi-source BFS; #5 Word Ladder modeling | Cache scope, APIs and three capacity estimates |
| 4 | #8/#32 DSU; Q3 timestamp connectivity | Cache stampede, hot key and stale-permission discussion |
| 5 | #7/Q6 Dijkstra; draw BFS counterexample | Superset project: alternatives, rollout and savings evidence |
| 6 | #6/Q2 0–1 BFS; change weights | Dashboard metric/window/API contract |
| 7 | Unseen graph mock; redo biggest bug | 35-minute dashboard design; score one deep dive |
| 8 | #23 Coin Change; state/transition/base cases | Fill one real ambiguity story card |
| 9 | #31/Q5 robot/factory; derive uncrossing and DP | Dashboard estimates, partitioning and late-event policy |
| 10 | Repeat Q5 without notes; reconstruct assignments verbally | Dashboard top-K counterexample; sums versus p95 |
| 11 | #24 LIS; #25 LCS transfer | Real disagreement story with the other person's case |
| 12 | #10 LCA; #37 tree maximum path sum | Luckd payment and fulfillment states |
| 13 | #11 serialization; malformed-input discussion | Unknown payment outcome and reconciliation timeline |
| 14 | Unseen DP/tree mock | 45-minute payment design; score correctness/failure handling |
| 15 | #35 random-pointer copy; #36 reorder pointer trace | Genuine failure story and prevention evidence |
| 16 | #28 LRU; update/eviction/capacity edge cases | Feedback or mentoring story; identify missing facts |
| 17 | #12/#13 intervals; endpoint and online variants | Feed pagination, deletion and cross-device state |
| 18 | #15 prefix sums; #16 minimum window transfer | 45-minute feed design with changing requirements |
| 19 | #17 heap merge; #38 top-K groups | CoverSelf caching: correctness and measurement deep dive |
| 20 | #20 binary search on answer; prove monotonicity | Resume drill: POC vs production, estimates vs measurements |
| 21 | Two unseen coding mocks, 45 minutes each | Use remaining time for debrief; no extra new material |
| 22 | #27 trie search; #26 backtracking pruning | Task scheduler: leases, retries, idempotency |
| 23 | #22 DAG DP; #29 layered shortest-path state | Full-stack dashboard extension if role relevant; otherwise cache mock |
| 24 | #33 DSU modeling; #34 max-product path transfer | 35-minute Googleyness mock with skeptical follow-ups |
| 25 | Weakest pattern, fresh unseen problem | 50-minute unseen design; change one major requirement |
| 26 | Mock loop A: coding + Googleyness | 45 coding + 35 leadership + 40 review |
| 27 | Mock loop B: two coding + design | 45 + 45 + 50 minutes plus debrief; split across days if needed |
| 28 | Re-solve failures, no new pattern | Readiness gate; recruiter/tool logistics; team-match project briefs |

Remaining foundation exercises, such as hashing, optimal merge and minimax paths, belong in spaced recall or extension days. The plan deliberately prioritizes depth over finishing every bank entry. Keep at least one unseen non-graph mock so recent graph reports do not narrow preparation too far.

## If only 14 days remain

Start with the diagnostic. If fundamentals are solid: days 2–4 DSU/BFS/Dijkstra and dashboard; 5–6 capacity DP/trees and payment design; 7 coding + design mocks; 8–9 linked list/hash map/intervals and stories; 10–11 weakest patterns and feed/cache; 12 full-loop mock; 13 repair; 14 light recall and setup. Include a short story rehearsal every other day. If the diagnostic is weak, prioritize base solutions and communicate scheduling needs to your recruiter; a shorter list is not a substitute for readiness.

## Practice rubric — our coaching rubric, not Google's

Score each dimension 0 = missing/incorrect, 1 = partial or required substantial help, 2 = independent and correct. Capture an example of the behavior, not just a number.

| Area | Five dimensions, each 0–2 | Readiness target |
| --- | --- | --- |
| Coding | Contract/model; invariant/correctness; implementation; testing/complexity; communication/adaptation | At least 8/10 in 4 of the last 5 unseen timed mocks; no 0 in correctness or implementation |
| Design | Requirements/estimates; API/data/flow; justified trade-offs; deep-dive correctness; failures/communication | At least 8/10 in 3 different complete designs; no 0 in correctness or failure handling |
| Leadership | Specific situation/mandate; individual decisions; collaboration; outcome/evidence; reflection | Six defensible stories; at least 8/10 in two mocks; no invented facts |

A memorized prompt is a rehearsal, not an unseen mock. Passing thresholds is a useful study signal, not a hiring prediction. Ask a partner to challenge your proof and design assumptions; self-scoring alone is easy to inflate.

## Mock packets: use without reading the answers

These are original transfer prompts, not reported verbatim Google questions. A coach can change the names, constraints and examples before use.

**A — Connectivity (45 min):** Offices become linked at timestamps. Return earliest full connectivity. Follow-up: repeated edges; out-of-order input; query whether two offices were connected at time T; then permit removal. Interviewer should look for sorted-event DSU, a clear component invariant and recognition that ordinary DSU cannot delete. Use Q3 after the attempt.

**B — Routes (45 min):** Find the least number of transfers between services in a directed network. Follow-up: transfers now have different nonnegative durations; return a route; review a version that marks visited on first discovery. Look for the switch from BFS to Dijkstra, parent updates, staleness handling and tests. Use Q6 afterward.

**C — Capacity assignment (45 min):** Jobs and processing centers lie on a line; centers have capacities and assignment cost is distance. Minimize total cost. Follow-up: return the assignment; huge capacities; arbitrary 2-D costs. Look for a counterexample to nearest-first, sorting/uncrossing and prefix DP. Use Q5 afterward.

**D — Data structure (45 min):** Build a fixed-capacity cache supporting read/update and eviction of the least recently used key. Follow-up: overwrite existing key; zero capacity; add expiration; explain concurrent access. Look for synchronized map/list state, careful edge handling and honest extra complexity for expiry/concurrency. Do not claim TTL is free under the original O(1) operations.

**E — Dashboard (50 min):** “We need to show the worst database queries.” Reveal traffic only after the candidate asks. At minute 25 change total-duration ranking to p95; at minute 35 introduce late and duplicate events. Score the ability to revise aggregation, not the number of technology names.

**F — Leadership (35 min):** Ambiguous ownership → disagreement → failure → feedback. For each, ask “What did you decide?”, “How do you know it worked?”, and “What would a collaborator say?” Request an actual different story if all answers collapse into the same polished success.

## Tracker

Keep this table factual. No results are pre-filled because your performance has not been assessed yet.

| Date / day | Problem or mock | Unseen? | Time / hints | Score /10 | Main error and counterexample | Revisit +1 / +3 / +7 days |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | Day 1 coding diagnostic | — | — | — | — | — |
| Pending | Day 1 dashboard diagnostic | — | — | — | — | — |
| Pending | Day 1 project story | — | — | — | — | — |

Error categories: modeling, proof, state definition, implementation, runtime/library knowledge, test coverage, complexity, communication and time management. Pick the next day's transfer drill based on repeated errors. “Do more DP” is vague; “I reuse the same factory's updated row and exceed capacity” is actionable.

## Start now

Open a blank editor, set 45 minutes, and do the Day 1 deployment-order prompt. Before code, write your clarifying questions, a small example, the graph model and the invariant. Afterward share your approach/code and elapsed time for feedback. The next coaching session should assess that attempt before introducing another question.
