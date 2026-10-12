# Netflix: DSA and stateful coding

[Round-wise index](README.md) · [Sources and evidence limits](Research-Sources.md)

**Updated October 12, 2026.** Original TypeScript exercises with explicit contracts. P0 = first, P1 = breadth, P2 = stretch. Practice priorities are not measured question frequencies.

## Prioritized question bank

These **24 LeetCode analogues** cover cache/history themes plus broad fundamentals. N1–N3 provide cache/versioned-state context with different levels and provenance; N4 supports binary-search practice. The remaining choices are our foundations/transfer recommendations.

| # | Priority / pattern | Practice | Follow-up / pitfall |
| --- | --- | --- | --- |
| 1 | P0 cache | [2622 Cache With Time Limit](https://leetcode.com/problems/cache-with-time-limit/) | Compare timer-based API with our injected-clock contract |
| 2 | P0 cache | [146 LRU Cache](https://leetcode.com/problems/lru-cache/) | LRU is not TTL; combine only after defining both |
| 3 | P0 history | [981 Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) | Predecessor search, equal timestamps, out-of-order writes |
| 4 | P0 history | [1146 Snapshot Array](https://leetcode.com/problems/snapshot-array/) | Sparse changes and snapshot semantics |
| 5 | P0 command state | [1472 Design Browser History](https://leetcode.com/problems/design-browser-history/) | New action invalidates forward history |
| 6 | P0 binary search | [2187 Minimum Time to Complete Trips](https://leetcode.com/problems/minimum-time-to-complete-trips/) | Analogue of N4; monotone feasibility and numeric bounds |
| 7 | P0 tree | [110 Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/) | Postorder heights; optionally report balance per node |
| 8 | P0 tree | [102 Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Queue boundaries and output order |
| 9 | P0 intervals | [56 Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Closed vs. half-open intervals |
| 10 | P0 intervals | [729 My Calendar I](https://leetcode.com/problems/my-calendar-i/) | Online state and conflict semantics |
| 11 | P0 maps | [49 Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Canonical representation |
| 12 | P0 window | [3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Correct left boundary and string model |
| 13 | P1 heap | [347 Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Streaming follow-up and ties |
| 14 | P1 heap | [295 Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Two-heap partition invariant |
| 15 | P1 sweep | [1094 Car Pooling](https://leetcode.com/problems/car-pooling/) | Same-position drop-off before pickup |
| 16 | P1 window | [239 Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | Monotonic deque and expiry by index |
| 17 | P1 graph | [200 Number of Islands](https://leetcode.com/problems/number-of-islands/) | Iterative traversal and mutation choice |
| 18 | P1 graph | [210 Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Dependency graph, duplicate edges, cycle |
| 19 | P1 graph | [743 Network Delay Time](https://leetcode.com/problems/network-delay-time/) | Weighted search vs. ordinary BFS |
| 20 | P1 prefix sums | [560 Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Negative values and prefix multiplicity |
| 21 | P1 stack | [739 Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Amortized proof and strict comparison |
| 22 | P1 DP | [322 Coin Change](https://leetcode.com/problems/coin-change/) | Reachable states and recurrence |
| 23 | P2 DP | [300 Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Sequence length vs. reconstruction |
| 24 | P2 trie | [212 Word Search II](https://leetcode.com/problems/word-search-ii/) | Prefix pruning and visited state |

## Q1. Timed cache with deterministic cleanup

**Evidence:** N1 mentions a cache screen, while N2 describes expiration and memory follow-ups in an Ads summary. **Our contract:** `set/get/count` take nonnegative safe-integer times that never decrease globally. TTL is a nonnegative safe integer; expiration must fit safe integers. A value is live iff `now < expiresAt`. Overwriting replaces the old value/deadline. TTL zero removes the key. Every operation removes all expired entries. Values are strings; `null` means missing. This is a simple scan baseline, not an LRU or capacity-bounded cache.

```ts
class TimedCache {
  private entries = new Map<string, { value: string; expiresAt: number }>();
  private lastTime = -1;
  private advance(now: number): void {
    if (!Number.isSafeInteger(now) || now < 0 || now < this.lastTime) throw new Error('Invalid clock');
    this.lastTime = now;
    for (const [key, entry] of this.entries) if (entry.expiresAt <= now) this.entries.delete(key);
  }
  set(key: string, value: string, ttl: number, now: number): void {
    if (!Number.isSafeInteger(ttl) || ttl < 0 || !Number.isSafeInteger(now + ttl)) throw new Error('Invalid TTL');
    this.advance(now);
    if (ttl === 0) this.entries.delete(key);
    else this.entries.set(key, { value, expiresAt: now + ttl });
  }
  get(key: string, now: number): string | null {
    this.advance(now);
    return this.entries.get(key)?.value ?? null;
  }
  count(now: number): number {
    this.advance(now);
    return this.entries.size;
  }
}
```

**Example:** Set `a='old'` at 10 with TTL 5; replace at 12 with TTL 10. Reading at 15 returns the new value; reading at 22 returns `null`. An old expiry must not delete a refreshed value.

**Correctness:** Cleanup removes exactly expired entries. Replacement updates the only authoritative record, so there is no old scheduled callback to erase a newer value. **Complexity:** `O(n)` per operation over entries present before cleanup; retained space after an operation is `O(live entries)`. Idle entries remain until another operation; this is not autonomous cleanup or a memory cap.

**Optimization follow-ups:** Use a min-heap of `(expiry,key,generation)` plus an authoritative map; ignore stale heap records after refreshes and rebuild if obsolete records accumulate. Monotone request times alone do **not** order expiration when TTLs differ: `(time=0,ttl=100)` expires after `(time=1,ttl=1)`. A FIFO expiry queue is valid only under an additional expiry-order invariant, such as one fixed TTL. Background cleanup requires clock and synchronization design; capacity eviction is a separate policy.

## Q2. Versioned key-value store

**Evidence:** N3 describes versioned storage in an Ads context; this is a simpler original practice contract. `set(key,value,time)` receives nonnegative safe-integer times in nondecreasing order **per key**. Equal timestamp replaces that version. `get(key,time)` returns the last value at or before the query, or `null`. Query order is arbitrary. Values are strings.

```ts
class VersionedStore {
  private history = new Map<string, { time: number; value: string }[]>();
  set(key: string, value: string, time: number): void {
    if (!Number.isSafeInteger(time) || time < 0) throw new Error('Invalid time');
    const versions = this.history.get(key) ?? [];
    const last = versions[versions.length - 1];
    if (last && time < last.time) throw new Error('Out-of-order write');
    if (last && time === last.time) last.value = value;
    else versions.push({ time, value });
    this.history.set(key, versions);
  }
  get(key: string, time: number): string | null {
    if (!Number.isSafeInteger(time) || time < 0) throw new Error('Invalid time');
    const versions = this.history.get(key) ?? [];
    let lo = 0, hi = versions.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (versions[mid].time <= time) lo = mid + 1;
      else hi = mid;
    }
    return lo === 0 ? null : versions[lo - 1].value;
  }
}
```

**Example:** Set `a=A@2`, `a=B@5`, replace with `a=C@5`. Queries at 1, 4, 5 return `null`, `A`, `C`.

**Correctness:** Binary search finds the first version strictly later than the query. Its predecessor is the latest eligible write. Equal-time replacement preserves sorted order. **Complexity:** Amortized `O(1)` writes, `O(log v)` reads for `v` versions of that key, `O(total versions)` space.

**Follow-ups:** Arbitrary write timestamps need ordered insertion or a tree/index; deletion needs a tombstone to retain historical semantics; pruning requires an explicit oldest-readable-version contract. This is per-key history, not a consistent cross-key snapshot or transactional database.

## Q3. Undo/redo text state

**Evidence:** N2 reports undo then redo; exact commands are not public. **Our contract:** the document is a string. `replace(text)` creates a new full-state edit, `undo()` reverses the latest edit, `redo()` reapplies an undone edit. A new non-no-op edit clears redo history. Replacing with identical text is a no-op and preserves history. Undo/redo at an empty boundary leave state unchanged.

```ts
class TextHistory {
  private current = '';
  private past: string[] = [];
  private future: string[] = [];
  value(): string { return this.current; }
  replace(next: string): string {
    if (next === this.current) return this.current;
    this.past.push(this.current);
    this.current = next;
    this.future = [];
    return this.current;
  }
  undo(): string {
    if (this.past.length) {
      this.future.push(this.current);
      this.current = this.past.pop()!;
    }
    return this.current;
  }
  redo(): string {
    if (this.future.length) {
      this.past.push(this.current);
      this.current = this.future.pop()!;
    }
    return this.current;
  }
}
```

**Example:** replace A, replace B, undo → A, redo → B, undo → A, replace C, redo → C. New branch C cannot redo B.

**Correctness:** `past` stores states before successive edits; `future` stores undone states in reverse traversal order. Undo and redo move the current state between these stacks. **Complexity:** Amortized `O(1)` stack/reference operations; string equality can cost `O(length)`. Storage retains the contents of all referenced snapshots, potentially `O(edits × document size)`; clearing references does not guarantee immediate garbage collection.

**Follow-ups:** Store inverse commands/deltas for large text; define grouping of edits, history limits, and how a failed command affects history. External side effects are not reversible merely because local state is; collaborative editing needs a different concurrency model.

## Q4. Minimum notification completion time

**Evidence:** N4 gives this parallel-worker theme with no stated level. **Practice contract:** independent workers have positive integer durations and can repeatedly process one notification at a time. All start at zero. Return the smallest integer time to complete at least `target` notifications. Use `bigint` to avoid overflow. Zero target takes zero time; positive target with no workers is invalid.

```ts
function minimumNotificationTime(durations: bigint[], target: bigint): bigint {
  if (target < 0n || durations.some(time => time <= 0n)) throw new Error('Invalid input');
  if (target === 0n) return 0n;
  if (!durations.length) throw new Error('No workers');
  const fastest = durations.reduce((a, b) => a < b ? a : b);
  let lo = 0n, hi = fastest * target;
  while (lo < hi) {
    const mid = lo + (hi - lo) / 2n;
    let completed = 0n;
    for (const duration of durations) {
      completed += mid / duration;
      if (completed >= target) break;
    }
    if (completed >= target) hi = mid;
    else lo = mid + 1n;
  }
  return lo;
}
```

**Example:** `[2n,3n]`, target `5n` → `6n`: by 5 only 3 complete, by 6 five complete.

**Correctness:** Feasibility is monotone because each worker completes `floor(t/duration)` jobs by time `t`. The fastest worker alone makes `fastest × target` feasible. Binary search preserves the smallest feasible answer in `[lo,hi]`.

**Complexity:** `O(workers × log(fastest × target + 1))` bigint arithmetic operations, constant auxiliary bigint variables beyond input. Arithmetic cost depends on bit width. **Follow-ups:** Startup delays change the feasibility formula; dependent jobs or shared resources invalidate the independent-worker model. A heap simulation is reasonable for tiny targets but scales with the number of completions.

## Mock practice

For 45 minutes: 5 clarify, 7 baseline/invariant, 20 implement, 8 test, 5 adapt. These are rehearsal timings. Choose one change afterward: out-of-order writes, mixed TTLs, capacity bounds, tombstones, or returning an execution schedule. Explain which old assumptions break before editing code.
