# Local coding answers: every linked Google coding problem

[All Google answers](README.md) · [General bank](../rounds/01-DSA-Coding-Questions-and-Solutions.md) · [Android Studio track](../android-studio-tech-lead/01-Coding-Track.md)

This page contains **44 complete JavaScript solutions**: all 38 externally linked problems in the general bank, plus six additional titles from the Android Studio track. The five remaining general-bank entries (#39–43) already have [local worked TypeScript solutions](../rounds/01-DSA-Coding-Questions-and-Solutions.md#october-16-additions-changing-requirements-and-implementation). The original Q1–Q11 drills and their different contracts remain available through the central index.

Each answer gives a self-contained practice contract, derivation/correctness argument, complexity, edge cases and follow-up before the code. LeetCode is optional for reading these answers. These are original implementations, not copied editorials or claimed exact interview questions.

**How to run:** Import the named export from [general-coding.mjs](general-coding.mjs) or [Android Studio coding-solutions.mjs](../android-studio-tech-lead/coding-solutions.mjs). Code blocks match the tested source. Heap/DSU solutions require the [shared helpers](#helpers) at the bottom if copied into a standalone editor. `export` can be removed when pasting into a platform editor. Tree/list nodes use `{val,left,right}` / `{val,next}` (and `random` where stated); adapt to platform-provided classes if needed. Assume the stated valid-input contracts, safe arithmetic and expected constant-time hash operations. Recursion stack counts as space.

```sh
node google/solutions/check-all.mjs
```

## Find your answer

| Problem | Local answer |
| --- | --- |
| 210 Course Schedule II | [Read explanation and code](#lc-210) |
| 269 Alien Dictionary | [Read explanation and code](#lc-269) |
| 2115 Find All Possible Recipes | [Read explanation and code](#lc-2115) |
| 994 Rotting Oranges | [Read explanation and code](#lc-994) |
| 127 Word Ladder | [Read explanation and code](#lc-127) |
| 1368 Minimum Cost to Make a Valid Grid Path | [Read explanation and code](#lc-1368) |
| 743 Network Delay Time | [Read explanation and code](#lc-743) |
| 684 Redundant Connection | [Read explanation and code](#lc-684) |
| 721 Accounts Merge | [Read explanation and code](#lc-721) |
| 236 Lowest Common Ancestor | [Read explanation and code](#lc-236) |
| 297 Serialize and Deserialize Binary Tree | [Read explanation and code](#lc-297) |
| 56 Merge Intervals | [Read explanation and code](#lc-56) |
| 729 My Calendar I | [Read explanation and code](#lc-729) |
| 49 Group Anagrams | [Read explanation and code](#lc-49) |
| 560 Subarray Sum Equals K | [Read explanation and code](#lc-560) |
| 76 Minimum Window Substring | [Read explanation and code](#lc-76) |
| 23 Merge k Sorted Lists | [Read explanation and code](#lc-23) |
| 295 Find Median from Data Stream | [Read explanation and code](#lc-295) |
| 1167 Minimum Cost to Connect Sticks | [Read explanation and code](#lc-1167) |
| 410 Split Array Largest Sum | [Read explanation and code](#lc-410) |
| 875 Koko Eating Bananas | [Read explanation and code](#lc-875) |
| 329 Longest Increasing Path in a Matrix | [Read explanation and code](#lc-329) |
| 322 Coin Change | [Read explanation and code](#lc-322) |
| 300 Longest Increasing Subsequence | [Read explanation and code](#lc-300) |
| 1143 Longest Common Subsequence | [Read explanation and code](#lc-1143) |
| 22 Generate Parentheses | [Read explanation and code](#lc-22) |
| 212 Word Search II | [Read explanation and code](#lc-212) |
| 146 LRU Cache | [Read explanation and code](#lc-146) |
| 787 Cheapest Flights Within K Stops | [Read explanation and code](#lc-787) |
| 1631 Path With Minimum Effort | [Read explanation and code](#lc-1631) |
| 2463 Minimum Total Distance Traveled | [Read explanation and code](#lc-2463) |
| 1319 Number of Operations to Make Network Connected | [Read explanation and code](#lc-1319) |
| 947 Most Stones Removed | [Read explanation and code](#lc-947) |
| 1514 Path With Maximum Probability | [Read explanation and code](#lc-1514) |
| 138 Copy List with Random Pointer | [Read explanation and code](#lc-138) |
| 143 Reorder List | [Read explanation and code](#lc-143) |
| 124 Binary Tree Maximum Path Sum | [Read explanation and code](#lc-124) |
| 347 Top K Frequent Elements | [Read explanation and code](#lc-347) |
| 207 Course Schedule | [Read explanation and code](#lc-207) |
| 239 Sliding Window Maximum | [Read explanation and code](#lc-239) |
| 33 Search in Rotated Sorted Array | [Read explanation and code](#lc-33) |
| 4 Median of Two Sorted Arrays | [Read explanation and code](#lc-4) |
| 139 Word Break | [Read explanation and code](#lc-139) |
| 72 Edit Distance | [Read explanation and code](#lc-72) |

<a id="lc-210"></a>

## 210. Course Schedule II

**Question / example:** Return any valid prerequisite order, or [] for a cycle. n=3, [[1,0],[2,0]] permits [0,1,2] or [0,2,1].

**Derivation and correctness:** Use the same Kahn traversal as 207 but return its output. Zero-indegree selection preserves every prerequisite constraint. Compare edges against returned positions instead of insisting on one order.

**Complexity:** O(V+E) time and space.

**Tests and follow-up:** For the lexicographically smallest result, use a min-heap for ready nodes. Empty n=0 returns [].

```js
// 210: same valid graph contract as 207; any order, or [] for a cycle.
export function findOrder(n, prerequisites) {
  const graph = Array.from({ length: n }, () => []), degree = Array(n).fill(0);
  for (const [course, prior] of prerequisites) { graph[prior].push(course); degree[course]++; }
  const order = [];
  for (let i = 0; i < n; i++) if (!degree[i]) order.push(i);
  for (let head = 0; head < order.length; head++) {
    for (const next of graph[order[head]]) if (--degree[next] === 0) order.push(next);
  }
  return order.length === n ? order : [];
}
```

<a id="lc-269"></a>

## 269. Alien Dictionary

**Question / example:** Infer any alphabet consistent with the sorted lowercase word list. ['wrt','wrf','er','ett','rftt'] → 'wertf'. Return '' if impossible or no symbols.

**Derivation and correctness:** Only the first differing characters of adjacent words impose an edge; later differences say nothing. Reject a longer word before its prefix, deduplicate edges, then topologically sort. These adjacent constraints are sufficient for dictionary order.

**Complexity:** O(S+V+E) time and O(V+E) auxiliary space; S total characters.

**Tests and follow-up:** Test ['abc','ab'], ['z','x','z'] and isolated characters. Shared TypeScript Q1 uses null for impossible instead: note the contract difference.

```js
// 269: lowercase English words; any valid character order; '' if impossible/empty.
export function alienOrder(words) {
  const edges = new Map(), degree = new Map();
  for (const word of words) for (const ch of word) {
    if (!edges.has(ch)) { edges.set(ch, new Set()); degree.set(ch, 0); }
  }
  for (let i = 1; i < words.length; i++) {
    const a = words[i - 1], b = words[i];
    let j = 0;
    while (j < Math.min(a.length, b.length) && a[j] === b[j]) j++;
    if (j === Math.min(a.length, b.length)) {
      if (a.length > b.length) return '';
    } else if (!edges.get(a[j]).has(b[j])) {
      edges.get(a[j]).add(b[j]); degree.set(b[j], degree.get(b[j]) + 1);
    }
  }
  const order = [...degree.keys()].filter(ch => degree.get(ch) === 0);
  for (let head = 0; head < order.length; head++) for (const next of edges.get(order[head])) {
    degree.set(next, degree.get(next) - 1);
    if (!degree.get(next)) order.push(next);
  }
  return order.length === edges.size ? order.join('') : '';
}
```

<a id="lc-2115"></a>

## 2115. Find All Possible Recipes

**Question / example:** Recipes have ingredient names and reusable supplies. bread needs flour, yeast; sandwich needs bread, ham. With all three supplies both become available.

**Derivation and correctness:** Repeatedly scanning every recipe is a baseline. Count missing unique ingredients, then propagate each newly available item to dependent recipes once. A zero count means every required ingredient has become available; unsupported cycles never unlock.

**Complexity:** O(R+I+S) expected time and space, including dependency lists; I ingredient occurrences.

**Tests and follow-up:** Test unsupported cycles, zero-ingredient recipes and repeated supplies. Supplies are availability, not quantities; consumable inventory is a different problem.

```js
// 2115: unique recipe names; ingredient lists; supplies are reusable, not consumed.
export function findAllRecipes(recipes, ingredients, supplies) {
  const waiting=new Map(), missing=Array(recipes.length).fill(0);
  ingredients.forEach((list,i)=>{ for(const item of new Set(list)) {
    if(!waiting.has(item))waiting.set(item,[]);
    waiting.get(item).push(i); missing[i]++;
  }});
  const available=new Set(supplies), queue=[...available];
  for(let i=0;i<recipes.length;i++)if(!missing[i]&&!available.has(recipes[i])) {
    available.add(recipes[i]);queue.push(recipes[i]);
  }
  for(let head=0;head<queue.length;head++)for(const i of waiting.get(queue[head])??[]) {
    if(--missing[i]===0&&!available.has(recipes[i])) { available.add(recipes[i]);queue.push(recipes[i]); }
  }
  return recipes.filter(name=>available.has(name));
}
```

<a id="lc-994"></a>

## 994. Rotting Oranges

**Question / example:** Grid 0 empty, 1 fresh, 2 rotten; each minute rot spreads orthogonally. Return minutes until all fresh rot or -1; copy input.

**Derivation and correctness:** Simulating full grids each minute repeats work. Multi-source BFS begins at every rotten cell at time 0. A first arrival is the earliest infection time; mark a fresh cell rotten on enqueue and count remaining fresh cells.

**Complexity:** O(RC) time and extra space including grid copy/queue.

**Tests and follow-up:** Test no fresh oranges, an isolated fresh cell and empty grid. Different edge times would require weighted shortest paths.

```js
// 994: rectangular grid of 0/1/2; returns minutes or -1. Does not mutate input.
export function orangesRotting(grid) {
  const a=grid.map(row=>[...row]), rows=a.length, cols=a[0]?.length??0, queue=[];
  let fresh=0, minutes=0;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) {
    if(a[r][c]===1)fresh++; else if(a[r][c]===2)queue.push([r,c,0]);
  }
  for(let head=0;head<queue.length;head++) {
    const [r,c,t]=queue[head];minutes=Math.max(minutes,t);
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&a[nr][nc]===1) {
        a[nr][nc]=2;fresh--;queue.push([nr,nc,t+1]);
      }
    }
  }
  return fresh?-1:minutes;
}
```

<a id="lc-127"></a>

## 127. Word Ladder

**Question / example:** Return the number of words in a shortest one-letter transformation, with intermediate/end words in the dictionary. hit→cog through hot,dot,dog,lot,log,cog gives 5. No route gives 0.

**Derivation and correctness:** A dictionary-wide comparison for every step is a baseline. Generate single-letter mutations and BFS from begin; first discovery has minimum edge count. Remove words on enqueue so multiple predecessors do not multiply work. begin=end returns 1 in our extension.

**Complexity:** O(N·A·L²) time with A=26 and O(L) JS string construction/hash; O(NL) dictionary/queue character storage.

**Tests and follow-up:** Test end missing and disconnected words. Bidirectional BFS reduces explored states; explain frontier direction and distance accounting before adding it.

```js
// 127: same-length lowercase English words. Number of words in route; 0 if none.
// Extension: begin === end returns 1 even if not in dictionary.
export function ladderLength(begin, end, wordList) {
  if (begin === end) return 1;
  const remaining = new Set(wordList);
  if (!remaining.has(end)) return 0;
  remaining.delete(begin);
  const queue = [[begin, 1]];
  for (let head = 0; head < queue.length; head++) {
    const [word, length] = queue[head];
    for (let i = 0; i < word.length; i++) for (let code = 97; code <= 122; code++) {
      const ch = String.fromCharCode(code);
      if (ch === word[i]) continue;
      const next = word.slice(0, i) + ch + word.slice(i + 1);
      if (!remaining.has(next)) continue;
      if (next === end) return length + 1;
      remaining.delete(next); // Mark at enqueue, not dequeue.
      queue.push([next, length + 1]);
    }
  }
  return 0;
}
```

<a id="lc-1368"></a>

## 1368. Minimum Cost to Make a Valid Grid Path

**Question / example:** Nonempty arrow grid: 1 right, 2 left, 3 down, 4 up. Minimum arrow changes to reach bottom-right from top-left; singleton costs 0.

**Derivation and correctness:** Treat following an arrow as cost 0 and any other departure as cost 1. A deque puts zero-cost relaxations at front and unit-cost ones at back, preserving nondecreasing distance extraction. A cheapest simple path never needs inconsistent changes at a reused cell.

**Complexity:** Expected O(V+E)=O(RC) time and O(RC) space using a map-backed deque and stale-entry checks.

**Tests and follow-up:** Test cycles of arrows, one row and paths where fewer moves cost more. For arbitrary nonnegative costs use a heap.

```js
// 1368: nonempty rectangle; arrows 1 right, 2 left, 3 down, 4 up. No mutation.
export function minGridCost(grid) {
  const rows=grid.length,cols=grid[0].length,dist=Array(rows*cols).fill(Infinity);
  const deque=new Map();let front=0,back=0;
  dist[0]=0;deque.set(back++,[0,0]);
  const moves=[[0,1],[0,-1],[1,0],[-1,0]];
  while(front<back) {
    const [id,cost]=deque.get(front);deque.delete(front++);
    if(cost!==dist[id])continue;
    if(id===dist.length-1)return cost;
    const r=Math.floor(id/cols),c=id%cols;
    moves.forEach(([dr,dc],i)=>{
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=rows||nc<0||nc>=cols)return;
      const to=nr*cols+nc,weight=grid[r][c]===i+1?0:1,next=cost+weight;
      if(next<dist[to]) {dist[to]=next;if(weight)deque.set(back++,[to,next]);else deque.set(--front,[to,next]);}
    });
  }
  return dist.at(-1);
}
```

<a id="lc-743"></a>

## 743. Network Delay Time

**Question / example:** Directed edges [from,to,cost], vertices 1..n, source k. [[2,1,1],[2,3,1],[3,4,1]],4,2 → 2; any unreachable vertex → -1.

**Derivation and correctness:** Repeated relaxation is a baseline. Dijkstra pops the smallest candidate distance; nonnegative costs prevent a later unsettled path from improving that settled minimum. Relax outgoing edges and skip stale candidates. Answer the maximum final distance.

**Complexity:** O(V+E log(E+2)) time and O(V+E) auxiliary space with lazy heap entries. Requires BinaryHeap.

**Tests and follow-up:** Test zero-cost cycles, parallel edges, stale entries and a singleton. A single-target variant may stop only on a current minimum extraction.

```js
// 743: n >= 1, vertices 1..n, times [from,to,nonnegativeWeight], valid source k.
// All sums safely representable. Requires BinaryHeap; returns -1 if unreachable.
export function networkDelayTime(times, n, k) {
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [from, to, weight] of times) graph[from].push([to, weight]);
  const distance = Array(n + 1).fill(Infinity);
  distance[k] = 0;
  const heap = new BinaryHeap((a, b) => a.cost < b.cost);
  heap.push({ vertex: k, cost: 0 });
  while (heap.size) {
    const { vertex, cost } = heap.pop();
    if (cost !== distance[vertex]) continue;
    for (const [to, weight] of graph[vertex]) {
      const next = cost + weight;
      if (next < distance[to]) { distance[to] = next; heap.push({ vertex: to, cost: next }); }
    }
  }
  let answer = 0;
  for (let vertex = 1; vertex <= n; vertex++) answer = Math.max(answer, distance[vertex]);
  return answer === Infinity ? -1 : answer;
}
```

<a id="lc-684"></a>

## 684. Redundant Connection

**Question / example:** Undirected tree on vertices 1..n plus one extra edge; return the redundant edge required by input order. [[1,2],[1,3],[2,3]] → [2,3].

**Derivation and correctness:** BFS connectivity before each insertion is a baseline. DSU tracks the components formed by previous edges. An edge with endpoints already connected closes a cycle; otherwise union joins components.

**Complexity:** O(n·α(n)) amortized time, O(n) space. Requires DSU below.

**Tests and follow-up:** This contract permits one extra edge. Directed edges need a different algorithm; DSU alone does not enforce indegrees or rooted-tree structure.

```js
// 684: undirected tree on 1..n plus one edge; return last redundant edge in order.
export function findRedundantConnection(edges) {
  const dsu=new DSU(edges.length+1);let answer=[];
  for(const [a,b] of edges)if(!dsu.union(a,b))answer=[a,b];
  return answer;
}
```

<a id="lc-721"></a>

## 721. Accounts Merge

**Question / example:** Accounts are [name,...emails]. Shared emails identify the same person; equal names alone do not. Names within a connected group are consistent.

**Derivation and correctness:** Build a graph or union account IDs sharing an email. Transitive unions capture all shared identifiers. Gather each unique email under its root and sort it. Isolated name-only accounts are preserved as separate entries in this extension.

**Complexity:** O(A+M·α(A)+U log U) time, O(A+U) auxiliary/output storage; M email occurrences, U unique emails.

**Tests and follow-up:** Test transitive overlap, identical names without overlap and duplicate emails. Output order is arbitrary; compare canonicalized groups.

```js
// 721: [name,...emails]; connected accounts have consistent names; output order arbitrary.
export function accountsMerge(accounts) {
  const dsu=new DSU(accounts.length),owner=new Map();
  accounts.forEach((account,i)=>{for(const email of account.slice(1)) {
    if(owner.has(email))dsu.union(i,owner.get(email));else owner.set(email,i);
  }});
  const groups=new Map();
  for(const [email,i] of owner) {
    const root=dsu.find(i);if(!groups.has(root))groups.set(root,[]);groups.get(root).push(email);
  }
  const result=[...groups].map(([root,emails])=>[accounts[root][0],...emails.sort()]);
  accounts.forEach(a=>{if(a.length===1)result.push([...a]);});
  return result;
}
```

<a id="lc-236"></a>

## 236. Lowest Common Ancestor

**Question / example:** For a proper binary tree, return the ancestor node object for two present target objects. A root with left p and right q returns the root.

**Derivation and correctness:** Repeatedly testing subtree membership is a baseline. A postorder result is null, a target or an already found ancestor. Two non-null child results prove a split; one result propagates upward. Compare object identity, never values.

**Complexity:** O(n) time and O(h) recursive stack, O(n) worst-case height.

**Tests and follow-up:** If a target may be absent, the simple early return is insufficient: return found counts or verify membership. Use an explicit stack/parent map for deep trees.

```js
// 236: proper binary tree, nodes {val,left,right}; p and q are present node objects.
// Returns the actual ancestor object; missing-node variants need additional checks.
export function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  return left && right ? root : left || right;
}
```

<a id="lc-297"></a>

## 297. Serialize and Deserialize Binary Tree

**Question / example:** Encode a finite-number binary tree using our JSON breadth-first sequence with explicit null children. Round-trip null and asymmetric trees.

**Derivation and correctness:** Value-only traversal loses shape. Emit each node plus both child positions; explicit nulls make reconstruction unambiguous. Decode the same breadth-first parent order, attaching children in left/right order. Input to deserialize must be an output of this serializer.

**Complexity:** O(n) time and O(n) queue/output space for bounded-size numeric encodings.

**Tests and follow-up:** Test duplicate values and right-only chains. Do not feed arbitrary malformed JSON/tree encodings without adding structural validation and resource limits.

```js
// 297: finite numeric values; proper binary tree {val,left,right}. Own JSON BFS format.
export function serialize(root) {
  const values=[],queue=[root];
  for(let head=0;head<queue.length;head++) {
    const node=queue[head];values.push(node?node.val:null);
    if(node)queue.push(node.left??null,node.right??null);
  }
  return JSON.stringify(values);
}
export function deserialize(text) {
  const values=JSON.parse(text);
  if(values[0]===null)return null;
  const root={val:values[0],left:null,right:null},queue=[root];let i=1;
  for(let head=0;head<queue.length;head++)for(const side of ['left','right']) {
    const value=values[i++];
    if(value!==null) { const node={val:value,left:null,right:null};queue[head][side]=node;queue.push(node); }
  }
  return root;
}
```

<a id="lc-56"></a>

## 56. Merge Intervals

**Question / example:** Merge closed intervals, so [1,3] and [3,5] merge to [1,5]. Do not mutate input.

**Derivation and correctness:** Repeated overlap merging is a baseline. Sort copied intervals by start; all future starts are no earlier than the current one. Extend the current end on overlap, otherwise finalize it because no later interval can bridge a gap before its start.

**Complexity:** O(n log n) time and O(n) copied storage/output; sorting storage is runtime-dependent.

**Tests and follow-up:** Test nesting, equal endpoints and empty input. Half-open booking semantics differ: touching bookings do not conflict.

```js
// 56: finite numeric closed intervals [start,end], start <= end; no input mutation.
export function mergeIntervals(intervals) {
  const sorted = intervals.map(pair => [...pair]).sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (!last || start > last[1]) merged.push([start, end]);
    else last[1] = Math.max(last[1], end);
  }
  return merged;
}
```

<a id="lc-729"></a>

## 729. My Calendar I

**Question / example:** Book half-open [start,end), start<end. [10,20) then [20,30) succeeds; [15,25) conflicts.

**Derivation and correctness:** Scanning all bookings is a baseline. Binary-search the insertion position among nonoverlapping sorted bookings. Only the predecessor and successor can overlap; if neither does, insertion preserves the invariant.

**Complexity:** O(log n) comparison search but O(n) insertion due to array shifts; O(n) stored events.

**Tests and follow-up:** Do not claim O(log n) booking for this array implementation. A balanced search tree can improve insertion; specify capacity and overlap policy for multi-booking variants.

```js
// 729: finite start < end; half-open [start,end); simple sorted-array implementation.
export class MyCalendar {
  constructor(){this.events=[];}
  book(start,end) {
    let lo=0,hi=this.events.length;
    while(lo<hi){const mid=Math.floor((lo+hi)/2);if(this.events[mid][0]<start)lo=mid+1;else hi=mid;}
    if(lo>0&&this.events[lo-1][1]>start)return false;
    if(lo<this.events.length&&end>this.events[lo][0])return false;
    this.events.splice(lo,0,[start,end]);return true;
  }
}
```

<a id="lc-49"></a>

## 49. Group Anagrams

**Question / example:** Group lowercase a-z words by character multiplicity. eat,tea,ate belong together; empty strings also group.

**Derivation and correctness:** Sorted-character keys cost O(L log L) per word. A 26-count vector with separators is a collision-free signature for lowercase multiplicities, so equal keys exactly characterize anagrams.

**Complexity:** O(total characters+26·W) time; O(26·G+W) extra references/keys plus output, G groups.

**Tests and follow-up:** Test repeated letters, empty words and multiple groups. Arbitrary Unicode requires a different normalization/alphabet contract.

```js
// 49: lowercase a-z strings; grouping/order arbitrary.
export function groupAnagrams(words) {
  const groups=new Map();
  for(const word of words) {
    const counts=Array(26).fill(0);for(const ch of word)counts[ch.charCodeAt(0)-97]++;
    const key=counts.join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(word);
  }
  return [...groups.values()];
}
```

<a id="lc-560"></a>

## 560. Subarray Sum Equals K

**Question / example:** Count contiguous subarrays summing to k, including negatives. [1,-1,0],0 → 3.

**Derivation and correctness:** Quadratic enumeration becomes a running prefix sum. A subarray ending now sums to k exactly when an earlier prefix equals current-k. Count earlier prefixes before inserting the current one; seed prefix zero once.

**Complexity:** Expected O(n) time and O(n) extra space.

**Tests and follow-up:** Test all zeros and negative values. A sliding window is invalid without monotonicity; answer and sums must fit safe integers.

```js
// 560: safe integer inputs, prefix sums and answer; supports negatives.
export function subarraySum(nums,k) {
  const seen=new Map([[0,1]]);let sum=0,count=0;
  for(const x of nums){sum+=x;count+=seen.get(sum-k)??0;seen.set(sum,(seen.get(sum)??0)+1);}
  return count;
}
```

<a id="lc-76"></a>

## 76. Minimum Window Substring

**Question / example:** Return the shortest substring containing every target character with multiplicity. ADOBECODEBANC and ABC → BANC; empty target or impossible → empty string.

**Derivation and correctness:** Enumerating substrings is a baseline. Keep the deficit count for required characters and total missing multiplicity. Expand until valid, then shrink while valid to find the shortest window ending at each right endpoint. Each pointer moves only forward.

**Complexity:** O(n+m) time and O(distinct target characters) auxiliary space, excluding returned substring.

**Tests and follow-up:** Test repeated target letters, no match, irrelevant letters and ties. Negative deficits represent surplus; the implementation keeps the earliest equal-length minimum.

```js
// 76: UTF-16 code units; return shortest covering substring, earliest on ties.
// Empty target or no covering substring => ''.
export function minWindow(s, t) {
  if (!t.length) return '';
  const need = new Map();
  for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) ?? 0) + 1);
  let missing = t.length, left = 0, bestStart = 0, bestLength = Infinity;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing--;
      need.set(ch, need.get(ch) - 1);
    }
    while (missing === 0) {
      if (right - left + 1 < bestLength) { bestStart = left; bestLength = right - left + 1; }
      const old = s[left++];
      if (need.has(old)) {
        need.set(old, need.get(old) + 1);
        if (need.get(old) > 0) missing++;
      }
    }
  }
  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}
```

<a id="lc-23"></a>

## 23. Merge k Sorted Lists

**Question / example:** Merge disjoint sorted acyclic lists, reusing their nodes. [1,4],[1,3],[2] → 1,1,2,3,4.

**Derivation and correctness:** Repeatedly scanning list heads costs O(Nk). Keep the smallest remaining node from each nonempty list in a min-heap. The global next node is among these heads; pop it and insert its successor.

**Complexity:** O(k+N log(k+1)) time, O(k) auxiliary heap space, nodes reused. Requires BinaryHeap.

**Tests and follow-up:** Test empty inputs, equal values and uneven lengths. Shared list nodes violate the disjointness contract; preserving inputs would require copies.

```js
// 23: disjoint acyclic sorted lists {val,next}; reuses/mutates nodes. Requires BinaryHeap.
export function mergeKLists(lists) {
  const heap=new BinaryHeap((a,b)=>a.val<b.val);
  for(const node of lists)if(node)heap.push(node);
  const dummy={next:null};let tail=dummy;
  while(heap.size){const node=heap.pop();if(node.next)heap.push(node.next);tail.next=node;tail=node;}
  if(tail!==dummy)tail.next=null;
  return dummy.next;
}
```

<a id="lc-295"></a>

## 295. Find Median from Data Stream

**Question / example:** Support addNum and findMedian. Insert 1,2 → 1.5; insert 3 → 2. Empty findMedian throws.

**Derivation and correctness:** Sorting the entire stream per query is the baseline. Lower max-heap and upper min-heap keep every lower value ≤ every upper value. Rebalance so lower has equal size or one extra; roots are the middle elements.

**Complexity:** O(log n) insert, O(1) median, O(n) storage. Requires BinaryHeap below.

**Tests and follow-up:** Test duplicates, negatives and each insertion prefix. Deletion/sliding windows require indexed removal or lazy-deletion counts and valid-size accounting.

```js
// 295: finite numeric stream, median sums safely representable. Requires BinaryHeap.
export class MedianFinder {
  constructor() {
    this.lower = new BinaryHeap((a, b) => a > b);
    this.upper = new BinaryHeap((a, b) => a < b);
  }
  addNum(value) {
    if (!this.lower.size || value <= this.lower.peek()) this.lower.push(value);
    else this.upper.push(value);
    if (this.lower.size > this.upper.size + 1) this.upper.push(this.lower.pop());
    if (this.upper.size > this.lower.size) this.lower.push(this.upper.pop());
  }
  findMedian() {
    if (!this.lower.size) throw new Error('Empty stream');
    return this.lower.size > this.upper.size ? this.lower.peek()
      : (this.lower.peek() + this.upper.peek()) / 2;
  }
}
```

<a id="lc-1167"></a>

## 1167. Minimum Cost to Connect Sticks

**Question / example:** Combining two lengths costs their sum. Return minimum total cost. [2,3,7] → 17; zero/one stick costs 0.

**Derivation and correctness:** Enumerating merge orders is exponential. In an optimal binary merge tree, two smallest weights can occupy deepest sibling leaves by exchange. Merge them, contract that subtree and repeat; the min-heap implements the choice.

**Complexity:** O(n log(n+1)) time, O(n) space. Requires BinaryHeap.

**Tests and follow-up:** Test zeros and uneven lengths. Sorting and two queues can remove repeated heap work; constraints on merge order invalidate the exchange argument.

```js
// 1167: nonnegative safe integer lengths and safe sums; empty/single costs 0.
export function connectSticks(sticks) {
  const heap=new BinaryHeap((a,b)=>a<b);for(const x of sticks)heap.push(x);
  let cost=0;while(heap.size>1){const x=heap.pop()+heap.pop();cost+=x;heap.push(x);}return cost;
}
```

<a id="lc-410"></a>

## 410. Split Array Largest Sum

**Question / example:** Split nonempty nonnegative integers into exactly k nonempty contiguous groups, minimizing the largest sum. [7,2,5,10,8],2 → 18.

**Derivation and correctness:** Enumerating cuts is expensive. Binary-search the maximum allowed sum between max element and total. Greedily fill each group; it uses the fewest groups for that bound. At most k groups is feasible because nonnegative groups can be split to exactly k without increasing the maximum.

**Complexity:** O(n log(S-M+1)) iterations cost with at least O(n) initialization; O(1) auxiliary space. S total, M maximum.

**Tests and follow-up:** Test zeros and k=1/n. Negative numbers break this greedy feasibility test; all arithmetic must stay safe.

```js
// 410: nonempty nonnegative integer nums, 1 <= k <= n, total sum safely representable.
export function splitArray(nums,k) {
  let lo=0,hi=0;for(const x of nums){lo=Math.max(lo,x);hi+=x;}
  while(lo<hi) {
    const mid=lo+Math.floor((hi-lo)/2);let groups=1,sum=0;
    for(const x of nums){if(sum+x>mid){groups++;sum=x;}else sum+=x;}
    if(groups<=k)hi=mid;else lo=mid+1;
  }
  return lo;
}
```

<a id="lc-875"></a>

## 875. Koko Eating Bananas

**Question / example:** Positive piles, at least one hour per pile, h>=pile count. Minimum integer speed. [3,6,7,11],8 → 4.

**Derivation and correctness:** Try every speed as a baseline. Hours needed is sum ceil(pile/speed), nonincreasing in speed. Binary-search the first speed meeting h between 1 and max pile.

**Complexity:** O(n·(1+log M)) time, O(1) auxiliary space.

**Tests and follow-up:** Test one pile and h equal to pile count. No solution exists if h is smaller than the number of nonempty piles; excluded by this contract.

```js
// 875: nonempty positive integer piles; h >= piles.length; safe hour sums.
export function minEatingSpeed(piles,h) {
  let lo=1,hi=1;for(const x of piles)hi=Math.max(hi,x);
  while(lo<hi) {
    const mid=lo+Math.floor((hi-lo)/2);let hours=0;
    for(const x of piles)hours+=Math.ceil(x/mid);
    if(hours<=h)hi=mid;else lo=mid+1;
  }
  return lo;
}
```

<a id="lc-329"></a>

## 329. Longest Increasing Path in a Matrix

**Question / example:** Longest orthogonal strictly increasing cell path. [[9,9,4],[6,6,8],[2,1,1]] → 4.

**Derivation and correctness:** Naive DFS repeats suffixes. Model smaller→larger edges, which form a DAG. Remove local-minimum vertices in topological layers; a vertex becomes ready after all predecessors, so its layer equals one plus the largest predecessor layer.

**Complexity:** O(RC) time and O(RC) space, iterative to avoid a deep recursion stack.

**Tests and follow-up:** Test equal cells, negatives, one cell and empty matrix. Nondecreasing paths can cycle and need a different contract.

```js
// 329: rectangular finite numeric matrix; strictly increasing orthogonal paths.
export function longestIncreasingPath(matrix) {
  const rows=matrix.length,cols=matrix[0]?.length??0;
  if(!rows||!cols)return 0;
  const degree=Array(rows*cols).fill(0),queue=[],moves=[[1,0],[-1,0],[0,1],[0,-1]];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) {
    for(const [dr,dc] of moves){const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&matrix[nr][nc]<matrix[r][c])degree[r*cols+c]++;
    }
    if(!degree[r*cols+c])queue.push(r*cols+c);
  }
  let head=0,layers=0;
  while(head<queue.length) {
    const end=queue.length;layers++;
    while(head<end){const id=queue[head++],r=Math.floor(id/cols),c=id%cols;
      for(const [dr,dc] of moves){const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&matrix[nr][nc]>matrix[r][c]&&--degree[nr*cols+nc]===0)queue.push(nr*cols+nc);
      }
    }
  }
  return layers;
}
```

<a id="lc-322"></a>

## 322. Coin Change

**Question / example:** Unlimited positive integer coin denominations; minimum coins for amount, -1 if impossible. [1,3,4],6 → 2; amount 0 → 0.

**Derivation and correctness:** Recursive choices repeat remaining amounts. dp[a] is the best number for a; its last coin c leaves dp[a-c]. Consider every legal last coin, taking one plus the smallest reachable predecessor.

**Complexity:** O(amount·C) time, O(amount) space.

**Tests and follow-up:** Test no denominations, unreachable totals and greedy counterexamples. To return coins, retain the last coin for each improvement.

```js
// 322: positive integer denominations; amount >= 0 integer. Unlimited reuse.
export function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let total = 1; total <= amount; total++) for (const coin of coins) {
    if (coin <= total) dp[total] = Math.min(dp[total], dp[total - coin] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

<a id="lc-300"></a>

## 300. Longest Increasing Subsequence

**Question / example:** Return strictly increasing subsequence length. [10,9,2,5,3,7,101,18] → 4.

**Derivation and correctness:** Quadratic DP is a baseline. tails[len-1] stores the smallest achievable final value of a length-len subsequence. Lower-bound replacement preserves shorter possibilities and creates the best extension opportunity; append only when all tails are smaller.

**Complexity:** O(n log(n+1)) time, O(n) extra space.

**Tests and follow-up:** Test duplicates, descending and empty. The tails array need not itself be a subsequence; reconstruction needs predecessor/index tracking.

```js
// 300: finite numbers; strictly increasing subsequence, length only.
export function lengthOfLIS(nums) {
  const tails=[];
  for(const x of nums){let lo=0,hi=tails.length;
    while(lo<hi){const mid=Math.floor((lo+hi)/2);if(tails[mid]<x)lo=mid+1;else hi=mid;}
    tails[lo]=x;
  }
  return tails.length;
}
```

<a id="lc-1143"></a>

## 1143. Longest Common Subsequence

**Question / example:** Return LCS length for two UTF-16 strings. abcde and ace → 3.

**Derivation and correctness:** Recursive suffix choices repeat states. For equal final characters take diagonal+1; otherwise at least one final character is omitted, so take max of the two shorter-prefix states. Keep two rows for length only.

**Complexity:** O(mn) time, O(min(m,n)) extra space.

**Tests and follow-up:** Test empty, disjoint and repeated characters. A substring requires contiguity and a different recurrence; reconstructing LCS needs more state.

```js
// 1143: UTF-16 code-unit strings; LCS length only.
export function longestCommonSubsequence(a,b) {
  if(b.length>a.length)[a,b]=[b,a];
  let previous=Array(b.length+1).fill(0);
  for(let i=1;i<=a.length;i++){const row=Array(b.length+1).fill(0);
    for(let j=1;j<=b.length;j++)row[j]=a[i-1]===b[j-1]?previous[j-1]+1:Math.max(previous[j],row[j-1]);
    previous=row;
  }
  return previous[b.length];
}
```

<a id="lc-22"></a>

## 22. Generate Parentheses

**Question / example:** Return every balanced sequence with n pairs. n=2 → ['(())','()()']; n=0 → [''].

**Derivation and correctness:** Generate every 2n-bit choice then filter as a baseline. Backtracking never uses more than n opens or more closes than opens. These conditions preserve valid prefixes and reach every balanced sequence exactly once.

**Complexity:** O(Cn·n) output-sensitive time, O(n) working stack/path plus O(Cn·n) output; Cn Catalan count.

**Tests and follow-up:** Test balance at every prefix and uniqueness. Do not call it polynomial in n; output is exponential-scale.

```js
// 22: integer n >= 0; n=0 gives ['']; output size can be exponential.
export function generateParenthesis(n) {
  const result=[],path=[];
  function visit(open,close){if(close===n){result.push(path.join(''));return;}
    if(open<n){path.push('(');visit(open+1,close);path.pop();}
    if(close<open){path.push(')');visit(open,close+1);path.pop();}
  }
  visit(0,0);return result;
}
```

<a id="lc-212"></a>

## 212. Word Search II

**Question / example:** Return dictionary words formed by orthogonal paths without cell reuse. [['a','b'],['c','d']],['ab','ac','aba'] → ['ab','ac'].

**Derivation and correctness:** Searching separately repeats common prefixes. A trie shares prefix exploration; path-local visited state prevents reuse. Clear only a found terminal marker to deduplicate output, retaining descendants for longer words. Undo visited state after each branch.

**Complexity:** O(D+RC·4^min(L,RC)) conservative worst-case time; O(D+min(L,RC)) auxiliary trie/stack/visited plus output.

**Tests and follow-up:** Test a word that is a prefix of another, duplicate dictionary entries and shared cells across different paths. Board is not mutated. Words are nonempty.

```js
// 212: rectangular lowercase character board, nonempty words; no cell reuse/no mutation.
export function findWords(board,words) {
  const root={children:new Map(),word:null};
  for(const word of words){let node=root;for(const ch of word){if(!node.children.has(ch))node.children.set(ch,{children:new Map(),word:null});node=node.children.get(ch);}node.word=word;}
  const rows=board.length,cols=board[0]?.length??0,seen=new Set(),output=[];
  function visit(r,c,parent){if(r<0||r>=rows||c<0||c>=cols||seen.has(r*cols+c))return;
    const node=parent.children.get(board[r][c]);if(!node)return;
    if(node.word!==null){output.push(node.word);node.word=null;}
    seen.add(r*cols+c);
    visit(r+1,c,node);visit(r-1,c,node);visit(r,c+1,node);visit(r,c-1,node);
    seen.delete(r*cols+c);
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)visit(r,c,root);
  return output;
}
```

<a id="lc-146"></a>

## 146. LRU Cache

**Question / example:** get promotes an existing numeric key; put inserts/updates and evicts the least recently used when full. Missing get returns -1; zero capacity stores nothing.

**Derivation and correctness:** Scanning recency is O(capacity). A map locates the node; sentinel-linked-list splices move it to most recent in constant work. The node before tail is exactly the oldest surviving access/update.

**Complexity:** Expected O(1) get/put and O(capacity) storage plus sentinels.

**Tests and follow-up:** Test overwrites, repeated gets, capacity 0/1 and evict-then-reinsert. TTL is a separate expiry policy; concurrent access needs a consistency contract.

```js
// 146: capacity >= 0 integer, numeric keys/values; get returns -1 when absent.
export class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity < 0) throw new Error('Invalid capacity');
    this.capacity = capacity;
    this.nodes = new Map();
    this.head = { next: null, prev: null };
    this.tail = { next: null, prev: this.head };
    this.head.next = this.tail;
  }
  detach(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  promote(node) {
    node.prev = this.head; node.next = this.head.next;
    node.next.prev = node; this.head.next = node;
  }
  get(key) {
    const node = this.nodes.get(key);
    if (!node) return -1;
    this.detach(node); this.promote(node);
    return node.value;
  }
  put(key, value) {
    if (!this.capacity) return;
    let node = this.nodes.get(key);
    if (node) { this.detach(node); node.value = value; }
    else { node = { key, value }; this.nodes.set(key, node); }
    this.promote(node);
    if (this.nodes.size > this.capacity) {
      const oldest = this.tail.prev;
      this.detach(oldest); this.nodes.delete(oldest.key);
    }
  }
}
```

<a id="lc-787"></a>

## 787. Cheapest Flights Within K Stops

**Question / example:** Directed nonnegative costs; at most k intermediate stops means k+1 edges. Return cheapest cost or -1.

**Derivation and correctness:** A cost-only visited set loses the edge budget. Bellman-Ford by layers computes cheapest costs using at most e edges from only the previous layer. Copying prevents one iteration from chaining multiple new edges.

**Complexity:** O((k+1)·(V+E)) time with array copies, O(V) extra space.

**Tests and follow-up:** Test direct versus cheap multi-hop route, zero stops and src=dst. Layered Dijkstra also works if state includes edges used.

```js
// 787: directed nonnegative-cost flights, 0-based IDs, at most k stops (k+1 edges).
export function findCheapestPrice(n,flights,src,dst,k) {
  let dist=Array(n).fill(Infinity);dist[src]=0;
  for(let edges=0;edges<=k;edges++){const next=[...dist];
    for(const [a,b,cost] of flights)next[b]=Math.min(next[b],dist[a]+cost);
    dist=next;
  }
  return dist[dst]===Infinity?-1:dist[dst];
}
```

<a id="lc-1631"></a>

## 1631. Path With Minimum Effort

**Question / example:** Minimize the maximum absolute height change on an orthogonal path, not their sum. [[1,2,2],[3,8,2],[5,3,5]] → 2.

**Derivation and correctness:** Enumerate paths as a baseline. Minimax Dijkstra uses next=max(current,edge difference). Extending a path cannot reduce its effort, allowing the same minimum-finalization argument as nonnegative shortest paths.

**Complexity:** O(RC log(RC+1)) time, O(RC) space on the bounded-degree grid. Requires BinaryHeap.

**Tests and follow-up:** Test flat terrain and singleton. Alternative: binary-search an effort threshold with reachability or sort edges and union components.

```js
// 1631: nonempty rectangle, finite heights with safe differences; minimax edge cost.
export function minimumEffortPath(heights) {
  const rows=heights.length,cols=heights[0].length,dist=Array(rows*cols).fill(Infinity);
  const heap=new BinaryHeap((a,b)=>a[0]<b[0]);dist[0]=0;heap.push([0,0]);
  while(heap.size){const [cost,id]=heap.pop();if(cost!==dist[id])continue;if(id===dist.length-1)return cost;
    const r=Math.floor(id/cols),c=id%cols;
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=rows||nc<0||nc>=cols)continue;
      const to=nr*cols+nc,next=Math.max(cost,Math.abs(heights[r][c]-heights[nr][nc]));
      if(next<dist[to]){dist[to]=next;heap.push([next,to]);}
    }
  }
}
```

<a id="lc-2463"></a>

## 2463. Minimum Total Distance Traveled

**Question / example:** Assign sorted-line robots to capacity-limited factories at minimum absolute distance. [4,5],[[0,1],[6,1]] → 5. Return null if infeasible.

**Derivation and correctness:** Nearest available greedy can fail. Uncrossing assignments on a line never increases cost, so some optimum assigns consecutive sorted robots to each sorted factory. DP considers every feasible count assigned to the current factory from the previous-factory layer.

**Complexity:** O(R log R+F log F+F·R·min(R,Cmax)) time, O(R+F) extra space including copies.

**Tests and follow-up:** Test zero capacity, negative coordinates and insufficient capacity. Returning assignments needs predecessor choices; shared Q5 explains the uncrossing argument in more depth.

```js
// 2463: safe positions/costs; factories [position,nonnegative integer capacity].
// Does not mutate inputs; null if insufficient capacity, 0 for no robots.
export function minimumTotalDistance(robots,factories) {
  const a=[...robots].sort((x,y)=>x-y),b=factories.map(x=>[...x]).sort((x,y)=>x[0]-y[0]);
  let dp=Array(a.length+1).fill(Infinity);dp[0]=0;
  for(const [position,capacity] of b){const next=[...dp];
    for(let i=1;i<=a.length;i++){let cost=0;
      for(let count=1;count<=Math.min(capacity,i);count++) {cost+=Math.abs(a[i-count]-position);next[i]=Math.min(next[i],dp[i-count]+cost);}
    }
    dp=next;
  }
  return dp[a.length]===Infinity?null:dp[a.length];
}
```

<a id="lc-1319"></a>

## 1319. Number of Operations to Make Network Connected

**Question / example:** n>=1 nodes and movable undirected cables. Return needed rewirings or -1. n=4,[[0,1],[0,2],[1,2]] → 1.

**Derivation and correctness:** At least n-1 cables are necessary. DSU counts c components. With enough total cables, unused cycle edges are at least c-1 and each can join two components, so exactly c-1 moves suffice.

**Complexity:** O(n+E·α(n)) time, O(n) space. Requires DSU.

**Tests and follow-up:** Test already connected, one node and too few cables. Restrictions on which cables may be moved change feasibility.

```js
// 1319: n>=1 vertices, undirected cables, can move redundant cables.
export function makeConnected(n,connections) {
  if(connections.length<n-1)return -1;
  const dsu=new DSU(n);for(const [a,b] of connections)dsu.union(a,b);return dsu.count-1;
}
```

<a id="lc-947"></a>

## 947. Most Stones Removed

**Question / example:** Distinct row/column coordinate pairs; remove a stone only while another shares its row or column. Six-stone example in tests → 5.

**Derivation and correctness:** Build components through shared rows/columns. Union each stone with a representative for its row and column. One stone must remain per component; removing leaves of a spanning tree demonstrates all others can be removed.

**Complexity:** O(n·α(n)) expected time, O(n) space. Requires DSU.

**Tests and follow-up:** Test isolated stones and transitive connections. Return removal order by traversing a component spanning tree; DSU alone does not retain it.

```js
// 947: unique coordinate pairs; remove a stone only if another shares row or column.
export function removeStones(stones) {
  const dsu=new DSU(stones.length),rows=new Map(),cols=new Map();
  stones.forEach(([r,c],i)=>{
    if(rows.has(r))dsu.union(i,rows.get(r));else rows.set(r,i);
    if(cols.has(c))dsu.union(i,cols.get(c));else cols.set(c,i);
  });
  return stones.length-dsu.count;
}
```

<a id="lc-1514"></a>

## 1514. Path With Maximum Probability

**Question / example:** Undirected edges with probabilities in [0,1]. Return maximum path product, 0 if unreachable; start=end → 1.

**Derivation and correctness:** Enumerating simple paths is a baseline. Max-heap Dijkstra extracts the highest probability; multiplying by ≤1 cannot improve it, so no later route through a smaller frontier value can win. Relax strict improvements and skip stale candidates.

**Complexity:** O(V+E log(E+2)) time, O(V+E) space. Requires BinaryHeap.

**Tests and follow-up:** Test zero/one probabilities and disconnected endpoints. Long products may underflow; negative-log costs can help but handle zero separately.

```js
// 1514: undirected graph, probabilities in [0,1], 0-based valid IDs. Requires BinaryHeap.
export function maxProbability(n,edges,probabilities,start,end) {
  const graph=Array.from({length:n},()=>[]);
  edges.forEach(([a,b],i)=>{graph[a].push([b,probabilities[i]]);graph[b].push([a,probabilities[i]]);});
  const best=Array(n).fill(0),heap=new BinaryHeap((a,b)=>a[0]>b[0]);best[start]=1;heap.push([1,start]);
  while(heap.size){const [prob,node]=heap.pop();if(prob!==best[node])continue;if(node===end)return prob;
    for(const [to,p] of graph[node]){const next=prob*p;if(next>best[to]){best[to]=next;heap.push([next,to]);}}
  }
  return 0;
}
```

<a id="lc-138"></a>

## 138. Copy List with Random Pointer

**Question / example:** Clone an acyclic next-chain whose random pointers target a node in that chain or null. Preserve original identity/links; clones must share no original nodes.

**Derivation and correctness:** Copying values alone loses random references. First allocate one clone per original node; then translate both next and random links through the identity map. Every original edge becomes an edge between the corresponding clones.

**Complexity:** Expected O(n) time, O(n) mapping plus O(n) output nodes.

**Tests and follow-up:** Test self-random, duplicate values, random cycles and null. Interleaving clones can reduce auxiliary mapping but temporarily mutates the source.

```js
// 138: acyclic next chain, random points within it or null; preserve original nodes.
export function copyRandomList(head) {
  const copies=new Map([[null,null]]);
  for(let node=head;node;node=node.next)copies.set(node,{val:node.val,next:null,random:null});
  for(let node=head;node;node=node.next){const copy=copies.get(node);copy.next=copies.get(node.next);copy.random=copies.get(node.random);}
  return copies.get(head);
}
```

<a id="lc-143"></a>

## 143. Reorder List

**Question / example:** Mutate L0→L1→...→Ln into L0→Ln→L1→Ln-1...; return the head for convenience. [1,2,3,4,5] → [1,5,2,4,3].

**Derivation and correctness:** A node-array baseline uses O(n) space. Find the first-half end, detach and reverse the second half, then weave alternately. Disjoint halves prevent cycles and the first half has enough nodes to receive each second-half node.

**Complexity:** O(n) time, O(1) auxiliary space.

**Tests and follow-up:** Test odd/even lengths, empty and singleton. Save next pointers before rewiring and explicitly detach the halves.

```js
// 143: acyclic list; mutate next links into L0,Ln,L1,Ln-1,...; return head for convenience.
export function reorderList(head) {
  if(!head||!head.next)return head;
  let slow=head,fast=head;
  while(fast.next&&fast.next.next){slow=slow.next;fast=fast.next.next;}
  let node=slow.next,previous=null;slow.next=null;
  while(node){const next=node.next;node.next=previous;previous=node;node=next;}
  let first=head,second=previous;
  while(second){const a=first.next,b=second.next;first.next=second;second.next=a;first=a;second=b;}
  return head;
}
```

<a id="lc-124"></a>

## 124. Binary Tree Maximum Path Sum

**Question / example:** Nonempty tree, safe integer sums. Any nonempty simple path; [-3] → -3. Tree -10 with children 9 and 20(15,7) → 42.

**Derivation and correctness:** Enumerating every endpoint pair is a baseline. A subtree returns its best single upward branch; a completed path through a node may use both positive child gains. Update a global best with that completed path, but never return both branches to a parent.

**Complexity:** O(n) time, O(h) stack, O(n) worst case.

**Tests and follow-up:** Initialize best to -Infinity so all-negative trees choose a node, not the empty path. Deep trees need iterative postorder.

```js
// 124: nonempty proper binary tree, safe integer values/sums; nonempty path required.
export function maxPathSum(root) {
  let best=-Infinity;
  function gain(node){if(!node)return 0;const left=Math.max(0,gain(node.left)),right=Math.max(0,gain(node.right));
    best=Math.max(best,node.val+left+right);return node.val+Math.max(left,right);
  }
  gain(root);return best;
}
```

<a id="lc-347"></a>

## 347. Top K Frequent Elements

**Question / example:** Return k most frequent numeric values. [1,1,1,2,2,3],2 → [1,2]. Ties prefer the smaller value in this implementation.

**Derivation and correctness:** Full sorting of distinct counts is a baseline. Keep a size-k heap whose root is the worst retained candidate. Every discarded root is no better than all retained entries; after all keys, the heap holds the k best.

**Complexity:** O(n+U log(k+2)+k log(k+1)) time, O(U+k) auxiliary/output storage. Requires BinaryHeap.

**Tests and follow-up:** Test k=0, k=distinct and ties. Buckets give linear-time selection with O(n) extra buckets; online frequency updates need update-aware heap/index logic.

```js
// 347: finite numeric values, 0<=k<=distinct count; ties use smaller value first.
export function topKFrequent(nums,k) {
  const counts=new Map();for(const x of nums)counts.set(x,(counts.get(x)??0)+1);
  const heap=new BinaryHeap((a,b)=>a[1]<b[1]||(a[1]===b[1]&&a[0]>b[0]));
  for(const entry of counts){heap.push(entry);if(heap.size>k)heap.pop();}
  const result=[];while(heap.size)result.push(heap.pop()[0]);return result.reverse();
}
```

<a id="lc-207"></a>

## 207. Course Schedule

**Question / example:** Given n courses and prerequisite pairs [course, prior], decide whether all can be finished. n=2, [[1,0]] → true; adding [0,1] → false.

**Derivation and correctness:** Repeated reachability wastes work. Build prior→course edges and emit zero-indegree vertices. Each emitted vertex has all prerequisites satisfied; if vertices remain, a cycle blocks them.

**Complexity:** O(V+E) time and space, including adjacency.

**Tests and follow-up:** Test self-cycles, isolated courses and repeated edges. Follow-up: return a cycle witness with DFS colors and parent links.

```js
// 207: n >= 0 integer; prerequisites are valid [course, prerequisite] IDs.
export function canFinish(n, prerequisites) {
  const graph = Array.from({ length: n }, () => []);
  const degree = Array(n).fill(0);
  for (const [course, prior] of prerequisites) {
    graph[prior].push(course);
    degree[course]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (degree[i] === 0) queue.push(i);
  for (let head = 0; head < queue.length; head++) {
    for (const next of graph[queue[head]]) if (--degree[next] === 0) queue.push(next);
  }
  return queue.length === n;
}
```

<a id="lc-239"></a>

## 239. Sliding Window Maximum

**Question / example:** Return maxima of length-k windows. [1,3,-1,-3,5,3,6,7],3 → [3,3,5,5,6,7]. Reject k outside 1..n.

**Derivation and correctness:** O(nk) scans become a decreasing deque of indices. A newer value ≥ an older one dominates it and expires later; remove old indices from back and expired indices from front. Each index enters/leaves once.

**Complexity:** O(n) time, O(k) auxiliary ring-deque space plus O(n-k+1) output.

**Tests and follow-up:** Test all equal, decreasing, k=1 and k=n. Time windows require timestamp ordering and expiry semantics, not just replacing k.

```js
// 239: finite numeric values; integer k in [1, nums.length]. Reject invalid k.
export function slidingWindowMaximum(nums, k) {
  if (!Number.isInteger(k) || k < 1 || k > nums.length) throw new Error('Invalid window');
  const deque = Array(k), output = [];
  let head = 0, size = 0;
  for (let i = 0; i < nums.length; i++) {
    while (size && deque[head] <= i - k) { head = (head + 1) % k; size--; }
    while (size && nums[deque[(head + size - 1) % k]] <= nums[i]) size--;
    deque[(head + size) % k] = i;
    size++;
    if (i >= k - 1) output.push(nums[deque[head]]);
  }
  return output;
}
```

<a id="lc-33"></a>

## 33. Search in Rotated Sorted Array

**Question / example:** Find a target index in a rotated strictly increasing array, else -1. [4,5,6,7,0,1,2],0 → 4.

**Derivation and correctness:** Linear scan is the baseline. At least one half is sorted with distinct values; compare the target to that half's endpoints and retain only the half that can contain it. The target, if present, remains within lo..hi.

**Complexity:** O(log n) time, O(1) extra space.

**Tests and follow-up:** Test empty, no rotation, one element and absent target. Duplicates remove the sorted-half inference and may force linear worst-case work.

```js
// 33: rotation of a strictly increasing finite numeric array; -1 if absent.
export function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
```

<a id="lc-4"></a>

## 4. Median of Two Sorted Arrays

**Question / example:** Sorted finite arrays, not both empty. [1,3],[2] → 2; [1,2],[3,4] → 2.5.

**Derivation and correctness:** Merging takes linear time. Binary-search a partition in the shorter array with half the elements on the left. When both left boundaries are ≤ opposite right boundaries, the median is determined. If aLeft is too big move left; if bLeft is too big move right.

**Complexity:** O(1+log(min(m,n)+1)) time, O(1) extra space.

**Tests and follow-up:** Test one empty, duplicates and unequal lengths. Inputs are assumed sorted; validating that first would add linear time. Arithmetic must be safely representable.

```js
// 4: sorted finite numeric arrays; arithmetic safely representable; not both empty.
export function medianSortedArrays(a, b) {
  if (a.length > b.length) return medianSortedArrays(b, a);
  if (a.length + b.length === 0) throw new Error('No median for empty input');
  const half = Math.floor((a.length + b.length + 1) / 2);
  let lo = 0, hi = a.length;
  while (lo <= hi) {
    const i = lo + Math.floor((hi - lo) / 2), j = half - i;
    const al = i === 0 ? -Infinity : a[i - 1], ar = i === a.length ? Infinity : a[i];
    const bl = j === 0 ? -Infinity : b[j - 1], br = j === b.length ? Infinity : b[j];
    if (al > br) hi = i - 1;
    else if (bl > ar) lo = i + 1;
    else {
      const left = Math.max(al, bl);
      return (a.length + b.length) % 2 ? left : (left + Math.min(ar, br)) / 2;
    }
  }
  throw new Error('Inputs must be sorted');
}
```

<a id="lc-139"></a>

## 139. Word Break

**Question / example:** Does text split into dictionary words, which may be reused? 'leetcode',['leet','code'] → true. Empty text is true; ignore empty words.

**Derivation and correctness:** Recursive split enumeration repeats suffixes. A trie follows characters without allocating every substring; a reachable prefix can extend to any terminal node. Every legal segmentation is a sequence of these marked boundaries.

**Complexity:** O(D+nL) time, O(D+n) extra space; D dictionary characters, L maximum word length.

**Tests and follow-up:** Test shared prefixes, repeated words and an impossible suffix. Save predecessors for one segmentation; enumerating all can require exponential output.

```js
// 139: strings compared as UTF-16 code units; empty text true, empty words ignored.
export function wordBreak(text, words) {
  const root = { next: new Map(), terminal: false };
  for (const word of words) {
    if (!word.length) continue;
    let node = root;
    for (let i = 0; i < word.length; i++) {
      if (!node.next.has(word[i])) node.next.set(word[i], { next: new Map(), terminal: false });
      node = node.next.get(word[i]);
    }
    node.terminal = true;
  }
  const reachable = Array(text.length + 1).fill(false);
  reachable[0] = true;
  for (let i = 0; i < text.length; i++) {
    if (!reachable[i]) continue;
    let node = root;
    for (let j = i; j < text.length; j++) {
      node = node.next.get(text[j]);
      if (!node) break;
      if (node.terminal) reachable[j + 1] = true;
    }
  }
  return reachable[text.length];
}
```

<a id="lc-72"></a>

## 72. Edit Distance

**Question / example:** Unit insert/delete/replace operations on UTF-16 code units. 'horse','ros' → 3.

**Derivation and correctness:** Exponential recursion becomes prefix DP. Matching final characters reuse the diagonal. Otherwise the last operation must be insert, delete or replace; choose one plus the best corresponding predecessor. Two rows suffice for the distance.

**Complexity:** O(mn) time, O(min(m,n)) auxiliary space.

**Tests and follow-up:** Test empty and equal strings. Returning an edit script needs retained decisions/full DP or a more advanced divide-and-conquer reconstruction.

```js
// 72: unit-cost insert/delete/replace, UTF-16 code units; return distance only.
export function editDistance(a, b) {
  if (b.length > a.length) [a, b] = [b, a];
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = Array(b.length + 1);
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      current[j] = a[i - 1] === b[j - 1] ? previous[j - 1]
        : 1 + Math.min(previous[j], current[j - 1], previous[j - 1]);
    }
    previous = current;
  }
  return previous[b.length];
}
```

<a id="helpers"></a>

## Shared heap and disjoint-set helpers

Include the helper named by the answer when copying code into an isolated editor. The runnable files already export/import them.

```js
// Helper: comparator returns true when a should be popped before b.
export class BinaryHeap {
  constructor(before) { this.data = []; this.before = before; }
  get size() { return this.data.length; }
  peek() { return this.data[0]; }
  push(value) {
    this.data.push(value);
    let i = this.size - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.before(this.data[i], this.data[p])) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  pop() {
    if (!this.size) throw new Error('Empty heap');
    const first = this.data[0], last = this.data.pop();
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
```

```js
// Helper: integer IDs 0..n-1; union by size and path compression.
export class DSU {
  constructor(n) { this.parent = Array.from({length:n},(_,i)=>i); this.size=Array(n).fill(1); this.count=n; }
  find(x) { while (x!==this.parent[x]) { this.parent[x]=this.parent[this.parent[x]]; x=this.parent[x]; } return x; }
  union(a,b) {
    a=this.find(a); b=this.find(b); if(a===b)return false;
    if(this.size[a]<this.size[b]) [a,b]=[b,a];
    this.parent[b]=a; this.size[a]+=this.size[b]; this.count--; return true;
  }
}
```
