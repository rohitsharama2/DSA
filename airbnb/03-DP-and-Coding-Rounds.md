# Phase 3 — Dynamic programming and mixed timed coding

**Reference:** [Concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md). Section numbers below refer to this guide.

**Time:** Weeks 5–6.

**Read:** Companion guide sections 14–15 and relevant exercises in section 22.

Learn DP in this order: recursive choices → repeated subproblems → state → recurrence → base cases → memoization → bottom-up ordering → optional space reduction.

| Order | Practice | Learning objective |
| --- | --- | --- |
| 1 | Climbing Stairs; House Robber | Define a one-dimensional state and alternatives |
| 2 | Coin Change | Represent impossible states and minimize over choices |
| 3 | Word Break | Choose boundaries and test prefixes efficiently |
| 4 | Unique Paths | Establish grid transitions and initialization |
| 5 | Longest Common Subsequence | Explain a two-dimensional state |
| 6 | Weighted interval scheduling | Combine sorting, binary search, and DP |

**Airbnb-context exercise:** For a toy scheduling problem, choose a non-overlapping subset of proposed bookings that maximizes total value. Treat stays as half-open intervals. Start with subset enumeration, then explain sorting by end time, finding the last compatible booking, and the take-or-skip recurrence. This is an algorithm exercise, not a recommendation for handling actual guest reservations.

### A 45-minute coding rehearsal

| Minutes | Work |
| --- | --- |
| 0–5 | Clarify constraints, outputs, and examples |
| 5–12 | Explain the baseline and select an approach |
| 12–32 | Implement while narrating important decisions |
| 32–40 | Test ordinary cases, boundaries, and likely failure cases |
| 40–45 | Explain complexity and discuss a variation |

Use these as practice targets, not official Airbnb round timings. Mix old patterns with DP so the problem title does not reveal the technique. After a failed attempt, record the missed observation and retry from a blank editor after two days and one week.

**Readiness check:** Solve four of the last five mixed medium practice problems correctly within your rehearsal time without substantial hints. For DP, derive the recurrence aloud rather than reciting code.

## Candidate-report focus: phone screen and onsite coding

The [supplied interview report](Interview-Experience-and-Question-Tracker.md) motivates extra DP practice. It is one account, not evidence that every Airbnb loop is DP-heavy. Use the following order after the basic exercises above.

### 1. Min Cost Climbing Stairs

Define whether the state represents arriving at a step or paying to leave it. Derive both starting positions and the virtual top. Test the smallest permitted input and zero costs before reducing memory.

### 2. Most Cost Effective Menu Order — phone-screen preparation

The report contains a title, not a full statement. Before coding, clarify whether orders include bundles, whether bundles can repeat, whether extras are allowed, and whether requirements are quantities or a set of distinct items.

For an original practice variant, suppose nonnegative-price bundles can repeat and may contain extra items. Represent remaining required quantities as a tuple. Try each bundle that reduces at least one remaining quantity, clamp counts at zero, and memoize the minimum additional cost. The all-zero state costs zero; unreachable states cost infinity. Skipping non-progressing transitions prevents recursive cycles. If there are `m` required item types, the number of possible states is at most the product of `(requiredQuantity[i] + 1)`; include bundle evaluation cost in the time analysis. A bitmask is appropriate only when the requirements can be represented as binary coverage.

**Output:** A stated contract, recurrence, implementation, and tests for an impossible order, duplicate offers, a cheaper bundle, and exact vs. excess coverage. This variant is not the recovered interview question.

### 3. Split Stay — onsite preparation

Do not assume that all split-stay problems require DP. First distinguish enumerating valid pairs from optimizing cost across many segments. Practice the [linked split-stay variant](https://prachub.com/interview-questions/find-valid-split-stay-listing-combinations), then introduce your own cost or maximum-moves constraint as a separate exercise.

The linked version uses inclusive integer day ranges and asks for single stays and ordered pairs of distinct listings covering the full trip with one switch. Use its stated convention rather than silently substituting the half-open reservation model from system design. A useful approach records each listing's contiguous reach from the beginning and end of the trip, then checks pair compatibility. Count potentially quadratic output in the complexity analysis. Test one-day trips, gaps, repeated availability entries, and multiple valid switch dates for the same pair.

For a new optimization variant, explicitly define nightly costs and allowed moves before designing a state such as `(day, listing, movesUsed)`. Explain the transition rules and termination. Do not claim this is the candidate's exact onsite problem.

### 4. Minimum Number of Work Sessions to Finish the Tasks

Start with assigning tasks to sessions by backtracking. For small task counts, explore subset DP, storing the best `(sessionsUsed, currentSessionLoad)` for a completed-task mask. Define the empty state and reject tasks exceeding session capacity. Explain the exponential state count and the input sizes for which it is practical.

### 5. Find the Longest Valid Obstacle Course At Each Position

Compare a quadratic DP baseline with a tails-array method. Because the subsequence is nondecreasing, find the first tail strictly greater than the current height. Test equal heights, descending input, and repeated plateaus.

### 6. Stretch: Partition Array Into Two Arrays To Minimize Sum Difference

Preserve the equal-cardinality requirement. Explore meet-in-the-middle: enumerate sums in each half grouped by selected count, then combine complementary counts using sorting and binary search. Test negative values and repeated sums. Explain why an unconstrained subset partition solves a different problem.

### 7. Stretch: Maximum Sum BST in Binary Tree

Return subtree validity, minimum, maximum, and sum from a postorder traversal. Update the best sum only for valid BST subtrees. Clarify the duplicate-key rule and whether an empty BST with sum zero is allowed; that changes all-negative cases. Include recursion-stack space.

**Additional readiness check:** Independently solve the menu practice variant and a precisely specified split-stay variant, then explain an optimization and its complexity. A working baseline is a milestone; passing visible tests is not a proof of correctness.

---

[Airbnb roadmap](README.md) · [Previous phase](02-Core-Algorithms.md) · [Next phase](04-PR-Review-and-Practical-Coding.md)
