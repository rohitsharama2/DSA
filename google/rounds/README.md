# Google L5 India: complete interview guide

[Company index](../README.md) · [Recruiter screening](00-Recruiter-Screening.md) · [Sources and confidence](Research-Sources.md) · [Daily plan and mocks](04-Preparation-Plan-and-Mock-Interviews.md)

**Updated October 16, 2026.** Target: general SWE / full-stack L5 in India. Keep TypeScript/JavaScript as the preparation language; confirm permitted language and libraries with your recruiter. A strong preparation outcome is independently solving unfamiliar problems, defending design decisions, and demonstrating real ownership. It cannot guarantee selection or leveling.

**Current role:** Use the [Android Studio Tech Lead track](../android-studio-tech-lead/README.md) for your current Bengaluru interview. The sections below remain general SWE preparation; confirm the actual role-specific loop.

[All questions and local answers](../solutions/README.md) gives direct access to code, design solutions, behavioral templates and mock follow-ups.

## The full process to prepare for

The [October India report supplied by you](https://www.reddit.com/r/LeetcodeDesi/comments/1x56nee/google_l5_chances_with_lh_in_system_design_india/) describes screening coding + Googleyness, followed by two onsite coding rounds and system design. The [April India full-stack account and author comments](https://www.reddit.com/r/LeetcodeDesi/comments/1slxvll/cleared_google_l5_india_team_matching_taking_time/) also describe three coding interviews, one Googleyness, and one design in total. Use this as a working template, not a guaranteed sequence. Hiring review and matching can overlap or vary; additional interviews may be requested. [G5–G8](Research-Sources.md)

| Stage | What to prepare | Concrete completion target |
| --- | --- | --- |
| Application / recruiter conversation | Role scope, resume, motivation, location, availability, relevant ownership | [Tailored introduction, three project summaries and logistics sheet](00-Recruiter-Screening.md); questions about the exact loop |
| Assessment, **only if invited** | Read the actual invitation; do not infer an OA or assessment type from new-grad reports | Know duration, format, permitted tools and deadline; no universal L5 OA is established here |
| R1: coding qualification / screen | Modeling, constraints, working code, correctness and follow-ups | One unfamiliar 45-minute problem using the [DSA guide](01-DSA-Coding-Questions-and-Solutions.md) |
| R2: Googleyness / leadership | Ambiguity, collaboration, disagreement, feedback, responsibility, learning | Six factual stories and live follow-ups using the [leadership workbook](03-Leadership-and-Team-Matching.md) |
| R3: onsite coding A | Depth in DP, graphs, trees or other patterns; articulate why the solution works | Complete base case plus a changed requirement; test before time ends |
| R4: system design | Requirements, estimates, APIs/data, architecture, two deep dives, failures | A complete 45–60-minute design using the [design workbook](02-System-Design-and-Followups.md) |
| R5: onsite coding B | Adapt the data model or algorithm; tests and review | Explain exactly why a new constraint invalidates the original approach |
| Additional interview, if requested | Address the area recruiter identifies while retaining breadth | One targeted mock with evidence of the repaired gap; no assumptions about outcome |
| Hiring / leveling review | Keep resume facts and project scope precise; ask recruiter for status | Distinguish confirmed feedback from your own impression; no candidate-facing exam to memorize |
| Team matching / manager discussion | Relevant project depth, motivation, team needs, ownership and collaboration | Two project briefs, fit pitch, and questions about actual work |
| Offer discussion / closing | Written role, location, level, compensation components and start date | Confirm terms and remaining steps with recruiter; matching progress is not a written offer |

The R1–R5 numbering follows G6 for practice; design and behavioral need not occupy those positions in your invitation. Do not assume a separate code-review round from the code-review **follow-up** reported in G6. Domain-specific frontend, Android, ML or AI design should be added if the role requires it; AI work on your resume does not automatically make this an ML interview.

## What changed in this update

| Recent reported theme | Preparation response | Evidence strength |
| --- | --- | --- |
| Union-find with follow-ups | Q3 connectivity; explain insertion versus deletion and scaling | G6 theme only; exact problem unknown |
| DP “similar to robot factory” | Q5 capacity assignment; sorting proof, recurrence, time/space, reconstruction | G6 analogy; LC 2463 is our practice mapping |
| BFS followed by Dijkstra | Q6 unweighted → weighted paths; stale entries, adversarial tests, review | G6 algorithms reported; our graph contract is original |
| Dashboard of N worst queries | Clarify metric/window first; design aggregation and top-K correctly | G6 vague design theme; our detailed contract is original |
| DP, linked list + hash map, tree | Keep LRU, pointer manipulation, traversal, LCA, serialization | G8 broad categories only; specific LC titles are our choices |
| Ecommerce/payment-related design | Payment/reconciliation drill tied to Luckd | G8 broad comments; no exact reconstruction claimed |

October 16 adds Q7–Q9 (category-cooldown dispatch, grid follow-up ladder, multiplayer board) from the [user-shared L5 repost](https://www.reddit.com/r/OfferEngineering/comments/1v6bivx/passed_google_l5_none_of_the_questions_were/), plus Two Sum and linked-list reversal warm-ups from [Mockd demos](https://mockd.fyi/?q=google). Design sections 6–7 add promotional offers and an optional SRE log-system drill. G9 is an unverified secondary narrative; M1–M2 are demos without L5 claims. See the source register for provenance.

## Recruiter checklist

Confirm the target level and generic SWE versus frontend/full-stack/domain scope; round count and duration; order of coding/leadership/design; remote versus office location; accepted language/runtime and built-in collections; editor, execution and drawing tools; any assessment; and permitted preparation aids during the actual interview. Ask for role-specific preparation materials and accommodations if needed. Follow the invitation; official [virtual-interview guidance](https://services.google.com/fh/files/misc/general_virtual_interviews_candidate_resource.pdf) covers setup, not a universal hiring loop.

## How to use this repository

Start with the [personalized recruiter-screening workbook](00-Recruiter-Screening.md) if your next conversation is the initial recruiter call. It includes resume-grounded answers and a 25-minute mock.

1. Do the Day 1 diagnostic in the [28-day plan](04-Preparation-Plan-and-Mock-Interviews.md) before reading solution code.
2. Work through the 30 foundations plus thirteen October additions in the [DSA guide](01-DSA-Coding-Questions-and-Solutions.md). Spend more time explaining and varying a problem than counting solved questions.
3. Start design and leadership in week one. Default allocation: 60% coding, 25% design, 15% leadership; adjust after your diagnostic. This is our study allocation.
4. Use resume facts to defend decisions, not to invent scale or imply causal certainty. The [story workbook](03-Leadership-and-Team-Matching.md) maps your existing projects to prompts.
5. Run executable solution checks from the repository root with Node.js 22.13+:

```sh
node examples/check-agoda-google-examples.mjs
```

The checks execute TypeScript blocks extracted from Markdown, including independent reference comparisons. They do not perform static TypeScript checking. Passing them validates the examples, not interview readiness.
