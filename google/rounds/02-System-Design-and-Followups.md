# Google L5: system design and follow-ups

[Round-wise index](README.md) · [Research register](Research-Sources.md)

Cache and news/feed designs appear in [G1](https://leetcode.com/discuss/post/6349651/google-l5-bangalore-selected-interview-e-3wj2/); G2 also describes a feed. The exercises and answer outlines below are **original preparation material**. They do not establish official Google design questions or ratings.

## 1. Distributed cache

**Practice contract:** Design a shared cache for expensive metadata reads. Establish whether the cache is disposable, freshness requirements, key/value size, read/write mix, and what happens when the origin is unavailable.

**Starting answer:** Define `get`, `set` with TTL, and `delete`; partition keys across nodes; replicate if cache availability justifies it. Cache-aside offers a simple beginning when stale reads are acceptable. State how the source of truth is updated and how invalidation or versioned keys work. Do not promise strong consistency from TTL alone.

**Capacity drill:** Assume 10 million entries averaging 1 KB plus 30% overhead: about 13 GB logical storage, about 39 GB with three copies before spare capacity. At 100,000 reads/second and 1 KB returned, egress is roughly 100 MB/second. These are invented decimal-unit assumptions; include hot-key skew before choosing shard count.

| Follow-up | Strong reasoning to practice |
| --- | --- |
| A key receives half the traffic | Replicate hot reads, use a local cache if freshness permits, coalesce misses; average shard load hides skew |
| Many TTLs expire together | Jitter expirations, cap refresh concurrency, coalesce requests, consider stale-while-revalidate if allowed |
| A node disappears | Define client retries, replica failover, origin protection, and what happens to in-flight requests |
| Reshard without an outage | Version routing, migrate gradually, manage double reads/writes and cutover; verify hit rate and correctness |
| Writes race with cache fills | Use versions or an invalidation protocol to prevent an old fill from restoring stale data |
| Cache contains permissions | Reconsider staleness and revocation semantics; the earlier metadata assumptions may no longer hold |

**Requirement-change drill:** “Now stale reads are unacceptable.” Explain which earlier decisions fail. Options include bypassing cache for correctness-critical operations or coordinating versions/reads with the authority. Discuss the latency and availability cost rather than keeping the old design unchanged.

## 2. Personalized news cards / feed

**Practice contract:** Users page through ranked content, dismiss cards, and expect recent interactions to affect subsequent pages. Clarify acceptable duplicates, freshness, privacy/deletion, and whether ranking is in scope.

**Answer outline:** Separate ingestion/deduplication, candidate retrieval, ranking, feed serving, and interaction events. Define a stable item identity and version. Use a session/snapshot cursor when consistent pagination matters; a bare offset against a changing ranking can skip or duplicate content. Track dismissals and deduplicate impression/reaction events with stable event IDs.

**Trade-offs:** Precomputation reduces serve latency but increases stale work; on-demand ranking improves freshness at higher request cost; a hybrid caches candidates and ranks a bounded set at request time. Popular authors/content can make unconditional fan-out expensive. Explain the threshold or traffic evidence that changes the approach.

**Follow-ups:**

- **New item must appear immediately:** Decide whether the next page belongs to the old snapshot or starts a refreshed session. State product semantics before storage changes.
- **User dismisses a card on another device:** Persist user-item state; define propagation delay and reconcile session candidates against it.
- **Ranking service fails:** Use a bounded fallback such as cached or recency-based results with explicit quality/latency goals.
- **Item is removed:** Enforce serving-time eligibility and propagate deletion to caches/indexes; replay must not resurrect removed content.
- **Measure success:** Serving latency/availability plus content freshness, duplicate rate, interaction-event loss, and product metrics with guardrails.

## 3. Broadening drills

These are transfer exercises, not additional reported Google questions.

| Prompt | Core decisions | Follow-up |
| --- | --- | --- |
| Distributed task scheduler | Durable jobs, leases, retries, idempotent execution, partition ownership | Worker stalls after performing side effects but before acknowledging |
| Metrics ingestion service | Partition key, buffering, retention, rollups, cardinality limits | Late/duplicate data and a tenant with explosive labels |
| Collaborative document service | Operation ordering, conflict model, offline edits, snapshots | Access revoked while a user is offline |

## L5 design rehearsal

In 50 minutes: clarify 5; estimate and model data/APIs 10; propose end-to-end design 10; deep-dive on two critical requirements 15; failure/rollout/summary 10. These are study timings, not Google's official format.

Practice driving a coherent discussion: select the most consequential unknown, explain the trade-off, choose a default, and revisit it when requirements change. Finish with one unresolved risk and the measurement or experiment that would resolve it. Use the recruiter-provided diagramming setup; Google's [technical virtual-interview guide](https://services.google.com/fh/files/misc/technical_virtual_interviews_candidate_resource.pdf) discusses Google Drawings where applicable.

## 4. Dashboard showing the N worst queries — October priority

**Added October 14, 2026. Evidence:** [G6, the user-shared India L5 report](https://www.reddit.com/r/LeetcodeDesi/comments/1x56nee/google_l5_chances_with_lh_in_system_design_india/) mentions this vague theme. Everything below is an original practice contract; it is not the author's exact prompt or Google's expected answer.

### Start by defining the query

Ask whether “worst” means individual slow executions, query fingerprints by p95 latency, total resource consumption, error rate, or regression from baseline. Ask about window, tenant, filters, freshness, historical drill-down, and exact versus approximate answers. These change the aggregation algorithm and storage model.

**Opening to rehearse:** “Are we ranking individual executions or normalized query groups? I'll assume each tenant wants its top 20 query fingerprints by total execution time in the last 15 minutes, refreshed every 10 seconds, with drill-down to redacted samples. Does that capture the intended dashboard?”

Do not spend the whole interview asking questions. By minute 5, propose a scoped assumption, confirm it, and make progress. If the interviewer changes “total time” to “p95,” explicitly revisit aggregation.

### Worked contract and estimates

Invented rehearsal assumptions: 100,000 events/sec average, 3× peak, 300 bytes/event, 7-day raw retention, 10,000 tenants with skew, 10-second freshness, dashboard p95 under 500 ms, tenant-isolated access. These are design inputs, not Google production figures.

- Ingress: `100,000 × 300 = 30 MB/s` average, `90 MB/s` peak.
- Raw data: `30 MB/s × 86,400 = 2.592 TB/day`; 7 days ≈ `18.1 TB` before compression/indexes/replication; three full copies ≈ `54.4 TB`.
- Assume 1 million active tenant/fingerprint pairs per minute and 64 bytes/aggregate: 15 minute buckets ≈ `960 MB` raw aggregate payload, excluding keys, runtime/index overhead, replicas and late-event state. Validate actual cardinality and skew before choosing shard counts.

### Data, APIs and flow

Event: `(eventId, tenantId, fingerprint, eventTime, durationMs, status, querySampleRef)`. Normalize parameter literals before ingestion where feasible; version normalization rules; redact secrets and restrict sample access. A fingerprint identifies a group; `eventId` deduplicates a particular execution.

API: `GET /tenants/{id}/queries/top?metric=total_duration&window=15m&limit=20` returns fingerprints, aggregate values, `asOf`, freshness/partial-data flags and a snapshot token. Drill-down uses the same authorized tenant and snapshot/window. Bound filters and limits. Derive authorization from the authenticated caller, not merely the URL.

Write path: instrumented services → authenticated ingestion → durable partitioned log → deduplicating event-time aggregation → tenant/fingerprint/time-bucket aggregates → materialized leaderboard. Keep redacted raw events in a historical analytical store for drill-down/backfill. Read path: dashboard → tenant-authorized API → recent leaderboard/cache; historical queries go to the analytical store with bounded scans.

Start by partitioning aggregation by `(tenantId, fingerprint)` so all contributions to a group reach its owner. Use hierarchical partial sums to relieve a hot fingerprint, then combine before ranking. A tenant-level reducer builds its ranking from complete per-fingerprint totals. Monitor that reducer separately: a very large tenant can bottleneck there.

### Deep dive 1: exact top-K and changing windows

For minute-aligned windows, retain bucket totals; add the entering bucket and subtract the expiring bucket. Maintain all active fingerprint scores plus an ordered ranking index, or periodically rebuild a size-K heap by scanning all active scores. A heap of only the current winners cannot discover yesterday's loser becoming today's winner after expiration. For precise continuously sliding boundaries, use finer buckets or event-level boundary correction; minute buckets alone imply coarser semantics.

A subtle distributed bug: taking each shard's local top-K **partial** totals may lose a global winner. For K=1, shard A has `x=60,a=100`, shard B has `x=60,b=100`; local winners omit `x`, whose total 120 is globally largest. First combine each fingerprint's contributions at one logical owner. Merging local top-K is valid when each key's complete score belongs to exactly one partition and rankings share a deterministic tie rule. Explain that condition rather than repeating “merge top-K.”

If changed to p95 latency, sums/counts are insufficient and averaging shard p95s is wrong. Use mergeable histograms/sketches with an explicit approximation/error contract or retain sufficient exact data. Keep per-window buckets so expiration can remove a bucket; many sketches cannot simply subtract expired samples.

### Deep dive 2: duplicates, lateness and recovery

Use at-least-once ingestion plus a stated deduplication scope. Bound event-ID retention to the supported retry/replay horizon or rebuild from a canonical deduplicated source; unlimited replay after dedup expiry otherwise double-counts. Coordinate offsets/checkpoints with aggregate writes, or make updates idempotent at the storage boundary. Do not promise end-to-end exactly-once behavior just by choosing a queue.

Use event time, a lateness allowance/watermark, and a policy for later arrivals: revise affected windows or mark data final after the allowance. Publish `asOf` and lag so stale results are visible. Backfills should write a separate version and switch readers after validation rather than adding replayed values to live totals twice.

| Follow-up | What to explain |
| --- | --- |
| One tenant produces 50% of events | Isolate capacity, split hot groups into partial aggregators, merge complete scores, enforce tenant quotas |
| Consumers fall behind | Lag/freshness alarms, autoscale within partition limits, retain log headroom, show delayed data |
| Analytical store fails | Serve last materialization with timestamp; disable or degrade drill-down explicitly |
| New arbitrary filters | Existing aggregates may not retain needed dimensions; bound supported filters or query raw data at higher cost |
| A sample must be deleted | Delete/redact samples and replicas/indexes; prevent replay resurrection; distinguish aggregate retention policy |
| 10× throughput | Re-estimate write bandwidth/storage; test hot reducers, aggregation cardinality, compaction and read fan-out |

**Close in 60 seconds:** restate metric and window, trace ingestion and read paths, name dedup/late-data semantics, point out the first bottleneck, and identify one trade-off. For your background, connect to Superset/analytics as relevant experience while clearly labeling this streaming scale as hypothetical.

## 5. Ecommerce payment and delivery reconciliation

**Evidence:** [G8 author comments](https://www.reddit.com/r/LeetcodeDesi/comments/1slxvll/cleared_google_l5_india_team_matching_taking_time/) describe ecommerce delivery and payment-gateway-related work, without a complete question. This original drill maps to your Luckd experience.

**Prompt:** Design checkout, payment-status reconciliation and fulfillment updates. Clarify whether you operate a gateway or integrate an external payment provider; assume the latter. Define money as integer minor units plus currency, order/payment/fulfillment as separate state machines, and the conditions for accepting fulfillment and seller payout.

**Outline:** Persist an order and payment attempt; scope idempotency keys to caller/operation and request payload; use a unique provider transaction reference. Treat signed/verified webhooks and provider reconciliation as inputs to transactional state transitions. Record processed event IDs with the state update and emit durable work via an outbox. Retry fulfillment with idempotency. Keep an append-only financial record and reconcile provider settlements. A frontend success screen is not payment authority.

| Failure injected | Defensible response |
| --- | --- |
| Provider charged but request timed out | Mark outcome unknown; query provider with stable reference and reconcile before creating another charge |
| Duplicate / out-of-order webhook | Verify authenticity, deduplicate, reject invalid state regression; consult authoritative status for conflicts |
| DB commits but queue publish fails | Transactional outbox plus retrying publisher; idempotent consumer handles repeated publication |
| Payment succeeds after inventory reservation expires | Follow explicit compensation policy: reacquire stock or refund; track compensation until completed |
| Two workers attempt seller payout | Durable payout identity, uniqueness/transaction boundary and provider idempotency; locking alone is insufficient across retries |
| UI cache shows an old order status | Versioned status and bounded refresh/push; backend controls legal transitions regardless of display |

**Your preparation task:** Draw the real Luckd flow from memory, mark precisely which of these mechanisms you actually implemented, and identify the rest as design improvements. Prepare one race-condition timeline and one incident/recovery example with evidence. Do not invent transaction volume, availability or ownership.

## Full-stack extensions, if the recruiter confirms them

These are tailored practice, not reported universal rounds: dashboard pagination and server filtering; cancellation of stale requests; query-cache invalidation and permission changes; large-table virtualization; accessibility and loading/error states; client-versus-server aggregation; offline IndexedDB schema/version management; browser memory limits for DuckDB-WASM. Explain how correctness and privacy survive client caching, and how you would measure latency before and after an optimization.

## 6. Personalized promotional offers — October 16 addition

**Evidence:** [G9 anonymized L5 repost](https://www.reddit.com/r/OfferEngineering/comments/1v6bivx/passed_google_l5_none_of_the_questions_were/) reports ingestion, expiration, filtering, ranking, pagination and one claim per user per offer. The following is our practice contract, not an exact reconstruction.

**Prompt:** Partners publish offers with eligibility rules and expiry times. Users browse a personalized ranked list and claim an eligible offer at most once. Define ingestion/update semantics, listing and claim APIs, storage, and failure behavior. Clarify global inventory, whether claim implies redemption, expected traffic, ranking freshness, and what happens at the expiry boundary before choosing components.

**Solution outline:** Store versioned offer records and a claim ledger. Ingestion validates and upserts partner/version keys; asynchronous indexing supplies candidates. Listing filters candidates by eligibility and expiry, ranks them and returns a cursor. A claim rechecks authoritative eligibility and expiration and inserts a unique `(user_id, offer_id)` ledger entry atomically. Retries return the existing result; a cache-level check alone cannot enforce uniqueness. If there is inventory, reserve/decrement it in the same consistency boundary as the claim. Define expiration using server time at the transaction's decision point; cleanup TTL is not the correctness mechanism.

**L5 deep dives:** Ranked pagination needs a stable snapshot/ranking version and tie-breaker such as offer ID; an offset or live score alone can skip/repeat entries. Revalidate expiry when serving a cached page and again at claim time. Explain the difference between an at-most-one claim record and exactly-once downstream redemption: external side effects need idempotency, durable delivery and reconciliation. Trace two simultaneous claims, a response lost after commit, partner withdrawal, stale index results, and region failure. Choose consistency per operation; browsing can tolerate freshness lag while conflicting claims must not both succeed.

**Practice sizing:** State your own users, listings/user/day, offers/page, claim rate and retention; derive read/write QPS, ledger storage and response bandwidth. These inputs are not supplied by G9. Rehearse a 45-minute answer with one claim race and one pagination trace.

## 7. Multi-data-center log collection — optional SRE transfer drill

**Evidence:** [M2 Mockd Google SRE demo](https://mockd.fyi/case/seed_11), no L5 claim. **Prompt:** Collect and aggregate logs from 10,000 servers in three data centers. Estimate machines, storage and network use; explain one data center becoming unavailable, query behavior, SLOs and paging.

**Worked assumptions:** At 100 lines/server/second and 500 bytes/line, ingestion is 1 million lines/second, or 500 MB/s and 43.2 TB/day in decimal units. Seven days is 302.4 TB raw; three stored copies are 907.2 TB before compression, index overhead and headroom. If a storage machine has 20 TB usable capacity, that is at least 46 machines by storage alone; at 70% target utilization, 65. Benchmark ingest/query CPU, disk throughput and network separately before accepting that count. Two additional full replication copies add roughly 1 GB/s aggregate replication payload under this simplified model; topology and compression change cross-data-center traffic.

**Solution outline / follow-ups:** Agents batch into a durable ingestion layer, consumers build searchable indexes, and long-term storage serves retention/replay needs. Define what acknowledgment guarantees. Local buffers help temporary connectivity loss but do not protect against permanent loss of that site; remote durability requires remote acknowledgment or an explicit data-loss window. Partition to avoid one noisy server monopolizing capacity; bound buffers and choose a backpressure/drop policy. Trace duplicates and replay with stable event IDs where deduplication matters. After losing one of three equally loaded sites, surviving sites need 1.5× their previous load capacity if all traffic is redistributed. Queries should expose incomplete coverage/freshness rather than silently imply completeness.

**SLO exercise:** Propose and justify availability, ingest-to-search freshness and acknowledged-data durability targets. Page on sustained user-impacting availability/freshness failures or imminent buffer exhaustion; ticket slow storage growth and capacity trends with adequate runway. Distinguish event timestamp from receipt/index time when evaluating late logs. This drill broadens operational reasoning; it is not evidence of a mandatory SRE round for SWE L5.
