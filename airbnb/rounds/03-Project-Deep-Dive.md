# Project explanation and technical-experience round

[Round-wise index](README.md) · [Hiring-manager answers](04-Hiring-Manager-Questions-and-Answers.md)

**Target role:** Internationalization Infrastructure, Application Platform. Your supplied description emphasizes autonomous ownership, distributed systems, safe migration, intuitive internal tools, stakeholder collaboration, and measurable outcomes. These are the strongest project-selection criteria for this application.

Your actual project history has not been supplied. The templates below must be filled with your real work. The worked example is explicitly fictional practice; it is not a biography to recite.

## What the round is trying to establish

A strong project discussion makes your personal contribution, decisions, delivery, and learning easy to examine. An unverified-age [LeetCode candidate report](https://leetcode.com/discuss/post/5704823/AirBnb-Senior-Onsite/) describes questions about milestones, collaborators, implementation choices, rollout, and lessons. A [2026 curated report](https://prachub.com/interview-experiences/airbnb-software-engineer-interview-experience-passed-onsite-and-core-value-now-waiting-on-team-match) also emphasizes probing resume projects. These are candidate accounts, not an official scoring rubric.

Use a project where you can explain the request path, data model, failure modes, operational behavior, and business purpose. It need not involve translation: a reliable workflow platform, migration, event pipeline, vendor integration, or internal React tool can demonstrate transferable experience.

## Choose two projects

| Primary project | Secondary project |
| --- | --- |
| A substantial end-to-end delivery or production migration | A failure, ambiguous problem, or prototype that changed direction |
| Clear individual decisions and implementation | Evidence of learning and collaboration |
| Real user/customer benefit and operational evidence | A contrasting technical or organizational challenge |

A smaller project you genuinely owned is stronger material than a famous company initiative you only observed. “I implemented the worker and rollout checks; my teammate designed the UI” is a precise contribution statement.

## Fill this facts sheet before rehearsing

| Field | Your answer |
| --- | --- |
| Project and dates | `[name, approximate dates]` |
| Customer and pain | `[who struggled, concrete workflow, evidence]` |
| Success criterion | `[metric, baseline, target or qualitative criterion]` |
| Your scope | `[decisions/code/operations you owned]` |
| Team scope | `[what others owned]` |
| Constraints | `[time, privacy, scale, compatibility, budget]` |
| Architecture | `[request path, APIs, storage, queues, UI]` |
| Hardest choice | `[options, evidence, trade-off, chosen approach]` |
| Failure/incident | `[symptom, diagnosis, mitigation, prevention]` |
| Rollout | `[tests, canary, migration, rollback]` |
| Outcome | `[measured result, period, evidence source]` |
| Attribution limit | `[what else may have affected the result]` |
| Learning | `[what you would change]` |
| Relevance here | `[workflow/library/migration/AI/tooling connection]` |

For every number, be ready to explain its source and denominator. Distinguish load-test capacity from production traffic, average from p95, and a team's outcome from your individual contribution. If you did not measure a result, say what evidence you do have and what you would measure next.

## A 90-second project introduction

> “The users were [customer group], and their workflow was failing at [specific point]. We knew this from [evidence]. I owned [scope], working with [partners]. The main constraint was [constraint], so I chose [approach] over [alternative] because [trade-off]. I implemented [two concrete contributions] and rolled it out using [validation and rollback]. Over [period], we observed [real outcome]. The biggest lesson was [specific learning]. The part most relevant to this role is [connection].”

Stop there and let the interviewer choose a deep dive. Do not consume the round with a chronological list of every ticket.

## Ten-minute technical explanation

| Minutes | What to show | Useful opening |
| --- | --- | --- |
| 0–1 | User problem and success criterion | “The important constraint was…” |
| 1–2 | Personal ownership and collaborators | “My responsibility was…” |
| 2–4 | Architecture and one request | “A request enters here; this is the durable boundary…” |
| 4–6 | Hardest decision and alternative | “We considered X and Y. The evidence favored…” |
| 6–8 | Failure handling and rollout | “If this call times out, we cannot assume failure…” |
| 8–9 | Outcome and evidence | “We measured this over…, with these limitations…” |
| 9–10 | Learning and future change | “The part I would change now is…” |

Sketch the actual system you worked on. For a Node/React project, describe the API and storage boundaries as carefully as the component tree. For this job, connect a UI decision to a user's workflow and an infrastructure decision to correctness or operations.

## Worked fictional example: a content-review workflow

**Practice scenario only:** A team replaces spreadsheet-based review of localized content with a React queue and a TypeScript service. Vendor callbacks can arrive twice or after the source content changes. No numerical outcome is assumed.

**Sample introduction:**

> “The content team had difficulty knowing which source revision a translation belonged to, so reviewers sometimes worked on outdated text. In this practice scenario, I own the workflow API and review UI. The key decision is to treat source revisions as immutable and make every translation and review reference a revision. That lets us retain history while rejecting stale approvals. I would ship read-only visibility first, shadow the existing process, then enable approvals for a small cohort. I would judge the rollout by stale-approval prevention, review turnaround, and manual reconciliation effort—not by whether the dashboard looks complete.”

This phrasing deliberately describes a proposed design. For a real past project, replace it with what you actually did and observed.

**Technical deep dive:** The authoring service records a revision and outbox event in one transaction. An idempotent worker creates locale jobs. Vendor callbacks include stable request identity. The React UI fetches a job revision and submits decisions with its expected version. The backend checks authorization, current version, and status before applying a transition. Publication references approved immutable artifacts rather than whichever text happens to be latest.

**Decision explanation:** “I would use a relational store initially because jobs, revisions, and approvals need explicit relationships and transactional transitions. A queue decouples vendor latency from the request path. I would not put a vendor call inside a long-running database transaction.”

**Trade-off:** “Keeping immutable versions costs storage and makes cleanup more deliberate, but it makes audit, rollback, and stale-result handling much clearer.”

**Failure answer:** “A callback for an old revision can be saved as historical evidence, but it cannot make that revision current. A duplicated callback is recognized by request/result identity. If provider success is ambiguous, I reconcile using the provider's status API when available rather than blindly creating another paid request.”

**React answer:** “Changing jobs quickly can reorder fetch responses. I cancel or ignore stale work and key the rendered resource by job identity. Approval carries a version and a server-side permission check. A disabled button alone cannot enforce correctness.”

## Follow-ups and how to answer them

| Question | What a substantive answer contains |
| --- | --- |
| Why this project? | Customer need, alternatives, and impact; not just a fashionable technology |
| What exactly did you do? | Named decisions, code paths, design documents, operational work; acknowledge others |
| Why SQL / cache / queue? | Required access patterns and guarantees, simpler alternative, cost of the choice |
| What breaks at 10× traffic? | First measured/likely bottleneck, evidence needed, bounded next change |
| How did you estimate time? | Milestones, uncertainties, dependency lead times, deliberate scope cuts |
| What was your hardest disagreement? | Competing goals, how you gathered evidence, decision, and relationship afterward |
| What did you miss? | Your own decision or omission, its impact, mitigation, and changed practice |
| How did you migrate? | Source of truth, backfill, compatibility, shadow comparison, cutover, rollback |
| How did you know it worked? | Instrumentation, baseline, observation window, limitations and counter-metrics |
| How did you enable others? | Clear interfaces/docs, onboarding, pairing or delegation, support and feedback |
| How did you use AI? | Specific bounded task, verification, data rules, review; what you checked yourself |
| What would you do differently? | A real change motivated by evidence, not a disguised boast |

## A project explanation that is too vague—and how to improve it

Vague: “I built a scalable React and Node application with microservices and improved performance.”

Specific template: “The review queue took [measured time] to load for [workload]. I traced the delay to [query/network/render issue]. I changed [specific part], compared it against [alternative], and verified [correctness and performance checks]. The measured result was [actual result] over [period]. The remaining bottleneck was [limitation].”

If you do not have those measurements, do not fill them with guesses. Explain the observable symptom, your debugging evidence, and the test you used; then identify the instrumentation you would add.

## Rehearsal checklist

- [ ] Explain two projects in 90 seconds each without reading.
- [ ] Draw one actual request and failure path for each.
- [ ] Name at least two alternatives you considered, with reasons.
- [ ] Separate your contribution from team output.
- [ ] Explain a mistake without blaming a colleague.
- [ ] Defend every metric and resume claim.
- [ ] Connect your experience to translation workflows, platform reliability, libraries, or internal tooling without claiming experience you do not have.
