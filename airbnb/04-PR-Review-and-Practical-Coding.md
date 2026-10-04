# Phase 4 — Practical engineering, debugging, and code review

**Reference:** [Concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md). Section numbers below refer to this guide.

**Immediate assessment track:** [90-minute progressive workbook with all four levels solved](CodeSignal-90-Minute-Progressive-Workbook.md).

**Time:** Week 7. Increase or reduce this phase after confirming the interview format.

**Read:** Companion guide sections 16–17.

- [ ] Explain the event loop, promises, bounded concurrency, and blocking work.
- [ ] Handle timeouts, partial failures, retries, and error propagation.
- [ ] Validate API inputs; distinguish authentication from authorization.
- [ ] Explain database transactions, indexes, uniqueness, and pagination.
- [ ] Review code by impact: correctness, data integrity, security, reliability, then maintainability.

### Practice A: Review a booking endpoint

Inspect or write a deliberately small example that checks availability, takes payment, and creates a reservation. Identify:

1. A race between the availability check and reservation creation.
2. Duplicate side effects when a request is retried.
3. A payment success followed by a database failure.
4. Missing authorization for a guest or host action.
5. Incorrect date, currency, or timezone assumptions.

For each finding, give a reproduction scenario, user impact, proposed fix, and targeted test. A single-process lock is not sufficient when multiple service instances accept requests.

### Practice B: Build one small component

Choose one: an in-memory TTL cache, a bounded-concurrency task runner, or a cursor-paginated listing API. Define ordering, error behavior, and boundary conditions before implementation. Explain which guarantees would change in a distributed deployment.

**Readiness check:** In a 45-minute review rehearsal, identify the major correctness issues, prioritize them, and explain two fixes with tests. In a separate implementation session, deliver one component with a clear contract and meaningful edge-case coverage.

## Three-PR rehearsal from the candidate report

The [supplied report](Interview-Experience-and-Question-Tracker.md) described three PRs. Confirm your own format. For practice, review three small changes: an availability query, a payment-retry handler, and a paginated listings endpoint.

Use a self-imposed 45-minute session: 5 minutes to understand all changes, 25 minutes to investigate correctness and risk, 10 minutes to propose fixes and tests, and 5 minutes to summarize. This is a practice budget, not an official duration.

For each PR, record:

- Intended behavior and assumptions.
- Blocking findings with a concrete failing example and user impact.
- Proposed fix and a regression test.
- Nonblocking maintainability observations, clearly separated from blockers.
- Questions requiring author clarification rather than speculative accusations.

Check logic first, then authorization and data integrity, failure handling, and maintainability. Do not spend the session polishing naming while a booking race remains unexplained. Finish with a reasoned approve/request-changes recommendation for each practice PR.

**CodeSignal preparation:** Use the [dedicated assessment guide](CodeSignal-Assessment-Guide-and-Examples.md) for format-specific setup, worked TypeScript examples, and timed mocks.

---

[Airbnb roadmap](README.md) · [Previous phase](03-DP-and-Coding-Rounds.md) · [Next phase](05-System-Design.md)
