# MAANG senior system-design questions and follow-ups

[Repository index](../README.md) · [Google design practice](../google/rounds/02-System-Design-and-Followups.md) · [Android Studio design mocks](../google/android-studio-tech-lead/03-System-Design.md)

These are **15 original practice exercises**, grouped by product domains associated with Meta, Amazon, Apple, Netflix and Google. They are not verified interview questions, descriptions of internal architectures, or official hiring rubrics. Company, team and level expectations vary; use the groups for breadth rather than predicting a particular round. All workloads and targets below are hypothetical interview assumptions.

Senior practice emphasizes owning a bounded system end to end: requirements, interfaces, data, correctness, capacity and operations. Staff/tech-lead extensions add cross-team contracts, migration, competing priorities and decisions under uncertainty. These are practice distinctions, not equivalent job levels across companies.

## First read: how to study this workbook

Treat this as a practice question bank. Your goal is to explain how you would build a system, why you chose that design, and what happens when things fail. Prioritize understanding before interview timing.

Start with **Question 1: Personalized home feed**. Spend 60–75 minutes on your first session:

1. **Read only Prompt and Clarify.** Write the required behavior: publish posts, follow accounts and read a feed. Explicitly exclude features such as ads or recommendations from your first design.
2. **Write assumptions and calculate load.** For the supplied workload, `50 million users × 20 reads/day ÷ 86,400 ≈ 12,000 reads/second`. Explain what this average measures; estimate peak load separately.
3. **Sketch a simple first design.** Begin with client → feed service → database. Include posts and follow relationships. Trace saving a post and retrieving a feed; add caches or queues when you can explain the need.
4. **Read the Answer outline and compare.** Focus on fan-out: updating followers' feeds when someone posts, assembling feeds when someone reads, or combining both approaches. Write down why you would choose one.
5. **Attempt two Senior follow-ups.** Start with the account that has 100 million followers and the cache-fleet failure. Explain which component struggles, your proposed change and its trade-off.
6. **Give a two-minute spoken recap.** Describe the design, one important trade-off and one unresolved risk. Record what you could not explain and revisit that topic.

Your first deliverable is **one page explaining the feed design and two failure scenarios in your own words**. Code and a polished diagram are optional. If partitioning, idempotency or replication is unfamiliar, pause and learn it using this question as the example.

| Workbook section | How to use it |
| --- | --- |
| Prompt / Clarify | Define the problem before designing |
| Answer outline | Compare with your own attempt |
| Senior follow-ups | Test whether your design survives new constraints |
| Strong answer evidence | Check whether your explanation is concrete |
| Staff/lead extension | Attempt after understanding the base design |
| Rubric / rotation | Use after completing a few practice sessions |

A useful starting sequence is **1 Feed → 2 Messaging → 4 Checkout → 6 Job scheduler → 15 Remote builds**. Remote builds connects directly to your Android Studio preparation. Expand to the remaining questions after you can explain these designs without reading the outlines.

### Reusable study template

Copy this block into a separate Markdown file or notebook for each attempt. Keep your first attempt and review notes so you can see what improved on a retest.

```markdown
## Question:
### Requirements and exclusions:
### Scale and latency assumptions:
### APIs and data model:
### Architecture:
### One write path and one read path:
### Hardest design decision and alternatives:
### Failure scenario and recovery:
### What I missed:
```

Under “What I missed,” record the feedback, concept to revisit and next retest date. Once you understand the base design, use the timed mock format below.

## How to use the bank for timed mocks

For a 55-minute mock, spend 5 minutes clarifying requirements, 5 estimating load, 10 on APIs/data and the main architecture, 20 on two deep dives, 10 on failure and evolution, and 5 recapping trade-offs. Choose two or three follow-ups per mock; save others for a second attempt.

For every question, produce:

