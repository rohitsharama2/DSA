# Judgment scenarios and tech-lead stories

[Track index](README.md) · [Existing leadership workbook](../rounds/03-Leadership-and-Team-Matching.md)

Your supplied notes describe a possible workplace-judgment assessment. Confirm this from the invitation; the job title does not establish the format. These are original preparation scenarios, not live assessment items or an official answer key. During an actual assessment, answer independently and follow its assistance rules.

## A response model, not a fixed script

**Understand → assess impact → take ownership → collaborate → mitigate → follow through.** Separate urgent containment from longer-term diagnosis. Empathy means understanding constraints and offering useful support; accountability means an explicit owner, realistic commitment and follow-up. Escalation is appropriate when authority, material risk or persistent unresolved behavior requires it. “Always escalate” and “never escalate” both miss context.

For each drill, answer aloud before reading the discussion. Say your first action, immediate delivery mitigation, communication, and follow-up. Do not assume a colleague's motives or privately take over all their work.

## 1. Repeatedly missed deadlines

**Prompt:** A senior engineer misses a third milestone. A dependent team needs the component next week. They say they are almost done but provide no concrete status. What do you do today?

**Strong response:** Privately establish the remaining work, blockers, actual progress and competing responsibilities. Explain the observable misses and downstream impact without labeling the person. Agree a smaller verifiable milestone and appropriate pairing/review support. In parallel, assess the critical path and tell the dependent team the risk with options: reduce scope, change sequence or move the date. Make ownership and the next checkpoint explicit. If the pattern persists or authority/resources are needed, involve the manager with evidence, impact and attempted support.

**Weaker responses:** Publicly criticize them; silently finish their work yourself; accept another vague promise; escalate as punishment without facts; focus on a supportive conversation while leaving delivery risk hidden.

**Follow-ups:** They disclose a personal difficulty—respect privacy, discuss available support, involve the appropriate manager as needed, and still replan delivery. They reject every checkpoint—document the operational problem and involve the manager. The deadline is tomorrow—contain the immediate dependency risk before waiting for a complete root-cause investigation.

## 2. Critical bug before release

**Prompt:** A payment-related change can create duplicate state transitions. A release is due in two hours and a partner launch depends on it.

**Strong response:** Establish severity, affected paths and whether the defect is active. Pause or gate the affected rollout when the correctness risk warrants it; preserve unaffected safe scope if separable. Assign incident/fix ownership, reproduce the issue and communicate impact and next update time. Compare rollback, feature-disable and a tested fix. Validate duplicate/retry behavior and observability before restoring rollout. Reconcile already affected records where necessary and hold a learning review afterward.

**Weaker responses:** Ship because it is rare; patch without verification; conceal the bug until fixed; automatically stop every unrelated release; spend the whole response blaming the author.

**Follow-ups:** The manager wants to ship—explain the concrete invariant and user impact, offer safer scope and use the appropriate release/escalation authority. Rollback corrupts schema compatibility—choose a compatible mitigation, not a reflexive rollback. Your own change caused it—own that explicitly and still prioritize containment.

## 3. Architectural disagreement

**Prompt:** One engineer proposes a new indexing service; another wants an in-process index. Both claim their design is obviously better and progress has stalled.

**Strong response:** Restate shared requirements: latency, memory, offline behavior, failure isolation and maintenance constraints. Have each explain the strongest case and risks for both options. Identify the uncertain assumption that could change the choice; time-box a prototype or benchmark. Clarify the decision owner and deadline, record the decision and revisit triggers, and ask everyone to support implementation. Escalate a blocked decision through the agreed ownership path, not based on seniority or who argues longest.

**Weaker responses:** Vote without criteria; ask the manager to resolve all technical disagreements; keep debating indefinitely; combine both designs without understanding the added complexity.

**Follow-ups:** No time for a prototype—choose the simplest reversible option meeting known constraints and document uncertainty. You favor one option—invite evidence against it. The losing proposal becomes better later—revisit the recorded assumptions rather than defend the original choice for status.

## 4. A teammate struggles silently

**Prompt:** A teammate's change has stalled for several days. They say “fine” in stand-up but are repeatedly online late.

