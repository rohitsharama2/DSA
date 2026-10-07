# Live DSA coding: reported questions and worked solutions

[Round-wise index](README.md) · [Evidence and dates](Research-Sources.md) · [Earlier eight worked answers](../Candidate-Questions-and-Solutions.md)

**Language: TypeScript**, using ordinary JavaScript collections and control flow. Remove type annotations for JavaScript. All solutions below are original implementations. Bounds are part of each practice contract; do not silently assume them in an interview.

## What to prioritize after the 90-minute OA

| Priority | Exercise | Interview evidence | Status |
| --- | --- | --- | --- |
| First | Q1 property ripple components | Aced, submitted June 20, 2026 (A1) | Reported theme; distance contract below is our reconstruction |
| First | Q2 directed chain reaction | June 2026 graph narrative (R2) | Practice variation; report does not establish radii or direction |
| First | Q3 shortest uncommon substring | July 27, 2026 repost (R3) | Reported screen theme; standard LeetCode contract |
| First | Q4 downhill skiing and multiple starts | January 2026 interview, August publication (P1) | Reported theme; concrete practice contract |
| First | Q5 maze shortest path | Same P1 account | Analogous practice problem; exact maze scoring unspecified |
| First | Menu order and split stay | User-supplied candidate report (R4) | [Full existing statements and answers](../Candidate-Questions-and-Solutions.md) |
| Next | Q6 minimum window | LeetCode account L2 | Report age unverified |
| Next | Q7 sliding puzzle | LeetCode accounts L2/L4 | Report age unverified |
| Next | Q8 cheapest flights plus route | LeetCode account L3 | Report age unverified |
| Next | Q9 water simulation and terrain rendering | LeetCode accounts L1/L4 | Report age unverified; explicit tie rules added below |

Source IDs link through the [research register](Research-Sources.md). Priorities are study recommendations, not measured question frequencies. The role description adds Unicode and workflow concerns, but it does not prove that DSA questions will be localization-themed.

## A 45-minute live-coding rehearsal

Use 5 minutes for contract/examples, 5 for baseline and invariant, 20 for implementation, 10 for tests and correction, and 5 for complexity/follow-ups. Narrate meaningful decisions. If you recognize a pattern, still explain the reasoning; there is no need to pretend it is unfamiliar.

## Q1. Property ripple effect: connected components