1. Three functional requirements, explicit exclusions, and measurable latency, freshness, availability and durability goals.
2. Average and peak read/write rates, storage growth and bandwidth, derived from stated assumptions. Burst factors depend on the workload; justify them.
3. Core APIs, entities, access patterns and a partition key. State the consistency requirement per operation.
4. One read and one write trace, including authorization, retries and what the acknowledgment promises.
5. A failure timeline showing the invariant that must survive, followed by recovery and reconciliation.
6. The first bottleneck at 10× scale, one cost trade-off, and a safe rollout or migration plan.

The answer outlines are starting points. Attempt each design before reading its outline, and defend alternatives against the requirements.

## Practice map

| Group | Questions | Main muscles |
| --- | --- | --- |
| Meta-style social products | 1 Feed, 2 Messaging, 3 Live comments | Fan-out, ordering, connection scale |
| Amazon-style commerce/platform | 4 Checkout, 5 Inventory, 6 Job scheduler | Invariants, external side effects, resource ownership |
| Apple-style device experiences | 7 Photo sync, 8 Device notifications, 9 Location sharing | Offline conflicts, privacy, device constraints |
| Netflix-style media systems | 10 Video delivery, 11 Playback progress, 12 Experiments | Bandwidth, graceful degradation, measurement |
| Google-style search/developer tools | 13 Web search, 14 Collaborative editor, 15 Remote builds | Indexing, convergence, dependency graphs |

Start with **1, 2, 4, 6, 10 and 14** for broad coverage. For your Android Studio target, prioritize **15**, then **13 and 14**, alongside the existing domain mocks. These priorities reflect topic coverage and your current preparation, not reported interview frequency.

## 1. Personalized home feed

**Prompt:** Design a feed where people follow accounts, publish posts and fetch ranked pages. Assume 50 million daily users, 20 feed reads/user/day and 5 million new posts/day. Target p95 reads below 300 ms; establish an explicit freshness bound.

**Clarify:** Chronological or ranked? Public/private accounts? Edits and deletions? Are ads and model training in scope?

**Answer outline:** Persist authoritative posts and follow relationships; deliver post events durably to feed builders. Compare push fan-out, pull fan-out and a hybrid for large accounts. Store candidate IDs separately from post content; rank a bounded candidate set at read time. Define cursor semantics using a ranking session/version and a deterministic tie-breaker. Enforce visibility when serving results.

**Senior follow-ups:**

- An account with 100 million followers publishes. Where does work accumulate, and how does hybrid fan-out affect freshness?
- A user blocks an author while a cached feed page exists. Which authorization checks prevent disclosure?
- Scores change between pages. Do you promise a stable session or accept repeats/skips, and how is that contract exposed?
- The cache fleet fails. How do admission control, request coalescing and fallback feeds protect storage?

**Staff/lead extension:** Migrate from chronological to ranked feeds with independent ranking and platform teams. Define rollout metrics, rollback behavior and versioned interfaces.

**Strong answer evidence:** Estimate roughly 12K average feed reads/second, then include response size and fan-out amplification. Trace deletion propagation without treating asynchronous cache removal as immediate authorization revocation.

## 2. Multi-device messaging

**Prompt:** Design direct and small-group messaging with offline delivery and history across devices. Assume 10 million concurrent connections and 100K messages/second at peak.

**Clarify:** Ordering scope, group size, retention, delivered/read semantics and whether end-to-end encryption is required. If it is, explicitly include device keys and history-access policy.

**Answer outline:** Connection gateways route authenticated sessions; a conversation service durably records messages and assigns conversation-scoped ordering. Fan-out workers deliver to connected devices and queue offline work. Track per-device synchronization cursors; distinguish server persistence, device delivery and user read receipts. A client-generated message identity makes retries safe.

**Senior follow-ups:**

- The sender times out after persistence. How does retry return the same message rather than create another?
- Two devices send simultaneously. What establishes order, and what happens when the conversation owner fails?
- A recipient reconnects after 30 days. How do bounded pages, retention and expired cursors work?
- A region fails with live connections. How do reconnect jitter, routing and delivery replay avoid overload?

**Staff/lead extension:** Add large groups without breaking direct-message latency. Explain separate delivery strategies, capacity isolation and API compatibility.

