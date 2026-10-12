# Netflix preparation by interview area

[Company index](../README.md) · [Research register](Research-Sources.md) · [Study strategy](../../handbook/Stripe-Netflix-Preparation-Strategy.md)

**Updated October 12, 2026.** Target: experienced general SWE with senior-level follow-ups. Confirm the role before choosing Ads, playback, infrastructure, or UI-specific exercises.

| Area | Open this material | Practice outcome |
| --- | --- | --- |
| Recruiter / hiring manager | [Project and culture workbook](03-Culture-and-Project-Deep-Dive.md) | Explain relevant experience and scope concretely |
| Technical screen / coding | [Four worked solutions and 24-question bank](01-DSA-and-Stateful-Coding.md) | Implement and test stateful contracts and algorithms |
| Practical coding / take-home, if included | [Team-specific drills](02-System-Design-and-Data-Modeling.md) | Demonstrate domain and runtime fluency |
| System design / data modeling | [Design workbook](02-System-Design-and-Data-Modeling.md) | Data model, invariants, failures, and trade-offs |
| Culture / collaboration | [Culture and project depth](03-Culture-and-Project-Deep-Dive.md) | Truthful evidence of judgment, feedback, and ownership |

## Research-based priorities

A firsthand Warsaw full-stack account reports different formats across two teams and a cache-related screen, but its offer was **L4**. Recent Senior/Staff Ads summaries add expiration, versioned state, and domain modeling; these come from a preparation publisher and are weaker evidence. A LeetCode notification-time question has no stated level. See [N1–N6](Research-Sources.md).

The resulting recommendation is **caches/stateful APIs plus broad DSA and team-relevant design**. It is not a claim that cache questions dominate every Netflix interview. Do not use Ads reposts as independent confirmation of one universal loop.

Recommended time split: **45% coding, 35% design/data modeling, 20% projects/culture**. These are preparation priorities, not official weights.

## First seven sessions

| Session | Coding | Other preparation |
| --- | --- | --- |
| 1 | Timed cache and expiration boundary | Confirm team/domain and level |
| 2 | Versioned store and predecessor search | One detailed project brief |
| 3 | Undo/redo and branch invalidation | Data-modeling drill |
| 4 | Minimum notification time | Scale estimates and failure handling |
| 5 | Tree traversal, intervals, graph fundamentals | Feedback and decision-ownership stories |
| 6 | Unseen 45-minute coding mock | Team-specific design mock |
| 7 | Change requirements on a prior solution | Project/culture rehearsal and gap review |

For frontend/full-stack roles, include JavaScript async behavior, stale responses, and UI state. For Ads, include frequency constraints and campaign data. Neither branch replaces general problem solving.

Run new examples from the repository root with Node.js 22.13+:

```sh
node examples/check-stripe-netflix-examples.mjs
```

Runtime tests execute the code in the Markdown; static type checking is separate.
