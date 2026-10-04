# Phase 1 — Foundations and confident TypeScript

**Reference:** [Concepts and worked solutions](../handbook/DSA-CS-AI-Concepts-and-Solutions.md). Section numbers below refer to this guide.

**Time:** Remainder of week 1 through week 2.

**Read:** Companion guide sections 1–9 and 16, concentrating on the topics below.

| Topic | What you must explain | Practice |
| --- | --- | --- |
| Complexity | Input size, time vs. space, sorting cost, recursion stack | Compare nested scanning with a map-based solution |
| Arrays and strings | Indexing, mutation, duplicate handling, string assumptions | Two Sum; Valid Anagram |
| Hash maps and sets | Counting, membership, identity vs. value | Group Anagrams; first unique element |
| Two pointers | Pointer invariant and why each move is safe | Valid Palindrome; merge sorted arrays |
| Sliding window | When the window becomes invalid and how to repair it | Longest Substring Without Repeating Characters |
| Prefix sums | Range sums and counting earlier prefixes | Subarray Sum Equals K |
| Binary search | Search interval, boundary handling, termination | Binary Search; Find First and Last Position |
| Stacks and linked lists | LIFO state; updating links without losing nodes | Valid Parentheses; Reverse Linked List |

### TypeScript checklist

- [ ] Use numeric sort comparators and define deterministic tie-breaking.
- [ ] Distinguish missing map entries from valid zero or false values.
- [ ] Explain shallow copying, aliasing, and input mutation.
- [ ] Use a queue head index for BFS instead of repeatedly removing the first array element.
- [ ] Explain safe integer limits, `bigint`, and recursion-depth risks.
- [ ] State whether strings are restricted to ASCII or require broader Unicode handling.
- [ ] Write small typed functions with explicit input and output contracts.

**Airbnb-context exercise:** Given listing IDs viewed by a guest, find the longest contiguous sequence with no repeated listing. Clarify whether you return its length or the sequence itself. Walk through repeated IDs and empty input.

**Readiness check:** Solve three unseen easy problems and two unseen medium problems across these patterns independently. For each, explain the invariant, tests, and complexity. Treat the first attempts as diagnosis; speed comes after correctness.

---

[Airbnb roadmap](README.md) · [Previous phase](00-Role-and-Baseline.md) · [Next phase](02-Core-Algorithms.md)
