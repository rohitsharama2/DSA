# Stripe: system design and follow-ups

[Round-wise index](README.md) · [Integration workbook](02-Integration-and-Bug-Squash.md) · [Sources](Research-Sources.md)

These are **original domain-relevant design exercises**, not reported exact interview questions. Confirm whether design is in your loop. Stripe's official [idempotency](https://docs.stripe.com/api/idempotent_requests) and [webhook](https://docs.stripe.com/webhooks) documentation are technical reading, not interview rubrics.

## 1. Retry-safe payment operation

**Prompt:** A merchant retries after a timeout. Design an API that avoids duplicating the intended operation while preserving a useful response. Clarify payment provider boundaries, currency rules, retry duration, concurrency, and which system owns final payment status.

**Starting design:** Authenticate and authorize the merchant; validate the request; bind a scoped idempotency key to a canonical request fingerprint. Use a persistent uniqueness constraint and an explicit in-progress/completed state. Coordinate the local business mutation and result record in one transaction where possible. If the effect is remote, pass a stable downstream key and reconcile unknown results.

| Failure / follow-up | Reasoning to rehearse |
| --- | --- |
| Response is lost after success | Same key/payload retrieves the established outcome; a fresh key would represent a new operation |
| Two requests race | Atomically establish one owner; define wait/conflict behavior for the second caller |
| Same key, different amount | Reject incompatible reuse rather than return an unrelated cached response |
| Process dies after remote success | Reconcile by stable provider identifier; a timeout is not proof of failure |
| Key record expires | State the retention contract and business reconciliation boundary; eternal deduplication cannot be assumed |
| Local write succeeds, event publish fails | Transactional outbox plus retrying dispatcher; consumers must handle repeats |

**Important API distinction:** Stripe's documented idempotency behavior stores the status/body after execution begins, including some failed results. The local coding workbook caches only successful pure-handler responses. Discuss this difference; do not present the toy helper as an SDK implementation. [Official reference](https://docs.stripe.com/api/idempotent_requests)

**Deliverable:** Request/response schema, operation-state table, transaction boundary, unknown-outcome path, and one race-condition test. A mutex around a network call does not provide cross-process crash safety.

## 2. Webhook delivery service

**Prompt:** Publish events to merchant endpoints with bounded latency and retries. Clarify tenant fairness, payload size, ordering expectations, retention, signature verification, and manual replay.

**Answer outline:** Persist event intent with the business transaction; enqueue durable delivery jobs; partition work to preserve only the ordering actually required; send with bounded timeouts and per-tenant concurrency; track attempts independently from business event identity. Use backoff/jitter, retry budgets, dead-letter handling, and a replay path with auditability.

**Capacity drill:** Assume 2,000 events/second averaging 2 KB: about 4 MB/second or 345.6 GB/day before replication and indexes. Three attempts per event would mean roughly 6,000 deliveries/second on average. These are invented rehearsal numbers. Bursts, slow endpoints, and payload retention determine the real worker/storage needs.

**Follow-ups:**

- **Consumer is slow:** Isolate its concurrency and queue so one tenant cannot occupy all workers; expose lag and stop retry storms.
- **Consumer applied the effect but response was lost:** Retry may duplicate delivery. Consumers need durable deduplication or idempotent effects, not an assumption of exactly-once HTTP.
- **Events arrive out of order:** Use business versions or reconcile current state as the product allows. Arrival order is not necessarily business order.
- **User requests replay:** Preserve event identity and track a new delivery attempt; define retention and avoid undoing newer state.
- **Signature checks:** Follow the provider's documented raw-body/signature procedure, timestamp policy, and secret rotation; do not invent a homegrown scheme.

The official Stripe webhook guide documents duplicate deliveries, lack of guaranteed event ordering, signature handling, and asynchronous processing. These are useful integration constraints; the service design above is our exercise. [Webhook documentation](https://docs.stripe.com/webhooks)

## 3. Ledger and reconciliation

**Prompt:** Maintain an auditable history of transfers between internal accounts. Define account ownership, currency, balance semantics, posting states, and whether negative balances are allowed.

**Starting model:** Immutable journal entries with balanced postings per currency and unique operation IDs; reversals are explicit new entries. Distinguish pending from posted/available amounts. Choose a transaction boundary that enforces balance invariants rather than updating unrelated rows independently. Use integer minor units or an explicitly defined decimal representation; currency exponents are not universally two.

**Follow-ups:** Partial refunds must not exceed the eligible captured amount under concurrent requests. Reconciliation compares local state against authoritative provider/settlement records and produces exceptions for investigation. Never silently “fix” history by replacing amounts without an audit trail.

**Trade-off discussion:** A synchronous authoritative ledger improves immediate consistency but adds latency and coupling. Event-driven projections improve read flexibility but introduce lag and rebuilding concerns. State which queries tolerate staleness and which authorize money movement.

## 4. Durable subscription notifications

Extend the coding schedule into a service: version subscription changes, persist scheduled intent, lease due work, recheck eligibility, and track delivery outcomes. Cancellation/extension must invalidate obsolete future events. Agree on time zones and daylight-saving behavior for calendar-relative rules; integer-time coding exercises omit these semantics.

**Hard case:** An email provider accepts a message and your worker crashes before recording completion. Discuss provider idempotency, delivery-status reconciliation, and the product's tolerance for missed versus duplicate messages. Do not claim a local send log eliminates that ambiguity.

## 50-minute rehearsal

Clarify 5 minutes; APIs/data/invariants 10; end-to-end flow 10; failure/concurrency deep dive 15; rollout/metrics 10. These are study timings. Include one user-facing success measure, one correctness invariant, one operational metric, and one staged rollout plan.
