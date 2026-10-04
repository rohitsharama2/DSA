# Airbnb: Phase-Wise Interview Preparation

**Focus:** Airbnb software engineering interviews only.

**Language:** Node.js + TypeScript.

**Starting point:** Learn from first principles, then build toward the senior-level target in this repository.

**Suggested pace:** 12 weeks, six study days per week, around 2–3 hours per day. Extend a phase when its readiness check is not met.

**Prepared:** October 4, 2026.

## 1. Scope and how to use this plan

Use this file as your daily roadmap and open the separate phase files for detailed practice. Open the existing [concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md) only for the topics assigned below; you do not need to work through the entire multi-company handbook first.

The target role, level, location, and interview date have not been supplied. This plan assumes general software engineering with a backend focus. Senior roles also require evidence of ownership and impact from real work; completing exercises alone cannot replace that experience. If the role is frontend, mobile, or ML, revise the specialist sections using its job description and recruiter guidance.

**Source limitation:** The [shared conversation](https://chatgpt.com/share/6ac1f3d0-8678-83e8-82b1-60f09ccdd96f) could not be retrieved. This plan uses the repository's existing learning preferences and the official Airbnb sources listed at the end; it does not claim to reproduce that conversation.

**Process accuracy:** The phases below are a recommended study sequence, not a verified sequence of Airbnb interview rounds. Technical formats, round counts, tools, and timing must be confirmed with the recruiter. The coding exercises and product scenarios are preparation suggestions, not a list of questions Airbnb is guaranteed to ask.

## 2. Interview preparation map

| Interview area to confirm | What to prepare | Study phases |
| --- | --- | --- |
| Recruiter conversation | Introduction, role fit, motivation, availability, questions about the process | 0 and 6 |
| Technical screening / coding | Clarification, algorithms, correct TypeScript, tests, complexity, follow-ups | 1–3 |
| Practical coding / code review, if included | Debugging, requirements, maintainability, asynchronous behavior, test selection | 4 |
| System design, if included | Requirements, APIs, data model, consistency, scaling, failure handling | 5 |
| Project / hiring-manager discussion, if included | Individual contribution, decisions, delivery, impact, lessons | 6 |
| Cross-functional discussion, if included | Collaboration, disagreement, product trade-offs, stakeholder communication | 6 |
| Core values | Specific personal or professional experiences, decisions, reflection, growth | 6, practiced throughout |
| Full rehearsal | Consistent performance under time constraints | 7 |

Airbnb's official core-values preparation material describes at least one 45-minute interview with someone outside the functional team. It emphasizes specific experiences and reflection rather than technical vetting, and says the interviewer has not seen your resume. Give enough context for each story to stand alone. Confirm your scheduled format with the recruiter. [Official core-values preparation](https://cviprep.withairbnb.com/)

## Phase files

- [Phase 0 — Set the target and measure your baseline](00-Role-and-Baseline.md)
- [Phase 1 — Foundations and confident TypeScript](01-Foundations-and-TypeScript.md)
- [Phase 2 — Core algorithms with marketplace scenarios](02-Core-Algorithms.md)
- [Phase 3 — Dynamic programming and mixed timed coding](03-DP-and-Coding-Rounds.md)
- [Phase 4 — Practical engineering, debugging, and code review](04-PR-Review-and-Practical-Coding.md)
- [Phase 5 — Airbnb-context system design](05-System-Design.md)
- [Phase 6 — Core values, collaboration, and project depth](06-Core-Values-and-Behavioral.md)
- [Phase 7 — Full rehearsal and final revision](07-Mock-Interviews-and-Final-Revision.md)

- [Candidate-reported interview breakdown and question tracker](Interview-Experience-and-Question-Tracker.md)

## 11. Weekly schedule and daily routine

| Week | Main focus | Concrete output |
| --- | --- | --- |
| 1 | Baseline and foundations | Role checklist, error log, first solved exercises |
| 2 | Core data structures and TypeScript | Foundation readiness check |
| 3 | Intervals, heaps, and trees | Availability exercise and traversal practice |
| 4 | Graphs and backtracking | Pagination/dependency exercises and three mocks |
| 5 | DP foundations | Explained recurrences and tested implementations |
| 6 | Mixed coding | Five timed attempts and targeted retries |
| 7 | Practical engineering | Reviewed endpoint and one small component |
| 8 | Search and booking design | Two design documents with APIs and data models |
| 9 | Failure handling and messaging | Two design mocks and failure-path notes |
| 10 | Values and project depth | Eight story notes and two project briefs |
| 11 | First mock loop | Scored gaps and focused revision |
| 12 | Second mock loop and final review | Completed readiness checklist |

**Daily core session: 150 minutes**

- 20 minutes: Revisit one earlier mistake without reading the solution.
- 60 minutes: Work on the current phase's main exercise.
- 30 minutes: Test, dry-run, and explain the approach aloud.
- 25 minutes: Practice a behavioral story or design trade-off.
- 15 minutes: Record mistakes and schedule a retry.

Use the sixth study day for a mock and review; keep one day free for rest or catch-up. Move forward based on the readiness checks, not the calendar alone.

### If the interview is in four weeks

This compressed track assumes you already meet the foundations check. If you do not, use the time to address the largest gaps and discuss scheduling with the recruiter.

1. **Week 1:** Baseline, arrays/maps, intervals, heaps, and traversal; select behavioral stories.
2. **Week 2:** Graphs, DP basics, mixed coding, and practical review if required.
3. **Week 3:** Booking/search designs, project deep dives, and values practice.
4. **Week 4:** Two mock loops, targeted revision, and setup checks.

If technical screening is the next confirmed step, give coding most of the immediate study time while retaining short behavioral practice. Once the full loop is scheduled, distribute time across its confirmed areas.

## 12. AI / ML: include only when the Airbnb role requires it

For a general SWE role, finish the core roadmap first. The repository's broader AI curriculum is optional here.

If the job description or recruiter explicitly requires AI/ML, add role-specific preparation using companion guide sections 18–21:

- **Search ranking:** Candidate retrieval, ranking features, training labels, data leakage, offline metrics, online experiments, and cold start.
- **Support assistant:** Retrieval, grounding, evaluation datasets, privacy, prompt injection, latency, and human escalation.
- **ML system design:** Training/serving consistency, monitoring, drift, rollout, and rollback.

**Output:** One role-relevant design with a defined dataset, evaluation plan, failure cases, and production constraints. These are suggested practice areas, not confirmed interview requirements.

## 13. Progress and error log

Copy this row for every substantial exercise. A problem is ready for revision only after you can explain it without the solution open.

| Date | Phase / exercise | Independent? | Main mistake | Correct reasoning | Retry +2 days | Retry +7 days |
| --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | Example: blocked-date intervals | No | Confused closed and half-open dates | State the interval contract before comparing boundaries | Pending | Pending |

### Phase tracker

- [ ] Phase 0: Role and baseline recorded.
- [ ] Phase 1: Foundations readiness check passed.
- [ ] Phase 2: Core algorithm mocks completed.
- [ ] Phase 3: Mixed coding readiness check passed.
- [ ] Phase 4: Practical exercise and review completed.
- [ ] Phase 5: Design mocks completed.
- [ ] Phase 6: Values stories and project deep dives ready.
- [ ] Phase 7: Two mock loops reviewed and gaps addressed.

## 14. Sources and reading order

1. **Your Airbnb job description and recruiter instructions:** The source of truth for your specific role and scheduled interviews.
2. **[Airbnb: Preparing for your core values interviews](https://cviprep.withairbnb.com/):** Official interview preparation. Search-indexed content was accessible during preparation; the direct page returned an error.
3. **[Airbnb: Life at Airbnb](https://careers.airbnb.com/life-at-airbnb/):** Official values and company context, reviewed October 4, 2026.
4. **[Local concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md):** Use only the assigned sections as you progress.
5. **[Original shared conversation](https://chatgpt.com/share/6ac1f3d0-8678-83e8-82b1-60f09ccdd96f):** Provided by the user but inaccessible during preparation; no contents from it have been assumed.

**Start today:** Complete phase 0, solve Two Sum in TypeScript with an explanation and edge cases, then draft one truthful story about helping a teammate.
