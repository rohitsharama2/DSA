# Agoda Staff: DSA patterns and worked TypeScript

[Round-wise index](README.md) · [Evidence A1–A4](Research-Sources.md) · [Study plan](../../handbook/Agoda-Google-Preparation-Strategy.md)

**Updated October 9, 2026.** P0 means do first; P1 broadens coverage; P2 is a stretch. Priorities are recommendations, not observed frequencies. All implementations and concrete practice contracts below are original.

## Pattern-to-question bank

The numbered entries below are **24 LeetCode practice analogues**, not 24 reported Agoda questions. A1 supports parsing; A2/A3 support monotonic-stack practice; A2 supports ranking. Other rows are foundation/transfer choices. Some LeetCode problems may require a subscription; the worked local exercises are self-contained.

| # | Priority / pattern | Practice link | What to explain / follow-up |
| --- | --- | --- | --- |
| 1 | P0 parsing | [394 Decode String](https://leetcode.com/problems/decode-string/) | Group stack; nested counts; output-size cost |
| 2 | P0 parsing | [726 Number of Atoms](https://leetcode.com/problems/number-of-atoms/) | Counts by element; richer grammar than Q1 below |
| 3 | P0 parsing | [224 Basic Calculator](https://leetcode.com/problems/basic-calculator/) | Sign scope; unary operators |
| 4 | P0 monotonic stack | [739 Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Indices, strict inequality, amortized analysis |
| 5 | P0 monotonic stack | [496 Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) | Direction and equal elements |
| 6 | P0 monotonic stack | [84 Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Width boundaries; duplicate heights |
| 7 | P0 ranking | [1331 Rank Transform of an Array](https://leetcode.com/problems/rank-transform-of-an-array/) | Dense ranks and ties; Q3 |
| 8 | P0 hashing | [1 Two Sum](https://leetcode.com/problems/two-sum/) | Check before insert; duplicate values |
| 9 | P0 hashing | [49 Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Canonical key and alphabet assumptions |
| 10 | P0 heap / counting | [347 Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Batch vs. streaming; tie contract |
| 11 | P1 selection | [215 Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Bounded heap vs. quickselect worst case |
| 12 | P1 streaming | [295 Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Two-heap balance invariant |
| 13 | P1 data structure | [146 LRU Cache](https://leetcode.com/problems/lru-cache/) | Map + doubly linked list; capacity zero variant |
| 14 | P1 intervals | [56 Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Endpoint convention and sorted invariant |
| 15 | P1 intervals | [57 Insert Interval](https://leetcode.com/problems/insert-interval/) | Exploit pre-sorted disjoint input |
| 16 | P1 sweep / heap | [2402 Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii/) | Free-room vs. occupied-room heaps; tie rules |
| 17 | P1 sliding window | [3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Left boundary must not move backward |
| 18 | P1 graph traversal | [200 Number of Islands](https://leetcode.com/problems/number-of-islands/) | Mark on enqueue; iterative traversal |
| 19 | P1 dependencies | [207 Course Schedule](https://leetcode.com/problems/course-schedule/) | Directed cycle vs. undirected connectivity |
| 20 | P1 tree traversal | [102 Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Queue frontier and memory |
| 21 | P1 binary search | [875 Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Monotone feasibility and bounds |
| 22 | P1 DP | [322 Coin Change](https://leetcode.com/problems/coin-change/) | Unreachable sentinel; unbounded reuse |
| 23 | P2 graph state | [787 Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | State includes remaining edges; no global city-only pruning |
| 24 | P2 backtracking | [79 Word Search](https://leetcode.com/problems/word-search/) | Restore visited state per path |

## Q1. Evaluate a nested formula

**Evidence:** A1 reports flat evaluation followed by grouped evaluation. **Our contract:** symbols `C`, `H`, `O` have supplied weights 12, 1, 8; a symbol or nonempty parenthesized group may have a positive integer multiplier. Multi-digit counts are our extension. No whitespace, signs, decimals, leading zeros, or empty groups. Empty input returns 0. Reject malformed input or unsafe integer totals. This is a toy grammar, not a chemistry library.

**Examples:** `CH4 → 16`, `H(CH4)2 → 33`, `O2 → 16`, `C12H22O11 → 254`.

**Reasoning:** A flat parser sums weighted terms. For nesting, keep one subtotal per open group; a closing parenthesis collapses its subtotal into the parent. The stack represents exactly the unmatched opening groups. Each recognized term is counted once in its enclosing group.

```ts
function formulaWeight(formula: string): number {
  const weights = new Map([['C', 12], ['H', 1], ['O', 8]]);
  const stack: { total: number; terms: number }[] = [{ total: 0, terms: 0 }];
  let i = 0;
  const digit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9';
  function count(): number {
    if (!digit(formula[i])) return 1;
    if (formula[i] === '0') throw new Error('Invalid multiplier');
    let value = 0;
    while (digit(formula[i])) {
      value = value * 10 + Number(formula[i++]);
      if (!Number.isSafeInteger(value)) throw new Error('Unsafe multiplier');
    }
    return value;
  }
  function add(value: number): void {
    const top = stack[stack.length - 1];
    const next = top.total + value;
    if (!Number.isSafeInteger(value) || !Number.isSafeInteger(next)) {
      throw new Error('Unsafe total');
    }
    top.total = next;
    top.terms++;
  }
  while (i < formula.length) {
    const ch = formula[i++];
    if (ch === '(') {
      stack.push({ total: 0, terms: 0 });
    } else if (ch === ')') {
      if (stack.length === 1) throw new Error('Unmatched close');
      const group = stack.pop()!;
      if (group.terms === 0) throw new Error('Empty group');
      add(group.total * count());
    } else {
      const weight = weights.get(ch);
      if (weight === undefined) throw new Error('Unknown token');
      add(weight * count());
    }
  }
  if (stack.length !== 1) throw new Error('Unclosed group');
  return stack[0].total;
}
```

**Complexity:** `O(n)` time, `O(depth)` auxiliary space. Iterative nesting avoids call-stack overflow. Numeric operations use bounded safe integers.

**Tests:** Empty, single element, deep groups, missing `)`, extra `)`, `()`, unknown symbol, `H0`, `H01`, and overflow. **Follow-ups:** Return element counts instead of weight by merging maps at group closure; support multi-letter symbols with tokenization; use `bigint` if exact totals exceed safe integers. Map merging changes the complexity: do not reuse the scalar parser's time claim blindly.

## Q2. Nearest strictly smaller value on the left

**Evidence:** A2 gives the nearest-smaller theme without a complete direction/equality contract. **Our contract:** for each finite numeric value, return the index of the closest strictly smaller value to its left, or `-1`.

**Example:** `[4,5,2,2,7] → [-1,0,-1,-1,3]`.

```ts
function previousSmaller(values: number[]): number[] {
  const stack: number[] = [];
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    while (stack.length && values[stack[stack.length - 1]] >= values[i]) stack.pop();
    result.push(stack.length ? stack[stack.length - 1] : -1);
    stack.push(i);
  }
  return result;
}
```

**Correctness:** The stack's values are strictly increasing. A removed index is dominated by a later value no larger than it, so it cannot be the closest qualifying index for a future position. After popping non-smaller candidates, the top is the closest smaller index.

**Complexity:** `O(n)` time because each index is pushed/popped at most once; `O(n)` space including output. Brute force scans backward per position in `O(n²)`.

**Tests:** Empty, all equal, increasing, decreasing, negative values. **Follow-ups:** For smaller-or-equal, pop only `>`; for nearest right, reverse iteration; for histogram area, identify both boundaries and define how ties are handled.

## Q3. Dense priority ranks

**Evidence:** A2 mentions ranking but says the full question is not remembered. **Our contract:** finite values receive ascending dense ranks beginning at 1; equal values share a rank; a larger value gets a larger numeric rank. Original order is preserved.

**Example:** `[40,10,20,20] → [3,1,2,2]`. This is not competition ranking (`1,2,2,4`) or descending leaderboard rank.

```ts
function denseRanks(values: number[]): number[] {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  const rank = new Map(unique.map((value, i) => [value, i + 1]));
  return values.map(value => rank.get(value)!);
}
```

**Correctness:** The sorted unique list contains exactly the distinct smaller values before each value, so index + 1 is its dense rank. **Complexity:** With `u` distinct values, `O(n + u log u)` time and `O(n+u)` space including output. Reject `NaN`/infinities at a real API boundary; this practice contract excludes them.

**Tests:** Empty, all equal, negatives, unsorted duplicates. **Follow-ups:** If values arrive online and old ranks must change, a static map is insufficient. Discuss an order-statistics tree or offline coordinate compression plus a Fenwick tree, depending on known keys and update/query requirements.

## Q4. Mutable dictionary with a maximum query

**Evidence:** A3 mentions a dictionary maximum but leaves mutation rules unclear. **Our contract:** `set(key,value)` replaces a finite value, `delete(key)` removes it, `max()` returns the largest current value or `null`. The baseline below favors simple `O(1)` expected writes and an `O(n)` scan per query. It works even when the previous maximum is reduced or removed.

```ts
class MaxDictionary {
  private values = new Map<string, number>();
  set(key: string, value: number): void { this.values.set(key, value); }
  delete(key: string): boolean { return this.values.delete(key); }
  max(): number | null {
    let result: number | null = null;
    for (const value of this.values.values()) {
      if (result === null || value > result) result = value;
    }
    return result;
  }
}
```

**Example:** `set(a,5), set(b,3), max() → 5; set(a,1), max() → 3; delete(b), max() → 1`.

**Correctness:** Scanning the current map excludes obsolete values. **Complexity:** `set/delete` expected `O(1)`; `max` `O(n)`; `O(n)` retained space.

**Optimization discussion:** Ask the operation mix first. For frequent max queries, pair an authoritative map with a max-heap of `(value,key,version)` entries and discard stale tops. Writes cost `O(log h)`; a query discarding `k` stale entries costs `O(k log h)`, not worst-case `O(1)`. Retained history may grow with updates; rebuild or use an indexed heap for bounded space. A single cached maximum fails after reductions/deletion. For insert-only writes, a cached maximum is sufficient.

## Practical OA drill: paginated supplier data

A3 reports an API consolidation task, but no exact endpoint contract. This is an **original practice exercise**, not a recovered OA question.

Given `fetchPage(cursor) → {items,nextCursor}` where each item is `{bookingId,version,amountMinor,currency,status}`, follow cursors until `null`, keep the highest version per booking, and total confirmed amounts per currency. For equal versions, require identical payloads or report a conflict. Inputs may overlap across pages. Do not sum currencies together.

**Worked approach:** Maintain `seenCursors` to reject cursor cycles and a `Map<bookingId,item>` for newest records; aggregate only after pagination so cancellations replace older confirmations. Require a snapshot token if the API promises a stable export while writes occur. Retry only transient failures under a bounded policy; return failure rather than a silently partial total. Use integer-safe minor units or `bigint`.

**Fixture:** Page 1 has `a/v1/USD/100/confirmed` and `b/v1/EUR/70/confirmed`; page 2 has `a/v2/USD/100/cancelled` and `b/v1/EUR/70/confirmed`. Result: EUR 70, USD 0 (or omit zero buckets by explicit contract).

**Complexity:** `O(r)` processing for `r` records, `O(b+p)` space for distinct bookings and visited page cursors; network latency is separate. A next-cursor chain is sequential unless the API explicitly offers independent page partitions.

**Tests:** No pages/items, duplicate page records, cancellation update, equal-version conflict, repeated cursor, transient failure, invalid amounts, multiple currencies. In a 90-minute rehearsal, budget 40 minutes for a DSA question, 40 for this task, and 10 for regression checks. Use that duration only as practice unless your invitation confirms it.