**Strong answer evidence:** Give an acknowledgment boundary, ordering scope and deduplication retention policy. Separate transport delivery from business-visible uniqueness; a queue alone does not ensure either.

## 3. Live-stream comments and reactions

**Prompt:** Design comments and reaction counts for a stream with 5 million concurrent viewers, 50K comments/second and 500K reactions/second at peak.

**Clarify:** Must every viewer see every comment? Is ordering exact or approximate? What moderation delay and count error are acceptable?

**Answer outline:** Authenticate and rate-limit ingestion, append comments to a durable stream, and distribute curated or sampled batches through regional fan-out tiers. Aggregate reactions in short windows. Isolate durable comment processing from ephemeral presence and reactions. Assign bounded buffers and slow-consumer behavior at every fan-out layer.

**Senior follow-ups:**

- One stream dominates traffic. How do you split fan-out without making a single room owner the bottleneck?
- A mobile client is ten seconds behind. Do you replay, summarize or skip? State the product contract.
- Moderation removes a comment after publication. How do tombstones reach clients and caches?
- A reaction worker replays a batch. When do you deduplicate, and when is approximation acceptable?

**Staff/lead extension:** Reduce delivery cost by 40% while protecting creator and viewer experience. Choose measurable quality guardrails.

**Strong answer evidence:** Recognize that sending all 50K comments/second to all 5 million viewers implies 250 billion comment deliveries/second. Negotiate a bounded experience before sizing servers.

## 4. Checkout and order orchestration

**Prompt:** Design checkout spanning inventory, an external payment provider and fulfillment. Assume 5K checkout attempts/second at peak; duplicate requests and partial failures are expected.

**Clarify:** Authorization versus capture, reservation lifetime, partial orders, refunds and the exact meaning of “order confirmed.”

**Answer outline:** Use separate order, payment-attempt and reservation state machines. Store idempotency keys with request fingerprints and outcomes. Commit local state with an outbox; downstream handlers are idempotent. Model payment timeouts as unknown outcomes and reconcile using stable provider references. Compensation is durable work with retries and visible status.

**Senior follow-ups:**

- The provider charges but your response times out. Why is starting a new charge unsafe?
- Payment succeeds after reservation expiry. Reacquire stock or refund? Who owns that decision and its retries?
- The database commits but event publication fails. Show how the outbox closes the gap.
- A refund event arrives before an older payment event. How do state transitions avoid regression?

**Staff/lead extension:** Replace the payment integration while orders are in flight. Explain transaction ownership, staged routing, reconciliation and rollback limits.

**Strong answer evidence:** Trace one timeout through recovery. State which invariants are local transactions and which require reconciliation across services; avoid claiming an external side effect rolls back with your database.

## 5. Flash-sale inventory reservation

**Prompt:** Sell 10,000 units of one item under 1 million purchase attempts/minute without overselling. Users hold reservations for two minutes while paying.

**Clarify:** Fairness, queueing, bots, per-user limits, regional sales and whether successful reservation guarantees a purchase opportunity.

**Answer outline:** Protect admission before the inventory store. Atomically decrement available inventory and create a reservation, or use another explicit invariant-preserving allocation model. Give reservations durable IDs and states. Expiry and purchase compete through conditional transitions so inventory is released once. A TTL cleanup process is not the authority for deciding whether a reservation remains valid.

**Senior follow-ups:**

- Expiry and payment completion race. Show both transaction interleavings and the winner rule.
- One SKU is the hot key. Can escrowed regional quotas preserve a global stock bound?
- A regional quota is stranded during failure. What availability or utilization do you sacrifice?
- Admission is retried from many devices. How are per-user limits enforced beyond gateway rate limits?

**Staff/lead extension:** Define fairness and capacity policy with product and operations teams. Explain why optimizing throughput alone can produce an unacceptable sale.

**Strong answer evidence:** Write a conservation invariant such as initial stock = available + reserved + sold, with explicit adjustment rules for returns. Demonstrate that expiry retries cannot increment stock twice.

## 6. Multi-tenant distributed job scheduler

**Prompt:** Run 1 million scheduled jobs/day, from seconds to hours in duration, with tenant quotas, retries, cancellation and dependencies.

