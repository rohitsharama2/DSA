# CodeSignal Preparation for the Airbnb Interview Plan

[Airbnb roadmap](README.md) · [Coding and DP](03-DP-and-Coding-Rounds.md) · [Practical coding](04-PR-Review-and-Practical-Coding.md)

**Your chosen track is 90 minutes:** Start with the [complete progressive workbook](CodeSignal-90-Minute-Progressive-Workbook.md), including solutions for all four levels. The 70-minute material below is optional background.

**Use this guide before a CodeSignal assessment or live coding session.** Complete the platform setup during phase 0, the algorithm exercises during phases 1–3, and the progressive exercise during phase 4. If your assessment is next, prioritize its confirmed format now.

**Examples:** Original practice problems with TypeScript solutions, not leaked questions or verified Airbnb assessment questions. No Airbnb invitation has been supplied, so the assessment variant, deadline, and hiring threshold remain unconfirmed. Platform information checked October 4, 2026.

## 1. Identify the format in your invitation

| Format | Verified platform information / preparation distinction | Practice here |
| --- | --- | --- |
| General Coding Assessment (GCA) | Four questions, 70 minutes; all questions accessible from the start, solvable in any order | Examples 1–4 and the 70-minute mock |
| Industry Coding Assessment (ICA) | One project with four progressive levels, up to 90 minutes; later requirements build on earlier functionality | Example 5 and the progressive mock |
| Custom assessment | Employer-selected content and configuration; do not infer duration or task count from the platform name | Match your invitation and provided practice |
| Live interview using CodeSignal | Treat the IDE as a shared workspace; confirm session length and expectations with the interviewer | Explain assumptions, approach, tests, and follow-ups aloud |

