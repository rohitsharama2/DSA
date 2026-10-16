# Four-week plan: assessment first, then coding and role depth

[Track index](README.md) · [Coding](01-Coding-Track.md) · [Judgment](02-Assessment-and-Leadership.md) · [Design](03-System-Design.md) · [Domain](04-Role-Fit-and-Domain.md)

**Start date: choose Day 1 when you begin.** Your notes propose a flexible four weeks and 2–3 hours/day. Actual interview dates and available study hours are unconfirmed. This plan completes the four weeks omitted after Day 7 in the supplied outline. Adjust around the invitation, not around an assumed Google assessment sequence.

## Before Day 1

Record assessment title, duration, deadline/time zone, permitted resources, delivery format and whether it includes coding. If the deadline is sooner than this plan, do the format-specific preparation first. A workplace questionnaire needs careful scenario reasoning; a timed coding assessment needs implementation fluency. This guide contains practice only—complete the actual assessment independently.

## Daily routine

Default 150 minutes: 65 coding (45 attempt + 20 review), 30 judgment/leadership, 35 design, 15 domain and 5 recall/logging. On mock days, replace the corresponding blocks rather than adding hours. In week one, use most judgment time for the six scenarios; after the assessment, shift that time toward genuine tech-lead stories or whichever technical gap the diagnostic reveals.

On paired-problem days, fully solve one and explain/trace the second. Do not force two hard implementations into one 45-minute block. Retest mistakes after 1, 3 and 7 days. Keep a log: date, unseen/familiar, time, hints, failed invariant, bug, repaired test and retest date.

## 28-day tracker

| Done | Day | Coding deliverable | Other preparation and evidence |
| --- | --- | --- | --- |
| [ ] | 1 | 35-minute diagnostic: unseen dependency ordering variant | Read invitation; scenarios 1 and 4; score accountability, support and delivery mitigation separately |
| [ ] | 2 | 207 then explain 210 order output and cycle detection | Incremental-build scope and dependency trace; 60-second role introduction |
| [ ] | 3 | 146 LRU implementation; explain 239 deque invariant | Trace cache updates/eviction; domain questions 1–3 |
| [ ] | 4 | Implement 239 without reference; ring-deque boundary tests | Scenarios 3 and 5: conflict, risky shortcut and justified escalation |
| [ ] | 5 | 127 Word Ladder; explain 269 prefix/cycle pitfalls | Build-system invalidation and cache-key deep dive |
| [ ] | 6 | 45-minute unseen coding mock, use dependency transfer prompt | Scenario 6; record hints and one actual collaboration story gap |
| [ ] | 7 | Retest the weakest week-one problem from scratch | Review invitation readiness; 25-minute judgment mock; no new hard topic |
| [ ] | 8 | 236 LCA; add missing-node follow-up verbally | Indexing requirements, representations and versioned update trace |
| [ ] | 9 | 295 streaming median; demonstrate heap invariants | Indexing stale-result race; domain questions 4–6 |
| [ ] | 10 | 56 merge intervals; endpoint and online variants | Remote-test lifecycle, run/execution/attempt distinctions |
| [ ] | 11 | 33 rotated search; duplicates counterexample | Scenario 2 release bug; prepare a real risk-management story |
| [ ] | 12 | 76 minimum window; repeated characters | Device lease expiry/late result; domain questions 7–9 |
| [ ] | 13 | 45-minute unseen sliding-window or heap mock | 45-minute incremental-build design mock; explain correctness before speed |
| [ ] | 14 | Retest two weakest explanations; implement one repaired solution | Review measurable progress; optionally run the small build-observation exercise |
| [ ] | 15 | 322 coin change; disprove greedy | AI assistant context, document versions and quality evaluation |
| [ ] | 16 | 139 word break; return one segmentation follow-up | Plugin lifecycle and compatibility; supply actual review/adoption story |
| [ ] | 17 | 743 Dijkstra; stale entries and unreachable nodes | Crash ingestion, grouping versus deduplication, release cohorts |
| [ ] | 18 | 72 edit distance; derive recurrence before coding | 45-minute indexing design mock; test rapid edits and project closure |
| [ ] | 19 | 4 median of sorted arrays; empty sides and partition proof | Threading/performance debugging drill; keep this stretch problem time-boxed |
| [ ] | 20 | 45-minute unseen DP mock using editor-suggestion transfer | 45-minute remote-testing design mock; lease, cleanup and retry semantics |
| [ ] | 21 | Retest weakest DP/graph problem | 30-minute leadership mock: real decisions, collaborators and outcomes; repair gaps |
| [ ] | 22 | Review heap operations and JS precision/stack traps | 45-minute AI-assistant design; adversarial context and stale patch |
| [ ] | 23 | Two short derivations: LRU + median/window distinctions | 45-minute plugin design; API evolution and resource ownership |
| [ ] | 24 | 45-minute unseen mixed coding mock | 45-minute crash-platform design; diagnose a misleading regression alert |
| [ ] | 25 | Re-solve a previously failed problem with a new constraint | Role-fit mock: why Android Studio, Java/Kotlin gap, technical leadership scope |
| [ ] | 26 | Mock A: 45-minute coding + follow-up | 35-minute leadership discussion + 40-minute review; retain only the two biggest repair items |
| [ ] | 27 | Mock B: 45-minute coding | 45-minute unseen design + 35-minute review; 15-minute technical role Q&A |
| [ ] | 28 | Short recall of invariants and edge cases; no new hard problem | Readiness gate, recruiter/logistics confirmation and light rehearsal |

## Readiness gates

**Assessment:** You understand the actual format/deadline and can reason about urgency, support, mitigation and follow-up without relying on slogans. There is no official score inferred from our scenario rubric.

**Coding:** In two recent unseen 45-minute mocks you clarified the contract, produced working base code, tested meaningful boundaries, stated correct complexity and handled one requirement change with limited or no help. If not, extend repair time; a solved-problem count is insufficient.

**Design:** You can complete each P0 mock with a concrete interface/state model, useful estimates, one correctness invariant, one race/failure trace and a defended trade-off. Do not memorize component lists.

**Tech lead:** Three project summaries plus real examples of disagreement, failure and helping another engineer; clear personal versus shared work; quantified outcomes only where supported. Fill missing facts rather than inventing stronger stories.

**Domain:** Explain all ten foundation questions in your own words, distinguish browser/mobile application work from IDE-platform work, and investigate one freeze/build/leak scenario methodically.

## If time shrinks

With seven days, first resolve the assessment format. Then prioritize 207/210, 146/239, 127/269, 743 and one DP recurrence; use one unseen timed mock and repair its failure. For design, cover the three P0 prompts with one failure trace each. Prepare your introduction and Ushur/Luckd/CoverSelf stories; skim domain foundations. Defer median-of-two-arrays depth and optional hands-on tooling until the immediate assessment/coding risk is addressed. This is prioritization, not a claim that other questions cannot appear.
