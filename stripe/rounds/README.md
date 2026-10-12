# Stripe preparation by interview area

[Company index](../README.md) · [Research register](Research-Sources.md) · [Study strategy](../../handbook/Stripe-Netflix-Preparation-Strategy.md)

**Updated October 12, 2026.** Numbering is study order, not a promised interview sequence. Target: experienced backend/general SWE, subject to your recruiter-confirmed level and loop.

| Area | Open this material | Practice outcome |
| --- | --- | --- |
| OA / technical screen, if scheduled | [Multipart coding and DSA](01-DSA-and-Multipart-Coding.md) | Extend a working solution as requirements arrive |
| Programming | [Three worked coding exercises and 24-question bank](01-DSA-and-Multipart-Coding.md) | Parsing, maps, sorting, scheduling, clear tests |
| Integration | [API fixture and worked solution](02-Integration-and-Bug-Squash.md) | Fetch pages, validate, deduplicate, and handle failures |
| Bug squash / debugging | [Debugging exercises and workflow](02-Integration-and-Bug-Squash.md) | Reproduce, trace, fix the cause, add a regression |
| System design, if included | [Design workbook](03-System-Design-and-Followups.md) | Retry-safe operations, event delivery, financial state |
| Hiring manager / leadership | [Project workbook](04-Leadership-and-Projects.md) | User impact, judgment, collaboration, ownership |

## What the research suggests

Two 2026 backend accounts describe practical programming, integration, and debugging. One describes subscription scheduling and duplicate requests; another reports an AI-assisted assessment. These are individual accounts with unspecified seniority. Prioritize practical implementation, but do not infer that algorithms never appear or that every loop has the same rounds. [S1–S2](Research-Sources.md)

Recommended full-loop allocation: **35% multipart coding/DSA, 30% integration/debugging, 20% design, 15% projects/leadership**. This is our study allocation, not employer scoring. Increase coding when the next confirmed interview is a screen.

## First seven sessions

| Session | Coding / practical work | Other preparation |
| --- | --- | --- |
| 1 | Baseline parsing and map drill | Confirm level, language, editor, and rounds |
| 2 | Language preferences and subscription scheduling | One project facts sheet |
| 3 | Request replay with conflicting payloads | Idempotent API design |
| 4 | Paginated integration fixture | Retry and partial-failure semantics |
| 5 | Two debugging reproductions | User-impact and disagreement stories |
| 6 | 45-minute multipart coding mock | Webhook-delivery design |
| 7 | 45-minute integration or bug-squash mock | Review failures and schedule retries |

Forty-five minutes is a rehearsal budget reflected in some candidate reports, not a guaranteed appointment duration. Measure correctness and extension speed, not just the number of parts completed.

Run new examples from the repository root with Node.js 22.13+:

```sh
node examples/check-stripe-netflix-examples.mjs
```

The checker executes Markdown TypeScript using type stripping; it does not statically type-check it.
