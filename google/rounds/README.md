# Google L5: preparation by interview area

[Company index](../README.md) · [Research register](Research-Sources.md) · [Shared strategy](../../handbook/Agoda-Google-Preparation-Strategy.md)

**Updated October 9, 2026.** Focus on recognizing a model from an unfamiliar story, explaining correctness, and adapting to follow-ups.

| Area | Material | Finish before the round |
| --- | --- | --- |
| Technical screen, if scheduled | [DSA bank and four worked solutions](01-DSA-Coding-Questions-and-Solutions.md) | One unseen problem with tests and complexity in 45 minutes |
| Coding interviews | [Graph, tree, interval, heap, and DP practice](01-DSA-Coding-Questions-and-Solutions.md) | Multiple independent mocks including changed requirements |
| System design | [Design workbook](02-System-Design-and-Followups.md) | Two designs with estimates, consistency, failures, and evolution |
| Leadership / collaboration | [Leadership and project workbook](03-Leadership-and-Team-Matching.md) | Six evidence stories and a clear ownership narrative |
| Team matching, if applicable | [Questions and project fit](03-Leadership-and-Team-Matching.md) | Connect real experience to the team's technical problems |

A 2025 L5 report describes three coding rounds, design, and leadership; another candidate reports extra coding later. Treat these as examples, not a fixed five-round loop or a published pass formula. [G4–G5](Research-Sources.md)

## Research-based priorities

Topological ordering appears in multiple relevant accounts; other themes include weighted graph search, trees, and connectivity. This small, self-selected sample supports **extra graph practice**, not the claim that most Google questions are graphs. The 2026 account's publication date is later than its described interview period. [G1–G3](Research-Sources.md)

Recommended full-loop time split: **60% coding, 25% design, 15% leadership**. These are our study allocations. Keep design in the plan from week one; do not postpone it until every coding question is solved.

## First seven study sessions

| Session | Coding | L5 preparation |
| --- | --- | --- |
| 1 | Course Schedule II, then alien ordering | Capture two project summaries |
| 2 | Multi-source BFS; 0–1 weighted paths | Distributed cache requirements and estimates |
| 3 | Connectivity and union-find | Failure handling and consistency |
| 4 | Tree traversal and LCA | Ownership and disagreement stories |
| 5 | Intervals and binary search | Feed pagination and ranking boundaries |
| 6 | DP plus heap / optimal merge practice | Design with a changed requirement |
| 7 | Two unseen 45-minute coding mocks | Leadership rehearsal and gap review |

For TypeScript, practice a head-index queue, a heap, explicit graph state, and safe numeric bounds. Confirm accepted languages and runtime/library support in the invitation.

Run all new examples from the repository root with Node.js 22.13+:

```sh
node examples/check-agoda-google-examples.mjs
```

These checks execute the Markdown solutions; they do not perform static TypeScript checking.