**Clarify:** Deadline versus best effort, side effects, dependency cycles, resource classes and scheduling-time precision.

**Answer outline:** Persist job specifications and execution attempts. A dispatcher finds due work and grants leases to workers; an attempt generation fences state updates. Use tenant-aware queues and bounded retries. Track dependency completion durably. Reconcile expired attempts and distinguish user failures from infrastructure failures.

**Senior follow-ups:**

- A worker pauses past lease expiry, then resumes. Which writes reject its stale generation?
- The job sends an email or invokes another external service. Why does fencing scheduler state not prevent that side effect?
- A large tenant submits 100K jobs. How do fairness and resource reservations protect small tenants?
- Cancellation races with completion. What is guaranteed, and how are already-issued side effects handled?

**Staff/lead extension:** Move existing cron workloads onto the platform. Propose shadow evaluation, cutover ownership and a way to prevent both schedulers executing the same job.

**Strong answer evidence:** Separate job identity from attempt identity; show a stalled-worker timeline. Estimate concurrency from arrival rate × average duration, then account for resource mix and utilization.

## 7. Offline photo and metadata synchronization

**Prompt:** Synchronize photos, albums and edits across phones and laptops. Assume 10 million users upload 20 photos/week each, averaging 4 MB/photo.

**Clarify:** Original versus derived images, offline edits, deletion recovery, shared albums, encryption and cellular/battery restrictions.

**Answer outline:** Upload immutable blobs resumably; publish metadata only after object integrity is verified. Maintain a per-account change log and device cursor. Represent edits as versions or nondestructive operations. Define conflict behavior independently for titles, album membership and image edits. Keep deletion tombstones long enough for supported offline devices, with full resync beyond that horizon.

**Senior follow-ups:**

- A device reconnects after tombstones expire. How do you prevent deleted photos from resurrecting?
- Two devices edit the same photo offline. Which edits merge, and which require a preserved alternative version?
- Blob upload succeeds but metadata commit fails. How does garbage collection avoid removing a still-pending upload?
- Shared-album access is revoked. What can you revoke on the server, and what cannot be recalled from a device that already downloaded a copy?

**Staff/lead extension:** Upgrade the sync protocol while old clients remain active for years. Define capability negotiation and minimum-version policy.

**Strong answer evidence:** Estimate 800 TB/week of raw new objects before derivatives and replication. Explain a conflict policy richer than assuming device clocks are trustworthy.

## 8. Device notification platform

**Prompt:** Deliver transactional and promotional notifications to 100 million devices, supporting preferences, quiet hours and expiring messages.

**Clarify:** Delivery versus display guarantees, priority classes, provider dependencies, multi-device deduplication and user time-zone changes.

**Answer outline:** Accept notifications with stable identities, priority and expiry. Resolve recipients and preferences, queue by service class, and use provider adapters with bounded retry and backoff. Track device-token lifecycle and delivery attempts. Recheck applicable preferences before dispatch; retain in-app state when a notification is only a hint to fetch authoritative data.

**Senior follow-ups:**

- The provider accepts a request but its response is lost. How do you limit duplicate user-visible notifications?
- A provider is unavailable for two hours. Which messages expire, queue or fall back to another channel?
- A user opts out while a campaign is queued. Where is eligibility checked again?
- A promotional burst competes with account-security messages. How do capacity reservations avoid starvation?

**Staff/lead extension:** Let many teams send notifications without creating user fatigue. Define ownership, budgets, policy enforcement and useful delivery metrics.

**Strong answer evidence:** Distinguish provider acceptance, device receipt and display. Avoid promising exactly-once display when clients or providers do not expose the necessary controls.

## 9. Time-limited location sharing

**Prompt:** Users share their current location with selected contacts for a bounded period. Assume 2 million active sharers updating every 15 seconds.

**Clarify:** Precision, update freshness, background-device limits, retention, revocation and whether historical trails exist.

