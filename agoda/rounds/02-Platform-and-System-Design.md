# Agoda Staff: platform critique, code review, and design

[Round-wise index](README.md) · [Research sources](Research-Sources.md)

The supplier API and flight-aggregation themes are reported in [A1](https://leetcode.com/discuss/post/8292630/) and [A2](https://leetcode.com/discuss/post/7755434/agoda-staff-engineer-bangkok-selected-by-ei7m/). All detailed contracts, answer outlines, numbers, and follow-ups below are **original rehearsal material**, not official answer keys. A platform discussion may start with an existing design rather than an empty canvas.

## 1. Expose bookings to suppliers

**Practice prompt:** Suppliers need a scoped API to retrieve their bookings by check-in date and synchronize modifications. Protect the transactional booking path. Agree on supplier count, rows returned, peak concurrency, freshness, and PII access before selecting components.

**Reasoned starting design:** Authenticate the caller, derive tenant identity from credentials, authorize every query, and expose a bounded cursor API. For modest load and acceptable replica lag, start with an indexed read replica. If query shapes, isolation, or load demand it, project booking events into a dedicated read store through an outbox/CDC pipeline. Explain why that extra pipeline is justified; it adds lag, replay, schema, and operational work.

| Decision | A defensible answer | Follow-up to rehearse |
| --- | --- | --- |
| Data model | Booking ID, supplier ID, check-in, status, version, updated time; indexes match tenant and filter | Separate indexes may be needed for check-in queries and change feeds |
| Pagination | Stable cursor over `(updatedAt,bookingId)` with bounded page size | A sort cursor alone does not guarantee a consistent snapshot under updates |
| Incremental sync | Prefer a durable change offset/token with retention and a snapshot boundary | How does a client recover after its token expires? |
| Cancellations/deletes | Versioned updates or tombstones remain visible to sync | Hard deletion can make a client retain stale bookings forever |
| Isolation | Per-tenant authorization, quotas, query limits, request deadlines | A noisy tenant must not exhaust shared workers |
| Caching | Include tenant, filters, page/snapshot/version dimensions in keys | A user-selected supplier ID is not an authorization check |
| Replication lag | Document freshness; monitor lag; route special read-after-write needs explicitly | Fail closed or return documented stale data when the read pipeline falls behind? |
| Event handling | Idempotent projection by booking version; out-of-order protection | Rebuild a projection without losing concurrent changes |

**Concrete scale drill:** At an assumed 100 requests/second and 50 KB per response, outbound data is about 5 MB/second before overhead. This is an invented capacity exercise. Query rows scanned, payload growth, and fan-out may dominate QPS; show the index and an upper bound on page size.

**Migration answer:** Add the read model, backfill under a recorded boundary, replay changes, compare sampled results, shadow reads, then canary tenant traffic with rollback to the prior read path. Monitor freshness and correctness as well as latency. Do not jump directly to global replacement.

## 2. Review an unsafe supplier endpoint

**Original pseudocode to review; deliberately unsafe and not runnable production code:**

```text
GET /bookings?supplierId=...&from=...&to=...
key = from + ':' + to
if cache.has(key): return cache.get(key)
rows = primaryDb.query('SELECT * FROM bookings WHERE supplier_id=' + supplierId)
result = rows.filter(byDate)
cache.set(key, result)
return result
```

**Give findings in impact order:**

1. Supplier ID is caller-controlled: enforce authorization using authenticated identity. The cache key also permits cross-tenant leakage. Fix both before refactoring style.
2. Concatenated SQL can allow injection: use bound parameters and validate inputs. Parameterization does not replace authorization.
3. Unbounded reads and application-side filtering can overload the database: push indexed predicates into the query and enforce page/interval limits.
4. Primary-database dependency couples supplier reads to booking availability: measure impact, then choose replica/read-model isolation and define freshness.
5. Cache has no explicit expiry/invalidation contract: define acceptable staleness, bounded storage, and tenant-aware keys.
6. Add deadlines, cancellation, rate limits, meaningful failure responses, and structured logs without exposing booking PII.
7. Separate query, mapping, and policy code after correctness is addressed. Use a strategy/factory only where actual variation warrants it.

**Review deliverable:** Explain three high-impact findings, sketch a corrected request path, and name tests: cross-tenant access, two tenants with identical date filters, invalid range, page boundary, cancellation update, timeout, and stale-cache behavior.

## 3. Flight search aggregation

**Practice prompt:** Search multiple upstream providers and return normalized offers within a fixed user-facing deadline. Clarify whether search results are quotes or guaranteed inventory.

**Answer outline:** A search coordinator calls provider adapters with bounded concurrency, per-provider deadlines, bulkheads, and circuit breakers. Normalize currencies/time zones under explicit rules; preserve provider quote IDs and expiry. Cache reusable searches where fare freshness allows. Return partial results with explicit completeness/freshness metadata if the product accepts that trade-off.

**Follow-ups and answers:**

- **One provider is slow:** Cap its share of concurrency and its deadline; stop waiting at the overall deadline. Retries must fit the remaining budget and avoid synchronized retry storms.
- **Duplicate itineraries:** Define identity using segments and fare conditions, not route alone; baggage, refundability, and cabin can differ.
- **Cheapest quote expires:** Revalidate before booking; explain the price change and obtain product-defined confirmation.
- **Pagination across providers:** A search-session snapshot makes ordering and continuation coherent. Fetching every provider live on each page can reorder or duplicate results.
- **Observability:** Track search completeness, provider success/timeout rate, freshness, p95/p99 latency, cost per search, and booking conversion.

## 4. Booking contention and payment failure

**Practice prompt:** Two customers attempt the final seat while payment/provider APIs can time out. Separate local order state from authoritative supplier inventory.

**Answer outline:** Model explicit states such as `PENDING → HELD → CONFIRMING → CONFIRMED`, plus expiration, cancellation, and reconciliation paths. Use an atomic conditional inventory transition where you own stock; for supplier-owned stock, use the provider's hold/confirmation protocol. Idempotency keys protect repeated client operations; an outbox makes local state changes and outgoing intent durable together.

**Hard follow-up:** Payment succeeded but booking confirmation timed out. A timeout means unknown outcome. Reconcile using the stable provider request ID before retrying a non-idempotent operation. Choose compensation/refund only after establishing actual order/payment state. Keep an operator-visible repair path.

**Staff-level discussion target:** Who owns reconciliation, which invariant prevents double booking, how incidents are detected, and how the migration/rollout is coordinated. A component diagram alone does not answer those questions.

## 50-minute mock

Spend 5 minutes on constraints, 10 on the current design/data flow, 15 on ranked failures, 15 on improvements plus a deep dive, and 5 on rollout/metrics. These are rehearsal timings. Score whether each technology solves an identified requirement and whether the simplest viable starting point is clear.
