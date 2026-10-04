# Airbnb Candidate Questions: Statements and Worked Answers

[Roadmap](README.md) · [90-minute CodeSignal workbook](CodeSignal-90-Minute-Progressive-Workbook.md) · [Candidate report](Interview-Experience-and-Question-Tracker.md)

This workbook covers **all eight questions in the supplied report**. It includes seven executable TypeScript algorithm solutions and one worked experimentation answer. Read each statement and attempt it before opening the solution section.

The menu-order title does not specify a complete problem, so question 1 explicitly defines a practice variant. Question 2 solves the linked split-stay enumeration variant; it does not claim to reconstruct an unspecified group-cost optimization problem. Other named coding problems use their standard contracts with original explanations and examples. All numerical examples assume safe-integer arithmetic. Exact contracts always override a remembered title.

## Contents

1. [Most Cost Effective Menu Order](#1-most-cost-effective-menu-order)
2. [Split Stay](#2-split-stay)
3. [Minimum Number of Work Sessions](#3-minimum-number-of-work-sessions)
4. [Min Cost Climbing Stairs](#4-min-cost-climbing-stairs)
5. [Longest Valid Obstacle Course](#5-longest-valid-obstacle-course)
6. [Design an A/B Test with Causal Inference](#6-design-an-ab-test-with-causal-inference)
7. [Partition Array to Minimize Sum Difference](#7-partition-array-to-minimize-sum-difference)
8. [Maximum Sum BST in Binary Tree](#8-maximum-sum-bst-in-binary-tree)

## 1. Most Cost Effective Menu Order

### Problem statement — defined practice variant

You need quantities of `m` item types. `need[i]` is the required count of item `i`. A menu offer contains a quantity vector of length `m` and an integer-cent price. Offers may be purchased repeatedly. Extra items are allowed. Return the minimum price to cover all requirements, or `-1` if impossible.

For this exercise: `1 <= m <= 5`, each required quantity is 0–8, at most 20 offers, offer quantities are nonnegative integers, and every offer contains at least one item. Prices are nonnegative safe integers. All totals fit in a safe integer.

**Example:** Need two sandwiches and one drink: `[2,1]`. Offers are `([1,0],500)`, `([0,1],300)`, and `([1,1],650)`. Answer: `1150`, buying a combo plus one sandwich rather than paying `1300` individually.

### Approach and reasoning

A brute-force search over purchase sequences revisits the same remaining requirements many times. Memoize by the remaining-quantity vector. After buying an offer, clamp each quantity to zero because extra items are allowed. Ignore offers that do not reduce any remaining need: they cannot help and would create recursive cycles.

Let `F(r)` be the minimum additional cost for remaining vector `r`. `F(0,...,0)=0`. Otherwise minimize `offer.price + F(max(0,r-offer.quantities))` over progressing offers. If no sequence works, the result is infinity.

### TypeScript solution

```ts
function minimumMenuCost(
  need: number[],
  offers: { quantities: number[]; price: number }[]
): number {
  const memo = new Map<string, number>();
  function solve(remaining: number[]): number {
    if (remaining.every(value => value === 0)) return 0;
    const key = remaining.join(',');
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    let best = Infinity;
    for (const offer of offers) {
      const next = remaining.map((value, i) =>
        Math.max(0, value - offer.quantities[i]));
      if (next.every((value, i) => value === remaining[i])) continue;
      best = Math.min(best, offer.price + solve(next));
    }
    memo.set(key, best);
    return best;
  }
  const answer = solve(need);
  return Number.isFinite(answer) ? answer : -1;
}
```

**Dry run:** At `[2,1]`, buying the combo leaves `[1,0]`; the sandwich solves that state for 500. Total 650 + 500 = 1150. Buying two combos costs 1300 and is valid but worse.

**Correctness:** Every useful purchase strictly reduces total remaining need. Every feasible optimal order can be represented as one progressing purchase followed by a smaller state. The recurrence tries all such choices; memoization only avoids recomputing them.

**Complexity:** With `S = product(need[i]+1)`, `B` offers, and `m` item types, time is `O(S × B × m)`. Memo keys occupy `O(S × m)` space for these bounded quantities; recursion depth is at most the sum of requirements, with `O(m)` state storage per frame.

**Edge cases:** All needs zero → 0; missing coverage for an item → -1; zero-price progressing offers; duplicate offers; an oversized bundle that is cheaper than exact coverage.

**Interview follow-up:** If extras are forbidden, reject overshooting offers instead of clamping. If stock is limited, remaining stock must also affect state. Ask these questions before implementing.

## 2. Split Stay

### Problem statement

Given available integer days for each listing and an inclusive trip `[startDay,endDay]`, return all listings covering the entire trip and all ordered pairs of **distinct** listings covering it with exactly one switch. Each part must contain at least one day. Return each pair once even if multiple switch dates work; sort results lexicographically. Duplicate availability entries do not matter.

This is the [linked split-stay practice variant](https://prachub.com/interview-questions/find-valid-split-stay-listing-combinations), not a minimum-price or group-capacity objective. Use up to 200 listings and a trip of up to 366 days for practice.

**Example:** `A:[1,2]`, `B:[3,4]`, `C:[1,2,3,4]`, trip `[1,4]`. Single stays: `['C']`. Split pairs: `[['A','B'],['A','C'],['C','B']]`.

### Approach and TypeScript solution

Checking every pair at every split and scanning both ranges repeats work. Instead, record each listing's continuous coverage from the start and backward from the end.

```ts
function splitStays(
  availability: Record<string, number[]>, startDay: number, endDay: number
): { singleStays: string[]; splitStays: [string, string][] } {
  const names = Object.keys(availability).sort();
  const prefixEnd = new Map<string, number>();
  const suffixStart = new Map<string, number>();
  const singleStays: string[] = [];
  const pairs: [string, string][] = [];
  for (const name of names) {
    const days = new Set(availability[name]);
    let p = startDay - 1;
    while (p < endDay && days.has(p + 1)) p++;
    let s = endDay + 1;
    while (s > startDay && days.has(s - 1)) s--;
    prefixEnd.set(name, p);
    suffixStart.set(name, s);
    if (p === endDay) singleStays.push(name);
  }
  for (const first of names) {
    for (const second of names) {
      if (first === second) continue;
      const earliestSplit = Math.max(startDay, suffixStart.get(second)! - 1);
      const latestSplit = Math.min(endDay - 1, prefixEnd.get(first)!);
      if (earliestSplit <= latestSplit) pairs.push([first, second]);
    }
  }
  return { singleStays, splitStays: pairs };
}
```

**Dry run:** For `A → B`, the first listing covers through 2 and the second covers backward to 3, so the split can occur after day 2. For `B → A`, the first listing does not cover day 1, so no valid split exists.

**Correctness:** A switch after day `k` needs `startDay <= k <= endDay-1`, `k <= prefixEnd[first]`, and `k >= suffixStart[second]-1`. The code checks whether this intersection is nonempty. Iterating sorted distinct names returns each ordered pair once.

**Complexity:** For `L` listings, `D` days, and `T` input availability entries: `O(T + L×D + L² + L log L)` time, treating ID comparison cost as bounded. Auxiliary space is `O(T + L)` as an upper bound; output can be `O(L²)`.

**Edge cases:** One-day trip → no split pairs; empty availability; gaps in the middle; unsorted duplicate days; two full-trip listings produce both directions. The inclusive convention here differs from half-open booking intervals.

**Interview follow-up:** Asking for all switch dates increases output size. Asking for cheapest multi-listing coverage instead requires a newly specified cost/transition model; do not apply this pair enumeration as though it solved that objective.

## 3. Minimum Number of Work Sessions

### Problem statement

Each task takes an integer duration. A session can contain tasks totaling at most `sessionTime`; tasks cannot be split, and their order is flexible. Return the fewest sessions needed. Use `1 <= n <= 14` and `1 <= tasks[i] <= sessionTime <= 15`. Our function additionally returns 0 for no tasks. [Original problem](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)

**Example:** Tasks `[1,2,3]`, capacity 3 → `2` sessions: `[1,2]` and `[3]`.

### Approach and TypeScript solution

Assigning tasks to sessions by brute force repeats equivalent partial assignments. A bitmask records which tasks are finished. For each mask retain the lexicographically best `(sessionCount, loadOfLastSession)`: fewer sessions wins, then a smaller last load.

```ts
function minSessions(tasks: number[], sessionTime: number): number {
  if (tasks.length === 0) return 0;
  const count = 1 << tasks.length;
  const sessions = Array<number>(count).fill(Infinity);
  const load = Array<number>(count).fill(Infinity);
  sessions[0] = 1;
  load[0] = 0;
  for (let mask = 0; mask < count; mask++) {
    for (let i = 0; i < tasks.length; i++) {
      if ((mask & (1 << i)) !== 0) continue;
      const fits = load[mask] + tasks[i] <= sessionTime;
      const nextSessions = sessions[mask] + (fits ? 0 : 1);
      const nextLoad = fits ? load[mask] + tasks[i] : tasks[i];
      const next = mask | (1 << i);
      if (nextSessions < sessions[next]
        || (nextSessions === sessions[next] && nextLoad < load[next])) {
        sessions[next] = nextSessions;
        load[next] = nextLoad;
      }
    }
  }
  return sessions[count - 1];
}
```

**Dry run:** Start at `(1,0)`. Appending 1 then 2 yields `(1,3)`. Appending 3 opens the next session: `(2,3)`. Other task orders are explored through the mask transitions.

**Correctness:** Within equal session counts, a smaller last load leaves at least as much room for future tasks. Appending a task preserves lexicographic dominance: if a state with fewer sessions must open one while the other can fit, it still has no more sessions and its new load is no larger. Thus discarded states cannot improve the final answer. Every ordering can be constructed by adding one unselected task at a time.

**Complexity:** `O(n × 2^n)` time, `O(2^n)` space. Bitwise masks are safe under the stated small `n`; this is not an algorithm for hundreds of tasks.

**Edge cases:** `[3,3,3]`, capacity 3 → 3; `[1,1,1]`, capacity 3 → 1; `[]` → 0. Tasks larger than capacity are excluded by the contract.

**Follow-up:** Reconstruct sessions by storing predecessor masks and whether a transition opened a session.

## 4. Min Cost Climbing Stairs

### Problem statement

Each stair has a nonnegative cost paid when leaving it. Start on stair 0 or stair 1; each move climbs one or two positions. Return the minimum cost to reach the position just beyond the last stair. Assume at least two stairs. [Original problem](https://leetcode.com/problems/min-cost-climbing-stairs/)

**Example:** `[10,15,20]` → `15`: start at stair 1, pay 15, then move two positions to the top.

### Approach and TypeScript solution

Let `dp[i]` be the minimum paid to arrive at position `i`. Starting positions cost zero to arrive at. To reach `i`, pay to leave either `i-1` or `i-2`. Only two previous states are needed.

```ts
function minCostClimbingStairs(cost: number[]): number {
  let twoBack = 0;
  let oneBack = 0;
  for (let i = 2; i <= cost.length; i++) {
    const current = Math.min(
      oneBack + cost[i - 1], twoBack + cost[i - 2]
    );
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}
```

**Dry run:** At position 2, minimum arrival cost is `min(15,10)=10`. At the top, position 3, it is `min(10+20,0+15)=15`.

**Correctness:** Every path to a position has one of these two final moves. The recurrence chooses the cheaper optimal predecessor. **Complexity:** `O(n)` time, `O(1)` space, versus exponential repeated recursion without memoization.

**Edge cases:** `[0,0] → 0`; `[5,1] → 1`; `[1,100,1,1,1,100,1,1,100,1] → 6`.

**Follow-up:** To return the path, keep the full DP array and predecessor choices instead of only two values.

## 5. Longest Valid Obstacle Course

### Problem statement

For each index `i`, return the longest **nondecreasing subsequence ending at i**, using only positions up to `i`. Chosen positions need not be adjacent, but their original order must remain. Practice with up to 100,000 positive integer heights. [Original problem](https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/)

**Example:** `[2,2,1,3]` → `[1,2,1,3]`.

### Approach and TypeScript solution

A quadratic DP scans all earlier compatible heights. Instead, `tails[len-1]` stores the smallest achievable ending height of a nondecreasing subsequence of length `len` in the processed prefix. Binary-search the first tail **strictly greater** than the new height. Equal heights extend the sequence.

```ts
function longestObstacleCourseAtEachPosition(obstacles: number[]): number[] {
  const tails: number[] = [];
  const answer: number[] = [];
  for (const height of obstacles) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] <= height) lo = mid + 1;
      else hi = mid;
    }
    answer.push(lo + 1);
    tails[lo] = height;
  }
  return answer;
}
```

**Dry run:** Heights 2, 2, 1, 3 transform `tails` into `[2]`, `[2,2]`, `[1,2]`, `[1,2,3]`. The recorded lengths are 1, 2, 1, 3. `tails` itself is a summary, not necessarily one original subsequence.

**Correctness:** All tails at indices below the insertion point are at most the current height, so their sequences can be extended. No longer summarized sequence has a compatible minimal tail. Replacing the next tail with a smaller value preserves future possibilities.

**Complexity:** `O(n log n)` time, `O(n)` auxiliary space plus `O(n)` output.

**Edge cases:** `[4,4,4] → [1,2,3]`; `[5,4,3] → [1,1,1]`; one element → `[1]`. Using first `>= height` would incorrectly solve the strictly increasing variant.

## 6. Design an A/B Test with Causal Inference

### Problem statement — worked interview scenario

A new search interface is intended to help guests find suitable stays. Design an experiment to determine whether offering it increases bookings. Explain randomization, metrics, sample size, threats to causal inference, and the launch decision.

This is an original concrete scenario for the [experimentation question linked in the report](https://prachub.com/interview-questions/design-an-a-b-test-with-causal-inference), not a DP task or a claim about a specific Airbnb experiment.

### Model answer

**Clarify the decision.** I would ask whether the goal is more completed bookings, better matching, or higher net value after cancellations. For this exercise, the primary outcome is the proportion of eligible guests who make at least one booking within seven days of assignment. Each guest counts once; repeated sessions are not independent samples. Cancellation rate, latency, support contacts, and host-side concentration are guardrails.

**Define the causal quantity.** My initial estimand is the intention-to-treat difference in this seven-day booking probability between assignment to the new and old interfaces. Analyze everyone assigned, not just people who clicked the new feature; filtering by a post-treatment action can introduce selection bias. This estimates the effect of assignment under the experimental allocation, which is not automatically the effect of a full marketplace rollout.

**Randomize before exposure.** Start with stable guest-level random assignment, persisted across sessions, so a guest does not alternate interfaces. Record assignment, eligibility, exposure, outcome timestamps, and experiment version. A guest-level design needs a credible assumption that cross-guest spillovers are small for the decision being made.

**Address marketplace interference.** Guests compete for limited listings, so treatment can change inventory available to control guests. I would assess this risk and, if material, consider market clusters or a carefully designed switchback with carryover handling. The analysis and power calculation must match the randomized unit. Cluster randomization is not a universal fix: cross-cluster interactions and too few independent clusters still matter. Airbnb-related research documents interference and studies cluster designs. [Primary research](https://pubsonline.informs.org/doi/10.1287/mnsc.2020.01157)

**Plan power and duration.** Suppose baseline conversion is 10%, the minimum detectable absolute increase is 1 percentage point, two-sided alpha is 5%, and desired power is 80%. Under independent equal-sized arms, a rough planning approximation is `n ≈ 2 × (1.96 + 0.84)^2 × p × (1-p) / delta^2`, giving about 14,112 guests per arm using `p=0.10`, `delta=0.01`. Final planning should use the chosen test, traffic assumptions, clustering if any, and the complete outcome window. Cover relevant weekly cycles; do not stop just because an intermediate p-value looks good.

**Run integrity checks.** Verify assignment balance against the planned split, check missing exposure/outcome events, detect cross-arm contamination, and monitor latency/error guardrails. Diagnose sample-ratio mismatch before interpreting a lift. Predeclare exclusions and any sequential stopping procedure.

**Analyze an illustrative result.** Suppose after the preplanned duration and outcome maturation, control has 1,500 bookings among 15,000 assigned guests (10%), and treatment has 1,680 among 15,000 (11.2%). The estimated absolute effect is 1.2 percentage points and relative lift is 12%. With independent guest observations, an approximate standard error is `sqrt(0.10×0.90/15000 + 0.112×0.888/15000) ≈ 0.00355`; a 95% interval is roughly 0.50 to 1.90 percentage points. Do not use this individual-level interval for clustered assignment or repeated-session rows.

**Make the decision.** If the estimate is practically useful, integrity checks are clean, guardrails meet predeclared limits, and marketplace spillover is acceptably addressed, recommend a staged rollout with monitoring. Otherwise fix the experiment or gather more evidence under a preplanned design. Statistical significance alone does not justify a launch.

### Follow-up questions and answers

- **Why not compare users who adopted the feature against users who did not?** Adoption is self-selected; motivation and other user differences can confound the result. Random assignment supports the intention-to-treat comparison.
- **What if some treatment users never see the feature?** Keep them in the primary assignment-based analysis. A complier-effect analysis needs additional instrumental-variable assumptions and a carefully justified design.
- **Can I check the p-value every day and stop below 0.05?** Not with an ordinary fixed-horizon test while preserving its nominal false-positive rate. Use the planned horizon or an appropriate predeclared sequential method.
- **What if bookings rise but cancellations also rise?** Apply the guardrail policy and examine mature outcomes; do not hide the trade-off behind the primary metric.

## 7. Partition Array to Minimize Sum Difference

### Problem statement

Given `2n` integers, divide them into two groups of exactly `n` elements each. Return the smallest absolute difference between group sums. Values can be negative; practice with `1 <= n <= 15` and magnitudes up to 10 million. [Original problem](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/)

**Example:** `[3,9,7,3]` → `2`: choose `[3,7]` and `[9,3]`, with sums 10 and 12.

### Approach and TypeScript solution

Enumerating all ways to select `n` of `2n` elements is expensive. Split the input in half and enumerate subset sums in each half, grouped by selected count. If the left subset contains `k` elements, choose `n-k` from the right. For a selected-group sum `s`, the difference is `abs(total - 2s)`, so seek `s` close to `total/2`.

```ts
function minimumPartitionDifference(nums: number[]): number {
  const n = nums.length / 2;
  function groupedSums(values: number[]): number[][] {
    const groups = Array.from({ length: values.length + 1 }, () => [] as number[]);
    function visit(index: number, count: number, sum: number): void {
      if (index === values.length) {
        groups[count].push(sum);
        return;
      }
      visit(index + 1, count, sum);
      visit(index + 1, count + 1, sum + values[index]);
    }
    visit(0, 0, 0);
    return groups;
  }
  const left = groupedSums(nums.slice(0, n));
  const right = groupedSums(nums.slice(n));
  for (const group of right) group.sort((a, b) => a - b);
  const total = nums.reduce((sum, value) => sum + value, 0);
  let best = Infinity;
  for (let count = 0; count <= n; count++) {
    const candidates = right[n - count];
    for (const sum of left[count]) {
      const target = total / 2 - sum;
      let lo = 0;
      let hi = candidates.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (candidates[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      for (const index of [lo - 1, lo]) {
        if (index >= 0 && index < candidates.length) {
          best = Math.min(best, Math.abs(total - 2 * (sum + candidates[index])));
        }
      }
    }
  }
  return best;
}
```

**Dry run:** Left `[3,9]` offers count-one sums `[3,9]`; right `[7,3]` offers `[3,7]`. Total is 22, target selected sum is 11. Left sum 3 pairs best with 7, reaching 10 and difference 2. Other selected counts are also checked.

**Correctness:** Every equal-sized partition's selected group decomposes into some left subset of size `k` and right subset of size `n-k`. Both are enumerated. In a sorted right group, the closest sum to the target is at the lower-bound position or its predecessor, so checking those finds the best complement.

**Complexity:** `O(n × 2^n)` time for enumeration, sorting, and binary searches; `O(2^n)` storage plus `O(n)` recursion stack. Here `n` is half the input length.

**Edge cases:** `[-5,5] → 10`; all zeros → 0; duplicates; negative total. A subset-sum answer that ignores equal group sizes is incorrect.

## 8. Maximum Sum BST in Binary Tree

### Problem statement

Return the largest sum among complete rooted subtrees that are strict binary search trees: every value in the left subtree is less than the root, and every value in the right is greater. A subtree includes all descendants of its root, not an arbitrary path or subset. Allow the empty subtree with sum zero. Practice with up to 40,000 nodes, including negative values. [Original problem](https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/)

**Example:** Root 5 has children 3 and 8; node 3 has children 2 and 6. The whole tree is not a BST because 6 is in the left subtree of 5. The subtree rooted at 3 is a BST with sum 11, greater than the singleton 8. Answer: `11`.

### Approach and TypeScript solution

Revalidating each subtree independently can take quadratic time. Process children before their parent, returning validity, minimum, maximum, and sum. Use iterative postorder here so a highly skewed tree does not overflow the JavaScript call stack.

```ts
interface InterviewTreeNode {
  val: number;
  left: InterviewTreeNode | null;
  right: InterviewTreeNode | null;
}

function maxSumBST(root: InterviewTreeNode | null): number {
  type Summary = { valid: boolean; min: number; max: number; sum: number };
  const empty: Summary = { valid: true, min: Infinity, max: -Infinity, sum: 0 };
  const summaries = new Map<InterviewTreeNode, Summary>();
  const stack: [InterviewTreeNode, boolean][] = root ? [[root, false]] : [];
  let best = 0;
  while (stack.length > 0) {
    const [node, visited] = stack.pop()!;
    if (!visited) {
      stack.push([node, true]);
      if (node.right) stack.push([node.right, false]);
      if (node.left) stack.push([node.left, false]);
      continue;
    }
    const left = node.left ? summaries.get(node.left)! : empty;
    const right = node.right ? summaries.get(node.right)! : empty;
    if (left.valid && right.valid && left.max < node.val && node.val < right.min) {
      const sum = left.sum + node.val + right.sum;
      summaries.set(node, {
        valid: true, min: Math.min(left.min, node.val),
        max: Math.max(right.max, node.val), sum
      });
      best = Math.max(best, sum);
    } else {
      summaries.set(node, { valid: false, min: 0, max: 0, sum: 0 });
    }
  }
  return best;
}
```

**Dry run:** Leaves 2, 6, and 8 are valid. Node 3 receives bounds 2 and 6, forms a valid sum-11 BST, and updates the best. Node 5 fails because the left subtree maximum is 6. The previous best remains 11.

**Correctness:** A parent subtree is a BST exactly when both child subtrees are BSTs and their extreme values satisfy its strict ordering. Each valid subtree sum is considered once, including valid children below an invalid ancestor.

**Complexity:** `O(n)` time and `O(n)` space for summaries and explicit traversal storage. A recursive version can use `O(height)` auxiliary space but risks stack overflow on deep JavaScript inputs.

**Edge cases:** Empty tree → 0; all-negative tree → 0 because empty is allowed; duplicate root/child values invalidate their combined subtree; a violation deep below a child must propagate through its extrema.

## Practice sequence

1. Solve climbing stairs and explain the arrival-state convention.
2. Solve menu order and work sessions, naming the state before coding.
3. Solve split stay and obstacle course, paying attention to endpoint/equality rules.
4. Solve partition and maximum-sum BST as advanced exercises.
5. Rehearse the A/B answer aloud with assumptions and a numerical result.
6. Keep the [90-minute progressive workbook](CodeSignal-90-Minute-Progressive-Workbook.md) as the immediate assessment priority; these questions prepare the broader interview loop.

## Run the worked examples locally

The [verification script](examples/check-workbook-examples.mjs) reads the TypeScript blocks directly from these workbooks and checks them against edge cases and small brute-force implementations. Run from the repository root with Node.js 22.13 or newer:

```sh
node airbnb/examples/check-workbook-examples.mjs
```

This executes the examples using Node’s built-in TypeScript stripping; it is not a TypeScript static type check. No npm dependencies are required.