**Answer outline:** Store versioned sharing grants separately from latest-location records. Authenticate writes by device/user and enforce current recipient permissions on reads and subscriptions. Coalesce location updates, mark their observation time, and expire old data explicitly. Partition latest-state storage by user; keep access and retention policies narrow.

**Senior follow-ups:**

- A grant is revoked while a recipient has an open stream. How is the subscription stopped, and what is the maximum enforcement delay?
- A delayed update arrives after a newer one. How do sequence numbers and device changes avoid stale replacement?
- A user is offline. How does the UI distinguish “last seen here” from “currently here”?
- Several devices report different locations. What selects the source of truth?

**Staff/lead extension:** Choose a battery/freshness policy with product and mobile teams; design measurements without retaining unnecessary location history.

**Strong answer evidence:** Derive about 133K updates/second before batching. Trace permission enforcement beyond initial subscription setup; server revocation cannot erase previously observed coordinates.

## 10. Global video-on-demand delivery

**Prompt:** Design upload, encoding and playback for a catalog serving 10 million concurrent viewers at an assumed average 5 Mb/s.

**Clarify:** Startup latency, supported devices, resolution ladders, content protection, regional rights and whether live video is excluded.

**Answer outline:** Store source assets durably; run versioned encoding jobs and validate manifests before publishing. A playback control service authorizes sessions and issues bounded credentials. Deliver immutable segments through CDNs with origin protection. Separate playback control from the high-bandwidth media path; expose client quality and buffering telemetry.

**Senior follow-ups:**

- A new title creates a cold-cache surge. How do prewarming, origin shielding and request coalescing interact?
- A CDN fails in one region. How do clients switch without overwhelming the alternate CDN or origin?
- Entitlements fail while a video is playing. What continues, and how does credential lifetime bound the decision?
- A bad encoding is published. How do versioned manifests permit rollback without mixing incompatible segments?

**Staff/lead extension:** Reduce egress cost while protecting startup time and rebuffering. Propose a controlled traffic shift with regional rollback criteria.

**Strong answer evidence:** Compute about 50 Tb/s of viewer payload bandwidth. Distinguish CDN delivery load from origin load and define observable fallback behavior.

## 11. Cross-device playback progress

**Prompt:** Save progress for 10 million concurrent viewers sending heartbeats every 30 seconds. Users should resume across devices without an older session overwriting newer intent.

**Clarify:** Allowed progress loss, seeks backward, completion markers, concurrent sessions and offline downloads.

**Answer outline:** Ingest session-scoped sequence numbers and progress observations. Keep a compact latest-progress view plus enough session metadata to apply conflict rules. Batch/coalesce writes where the durability contract permits it. Define how a new playback session becomes authoritative and how offline progress is reconciled.

**Senior follow-ups:**

- Why is taking the maximum playback position wrong when a user deliberately rewinds?
- An old phone uploads offline progress after a new TV session. Which session wins, and why?
- A heartbeat is acknowledged before durable storage. What can be lost during failure?
- History deletion races with delayed events. What prevents replay from recreating deleted history?

**Staff/lead extension:** Evolve progress semantics across legacy clients without causing visible resume regressions. Design versioning and comparative telemetry.

**Strong answer evidence:** Estimate roughly 333K heartbeats/second. Explain conflict resolution using session and operation semantics rather than raw device timestamps alone.

## 12. Experiment assignment and metrics

**Prompt:** Build an experimentation platform with stable user assignment and 1 billion exposure/outcome events/day.

**Clarify:** User versus device randomization, mutually exclusive experiments, ramp rules, metric latency and privacy retention.

**Answer outline:** Version experiment definitions; assign eligible subjects deterministically using experiment-specific hashing. Record actual exposure separately from assignment. Ingest deduplicated events into event-time aggregation and analytical storage. Preserve enough version information to interpret metrics after configuration changes. Keep assignment availability separate from the analytical pipeline.

**Senior follow-ups:**

- A ramp moves from 1% to 10%. How do you preserve existing assignments?
- Events arrive days late or are replayed. How are metrics corrected without double counting?
- Treatment makes clients crash before exposure logging. How could that bias results, and what independent signals help?
- Cached configuration delays a kill switch. What freshness guarantee is needed on that path?

