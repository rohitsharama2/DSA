# Six Android Studio-oriented system-design mocks

[Track index](README.md) · [Domain foundation](04-Role-Fit-and-Domain.md) · [Sources](Sources.md)

For broader senior-level preparation, use the [15-question MAANG system-design bank](../../handbook/MAANG-Senior-System-Design.md), including senior follow-ups, staff/tech-lead extensions and a self-review rubric. Its remote-build, search and collaborative-editor exercises complement these domain mocks.

For AI-assisted IDE and agent-platform practice, use [Applied AI interview preparation](../../handbook/Applied-AI-Interview-Preparation.md), especially the coding-assistant, retrieval, tool-safety and evaluation exercises.

These are original interview exercises expanding the six prompts in your notes. They are **not descriptions of Google's internal architecture or verified interview questions**. Use 45 minutes: requirements 5, high-level design including estimates 10, two deep dives 20, failure challenges and recap 10. Define interfaces and data before naming technologies.

For every mock state expected load, latency/freshness, durability, offline behavior and trust boundaries. Draw the design yourself, then trace one success and one failure. Numbers below are illustrative assumptions to practice arithmetic, not product metrics.

## P0. 1 — Incremental build system

**Prompt:** Design a build engine for a large project. Run independent tasks in parallel, rebuild only affected outputs and reuse previous results locally or remotely.

**Clarify:** One machine or a build farm? Are tasks deterministic? Can outputs depend on network, environment or undeclared files? Must builds reproduce exactly? What is the expected graph size and critical path?

**Starting design:** Represent tasks as a dependency DAG, detect cycles and derive a ready queue from unmet dependencies. A scheduler assigns ready tasks to bounded workers. Each task has declared inputs, outputs, toolchain and environment. A cache maps an action digest to an output manifest and content-addressed artifacts. Workers stage results, verify completion and atomically publish the manifest; a failed attempt must not expose partial output.

**Interfaces/data:** `submitBuild(targets, revision, options) → buildId`; `getBuild(buildId)`; cancel operation. Keep `TaskSpec`, action digest, dependency result digests, attempt ID, status and output manifest. A successful dependency unlocks its consumers; failure/cancellation must have explicit propagation semantics.

