# Google L5: DSA patterns and worked TypeScript

[Round-wise index](README.md) · [Evidence G1–G9 and M1–M2](Research-Sources.md) · [Study strategy](../../handbook/Agoda-Google-Preparation-Strategy.md)

**Updated October 16, 2026.** P0 means first, P1 broadens coverage, P2 stretches a mastered pattern. These are study priorities, not company-frequency rankings. The 30 foundational linked problems plus thirteen October additions are practice analogues/foundations; the original implementations below are not claimed to reproduce interview questions.

**Android Studio interview:** The [targeted 16-question JavaScript track](../android-studio-tech-lead/01-Coding-Track.md) maps the requested problems to this bank. [All Google solutions](../solutions/README.md) now provides local answers for every listed coding problem, plus design, behavioral and mock answers.

## Pattern-to-question bank

| # | Priority / pattern | Practice link | Interview reasoning / follow-up |
| --- | --- | --- | --- |
| 1 | P0 topological order | [210 Course Schedule II](../solutions/Coding-Answers.md#lc-210) · [LeetCode practice](https://leetcode.com/problems/course-schedule-ii/) | Edge direction, duplicate constraints, cycles |
| 2 | P0 topological modeling | [269 Alien Dictionary](../solutions/Coding-Answers.md#lc-269) · [LeetCode practice](https://leetcode.com/problems/alien-dictionary/) | First differing symbol, invalid prefix; Q1 is self-contained |
| 3 | P0 dependency propagation | [2115 Find All Possible Recipes](../solutions/Coding-Answers.md#lc-2115) · [LeetCode practice](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) | Which nodes are initially available? |
| 4 | P0 BFS | [994 Rotting Oranges](../solutions/Coding-Answers.md#lc-994) · [LeetCode practice](https://leetcode.com/problems/rotting-oranges/) | Multi-source distance, unreachable cells |
| 5 | P0 BFS | [127 Word Ladder](../solutions/Coding-Answers.md#lc-127) · [LeetCode practice](https://leetcode.com/problems/word-ladder/) | Neighbor generation and bidirectional search |
| 6 | P0 0–1 BFS | [1368 Minimum Cost to Make at Least One Valid Path in a Grid](../solutions/Coding-Answers.md#lc-1368) · [LeetCode practice](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/) | Directed edge cost; deque vs. ordinary BFS |
| 7 | P0 shortest paths | [743 Network Delay Time](../solutions/Coding-Answers.md#lc-743) · [LeetCode practice](https://leetcode.com/problems/network-delay-time/) | Why nonnegative weights permit Dijkstra |
| 8 | P0 connectivity | [684 Redundant Connection](../solutions/Coding-Answers.md#lc-684) · [LeetCode practice](https://leetcode.com/problems/redundant-connection/) | Union-find vs. traversal |
| 9 | P0 connectivity | [721 Accounts Merge](../solutions/Coding-Answers.md#lc-721) · [LeetCode practice](https://leetcode.com/problems/accounts-merge/) | Shared identifiers, representative mapping |
| 10 | P0 trees | [236 Lowest Common Ancestor of a Binary Tree](../solutions/Coding-Answers.md#lc-236) · [LeetCode practice](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | Node identity and missing-node variants |
| 11 | P0 trees | [297 Serialize and Deserialize Binary Tree](../solutions/Coding-Answers.md#lc-297) · [LeetCode practice](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Null markers and unambiguous grammar |
| 12 | P0 intervals | [56 Merge Intervals](../solutions/Coding-Answers.md#lc-56) · [LeetCode practice](https://leetcode.com/problems/merge-intervals/) | Define adjacency and endpoint semantics |
| 13 | P0 intervals | [729 My Calendar I](../solutions/Coding-Answers.md#lc-729) · [LeetCode practice](https://leetcode.com/problems/my-calendar-i/) | Online insertion and half-open ranges |
| 14 | P0 hashing | [49 Group Anagrams](../solutions/Coding-Answers.md#lc-49) · [LeetCode practice](https://leetcode.com/problems/group-anagrams/) | Model a word problem as canonical keys |
| 15 | P0 prefix sums | [560 Subarray Sum Equals K](../solutions/Coding-Answers.md#lc-560) · [LeetCode practice](https://leetcode.com/problems/subarray-sum-equals-k/) | Negative numbers break simple window logic |
| 16 | P1 window | [76 Minimum Window Substring](../solutions/Coding-Answers.md#lc-76) · [LeetCode practice](https://leetcode.com/problems/minimum-window-substring/) | Count multiplicity and shrink invariant |
| 17 | P1 heap | [23 Merge k Sorted Lists](../solutions/Coding-Answers.md#lc-23) · [LeetCode practice](https://leetcode.com/problems/merge-k-sorted-lists/) | Frontier heap size vs. total input size |
| 18 | P1 heap | [295 Find Median from Data Stream](../solutions/Coding-Answers.md#lc-295) · [LeetCode practice](https://leetcode.com/problems/find-median-from-data-stream/) | Partition and balance invariants |
| 19 | P1 greedy / heap | [1167 Minimum Cost to Connect Sticks](../solutions/Coding-Answers.md#lc-1167) · [LeetCode practice](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) | Optimal merge; Q4 is self-contained |
| 20 | P1 binary search | [410 Split Array Largest Sum](../solutions/Coding-Answers.md#lc-410) · [LeetCode practice](https://leetcode.com/problems/split-array-largest-sum/) | Feasibility relies on nonnegative numbers |
| 21 | P1 binary search | [875 Koko Eating Bananas](../solutions/Coding-Answers.md#lc-875) · [LeetCode practice](https://leetcode.com/problems/koko-eating-bananas/) | Lower/upper bound proof |
| 22 | P1 graph DP | [329 Longest Increasing Path in a Matrix](../solutions/Coding-Answers.md#lc-329) · [LeetCode practice](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | Strict ordering induces a DAG |
| 23 | P1 DP | [322 Coin Change](../solutions/Coding-Answers.md#lc-322) · [LeetCode practice](https://leetcode.com/problems/coin-change/) | State, recurrence, unreachable values |
| 24 | P1 DP | [300 Longest Increasing Subsequence](../solutions/Coding-Answers.md#lc-300) · [LeetCode practice](https://leetcode.com/problems/longest-increasing-subsequence/) | Tails array is not itself the sequence |
| 25 | P1 DP | [1143 Longest Common Subsequence](../solutions/Coding-Answers.md#lc-1143) · [LeetCode practice](https://leetcode.com/problems/longest-common-subsequence/) | Two-prefix state; reconstructing a solution |
| 26 | P1 backtracking | [22 Generate Parentheses](../solutions/Coding-Answers.md#lc-22) · [LeetCode practice](https://leetcode.com/problems/generate-parentheses/) | Prefix feasibility and output-sensitive cost |
| 27 | P1 trie / search | [212 Word Search II](../solutions/Coding-Answers.md#lc-212) · [LeetCode practice](https://leetcode.com/problems/word-search-ii/) | Trie pruning, visited-state restoration |
| 28 | P1 data structure | [146 LRU Cache](../solutions/Coding-Answers.md#lc-146) · [LeetCode practice](https://leetcode.com/problems/lru-cache/) | Map/list consistency under updates |
| 29 | P2 shortest paths | [787 Cheapest Flights Within K Stops](../solutions/Coding-Answers.md#lc-787) · [LeetCode practice](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Layered state; cost alone is insufficient |
| 30 | P2 weighted connectivity | [1631 Path With Minimum Effort](../solutions/Coding-Answers.md#lc-1631) · [LeetCode practice](https://leetcode.com/problems/path-with-minimum-effort/) | Minimax path vs. sum; Dijkstra or union-find |

Topological and 0–1 path themes have candidate support in G2/G3. G1 supplies analogous tree/Huffman and router-connectivity themes. The remaining breadth is our preparation recommendation. Premium availability may vary; use the local contracts for the two premium-style exercises.

## Q1. Infer an alien alphabet

**Evidence:** G3 describes a similar problem; exact interview rules are not available. **Our contract:** input is a dictionary sorted under an unknown alphabet; words contain lowercase English characters. Return any consistent ordering of all observed characters, or `null` for impossible input. Return `''` for an empty alphabet.

**Examples:** `['wrt','wrf','er','ett','rftt'] → 'wertf'`; `['abc','ab'] → null`; `['z','x','z'] → null`.

**Derivation:** For adjacent words, only the first differing character establishes a precedence edge. A longer word before its exact prefix is invalid. Deduplicate edges, then process zero-indegree characters with Kahn's algorithm.

```ts
function alienOrder(words: string[]): string | null {
  const edges = new Map<string, Set<string>>();
  const indegree = new Map<string, number>();
  for (const word of words) for (const ch of word) {
    if (!edges.has(ch)) { edges.set(ch, new Set()); indegree.set(ch, 0); }
  }
  for (let i = 1; i < words.length; i++) {
    const a = words[i - 1], b = words[i];
    let j = 0;
    while (j < Math.min(a.length, b.length) && a[j] === b[j]) j++;
    if (j === Math.min(a.length, b.length)) {
      if (a.length > b.length) return null;
    } else if (!edges.get(a[j])!.has(b[j])) {
      edges.get(a[j])!.add(b[j]);
      indegree.set(b[j], indegree.get(b[j])! + 1);
    }
  }
  const queue = [...indegree.keys()].filter(ch => indegree.get(ch) === 0);
  for (let head = 0; head < queue.length; head++) {
    for (const next of edges.get(queue[head])!) {
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  return queue.length === edges.size ? queue.join('') : null;
}
```

**Correctness:** Every emitted character has all required predecessors emitted. If unprocessed characters remain, their residual graph has a cycle. First-difference edges plus valid prefix ordering are sufficient to make all adjacent words nondecreasing.

**Complexity:** `O(S+V+E)` time, `O(V+E)` space, where `S` is total input characters. Tests should validate constraints rather than one exact order when several are valid.

**Follow-ups:** Lexicographically smallest output needs a min-heap of currently available symbols. A unique order requires exactly one available node at every step. Returning a cycle witness needs additional traversal. Unicode tokenization is outside this lowercase practice contract.

## Q2. Shortest paths with edge weights 0 or 1

**Evidence:** G2 mentions a 0–1 BFS variant. **Our contract:** adjacency list of a directed graph, valid vertex IDs, weights in `{0,1}`, valid source; return all minimum costs, using `Infinity` for unreachable vertices. Input is nonempty.

**Example:** edges `0→1(1), 0→2(0), 2→1(0), 1→3(1)` from 0 give `[0,0,0,1]`. Marking 1 permanently visited on its first discovery would be wrong.

```ts
function zeroOneDistances(
  graph: { to: number; weight: 0 | 1 }[][], source: number
): number[] {
  const distance = Array(graph.length).fill(Infinity) as number[];
  const settled = Array(graph.length).fill(false) as boolean[];
  const deque = new Map<number, { vertex: number; cost: number }>();
  let front = 0, back = 0;
  distance[source] = 0;
  deque.set(back++, { vertex: source, cost: 0 });
  while (front < back) {
    const { vertex, cost } = deque.get(front)!;
    deque.delete(front++);
    if (cost !== distance[vertex] || settled[vertex]) continue;
    settled[vertex] = true;
    for (const { to, weight } of graph[vertex]) {
      const next = cost + weight;
      if (next >= distance[to]) continue;
      distance[to] = next;
      const entry = { vertex: to, cost: next };
      if (weight === 0) deque.set(--front, entry);
      else deque.set(back++, entry);
    }
  }
  return distance;
}
```

**Correctness:** The deque processes candidate distances in nondecreasing order: zero-cost extensions go in front and one-cost extensions at the back. The first non-stale extraction finalizes the minimum distance; relaxation discovers every improving path. Stale entries are skipped.

**Complexity:** Expected `O(V+E)` time with constant-time map operations; `O(V+E)` auxiliary space including queued candidates. A production deque can replace the map; `Array.shift/unshift` is avoided. Edges with arbitrary positive weights require a priority queue; negative weights invalidate this finalization argument.

**Tests:** Zero-cost cycles, multiple improvements before extraction, disconnected vertex, all-one graph, self-loop, parallel edges. **Follow-up:** Store a parent on each strict improvement to reconstruct a path; counting shortest walks with zero-cost cycles needs a precise finite contract and cannot use a naive DAG count.

## Q3. First timestamp when everyone is connected

**Evidence:** G1 includes a router connectivity theme; this timestamp formulation is our own transfer exercise. **Contract:** `n >= 1` people labeled `0..n-1`; undirected logs `[time,a,b]` with nonnegative safe integer times, valid IDs. Return the earliest time all people are connected; for one person return 0; return `null` if it never happens. Do not mutate input.

**Example:** `n=4`, `[[8,2,3],[2,0,1],[5,1,2]] → 8`.

```ts
function earliestConnected(n: number, logs: [number, number, number][]): number | null {
  if (n === 1) return 0;
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = Array(n).fill(1) as number[];
  let components = n;
  function root(x: number): number {
    while (x !== parent[x]) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  for (const [time, a, b] of [...logs].sort((x, y) => x[0] - y[0])) {
    let ra = root(a), rb = root(b);
    if (ra === rb) continue;
    if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    size[ra] += size[rb];
    if (--components === 1) return time;
  }
  return null;
}
```

**Correctness:** After each timestamp's processed edges, disjoint sets represent exactly the connectivity induced so far. Connectivity only increases, so the first merge leaving one component gives the earliest valid timestamp. Same-time edges can be processed in any order because their answer timestamp is identical.

**Complexity:** `O(m log m + m α(n) + n)` time for `m` logs; `O(n+m)` space including copied logs. Tests: singleton, no logs, duplicate edges, self-links, equal times, disconnected graph, unsorted input.

**Follow-ups:** Directed reachability is a different problem. Edge deletions require recomputation or an offline/dynamic-connectivity technique; union-find alone cannot split a component. If logs are already sorted, omit sorting and process incrementally.

## Q4. Optimal merge cost with a min-heap

**Evidence:** G1 links a Huffman-like analogue. **Our contract:** repeatedly combine two nonnegative safe integer lengths; each merge costs their sum. Return the minimum total cost; empty/single input costs 0. All intermediate sums and the final cost must fit safe integers. This computes the merge cost, not a Huffman codebook.

**Example:** `[2,3,7] → 17`: merge 2+3 for 5, then 5+7 for 12. Merging 3+7 first costs 22 overall.

```ts
class NumberMinHeap {
  private data: number[] = [];
  get size(): number { return this.data.length; }
  push(value: number): void {
    this.data.push(value);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[p] <= this.data[i]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  pop(): number {
    if (!this.data.length) throw new Error('Empty heap');
    const result = this.data[0], last = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = last;
      let i = 0;
      while (2 * i + 1 < this.data.length) {
        let child = 2 * i + 1;
        if (child + 1 < this.data.length && this.data[child + 1] < this.data[child]) child++;
        if (this.data[i] <= this.data[child]) break;
        [this.data[i], this.data[child]] = [this.data[child], this.data[i]];
        i = child;
      }
    }
    return result;
  }
}

function optimalMergeCost(lengths: number[]): number {
  const heap = new NumberMinHeap();
  for (const length of lengths) heap.push(length);
  let total = 0;
  while (heap.size > 1) {
    const combined = heap.pop() + heap.pop();
    total += combined;
    heap.push(combined);
  }
  return total;
}
```

**Greedy argument:** In a binary merge tree, a leaf contributes its weight once per ancestor. An exchange argument puts the two smallest weights at deepest sibling leaves without increasing cost. Contract those siblings into their sum and repeat on the smaller problem. The heap efficiently implements this choice.

**Complexity:** `O(n log n)` time and `O(n)` space. Tests: empty, singleton, zeros, equal weights, highly uneven weights. **Follow-ups:** Store child pointers to build the merge tree; define a deterministic tie rule if exact codes matter. A sorted input can use two queues in linear time. With three-way merges or constraints on merge order, revisit the proof and contract.

## Live-coding routine

For a 45-minute mock: 5 minutes clarify/examples; 7 baseline/model/invariant; 20 implementation; 8 tests; 5 complexity/follow-up. This is a practice budget. Explain why the data structure fits before implementing it.

For each problem, change one condition after the first solution: directed edges, deletions, duplicate constraints, larger numeric range, online arrivals, or returning the actual path. Identify whether the old invariant survives before changing the code. Use the [shared rubric](../../handbook/Agoda-Google-Preparation-Strategy.md) to record concrete misses.

## October additions: recent themes and deliberate transfer practice

The [October 13 India report](https://www.reddit.com/r/LeetcodeDesi/comments/1x56nee/google_l5_chances_with_lh_in_system_design_india/) reports union-find, robot/factory-like DP, BFS → Dijkstra and tests/code review. The [April full-stack report's author comments](https://www.reddit.com/r/LeetcodeDesi/comments/1slxvll/cleared_google_l5_india_team_matching_taking_time/) add DP, linked list + hash map, and tree categories. Neither supplies exact coding statements. Prioritize these alongside the original bank; do not memorize them as predictions.

| # | Priority | Practice link | Why and what to explain |
| --- | --- | --- | --- |
| 31 | P0 DP | [2463 Minimum Total Distance Traveled](../solutions/Coding-Answers.md#lc-2463) · [LeetCode practice](https://leetcode.com/problems/minimum-total-distance-traveled/) | G6 analogy; Q5 below: capacities defeat naive nearest-factory assignment |
| 32 | P0 DSU | [1319 Number of Operations to Make Network Connected](../solutions/Coding-Answers.md#lc-1319) · [LeetCode practice](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Transfer from connectivity; count components and distinguish redundant cables from missing edges |
| 33 | P1 DSU | [947 Most Stones Removed with Same Row or Column](../solutions/Coding-Answers.md#lc-947) · [LeetCode practice](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) | Model shared attributes as connectivity; proof for stones minus components |
| 34 | P1 weighted paths | [1514 Path with Maximum Probability](../solutions/Coding-Answers.md#lc-1514) · [LeetCode practice](https://leetcode.com/problems/path-with-maximum-probability/) | Transfer: max-product relaxation; explain assumptions for finalization |
| 35 | P0 pointers + map | [138 Copy List with Random Pointer](../solutions/Coding-Answers.md#lc-138) · [LeetCode practice](https://leetcode.com/problems/copy-list-with-random-pointer/) | G8 category analogue; map node identity, not value; prove no original links remain |
| 36 | P1 pointers | [143 Reorder List](../solutions/Coding-Answers.md#lc-143) · [LeetCode practice](https://leetcode.com/problems/reorder-list/) | Breadth: split, reverse, merge; odd/even length, avoid cycles |
| 37 | P1 tree | [124 Binary Tree Maximum Path Sum](../solutions/Coding-Answers.md#lc-124) · [LeetCode practice](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | G8 category analogue; distinguish upward contribution from completed path; all-negative input |
| 38 | P1 heap | [347 Top K Frequent Elements](../solutions/Coding-Answers.md#lc-347) · [LeetCode practice](https://leetcode.com/problems/top-k-frequent-elements/) | Transfer to dashboard thinking; grouped frequencies differ from largest individual events |

Already in the bank: #7 Network Delay Time, #8–9 connectivity, #10–11 trees, #28 LRU. Repeat these with new constraints instead of counting them as new questions.

## Q5. Capacity-constrained assignment on a line

**Evidence:** G6 says its DP resembled robot/factory, without remembering the exact question. This is our static assignment exercise, closely related to [LC 2463](https://leetcode.com/problems/minimum-total-distance-traveled/), not a recovered interview statement.

**Contract:** Given robot positions and factories `[position, capacity]` on a line, assign every robot to a factory, minimizing total absolute distance without exceeding capacities. Input arrays are not mutated. Empty robots cost 0; insufficient capacity returns `null`. Capacities are nonnegative integers. Coordinates and all finite accumulated costs fit JavaScript safe integers. The implementation assumes valid inputs.

**Example:** robots `[1,5,9]`, factories `[[2,1],[8,2]]` → `5`: distances `1+3+1`. A nearest-available greedy algorithm can fail: robots `[4,5]`, factories `[[0,1],[6,1]]`; assigning robot 4 to factory 6 first costs `2+5=7`, while the optimum costs `4+1=5`.

**Derive before coding:**

1. Brute force assigns each robot to each available factory: up to `m^n` choices.
2. Sort both sides. For robots `a <= b` and factories `x <= y`, `|a-x|+|b-y| <= |a-y|+|b-x|`. Uncrossing assignments never increases cost and preserves capacity use. Therefore an optimum assigns consecutive groups of sorted robots to sorted factories.
3. Let `previous[i]` be minimum cost to assign the first `i` robots using factories already processed. Initially only `previous[0]=0` is feasible.
4. For factory `(p,c)`, either skip it or give it the last `k` robots of this prefix: `next[i] = min(previous[i-k] + sum(abs(robot[t]-p), t=i-k..i-1))`, for `0 <= k <= min(c,i)`.
5. Use a fresh row. Reading partially updated values from this factory's row could reuse its capacity incorrectly.

```ts
function minimumAssignmentDistance(
  robots: number[], factories: [number, number][]
): number | null {
  const ordered = [...robots].sort((a, b) => a - b);
  const sites = [...factories].sort((a, b) => a[0] - b[0]);
  const n = ordered.length;
  let previous = Array(n + 1).fill(Infinity) as number[];
  previous[0] = 0;
  for (const [position, capacity] of sites) {
    const next = [...previous]; // k = 0: skip this factory
    for (let i = 1; i <= n; i++) {
      let extra = 0;
      for (let k = 1; k <= Math.min(capacity, i); k++) {
        extra += Math.abs(ordered[i - k] - position);
        next[i] = Math.min(next[i], previous[i - k] + extra);
      }
    }
    previous = next;
  }
  return previous[n] === Infinity ? null : previous[n];
}
```

**Trace:** For `[1,5,9]`, row after factory `(2,1)` is `[0,1,Infinity,Infinity]`. After `(8,2)` it is `[0,1,4,5]`. The last cell gives 5.

**Correctness:** The uncrossing argument makes contiguous groups sufficient. Each transition enumerates every allowed size of the current factory's final group and combines it with an optimal earlier prefix. Induction over factories proves every row; unreachable prefixes stay infinite.

**Complexity:** With `n` robots, `m` factories and `C=min(n,max capacity)`, time `O(n log n + m log m + mnC)`, worst-case `O(mn²)` after sorting. Space `O(n+m)` including sorted copies and rolling rows. Do not call this exponential just because the inner loop tries multiple group sizes.

**Tests:** Empty sides; zero-capacity sites; insufficient capacity; negative coordinates; robot at factory; equal positions under our contract; a far-away spare factory; input order and immutability; greedy counterexample.

**Follow-ups:** Return assignments by storing predecessor choices in `O(mn)` space. Larger capacities are capped at `n`. For faster transitions define distance prefix `P[i]` for a factory: `next[i]=P[i]+min(previous[j]-P[j])` over `j in [max(0,i-c),i]`; a monotone deque gives `O(n)` per factory. Explain that derivation before implementing it. Arbitrary travel costs or a 2-D geometry need not satisfy uncrossing; the prefix DP may fail. For threading, factories depend on earlier rows; cells within one row can be independently computed from the immutable previous row, but synchronization and overhead may outweigh the benefit.

## Q6. A route planner changes from hop count to travel cost

**Evidence:** G6 reports BFS followed by Dijkstra, then testing and review. The contract and examples below are our own drill.

**Base prompt:** Directed adjacency list, valid vertices, source and destination; every edge takes one step. Return minimum steps, `0` for the same vertex, `null` if unreachable. Explain BFS layers, mark seen on enqueue, use a head-index queue. Time `O(V+E)`, auxiliary space `O(V)`.

**Changed requirement:** Each edge now has a nonnegative integer cost. Return minimum total cost to every vertex, `Infinity` for unreachable vertices. Costs and sums fit safe integers. Why does BFS fail? For `0→1(9), 0→2(2), 2→1(1)`, one-hop discovery of 1 costs 9 while its optimum is 3. Edge weights in `{0,1}` admit Q2's deque; general nonnegative weights admit Dijkstra. Negative edges invalidate Dijkstra's finalization proof.

```ts
function weightedDistances(
  graph: { to: number; weight: number }[][], source: number
): number[] {
  const distance = Array(graph.length).fill(Infinity) as number[];
  const heap: { vertex: number; cost: number }[] = [];
  function push(entry: { vertex: number; cost: number }): void {
    heap.push(entry);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p].cost <= heap[i].cost) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }
  function pop(): { vertex: number; cost: number } {
    const first = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      while (2 * i + 1 < heap.length) {
        let child = 2 * i + 1;
        if (child + 1 < heap.length && heap[child + 1].cost < heap[child].cost) child++;
        if (heap[i].cost <= heap[child].cost) break;
        [heap[i], heap[child]] = [heap[child], heap[i]];
        i = child;
      }
    }
    return first;
  }
  distance[source] = 0;
  push({ vertex: source, cost: 0 });
  while (heap.length) {
    const { vertex, cost } = pop();
    if (cost !== distance[vertex]) continue;
    for (const { to, weight } of graph[vertex]) {
      const candidate = cost + weight;
      if (candidate >= distance[to]) continue;
      distance[to] = candidate;
      push({ vertex: to, cost: candidate });
    }
  }
  return distance;
}
```

**Correctness:** At each non-stale minimum extraction, an undiscovered route cannot improve this distance: reaching it through an unsettled vertex adds only nonnegative cost. Relaxation considers all outgoing edges, and obsolete heap entries are ignored. Use strict improvements so zero-cost cycles do not endlessly enqueue ties.

**Complexity:** Lazy duplicate entries can use `O(E)` heap space. Time `O(V + E log(E+2))`, auxiliary space `O(V+E)`; for simple graphs this is commonly expressed as `O((V+E) log V)`. An indexed decrease-key heap bounds heap occupancy by `V`. Do not claim an `O(V)` heap for this implementation.

**Adversarial tests:** The example above yields `[0,3,2]`; add disconnected vertex 3 → `[0,3,2,Infinity]`. Test a zero-cost cycle, self-loop, parallel edges, equal alternatives, stale entries, single vertex, large safe costs, and source with no outgoing edges.

**Review checklist:** Is the heap ordered by cost? Is graph direction correct? Is staleness checked? Is equality excluded from relaxation? Is reachability explicit? Are input assumptions clear? For a single target, stop only when the target is popped with its current minimum cost, not when first discovered. To return a route, record parents on strict improvement. Parallel relaxation needs coordinated minimum updates and termination logic; adding workers alone does not preserve the proof.

## October 16 additions: changing requirements and implementation

[Reddit L5 report (G9)](https://www.reddit.com/r/OfferEngineering/comments/1v6bivx/passed_google_l5_none_of_the_questions_were/) supplies dispatcher, grid, and board-game themes. It is an anonymized repost, with no location or complete specifications. [Mockd Google cases (M1)](https://mockd.fyi/?q=google) supply two fundamentals; the accessible SWE case is a **demo**, with no L5 claim. The contracts, examples, code and follow-ups below are original practice material.

| # | Priority / drill | Worked solution | Gap addressed |
| --- | --- | --- | --- |
| 39 | P0 priority dispatch with category cooldown | [Q7](#bank-39) | Priority among eligible categories; release timing and idle slots |
| 40 | P0 top-to-bottom grid paths | [Q8](#bank-40) | Reachability → every simple path → cheapest path; extends Q6 |
| 41 | P0 multiplayer N×N board | [Q9](#bank-41) | Stateful API, validation, constant-time win checks |
| 42 | P1 warm-up: Two Sum | [Q10](#bank-42) | Mockd SWE demo; complement lookup and duplicate values |
| 43 | P1 warm-up: reverse a linked list | [Q11](#bank-43) | Mockd SWE demo; iterative and recursive pointer invariants |

For a 45-minute L5 mock, use Q7, Q8 or Q9 as the main exercise; Q10–Q11 are warm-ups. Practice the changed requirement only after stating and testing the base contract. See the design workbook's sections 6–7 for promotional offers and the optional SRE log-system drill. Mockd's PM demo is outside this SWE guide.

<a id="bank-39"></a>

## Q7. Priority dispatcher with category cooldown

**Evidence:** G9 reports priority dispatch followed by a category cooldown. **Clarify:** Higher or lower number first? Can tasks arrive later? Does cooldown count successful dispatches or elapsed slots? May we idle? What breaks ties?

**Our contract:** All tasks are available initially, IDs are unique, priorities are finite numbers, and larger priority wins. Equal priorities use input order. After dispatch at slot `t`, that category is blocked for slots `t+1..t+k`; idle slots count. Return `{slot,id}` entries without materializing idle slots. `k` is a nonnegative safe integer, and all slot arithmetic fits safe integers. This simulates the required priority policy; it does not optimize makespan.

**Example:** `[(a,A,9),(b,A,8),(c,B,7)]`, `k=2` → `[(0,a),(1,c),(3,b)]`. At slot 1, `b` is blocked despite its higher priority.

**Derivation:** A scan over pending tasks at each dispatch is an `O(n²)` baseline. Sort each category's tasks; only its best remaining task can win globally. Keep one entry per eligible category in a priority heap. After dispatch, move that category to a release queue. A fixed cooldown makes release times monotonic, so a head-index FIFO suffices. Jump to the next release when nothing is ready.

```ts
class PracticeHeap<T> {
  private data: T[] = [];
  private before: (a: T, b: T) => boolean;
  constructor(before: (a: T, b: T) => boolean) { this.before = before; }
  get size(): number { return this.data.length; }
  push(value: T): void {
    this.data.push(value);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.before(this.data[i], this.data[p])) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  pop(): T {
    if (!this.size) throw new Error('Empty heap');
    const first = this.data[0], last = this.data.pop()!;
    if (this.size) {
      this.data[0] = last;
      let i = 0;
      while (2 * i + 1 < this.size) {
        let child = 2 * i + 1;
        if (child + 1 < this.size && this.before(this.data[child + 1], this.data[child])) child++;
        if (!this.before(this.data[child], this.data[i])) break;
        [this.data[i], this.data[child]] = [this.data[child], this.data[i]];
        i = child;
      }
    }
    return first;
  }
}

type DispatchTask = { id: string; category: string; priority: number };
function dispatchTasks(tasks: DispatchTask[], cooldown: number): { slot: number; id: string }[] {
  if (!Number.isSafeInteger(cooldown) || cooldown < 0) throw new Error('Invalid cooldown');
  type Entry = DispatchTask & { order: number };
  const groups = new Map<string, Entry[]>(), positions = new Map<string, number>();
  const before = (a: Entry, b: Entry): boolean =>
    a.priority > b.priority || (a.priority === b.priority && a.order < b.order);
  tasks.forEach((task, order) => {
    if (!groups.has(task.category)) groups.set(task.category, []);
    groups.get(task.category)!.push({ ...task, order });
  });
  const ready = new PracticeHeap<Entry>(before);
  for (const [category, group] of groups) {
    group.sort((a, b) => b.priority - a.priority || a.order - b.order);
    positions.set(category, 0);
    ready.push(group[0]);
  }
  const blocked: { release: number; entry: Entry }[] = [];
  const output: { slot: number; id: string }[] = [];
  let head = 0, slot = 0;
  while (ready.size || head < blocked.length) {
    if (!ready.size) slot = Math.max(slot, blocked[head].release);
    while (head < blocked.length && blocked[head].release <= slot) ready.push(blocked[head++].entry);
    const task = ready.pop();
    output.push({ slot, id: task.id });
    const next = positions.get(task.category)! + 1;
    positions.set(task.category, next);
    const group = groups.get(task.category)!;
    if (next < group.length) blocked.push({ release: slot + cooldown + 1, entry: group[next] });
    slot++;
  }
  return output;
}
```

**Correctness:** Exactly one best pending task represents each ready category; every other pending category is blocked. Releasing all due entries before selection restores that invariant. The heap root is therefore the highest-priority eligible task. Dispatching removes it and blocks only its category. Jumping an idle interval cannot skip an eligible task.

**Complexity:** `O(n log(n+1))` time including sorting, `O(n)` auxiliary space plus `O(n)` output. This head-index queue retains consumed entries; do not claim `O(categories)` storage for the implementation. Large cooldowns do not add iteration cost.

**Tests / L5 follow-ups:** Empty input, zero cooldown, one category, ties, negative priorities, and cooldown larger than task count. For per-category cooldowns replace the FIFO with a release-time heap. For online arrivals use category heaps and carefully invalidate outdated ready entries. If only successful operations advance cooldown, all categories can become blocked forever; specify deadlock behavior. Discuss starvation under an unbounded stream of high-priority tasks.

<a id="bank-40"></a>

## Q8. Top-to-bottom grid: existence, all paths, cheapest route

**Evidence:** G9 supplies this follow-up ladder; Q6 already covers general weighted shortest paths. **Clarify:** Four directions or downward only? Obstacles? May a cell repeat? Cost of entering a cell or traversing an edge? Is the starting cell charged?

**Our contract:** A rectangular matrix has `null` obstacles and nonnegative integer cell costs. Start at any open top-row cell; finish on the first bottom-row cell reached. Move up/down/left/right. Include the starting cell's cost; sums fit safe integers. Empty grids have no route. Enumerate **simple paths** (no repeated cells); unrestricted walks can be infinite. Use flattened cell IDs `r * columns + c` in outputs. Any minimum-cost route is acceptable.

**Example:** `[[1,null],[2,3]]` has path `[0,2]`, cost 3. `[[9,1],[1,1]]` has a cheapest route `[1,3]`, cost 2. In a one-row grid every open cell is a complete path by itself.

```ts
function gridModel(grid: (number | null)[][]): {
  graph: { to: number; weight: number }[][]; starts: number[]; bottom: Set<number>;
} {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  const graph: { to: number; weight: number }[][] = Array.from({ length: rows * cols }, () => []);
  const starts: number[] = [], bottom = new Set<number>();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] === null) continue;
    const id = r * cols + c;
    if (r === 0) starts.push(id);
    if (r === rows - 1) bottom.add(id);
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== null)
        graph[id].push({ to: nr * cols + nc, weight: grid[nr][nc]! });
    }
  }
  return { graph, starts, bottom };
}
function hasGridRoute(grid: (number | null)[][]): boolean {
  const { graph, starts, bottom } = gridModel(grid);
  const queue = [...starts], seen = new Set(starts);
  for (let head = 0; head < queue.length; head++) {
    const id = queue[head];
    if (bottom.has(id)) return true;
    for (const { to } of graph[id]) if (!seen.has(to)) { seen.add(to); queue.push(to); }
  }
  return false;
}
function allGridRoutes(grid: (number | null)[][]): number[][] {
  const { graph, starts, bottom } = gridModel(grid);
  const output: number[][] = [], path: number[] = [], onPath = new Set<number>();
  function visit(id: number): void {
    onPath.add(id); path.push(id);
    if (bottom.has(id)) output.push([...path]);
    else for (const { to } of graph[id]) if (!onPath.has(to)) visit(to);
    path.pop(); onPath.delete(id);
  }
  for (const start of starts) visit(start);
  return output;
}
function cheapestGridRoute(grid: (number | null)[][]): { cost: number; path: number[] } | null {
  const { graph, starts, bottom } = gridModel(grid);
  if (!starts.length || !bottom.size) return null;
  // A virtual source charges each starting cell once. Reuse Q6's Dijkstra.
  const source = graph.length;
  graph.push(starts.map(to => ({ to, weight: grid[0][to]! })));
  const distance = weightedDistances(graph, source);
  let target = -1;
  for (const id of bottom) if (distance[id] < (target < 0 ? Infinity : distance[target])) target = id;
  if (target < 0) return null;
  // Recover a path using only tight edges. BFS visitation prevents zero-cost cycles.
  const queue = [source], parent = new Map<number, number>([[source, -1]]);
  for (let head = 0; head < queue.length && !parent.has(target); head++) {
    const id = queue[head];
    for (const { to, weight } of graph[id]) {
      if (!parent.has(to) && distance[id] + weight === distance[to]) {
        parent.set(to, id); queue.push(to);
      }
    }
  }
  const path: number[] = [];
  for (let id = target; id !== source; id = parent.get(id)!) path.push(id);
  path.reverse();
  // Stop at the first bottom cell if an equally cheap zero-cost suffix exists.
  const firstBottom = path.findIndex(id => bottom.has(id));
  return { cost: distance[target], path: path.slice(0, firstBottom + 1) };
}
```

**Correctness:** Multi-source BFS visits exactly the reachable cells. Enumeration uses path-local membership and undoes it after every branch, so it visits every legal simple path without suppressing shared cells across different paths. Dijkstra on the virtual-source graph minimizes the sum of cell costs. Tight edges satisfy `distance[u]+cost(v)=distance[v]`; a recovered tight path telescopes to the optimum. If it touches the bottom earlier, that prefix has the same optimum cost because the selected bottom distance is globally minimal and costs are nonnegative.

**Complexity:** With `V=rows×columns`, the grid has `O(V)` edges. Existence: `O(V)` time/space. Cheapest route: `O(V log(V+1))` time, `O(V)` space. Enumeration: `O(V+S+L)` time, where `S` counts explored simple-path prefixes (including dead ends), and `L` is total returned path length; `O(V)` auxiliary space plus `O(L)` output. `S` can be exponential even with few successful paths. Recursion depth is `O(V)`; use an explicit stack for large grids.

**Tests / L5 follow-ups:** Empty/all-blocked grids, one row, disconnected bottom, zero-cost cycles, two routes sharing a cell, and a longer route cheaper than a shorter one. Stream enumeration with a generator to avoid storing all output; impose a path/result limit for practical use. Down/right-only movement creates a DAG and permits DP; negative costs need a different shortest-path contract. Do not use one global visited set when enumerating paths.

<a id="bank-41"></a>

## Q9. Multiplayer N×N board with constant-time win detection

**Evidence:** G9 reports an N×N multiplayer board and avoiding a full scan after each move; exact win rules are unspecified. **Our contract:** At least two distinct named players alternate cyclically. A player wins by filling one entire row, column, or either full-length diagonal on an `N×N` board. `N>=1`; reject out-of-turn, occupied, out-of-bounds and post-game moves without changing state. Return winner, draw or next player.

**Derivation:** Scanning the whole board costs `O(N²)` per move; checking only the changed lines costs `O(N)`. Instead count occupied cells per player per line. A legal move touches at most four lines. Signed two-player sums do not generalize to arbitrary players; use player-specific counts.

```ts
class MultiplayerBoard {
  private players: string[];
  private occupied = new Set<string>();
  private counts = new Map<string, Map<string, number>>();
  private turn = 0;
  private over = false;
  private n: number;
  constructor(n: number, players: string[]) {
    this.n = n;
    if (!Number.isSafeInteger(n) || n < 1 || players.length < 2 || new Set(players).size !== players.length)
      throw new Error('Invalid board or players');
    this.players = [...players];
    for (const player of players) this.counts.set(player, new Map());
  }
  move(player: string, row: number, col: number):
    { winner: string | null; draw: boolean; next: string | null } {
    const cell = `${row},${col}`;
    if (this.over || player !== this.players[this.turn] || !Number.isInteger(row) || !Number.isInteger(col)
        || row < 0 || row >= this.n || col < 0 || col >= this.n || this.occupied.has(cell))
      throw new Error('Illegal move');
    this.occupied.add(cell);
    const lines = [`r${row}`, `c${col}`];
    if (row === col) lines.push('diagonal');
    if (row + col === this.n - 1) lines.push('anti-diagonal');
    const counts = this.counts.get(player)!;
    let won = false;
    for (const line of lines) {
      const count = (counts.get(line) ?? 0) + 1;
      counts.set(line, count);
      if (count === this.n) won = true;
    }
    const draw = !won && this.occupied.size === this.n * this.n;
    this.over = won || draw;
    if (!this.over) this.turn = (this.turn + 1) % this.players.length;
    return { winner: won ? player : null, draw, next: this.over ? null : this.players[this.turn] };
  }
}
```

**Correctness:** Each counter equals that player's legal occupied cells in one line. Unique occupancy prevents double counting. Only lines through the new cell can become complete, and their counts equal `N` exactly when that player fills the line. Validate before mutation, then stop the game on victory or draw.

**Complexity:** Expected `O(1)` per move using maps/sets (bounded-size coordinate keys); `O(P+m)` space after `m` moves for `P` players, at most `O(P+N²)`. Sparse counters avoid allocating `P×N` arrays. **Tests / follow-ups:** `N=1`, three players, every winning direction, draw, duplicate and invalid moves, caller mutation of the player array. For `K<N` contiguous wins, counts alone are insufficient: scan outward from the move in four directions in `O(K)` or maintain directional segments. Undo needs move history and terminal-state restoration; concurrent moves need authoritative sequencing.

<a id="bank-42"></a>
<a id="bank-43"></a>

## Q10–Q11. Mockd SWE demo warm-ups: Two Sum and linked-list reversal

**Evidence:** [M1 SWE demo](https://mockd.fyi/case/seed_1), no seniority given. These are fundamentals for fluency, not additional verified L5 reports.

**Q10 contract:** Given safe integers and a safe integer target (all differences also safe), return any two distinct indices summing to target, or `null`. Input need not be sorted. Baseline checks every pair in `O(n²)`; retain earlier values in a map for expected `O(n)` time and `O(n)` space. Look up before inserting so one element cannot match itself. `[3,3],6 → [0,1]`.

**Q11 contract:** Reverse an acyclic singly linked list in place and return its new head; empty returns `null`. Implement both forms and account for the recursive stack. `1→2→3 → 3→2→1`.

```ts
function twoSumIndices(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const prior = seen.get(target - nums[i]);
    if (prior !== undefined) return [prior, i];
    seen.set(nums[i], i);
  }
  return null;
}
type PracticeListNode = { value: number; next: PracticeListNode | null };
function reverseListIterative(head: PracticeListNode | null): PracticeListNode | null {
  let previous: PracticeListNode | null = null;
  while (head) {
    const next = head.next;
    head.next = previous;
    previous = head;
    head = next;
  }
  return previous;
}
function reverseListRecursive(head: PracticeListNode | null): PracticeListNode | null {
  if (!head || !head.next) return head;
  const result = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return result;
}
```

**Correctness:** Two Sum's map contains only earlier indices; a hit is a distinct valid pair, and the later endpoint of any solution will find its complement. Iterative reversal maintains a reversed processed prefix and an untouched remaining suffix, saving the next pointer before rewiring. Recursive reversal reverses the suffix, attaches the old head to its tail, and clears the old forward edge to prevent a cycle.

**Complexity / tests:** Both reversals take `O(n)` time; iterative auxiliary space is `O(1)`, recursive is `O(n)` and can overflow the runtime stack. Test null, singleton, repeated values, and node identity, not just values. For Two Sum test empty, no pair, negatives, repeated values and an answer using index 0. Follow-ups: sorted input permits two pointers; returning all pairs can require quadratic output. A cyclic list requires a different contract or cycle detection before reversal.

## DSU follow-ups to pair with Q3

- **Online insertions:** Union immediately; avoid sorting only when chronological order is guaranteed. With path compression and size/rank, operations take amortized `O(α(V))` after setup; Q3's sorting cost still dominates unsorted logs.
- **Deletion:** Ordinary union-find cannot split a component. For small workloads, rebuild/traverse after a removal; deletion-only offline workloads can sometimes reverse time; general offline additions/deletions can use a segment tree over edge lifetimes with rollback DSU, typically without path compression. State the workload before choosing.
- **Actual route:** Connectivity alone loses the path. Keep graph edges and run BFS/DFS when a route is required.
- **Scaling:** Describe memory (`O(V)` DSU state plus logs), external sorting if logs exceed RAM, and globally consistent component merging. Sharding by vertex does not make cross-shard connectivity independent.

## Explaining your approach under pressure

Use Understand → Match → Plan → Implement → Review → Evaluate. Say: “The constraint that changes my approach is __. My invariant is __. The baseline costs __; this approach costs __ because __.” If stuck, build the smallest counterexample and explain what failed. On a changed requirement, restate the new contract before modifying code. End with an actual trace, edge case, and final time/space costs.
