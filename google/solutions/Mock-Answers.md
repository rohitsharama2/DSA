# Mock answers and changed-requirement follow-ups

[All answers](README.md)

Read after attempting the corresponding mock. Base implementations are linked; these explanations show what changes when the interviewer adds constraints. Unseen mocks selected by a coach cannot have prewritten exact answers, so use the pattern/invariant rather than assuming this is the only formulation.

## General packet A: timestamped connectivity

Use [Q3's sorted-log DSU](../rounds/01-DSA-Coding-Questions-and-Solutions.md#q3-first-timestamp-when-everyone-is-connected). Sort by timestamp, union endpoints and return the first time one component remains. Duplicate edges do not reduce component count. Out-of-order logs require sorting; do not assume insertion order is chronological.

For queries “connected at time T?”, sort insertion-only queries by T, advance one pointer through the sorted edges, and answer with DSU roots. Complexity is sorting logs/queries plus near-linear unions/finds; preserve original query indices. If queries arrive online in arbitrary historical order, retain a suitable persistent/history structure or recompute; ordinary current-state DSU does not answer the past. With deletions, rebuilding reachability is a simple baseline. Offline deletion-only events may be reversed into insertions; mixed intervals can use a segment tree over edge lifetimes with rollback DSU. Standard path compression is not automatically compatible with simple rollback.

## General packet B: routes and duration

For unweighted edges, BFS with a head-index queue and visited-on-enqueue yields minimum hops. Record `parent[next]=current` on first discovery; reconstruct by walking from target to source and reversing. Same source/target is zero hops; unreachable has an explicit null/-1 contract.

When durations become nonnegative, use [Q6 Dijkstra](../rounds/01-DSA-Coding-Questions-and-Solutions.md#q6-a-route-planner-changes-from-hop-count-to-travel-cost) or [743](Coding-Answers.md#lc-743). Set parent on each strict relaxation, skip stale heap entries, and stop at a single target only when popped with its current minimum. Discovery is not finalization: edges `s→t(9), s→u(2), u→t(1)` disprove marking t permanently visited on first discovery. Zero-cost cycles require strict improvement to avoid repeated equal updates. If weights can be negative, revisit the algorithm and negative-cycle/output contract.

## General packet C: capacity assignment

Use [2463](Coding-Answers.md#lc-2463) / [Q5](../rounds/01-DSA-Coding-Questions-and-Solutions.md#q5-capacity-constrained-assignment-on-a-line). Sorted-line uncrossing justifies consecutive assignments; DP chooses how many of the current prefix go to each factory. Read the previous factory's row, not an already updated same-factory row that could exceed capacity.

For reconstruction, retain the selected count for each `(factoryIndex, robotPrefixLength)` and walk backward, emitting that many robot→factory assignments. Track original indices before sorting if caller needs original identity. This adds O(FR) decision storage. Huge capacities need not expand into individual slots: cap candidate count at the remaining robot count. Arbitrary 2-D coordinates/costs remove the sorted uncrossing property; use a general capacitated assignment/min-cost-flow formulation rather than reusing the 1-D recurrence without proof.

## General packet D: LRU, expiration and concurrency

[146's map/list implementation](Coding-Answers.md#lc-146) handles overwrite promotion, capacity zero and eviction. A get/put must update map membership and list links together. Numeric -1 is the absence sentinel in the practice contract.

For TTL, first define absolute versus sliding expiry and whether expired entries consume capacity. Add deadline/version to each node and reject/delete expired nodes on access. Proactive cleanup can use a min-heap of deadlines; updates need a version check to ignore old heap entries. Heap maintenance adds O(log n) work and stale entries need bounded reclamation; TTL is not free under the original O(1) guarantee. A timing wheel trades resolution for update/cleanup behavior. For concurrent threads, serialize or lock compound map/list operations; a single-threaded event loop still requires care if an operation awaits midway through a mutation or state is shared across workers.

## General packets E and F

**E—worst-query dashboard:** [Full answer](../rounds/02-System-Design-and-Followups.md#4-dashboard-showing-the-n-worst-queries--october-priority). Clarify individual execution versus query fingerprint, metric/window and exactness. When changed to p95, replace sum-only state with mergeable distributions or sufficient exact data; do not average shard p95s. Apply deduplication and event-time lateness policy before publishing rankings. Local top-K of partial scores may omit the global winner; combine each key's complete score first.

**F—leadership:** Use the [behavioral answer templates](Behavioral-Answers.md) for ambiguity, disagreement, failure and feedback. A strong response names the real decision, your contribution, another person's perspective and observable outcome. If every answer uses the same success story, select genuine different events. The templates cannot supply missing personal history.

## Android Studio mock 1: build dependencies

The base is [210 topological ordering](Coding-Answers.md#lc-210); return failure if processed count is short. If returning a cycle witness, maintain DFS visiting/finished states and predecessor links and unwind a back edge.

With task durations and `w` workers, simulate time: maintain ready tasks, idle slots and a min-heap of running tasks by finish time. Fill workers from ready tasks, advance to the next finish, process **all** completions at that time, decrement dependent indegrees and enqueue newly ready tasks. Zero-duration tasks may unlock more work at the same time; continue until no running/ready work remains. Define a deterministic ready-task policy and duration assumptions. This produces a feasible schedule, not necessarily an optimal makespan: precedence-constrained scheduling with limited workers needs more than Kahn order to optimize globally. Complexity for a fixed-policy simulation is O(V log(V+1)+E) with heap-based ready/running queues, O(V+E) state.

For one changed task, traverse its outgoing dependency edges to find the reachable dependent closure, with a visited set. Rebuild only affected tasks under the dependency/input contract. Changes to task definitions, missing declared inputs or environment can widen that set; “unchanged file” alone does not establish a valid cached output. See the [build design](../android-studio-tech-lead/03-System-Design.md#p0-1--incremental-build-system).

## Android Studio mock 2: diagnostics stream

Use [239's decreasing deque](Coding-Answers.md#lc-239) for fixed-count maxima. For nondecreasing timestamps and a trailing duration W, store timestamp+sequence+value and discard entries outside your exact boundary, for example timestamps `<= currentTime-W` for `(currentTime-W,currentTime]`. Pop dominated back entries as before. Equal timestamps need sequence identities; memory is bounded by retained nondominated events, not a fixed k.

For out-of-order timestamps, clarify event-time versus arrival-time windows and whether past answers may change. One simple baseline buffers/sorts within an allowed lateness window, advances a watermark, then applies the ordered algorithm. Results become final only under that lateness policy; arrivals beyond it need rejection or correction. You cannot simply evict by an out-of-order arrival's timestamp and keep the original proof.

A median needs the full relevant multiset: values dominated for maximum may still determine its middle. Use two heaps plus deletions or an ordered multiset with window-expiry updates, not the maxima deque. Bound and account for stale heap entries. [295](Coding-Answers.md#lc-295) provides the insertion-only starting invariant.

## Android Studio mock 3: editor suggestions

Start with [139's reachable-prefix trie traversal](Coding-Answers.md#lc-139). To return one segmentation, when endpoint `j+1` first becomes reachable store predecessor `i`. On success, walk endpoints backward and slice the corresponding words, then reverse. Keep predecessor values on the first discovery so later routes do not introduce inconsistent reconstruction.

To return the fewest words, set `best[0]=0`, other positions to infinity. For every reachable prefix i, traverse trie matches ending at j and relax `best[j+1]=min(best[j+1],best[i]+1)`, recording predecessor on improvement. Boundaries increase strictly because empty words are ignored, so the position graph is a DAG and left-to-right order processes prerequisites. Time remains O(D+nL), space O(D+n) plus output. Counting segmentations uses addition of counts instead of min; enumeration can have exponential output and needs an explicit result limit for interactive use.

## Day 1 deployment diagnostic and review questions

Deployment prerequisite ordering is the same graph model as 210. Adding a new dependency `u→v` preserves an existing order only if its rank already places u before v. If it reverses rank, detect whether v reaches u (which creates a cycle), then recompute/reorder affected vertices; full topological recomputation is a valid O(V+E) baseline. Duplicate edges must not accidentally decrement an indegree twice when storage deduplicates them.

For every code-review question ask: is the input contract explicit, is the invariant maintained, are stale/duplicate states handled, do tests include the counterexample, and does the complexity include allocations, output and recursion? The [local coding answers](Coding-Answers.md) document those details per problem. For arbitrarily generated new mocks, derive the answer from those principles rather than memorize a title-to-code mapping.
