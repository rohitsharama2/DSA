# Google L5: leadership, projects, and team matching

[Round-wise index](README.md) · [Research register](Research-Sources.md)

Leadership and team-fit conversations appear in [G1](https://leetcode.com/discuss/post/6349651/google-l5-bangalore-selected-interview-e-3wj2/) and [G4](https://www.reddit.com/r/leetcode/comments/1k3iqyr/google_india_sr_software_eng_l5_hired_interview/). The prompts below are a practice workbook, not an official scoring rubric.

Use the [behavioral answer companion](../solutions/Behavioral-Answers.md) for spoken templates and answers to every project follow-up. Fill personal-history gaps with your actual events.

## Prepare evidence of independent ownership

Select two projects where you can explain the problem, your decisions, collaboration boundaries, delivery, and operational results. Rehearse both a two-minute overview and a technical deep dive. For an L5-targeted preparation exercise, emphasize taking an ambiguous project through implementation and helping others deliver; do not substitute job title or tenure for evidence.

| Practice question | Answer ingredients | Push deeper |
| --- | --- | --- |
| Tell me about an ambiguous problem you owned | Initial uncertainty, questions, alternatives, milestones, measured result | What did you decide independently? |
| Describe a technical disagreement | Other person's strongest argument, evidence, resolution, support afterward | What would change your mind? |
| When did you change direction? | New information, sunk-cost handling, revised plan | How did you communicate the impact? |
| Tell me about a failure | Your contribution, repair, learning, prevention | What would a teammate say you missed? |
| How did you improve another engineer's effectiveness? | Specific support, feedback, increased autonomy | How did you know the help worked? |
| How did you balance speed and quality? | Risk classification, staged release, debt owner, follow-up | What did you refuse to defer? |

Use situation/task/action/result plus reflection. Be explicit about “I” decisions and “we” outcomes; acknowledge limitations in attribution. There is no need to memorize a polished speech if you cannot defend its details.

## Project follow-ups to answer without notes

1. What were the actual bottleneck and baseline measurement?
2. Why was your chosen algorithm or architecture appropriate to that scale?
3. What was the hardest failure mode and how was it detected?
4. Which alternative did you reject, and under what conditions would it be better?
5. How did rollout, rollback, and on-call ownership work?
6. Which result was measured, which was estimated, and what remained unresolved?

## Team matching preparation

Prepare a short map from your experience to the team's problems: relevant domain, transferable technical decisions, current gaps, and what you want to learn. A candidate report's matching experience does not guarantee the ordering or outcome of your process.

Ask about the team's current bottleneck, expected first project, design ownership, operational load, partner teams, and the balance of product delivery with infrastructure work. Explain a real example of a related problem you solved; do not imply experience you lack.

**Readiness:** Two defensible project briefs; six distinct stories; clear individual decisions; evidence of collaboration; honest learning from failure. Reuse facts from the Agoda workbook where applicable, but tailor emphasis to this role's scope.

## October 14 update: Googleyness rehearsal for Rohit

Source for personalization: [your senior full-stack resume draft](../../coach/workspace/resume/senior-fullstack-draft.md). These are story candidates, not verified achievements beyond the draft and not invented answers. Use a story only if you can supply the missing decisions, people, timeline and evidence. Keep estimated savings/API reductions explicitly estimated; preserve POC versus production distinctions.

| Story candidate | Questions it may support | Facts to prepare before rehearsal |
| --- | --- | --- |
| Ushur Superset / Self-Serve Insights migration | Ambiguity, ownership, stakeholder influence, build versus buy | Alternatives; your authority; rollout/rollback; who disagreed; calculation behind estimated $400K–$500K annual savings |
| Luckd payment and reconciliation work | Reliability, difficult trade-off, end-to-end ownership | Duplicate/uncertain-payment sequence; invariant; actual safeguards; failure handling; individual versus shared work |
| CoverSelf AI claims authoring | User impact, ambiguous requirements, balancing speed and quality | How the 85% figure was measured; sample/baseline; human review; unsafe or incorrect output handling |
| CoverSelf caching / re-render fixes | Debugging, simplification, customer focus | Root cause; cache invalidation; stale-data risk; basis for estimated 30% API reduction |
| Ushur dbt/FastAPI service | Cross-stack delivery, operational ownership | Metric behind 25%; failed deployment/recovery if one occurred; tests, dependency boundaries and handoff |
| Reusable components / design tokens | Influence, enabling others, consistency | Actual adopters; resistance if any; migration plan; feedback and maintainability outcome |

The resume does **not** establish a real conflict, failure, mentoring event or difficult feedback story. Supply one actual example for each missing category instead of retrofitting a success into a fabricated disagreement. Strong scope comes from your decisions and impact, not inflating team size.

### Six practice questions and follow-up ladders

1. “Tell me about a project where the requirements were unclear.” What did you clarify? What did you choose without your manager? What changed and why?
2. “Tell me about disagreement with a peer or product partner.” Present their strongest case. What evidence changed the decision? How did you support the outcome?
3. “Describe a mistake that affected users or delivery.” What was your contribution? Who did you inform? What did you change afterward and how did you verify it?
4. “How did you help another engineer become more independent?” Give a concrete intervention, follow-up and result. Distinguish mentoring from doing their work yourself.
5. “When did you receive feedback you initially disagreed with?” Use situation → observed behavior → impact, then show what you changed.
6. “How did you balance a deadline against quality?” State risks, non-negotiable safeguards, staged scope, debt owner and follow-through.

Practice a two-minute STAR: 20 seconds situation, 15 task, 60 actions/decisions, 25 result and learning. Then spend five minutes on challenges to your account. For failure, use Context → Action → Result → Learning. These are coaching timings, not Google scoring rules.

**Story card:** date/project; stakes; personal mandate; two alternatives; decision and why; collaborator's perspective; obstacle; outcome; measurement source; what failed; what you would change. Record gaps as unknown. Avoid blaming, claiming sole credit for shared work, or turning every failure into an effortless success.

For the initial recruiter call, use the [dedicated screening workbook](00-Recruiter-Screening.md): it expands the introduction below into resume-specific project answers, role/level positioning, compensation/logistics prompts and a timed mock.

### Recruiter / manager introduction to adapt

“I build full-stack enterprise and product workflows across React/TypeScript, Node.js and Python. My recent work includes analytics migration at Ushur, AI-assisted claims workflows at CoverSelf, and payment/reconciliation flows for Luckd. I enjoy owning the interaction between user-facing behavior and backend correctness. For this role, I'd like to understand which product or platform problems the team needs a senior engineer to own.”

Add one defensible outcome and your specific motivation for the team. Do not describe the AI analyst POC as a large-scale production ML deployment.

### Team-match meeting rehearsal

Prepare a two-minute introduction, a ten-minute project deep dive, and questions about the first six months, ownership boundaries, review/on-call expectations, partner teams, product-versus-platform mix and success measures. Match Superset to analytics, Luckd to transactional systems, and CoverSelf to AI-assisted workflows only when relevant. Be candid about gaps.

The [India full-stack report](https://www.reddit.com/r/LeetcodeDesi/comments/1slxvll/cleared_google_l5_india_team_matching_taking_time/) documents waiting during matching and later updates its outcome; it does not predict your timeline. Ask your recruiter what remains, how matching operates for this requisition, and what information would help them present your fit. Do not infer an offer from encouraging conversations.

## October 16: prompts from the supplied L5 report

The [G9 anonymized repost](https://www.reddit.com/r/OfferEngineering/comments/1v6bivx/passed_google_l5_none_of_the_questions_were/) adds these behavioral themes. The wording below is paraphrased for practice; the source does not provide a transcript or verified scoring criteria.

1. Describe a major challenge you owned and how you handled it.
2. Describe a difficult working relationship and how you navigated it.
3. How did you manage several responsibilities competing for your attention?
4. Looking back, what would you do differently?

Use the existing story workbook to answer with real events; treat these as additional prompts against your existing stories, not four new stories to invent.
