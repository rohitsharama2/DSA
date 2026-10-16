# Sources and confidence

[Track index](README.md)

Access date: **October 16, 2026**. Sources support role requirements and technical foundations, not question-frequency claims or an official assessment scoring guide. All exercise wording, proposed architectures, sizing assumptions, scripts and practice rubrics are original preparation material.

| ID | Source | What it supports / limits |
| --- | --- | --- |
| U1 | User-supplied Android Studio targeted-preparation attachment | Role title, assessment-stage notes, JavaScript preference, four-week planning assumption, 16 problem titles, six design prompts and six judgment themes. Assessment format/deadline and claimed earlier weaknesses are not independently verified |
| U2 | User follow-up: “Senior Software Engineer, Tech Lead, Android Studio - Bengaluru; Updated 3 days ago” | Confirms target title/location; does not supply a requisition ID or absolute posting date |
| J1 | [Matching official Google Careers posting](https://www.google.com/about/careers/applications/jobs/results/84604442862592710-senior-software-engineer/) | Same title/location; accessible qualifications and responsibilities. Exact match to user's application unconfirmed. No explicit L5 or interview-round specification. Do not convert preferred years into mandatory years or infer the supported interview language |
| D1 | [Android Studio overview](https://developer.android.com/studio/intro) | IntelliJ basis, Gradle integration and Android tooling; does not describe the hiring team's specific subsystem |
| D2 | [Gradle incremental build](https://docs.gradle.org/current/userguide/incremental_build.html) | Declared inputs/outputs and avoiding unchanged work |
| D3 | [Gradle build cache](https://docs.gradle.org/current/userguide/build_cache.html) | Reuse of task outputs; not the same mechanism as caching configuration |
| D4 | [Gradle cache directories](https://docs.gradle.org/current/userguide/directory_layout.html) | Distinct incremental-build and configuration-cache state |
| D5 | [IntelliJ indexing and PSI stubs](https://plugins.jetbrains.com/docs/intellij/indexing-and-psi-stubs.html) | File/stub indexes and index-unavailable mode |
| D6 | [IntelliJ threading model](https://plugins.jetbrains.com/docs/intellij/threading-model.html) | Background/UI work and read/write access requirements; implementation APIs depend on platform version |
| D7 | [Plugin class loaders](https://plugins.jetbrains.com/docs/intellij/plugin-class-loaders.html) | Class/dependency loading behavior, not a security sandbox |
| D8 | [Disposer and Disposable](https://plugins.jetbrains.com/docs/intellij/disposers.html) | Scoped cleanup and resource lifecycle |
| D9 | [Firebase device documentation](https://firebase.google.com/docs/test-lab/android/available-testing-devices) | Physical/virtual test devices and capacity constraints; not a recommendation tied to current pricing or a promise of service availability |
| D10 | [IntelliJ PSI](https://plugins.jetbrains.com/docs/intellij/psi.html) | Program-structure representation for language-aware features |
| R1 | Local resume sources and October 12 clarification notes in `coach/workspace/resume/` | User-supplied work history and outcomes, not independently audited. Workspace files may be Git-ignored and absent in remote copies |

The attachment referenced an older Apna posting without a URL. It is not used to infer a Java/Kotlin requirement or testing-subsystem assignment for the current vacancy. Java/Kotlin and IntelliJ ramp-up are domain-preparation gaps, not a claim that the recruiter has imposed a language requirement.

Keep the original general [Google source register](../rounds/Research-Sources.md) for candidate-report provenance. This role-specific track does not turn those general SWE reports into Android Studio interview evidence. Recheck the invitation and recruiter guidance when they arrive.