**Staff/lead extension:** Define launch governance and ownership of guardrails across product teams. Separate platform correctness from statistical decision policy.

**Strong answer evidence:** Derive roughly 12K average events/second and size bursts separately. Explain assignment versus exposure, sample-ratio checks and versioned recomputation.

## 13. Web crawl and search index

**Prompt:** Crawl 1 billion documents, refresh changed pages and serve keyword search. Assume 100K peak queries/second; ranking can start simple.

**Clarify:** Crawl scope, freshness tiers, duplicate pages, query features, removal requests and document-size distribution.

**Answer outline:** Use a durable crawl frontier with per-host politeness limits. Fetch, canonicalize and parse documents; build versioned inverted-index segments. Partition index serving and merge shard candidates for queries. Publish compatible index generations and keep an explicit document-removal path. Cache popular queries with defined freshness.

**Senior follow-ups:**

- A site generates effectively infinite URLs. How do budgets and canonicalization bound the frontier?
- A document is removed while an old index segment remains live. Where is suppression enforced?
- One search shard times out. Do you return partial results, retry or fail, and how does the latency budget constrain that?
- A ranking/schema change requires rebuilding the index. How do dual generations and validation support cutover?

**Staff/lead extension:** Divide crawl, index and serving ownership across teams. Define freshness contracts and diagnose which stage causes a stale-result incident.

**Strong answer evidence:** Estimate corpus and index size from document-size and expansion assumptions. Acknowledge that local shard top-K merging needs complete, comparable per-document scores and compatible ranking semantics.

## 14. Real-time collaborative document editor

**Prompt:** Support shared documents with 100 simultaneous editors each, offline editing, comments and version history.

**Clarify:** Plain text versus rich text, document sizes, offline duration, undo semantics, permissions and persistence guarantees.

**Answer outline:** Authenticate document sessions; distribute operations through a document owner or another explicitly defined coordination model. Choose operational transformation or a CRDT and explain its actual convergence mechanism. Persist operations and snapshots; reconnect using a cursor/version with an explicit resync protocol. Keep presence ephemeral and separate from durable edits.

**Senior follow-ups:**

- Two users insert at the same position, then one deletes a range. Walk through the resulting operation semantics.
- A user returns after operation-log compaction. How can pending offline edits safely merge with a newer snapshot?
- Edit access is revoked while a device is offline. Are its later edits rejected, copied or reviewed?
- The document owner fails after broadcasting an edit. Was it durable, and what did clients believe the acknowledgment meant?

**Staff/lead extension:** Introduce a new document representation across mixed client versions. Define compatibility, recovery and how to detect silent divergence.

**Strong answer evidence:** Show a concrete concurrent-edit trace. Naming “CRDT” alone does not resolve authorization, schema evolution, compaction or product-level undo semantics.

## 15. Remote build execution and artifact cache

**Prompt:** Run dependency-graph builds for 10,000 developers, with remote execution, shared caching and tenant isolation. Assume a peak 500 builds/minute and 200 runnable actions/build before cache hits.

**Clarify:** Hermeticity, toolchains, cache trust, dependency declaration, critical-path latency, resource classes and cancellation.

**Answer outline:** Resolve builds into an action DAG. Digest declared inputs, command, toolchain and relevant environment; map action keys to immutable output manifests. Schedule ready cache misses onto isolated workers with leases. Verify artifact digests and publish manifests atomically. Track build, action and attempt separately.

**Senior follow-ups:**

- A task reads an undeclared file. Why can a cache hit be incorrect, and how do you detect or prevent it?
- A worker uploads blobs then dies before publishing its manifest. How does recovery interact with orphan cleanup?
- A stale worker completes after its replacement. Which result publications are accepted?
- One tenant saturates scarce high-memory workers. How do quotas, priorities and scheduling avoid starvation?

**Staff/lead extension:** Migrate local builds to remote execution incrementally. Prove output equivalence, establish fallback behavior and compare developer time saved against infrastructure cost.