**Strong response:** Check in privately with observations and an open question. Ask about technical uncertainty, unclear scope or workload without diagnosing personal issues. Offer pairing, a smaller first milestone or clearer review support. Agree what help is useful and a near-term checkpoint. Rebalance delivery risk with the owner/manager if needed, while keeping private information private. Follow up to build independence rather than taking permanent control.

**Weaker responses:** Assume lack of competence; announce their struggle in a group; wait indefinitely for them to ask; rewrite everything yourself and call it mentoring.

**Follow-ups:** They decline help—agree an observable progress checkpoint and remain available. There is a user-impacting deadline—raise the delivery risk with necessary stakeholders without sharing personal details. The same issue repeats—ask whether onboarding, scope or supervision needs a structural change.

## 5. A requested shortcut risks reliability

**Prompt:** Your manager asks you to bypass a compatibility check to ship an IDE plugin feature this week.

**Strong response:** Learn which check and risk are involved. Explain a concrete failure example and affected users. Offer options such as a narrower supported-version range, a disabled-by-default rollout, targeted compatibility tests or deferring the unsafe part. Document the decision and owner. If a serious known risk remains unresolved, use the appropriate escalation path; do not quietly remove the safeguard or frame disagreement as a personal confrontation.

**Weaker responses:** Obey automatically; refuse without alternatives; add undocumented bypasses; claim every test is equally critical and block all delivery.

**Follow-ups:** The check is flaky—quarantine/fix it with an explicit owner and substitute evidence rather than treating flaky tests as proof of safety. The risk is genuinely low and reversible—agree a monitored staged release and rollback trigger. There is no rollback—raise the required evidence and reduce the blast radius before proceeding.

## 6. Another team's dependency threatens a milestone

**Prompt:** An API needed for your feature will be late. Your team can build a temporary workaround, but it may become long-term technical debt.

**Strong response:** Confirm the dependency's true status and minimum interface you need. Agree named owners and checkpoints with the other team. Assess a stub for development, a reduced integration contract, resequencing or a staged launch. If a workaround is justified, define its constraints, removal owner and trigger/date. Communicate the revised plan and impact early. Escalate priority/resource conflicts jointly with options when the teams cannot resolve them.

**Weaker responses:** Blame the other team at the last minute; promise the original date without a plan; fork their system permanently without agreement; create a temporary integration with no retirement plan.

**Follow-ups:** They have a higher-priority incident—adjust rather than demand your date. Your team misunderstood the API—own the misunderstanding and fix the contract. The temporary path touches user data—establish correctness and access boundaries before using it.

## Practice scoring

Score each response 0–2 on: fact-finding, impact/urgency, personal ownership, respectful collaboration, concrete mitigation, and follow-through. Maximum 12 is a coaching scale only. A good answer changes when urgency, authority or reversibility changes. Retest your two lowest dimensions with a new scenario; do not optimize for a memorized personality profile.

## Convert resume projects into genuine leadership evidence

| Story candidate | Supported starting point | Missing evidence to supply |
| --- | --- | --- |
| Ushur Self-Serve Insights | Led full-stack analytics work; estimated $400K–$500K annual savings | A real decision, alternatives, collaborators, dependencies, rollout and estimate basis |
| CoverSelf shared components | Reusable components, design tokens and theming | Who adopted them, how you obtained agreement, migration support and observed effect |
| Luckd correctness | Payment verification, idempotency, concurrency controls and reconciliation | A real delivery trade-off or incident; actual safeguards; your authority and collaborators |
| Ushur AI analyst POC | Custom Superset MCP integrations and orchestration UI | Ambiguity you resolved, evaluation, rejected approach and what remained a POC |
| CoverSelf rendering/caching | Fixed repeated renders; estimated 30% fewer API requests | Root-cause evidence, regression tests, correctness trade-off and deployment outcome |

Prepare six factual story cards: ambiguous ownership, disagreement, failure, mentoring, risky deadline and dependency coordination. The resume alone does not establish a conflict, incident or mentoring event. Use STAR for the main answer, SBI for feedback and CARL for learning. Aim for two minutes: brief situation/mandate, your decisions, outcome and reflection. Give “I” for your actions and “we” for shared outcomes.

**Tech-lead probes:** What did you delegate? What decision could others make without you? What did a review change? How did you make delivery risk visible? What would your collaborator say? If you do not have direct reports, explain technical leadership without implying people-management authority.