**Deep dive A — correct reuse:** Hash relevant content, command/options and toolchain; include dependency outputs and required environment. A timestamp-only key is unsafe. Handle deletions, generated files and configuration changes. If an input is undeclared, the cache can return a confidently wrong result; add dependency tracking or mark that task noncacheable. Distinguish avoiding an unchanged local task from restoring outputs computed elsewhere. Gradle documents [incremental builds](https://docs.gradle.org/current/userguide/incremental_build.html) and its [build cache](https://docs.gradle.org/current/userguide/build_cache.html) separately.

**Deep dive B — scheduling/failure:** Schedule only after prerequisites succeed; cap CPU/memory use, prioritize the critical path where practical, and avoid one job monopolizing workers. Task attempts may repeat after worker failure; use attempt identities and publish-once result state. Remote cache corruption requires digest verification, eviction and recomputation. Build failure is not the same as infra failure.

**Sizing drill:** Assume 10,000 tasks, 20,000 edges, 20% invalidated, one CPU-second each and 8 workers. Ideal affected-task work is 2,000 CPU-seconds, so at least 250 seconds by work/worker count, and at least the critical-path duration. Add download, queue, setup and memory constraints before promising a completion time.

**Challenge/test:** Change one file used by two branches, then delete a generated input; show affected closure and invalidation. Kill a worker between artifact upload and manifest commit. Explain why an unchanged input with a changed compiler must miss the old cache. Measure cache hit correctness, avoided work, critical-path time and p95 build latency.

## P0. 2 — IDE code-indexing engine

**Prompt:** Support symbol search, navigation and references in a large workspace while files change and typing remains responsive.

**Clarify:** Languages, file count/size, incomplete syntax, unsaved buffers, dependency libraries, memory budget and whether stale results are acceptable. Text search and semantic references are different products.

**Starting design:** File/document events feed a coalescing work queue. Workers parse changed versions into syntax/semantic representations and produce symbol/reference records. Persist compact per-file data and inverted indexes. A query service reads a consistent index generation plus an overlay for unsaved documents. Schedule active files ahead of cold workspace work and make tasks cancelable.

**Interfaces/data:** `updateFile(fileId, version, contentOrDeletion)`; `findSymbol(query, snapshot)`; `findReferences(symbolId, snapshot)`. Store file version/content digest, declarations, scopes, postings and index schema version. Replacing/deleting a file must remove its old postings; publishing a generation must not mix old and new entries for that file.

**Deep dive A — stale work:** A parse for version 12 may finish after version 13. Accept only results matching the expected file generation; otherwise discard/retry. Avoid retaining entire ASTs for every file when compact declaration metadata suffices. Type changes may invalidate dependent semantic results beyond the changed file. IntelliJ's [index/stub documentation](https://plugins.jetbrains.com/docs/intellij/indexing-and-psi-stubs.html) describes file indexes and compact stub indexes; this mock's full architecture is our own.

**Deep dive B — responsive consistency:** Separate background computation from UI publication. A search result can carry its source version so navigation can validate it. Serve partial/best-effort results with clear state where the contract allows; otherwise defer features requiring a complete index. Handle cancellation, project closure and memory pressure. Do not perform a full workspace scan on the UI thread. Follow version-appropriate [platform threading rules](https://plugins.jetbrains.com/docs/intellij/threading-model.html) when implementing a real plugin.

**Sizing drill:** 200,000 files averaging 20 KB means 4 GB source. If compact index data averages 2 KB/file, the raw index is about 400 MB before overhead. A 100-file burst is roughly 2 MB of source parsing input; dependency fan-out may dominate. Set a hypothetical p95 query target, then explain how to benchmark representative projects rather than infer responsiveness from average throughput.

**Challenge/test:** Rapid edits, a rename during indexing, malformed source, a deleted library and an index-schema upgrade. Define correctness separately for symbol-text matches and resolved references. Measure typing stalls, index freshness, query p95, memory and canceled-work waste.

## P0. 3 — Remote Android device testing

**Prompt:** Accept an app/test artifact and a device matrix, execute tests on physical/virtual devices and return results and diagnostics.

**Clarify:** Interactive sessions or batch tests? Required API/ABI/device combinations? Tenant isolation? Expected test duration, queue latency, retention and treatment of flaky tests? [Firebase's device documentation](https://firebase.google.com/docs/test-lab/android/available-testing-devices) is useful background on device types and capacity; this is an independent design exercise.

**Starting design:** API authenticates uploads and stores immutable artifacts. A planner expands the matrix into executions. A scheduler matches required capabilities to available devices and leases one execution at a time. A device agent prepares state, installs artifacts, runs tests, uploads logs/results and reports completion. A result aggregator exposes per-attempt and overall status. Cleanup verifies the device is reusable; failed cleanup quarantines it.

**Interfaces/data:** `submitRun(artifactIds, matrix, retryPolicy, idempotencyKey)`; `getRun(runId)`; cancellation. Keep run → execution → attempt hierarchy, artifact digests, device capabilities, lease generation, timestamps and diagnostic pointers. Define terminal states for pass, assertion failure, infrastructure failure, timeout and cancellation.

**Deep dive A — duplicate/late completion:** Lease expiry can reassign work while an old agent is still active. Fence result/state updates using lease generations. Retries create new attempts and preserve earlier failure evidence. Do not merge “passed on retry” into “never failed.” Devices need actual isolation/cleanup, not just a new execution ID.

**Deep dive B — fairness and cost:** Capability-aware queues prevent rare hardware being consumed by tests that can run on common devices. Use per-tenant quotas and bounded retries; split tests only when their state dependencies permit it. Keep secrets isolated and avoid exposing another tenant's logs after cleanup. A lost device should not make the entire run permanently pending.

**Sizing drill:** 600 executions/hour at 5 minutes each consume 50 device-hours/hour, or 50 continuously busy device slots. At 70% target utilization, start with about 72 slots, then account for capability fragmentation, setup time and bursts. Ten MB of artifacts per execution would be 6 GB/hour of logical transfer before caching and replication.

**Challenge/test:** Agent disconnects after test completion but before upload; cancellation races with completion; emulator boot fails; cleanup times out. Distinguish a device issue from a product regression. Metrics: queue p95, utilization by device class, infrastructure failure rate, test flakiness and time to usable diagnostics.

## P1. 4 — AI coding assistant inside an IDE

**Prompt:** Provide code-aware explanations and proposed edits without blocking editing or silently changing the workspace.

**Clarify:** Completion/chat/edit mode, supported languages, local/offline behavior, permissions for sending code, latency/cost budget, context limits and whether tools can execute commands.

**Starting design:** The editor captures a versioned request. A context service retrieves relevant symbols/snippets from permitted files; a policy layer filters excluded data. A model gateway supports cancellation, streaming and deadlines. An edit planner produces structured patches tied to document versions. A validation layer checks applicability and runs approved checks. The UI previews changes and records user acceptance; tool execution has explicit capability boundaries.

**Deep dive A — stale edits:** If the user types during generation, compare the base version before applying; rebase only with clear conflict handling or regenerate. Cancellation should stop queued retrieval/model work when possible. A streaming answer and an executable edit have different validation needs.

**Deep dive B — quality/privacy:** Treat repository text and model output as untrusted data. Retrieved instructions must not grant tool permissions. Evaluate tasks on held-out representative repositories: compile/test success, incorrect-edit rate, latency and user corrections. Acceptance rate alone can reward plausible but wrong suggestions. Establish retention and consent rules before sending code; do not assume all repository content can leave the machine.

**Sizing drill:** At 100 concurrent generations and 8-second average generation time, capacity is about 12.5 completed requests/second at steady saturation, not a recommended utilization target. Estimate input/output tokens and per-user quotas from your own assumptions; do not invent provider prices.

**Challenge/test:** Secret in a file, malicious comment, stale document, model timeout and patch that compiles but changes behavior. Connect your MCP/POC work to orchestration and integration; do not present this proposed design as a system you already shipped.

## P1. 5 — IDE plugin framework

**Prompt:** Allow third parties to add tools while preserving compatibility, responsiveness and manageable lifecycle behavior.

**Clarify:** Trusted installed code or untrusted extensions? In-process or out-of-process? Extension points, compatibility guarantees, hot reload, permissions and recovery from bad plugins?

**Starting design:** A manifest declares identity, compatible host/API versions, dependencies and capabilities. A loader resolves dependencies and registers extension implementations. A lifecycle manager scopes services, listeners and background jobs to application/project/plugin ownership. A dispatcher uses bounded/cancelable work, while diagnostics attribute failures and latency to extensions. Validate compatibility before activation and provide safe-disable/restart recovery.

**Deep dive A — isolation:** A separate classloader separates loading/namespaces; it is not a security sandbox or protection from process crashes. For genuinely untrusted computation, consider an out-of-process worker with a narrow validated protocol and explicit capabilities. Explain the latency, serialization and API trade-off. [IntelliJ classloaders](https://plugins.jetbrains.com/docs/intellij/plugin-class-loaders.html) document loading behavior, not a universal sandbox.

**Deep dive B — lifecycle/compatibility:** Closing a project or unloading an extension must cancel work and unregister listeners; stale callbacks must not touch disposed UI. Use ownership-scoped cleanup and test repeated open/close cycles. Define compatible API evolution, version negotiation, dependency failure and fallback. [Disposer/Disposable](https://plugins.jetbrains.com/docs/intellij/disposers.html) is relevant implementation background; not every extension can be dynamically unloaded.

**Sizing drill:** Assume 50 active plugins at 5 MB retained state each: 250 MB before host/project state. Establish budgets for startup callbacks and p95 UI action latency; an average hides a single extension's long stall.

**Challenge/test:** Dependency cycle, unsupported host version, hanging callback, leaked listener and extension crash. Explain what can be disabled safely and what needs restart. Measure startup overhead, retained heap after project closure, plugin-attributed errors and compatibility failures.

## P1. 6 — Crash-reporting platform

**Prompt:** Collect IDE crashes and hangs, group related failures, prioritize regressions and support diagnosis across versions.

**Clarify:** Consent, offline clients, personally identifying content, symbol/mapping availability, retention, report size, loss tolerance and alert latency. Distinguish crash events, affected sessions and affected users.

**Starting design:** A client captures bounded diagnostics with a stable event ID, redacts sensitive fields and buffers offline. Ingestion validates/authenticates and durably queues records. Workers normalize/symbolicate, fingerprint and aggregate by version/platform/plugin context. Store raw artifacts with retention limits and an index for queries. Dashboards rank new regressions using affected sessions and release cohorts, not raw stack frequency alone.

**Deep dive A — grouping:** Exact stack equality fragments equivalent failures; aggressive normalization merges unrelated bugs. Version the fingerprint algorithm, preserve raw records and support split/merge corrections. Deduplicate retransmission by event ID; two genuine crashes with the same stack are still two events. Handle late symbol files and reprocessing without double counting.

**Deep dive B — reliability/privacy:** Retries need backoff and bounded client storage; ingestion acknowledgment should match the declared durability guarantee. Apply access control and retention to diagnostic payloads. A group spike may be a release regression or traffic growth: compare crash-free sessions and cohorts with denominators. Alert on actionable impact, not every new stack.

**Sizing drill:** Assume 1 million active clients and 0.01 reports/client/day: 10,000 reports/day, about 0.12/second average. At 100 KB/report, about 1 GB/day raw. Design for synchronized post-outage upload bursts and payload size limits; average rate is not enough for capacity planning.

**Challenge/test:** Same event uploaded three times, a new version changes line numbers, missing symbols, a plugin crash misattributed to core and deletion under retention policy. Measure ingestion lag, grouping accuracy, crash-free sessions and time to actionable regression detection.

## Mock review

Score 0–2 each: precise requirements, useful estimates, explicit data/interfaces, correct state transitions, failure handling, trade-offs and clear communication. For the three P0 mocks, repeat until you can explain one invariant and one counterexample without notes. No polished diagram compensates for a cache returning stale output, an old index overwriting a newer edit, or a stale device agent committing a result after reassignment.
