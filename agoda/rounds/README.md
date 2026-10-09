# Agoda Staff: preparation by interview area

[Company index](../README.md) · [Research register](Research-Sources.md) · [Shared strategy](../../handbook/Agoda-Google-Preparation-Strategy.md)

**Updated October 9, 2026.** Numbering is study order, not guaranteed interview order. Agoda's [official guide](https://careersatagoda.com/interview) says the process varies by role/team and emphasizes reasoning, clarification, and improvement.

| Area | Material | Finish before the round |
| --- | --- | --- |
| OA, if assigned | [DSA bank and API exercise](01-DSA-Coding-Questions-and-Solutions.md) | One timed two-task mock; confirm platform and duration |
| Live coding | [Four worked solutions and 24-question bank](01-DSA-Coding-Questions-and-Solutions.md) | Parsing, monotonic stacks, ranking, maps; test changed requirements |
| Platform / code review | [Architecture critique and review exercise](02-Platform-and-System-Design.md) | Prioritize correctness and operational risks; propose a staged fix |
| System design | [Supplier API, aggregation, and booking](02-Platform-and-System-Design.md) | APIs, data ownership, contention, retries, failure recovery |
| Hiring manager / leadership | [Project and leadership workbook](03-Leadership-and-Project-Deep-Dive.md) | Two project deep dives and six truthful evidence stories |

## What the research changes about preparation

Two distinct LeetCode Staff accounts describe monotonic-stack/ranking and formula-parsing coding themes, respectively. Both also describe platform or code-review work. A Reddit backend Staff/SSE account adds an API-oriented OA and a different loop. These support practicing implementation plus engineering judgment; they do not establish question frequencies. See [A1–A3](Research-Sources.md).

Recommended full-loop time split: **45% coding, 35% platform/design, 20% project/leadership**. If coding is the next scheduled round, temporarily use 70% coding. These are study allocations, not employer scoring weights.

## First seven study sessions

| Session | Coding | Staff preparation |
| --- | --- | --- |
| 1 | Baseline: nearest smaller + rank transform | Record role, team, level, language, round format |
| 2 | Formula parser, then nested groups | Supplier API isolation and incremental reads |
| 3 | Daily Temperatures + Largest Rectangle | Review the unsafe booking endpoint |
| 4 | Merge Intervals + LRU Cache | Flight aggregation with slow suppliers |
| 5 | Top K + dictionary update semantics | Booking contention and payment reconciliation |
| 6 | Paginated API exercise or OA mock | One project with decisions, metrics, and rollout |
| 7 | 60-minute live-coding rehearsal | Platform mock and evidence-story rehearsal |

Repeat weak patterns using the shared tracker. Sixty minutes is a rehearsal format reflected in some reports, not a confirmed appointment length.

From the repository root, verify all new worked solutions with:

```sh
node examples/check-agoda-google-examples.mjs
```

Node.js 22.13+ is required. The checker executes Markdown TypeScript through type stripping; it is not a static type checker.
