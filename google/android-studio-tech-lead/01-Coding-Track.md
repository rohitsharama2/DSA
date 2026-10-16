# Coding track: 16 problems, JavaScript delivery

[Track index](README.md) · [Shared DSA bank](../rounds/01-DSA-Coding-Questions-and-Solutions.md) · [All local explanations and code](../solutions/Coding-Answers.md) · [Runnable JavaScript](coding-solutions.mjs)

These are the problems selected in your supplied role notes, not a confirmed interview bank. P0/P1 below are our study priorities. Use JavaScript for timed work; existing TypeScript examples can guide reasoning, but rehearse without type annotations unless the recruiter confirms TypeScript support.

## The complete question map

For each row, explain the baseline first, then the invariant, complexity and failure cases. `n` means input length unless otherwise stated; hash-table complexities are expected.

| Priority / problem | Approach to derive and defend | Target time / extra space | Test or changed requirement |
| --- | --- | --- | --- |
| P0 [207 Course Schedule](../solutions/Coding-Answers.md#lc-207) · [LeetCode practice](https://leetcode.com/problems/course-schedule/) | DFS from each vertex is a naive repeated check; Kahn's algorithm processes every dependency once; unfinished vertices imply a cycle | `O(V+E)` / `O(V+E)` including adjacency | Self-cycle, disconnected graph, duplicate prerequisites. Return a cycle witness |
| P0 [210 Course Schedule II](../solutions/Coding-Answers.md#lc-210) · [LeetCode practice](https://leetcode.com/problems/course-schedule-ii/) | Same graph, return the emitted order only if every vertex is processed | `O(V+E)` / `O(V+E)` | Validate edges, not one exact ordering; lexicographically smallest order requires a heap |
| P0 [269 Alien Dictionary](../solutions/Coding-Answers.md#lc-269) · [LeetCode practice](https://leetcode.com/problems/alien-dictionary/) | First differing characters of adjacent words impose constraints; reject reversed prefix | `O(S+V+E)` / `O(V+E)` | Prefix invalidity, cycle, unconstrained symbols. [Shared Q1](../rounds/01-DSA-Coding-Questions-and-Solutions.md#q1-infer-an-alien-alphabet) is self-contained |
| P0 [127 Word Ladder](../solutions/Coding-Answers.md#lc-127) · [LeetCode practice](https://leetcode.com/problems/word-ladder/) | BFS over words differing at one position; compare full dictionary scanning with neighbor generation/buckets | With alphabet A and JS length-L string creation: mutation BFS `O(N·A·L²)`; visited dictionary/queue `O(N·L)` storage | End missing, unreachable, repeated discoveries, start=end contract. Explain bidirectional frontier meeting |
| P0 [236 Lowest Common Ancestor](../solutions/Coding-Answers.md#lc-236) · [LeetCode practice](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | Recursive return is absent, target or subtree ancestor; two non-null sides identify split | `O(n)` / `O(h)` stack | Identity versus equal values; target may be absent; iterative parent map if deep |
| P0 [295 Find Median from Data Stream](../solutions/Coding-Answers.md#lc-295) · [LeetCode practice](https://leetcode.com/problems/find-median-from-data-stream/) | Lower max-heap and upper min-heap; every lower value ≤ every upper value; sizes differ by at most one | Insert `O(log n)`, median `O(1)` / `O(n)` | Duplicates, negatives, even count. Add deletion/sliding window |
| P0 [146 LRU Cache](../solutions/Coding-Answers.md#lc-146) · [LeetCode practice](https://leetcode.com/problems/lru-cache/) | Map key→node plus doubly linked recency list; promote on get/update | Expected `O(1)` get/put / `O(capacity)` | Existing-key update, capacity 0, eviction. Explain TTL separately from recency |
| P0 [239 Sliding Window Maximum](../solutions/Coding-Answers.md#lc-239) · [LeetCode practice](https://leetcode.com/problems/sliding-window-maximum/) | Scan each window `O(nk)` → decreasing deque of indices; expired front removed, dominated back removed | `O(n)` / `O(k)` excluding output | Equal values, decreasing input, `k=1`, `k=n`. See executable solution |
| P0 [56 Merge Intervals](../solutions/Coding-Answers.md#lc-56) · [LeetCode practice](https://leetcode.com/problems/merge-intervals/) | Sort by start, extend active end; state whether touching endpoints merge | `O(n log n)` / `O(n)` copy/output; sorting storage depends on runtime | Nested/touching ranges, empty input, preserve input. Online updates |
| P0 [33 Search in Rotated Sorted Array](../solutions/Coding-Answers.md#lc-33) · [LeetCode practice](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Identify sorted half, test target bounds, discard opposite half | `O(log n)` / `O(1)` for distinct values | No rotation, one element, missing target. Duplicates can degrade to `O(n)` |
| P0 [76 Minimum Window Substring](../solutions/Coding-Answers.md#lc-76) · [LeetCode practice](https://leetcode.com/problems/minimum-window-substring/) | Enumerating substrings → counts plus missing multiplicity; shrink only while valid | `O(n+m)` / `O(alphabet)` | Repeated required characters, impossible, empty target contract |
| P1 [4 Median of Two Sorted Arrays](../solutions/Coding-Answers.md#lc-4) · [LeetCode practice](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Merge `O(m+n)` → binary search a partition in the shorter array; left max ≤ right min | `O(log(min(m,n)+1))` / `O(1)` | One empty, all values from one side, odd/even, duplicates; both empty rejected |
| P0 [322 Coin Change](../solutions/Coding-Answers.md#lc-322) · [LeetCode practice](https://leetcode.com/problems/coin-change/) | Recursive choices → `dp[a]=1+min(dp[a-c])`; unreachable starts at infinity | `O(amount·coins)` / `O(amount)` | Amount 0, unreachable, repeated coins; greedy fails for `[1,3,4]`, amount 6 |
| P0 [139 Word Break](../solutions/Coding-Answers.md#lc-139) · [LeetCode practice](https://leetcode.com/problems/word-break/) | Repeated split recursion → reachable prefix positions; trie avoids substring allocation | Trie build `O(D)` + `O(nL)` traversal / `O(D+n)` | Reused word, shared prefixes, unsegmentable suffix. Return/count segmentations |
| P0 [743 Network Delay Time](../solutions/Coding-Answers.md#lc-743) · [LeetCode practice](https://leetcode.com/problems/network-delay-time/) | Dijkstra with a cost heap and stale-entry skip; answer maximum finite distance or -1 | Lazy heap `O(V+E log(E+2))` / `O(V+E)` | Disconnected, repeated improvements, zero weights. [Shared Q6](../rounds/01-DSA-Coding-Questions-and-Solutions.md#q6-a-route-planner-changes-from-hop-count-to-travel-cost) |
| P1 [72 Edit Distance](../solutions/Coding-Answers.md#lc-72) · [LeetCode practice](https://leetcode.com/problems/edit-distance/) | Exponential recursion → prefix DP over insert/delete/replace; keep previous row | `O(mn)` / `O(min(m,n))` | Empty string, equal strings, asymmetric lengths; edit-script reconstruction requires more state |

`S`: total characters in alien dictionary; `D`: total dictionary characters for Word Break; `L`: maximum dictionary-word length; `h`: tree height. For JavaScript strings, these drills use ASCII or UTF-16 code units unless otherwise stated. Unicode code points/graphemes require a clarified representation. Median arithmetic is assumed safely representable; avoid silently treating arbitrary BigInt input as Number.

## Local solutions: derive before reading the code

The standalone [reference file](coding-solutions.mjs) now implements all 16 problems. Each question title above opens its local explanation and code; the separate LeetCode practice link opens the external problem. Contracts are stated in code comments. It has no external dependencies and does not change the shared TypeScript runner.

**207:** Interpret `[course, prerequisite]` as `prerequisite → course`. Maintain an indegree count and a head-index ready queue. Every emitted vertex has all prerequisites emitted; if fewer than `n` are emitted, a residual cycle prevents completion. For 210, return the queue/order when its length is `n`; validate all prerequisite edges in your test, since many orders can be legal.

**239:** For `[1,3,-1,-3,5,3,6,7]`, `k=3`, the maxima are `[3,3,5,5,6,7]`. Store indices because expiry depends on position. If a newer index has an equal or greater value, the older one cannot win a future window containing both and expires earlier. Each index enters and leaves at most once. The implementation uses a fixed-size ring deque so retained storage is `O(k)`; a growing array with a head index would retain `O(n)` slots.

**33:** In `[4,5,6,7,0,1,2]`, target 0: decide which half is sorted before testing bounds. The invariant is that any match remains inside `[lo,hi]`. Distinct values guarantee a sorted half can be identified. A follow-up allowing duplicates changes that argument; do not keep promising logarithmic worst-case time.

**4:** Partition the shorter array at `i`, the other at `j=floor((m+n+1)/2)-i`. A valid partition has both left maxima at most the opposite right minima. If `aLeft>bRight`, move `i` left; if `bLeft>aRight`, move it right. The left side holds the extra element for odd length. Sentinels handle empty halves; sorted finite arrays are a precondition. Do not add an `O(m+n)` sortedness validation then claim logarithmic total time.

**139:** For each reachable starting position, follow trie edges until they stop. Mark every terminal-word endpoint reachable. Prefix reachability is sufficient because the remaining suffix does not depend on how the prefix was segmented. The empty string is segmentable; empty dictionary words are ignored. Enumerating all segmentations is a separate, potentially exponential-output problem.

**72:** `dp[i][j]` is the minimum edits converting the first `i` characters of one string to the first `j` of the other. Equal final characters reuse the diagonal; otherwise add one to the minimum of delete, insert and replace. Initialization converts empty prefixes. Keeping two rows is sufficient for the distance, but discards ordinary backtracking information for an edit script.

## JavaScript interview checklist

- Numeric sort needs `(a,b) => a-b`; default sort is lexicographic. Explain whether input may be mutated.
- BFS: use a head index, not repeated `shift()`. Monotonic deque: remove expired **indices**, not values.
- Heap: define comparator and tie rule; rehearse push/pop without libraries. Use the [shared Q7 heap](../rounds/01-DSA-Coding-Questions-and-Solutions.md#q7-priority-dispatcher-with-category-cooldown) as a reference and translate to JS.
- `Map`/`Set`: node object identity matters in tree/list questions. Check `undefined` explicitly when index 0 is valid.
- Recursive depth: count stack space; replace deep DFS with an explicit stack. Asynchrony is unnecessary for these pure algorithms.
- `Number`: integers are exact only through `Number.MAX_SAFE_INTEGER`; define limits on intermediate sums. `BigInt` does not mix with Number arithmetic. JS bitwise operations narrow to 32 bits—use arithmetic midpoint for large indices.
- Tests: empty/singleton, duplicates, disconnected graphs, impossible result, stale heap entries and boundaries. Explain a failing case before editing the code.

See the [mock answer guide](../solutions/Mock-Answers.md) after attempting the transfer mocks below.

## Three role-themed transfer mocks

These are original exercises, not reported interview questions.

1. **Build dependencies (45 minutes):** Given tasks and prerequisite edges, return a valid build order or indicate a cycle. At minute 25, introduce `w` workers and task durations. Explain completion events and why a topological order alone is not a time-optimal schedule. At minute 35, ask for impacted dependents after one task changes.
2. **Diagnostics stream (45 minutes):** Return the maximum latency in each fixed window of events. At minute 25, replace event-count windows with timestamps; clarify ordering and late events before modifying eviction. At minute 35, ask whether a median can use the same deque.
3. **Editor suggestions (45 minutes):** Decide whether text can be segmented by a dictionary. At minute 25, return one segmentation; at minute 35, return the minimum number of words. Distinguish reachable, count and optimum states.

Use 5 minutes to clarify, 7 to derive, 20 to implement, 8 to test and 5 for complexity/follow-up. Score independently correct base code, invariant, meaningful tests and adaptation; record hints. Do not count reading a solution as completing a problem.