**Strong answer evidence:** Derive about 1,667 action arrivals/second before cache hits, then size execution using miss rate, duration and resource needs. Build latency is bounded by both total work/parallelism and the dependency critical path.

For deeper domain practice, use the existing [incremental-build, indexing and device-testing mocks](../google/android-studio-tech-lead/03-System-Design.md).

## Follow-ups to inject into any question

| Interviewer challenge | What your answer should make concrete |
| --- | --- |
| Traffic grows 10× next month | Recompute the limiting resource; specify the scaling step and its validation |
| The largest tenant generates half the traffic | Hot-key strategy, quotas, isolation and fairness |
| A write commits but the response is lost | Stable request identity, durable outcome lookup and retry semantics |
| A region is permanently lost | Acknowledged-data loss bound, recovery time, replica placement and failover capacity |
| Cross-region connectivity partitions | Which operations reject or delay, which remain available, and how conflicts are prevented/resolved |
| A dependency becomes slow | Deadlines, retry budget, circuit breaking, admission control and user-visible degradation |
| Data must be deleted everywhere | Index/cache/replica handling, backup policy, replay suppression and completion evidence |
| The schema must change without downtime | Compatible readers/writers, backfill, validation, cutover and rollback boundaries |
| Budget is cut by 30% | A measured cost driver, proposed reduction and customer guardrail |
| Two teams disagree about ownership | Contract, decision owner, escalation path and a staged plan with evidence |

For region-loss answers, distinguish **RPO** (acceptable data loss) from **RTO** (time to restore service). For queue answers, state the delivery and ordering boundary; transactional processing inside one subsystem does not automatically make external side effects exactly once. For replicated-store answers, quorum overlap alone is not proof of linearizability under every failure or concurrency model.

## Self-review rubric

Use 0 = missing, 1 = prompted/partial, 2 = independently concrete. This is a practice diagnostic, not a hiring prediction.

| Dimension | Evidence for 2 points |
| --- | --- |
| Scope | Explicit requirements, exclusions and measurable service targets |
| Capacity | Read/write rates, bandwidth and storage tied to design choices |
| Data/interfaces | Keys, access patterns, APIs, state transitions and pagination where relevant |
| Correctness | Named invariant and a concurrency/retry trace that preserves it |
| Distributed behavior | Explicit ordering, consistency, replication and acknowledgment boundaries |
| Operations | Failure detection, recovery, overload behavior and useful metrics |
| Judgment | Defended alternatives, cost awareness and a safe evolution plan |
| Communication | Clear end-to-end traces, time management and concise trade-off recap |

Practice gate: two unseen mocks with no zero in scope, correctness or operations, followed by a repaired attempt at the weakest dimension. For staff/lead practice, also require a concrete cross-team migration plan and a decision under competing constraints. Do not substitute a total score for those gaps.

## Two-week rotation

Use this as an alternative design block in your current plan; it need not add daily study time. Each full mock takes 55 minutes plus 15 minutes of review. On shorter days, do one 25-minute deep dive and a failure trace.

| Day | Work |
| --- | --- |
| 1 | Feed: baseline mock and rubric |
| 2 | Messaging: ordering and reconnect deep dive |
| 3 | Checkout: full mock with unknown payment outcome |
| 4 | Inventory: expiry/payment race and quota trade-off |
| 5 | Scheduler: full mock with stale-worker injection |
| 6 | Photo sync + location sharing: conflict and revocation traces |
| 7 | Repeat the weakest first-week question with a new constraint |
| 8 | Video delivery: full mock with CDN outage |
| 9 | Progress + notifications: retries, expiry and session semantics |
| 10 | Collaborative editor: full mock with offline merge |
| 11 | Search: index migration; live comments: fan-out sizing |
| 12 | Remote builds: full mock with incorrect cache reuse |
| 13 | Experiments: exposure/replay deep dive and staff extension |
| 14 | Unseen variant chosen by a partner; review the weakest dimension |

Record: date, question, assumptions, weakest invariant, missed failure, first bottleneck, feedback and next retest. In the final recap, state your design, two trade-offs and the next risk you would validate.
