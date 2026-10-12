# Local SWE Interview Coach

Use the [kirilxd/swe-interview-coach](https://github.com/kirilxd/swe-interview-coach) project alongside this repository's company guides. **Installed and verified October 12, 2026.**

## What is installed on this machine

| Environment | Installed component | How to use it |
| --- | --- | --- |
| Claude Code | Full `swe-interview-coach@kirilxd-plugins` plugin, version `1.0.0`, user scope, enabled | Behavioral, coding, and system-design commands below |
| Codex | `behavioral-frameworks`, `coding-frameworks`, `system-design-frameworks` | Invoke the individual skills in chat |

The upstream project is a **Claude Code plugin**, not one standalone Codex skill. Its three framework skills were installed into Codex unchanged; that does not register the plugin's slash commands, canvas orchestration, or coding-session workflow in Codex.

Reviewed source revision: [`97e4265abd4b559f47776378a1316765e332129e`](https://github.com/kirilxd/swe-interview-coach/tree/97e4265abd4b559f47776378a1316765e332129e). The installed Claude files and all three Codex skills matched this revision. Upstream license: MIT. The plugin lives in your user configuration, not as vendored source inside DSA.

Node.js, Python 3, `lsof`, Claude Code, and Codex were found locally. You still need the normal signed-in session/access for whichever assistant you use; no separate coach API key is required. No model-backed mock was started during installation.

## Start locally with Claude Code

In Terminal:

```sh
cd /Users/rohitsharma/Downloads/DSA
mkdir -p coach/workspace
cd coach/workspace
claude
```

Then run one command **inside Claude Code**, not in your shell:

```text
/coding-explain sliding-window
```

For a first interactive exercise:

```text
/practice-coding two-sum
```

For a first behavioral session without a résumé:

```text
/story-add
```

The upstream guide uses short command names. If your Claude UI requires a qualified name, use its completion menu or `/swe-interview-coach:practice-coding two-sum`. Open a fresh Claude session after installation; an already-running session can try `/reload-plugins`.

Start in `coach/workspace`, rather than the repository root, so the plugin's per-company folders and transcripts are separate from the curated guides. [Local coaching preferences](CLAUDE.md) explain how to use those guides and preserve candidate-owned solutions.

## Useful coaching commands

| Goal | Claude Code command |
| --- | --- |
| Build stories from your actual experience | `/story-add` or `/story-add /absolute/path/to/resume.pdf` |
| Tailor stories to a role | `/story-map stripe <job-description-url>` |
| Rehearse a behavioral interview | `/mock-behavioral netflix` |
| Learn a coding pattern | `/coding-explain sliding-window` |
| Guided coding with your editor | `/practice-coding two-sum` |
| Coding mock | `/mock-coding coin-change` |
| Drill weak patterns | `/coding-drill dynamic-programming` |
| Import a public practice problem | `/coding-import two-sum` |
| Learn a system design | `/sysdesign-explain twitter-feed` |
| Guided design practice | `/practice-sysdesign url-shortener` |
| Design mock | `/mock-sysdesign uber-dispatch` |
| Open the diagram canvas | `/sysdesign-canvas` |
| Capture a real interview afterward | `/debrief stripe` or `/debrief-coding google two-sum` |

Replace placeholder company/JD/problem arguments with your target. Take-home coaching is listed as planned upstream; it is not an installed finished workflow. See the [upstream command reference](https://github.com/kirilxd/swe-interview-coach#readme) for the complete command set.

## Python runner versus this repository's TypeScript

The installed plugin's coding practice/mock commands create **`solution.py`**, and its bundled execution adapter supports **Python only**. Edit the generated candidate file yourself; the coach reads and tests it.

For TypeScript practice, use Codex's `coding-frameworks` skill with the existing company workbooks. Ask for a TypeScript exercise and a matching local test command; do not interpret the upstream Python runner as TypeScript validation. An automatically graded TypeScript adapter has **not** been added to the upstream plugin.

Existing workbook verification remains available from the DSA root:

```sh
node examples/check-agoda-google-examples.mjs
node examples/check-stripe-netflix-examples.mjs
```

Those scripts check the repository's reference solutions, not arbitrary new candidate submissions.

## Use the installed skills in Codex

The three skills should be available on your **next turn**. Invoke them explicitly, for example:

```text
$coding-frameworks Coach me through a Google L5 graph problem in TypeScript.
Ask one question at a time and let me write the solution.
Save any notes under coach/workspace/.
```

```text
$behavioral-frameworks Help me develop one truthful Stripe project story.
Ask for missing facts rather than inventing metrics.
Save the story under coach/workspace/.
```

```text
$system-design-frameworks Run a Netflix configuration-service design practice.
Use netflix/rounds/02-System-Design-and-Data-Modeling.md as context.
```

The files are installed at `~/.codex/skills/<skill-name>/SKILL.md`. If a running client has not refreshed discovery, start a new session. Explicit `$skill-name` invocation follows the [official skill documentation](https://developers.openai.com/codex/skills/); the three names above are the installed upstream framework names.

## Company material to bring into a session

| Target | Curated preparation |
| --- | --- |
| Airbnb | [Round-wise guide](../airbnb/rounds/README.md) |
| Agoda Staff | [Round-wise guide](../agoda/rounds/README.md) |
| Google L5 | [Round-wise guide](../google/rounds/README.md) |
| Stripe experienced SWE | [Round-wise guide](../stripe/rounds/README.md) |
| Netflix experienced SWE | [Round-wise guide](../netflix/rounds/README.md) |

The links above are relative to this README; from the practice working directory, the guides are under `../../<company>/rounds/`. Give the coach an explicit file path and target round. Practice questions in this repository are not guarantees of company interview content.

## Where your work goes

- `coach/workspace/`: personal stories, résumé copies if you choose, solutions, company mappings, and session notes. This directory is excluded by the root `.gitignore`.
- `~/.config/swe-interview-coach/canvas.json`: upstream's shared diagram scene. The default viewer is `http://localhost:9999` and is started only when requested by a design command.
- `~/.claude/plugins/`: Claude plugin installation/cache and registration.
- `~/.codex/skills/`: the three separately installed framework skills.

“Local” refers to files, the runner, and the canvas server. Coaching still uses your assistant's model service; it is not an offline local model. The canvas initially fetches its UI dependency from a CDN, and research/import commands can use the web. The Python harness executes candidate code with normal local permissions, so use your own or reviewed solutions. Git ignore prevents ordinary accidental commits, not cloud processing by the assistant or deliberate forced commits.

## Verify, update, or reinstall

Terminal commands for the full Claude plugin:

```sh
claude plugin list
claude plugin details swe-interview-coach@kirilxd-plugins
```

On another machine with Claude Code installed:

```sh
claude plugin marketplace add kirilxd/swe-interview-coach
claude plugin install swe-interview-coach@kirilxd-plugins --scope user
```

For a deliberate update:

```sh
claude plugin marketplace update kirilxd-plugins
claude plugin update swe-interview-coach@kirilxd-plugins
```

Reopen Claude after updating. Claude plugin updates do not update the separate Codex copies. In Codex, ask the skill installer to install the three paths `skills/behavioral-frameworks`, `skills/coding-frameworks`, and `skills/system-design-frameworks` from the upstream repository. Existing directories require an intentional update rather than blindly reinstalling over them.

Installation checks passed: 23 runner checks, 15 library checks, 45 structure checks, and 10 canvas-server checks. The library suite covers all 14 bundled problems. The canvas test used temporary state on port 19998 and stopped its server; no persistent canvas was left running. Browser rendering and a live model conversation were not exercised. Manifest validation passed with an upstream warning about a missing marketplace description.

## What to provide next

Nothing else is required to start. For tailored coaching, supply whichever you already have:

- A résumé path or one real project to discuss.
- Target company, exact role/level, and job description.
- Next interview round and date.
- Whether you want Python auto-graded practice or TypeScript coaching.

You can begin with `/story-add` or a coding practice command before any of these are ready.
