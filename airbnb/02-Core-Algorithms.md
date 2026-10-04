# Phase 2 — Core algorithms with marketplace scenarios

**Reference:** [Concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md). Section numbers below refer to this guide.

**Time:** Weeks 3–4.

**Read:** Companion guide sections 7 and 10–13.

The order here is a learning recommendation, not a claim about Airbnb question frequency.

| Pattern | Representative practice | Airbnb-context variation | Important edge cases |
| --- | --- | --- | --- |
| Intervals | Merge Intervals; Insert Interval | Combine blocked dates for a listing | Touching ranges, containment, empty input |
| Heaps | Top K Frequent Elements; Merge k Sorted Lists | Merge ranked result streams | Ties, exhausted streams, k greater than item count |
| Tree traversal | Binary Tree Level Order Traversal; Lowest Common Ancestor | Navigate a location hierarchy | Missing node, skewed tree, root match |
| BFS / DFS | Number of Islands; Clone Graph | Explore connected regions or relationships | Cycles, disconnected components, visited state |
| Topological sorting | Course Schedule | Order dependent processing tasks | Cycle, duplicate edge, independent tasks |
| Weighted shortest path | Implement Dijkstra on nonnegative weights | Find a minimum-cost route in a toy travel graph | Unreachable target, stale heap entries, zero weights |
| Backtracking | Subsets; Permutations; Word Search | Generate valid constrained trip combinations | Duplicate choices, undoing state, exponential output |

### Required exercises

1. **Availability intervals:** Represent stays as `[checkIn, checkOut)`. Decide whether adjacent blocked intervals should merge for display. Explain why one guest checking out on a date can allow another to check in on that date.
2. **Diverse search pagination:** Fill a page from ranked listings, preferring distinct hosts while preserving ranking among eligible items. Define what happens when too few distinct hosts remain, and ensure deferred results are not lost across pages.
3. **Dependency execution:** Given prerequisite relationships, return a valid execution order or report a cycle. Explain why ordinary sorting is insufficient.

For each exercise: write the contract, draw an example, implement a baseline, improve it, and test the change. These are original practice prompts, not verified Airbnb interview questions.

**Readiness check:** Complete three 45-minute coding mocks on different patterns. In at least two, independently reach a correct solution with tests and complexity analysis. Revisit any pattern that required a major hint.

---

[Airbnb roadmap](README.md) · [Previous phase](01-Foundations-and-TypeScript.md) · [Next phase](03-DP-and-Coding-Rounds.md)
