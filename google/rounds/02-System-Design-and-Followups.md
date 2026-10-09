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