**Reported context:** The [user-linked Aced experience](https://www.aced.io/experiences/airbnb-software-engineer-interview-a61f91) appears in the [June 2026 index](https://www.aced.io/guides/airbnb-software-engineer-interview/experiences). Its summary mentions properties, ripple propagation, and connected components, but gives no distance rule.

**Practice statement:** Each property is a point `[x,y]`. Two properties are connected when their Euclidean distance is at most a shared nonnegative threshold `d`. Activating one property propagates repeatedly across connections. Return the number of independent groups and each group's property indices. Use `n <= 1000`, integer coordinates with absolute value at most 1,000,000, and `0 <= d <= 1,000,000` so squared arithmetic is exact within JavaScript's safe range.

**Example:** `[[0,0],[2,0],[4,0],[10,0]]`, `d=2` → `[[0,1,2],[3]]`, count 2. Property 0 reaches 2 through 1 even though their direct distance exceeds 2.

**Approach:** Start a traversal from each unseen property. Scan possible neighbors when visiting a property; mark them when discovered. Squared distances avoid square roots. This avoids materializing a dense adjacency matrix.

```ts
function propertyGroups(points: [number, number][], distance: number): number[][] {
  const seen = new Set<number>();
  const groups: number[][] = [];
  for (let start = 0; start < points.length; start++) {
    if (seen.has(start)) continue;
    const queue = [start];
    seen.add(start);
    for (let head = 0; head < queue.length; head++) {
      const u = queue[head];
      for (let v = 0; v < points.length; v++) {
        if (seen.has(v)) continue;
        const dx = points[u][0] - points[v][0];
        const dy = points[u][1] - points[v][1];
        if (dx * dx + dy * dy <= distance * distance) {
          seen.add(v);
          queue.push(v);
        }
      }
    }
    groups.push(queue);
  }
  return groups;
}
```

**Correctness:** Traversal discovers every property reachable from its start and cannot cross to an unrelated group. Starting only from unseen properties counts every connected component once. Group member order is BFS discovery order, not guaranteed numeric order.

**Complexity:** `O(n²)` time, `O(n)` auxiliary/output space. If adjacency is already supplied, use `O(V+E)` graph traversal instead.

**Tests:** No properties → `[]`; all isolated; duplicate coordinates with `d=0`; exact-threshold distance; a long chain; negative coordinates.

**Follow-up answers:** For online insertions, union-find joins newly connected properties; neighbor discovery still costs work. Spatial bucketing can reduce typical comparisons, but densely packed points still give quadratic worst-case behavior. For deletions, plain union-find is insufficient. Ask whether the output is a group count, all affected properties from a start, or a maximum reachability count.

## Q2. Different radii: directed chain reaction

**Practice variation:** Each property has `[x,y,r]`; an activated property reaches any property inside its own radius, which then propagates using its radius. Return the maximum number activated from one start. Use at most 100 properties and integer coordinates/radii bounded as in Q1. This is analogous to [LeetCode 2101](https://leetcode.com/problems/detonate-the-maximum-bombs/), not a claim that the cited interview used identical rules.

**Example:** `[[0,0,1],[3,0,3],[6,0,1]]` → 3 when starting at index 1. Edges from 1 reach both others; neither reaches 1.

```ts
function maxPropertyRipple(properties: [number, number, number][]): number {
  const n = properties.length;
  const edges = Array.from({ length: n }, () => [] as number[]);
  for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) {
    if (u === v) continue;
    const dx = properties[u][0] - properties[v][0];
    const dy = properties[u][1] - properties[v][1];
    if (dx * dx + dy * dy <= properties[u][2] ** 2) edges[u].push(v);
  }
  let best = 0;
  for (let start = 0; start < n; start++) {
    const seen = new Set([start]);
    const stack = [start];
    while (stack.length) {
      for (const next of edges[stack.pop()!]) {
        if (!seen.has(next)) { seen.add(next); stack.push(next); }
      }
    }
    best = Math.max(best, seen.size);
  }
  return best;
}
```

**Reasoning:** Reachability is asymmetric, so an undirected component calculation can overcount. A fresh visited set for each starting vertex measures exactly its directed reach. **Complexity:** `O(n² + n(n+E))` time, at most `O(n³)`; `O(n²)` space.

**Tests:** Empty → 0; singleton → 1; zero-radius duplicates; directed chain; cycle. **Follow-up:** For larger static graphs, condense strongly connected components and compute reachable-component sets in the resulting DAG. Summing child counts alone double-counts shared descendants.

## Q3. Shortest uncommon substring

**Evidence:** A [July 2026 report](https://www.reddit.com/r/OfferEngineering/comments/1v89o9a/airbnb_midlevel_swe_full_loop_standard_questions/) describes a shortest-unique-substring screen. We use [LeetCode 3076's contract](https://leetcode.com/problems/shortest-uncommon-substring-in-an-array/): for each lowercase-English string, return the shortest substring not present in any other input string; break ties lexicographically, or return `''` if none. Up to 100 strings, each length at most 20.

**Example:** `['abc','abd','b']` → `['c','d','']`.

**Approach:** Count how many distinct input strings own each substring. Deduplicate within one string before increasing ownership, so repeated occurrences in the same word do not invalidate uniqueness.

```ts
function shortestUncommon(words: string[]): string[] {
  const all = words.map(word => {
    const unique = new Set<string>();
    for (let i = 0; i < word.length; i++) {
      for (let end = i + 1; end <= word.length; end++) unique.add(word.slice(i, end));
    }
    return unique;
  });
  const owners = new Map<string, number>();
  for (const unique of all) for (const part of unique) {
    owners.set(part, (owners.get(part) ?? 0) + 1);
  }
  return all.map(unique => {
    let best = '';
    for (const part of unique) {
      if (owners.get(part) === 1 && (!best || part.length < best.length
        || (part.length === best.length && part < best))) best = part;
    }
    return best;
  });
}
```

**Correctness:** Ownership of one means exactly one input string contains the substring. Comparing every eligible candidate by length then lexical order implements the requested selection rule.

**Complexity:** With `N` strings of maximum length `L`, there are `O(NL²)` substring candidates. Conservatively including substring copying/hashing/comparison gives `O(NL³)` time and character storage. This fits the small stated `L`; it is not appropriate for megabyte strings.

**Tests:** Duplicate input strings → neither can have a unique substring; repeated letters within one word; equal-length lexical ties. **Follow-up:** For much longer inputs, discuss suffix-based structures rather than hiding string allocation costs. For this i18n role, clarify whether “character” means UTF-16 code units, code points, or grapheme clusters before adapting the contract.

## Q4. Downhill skiing with many starting points

**Evidence:** P1 reports skiing and a multiple-skiers follow-up. The [concrete practice statement](https://prachub.com/coding-questions/find-best-downhill-ski-run-from-a-start) uses a rectangular elevation grid, four-direction moves to strictly lower cells, and score equal to cells visited. Skiers act independently. Return the best score for each requested start; empty grid gives zero per query. Up to 100,000 cells/queries, integer elevations.

**Example:** `[[4,3],[1,2]]`, starts `[[0,0],[1,1]]` → `[4,2]`: `4→3→2→1` and `2→1`.

**Approach:** Strict descent forms a DAG. Exponential path enumeration repeats work; compute each cell's best continuation once. The iterative solution starts at local minima, tracks unfinished lower neighbors, and propagates scores uphill. It avoids deep recursive calls and sorting.

```ts
function downhillScores(grid: number[][], starts: [number, number][]): number[] {
  const rows = grid.length, cols = grid[0]?.length ?? 0;
  if (!rows || !cols) return starts.map(() => 0);
  const total = rows * cols;
  const pending = Array<number>(total).fill(0);
  const best = Array<number>(total).fill(1);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const queue: number[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
        && grid[nr][nc] < grid[r][c]) pending[r * cols + c]++;
    }
    if (pending[r * cols + c] === 0) queue.push(r * cols + c);
  }
  for (let head = 0; head < queue.length; head++) {
    const id = queue[head], r = Math.floor(id / cols), c = id % cols;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] <= grid[r][c]) continue;
      const higher = nr * cols + nc;
      best[higher] = Math.max(best[higher], best[id] + 1);
      if (--pending[higher] === 0) queue.push(higher);
    }
  }
  return starts.map(([r, c]) => best[r * cols + c]);
}
```

**Correctness:** A cell enters the queue only after all possible downhill continuations are finalized. Its score is one plus their maximum, or one if none exist. Strict descent prevents cycles, so every cell is finalized. **Complexity:** `O(RC+Q)` time, `O(RC)` auxiliary and `O(Q)` output space.

**Tests:** All equal heights → 1; negative elevations; a long decreasing row; repeated starts. **Follow-up answers:** Independent skiers share the table. Collision avoidance or shared capacity changes the problem and needs a time/state model; do not claim this DP handles interacting skiers. Store the chosen lower neighbor to reconstruct a route. Equal-height moves can create cycles, invalidating the DAG assumption.

## Q5. Maze shortest path

**Evidence:** P1's maze scoring is incomplete; this is its stated [binary-matrix analogy](https://leetcode.com/problems/shortest-path-in-binary-matrix/), not a recovered game. Given a square grid, 0 is passable and 1 blocked. Move in eight directions, including diagonals regardless of neighboring side cells. Return the minimum visited-cell count from top-left to bottom-right, or -1. Empty grid → -1 in this practice implementation.

**Example:** `[[0,1],[1,0]]` → 2. A passable single cell → 1.

```ts
function shortestClearPath(grid: number[][]): number {
  const n = grid.length;
  if (!n || grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;
  const dist = Array.from({ length: n }, () => Array<number>(n).fill(-1));
  const queue: [number, number][] = [[0, 0]];
  dist[0][0] = 1;
  for (let head = 0; head < queue.length; head++) {
    const [r, c] = queue[head];
    if (r === n - 1 && c === n - 1) return dist[r][c];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n
        && grid[nr][nc] === 0 && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return -1;
}
```

**Correctness:** BFS visits unweighted states in increasing distance. Marking distance at enqueue time avoids duplicates; the first destination visit is shortest. **Complexity:** `O(n²)` time and space. DFS can find a route but does not directly guarantee the shortest one.

**Follow-ups:** Four-direction movement changes neighbors; weighted moves need Dijkstra for nonnegative weights; dynamic obstacles require including time or relevant state; route output requires predecessor pointers. Confirm whether score counts edges or cells.

## Q6. Minimum window substring

**Evidence:** L2, age unverified. [Standard contract](https://leetcode.com/problems/minimum-window-substring/): find the shortest contiguous source substring containing every target character with multiplicity. Here strings are ASCII; return the earliest window on ties and `''` for an empty target or no solution.

**Example:** Source `AAABBC`, target `ABC` → `ABBC`. Target `AABC` needs two As, so the answer becomes `AABBC`.

```ts
function minimumCoveringWindow(source: string, target: string): string {
  if (!target) return '';
  const need = new Map<string, number>();
  for (const ch of target) need.set(ch, (need.get(ch) ?? 0) + 1);
  let missing = target.length, left = 0, bestStart = 0, bestLength = Infinity;
  for (let right = 0; right < source.length; right++) {
    const ch = source[right];
    if ((need.get(ch) ?? 0) > 0) missing--;
    need.set(ch, (need.get(ch) ?? 0) - 1);
    while (missing === 0) {
      if (right - left + 1 < bestLength) { bestStart = left; bestLength = right - left + 1; }
      const removed = source[left++];
      need.set(removed, (need.get(removed) ?? 0) + 1);
      if (need.get(removed)! > 0) missing++;
    }
  }
  return Number.isFinite(bestLength) ? source.slice(bestStart, bestStart + bestLength) : '';
}
```

**Reasoning:** Positive counts are deficits, negative counts surplus. Expand until all deficits disappear, then shrink until removing a required character breaks validity. Every right endpoint's shortest valid window is considered. **Complexity:** `O(S+T)` time; `O(alphabet)` auxiliary space plus output.

**Tests:** Target duplicates, target longer than source, case sensitivity, empty source, all identical letters. **Follow-up:** An i18n version needs consistent segmentation and a mapping back to original string offsets, not a mixture of code-point iteration and code-unit indexing.

## Q7. Sliding puzzle: 2×3 and 3×3

**Evidence:** L2/L4, age unverified; [LeetCode's version](https://leetcode.com/problems/sliding-puzzle/) is 2×3. Our practice function accepts a rectangular board with at most nine cells containing each integer from 0 to cells−1 once. Zero is the blank. Swap it with an orthogonal neighbor. Return minimum moves to row-major order `1,...,cells−1,0`, or -1.

**Example:** `[[1,2,3],[4,0,5]]` → 1; `[[1,2,3],[4,5,6],[7,0,8]]` → 1.

```ts
function slidingPuzzleMoves(board: number[][]): number {
  const rows = board.length, cols = board[0].length, cells = rows * cols;
  const start = board.flat().join('');
  const goal = Array.from({ length: cells }, (_, i) => (i + 1) % cells).join('');
  const queue: [string, number][] = [[start, 0]];
  const seen = new Set([start]);
  for (let head = 0; head < queue.length; head++) {
    const [state, distance] = queue[head];
    if (state === goal) return distance;
    const zero = state.indexOf('0'), r = Math.floor(zero / cols), c = zero % cols;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const other = nr * cols + nc, next = state.split('');
      [next[zero], next[other]] = [next[other], next[zero]];
      const key = next.join('');
      if (!seen.has(key)) { seen.add(key); queue.push([key, distance + 1]); }
    }
  }
  return -1;
}
```

**Reasoning:** Each board arrangement is a graph node and every swap costs one. BFS finds the minimum number of swaps. Serialization is unambiguous because labels are single-digit under the contract. **Complexity:** Conservative `O(M! × M)` time and space for `M` cells, including string copying/storage. The factorial state space matters even though only some permutations are reachable.

**Tests:** Already solved → 0; unreachable permutation → -1; blank in a corner; 3×3 one move away. **Follow-up:** Bidirectional BFS reduces explored layers; inversion parity can reject unsolvable cases with board-width-specific rules. A*/IDA* with Manhattan-distance heuristics is a better direction for larger boards; do not extrapolate this BFS to 4×4 without discussing resources.

## Q8. Cheapest flight with at most K stops, returning the route

**Evidence:** L3 reports cost and stops/route. Use the [standard flight contract](https://leetcode.com/problems/cheapest-flights-within-k-stops/) with positive integer costs; `n <= 100`, `0 <= k < n`. Return `{cost,path}`, using `-1,[]` if unreachable. A route with K intermediate stops has at most K+1 edges. Any cheapest tied route is accepted.

**Example:** Flights `0→1:4`, `1→2:4`, `0→2:12`. With `k=0`, cost 12 and route `[0,2]`; with `k=1`, cost 8 and route `[0,1,2]`.

```ts
function cheapestFlightRoute(
  n: number, flights: [number, number, number][], src: number, dst: number, k: number
): { cost: number; path: number[] } {
  const maxEdges = k + 1;
  const dp = Array.from({ length: maxEdges + 1 }, () => Array<number>(n).fill(Infinity));
  const parent = Array.from({ length: maxEdges + 1 }, () => Array<number>(n).fill(-1));
  dp[0][src] = 0;
  for (let edges = 1; edges <= maxEdges; edges++) {
    for (const [u, v, price] of flights) {
      const candidate = dp[edges - 1][u] + price;
      if (candidate < dp[edges][v]) { dp[edges][v] = candidate; parent[edges][v] = u; }
    }
  }
  let chosen = 0;
  for (let edges = 1; edges <= maxEdges; edges++) {
    if (dp[edges][dst] < dp[chosen][dst]) chosen = edges;
  }
  if (!Number.isFinite(dp[chosen][dst])) return { cost: -1, path: [] };
  const path = [dst];
  let node = dst;
  for (let edges = chosen; edges > 0; edges--) { node = parent[edges][node]; path.push(node); }
  path.reverse();
  return { cost: dp[chosen][dst], path };
}
```

**Correctness:** Row `e` stores cheapest cost using exactly `e` edges. Only the previous row supplies transitions, preventing one iteration from using multiple additional flights. Minimize destination cost across allowed rows and follow the associated predecessor layers. **Complexity:** `O((K+1)(V+E))` time and `O((K+1)V)` storage. Without route output, two rows suffice for costs.

**Tests:** No path, direct-only budget, cheapest unrestricted route exceeds stops, source equals destination (our extension returns zero), positive-cost cycles. **Follow-up:** A visited flag per city loses remaining-stop information; state must include the edge budget. Reconstructing from one global predecessor per city can also produce an invalid path.

## Q9. Pour water and render terrain

**Evidence:** L1/L4 describe water simulation; their short narratives do not fully specify tie-breaking. The following rules define our practice variant.

**Statement:** Given nonnegative integer column heights, pour `volume` unit drops at index `k`. For each drop, walk left while the next height is no greater than the current scanned height; choose the nearest lowest column found, if it is lower than the source. Otherwise do the same to the right. If neither side offers a lower column, place the drop at `k`. Closed ends: water does not escape. Return new heights without mutating input. Practice with at most 1000 columns/drops.

**Example:** `[2,1,2]`, `volume=2`, `k=1` → `[2,3,2]`. First fill the valley, then the level surface holds a drop at the source.

```ts
function pourWater(heights: number[], volume: number, k: number): number[] {
  const result = [...heights];
  for (let drop = 0; drop < volume; drop++) {
    let best = k;
    for (let i = k - 1; i >= 0 && result[i] <= result[i + 1]; i--) {
      if (result[i] < result[best]) best = i;
    }
    if (best !== k) { result[best]++; continue; }
    for (let i = k + 1; i < result.length && result[i] <= result[i - 1]; i++) {
      if (result[i] < result[best]) best = i;
    }
    result[best]++;
  }
  return result;
}

function renderTerrain(original: number[], filled: number[]): string {
  const height = Math.max(0, ...filled);
  const rows: string[] = [];
  for (let level = height; level >= 1; level--) {
    rows.push(filled.map((value, i) => original[i] >= level ? '+' : value >= level ? 'W' : ' ').join(''));
  }
  rows.push('-'.repeat(original.length));
  return rows.join('\n');
}
```

**Reasoning:** Each scan follows precisely the allowed non-uphill path. Updating `best` only for strict decreases preserves the nearest position among tied minima. Left is attempted first, as required. Repeat because each drop changes future movement. Rendering separates original terrain from added water.

**Complexity:** Simulation `O(volume × n)` time, `O(n)` space. Rendering `O(maxHeight × n)` time/output, so large absolute heights make literal ASCII output expensive. Inputs for rendering must have equal length and `filled[i] >= original[i]`.

**Tests:** Volume zero, single column, flat plateau, left blocked but right lower, water conservation, input unchanged. **Follow-up:** If the interviewer changes tie preference, open boundaries, or continuous flow rules, restate the contract and adapt; similar titles can describe different simulations.

## Existing solved questions to include in your mocks

The [earlier workbook](../Candidate-Questions-and-Solutions.md) already contains complete answers for menu order, split stay, work sessions, climbing stairs, obstacle course, equal-sized partition, and maximum-sum BST. Keep the distinction between reported questions and the candidate's collected practice list. Do not treat every item as independently verified recent interview evidence.

For this Internationalization Infrastructure role, also practice the [JS/TS/React role exercises](05-JS-TS-React-and-I18n.md). They are inferred from the job description, not reported DSA questions.
