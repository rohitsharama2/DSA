# Stripe and Netflix: preparation strategy

[Stripe guide](../stripe/rounds/README.md) · [Netflix guide](../netflix/rounds/README.md) · [Existing Agoda/Google strategy](Agoda-Google-Preparation-Strategy.md)

**Prepared October 12, 2026.** Assumption: experienced SWE with senior-level follow-ups, using Node.js/TypeScript. Exact level, team, location, and interview date are unconfirmed. This is qualitative interview research, not a statistical market or hiring forecast. Evidence is documented in the [Stripe](../stripe/rounds/Research-Sources.md) and [Netflix](../netflix/rounds/Research-Sources.md) registers.

## How these tracks differ

| Dimension | Stripe | Netflix |
| --- | --- | --- |
| Coding emphasis in this plan | Multipart parsing/data processing and extending clean code | Stateful APIs, caches/history, broad DSA |
| Practical emphasis | HTTP/JSON integration and debugging unfamiliar modules | Team-specific domain/runtime work; format varies |
| Design practice | Retry-safe operations, events, ledger invariants, scheduling | Versioned state, data modeling, then Ads/playback/UI branch |
| Project emphasis | User impact, integration reliability, delivery judgment | Domain depth, decision ownership, feedback/collaboration |
| Research limitation | Recent backend reports often omit seniority | Detailed recent Ads reports include publisher summaries; firsthand L4 evidence is separate |

These are our recommendations from a small public sample, not company-wide percentages. Both tracks require communication, correct implementation, testing, and sound trade-offs.

## Day zero

Record the requisition, level, team, location, next round, duration, language/runtime, available libraries, and recruiter preparation packet. Confirm practical/take-home/debugging format early. Any AI-assisted format must come from the invitation, not a report about another candidate.

Baseline: solve one unfamiliar medium problem in 45 minutes, implement a small stateful API in 45 minutes, and explain a project for 15 minutes. If hashing, traversal, or complexity is unfamiliar, add a foundation phase using the [concepts handbook](DSA-CS-AI-Concepts-and-Solutions.md) before compressing preparation.

## Six-week plan: six study days per week

| Week | Shared work | Stripe output | Netflix output |
| --- | --- | --- | --- |
| 1 | Maps, sorting, strings, intervals; baseline | CSV parser and multipart scheduler | Timed cache and historical reads |
| 2 | Stateful APIs, queues, heaps, binary search | Request replay and conflict tests | Undo/redo and notification-time search |
| 3 | Mixed DSA, traversal, DP foundations | Paginated API drill and unfamiliar-module debugging | One tree/graph problem plus mixed-TTL/history follow-ups |
| 4 | Design and data invariants | Retry-safe API and webhook-delivery designs | Configuration design plus the relevant team branch |
| 5 | Projects, collaboration, targeted retries | Two project briefs; integration/bug-squash mocks | Two project dossiers; modeling/culture mocks |
| 6 | Two simulated loops; close error-log gaps | Coding + practical + design/project rehearsal | Coding + team-specific design + project/culture rehearsal |

The 48 linked questions overlap with earlier banks; they are a menu, not a six-week quota. Do P0 first, then fill observed gaps with P1. Hard problems are useful when they teach a missing pattern, not merely because of their label.

**Daily 150 minutes:** 20 retry; 50 coding; 30 testing/debugging; 35 design or project practice; 15 error log. Stripe candidates should regularly replace a DSA slot with integration/debugging. Netflix candidates should select a domain branch after learning the actual team. Keep one rest/catch-up day per week.

## Two-week compressed plan

Only for candidates already comfortable with the baseline; adjust for the next confirmed interview.

| Days | Stripe | Netflix |
| --- | --- | --- |
| 1–2 | Parser/scheduler and data-structure baseline | Cache/history and broad DSA baseline |
| 3–4 | Request replay + paginated API | Undo/redo + binary-search-on-answer |
| 5–6 | Two debug drills plus unfamiliar code | Tree/graph/interval gap work and changed contracts |
| 7 | Timed multipart coding mock | Unseen coding mock |
| 8–9 | Retry-safe API and webhook design | Configuration + team-domain design/modeling |
| 10 | Two project briefs and leadership stories | Two dossiers and culture/feedback stories |
| 11–12 | Integration/bug squash and full-loop rehearsal | Coding/design/culture rehearsal |
| 13 | Retry concrete failures independently | Retry concrete failures independently |
| 14 | Light revision, setup check, rest | Light revision, setup check, rest |

## Reuse prior preparation

- [Agoda API and DSA workbook](../agoda/rounds/01-DSA-Coding-Questions-and-Solutions.md): reuse maps, parsing, and API-pagination reasoning for Stripe.
- [Google graph/heap workbook](../google/rounds/01-DSA-Coding-Questions-and-Solutions.md): retain broad DSA coverage for both; don't replace fundamentals with domain stories.
- [Airbnb practical review](../airbnb/04-PR-Review-and-Practical-Coding.md): rehearse understanding existing code and choosing high-value tests.
- [Airbnb JS/TS/React workbook](../airbnb/rounds/05-JS-TS-React-and-I18n.md): reuse async and UI-state work for Netflix frontend/full-stack roles.
- Reuse truthful project facts across companies; change emphasis rather than inventing a new history.

## Self-assessment rubric

This is a learning rubric, not employer scoring. Score 0 = missing, 1 = substantial help, 2 = minor correction, 3 = independent and clear.

| Dimension | Evidence |
| --- | --- |
| Contract | Defines equality, ordering, time boundaries, numeric limits, invalid input |
| Model | Derives state/invariant and selects a fitting data structure |
| Implementation | Working, readable code that can accept the next requirement |
| Verification | Edge cases plus an adversarial/state-sequence test |
| Failure reasoning | Handles partial failure, duplicates, stale state, or resource limits where relevant |
| Communication | Explains decisions, tests assumptions, responds to feedback |

Suggested coding readiness: three unseen mocks with no dimension below 2. For Stripe add one unfamiliar-code debugging mock and an integration mock. For Netflix add a team-relevant design/modeling mock. For both, finish two project deep dives and six stories. These targets are not offer predictors.

## Progress tracker

| Date | Company / task | Independent? | First failure | Corrected invariant / test | Retry +2 days | Retry +7 days |
| --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | Example: timed cache | No | Deleted refreshed value at old deadline | Expiry generation must match current version | Pending | Pending |

If the model is wrong, simplify the problem and explain the invariant before recoding. If implementation is wrong, add the smallest failing test and retry without the solution. Reading a fix is not an independent solve.

## TypeScript and environment rehearsal

Practice numeric sort comparators, `Map`/`Set`, heap/queue implementations, file/JSON parsing, async errors, and injectable clocks. Avoid floating-point money calculations and unsafe integer timestamps. Distinguish missing values from valid empty strings. Check whether the actual interview runtime supports TypeScript or expects JavaScript.

For integration, practice HTTP status checks, validation of unknown JSON, pagination, timeouts, and bounded retries with fixtures. For debugging, verify your test command and breakpoint workflow before the mock. Use the editor and tool constraints in the invitation.

## Run the worked examples

From the repository root with Node.js 22.13+:

```sh
node examples/check-stripe-netflix-examples.mjs
```

The checker executes eight TypeScript blocks from the new Markdown, including the async integration solution. It uses deterministic fixtures and independent reference models. Runtime checks do not replace static type checking or verification of a real external API.
