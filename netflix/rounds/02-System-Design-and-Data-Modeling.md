# Netflix: system design, data modeling, and team branches

[Round-wise index](README.md) · [Coding workbook](01-DSA-and-Stateful-Coding.md) · [Research register](Research-Sources.md)

Select the branch matching the job description. Ads themes appear in N2/N3/N6, which are publisher summaries. The concrete contracts and answers below are **original practice material**, not verified questions or descriptions of Netflix production architecture.

## 1. General SWE: versioned configuration service

**Prompt:** Services read configuration and need rollback, audit history, and controlled rollout. Clarify tenant scope, value size, propagation delay, offline behavior, and whether multiple keys must change atomically.

**Answer outline:** Store immutable versions plus an active-version reference; validate updates before publication; define author/approval metadata and rollout scope. Readers cache a versioned snapshot and report the version they used. For multi-key consistency, publish a manifest/snapshot rather than asking clients to independently read the latest value of each key.

| Follow-up | Reasoning to rehearse |
| --- | --- |
| Roll back after partial rollout | Move the active pointer under a controlled rollout; schema backward compatibility still matters |
| Client is disconnected | Decide whether last-known-good data is acceptable and for how long |
| Delete a setting | Preserve historical tombstones and distinguish missing from an explicit null/default |
| Change schema | Add compatible fields/readers before switching writers; validate consumers during rollout |
| Two authors race | Use optimistic concurrency on the expected base version; define conflict resolution |

**Deliverable:** Schema, publish/read APIs, consistency contract, cache invalidation plan, and a failed-rollout recovery path. This extends the coding history store; a map of timestamped values alone is not a distributed configuration service.

## 2. Ads branch: frequency capping and competitive exclusion

**Context:** N6 summarizes a frequency-cap design; N2 describes competing-advertiser exclusion. These are distinct contracts. Practice them separately before combining them. [N2](https://www.reddit.com/r/OfferEngineering/comments/1vv14ji/netflix_senior_swe_interview_process_august_2026/), [N6](https://www.reddit.com/r/OfferEngineering/comments/1vpgq8j/netflix_staff_swe_interview_process_exhausted/)

**Frequency-cap prompt:** Permit at most `k` qualifying impressions per `(viewer,campaign)` during `(now-window, now]`. Clarify whether a decision, reservation, delivered ad, or measured impression consumes the quota. Define deduplication, late events, clock choice, and strictness across regions.

**Starting design:** Partition by the scope requiring atomicity; combine checking the window and reserving capacity in one authoritative operation. Record reservation IDs with expiry and reconcile delivery/impression outcomes. Use bucketed approximations only if the product accepts boundary error; exact timestamp windows cost more state.

**Competitive-exclusion prompt:** A viewer/movie context must not receive conflicting advertiser categories within a time window. Model the conflict relation and its version, not just one numeric counter. Clarify whether conflicts are symmetric and whether already-reserved slots constrain new decisions.

**Hard follow-ups:**

- **Two ad servers race:** Read-then-increment is insufficient for a strict cap. Use an atomic reservation owner or explicitly bounded regional budgets with quantified overshoot.
- **Delivery fails:** Define release/expiry of reservations and how late confirmation is reconciled.
- **Event repeats:** Deduplicate by stable impression/operation identity before applying counts.
- **Cross-region latency is too high:** Discuss strict global enforcement versus local availability with bounded error; do not promise both without a coordination mechanism.
- **Window boundary:** Exact `(now-window,now]` differs from two overlapping fixed buckets. Show a counterexample at a boundary.

**Capacity drill:** Assume 50,000 decisions/second and a one-hour window. Retaining one 32-byte event per decision would require about 5.76 GB of raw event state before keys, indexes, replication, and retention overhead. These are invented numbers, not Netflix metrics. Estimate active key cardinality and hot-key skew before choosing an implementation.

## 3. Data-modeling branch

N2 mentions parking-lot modeling; N3/N6 emphasize Ads domain depth. Treat them as evidence to practice schema reasoning, not a reason to memorize one diagram.

| Original drill | Starting entities and invariants | Follow-up |
| --- | --- | --- |
| Parking sessions | Vehicle, space, session, rate policy, payment; at most one active occupant per space | Two entrances assign the same final space; fee policy changes mid-session |
| Campaign orders | Advertiser, order, line item, creative, targeting version, budget, delivery record | Approved budget changes while decisions are in flight |
| Playback progress | Profile, title, device session, progress event, resolved resume point | Delayed event from another device must not blindly overwrite intentional replay |

For each: write three real queries, select keys/indexes that support them, specify lifecycle states, show one transaction boundary, and identify retention/deletion behavior. A table list without queries or invariants is incomplete modeling.

## 4. Playback/platform branch: media workflow

**Original transfer exercise, not a reported question:** Design upload → validation → transcoding → packaging → publication. Keep control metadata separate from large media objects. Use durable task state, content/version identity, retry-safe workers, dependency tracking, and bounded resource pools.

**Follow-ups:** One encoding fails; workers retry after a timeout; an older version finishes after a newer one; publication must wait for required renditions; an unavailable region needs degraded operation. Make content readiness and rollback explicit.

If the role focuses on serving, instead practice authorization, manifest retrieval, content delivery, client buffering, and playback telemetry. Clarify which parts are in scope rather than designing all of streaming in one interview.

## 5. Frontend/full-stack branch

A firsthand Warsaw account describes JavaScript-specific coding and a different team's take-home; that candidate's Netflix offer was L4. This supports checking format, not assuming a React interview for every experienced role. [N1](https://www.reddit.com/r/leetcode/comments/1u8luln/netflix_and_google_interview_experience_offer/)

**Original practical drill:** Build a paginated catalog search using a supplied local API fixture. Requirements: keyboard-accessible results, loading/empty/error states, stale-response protection, and cancellation. New query results must not be overwritten by a slower old request. Explain cache keys, pagination reset, and tests with deliberately reordered responses.

Reuse the repository's [async and React exercises](../../airbnb/rounds/05-JS-TS-React-and-I18n.md) as foundations; the Airbnb-specific i18n domain is optional here.

## 50-minute design mock

Clarify 5 minutes; model entities/APIs/queries 10; architecture 10; two deep dives 15; failure/rollout/metrics 10. These are practice timings. Change one requirement late and explain which invariant or component must change, not merely which new service to add.