Sources: [GCA structure](https://support.codesignal.com/hc/en-us/articles/360040370853-What-should-I-expect-when-I-take-the-General-Coding-Assessment-GCA-and-how-is-it-structured), [ICA structure](https://support.codesignal.com/hc/en-us/articles/19116922232983-What-are-the-Industry-Coding-Assessment-ICA-rules), and [custom assessments](https://support.codesignal.com/hc/en-us/articles/17723668593815-Create-a-Custom-Assessment).

Do not assume that Airbnb always uses GCA, always uses ICA, or asks the same questions across teams. The candidate report in this folder does not establish which CodeSignal format was used. No official Airbnb passing score has been verified for your application.

## 2. Platform setup and submission workflow

- [ ] Read the invitation: assessment name, deadline/timezone, duration, allowed languages, and setup requirements.
- [ ] Open the [official practice area](https://app.codesignal.com/assessments/practice) and try the relevant question type before starting the real assessment. CodeSignal says practice performance is not shown to companies. [Practice instructions](https://support.codesignal.com/hc/en-us/articles/21025134150423-How-do-I-practice-coding-questions-on-CodeSignal)
- [ ] Verify the actual runtime and supported libraries. CodeSignal lists TypeScript for both GCA and ICA; still check the language choices in your assessment. [Language support](https://support.codesignal.com/hc/en-us/articles/10656138860823-What-languages-environments-are-available-per-certified-assessment)
- [ ] Test browser permissions, camera/microphone/screen sharing and identification if the setup requests them. Allow time for setup before the deadline.
- [ ] Read the rules shown for your assessment. Standard GCA guidance prohibits outside IDEs and AI assistance, including AI syntax searches. Do not assume another assessment's permissions apply. [GCA rules](https://support.codesignal.com/hc/en-us/articles/360051960134-General-Coding-Assessment-GCA-Rules-and-Setup)
- [ ] Reserve uninterrupted time: CodeSignal's assessment instructions say an assessment cannot be paused and restarted after it begins. [Taking an assessment](https://support.codesignal.com/hc/en-us/articles/360045953873-Taking-an-assessment-on-CodeSignal)

For each question:

1. Read the full contract and constraints before editing.
2. Preserve the supplied function signature or repository interface. The descriptive function names below are for learning; use the exact name required in the assessment, such as `solution` when specified.
3. Return the required type. Do not replace a return value with `console.log`, or add standard-input parsing unless requested.
4. Run examples, then add boundary and adversarial tests where supported.
5. Use the platform's submission controls and check the resulting status. Merely typing code or running examples is not a substitute for confirming the submission.
6. Recheck after an edit. Passing visible examples does not establish correctness on hidden inputs.

## 3. TypeScript habits that prevent lost time

- Sort numbers with `(a, b) => a - b`; default sorting compares string forms.
- Use `Map`/`Set` for lookup; use `??` when zero is a meaningful stored value.
- Distinguish inclusive day lists from half-open booking intervals `[start, end)`.
- Build independent matrix rows; `Array(rows).fill(sameArray)` aliases every row.
- Avoid repeated `shift()` in a BFS queue; keep a head index.
- Include output size and recursion-stack space in complexity analysis.
- Confirm bounds before relying on exact integer arithmetic. These examples assume safe integers and totals within `Number.MAX_SAFE_INTEGER`.
- Avoid introducing dependencies during a timed single-function exercise.

## 4. Example 1 — Cheapest consecutive stay (sliding window)

**Problem:** Given nonnegative nightly prices and a positive integer `nights`, return the minimum total for exactly that many consecutive nights. Return `-1` if the array is shorter than the requested stay. Prices and all totals are safe integers; the input is not mutated.

**Example:** `prices = [120, 80, 90, 150]`, `nights = 2` → `170`.

**Baseline:** Sum every possible window separately: `O(n × nights)` time. Adjacent windows repeat almost all their work.

**Observation:** Moving one night forward removes the old left price and adds the new right price.

| Window | Total |
| --- | ---: |
| `[120, 80]` | 200 |
| `[80, 90]` | `200 - 120 + 90 = 170` |
| `[90, 150]` | `170 - 80 + 150 = 240` |

```ts
function cheapestStay(prices: number[], nights: number): number {
  if (prices.length < nights) return -1;
  let total = 0;
  for (let i = 0; i < nights; i++) total += prices[i];
  let best = total;
  for (let right = nights; right < prices.length; right++) {
    total += prices[right] - prices[right - nights];
    best = Math.min(best, total);
  }
  return best;
}
```

**Why correct:** At each iteration, `total` is the sum of the current length-`nights` window. Every possible window is visited once, and `best` retains the smallest sum. **Complexity:** `O(n)` time, `O(1)` auxiliary space.

**Tests:** `([], 1) → -1`; `([0, 0], 2) → 0`; `([9, 3], 1) → 3`; `([9, 3], 3) → -1`.

**Follow-up:** Return the earliest start index among equal-cost choices. Decide the tie policy before changing the code.

## 5. Example 2 — Count guest pairs within a budget (sorting + two pointers)

**Problem:** Count index pairs `i < j` whose combined integer expense is at most `budget`. Expenses and budget are nonnegative safe integers. Equal-valued expenses at different indices represent different guests. Pair counts and sums fit in a safe integer.

**Example:** `[40, 20, 30, 10]`, budget `50` → `4`: value pairs `(10,20)`, `(10,30)`, `(10,40)`, `(20,30)`.

**Baseline:** Check all index pairs in `O(n²)`. After sorting, if the smallest remaining value plus the largest fits, that smallest value fits with every other remaining value.

```ts
function countBudgetPairs(expenses: number[], budget: number): number {
  const sorted = [...expenses].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;
  let count = 0;
  while (left < right) {
    if (sorted[left] + sorted[right] <= budget) {
      count += right - left;
      left++;
    } else {
      right--;
    }
  }
  return count;
}
```

**Why correct:** If the extremes fit, count all pairs using `left` and remove that index. Otherwise `right` cannot pair with any remaining value, so discard it. Each valid pair is counted exactly once. **Complexity:** `O(n log n)` time under the standard comparison-sort model; `O(n)` space for the copy, plus sorting internals.

**Tests:** `([], 10) → 0`; `([5], 10) → 0`; `([20,20,20], 40) → 3`; `([0,0,0], 0) → 3`; `([60,70], 50) → 0`.

**Follow-up:** If the task asks for the actual pairs, output alone may take quadratic space and time.

## 6. Example 3 — Rectangular booking totals (2D prefix sums)

**Problem:** `grid[r][c]` is a nonnegative booking count. For each query `[r1,c1,r2,c2]`, return the sum inside that inclusive rectangle. The grid is nonempty and rectangular, every query is valid, and accumulated sums are safe integers.

**Example:** `grid = [[1,2,0],[3,4,5]]`; queries `[[0,1,1,2],[1,0,1,0]]` → `[11,3]`.

**Baseline:** Scan each requested rectangle. For many large queries, this can cost `O(q × rows × cols)`.

**Observation:** Store the sum above and to the left of every boundary. Add two strips and subtract their overlap. Padding the prefix matrix with a zero row and column eliminates boundary branches.

```ts
function rectangleTotals(
  grid: number[][],
  queries: number[][]
): number[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const prefix = Array.from(
    { length: rows + 1 },
    () => Array<number>(cols + 1).fill(0)
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      prefix[r + 1][c + 1] = grid[r][c]
        + prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c];
    }
  }
  return queries.map(([r1, c1, r2, c2]) =>
    prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]
    - prefix[r2 + 1][c1] + prefix[r1][c1]
  );
}
```

**Dry run:** The padded matrix is `[[0,0,0,0],[0,1,3,3],[0,4,10,15]]`. The first query gives `15 - 0 - 4 + 0 = 11`.

**Why correct:** Inclusion-exclusion removes rows above and columns left of the query and restores the twice-subtracted upper-left overlap. **Complexity:** `O(rows × cols + q)` time, `O(rows × cols)` auxiliary space and `O(q)` output space.

**Tests:** A single cell; entire grid → `15` for the example; first/last rows; empty query list → `[]`. An empty grid is excluded by this contract—handle it only if the actual problem permits it.

**Follow-up:** If updates occur between queries, explain why a fixed prefix matrix becomes stale.

## 7. Example 4 — Cheapest exact meal order (DP)

**Problem:** A meal bundle contains `size` portions and costs `cost` integer cents. Any bundle can be bought repeatedly. Find the cheapest way to buy exactly `target` portions; return `-1` if impossible. `target` is a nonnegative integer, bundle sizes are positive integers, costs are nonnegative, and totals fit in safe integers. Choose this DP when `target` is small enough to allocate `target + 1` states.

**Example:** `target = 6`, bundles `[{size:1,cost:5},{size:3,cost:12},{size:4,cost:14}]` → `24`.

This is an original, fully specified exercise inspired by the menu-order theme in the supplied report. It is not a reconstruction of that interview question.

**Baseline:** Recursively try every last bundle; many paths revisit the same remaining quantity.

**State:** `dp[x]` is the cheapest cost for exactly `x` portions. `dp[0] = 0`; unreachable states start at infinity. For each bundle that fits, consider `dp[x - size] + cost`.

```ts
function cheapestExactOrder(
  target: number,
  bundles: { size: number; cost: number }[]
): number {
  const dp = Array<number>(target + 1).fill(Infinity);
  dp[0] = 0;
  for (let portions = 1; portions <= target; portions++) {
    for (const bundle of bundles) {
      if (bundle.size <= portions) {
        dp[portions] = Math.min(
          dp[portions], dp[portions - bundle.size] + bundle.cost
        );
      }
    }
  }
  return Number.isFinite(dp[target]) ? dp[target] : -1;
}
```

**Dry run:** For the example, `dp = [0,5,10,12,14,19,24]`. Six portions can end with sizes 1, 3, or 4; the corresponding costs are 24, 24, and 24.

**Why correct:** Every nonempty valid order has a last bundle. Removing it leaves a smaller exact-quantity subproblem already solved by the loop. Taking the minimum over possible last bundles considers every valid order. **Complexity:** `O(target × bundleCount)` time and `O(target)` space.

**Tests:** Target zero with no bundles → `0`; target 3 with only a size-2 bundle → `-1`; a zero-cost size-1 bundle → `0`; repeated bundle sizes with different costs should choose the cheaper option.

**Follow-up:** Multiple item types need a different state; limited bundle inventories change transitions. Explain those differences before reusing this recurrence.

## 8. Example 5 — Progressive booking-store exercise

Use this original exercise for ICA or custom practical-coding preparation. Its four levels are our practice design, not CodeSignal's actual task or Airbnb's question bank.

| Level | Requirement | Regression checks |
| --- | --- | --- |
| 1 | Add uniquely identified reservations; reject overlapping bookings for a listing | Duplicate ID; adjacent stays; same dates on different listings |
| 2 | Cancel an active reservation and list a listing's reservations by start, then ID | Unknown cancellation; deterministic ties; canceled IDs may be reused |
| 3 | Add expiring holds: `hold(id, listing, start, end, now, ttl)` and `confirm(id, now)` | Hold blocks overlap; expires exactly at `now + ttl`; confirmation preserves dates |
| 4 | Add `reschedule(id, start, end, now)` for confirmed reservations | On conflict keep the old booking unchanged; expired holds do not block the change |

**Contract:** Day numbers are nonnegative integers; bookings use `[start,end)` with `start < end`. IDs are nonempty strings. Levels 1–2 maintain only active reservations. Level 3 uses explicit nondecreasing integer timestamps and positive integer TTLs; no real timers. All calls are sequential in this in-memory exercise.

Two intervals overlap iff `a.start < b.end && b.start < a.end`. Checking equality alone misses containment; using `<=` wrongly rejects adjacent stays.

### Working levels 1–2 implementation

```ts
interface Reservation {
  id: string;
  listing: string;
  start: number;
  end: number;
}

class BookingStore {
  private reservations = new Map<string, Reservation>();

  reserve(id: string, listing: string, start: number, end: number): boolean {
    if (!id || !listing || !Number.isSafeInteger(start)
      || !Number.isSafeInteger(end) || start < 0 || start >= end
      || this.reservations.has(id)) return false;
    for (const current of this.reservations.values()) {
      if (current.listing === listing
        && start < current.end && current.start < end) return false;
    }
    this.reservations.set(id, { id, listing, start, end });
    return true;
  }

  cancel(id: string): boolean {
    return this.reservations.delete(id);
  }

  list(listing: string): Reservation[] {
    return [...this.reservations.values()]
      .filter(item => item.listing === listing)
      .sort((a, b) => a.start - b.start
        || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map(item => ({ ...item }));
  }
}
```

**Dry run:** Reserving `a` on listing `home` for `[2,5)` succeeds. Reserving `b` for `[5,7)` succeeds. Reserving `c` for `[4,6)` fails. After canceling `a`, booking `[2,5)` is available again. Mutating an object returned by `list` must not mutate stored data.

**Complexity:** For `n` active reservations and `k` matches, reserve is `O(n)`, cancel is expected `O(1)`, and list is `O(n + k log k)`, with `O(n)` temporary space in this implementation. Stored data is `O(n)`. This exercise does not provide distributed booking guarantees.

### Levels 3–4: attempt, then compare with the full solution

The [90-minute workbook](CodeSignal-90-Minute-Progressive-Workbook.md#7-complete-typescript-solution--all-four-levels) provides the complete implementation, with an explicit `now` parameter throughout.

Refactor conflict detection into one helper before adding holds. Treat a hold as active only when `now < expiresAt`. Expire holds before operations that depend on active inventory. Confirmation must find an unexpired hold and transition it to confirmed without conflicting with itself.

For rescheduling, validate the proposed interval and check conflicts excluding the reservation being changed; mutate only after every check passes. Keep levels 1–2 working, adding `now` consistently to time-dependent operations rather than mixing explicit time with `Date.now()`.

**Acceptance sequence:** Create a hold at time 100 with TTL 10; a competing reservation at 109 fails. Confirming at 110 fails, and the same dates become bookable. Attempt a conflicting reschedule of a confirmed reservation and verify its original dates remain intact.

## 9. Timed practice plans

These are practice budgets, not scoring formulas or guarantees about question order.

### 70-minute algorithm mock

Use four unseen variations of examples 1–4. Reading these solutions first makes them learning exercises, not a valid readiness test.

| Minutes | Activity |
| --- | --- |
| 0–5 | Read all four prompts and constraints; choose an order by confidence |
| 5–15 | Complete the most straightforward task, test, and submit |
| 15–30 | Complete a second task with boundary tests |
| 30–50 | Work on the most promising remaining task |
| 50–63 | Attempt the last task or repair incomplete solutions |
| 63–70 | Recheck return types, edge cases, complexity, and submission status |

If you stop making progress, write down the bottleneck and switch when another task offers a clearer path. Do not hardcode a strategy such as “always skip question 3”; difficulty and your strengths vary.

### 90-minute progressive mock

Spend 5 minutes reading the interface, 15 on level 1, 15 on level 2, 25 on level 3, 20 on level 4, and 10 on regression tests and submission checks. Adjust based on actual progress. Prefer small working changes: later requirements must not silently break earlier behavior.

## 10. Seven-day preparation sprint

| Day | Work | Deliverable |
| --- | --- | --- |
| 1 | Confirm format; use official practice; rehearse TypeScript input/output | Setup checklist completed |
| 2 | Examples 1–2, then unseen variants | Correct loops, boundaries, and complexity explanations |
| 3 | Example 3; practice rectangular and single-row inputs | Prefix-sum implementation from memory with reasoning |
| 4 | Example 4; review phase 3 DP and split-stay contracts | Recurrence derived without copying |
| 5 | Example 5, prioritizing progressive formats if confirmed | Levels 1–2 working; expiry and reschedule tests specified |
| 6 | One full mock matching your invitation | Error log with time spent per task |
| 7 | Retry failures from a blank editor; final platform check | Readiness checklist below |

For a live interview, replace silent mock practice with narration: clarify → baseline → optimization → code → tests → complexity. Ask about ambiguous requirements before implementing them. For an asynchronous assessment, extract the contract from the statement and examples.

## 11. Readiness and assessment-day checklist

- [ ] I know whether this is GCA, ICA, custom, or a live session.
- [ ] I have practiced the relevant CodeSignal editor and submission workflow.
- [ ] I can solve unseen versions of the relevant exercises without solution help.
- [ ] I can distinguish a slow correct approach from an incorrect one and explain the bottleneck.
- [ ] I check empty/minimal inputs where allowed, ties, duplicates, boundaries, and maximum-size behavior.
- [ ] For progressive tasks, old tests still pass after each new requirement.
- [ ] I have read the actual assessment's rules and confirmed any unresolved setup issue before starting.
- [ ] I have reserved uninterrupted time and will check submission status before finishing.

Use your mock error log to decide what to revise. Do not equate a practice score, one candidate's result, or completion of this guide with an Airbnb hiring cutoff.
