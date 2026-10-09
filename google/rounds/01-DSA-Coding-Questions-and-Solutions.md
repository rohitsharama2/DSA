# Google L5: DSA patterns and worked TypeScript

[Round-wise index](README.md) · [Evidence G1–G5](Research-Sources.md) · [Study strategy](../../handbook/Agoda-Google-Preparation-Strategy.md)

**Updated October 9, 2026.** P0 means first, P1 broadens coverage, P2 stretches a mastered pattern. These are study priorities, not company-frequency rankings. The 30 linked problems are practice analogues/foundations; the original implementations below are not claimed to reproduce interview questions.

## Pattern-to-question bank

| # | Priority / pattern | Practice link | Interview reasoning / follow-up |
| --- | --- | --- | --- |
| 1 | P0 topological order | [210 Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Edge direction, duplicate constraints, cycles |
| 2 | P0 topological modeling | [269 Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) | First differing symbol, invalid prefix; Q1 is self-contained |
| 3 | P0 dependency propagation | [2115 Find All Possible Recipes](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) | Which nodes are initially available? |
| 4 | P0 BFS | [994 Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Multi-source distance, unreachable cells |
| 5 | P0 BFS | [127 Word Ladder](https://leetcode.com/problems/word-ladder/) | Neighbor generation and bidirectional search |
| 6 | P0 0–1 BFS | [1368 Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/) | Directed edge cost; deque vs. ordinary BFS |
| 7 | P0 shortest paths | [743 Network Delay Time](https://leetcode.com/problems/network-delay-time/) | Why nonnegative weights permit Dijkstra |
| 8 | P0 connectivity | [684 Redundant Connection](https://leetcode.com/problems/redundant-connection/) | Union-find vs. traversal |
| 9 | P0 connectivity | [721 Accounts Merge](https://leetcode.com/problems/accounts-merge/) | Shared identifiers, representative mapping |
| 10 | P0 trees | [236 Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | Node identity and missing-node variants |
| 11 | P0 trees | [297 Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | Null markers and unambiguous grammar |
| 12 | P0 intervals | [56 Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Define adjacency and endpoint semantics |
| 13 | P0 intervals | [729 My Calendar I](https://leetcode.com/problems/my-calendar-i/) | Online insertion and half-open ranges |
| 14 | P0 hashing | [49 Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Model a word problem as canonical keys |
| 15 | P0 prefix sums | [560 Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Negative numbers break simple window logic |
| 16 | P1 window | [76 Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Count multiplicity and shrink invariant |
| 17 | P1 heap | [23 Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Frontier heap size vs. total input size |
| 18 | P1 heap | [295 Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Partition and balance invariants |
| 19 | P1 greedy / heap | [1167 Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) | Optimal merge; Q4 is self-contained |
| 20 | P1 binary search | [410 Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | Feasibility relies on nonnegative numbers |
| 21 | P1 binary search | [875 Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Lower/upper bound proof |
| 22 | P1 graph DP | [329 Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | Strict ordering induces a DAG |
| 23 | P1 DP | [322 Coin Change](https://leetcode.com/problems/coin-change/) | State, recurrence, unreachable values |
| 24 | P1 DP | [300 Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Tails array is not itself the sequence |
| 25 | P1 DP | [1143 Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) | Two-prefix state; reconstructing a solution |
| 26 | P1 backtracking | [22 Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) | Prefix feasibility and output-sensitive cost |
| 27 | P1 trie / search | [212 Word Search II](https://leetcode.com/problems/word-search-ii/) | Trie pruning, visited-state restoration |
| 28 | P1 data structure | [146 LRU Cache](https://leetcode.com/problems/lru-cache/) | Map/list consistency under updates |
| 29 | P2 shortest paths | [787 Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | Layered state; cost alone is insufficient |
| 30 | P2 weighted connectivity | [1631 Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) | Minimax path vs. sum; Dijkstra or union-find |

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
