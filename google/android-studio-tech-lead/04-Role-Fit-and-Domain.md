# Role fit, Android Studio foundations and debugging questions

[Track index](README.md) · [Recruiter workbook](../rounds/00-Recruiter-Screening.md) · [Design mocks](03-System-Design.md)

## A role-specific introduction

Adapt the motivation to your own reasons; the experience claims below come from your resume.

> I'm a full-stack engineer with about six years of software experience, with strong React/TypeScript experience and backend work in Node.js and Python. At Ushur I led Superset-based analytics development and owned a FastAPI/dbt service through deployment. At CoverSelf I work on AI-assisted authoring, data handling and reusable UI components. My product work at Luckd also includes payment correctness and reconciliation across apps and backend services.
>
> The Android Studio role interests me because it brings together complex user workflows, performance, debugging and tools that help other developers work effectively. My relevant experience is in product engineering, application tooling and end-to-end delivery. I'd like to understand which Android Studio subsystem this team owns and how much immediate Java/Kotlin and IntelliJ-platform depth it expects.

Do not claim that using React Native or shipping Android apps means you have built Android Studio internals. Your resume does not establish production Java/Kotlin, IntelliJ plugins or compiler implementation. A credible answer is: “My primary languages have been TypeScript/JavaScript and Python. I've begun studying the IDE platform and build/indexing model; I would need to ramp up on the team's Java/Kotlin codebase.” Describe completed study or hands-on work only after doing it.

## Map experience to the role without inflating it

| Resume evidence | Relevant angle to explain | Boundary / preparation gap |
| --- | --- | --- |
| CoverSelf authoring/editor workflows | Complex editing UX, state, user feedback and workflow correctness | Not evidence of syntax analysis, refactoring engines or PSI ownership |
| Frontend caching, IndexedDB, DuckDB-WASM | Memory/performance trade-offs, invalidation and local computation | Browser data processing is not equivalent to an IDE's semantic index |
| Ushur dbt/FastAPI, tests and CI/CD | Dependency-oriented transformation, reproducibility and deployment | Explain actual responsibilities; do not claim Gradle engine ownership |
| Custom Superset MCP and AI analyst POC | Tool integration, orchestration, context and error handling | Keep the POC label; model evaluation and production scale need evidence |
| Luckd concurrency/idempotency/recovery | State-machine correctness and duplicate/uncertain outcomes | No claim of distributed transaction-engine implementation |
| Shared components/design tokens | Consistent APIs, adoption and enabling collaborators | Supply real adoption/review evidence; no invented mentoring or direct reports |

