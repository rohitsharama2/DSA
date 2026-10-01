# DSA, Computer Science, and AI: Concepts and Worked Solutions

A study guide for learning how algorithms work, why they are correct, and how they connect to software systems. Examples use TypeScript. This is explanatory course material, with original worked examples and exercises, based on the curriculum in the companion handbook.

## Contents

1. [Programming and memory](#1-programming-and-memory)
2. [Complexity and correctness](#2-complexity-and-correctness)
3. [Arrays, strings, and two pointers](#3-arrays-strings-and-two-pointers)
4. [Sliding windows](#4-sliding-windows)
5. [Prefix sums and difference arrays](#5-prefix-sums-and-difference-arrays)
6. [Hashing](#6-hashing)
7. [Sorting, binary search, and intervals](#7-sorting-binary-search-and-intervals)
8. [Linked lists](#8-linked-lists)
9. [Stacks, queues, and deques](#9-stacks-queues-and-deques)
10. [Trees](#10-trees)
11. [Heaps and priority queues](#11-heaps-and-priority-queues)
12. [Graphs](#12-graphs)
13. [Recursion and backtracking](#13-recursion-and-backtracking)
14. [Dynamic programming](#14-dynamic-programming)
15. [Greedy algorithms and pattern selection](#15-greedy-algorithms-and-pattern-selection)
16. [Node.js, debugging, and testing](#16-nodejs-debugging-and-testing)
17. [Databases and distributed systems](#17-databases-and-distributed-systems)
18. [Machine learning foundations](#18-machine-learning-foundations)
19. [Transformers and attention](#19-transformers-and-attention)
20. [Retrieval-augmented generation](#20-retrieval-augmented-generation)
21. [Agents and MCP](#21-agents-and-mcp)
22. [Practice problems and solution sketches](#22-practice-problems-and-solution-sketches)
23. [Video lessons and further reading](#23-video-lessons-and-further-reading)

### Example conventions

Unless stated otherwise, algorithm inputs are finite numbers, array indexes are valid, and integer arithmetic stays within JavaScript's safe integer range. Graph vertex IDs are integers from `0` to `n - 1`. Invalid-input checks appear where they clarify the contract; these are interview implementations rather than complete public API validation layers.

Complexity includes recursion-stack space. Output space is identified separately where useful. Hash-map operations use the usual expected constant-time interview model; JavaScript does not promise that every individual operation takes constant time. Examples use code-point iteration for strings where stated, which still differs from user-perceived Unicode graphemes.

TypeScript code blocks share declarations across the guide. For example, later priority-queue examples use the `MinHeap` class defined in Section 11. The code uses no third-party libraries.

## 1. Programming and memory

### Variables, values, and references

A variable is a binding to a value. Numbers, booleans, and strings are primitives. Objects and arrays can be shared through references: assigning an array to another variable does not copy its elements.

```text
a ──┐
    ├──> [10, 20, 30]
b ──┘

c ─────> [10, 20, 30]    separate outer array after [...a]
```

If `b = a`, then `b.push(40)` changes the array observed through `a`. If `c = [...a]`, changing an element of `c` does not change an element of `a` when those elements are primitives. Nested objects are still shared: spreading an array makes a shallow copy. This distinction matters in backtracking, where storing the current path without copying it makes many results point to one changing array.

`const` prevents rebinding a variable; it does not freeze its object. TypeScript's `ReadonlyArray<T>` prevents mutation through that type during checking; it does not freeze the runtime array or stop mutation through another reference.

### Functions, scope, and closures

A function receives arguments and produces a value or side effect. Lexical scope means a name is resolved from where code was defined. A closure retains access to that surrounding scope after the outer function returns.

```ts
function makeCounter(start = 0): () => number {
  let count = start;
  return () => ++count;
}
// const next = makeCounter(5); next() -> 6; next() -> 7
```

Each call to `makeCounter` creates independent state. The closure keeps its captured environment reachable, so a long-lived callback can retain large objects. Garbage collection frees unreachable objects; it cannot infer that reachable data is no longer useful to the application.

### Call stack and recursion

Each active function call needs a stack frame holding execution state. A recursive call adds another frame, and a return removes one.

```text
sum(3) waits for sum(2)
  sum(2) waits for sum(1)
    sum(1) waits for sum(0)
      sum(0) returns 0
    returns 1
  returns 3
returns 6
```

A base case stops expansion. Progress toward that case guarantees termination. A recursion with depth `n` normally needs `O(n)` stack space even if each call uses only a few variables. Deep input can overflow the JavaScript call stack; explicit stacks are useful for large traversals.

### Numbers, strings, and collections

JavaScript `number` uses floating-point arithmetic. Integers are represented exactly only through `Number.MAX_SAFE_INTEGER` in magnitude. Use `bigint` when exact integer results can exceed that range; do not mix it directly with `number` arithmetic. Most bitwise number operations convert values to signed 32-bit integers, so bit tricks can silently break large-index algorithms.

`Map` represents key-value associations, and `Set` represents membership. Object keys in these collections use identity: two separately created `{ id: 1 }` objects are different keys. Strings are immutable. Building many progressively longer strings can cause repeated copying; collecting fragments and joining them makes the intended construction clearer.

**Mini-problem:** two variables reference the same array of user objects. How can one user's name be changed without mutating the original array or that user object? Create a new outer array and a new object for the changed user; reuse unchanged objects. Copying only the array is insufficient.

## 2. Complexity and correctness

### What asymptotic notation measures

Let `T(n)` count work as input size grows. `O(f(n))` is an asymptotic upper bound; `Ω(f(n))` is a lower bound; `Θ(f(n))` is a tight bound. They describe growth, not milliseconds. Big O does not inherently mean worst case: a worst-case, average-case, or best-case function can each have an asymptotic bound.

For a linear scan that stops on a match, best-case time is `Θ(1)` and worst-case time is `Θ(n)`. An average-case claim needs assumptions about where matches occur and how often they exist.

| Growth | n = 10 | n = 100 | n = 1,000 | Typical cause |
| --- | ---: | ---: | ---: | --- |
| log₂ n, rounded up | 4 | 7 | 10 | Halving a search range |
| n | 10 | 100 | 1,000 | Visiting each element |
| n log₂ n, rounded | 33 | 664 | 9,966 | Merge sort |
| n² | 100 | 10,000 | 1,000,000 | Comparing all pairs |
| 2ⁿ | 1,024 | about 1.27 × 10³⁰ | about 1.07 × 10³⁰¹ | Enumerating subsets |

Two consecutive scans cost `n + n = 2n`, hence `Θ(n)`. Nested loops each running `n` times cost `n²`. But nesting alone does not imply quadratic time: a right pointer that only advances across the array once contributes at most `n` total increments, even inside another loop.

### Amortized complexity

A dynamic array occasionally allocates a larger backing store and copies existing elements. With geometric growth, the total copied over many appends forms a geometric series: `1 + 2 + 4 + ... < 2n`. Thus `n` appends take `O(n)` overall, or amortized `O(1)` per append. One particular append may still cost `O(n)`. Amortized analysis is about a sequence of operations, not random inputs.

### Space and recursion recurrences

A merge-sort recurrence is `T(n) = 2T(n/2) + Θ(n)`: each level merges `Θ(n)` items, and there are `Θ(log n)` levels, giving `Θ(n log n)` time. A standard merge sort uses `Θ(n)` temporary storage.

A recursion that branches twice is not automatically exponential. Merge sort splits into smaller, disjoint inputs. Naive Fibonacci repeatedly solves overlapping inputs, creating exponentially many calls. A recursion that follows one child per call can take linear time with linear stack space.

### Proving an algorithm

An invariant is a fact that remains true throughout execution. A proof establishes initialization, preservation, and what the invariant implies at termination. For a running maximum, after processing the first `i` values, `best` is their maximum. Comparing the next value preserves that fact. When `i = n`, the answer covers the complete input.

**Mini-problem:** a loop doubles `i` from `1` until it reaches `n`. After `k` iterations, `i = 2ᵏ`; therefore it takes `Θ(log n)` iterations. If each iteration scans the first `i` items, the total work is a geometric series and becomes `Θ(n)`, not `Θ(n log n)`.

## 3. Arrays, strings, and two pointers

An array supports indexed access. Insertion at the front of a dense sequence generally moves many elements; appending usually avoids that. A subarray is contiguous, while a subsequence preserves order but can skip elements: `[1, 3]` is a subsequence of `[1, 2, 3]`, not a subarray.

Two pointers are useful when moving a boundary can safely discard candidates. Sorting often supplies the ordering needed for that proof.

### Worked problem: pair sum in a sorted array

**Problem:** return two distinct indexes whose values add to a target, or `null`. The input is sorted in ascending order.

**Example:** `[1, 2, 4, 6, 10]`, target `8` → `[1, 3]`.

Brute force tries every pair in `O(n²)` time. With pointers at both ends, a sum that is too small means the left value cannot work with any remaining value: the current right value is already the largest. Therefore the left pointer can advance. A sum that is too large similarly lets the right pointer retreat.

```text
values:  1  2  4  6  10
         L           R     11 > 8: move R
         L        R         7 < 8: move L
            L     R         8 = 8: found
```

```ts
function sortedPairSum(
  values: ReadonlyArray<number>, target: number,
): [number, number] | null {
  let left = 0;
  let right = values.length - 1;
  while (left < right) {
    const sum = values[left] + values[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
```

Each iteration discards one index, so time is `O(n)` and auxiliary space is `O(1)`. Empty and single-element arrays return `null`. Duplicate values are valid if they occupy different indexes. Sorting an unsorted input changes positions; preserve original indexes if those are required.

**Application:** scanning two ordered event streams and reconciling sorted records. **Follow-up:** three-sum sorts the values, fixes one value, and runs two pointers on the remainder, yielding `O(n²)` time after sorting; duplicate triples need deliberate skipping.

## 4. Sliding windows

A sliding window represents a contiguous region `[left, right]`. Instead of recomputing information for every region, it updates a running summary as boundaries move. Fixed-size windows remove one item and add one item. Variable-size windows expand to explore and contract to restore a validity condition.

### Worked problem: longest substring without repeated characters

**Example:** `"abba"` → length `2` (`"ab"` or `"ba"`). Enumerating all substrings and checking each is up to `O(n³)`; extending each starting point with a set improves that to `O(n²)`.

The optimized solution remembers each character's latest index. If a repeat lies inside the current window, advance the left boundary just beyond it. Never move the boundary backward.

```text
right   char   left   valid window   best
0       a      0      a              1
1       b      0      ab             2
2       b      2      b              2
3       a      2      ba             2

At right = 3, the earlier a is outside the window.
left = max(current left, previous index + 1) keeps it outside.
```

```ts
function longestUniqueSubstring(text: string): number {
  const chars = Array.from(text);
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < chars.length; right++) {
    const previous = lastSeen.get(chars[right]);
    if (previous !== undefined) left = Math.max(left, previous + 1);
    lastSeen.set(chars[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

The invariant is that the current window has no repeated code points. Time is expected `O(n)` and space is `O(n)`, including the code-point array. Empty text returns `0`. Combining marks and joined emoji can consist of multiple code points; a user-visible character requirement needs grapheme segmentation.

**Boundary of the technique:** shrinking a sum window when it exceeds a target relies on nonnegative values. With negative numbers, removing an element can increase the sum, so the usual monotonic argument breaks. Prefix sums are often the better tool.

## 5. Prefix sums and difference arrays

### Prefix sums answer repeated range queries

Define `prefix[0] = 0` and `prefix[i + 1] = prefix[i] + values[i]`. Then the inclusive range sum from `left` to `right` is `prefix[right + 1] - prefix[left]`. The subtraction cancels everything before the range.

```text
values:       3   -1    4    2
prefix:   0   3    2    6    8

sum of values[1..2] = prefix[3] - prefix[1] = 6 - 3 = 3
```

Building costs `O(n)` and each query costs `O(1)`. Updates invalidate later prefix sums; a Fenwick tree or segment tree supports mixed updates and queries in `O(log n)` per operation.

### Worked problem: count subarrays summing to k

**Example:** `[1, -1, 1]`, `k = 1` → `3`: the first item, last item, and whole array. Brute force can maintain a sum for every starting index in `O(n²)` time.

If the current prefix sum is `p`, an earlier prefix `p - k` identifies a subarray totaling `k`. A map stores how many times each earlier prefix occurred. Count matches before inserting the current prefix, avoiding an empty subarray when `k = 0`.

```ts
function countSubarraysWithSum(values: ReadonlyArray<number>, k: number): number {
  const frequencies = new Map<number, number>([[0, 1]]);
  let prefix = 0;
  let count = 0;
  for (const value of values) {
    prefix += value;
    count += frequencies.get(prefix - k) ?? 0;
    frequencies.set(prefix, (frequencies.get(prefix) ?? 0) + 1);
  }
  return count;
}
```

For the example, prefixes are `1, 0, 1`. The first `1` finds one earlier `0`; the last `1` finds two earlier zero prefixes, giving three matches. The initial zero represents the empty prefix before index zero. Time is expected `O(n)` and space is `O(n)`. Zeros and negative values work naturally.

### Difference arrays perform batched range updates

For adding `x` to indexes `left..right`, update `diff[left] += x` and `diff[right + 1] -= x` in an array of length `n + 1`. A final prefix scan reconstructs all additions. The positive marker turns the increment on; the negative marker turns it off.

For five zeros, adding `3` to indexes `1..3` produces markers `[0, 3, 0, 0, -3, 0]` and final values `[0, 3, 3, 3, 0]`. Processing `q` updates costs `O(q + n)` overall. This is useful when results are needed after all updates; it does not give immediate online range queries.

## 6. Hashing

A hash function maps a key to a numeric hash, which selects a bucket. Different keys can select the same bucket: a collision. Chaining stores several entries in a bucket; open addressing probes alternate slots. Equality checks distinguish colliding keys.

Good distribution and controlled load factor keep the expected number of inspected entries small. Resizing redistributes entries and costs work occasionally. Poor hashing or adversarial collisions can degrade performance. A hash value alone is not proof that two values are equal.

### Worked problem: two sum without sorting

**Example:** `[3, 3]`, target `6` → `[0, 1]`.

For each value `x`, ask whether `target - x` appeared earlier. Store previous indexes after searching so one position cannot match itself.

```ts
function twoSum(values: ReadonlyArray<number>, target: number): [number, number] | null {
  const seen = new Map<number, number>();
  for (let i = 0; i < values.length; i++) {
    const previous = seen.get(target - values[i]);
    if (previous !== undefined) return [previous, i];
    seen.set(values[i], i);
  }
  return null;
}
```

Brute force costs `O(n²)`; this uses expected `O(n)` time and `O(n)` space. Checking `if (previous)` is a bug because index `0` is falsy. The result is any valid pair, not every pair.

Frequency maps support anagram comparison and counting. Sets support deduplication and membership. Memoization maps a complete computational state to its answer: caching by only one argument when two affect the result produces incorrect reuse.

**Application:** an in-memory cache uses keyed lookup, but also needs capacity limits, expiry, and a policy for stale data. A map solves lookup, not the complete caching problem.

## 7. Sorting, binary search, and intervals

### Sorting creates useful structure

Sorting brings related items together and exposes monotonic relationships. Comparison sorting needs `Ω(n log n)` comparisons in the general worst case because a decision tree must distinguish `n!` possible input orders. Counting sort can avoid this bound when keys come from a small integer range; it uses information beyond comparisons.

| Algorithm | Time | Typical auxiliary space | Main tradeoff |
| --- | --- | --- | --- |
| Insertion sort | O(n²) worst, O(n) already sorted | O(1) | Good for small or nearly sorted inputs |
| Merge sort | O(n log n) | O(n) for arrays | Predictable time; can be stable |
| Quicksort | O(n log n) expected, O(n²) worst | Expected O(log n) stack | Pivot selection matters |
| Heapsort | O(n log n) | O(1) | In-place, generally unstable |
| Counting sort | O(n + U), key range U | O(n + U) in a stable version | Expensive for a huge key range |

In JavaScript, `values.sort()` compares string representations by default. Numeric ascending order needs `(a, b) => a - b`. Sorting mutates the array; `[...values].sort(...)` protects the caller's outer array. Runtime sorting implementations determine precise resource costs.

### Worked problem: first position with value at least target

Binary search maintains a range that can still contain the boundary. A half-open range `[left, right)` makes an empty range easy to represent and allows returning `values.length` when no element qualifies.

```ts
function lowerBound(values: ReadonlyArray<number>, target: number): number {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (values[middle] < target) left = middle + 1;
    else right = middle;
  }
  return left;
}
```

For `[1, 3, 3, 7]` and target `3`, ranges become `[0,4) → [0,2) → [0,1) → [1,1)`, returning `1`. Everything before `left` is too small; everything at or after `right` is large enough. Each iteration reduces the range, giving `O(log n)` time and `O(1)` space. Empty input returns `0`.

Binary search also finds a minimum feasible answer when feasibility is monotonic. For shipping packages within a fixed number of days, increasing capacity cannot make shipping less feasible. Search capacities between the heaviest package and the total weight, using a greedy loading simulation as the feasibility test.

### Worked problem: merge overlapping closed intervals

**Example:** `[[1, 3], [2, 6], [8, 10]]` → `[[1, 6], [8, 10]]`.

After sorting by start, the next interval can overlap only the last merged interval. If its start exceeds the last end, no earlier merged interval can reach it either.

```ts
type Interval = readonly [number, number];

function mergeIntervals(intervals: ReadonlyArray<Interval>): Array<[number, number]> {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (last === undefined || start > last[1]) merged.push([start, end]);
    else last[1] = Math.max(last[1], end);
  }
  return merged;
}
```

Assuming `start <= end`, time is `O(n log n)` under the usual sorting model and storage is `O(n)` for copies and results, plus sorting workspace. Closed intervals touching at one point merge here. For half-open intervals, such as `[1,3)` and `[3,5)`, the definition of overlap changes.

## 8. Linked lists

A singly linked node stores a value and a pointer to the next node. A doubly linked node also stores the previous pointer. Lists lack constant-time indexed access: reaching item `i` requires following links. Inserting after a known node is constant time, but locating that node may be linear.

### Worked problem: reverse a singly linked list

**Example:** `1 → 2 → 3 → null` becomes `3 → 2 → 1 → null`.

An auxiliary array can rebuild the reverse order using `O(n)` space. In-place reversal uses three references: the reversed prefix, the current node, and the saved next node. Save the next node before overwriting its link.

```text
start:   previous = null     current = 1 → 2 → 3
step 1:  null ← 1            current = 2 → 3
step 2:  null ← 1 ← 2        current = 3
step 3:  null ← 1 ← 2 ← 3    current = null
```

```ts
type ListNode = { value: number; next: ListNode | null };

function reverseList(head: ListNode | null): ListNode | null {
  let previous: ListNode | null = null;
  let current = head;
  while (current !== null) {
    const next: ListNode | null = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}
```

The reversed prefix is always correctly linked; the remaining suffix stays reachable through `current`. Time is `O(n)` and auxiliary space is `O(1)`. This mutates the input and assumes no cycle. Null and single-node lists work without special branches.

### Fast and slow pointers

In Floyd's cycle detection, a slow pointer advances one link and a fast pointer advances two. If a cycle exists, their relative distance changes by one modulo the cycle length, so they eventually meet. If there is no cycle, the fast pointer reaches null. Time is `O(n)`, space `O(1)`.

To find the cycle entrance, reset one pointer to the head after the meeting and advance both one step at a time. If the entrance is `μ` steps from the head and the cycle length is `λ`, the meeting offset makes the remaining distance to the entrance congruent to `μ` modulo `λ`; they meet at the entrance.

Other list techniques follow from preserving reachability:

- **Merge sorted lists:** attach the smaller head to a dummy-tail output, then advance that list. Time `O(n + m)`, auxiliary space `O(1)` when reusing nodes.
- **Intersection:** switch each pointer to the other list's head at null. Each traverses the same total length; they meet at the shared node or at null. Equality is node identity, not equal values. Inputs must be acyclic.
- **Random-pointer copy:** create an old-node-to-new-node map, then wire both `next` and `random` references using it. Time and space `O(n)`.
- **LRU cache:** a hash map locates nodes and a doubly linked list moves recently used nodes to the front. The tail is the eviction candidate; both operations are expected `O(1)`.

## 9. Stacks, queues, and deques

A stack is last-in, first-out: `push` and `pop` operate at one end. It models nested work such as function calls or undo history. A queue is first-in, first-out and models arrival order. A deque allows insertion and removal at both ends.

### Worked problem: balanced brackets

**Example:** `"{[()]}"` is valid; `"([)]"` is invalid even though each bracket count balances. Counts lose nesting order. A stack records unfinished openings; a closing bracket must match the most recent opening.

```ts
function balancedBrackets(text: string): boolean {
  const opening = new Set(["(", "[", "{"]);
  const required = new Map([[ ")", "(" ], [ "]", "[" ], [ "}", "{" ]]);
  const stack: string[] = [];
  for (const char of text) {
    if (opening.has(char)) stack.push(char);
    else if (required.has(char) && stack.pop() !== required.get(char)) return false;
  }
  return stack.length === 0;
}
```

Non-bracket characters are ignored by this contract. A closing bracket with an empty stack fails. An unfinished opening fails at the final check. Time and worst-case space are `O(n)`.

### Worked problem: days until a warmer temperature

**Example:** `[73, 74, 75, 71, 69, 72, 76, 73]` → `[1, 1, 4, 2, 1, 1, 0, 0]`.

Brute force scans forward from every day, costing `O(n²)`. A monotonic stack stores unresolved indexes whose temperatures are non-increasing. A warmer arrival resolves all colder indexes on top.

```ts
function warmerDays(temperatures: ReadonlyArray<number>): number[] {
  const result = Array<number>(temperatures.length).fill(0);
  const pending: number[] = [];
  for (let day = 0; day < temperatures.length; day++) {
    while (pending.length > 0 &&
      temperatures[day] > temperatures[pending[pending.length - 1]]) {
      const earlier = pending.pop()!;
      result[earlier] = day - earlier;
    }
    pending.push(day);
  }
  return result;
}
```

Each index is pushed once and popped at most once, giving `O(n)` time despite the nested loop. Space is `O(n)`. Equal temperatures do not resolve a day because the problem requires strictly warmer weather. The non-null assertion follows from the explicit nonempty-stack check.

### Queue and deque implementation details

Repeatedly using `Array.shift()` can move remaining elements and make a traversal quadratic. For a bounded traversal, an array and increasing head index work well. A long-lived queue must also release consumed entries or compact storage; otherwise processed objects remain reachable.

A queue built from two stacks pushes arrivals into an input stack. When the output stack is empty, transfer all input items into it. Reversal makes the oldest item appear on top. Each item transfers at most once, giving amortized `O(1)` enqueue and dequeue, although one dequeue can cost `O(n)`.

A monotonic deque solves sliding-window maximum: remove expired indexes from the front, remove smaller or equal values from the back, append the new index, and read the front as the maximum. Each index enters and leaves at most once: `O(n)` time with a deque implementation supporting constant-time operations, and `O(k)` live entries for window size `k`.

A min-stack stores `(value, minimumSoFar)` for every push, giving `O(1)` minimum queries. Expression evaluation uses operand and operator stacks, applying operators according to precedence and associativity; parentheses delimit subexpressions. Unary minus needs separate handling from binary subtraction.

## 10. Trees

A tree is a connected acyclic graph. In a rooted tree, each non-root node has one parent. A binary tree has at most two children per node. A binary search tree adds an ordering rule; a binary tree by itself is not sorted.

```text
          8              depth 0
        /   \
       3     10          depth 1
      / \      \
     1   6      14       depth 2

preorder:   8, 3, 1, 6, 10, 14   node before children
inorder:    1, 3, 6, 8, 10, 14   left, node, right
postorder:  1, 6, 3, 14, 10, 8   children before node
level order:8, 3, 10, 1, 6, 14   breadth first
```

Depth measures distance from the root; height measures the longest downward distance to a leaf. State whether units are nodes or edges. A balanced BST has height `O(log n)`, making search, insertion, and deletion logarithmic; an unbalanced chain has height `O(n)`. AVL and red-black trees use rotations and balance rules to prevent that degeneration.

### Worked problem: level-order traversal

```ts
type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };

function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const queue: TreeNode[] = [root];
  const levels: number[][] = [];
  let head = 0;
  while (head < queue.length) {
    const levelEnd = queue.length;
    const level: number[] = [];
    while (head < levelEnd) {
      const node = queue[head++];
      level.push(node.value);
      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}
```

The captured `levelEnd` prevents children added during this level from being visited until the next one. Time is `O(n)`. This array implementation retains all queued references, so its auxiliary storage is `O(n)`; a queue releasing consumed entries can keep only `O(w)` live queue elements, where `w` is maximum width. The returned traversal also uses `O(n)` space.

### Worked problem: tree diameter

The diameter is the maximum number of edges on a path between any two nodes. A path can pass through a node using the deepest branch on its left and right. Recomputing subtree heights for every node can cost `O(n²)`. Postorder computes every height once.

```ts
function treeDiameter(root: TreeNode | null): number {
  let best = 0;
  function height(node: TreeNode | null): number {
    if (node === null) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  }
  height(root);
  return best;
}
```

Here `height` counts nodes, making `left + right` the number of edges in the through-node path. A single node has diameter `0`. The pictured tree has diameter `4`, along `1 → 3 → 8 → 10 → 14`. Time is `O(n)` and stack space is `O(h)`.

**Lowest common ancestor:** recurse into both subtrees. If both return a target-containing result, the current node is the split point. Otherwise propagate the one result. This standard rule assumes both target nodes exist; if they might not, also count how many targets were found.

**Serialization:** preorder with explicit null markers preserves structure, such as `8,3,#,#,10,#,#`. Values alone cannot distinguish different shapes. Deserialization consumes tokens in the same recursive order and should reject missing or extra tokens.

**BST validation:** checking only immediate children is insufficient. Carry lower and upper bounds inherited from all ancestors. Decide how duplicates are represented before choosing strict or non-strict inequalities.

## 11. Heaps and priority queues

A min-heap keeps each parent no greater than its children. The root is the minimum, but siblings and separate subtrees are not fully sorted. A complete binary-tree shape fits in an array.

```text
          2                 array: [2, 5, 3, 9, 7]
        /   \
       5     3              left child:  2i + 1
      / \                   right child: 2i + 2
     9   7                  parent: floor((i - 1) / 2)
```

Insertion appends at the end and bubbles up. Removal replaces the root with the last item and bubbles down toward the smaller child. Both follow at most the tree height, `O(log n)`; reading the minimum is `O(1)`. Bottom-up heap construction is `O(n)` because most nodes sit near leaves and need few swaps, while repeated insertion costs `O(n log n)` in the worst case.

```ts
class MinHeap<T> {
  private items: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) { this.compare = compare; }
  get size(): number { return this.items.length; }
  peek(): T | undefined { return this.items[0]; }

  push(value: T): void {
    const a = this.items;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(a[parent], a[i]) <= 0) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      i = parent;
    }
  }

  pop(): T | undefined {
    const a = this.items;
    if (a.length === 0) return undefined;
    const result = a[0];
    const last = a.pop()!;
    if (a.length === 0) return result;
    a[0] = last;
    let i = 0;
    while (2 * i + 1 < a.length) {
      let child = 2 * i + 1;
      if (child + 1 < a.length && this.compare(a[child + 1], a[child]) < 0) child++;
      if (this.compare(a[i], a[child]) <= 0) break;
      [a[i], a[child]] = [a[child], a[i]];
      i = child;
    }
    return result;
  }
}
```

### Worked problem: kth largest value

Keep only the largest `k` values seen so far in a min-heap. Its root is the smallest among those retained values, hence the kth largest overall at the end.

```ts
function kthLargest(values: ReadonlyArray<number>, k: number): number {
  if (!Number.isInteger(k) || k < 1 || k > values.length) {
    throw new RangeError("k must be an integer from 1 through values.length");
  }
  const heap = new MinHeap<number>((a, b) => a - b);
  for (const value of values) {
    heap.push(value);
    if (heap.size > k) heap.pop();
  }
  return heap.peek()!;
}
```

For `[3, 2, 1, 5, 6, 4]`, `k = 2`, the retained top-two sets progress as `{3}`, `{2,3}`, `{2,3}`, `{3,5}`, `{5,6}`, `{5,6}`. Answer: `5`. Duplicates count separately. Sorting is an `O(n log n)` alternative; this takes `O(n log(k + 1))` time and `O(k)` space.

**K-way merge:** put each sorted stream's first item in a heap. Remove the minimum, output it, and insert the next item from that same stream. For `N` total items and `k` streams, time is `O(N log(k + 1))`, heap space `O(k)`.

**Median from a stream:** maintain a max-heap for the lower half and a min-heap for the upper half. Keep their sizes within one and every lower-half value at most every upper-half value. The median comes from the roots; insertions cost `O(log n)`, queries `O(1)`.

**Scheduling:** a priority queue selects the next deadline or highest-priority task. It does not itself guarantee fairness: a continuous flow of high-priority work can starve other tasks.

## 12. Graphs

A graph contains vertices and edges. Edges may be directed or undirected and may carry weights. Graphs represent roads, dependencies, friendships, and state transitions. The model matters: a road length and a dependency arrow need different algorithms.

An adjacency list stores each vertex's neighbors in `O(V + E)` space. An adjacency matrix uses `O(V²)` space but answers edge-existence queries by direct indexing. An undirected adjacency list normally stores each edge twice.

```text
0 ─── 1 ─── 3
│           │
└──── 2 ────┘

adjacency list:
0: [1, 2]   1: [0, 3]   2: [0, 3]   3: [1, 2]
BFS layers from 0: {0}, {1, 2}, {3}
```

### Worked problem: unweighted shortest path

BFS explores by increasing number of edges from the start. When it discovers a vertex for the first time, it has found a shortest path to it. Mark visited when enqueuing, preventing many parents from queuing the same vertex.

```ts
function shortestPath(
  graph: ReadonlyArray<ReadonlyArray<number>>, start: number, target: number,
): number[] | null {
  const parent = Array<number>(graph.length).fill(-1);
  const queue: number[] = [start];
  parent[start] = start;
  for (let head = 0; head < queue.length; head++) {
    const vertex = queue[head];
    if (vertex === target) {
      const path: number[] = [];
      for (let at = target; at !== start; at = parent[at]) path.push(at);
      path.push(start);
      return path.reverse();
    }
    for (const neighbor of graph[vertex]) {
      if (parent[neighbor] !== -1) continue;
      parent[neighbor] = vertex;
      queue.push(neighbor);
    }
  }
  return null;
}
```

The illustrated graph returns `[0, 1, 3]` for start `0`, target `3` with that neighbor order. `[0, 2, 3]` is equally short. An unreachable target returns `null`; a start equal to the target returns `[start]`. Time is `O(V + E)` and auxiliary space is `O(V)`.

DFS follows one branch until it must backtrack. It is useful for connectivity, ordering, and cycle detection, but its first discovered path need not be shortest. Running a traversal from each still-unvisited vertex counts connected components in an undirected graph. Directed graphs require distinguishing weak connectivity from strong connectivity.

### Worked problem: dependency ordering

For a directed dependency `u → v`, `u` must appear before `v`. Kahn's algorithm repeatedly processes vertices with indegree zero. Removing their outgoing edges can make other vertices ready.

```ts
function topologicalOrder(graph: ReadonlyArray<ReadonlyArray<number>>): number[] | null {
  const indegree = Array<number>(graph.length).fill(0);
  for (const neighbors of graph) for (const v of neighbors) indegree[v]++;
  const queue: number[] = [];
  for (let v = 0; v < graph.length; v++) if (indegree[v] === 0) queue.push(v);
  for (let head = 0; head < queue.length; head++) {
    for (const next of graph[queue[head]]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }
  return queue.length === graph.length ? queue : null;
}
```

For `[[1,2], [3], [3], []]`, one answer is `[0,1,2,3]`. In a cycle `0 → 1 → 0`, neither vertex becomes ready, so the function returns `null`. Time `O(V + E)`, space `O(V)`. Multiple valid orders can exist.

Directed DFS cycle detection instead tracks unvisited, active, and finished vertices. An edge to an active vertex closes a cycle; an edge to a finished vertex does not. In a simple undirected graph, DFS must ignore the edge back to its parent.

### Weighted shortest paths

BFS minimizes edge count, not arbitrary weight. Dijkstra finalizes the unsettled vertex with smallest tentative distance. Nonnegative weights make this safe: extending another unfinished path cannot reduce it below the current minimum.

```text
S --4--> A
|        ^
1        | 2
v        |
B -------+

S to A directly costs 4; S to B to A costs 3.
One edge is not necessarily cheaper than two.
```

```ts
type WeightedEdge = { to: number; weight: number };

function dijkstra(
  graph: ReadonlyArray<ReadonlyArray<WeightedEdge>>, start: number,
): number[] {
  const distance = Array<number>(graph.length).fill(Infinity);
  const pending = new MinHeap<{ vertex: number; distance: number }>(
    (a, b) => a.distance - b.distance,
  );
  distance[start] = 0;
  pending.push({ vertex: start, distance: 0 });
  while (pending.size > 0) {
    const current = pending.pop()!;
    if (current.distance !== distance[current.vertex]) continue;
    for (const edge of graph[current.vertex]) {
      const candidate = current.distance + edge.weight;
      if (candidate < distance[edge.to]) {
        distance[edge.to] = candidate;
        pending.push({ vertex: edge.to, distance: candidate });
      }
    }
  }
  return distance;
}
```

The contract requires all weights to be finite and nonnegative. This implementation inserts improved distances instead of modifying heap entries, so it skips stale entries when popped. Unreachable vertices remain `Infinity`. Time is `O(V + E log(E + 1))`, and auxiliary space is `O(V + E)` for this lazy heap implementation; for simple connected graphs this is commonly expressed as `O((V + E) log V)` time.

Bellman-Ford supports negative edges. Repeatedly relax every edge for up to `V - 1` passes. After pass `i`, all shortest paths requiring at most `i` edges have been accounted for. Another possible relaxation from a reachable vertex reveals a reachable negative cycle; affected destinations have no finite shortest-path minimum. Time is `O(VE)`, distance storage `O(V)`. A DAG allows shortest-path relaxation in topological order in `O(V + E)`, even with negative edges.

### Union-find and minimum spanning trees

Union-find tracks disjoint components. `find(x)` returns a component representative; `union(a,b)` merges components. Path compression shortens later searches, and union by size attaches the smaller tree under the larger. Together these give amortized `O(α(V))` per operation, where the inverse Ackermann function grows extremely slowly.

For edges `(0,1), (1,2), (2,0)`, the first two unions merge three vertices. The final edge joins vertices already in the same component, detecting an undirected cycle.

A minimum spanning tree connects every vertex of a connected, undirected weighted graph with minimum total edge weight. It does not minimize all distances from one source. Kruskal sorts edges by weight and adds an edge only when union-find says it connects different components. Its safe-choice argument uses a cut: a lightest edge crossing a component boundary can belong to an optimum tree. Time is `O(E log E)` plus union-find work. Disconnected input produces a minimum spanning forest.

Prim grows a single tree by selecting a cheapest edge crossing from its vertices to outside vertices. With adjacency lists and a binary heap, a standard implementation runs in `O((V + E) log V)` time. Negative weights are acceptable for MST algorithms; Dijkstra's nonnegative requirement is specific to shortest paths.

## 13. Recursion and backtracking

Backtracking explores a decision tree while keeping only the current partial candidate. Its cycle is choose, explore, undo. Undo restores the caller's state so sibling branches remain independent. Pruning stops a branch as soon as it cannot lead to a valid result.

### Worked problem: generate all subsets

At each index, either exclude or include the current value. There are two choices for each of `n` positions, hence `2ⁿ` subsets when input values are distinct.

```text
                            []
                   exclude 1 / \ include 1
                           []  [1]
                 exclude 2 /\  /\ include 2
                          [] [2] [1] [1,2]
```

```ts
function subsets(values: ReadonlyArray<number>): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  function visit(index: number): void {
    if (index === values.length) {
      result.push([...path]);
      return;
    }
    visit(index + 1);
    path.push(values[index]);
    visit(index + 1);
    path.pop();
  }
  visit(0);
  return result;
}
```

For `[1,2]`, the output order is `[[], [2], [1], [1,2]]`. Copying output paths makes total time and output space `O(n2ⁿ)`; auxiliary path and stack space are `O(n)`. Empty input has one subset, the empty subset. Duplicate input values produce duplicate value-subsets unless branches are adjusted to skip repeated choices.

### Related search spaces

**Permutations:** choose any unused element at each position. There are `n!` outputs for distinct values, with `O(n · n!)` output work. A boolean used-array avoids choosing one index twice. For duplicates, sort and skip a duplicate whose previous equal value has not been used on this branch.

**Combinations:** choose indexes in increasing order to avoid generating different orders of the same set. Choosing `k` values from `n` produces `C(n,k)` outputs; copying each costs `O(k)`.

**N-Queens:** place one queen per row. Columns and diagonals `row - col` and `row + col` identify conflicts. Reject attacked squares before recursing. For `n = 4`, column sequences `[1,3,0,2]` and `[2,0,3,1]` are the two solutions. Column pruning gives an `O(n!)` upper bound on candidate arrangements, with additional bookkeeping and output costs.

**Word search:** state is `(row, col, characterIndex)` plus which cells are already used on the current path. Mark a cell, explore matching neighbors, then unmark it. A global visited set is wrong because a cell may be reused by a different candidate path. For a grid with `R × C` cells and word length `L`, `O(RC · 4ᴸ)` is a loose upper bound.

The key distinction from dynamic programming is state reuse. Different paths may reach the same position while having different visited sets; memoizing by position alone can incorrectly merge unequal states.

## 14. Dynamic programming

Dynamic programming stores answers to subproblems instead of recomputing them. The state must contain enough information that future choices no longer depend on how that state was reached. A recurrence describes how smaller states determine a larger one.

Top-down memoization starts at the requested answer and recursively computes needed states. Bottom-up tabulation processes states in dependency order. Both can implement the same recurrence. Space optimization is valid only after identifying which old states are still needed.

### Worked problem: ways to climb stairs

Allowed moves are one or two steps. Every path to step `n` ends with a move from `n - 1` or `n - 2`, so `ways(n) = ways(n - 1) + ways(n - 2)`. These last-move categories are disjoint and cover all possibilities.

```text
ways(4)
├── ways(3)
│   ├── ways(2)   ← repeated work
│   └── ways(1)
└── ways(2)       ← repeated work

n:       0  1  2  3  4  5
ways:    1  1  2  3  5  8
```

There is one way to climb zero stairs: take no moves. Naive recursion repeats subtrees exponentially. Memoization stores `n + 1` answers and computes each once. A table does the same work iteratively. Only the last two answers are needed to compute the next.

```ts
function climbWays(n: number): bigint {
  if (!Number.isInteger(n) || n < 0) throw new RangeError("n must be nonnegative");
  let previous = 1n;
  let current = 1n;
  for (let step = 2; step <= n; step++) {
    [previous, current] = [current, previous + current];
  }
  return current;
}
```

`climbWays(5)` returns `8n`. This performs `O(n)` additions and uses a constant number of stored integers. Because the integers grow to `Θ(n)` bits, bit-level storage is `O(n)` and ordinary bigint addition yields `O(n²)` total bit work; the common `O(n)` time and `O(1)` space description treats arithmetic values as fixed-size units.

### Worked problem: minimum coins for an amount

**Example:** coins `[1,3,4]`, amount `6` → `2`, using `3 + 3`. Greedily selecting the largest coin gives `4 + 1 + 1`, which is worse.

State `dp[a]` is the fewest coins totaling exactly `a`. The final coin can be any denomination `c <= a`, so `dp[a] = min(dp[a-c] + 1)`. Base case: `dp[0] = 0`; unreachable amounts start at infinity.

```ts
function minimumCoins(coins: ReadonlyArray<number>, amount: number): number {
  if (!Number.isInteger(amount) || amount < 0 ||
      coins.some(c => !Number.isInteger(c) || c <= 0)) {
    throw new RangeError("amount must be nonnegative and coins must be positive integers");
  }
  const dp = Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}
```

For the example, `dp[0..6] = [0,1,2,1,1,2,2]`. An amount of zero returns zero even with no denominations. Coins `[2]`, amount `3` returns `-1`. Time is `O(A · C)` and space `O(A)`, where `A` is the amount and `C` the denomination count. This is pseudopolynomial: numeric amount `A` needs only `O(log A)` bits to encode.

### Worked problem: longest common subsequence

For strings `"abcde"` and `"ace"`, the answer is `3`. Let `dp[i][j]` be the LCS length for the first `i` characters of the first string and first `j` of the second. If the last characters match, use the best answer without either last character plus one. Otherwise, omit one of the two last characters and take the better answer.

```text
           empty  a  c  e
empty        0    0  0  0
a            0    1  1  1
b            0    1  1  1
c            0    1  2  2
d            0    1  2  2
e            0    1  2  3
```

```ts
function lcsLength(first: string, second: string): number {
  const a = Array.from(first);
  const b = Array.from(second);
  let previous = Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const current = Array<number>(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      current[j] = a[i - 1] === b[j - 1]
        ? previous[j - 1] + 1
        : Math.max(previous[j], current[j - 1]);
    }
    previous = current;
  }
  return previous[b.length];
}
```

Time is `O(mn)` and DP-row storage is `O(n)`; the code-point arrays make total auxiliary space `O(m + n)`. Returning the actual subsequence usually requires storing predecessor decisions or reconstructing from a full table; this function returns only its length.

### Important DP families

| Family | State and transition | Critical detail |
| --- | --- | --- |
| 0/1 knapsack | `dp[i][w]`: best value using first i items within capacity w; skip or take item i | Each item can be used once; a 1D table updates capacities downward |
| Unbounded knapsack | `dp[w]`: best value at capacity w; reuse the current item | An upward capacity loop allows repeated use |
| Grid DP | `dp[r][c]` depends on above and left for right/down moves | Obstacles contribute zero paths; initialize boundaries carefully |
| Subsequence DP | State tracks consumed prefixes or best ending at a position | Contiguity is not required |
| Interval DP | `dp[l][r]` combines splits of a segment | Process shorter intervals first |
| Tree DP | Compute a small answer-state set for each subtree | Parent combines children after their states are known |
| State-machine DP | State includes mode, such as holding or not holding a stock | Use previous-step states to avoid unintended same-step transitions |

**0/1 knapsack example:** weights `[2,3,4]`, values `[4,5,7]`, capacity `5` gives value `9` from the first two items. Iterating capacity upward for the first item would allow using its weight-two value-four contribution twice, violating the one-copy rule. Complexity is `O(nW)` time and `O(W)` optimized space.

**Grid paths example:** in a `3 × 3` grid with the center blocked, only the two edge routes remain when moves are right or down. Each open cell adds counts from above and left. Time `O(RC)`, space `O(C)` with a rolling row.

**Interval example:** matrix-chain multiplication chooses the final split `k` of matrices `l..r`. Add the best costs of both subchains plus `dimensions[l-1] × dimensions[k] × dimensions[r]`. All split positions must be considered. Time `O(n³)`, space `O(n²)`.

**Tree example:** maximum sum of nonadjacent tree nodes keeps two states per node: `take = value + skip(left) + skip(right)` and `skip = max(take,skip) of left + max(take,skip) of right`. Allowing the empty selection handles negative node values. Time `O(n)`.

**State-machine example:** for unlimited stock transactions with no fee, `cashToday = max(cashYesterday, holdYesterday + price)` and `holdToday = max(holdYesterday, cashYesterday - price)`. Fees, cooldowns, or transaction limits change the state or transition; they are not minor implementation details.

## 15. Greedy algorithms and pattern selection

A greedy algorithm commits to a local choice without exploring alternatives. It needs a proof that an optimum solution can agree with that choice. An exchange argument transforms an optimum solution to include the greedy choice without worsening the result.

### Worked problem: maximum number of non-overlapping meetings

Assume meetings are half-open intervals with `start < end`. Sort by finishing time and choose each meeting whose start is at least the previous chosen end. If an optimum schedule starts with a later-finishing meeting, replace it with the earliest-finishing one. This leaves at least as much room for the remainder, proving the first choice safe. Repeating the argument proves the full algorithm.

For `[(1,4), (2,3), (3,5), (5,7)]`, choose `(2,3)`, `(3,5)`, `(5,7)`: three meetings. Sorting by start alone might choose `(1,4)` first and produce only two. Time `O(n log n)`, with a linear scan after sorting.

| Signal in the problem | Candidate approach | Condition to check |
| --- | --- | --- |
| Pair in sorted data | Two pointers | Pointer movement safely discards candidates |
| Longest contiguous valid region | Sliding window | Validity can be maintained as boundaries move |
| Repeated range sums | Prefix sums | Updates are absent or handled separately |
| First feasible threshold | Binary search | Feasibility is monotonic |
| Next larger/smaller item | Monotonic stack | Unresolved items can be discarded permanently |
| Top k or repeated minimum | Heap | Full ordering is unnecessary |
| Fewest unweighted steps | BFS | All edges have equal cost |
| Prerequisite ordering | Topological sort | Directed graph must be acyclic |
| Connectivity as edges arrive | Union-find | Deletions need a different or extended approach |
| Enumerate valid assignments | Backtracking | Exponential output or search may be unavoidable |
| Repeated equivalent subproblems | DP | State captures all future-relevant information |
| Locally optimal choice | Greedy | An exchange/cut argument proves the choice safe |

Divide and conquer separates a problem into smaller pieces and combines their solutions. Merge sort combines sorted halves; binary search needs only one half. DP becomes useful when subproblems overlap, while ordinary divide and conquer need not cache anything.

## 16. Node.js, debugging, and testing

### Concurrency and the event loop

Node.js runs JavaScript callbacks on an event-loop thread while asynchronous facilities handle waiting and some other work. An `async` function does not automatically move CPU computation to another thread. A long synchronous loop still delays other callbacks. CPU-heavy work can be partitioned or moved to workers; asynchronous I/O lets other requests progress while an operation waits. The runtime's worker pool and application-created worker threads are different mechanisms. See [Node.js: Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop).

```text
request A ──> start I/O ───────── waiting ─────────> callback A
request B ─────────────> execute callback B
                              ^
             possible while A is waiting on I/O
```

Concurrency means work is in progress during overlapping time periods. Parallelism means work actually executes simultaneously. `Promise.all` joins promises; it does not by itself provide CPU parallelism or limit how many network operations were started.

### A debugging example: a slow endpoint

Suppose an endpoint compares every incoming record with every stored record. At 100 records it seems fine; at 100,000 it becomes unusable. Timing individual requests and profiling CPU work distinguishes expensive computation from I/O waits. Replacing repeated scans with an ID-indexed map can change `O(nm)` comparison work to expected `O(n + m)`, at the cost of an index consuming memory.

A useful debugging sequence is reproduce the failure, reduce the input, state the violated invariant, and test the smallest counterexample. For the sliding-window bug that moves `left` backward, `"abba"` is enough to expose the problem. Logging entire production payloads is rarely needed to establish an index invariant.

### Testing algorithms meaningfully

Example tests check known outputs. Property tests check rules across many inputs. Differential tests compare an optimized algorithm with a simple brute-force oracle on small inputs.

| Algorithm | Useful property or counterexample |
| --- | --- |
| Reverse list | Reversing twice restores values and original node identities |
| Lower bound | All prior values are below target; all later values are at least target |
| Merge intervals | Output is sorted, disjoint, and covers the same points |
| Heap | Repeated pops produce sorted values with the same multiplicities |
| Shortest path | Every consecutive pair is an edge and path length matches BFS distance |
| Minimum coins | Compare small amounts with a BFS over reachable amounts |
| LCS | Answer is symmetric and at most the shorter input length |

TypeScript types do not validate external JSON at runtime. Boundary validation must check shapes, ranges, and invariants before algorithm code uses the data. Useful edge categories include empty input, one item, duplicates, negative values, unreachable states, cycles, and extremely skewed structures.

## 17. Databases and distributed systems

### Indexes and transactions

A database index trades additional storage and write work for faster reads. A B-tree keeps keys ordered across pages, supporting equality and range access without scanning every row. A composite key such as `(account_id, created_at)` orders records by account first and time within an account. Whether a query benefits depends on its predicates, selectivity, and the query planner; inspect the execution plan instead of assuming every index helps. See [PostgreSQL's index documentation](https://www.postgresql.org/docs/current/indexes.html).

A transaction groups operations into one logical unit. Atomicity prevents partial completion; isolation controls interference among concurrent transactions; durability concerns survival of committed work; consistency concerns preserving declared data rules. Isolation levels differ, so simply using a transaction does not prevent every concurrency anomaly.

**Worked scenario: last available seat.** Two requests both read `available = 1`, then both book. A plain read-followed-by-write races. An atomic conditional update such as decrementing only where `available > 0`, checked for an affected row and combined with booking insertion in the same transaction, makes the database arbitrate the conflict. A uniqueness constraint on a seat allocation supplies another enforceable invariant.

### Caches

In cache-aside, the application checks the cache, loads the database on a miss, and stores the result. The difficult question is what happens when underlying data changes. TTL bounds how long an entry is retained, while explicit invalidation can remove known stale entries sooner. Concurrent reads and writes can still reintroduce stale data without a careful policy.

```text
request ──> cache hit ───────────────> response
              |
             miss
              v
           database ──> populate cache ──> response
```

LRU bounds capacity; TTL bounds age. Neither is a complete correctness guarantee. A cache stampede occurs when many requests miss the same expensive key together; request coalescing lets one load serve multiple waiters. Hot keys can overload a single cache shard even when total capacity looks adequate.

### Replication, partitioning, and consistency

Replication stores copies to improve availability or read capacity. Partitioning distributes different keys across machines to increase storage or write capacity. They solve different problems and are often combined. A shard key must distribute load as well as data; a popular tenant can dominate one partition.

Replica lag means a write acknowledged by one node may not yet appear on another. Read-your-writes behavior can require routing recent reads appropriately or choosing a stronger consistency mechanism. During a network partition, a system cannot simultaneously guarantee linearizable reads/writes and successful responses to every request at every nonfailed node; the practical design must define which operations wait or fail.

### Queues, retries, and idempotency

A queue separates request acceptance from background processing. If arrivals exceed service capacity for a sustained period, backlog grows; adding a queue does not fix insufficient throughput. Bound backlog, monitor queue age, and apply backpressure or admission limits.

With at-least-once delivery, a consumer may receive the same message more than once. An idempotency key identifies a logical operation. A durable uniqueness constraint can prevent duplicate execution, but a separate “check then write” sequence can race. Record the key and the protected effect atomically where possible. External side effects may need an outbox, deduplication support, or a compensating workflow.

The outbox pattern writes the business change and an event record in one database transaction. A publisher later sends that event. A crash after sending but before marking it sent can still cause duplicate delivery, so consumers remain idempotent.

Retries help transient failures but amplify overload. Use deadlines, bounded attempts, exponential backoff with jitter, and a policy for non-retryable errors. A circuit breaker temporarily stops repeated calls to a failing dependency; it does not repair that dependency.

### Worked design: distributed rate limiter

Suppose a service allows a burst of 100 requests and then replenishes 10 requests per second per account. A token bucket stores available tokens and the last refill time. On a request, calculate `tokens = min(100, tokens + elapsedSeconds × 10)` and accept only if at least one token is available, consuming one.

Across multiple API servers, read-refill-consume must be atomic in shared state or each server can approve the same token. Define clock handling, key expiry, and what to do if shared storage is unavailable. A fixed-window counter is simpler but can allow twice the nominal window limit near a boundary. A sliding log is precise but stores individual timestamps; a token bucket stores constant state per account.

### Capacity and observability

In a stable system, Little's Law relates average in-flight work `L`, throughput `λ`, and average latency `W`: `L = λW`. At 200 requests/second and 0.25 seconds average latency, average concurrency is about 50. This is not a safe maximum capacity: bursts and tail latency need headroom.

Track throughput, error rate, latency percentiles, saturation, and queue age. Averages hide slow tails. Trace IDs connect work across services; metrics show trends, traces show paths, and logs explain particular events.

## 18. Machine learning foundations

Artificial intelligence is the broad study of systems performing tasks associated with intelligence. Machine learning fits behavior from data rather than specifying every decision manually. Deep learning uses neural networks with multiple learned transformations. Generative models produce outputs such as text, images, or audio; not all ML is generative.

### Learning settings

| Setting | What the training signal contains | Example |
| --- | --- | --- |
| Supervised learning | Inputs paired with target labels or values | Predict whether a support ticket needs escalation |
| Unsupervised learning | Data without target labels for the desired task | Group similar documents |
| Self-supervised learning | Targets constructed from the data itself | Predict the next token from prior tokens |
| Reinforcement learning | Rewards associated with actions or trajectories | Learn a policy for a sequential control task |

A model maps input features to an output. Training adjusts parameters to reduce a loss. For a simple linear model `prediction = wx + b`, squared error is `(prediction - target)²`. The gradient tells how changing each parameter changes the loss locally; a learning-rate-scaled step moves against that gradient.

**Numerical example:** let `x = 2`, target `5`, `w = 1`, and `b = 0`. Prediction is `2`, error is `-3`, and loss is `9`. Gradients are `dL/dw = 2 × (-3) × 2 = -12` and `dL/db = -6`. With learning rate `0.1`, the new parameters are `w = 2.2`, `b = 0.6`. The new prediction is `5`, so loss becomes zero for this one example. A real dataset contains many examples that must be balanced; one successful step does not imply global generalization.

A neural network composes affine transformations with nonlinear activations. Without nonlinearities, stacking linear layers still represents a linear transformation. Backpropagation applies the chain rule to compute gradients efficiently; an optimizer uses them to update weights.

### Generalization and evaluation

Training performance measures fit to seen examples. Validation data guides choices such as architecture and regularization. A held-out test set estimates performance after those choices. Repeatedly tuning to the test set leaks information into model selection.

Overfitting means learning details that do not transfer well to new data. More representative data, regularization, and early stopping can help. Data leakage can also produce deceptively strong results: splitting nearly identical documents across training and test sets lets the model exploit duplication.

For a rare positive class, accuracy can be misleading. If only 1% of tickets need escalation, always predicting “no” achieves 99% accuracy but finds none of them. Precision is `TP / (TP + FP)`; recall is `TP / (TP + FN)`. If 8 of 10 flagged tickets truly need escalation and 20 tickets actually need it, precision is `0.8` and recall is `0.4`. Define conventions for zero denominators before reporting metrics.

### Embeddings and similarity

An embedding represents an item as a vector. Similarity is meaningful only relative to the model's training and the task. A vector database stores vectors and associated metadata and supports similarity retrieval, often using an approximate index to trade some recall for speed.

Cosine similarity compares direction: `dot(a,b) / (length(a) × length(b))`. For `a = [1,0]`, `b = [1,1]`, similarity is `1/√2 ≈ 0.7071`. Vector `[0,1]` has similarity zero to `a`. Zero vectors have no defined direction.

```ts
function cosineSimilarity(a: ReadonlyArray<number>, b: ReadonlyArray<number>): number {
  if (a.length === 0 || a.length !== b.length) throw new RangeError("dimension mismatch");
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) throw new RangeError("zero vector has no cosine");
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

This takes `O(d)` time and `O(1)` auxiliary space for `d` dimensions. Inputs should have magnitudes that avoid floating-point overflow or underflow in these direct norm calculations. Exact comparison with every stored vector costs `O(Nd)`, motivating indexing for large collections. Vectors from unrelated embedding models generally cannot be compared directly even if their dimensions happen to match.

## 19. Transformers and attention

### From text to a next-token distribution

A tokenizer divides text into units such as word fragments, punctuation, or bytes. Tokens are mapped to integer IDs and then embedding vectors. Position information lets the model distinguish different orders of the same tokens. Transformer layers combine information across positions through attention and transform each position with feed-forward blocks. Residual connections and normalization support deep computation. A final projection produces logits: unnormalized scores for possible next tokens. See the visual lesson [Transformers, the technology behind LLMs](https://www.3blue1brown.com/lessons/gpt/).

```text
text → token IDs → embeddings + position information
                              |
              ┌───────────────v──────────────────┐
              │ attention + residual connection  │
              │ feed-forward + residual          │ × layers
              │ normalization within the block   │
              └───────────────┬──────────────────┘
                              v
                     logits → probabilities → next token
```

The exact arrangement of normalization and positional information depends on the architecture. The context window bounds the sequence available to a model invocation; it is not a guarantee that every detail will be used reliably. A generated token extends the sequence before the next prediction.

### Attention with actual numbers

Queries describe what a position is looking for, keys describe what positions can match, and values carry information to combine. Learned projections produce these vectors. Scaled dot products become weights through softmax; weights then average the value vectors. Multiple heads can learn different relationships. Causal masking prevents attending to future tokens during next-token training. See [3Blue1Brown's attention lesson](https://www.3blue1brown.com/lessons/attention/).

```text
Attention(Q,K,V) = softmax(QKᵀ / √dₖ)V

Toy example, dₖ = 1:
query q = [1]
keys    = [1], [2]
values  = [10,0], [0,20]

scores  = [1,2]
weights = [e¹/(e¹+e²), e²/(e¹+e²)] ≈ [0.269,0.731]
output  = 0.269[10,0] + 0.731[0,20] ≈ [2.69,14.62]
```

The result mixes information from both values; it does not simply choose one. The scaling factor controls dot-product magnitude as key dimension grows. Dense attention forms pairwise interactions across `n` positions, yielding quadratic dependence on sequence length in its basic computation. The original formulation is in [Attention Is All You Need](https://arxiv.org/abs/1706.03762).

### Sampling and inference

Softmax converts logits `zᵢ` to probabilities `exp(zᵢ/T) / Σ exp(zⱼ/T)` for positive temperature `T`. Lower temperature sharpens the distribution; higher temperature flattens it. Subtracting the maximum logit before exponentiation gives the same result with better numerical stability. Greedy decoding chooses an argmax rather than dividing by zero at temperature zero.

Top-k sampling keeps a fixed number of highest-scoring candidates. Top-p keeps a smallest high-probability set whose cumulative probability reaches a threshold. These change the selection distribution; they do not supply missing knowledge or certify correctness.

Inference can reuse cached keys and values from prior tokens rather than recomputing all earlier representations for every new token. Training changes parameters; ordinary inference uses the supplied context with those parameters. Fluent output can still contain unsupported claims because producing likely continuations is different from verifying them. For a broader explanation of training and inference, see [Andrej Karpathy's introductory LLM talk](https://www.youtube.com/watch?v=zjkBMFhNj_g).

## 20. Retrieval-augmented generation

RAG supplies retrieved external material to a generator. This allows answers to draw on documents that need not be encoded in model parameters. It can improve access to evidence, but retrieval errors and unsupported generation remain possible. The foundational approach is described in [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401).

### Worked design: an internal documentation assistant

The following is an example design, with choices to evaluate against the actual collection and queries.

```text
INGESTION
documents → parse → chunk → embed → searchable index
                └────── metadata: source, version, permissions ──┘

QUESTION ANSWERING
question + user identity
          |
          v
authorized retrieval → candidate ranking → selected evidence
                                               |
                                               v
                                    generated answer + citations
```

**Chunking:** split documents into retrievable units. Tiny chunks may omit definitions or conditions; huge chunks may dilute useful evidence and consume context. Preserve headings, table boundaries, source offsets, and parent-document IDs. Overlap can retain boundary context but introduces duplication. There is no universally optimal chunk size.

**Retrieval:** keyword search helps exact identifiers such as an error code, while vector similarity can find paraphrases. A hybrid system combines candidates from both. Raw scores may use incompatible scales; rank-based fusion or calibrated scoring avoids adding incomparable numbers blindly.

**Filtering:** enforce authorization before any document text reaches the model. An account filter supplied only by the model is insufficient; trusted application identity determines access. Tenant, document version, and product metadata can also narrow irrelevant matches.

**Reranking:** an initial retriever cheaply selects candidates, and a more expensive scorer compares each candidate with the question. Retrieve broadly enough to include the answer, then select compact, nonduplicated evidence for generation. A reranker cannot rescue a relevant document that never entered its candidate set.

**Context construction:** preserve source IDs and attach citations to the evidence used. Contradictory or stale documents require a version policy. When evidence is insufficient, report that limitation instead of treating a plausible completion as a sourced answer.

**Updates:** tie chunks to document versions so deletion and replacement propagate to the index. Changing the embedding model typically requires re-embedding the corpus or maintaining compatible separate indexes. Monitor indexing lag as part of freshness.

### Worked evaluation example

Suppose a labeled question has three relevant chunks `{A,B,C}`. The first five retrieved chunks are `[A,X,B,Y,Z]`. Precision@5 is `2/5 = 0.4`, recall@5 is `2/3 ≈ 0.667`, and reciprocal rank is `1` because the first relevant result is first. If the first relevant result were third, reciprocal rank would be `1/3`.

Retrieval metrics and answer metrics reveal different failures. If the answer exists but recall is low, fix ingestion, filtering, or retrieval. If the right evidence is present but the answer contradicts it, improve evidence use and generation evaluation. Check citation support, completeness, latency, cost, and behavior on questions with no answer. Split evaluation by document family or time where necessary to reduce leakage.

### RAG versus fine-tuning

RAG changes which evidence is available at request time. Fine-tuning changes model parameters through additional training and can shape behavior or task performance. They can be combined. A frequently changing handbook usually needs a document update path even if the model is fine-tuned; parameter updates are not a substitute for source-level permissions and deletion handling.

**Exercise with solution:** a chatbot cites the correct page but invents a refund deadline. First check whether the retrieved chunk contains that deadline or merely mentions refunds. If absent, the defect may be chunk selection. If present but contradicted, it is an evidence-use defect. A citation that points to a related page does not establish support for a specific claim.

## 21. Agents and MCP

### Agents and workflows

A workflow follows application-defined steps. An agent uses model output to choose some next actions, often calling tools and incorporating their results in a loop. This flexibility is useful when the necessary steps depend on what the system discovers, but adds latency, cost, and more failure paths. Fixed, predictable processing often benefits from ordinary code. See [Anthropic's Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents).

```text
task → model decision → tool request → validation and authorization
           ^                                      |
           |                                      v
           └──────── recorded tool result ← execution

finish when: answer complete, budget reached, deadline reached, or failure
```

Tool calling is a structured request, not direct execution by the model. Application code decides whether to run it. Short-lived state records the current task; persistent memory stores information across tasks. A plan is provisional and must be updated when tool results contradict assumptions. Multiple agents add communication and coordination costs, so independent subtasks and measurable benefits matter more than agent count.

### Worked design: read-only order support

Consider a system that answers order-status questions. A lookup tool takes a validated order ID, while authenticated application state supplies the account ID. The model cannot choose a different account. A missing order, a denied lookup, and a temporary database failure are different results and should not collapse into one vague error.

Useful invariants are: every lookup belongs to the active account; a reported shipment status came from a successful lookup; a failed lookup cannot be described as success; and the loop stops after a bounded number of attempts. Tool outputs are data, including any instruction-like text returned from a document or database.

If the same assistant can cancel orders, that is a different capability with a write effect. The application needs an authorization policy, a review step where required, and an idempotent execution path. A model's repeated decision to cancel must not create multiple downstream effects.

Evaluation should inspect completed tasks and actual tool traces. Cases include unknown IDs, timeouts, denied access, repeated tool requests, contradictory results, and irrelevant instructions embedded in retrieved text. Measure completion accuracy and unauthorized-action rate separately; a polished answer alone does not show that the right operation occurred.

### Model Context Protocol

MCP standardizes how applications connect to external capabilities. A host application manages clients; clients communicate with servers that expose tools, resources, and reusable interaction templates called prompts. Tools perform operations; resources supply context. These protocol concepts do not themselves decide whether a user is allowed to perform an operation.

```text
host application
├── MCP client → document server → search/read tools
├── MCP client → database server → permitted queries
└── MCP client → issue server    → issue resources and tools
```

Local integrations may communicate through standard input/output; remote integrations use HTTP transport. Authentication identifies callers, while authorization restricts capabilities and data. Discovery, version compatibility, and transport details must match the supported specification. The official [MCP architecture documentation](https://modelcontextprotocol.io/docs/learn/architecture) is the implementation reference; this guide intentionally describes the architecture without fixing a changing wire-level handshake.

**Design exercise:** exposing a SQL tool does not mean exposing arbitrary SQL under an administrator account. A scoped read interface with parameter validation can answer a support question while keeping the server's authority aligned with the task.

## 22. Practice problems and solution sketches

These exercises extend the worked examples. Difficulty is approximate and depends on familiarity. Each includes an approach and expected complexity so the result can be reviewed independently.

### Easy: missing value

**Problem:** an array contains distinct integers from `0..n` with one missing. For `[3,0,1]`, return `2`.

**Solution:** start with `n`; for each index `i`, add `i - values[i]`. All present values cancel, leaving the missing one. Time `O(n)`, space `O(1)` under safe-integer arithmetic. This depends on distinct, in-range values; duplicates invalidate the reasoning. An XOR variant needs care with JavaScript's 32-bit bitwise conversion.

### Easy: first non-repeating character

**Problem:** return the first code point appearing once in `"swiss"`, or `null` if none exists. Answer: `"w"`.

**Solution:** count frequencies in one pass and scan the original order in another. Time expected `O(n)`, space `O(u)` for `u` distinct code points. Returning a UTF-16 offset instead of a code-point position requires a different indexing contract.

### Medium: product except self

**Problem:** for `[1,2,3,4]`, return `[24,12,8,6]` without division.

**Solution:** store products strictly to the left in the output, then scan backward while multiplying by a running product strictly to the right. Time `O(n)`, auxiliary space `O(1)` excluding output. A zero works naturally: `[1,0,3]` gives `[0,3,0]`; two zeros make every result zero. Intermediate products must remain numerically safe.

### Medium: longest consecutive run

**Problem:** `[100,4,200,1,3,2]` has answer `4`, representing `1,2,3,4`.

**Solution:** put distinct values in a set. Begin a forward scan only at a value whose predecessor is absent. Every unique value is visited in one run, so expected time is `O(n)`, space `O(n)`. Starting a scan from every input value can become quadratic, especially with duplicate starts; iterate the set.

### Medium: number of islands

**Problem:** count connected land regions in a grid using only horizontal and vertical adjacency.

```text
1 1 0
0 1 0     two islands
0 0 1
```

**Solution:** each unvisited land cell starts a BFS/DFS that marks its entire region. Time `O(RC)`, worst-case auxiliary space `O(RC)`. Mutating visited land to water saves a separate visited matrix but changes the input. Diagonal cells do not connect under this contract.

### Medium: longest increasing subsequence

**Problem:** `[10,9,2,5,3,7,101,18]` has length `4`.

**Solution:** maintain `tails[len-1]`, the smallest possible ending value of an increasing subsequence of that length among processed items. Replace the first tail at least as large as each new value, or append if none exists. Smaller tails leave more future extension opportunities. Time `O(n log n)`, space `O(n)`. `tails` gives the correct length but is not necessarily an actual subsequence; reconstruct with predecessor indexes if needed. Using the first greater value instead changes behavior for duplicates and supports non-decreasing sequences.

### Medium: coin combinations

**Problem:** with distinct denominations `[1,2,5]`, how many unordered combinations total `5`? Answer: `4`: `5`, `2+2+1`, `2+1+1+1`, and five ones.

**Solution:** `dp[0] = 1`. For each coin, scan amounts upward and add `dp[a-coin]` into `dp[a]`. Processing coins outside amounts counts each multiset once. Reversing loop order can count different orders as different sequences. Time `O(CA)`, space `O(A)`; use exact large integers if counts grow.

### Hard: minimum window covering a multiset

**Problem:** source `"ADOBECODEBANC"`, target `"ABC"` → `"BANC"`.

**Solution:** count required character multiplicities. Expand right until all required counts are satisfied, then shrink left while preserving validity and record the shortest window. Each pointer moves at most `n` times, so expected time is `O(n + m)`. Repeated target characters matter: target `"AABC"` requires two A occurrences. Define empty target to return the empty string. A code-point array implementation uses `O(n + m)` space; bookkeeping alone uses space proportional to distinct characters.

### Hard: trapping rainwater

**Problem:** nonnegative heights `[0,1,0,2,1,0,1,3,2,1,2,1]` trap `6` units.

**Solution:** water at index `i` equals `max(0, min(maxLeft, maxRight) - height[i])`. Prefix/suffix maxima yield `O(n)` time and `O(n)` space. Two pointers can reduce auxiliary space to `O(1)` by finalizing the side whose running maximum is smaller: the other side already supplies a boundary at least that high. Negative heights or a different geometry require a different model.

### Hard: largest rectangle in a histogram

**Problem:** heights `[2,1,5,6,2,3]` → area `10`, using the bars of heights `5` and `6`.

**Solution:** keep increasing bar indexes on a stack. When a lower height arrives at index `i`, pop taller bars. For each popped height, the remaining stack top is the previous shorter boundary, so width is `i - leftBoundary - 1`. An ending zero-height sentinel flushes remaining bars. Time `O(n)`, space `O(n)`. A consistent policy for equal heights avoids width mistakes.

### Hard: edit distance

**Problem:** transform `"horse"` into `"ros"` using minimum insertions, deletions, and substitutions. Answer: `3`.

**Solution:** `dp[i][j]` is the cost for the first `i` and `j` characters. Matching final characters copy the diagonal. Otherwise use one plus the minimum of deletion, insertion, and substitution predecessors. Base row and column are `0,1,2,...`. Time `O(mn)`, full-table space `O(mn)` or `O(min(m,n))` DP storage for length-only output. Recovering the operations needs stored decisions or a more involved reconstruction.

### Hard: merge k sorted lists

**Problem:** merge `[1,4,5]`, `[1,3,4]`, and `[2,6]` into `[1,1,2,3,4,4,5,6]`.

**Solution:** store each nonempty list's head in a min-heap, repeatedly remove the smallest, and insert its successor. Time `O(N log(k+1))`, heap space `O(k)`. Reusing nodes mutates links; allocating new nodes preserves inputs but adds output allocation. Pairwise divide-and-conquer merging is an alternative with the same asymptotic time.

### System design: background job runner

**Problem:** execute jobs with bounded concurrency and retry temporary failures.

**Solution outline:** persist jobs with stable IDs, enqueue references, let workers claim jobs using a lease, renew leases for long work, and acknowledge after the durable result. Expired leases allow recovery after crashes. Include idempotency for repeated delivery, attempt limits, delayed retries, and a failed-job queue. Use priority scheduling only when starvation behavior is defined. Demonstrate recovery from a crash after the effect but before acknowledgment.

### AI design: documentation search quality

**Problem:** users search for an exact internal error code but vector search returns conceptually similar, irrelevant pages.

**Solution outline:** add lexical retrieval for exact identifiers, combine it with semantic candidates, preserve code-bearing chunks, and evaluate on labeled error-code questions. Compare recall before generation and answer support afterward. Increasing model size alone does not ensure the missing document will be retrieved.

## 23. Video lessons and further reading

These links point to instructor or publisher pages verified while preparing this guide on October 1, 2026. MIT and 3Blue1Brown pages include video lessons. They supplement the explanations rather than being prerequisites. Availability and implementation documentation can change.

| Topic | Video or course | Useful focus |
| --- | --- | --- |
| Algorithms and complexity | [MIT: Algorithms and Computation](https://www.youtube.com/watch?v=ZA-tUyM_y7s) | Problem models, correctness, efficiency |
| Full DSA sequence | [MIT 6.006 lecture videos](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/video_galleries/lecture-videos/) | Follow the course across data structures and algorithms |
| Hash tables | [MIT: Hashing](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-4-hashing/) | Hash functions and expected performance |
| Trees | [MIT: Binary Trees, Part 1](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-6-binary-trees-part-1/) | Tree structure and operations |
| Heaps | [MIT: Binary Heaps](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-8-binary-heaps/) | Priority queues and heap invariants |
| BFS | [MIT: Breadth-First Search](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-9-breadth-first-search/) | Layered exploration and shortest paths |
| Weighted paths | [MIT: Dijkstra](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-13-dijkstra/) | Nonnegative weights and distance ordering |
| DP foundations | [MIT: Dynamic Programming, Part 1](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-15-dynamic-programming-part-1-srtbot-fib-dags-bowling/) | Defining states and dependency order |
| DP examples | [MIT: Dynamic Programming, Part 2](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-16-dynamic-programming-part-2-lcs-lis-coins/) | LCS, increasing subsequences, coins |
| Transformer overview | [3Blue1Brown: Transformers](https://www.3blue1brown.com/lessons/gpt/) | Visual path from tokens to predictions |
| Attention | [3Blue1Brown: Attention](https://www.3blue1brown.com/lessons/attention/) | Queries, keys, values, and weighted combinations |
| LLM foundations | [Andrej Karpathy: Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) | Training, inference, capabilities, and limitations |

### Primary technical references

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762): original Transformer paper.
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401): foundational RAG paper.
- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents): workflows, agents, and design tradeoffs.
- [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture): official protocol concepts and current implementation references.
- [Node.js event-loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop): runtime behavior and blocking work.
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html): index choices and query considerations.

### Suggested progression

| Stage | Material | Evidence of understanding |
| --- | --- | --- |
| Foundations | Sections 1–6 | Explain memory behavior, derive complexity, solve array/hash problems |
| Core structures | Sections 7–11 | State invariants for search, lists, stacks, trees, and heaps |
| Algorithm design | Sections 12–15 | Choose graph algorithms, define DP state, justify greedy choices |
| Engineering | Sections 16–17 | Diagnose bottlenecks and reason about retries and concurrency |
| AI systems | Sections 18–21 | Explain attention numerically and separate retrieval from generation failures |
| Consolidation | Section 22 | Solve variations and explain assumptions, edge cases, and tradeoffs |
