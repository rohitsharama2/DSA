# Airbnb preparation by interview round

**Target: Internationalization Infrastructure / Application Platform. Preferred stack: JavaScript/TypeScript + React.**

**Updated October 7, 2026.** Start here to prepare for a specific interview. The original numbered “phases” are learning stages; the pages below organize material by interview purpose.

Your 90-minute CodeSignal preparation remains available. The next focus is live DSA coding, followed by the rest of your recruiter-confirmed loop. Numbering below is a study order, not a promise that Airbnb schedules these rounds in this exact order or includes every round. A hiring-manager conversation may happen earlier; additional rounds can be added.

| Study order / interview area | Open this material | What to finish |
| --- | --- | --- |
| 0. CodeSignal OA — 90 minutes | [Progressive coding workbook](../CodeSignal-90-Minute-Progressive-Workbook.md) | Complete four-level practice and regressions |
| 1. Live DSA screen and onsite coding | [Reported DSA questions with solutions](01-DSA-Coding-Questions-and-Solutions.md) | Nine worked exercises plus the existing menu/split-stay/DP answers |
| 2. PR review / practical coding, if scheduled | [PR review preparation](../04-PR-Review-and-Practical-Coding.md) | Review three PRs, prioritize impact, propose tests |
| 3. System design / architecture | [Design question bank and follow-up answers](02-System-Design-Questions-and-Followups.md) | Booking, tickets, chat, experiments, then transfer scenarios |
| 4. Project / technical experience | [Project explanation workbook](03-Project-Deep-Dive.md) | Two real project narratives, diagrams, decisions, evidence |
| 5. Hiring manager / collaboration | [Expectations and answer practice](04-Hiring-Manager-Questions-and-Answers.md) | Rehearse specific truthful answers and questions for the team |
| Role-specific full-stack preparation | [JS/TS, React and i18n exercises](05-JS-TS-React-and-I18n.md) | Fallback graphs, Unicode, bounded concurrency, React async state |
| 6. Core values | [Core values and community stories](../06-Core-Values-and-Behavioral.md) | Four values mapped to real experiences |

The distinction between the progressive OA and a later live DSA screen appears in a [September 2026 candidate discussion](https://www.reddit.com/r/leetcode/comments/1war0eb/airbnb_technical_screen_interview_45_min/). Confirm your invitation rather than treating every CodeSignal session as the same format.

## Suggested preparation after CodeSignal

| Day | Coding | Other round |
| --- | --- | --- |
| 1 | Ripple components and directed reachability | Prepare your project facts sheet |
| 2 | Shortest uncommon substring; minimum window | Translation workflow and booking transactions |
| 3 | Skiing DP and many-start follow-up | Translation delivery, migration and ticket assignment |
| 4 | Maze BFS and sliding puzzle | Group chat with real queries/indexes |
| 5 | Flights with stops and path; water simulation | A/B platform and experiment semantics |
| 6 | Menu order and split stay from existing workbook | Project deep dive and HM mock |
| 7 | One unseen 45-minute coding mock | One 50-minute design mock; review gaps |

Repeat weak areas rather than treating seven days as a guaranteed preparation duration. All time budgets are rehearsal suggestions.

## Evidence and existing answers

- [Research sources and recency limitations](Research-Sources.md): dates, firsthand vs. reposted evidence, inaccessible material.
- [Existing eight questions and worked answers](../Candidate-Questions-and-Solutions.md): menu, split stay, work sessions, climbing stairs, obstacle course, A/B analysis, partition, maximum-sum BST.
- [Original study phases](../README.md): foundations and longer-term schedule.

**Next action:** Attempt the property ripple problem in the DSA page. Explain whether its edges are symmetric before writing code.

## Run the example checks

From the repository root with Node.js 22.13 or newer:

```sh
node airbnb/examples/check-round-examples.mjs
node airbnb/examples/check-workbook-examples.mjs
```

The first script executes the new DSA and pure/async i18n helpers directly from Markdown. The second verifies the existing CodeSignal and candidate-question workbooks. These are runtime checks using TypeScript stripping, not static type checks. The React TSX example needs a React app/test environment and is not executed by these scripts.