For the matching posting, prepare evidence of design reviews, code review, documentation, debugging and delivery. Having about six software years does not satisfy an eight-year preference by arithmetic; explain your relevant ownership honestly. The accessible posting does not identify L5, so retain L5 as your preparation target until confirmed. [Official matching posting](https://www.google.com/about/careers/applications/jobs/results/84604442862592710-senior-software-engineer/)

## Domain questions: concise model answers

**1. What is Android Studio built on?** It is an Android-focused IDE based on IntelliJ IDEA, with Gradle-based builds and Android-specific tooling such as emulation, testing and inspection. Distinguish the IDE, Android Gradle Plugin, Gradle, SDK tools and application being developed. A failure visible in the IDE can originate in any of those layers. [Android Studio overview](https://developer.android.com/studio/intro)

**2. What is the difference between a build dependency and a semantic code reference?** A build dependency says one task/artifact must be available before another can execute. A semantic reference resolves a source usage to a declaration under language/scope rules. Both may form graphs, but the entities, update rules and correctness requirements differ. A topological-sort exercise is a useful build-scheduling model, not a complete IDE design.

**3. Why keep indexes instead of parsing all files for each query?** Precomputed lookup structures trade storage and update work for fast queries. IntelliJ offers file-based indexes and stub indexes; compact stubs capture declaration information without loading full syntax structures. Index-dependent operations must handle periods when indexes are unavailable (“dumb mode”). Do not label work safe during that period if it still needs an unavailable index. [Indexing and PSI stubs](https://plugins.jetbrains.com/docs/intellij/indexing-and-psi-stubs.html)

**4. AST versus PSI versus text?** Text is the current document content; an AST captures parsed syntax. IntelliJ PSI exposes a richer program structure for language-aware IDE features. For interview design, specify which representation your operation needs: substring search, syntax highlighting and semantic rename need different guarantees. Incomplete source while typing is normal; design recovery rather than assuming every edit parses successfully. Verify concrete PSI APIs against the platform SDK rather than memorizing names. [PSI documentation](https://plugins.jetbrains.com/docs/intellij/psi.html)

**5. What does “incremental” actually mean?** Recompute only what a change invalidates, under a complete dependency/input model. Incremental build checks can skip unchanged tasks; build-cache lookup can restore outputs for a matching action. Configuration caching addresses another stage and is not synonymous with output caching. Untracked environmental input breaks reuse correctness. [Gradle incremental build](https://docs.gradle.org/current/userguide/incremental_build.html), [build cache](https://docs.gradle.org/current/userguide/build_cache.html), [cache layout](https://docs.gradle.org/current/userguide/directory_layout.html)

**6. How would you keep an IDE responsive?** Keep blocking I/O and expensive scans off the UI event thread, make background work cancelable and publish results only if their document/project version is still valid. Respect the platform's read/write access rules; a background thread alone does not make shared model access safe. Long read work can delay writes, so use appropriate scheduling and cancellation for the target platform version. [IntelliJ threading model](https://plugins.jetbrains.com/docs/intellij/threading-model.html)

**7. Does a plugin classloader sandbox plugin code?** No. Class loading separates plugin classes/dependencies but is not an authorization boundary or crash isolation. An untrusted extension design may require process isolation and constrained IPC. In-process plugins must follow host lifecycle and access rules. [Class loaders](https://plugins.jetbrains.com/docs/intellij/plugin-class-loaders.html)

**8. Why do listeners cause leaks?** A longer-lived publisher can retain a listener and, through it, a closed project's model/UI. Tie listeners, jobs and resources to the appropriate owner and dispose/cancel them when that owner ends. Verify with repeated open/close/unload cycles; garbage collection does not fix references that remain reachable. [Disposer and Disposable](https://plugins.jetbrains.com/docs/intellij/disposers.html)

**9. Physical device or emulator?** Choose based on required capability, fidelity, availability and cost. A test matrix can vary API level, device and architecture. Device scarcity and environment failures must be distinguishable from assertion failures; retries should preserve evidence of flakiness. Avoid memorizing a current device catalog as architecture knowledge. [Test Lab device documentation](https://firebase.google.com/docs/test-lab/android/available-testing-devices)

**10. What does accessibility mean for a developer tool?** Keyboard access, discoverable focus order, labels readable by assistive technology, non-color-only status cues and usable scaling/contrast are examples to evaluate. Include error/output panes and dialogs, not just the editor. Your resume does not establish an accessibility project; discuss how you would test these behaviors without claiming past implementation.

## Three debugging drills

These are proposed investigation plans. Do not claim you used a profiler, incident process or JVM technique unless you actually did.

**Typing freezes after installing an extension.** First reproduce with a minimal project and compare extension enabled/disabled, IDE version and representative workload. Capture thread/CPU evidence during the stall, inspect long event-thread work and lock contention, and determine whether indexing, I/O or repeated callbacks are involved. Mitigate by disabling the offending path or canceling excessive work. Verify typing latency and functionality afterward, not just lower CPU. Follow-up: the freeze occurs only during indexing—inspect access/scheduling and cancellation assumptions.

**A build uses outdated generated code.** Record exact inputs, toolchain, task graph, cache state and output digest. Compare a clean noncached run to the failing run; inspect missing dependencies, undeclared inputs, configuration changes and partial publication. A clean build is a useful diagnostic/mitigation, not the root-cause fix. Add a regression that changes or deletes the previously untracked input. Follow-up: only CI fails—compare environment, remote cache provenance and toolchain versions.

**Heap grows after opening and closing projects.** Reproduce multiple cycles, compare retained objects after cleanup and inspect references from application-level services/listeners/jobs. Identify ownership and cancel/dispose at the correct boundary. Verify background callbacks cannot access a closed project. Follow-up: heap falls after a long delay—distinguish delayed collection from a persistent leak using retained references and repeated steady-state measurements.

## A small learning exercise after the immediate assessment

Time-box to 2–3 hours. Use an existing Android project if available; otherwise choose a small official sample. Record IDE, JDK, Gradle and plugin versions. Build once, build unchanged, edit one source file, then rebuild. Observe task outcomes and timing; explain what reran and what did not. Change a build input and predict the effect before running. Keep local observations separate from general claims about Gradle behavior.

Next, read a minimal IntelliJ plugin example and identify its entry point, extension registration, background work and disposal ownership. Installing tools or creating a sample project is a separate optional exercise; this preparation update does not install an SDK or change your environment.

## Ask the recruiter or hiring manager

- Which subsystem is involved: editing/indexing, build integration, test authoring/execution, debugging, device tooling or AI assistance?
- What Java/Kotlin and IntelliJ-platform proficiency is expected on day one versus during ramp-up?
- Does the technical interview require a particular implementation language beyond general coding rounds?
- What does Tech Lead mean here: project leadership, design ownership, mentoring, coordination or direct reports?
- What design, debugging or code-review discussions are planned, and how should I prepare for them?

The older Java/Kotlin/testing-specific role mentioned in your pasted notes has no supplied URL. It is not used as evidence that this vacancy owns that subsystem.
