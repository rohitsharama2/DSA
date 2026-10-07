# Phase 5 — Airbnb-context system design

**Next preparation:** [Round-wise design questions and follow-up answers](rounds/02-System-Design-Questions-and-Followups.md).

**Reference:** [Concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md). Section numbers below refer to this guide.

**Time:** Weeks 8–9.

**Read:** Companion guide section 17. Draw designs yourself and justify each component. These scenarios are practice designs, not descriptions of Airbnb's internal architecture.

### Design 1: Listing search

- Requirements: location, dates, guest count, filters, ordering, and pagination.
- Model: listings, locations, amenities, prices, and availability.
- Discuss a search index, geospatial lookup, filtering, ranking, and cache keys.
- Explain index freshness and why booking must revalidate authoritative availability.
- Follow-ups: unstable rankings between pages, stale prices, hot destinations, and partial service failure.

### Design 2: Availability and reservation booking — primary deep dive

- Sketch `GET /listings/{id}/availability`, `POST /reservations`, and cancellation APIs.
- Model listing-night inventory, reservations, expiring holds, and payment attempts.
- Define a state machine such as `pending → confirmed` or `pending → expired/failed`, with cancellation transitions governed by policy.
- State the invariant: a listing-night cannot belong to two active reservations or holds under the chosen policy.
- Explain how an atomic transaction claims every night, with constraints or locking that enforce the invariant. A unique reservation ID alone does not prevent overlapping stays.
- Scope idempotency keys and persist their outcomes; define behavior when a key is reused with different input.
- Discuss hold expiry, payment authorization/capture, callbacks, compensation, and reconciliation when service outcomes disagree.
- Follow-ups: simultaneous booking attempts, retries after timeouts, delayed payment callbacks, cancellation, and daylight-saving boundaries.

### Design 3: Guest-host messaging

- Define conversations, messages, participants, and authorization.
- Discuss delivery, reconnects, offline notifications, deduplication, and per-conversation ordering.
- Separate message persistence from push-notification success.
- Follow-ups: retry duplicates, unread counts, abuse reporting, and retention requirements.

### Reusable 50-minute design rehearsal

1. **5 minutes:** Scope users, requirements, and success criteria.
2. **5 minutes:** State scale assumptions and estimate load/storage where useful.
3. **10 minutes:** Define APIs and the data model.
4. **15 minutes:** Draw the main flow and explain one correctness-critical path.
5. **10 minutes:** Explore failures, bottlenecks, and trade-offs.
6. **5 minutes:** Cover metrics, rollout, and open decisions.

Track outcomes such as booking correctness, search latency, payment reconciliation backlog, and message delivery delay. Explain what an alert means for guests and hosts.

**Readiness check:** Complete two independent design mocks. Defend the booking concurrency invariant, explain a failure-recovery path, and connect architectural choices to stated requirements. For senior preparation, also explain migration, operational ownership, and how you would validate the design before broad rollout.

## Optional stretch mock: Senior target, Staff-level feedback

The [candidate report](Interview-Experience-and-Question-Tracker.md) recommends requesting feedback one level above the target. Use this after a normal Senior mock, as a learning exercise. LLM scores are practice feedback, not a reliable prediction of an Airbnb hiring decision.

```text
Act as a mock interviewer for an Airbnb-context Senior SWE system-design session.
Give me a booking, search, or messaging problem and let me clarify requirements.
Ask one follow-up at a time. Do not reveal the solution while I am answering.
Afterward, assess my Senior-level performance using evidence from my answers.
Separately give Staff-level stretch feedback on scope, migrations, operational
ownership, cross-team decisions, and long-term trade-offs. Identify my three
largest gaps and give one focused exercise for each. Do not invent Airbnb's rubric.
```

### Optional: Design an A/B test with causal inference

Keep the [question supplied in the report](https://prachub.com/interview-questions/design-an-a-b-test-with-causal-inference) in the tracker, but prioritize it when the role includes experimentation or data work. It is not a DP problem.

For a practice proposal, define a product hypothesis, treatment, control, target population, and causal effect of interest. Discuss the randomization unit, a primary outcome, guardrail metrics, sample-size assumptions, exposure logging, and a preplanned analysis. Explore how guests competing for shared listing inventory could complicate independence between groups. State which conclusions the experiment can and cannot support.

**Output:** A one-page experiment proposal plus assumptions to review with a data-science partner. This is a role-dependent extension, not a confirmed general SWE interview round.

---

[Airbnb roadmap](README.md) · [Previous phase](04-PR-Review-and-Practical-Coding.md) · [Next phase](06-Core-Values-and-Behavioral.md)
