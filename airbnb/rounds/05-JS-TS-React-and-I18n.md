# JS/TS, React, and Internationalization Infrastructure preparation

[Round-wise index](README.md) · [Design questions](02-System-Design-Questions-and-Followups.md)

## Role alignment

The job description you supplied on October 7, 2026 is for **Internationalization Infrastructure within Application Platform**. It describes three pillars: translation workflows, quality/reliability guardrails, and foundational libraries. It expects 5+ years of relevant experience, backend/distributed-systems strength, and enough JS/TS/React proficiency to own useful internal workflows end to end. It also values safe migrations, vendor/stakeholder collaboration, and verified AI-assisted work.

Your preferred implementation stack is **JavaScript/TypeScript and React**. All algorithm examples in this round-wise material use TypeScript. Confirm accepted languages for each interview; the supplied description also names Java, Kotlin, C++, or a comparable backend language. Prepare backend reasoning in addition to frontend fluency.

The questions below are **inferred from the job**, not advertised as recently asked interview questions. A related [official i18n role listing](https://careers.airbnb.com/fr/positions/8185864/) also describes globalization infrastructure, but your pasted description is the source of truth for this application; do not assume the older listing is the same opening.

## J1. Resolve a translated message through an explicit fallback graph

**Statement:** Given catalogs keyed by locale, an ordered fallback graph, a requested locale and message key, return the first present translation using depth-first fallback order, or `null`. Empty-string translations are valid. Repeated/cyclic fallbacks must terminate. Locale names are already canonicalized; this function does not guess locale parents or format messages.

**Example:** `fr-CA → [fr,en]`, `fr → [en]`. If `fr` owns `welcome`, choose it before English. If `fr-CA` owns `welcome: ''`, return the empty translation instead of falling back.

```ts
function resolveTranslation(
  catalogs: Record<string, Record<string, string>>,
  fallback: Record<string, string[]>,
  requested: string,
  key: string
): { locale: string; text: string } | null {
  const visited = new Set<string>();
  const stack = [requested];
  while (stack.length) {
    const locale = stack.pop()!;
    if (visited.has(locale)) continue;
    visited.add(locale);
    const catalog = Object.prototype.hasOwnProperty.call(catalogs, locale)
      ? catalogs[locale] : undefined;
    if (catalog && Object.prototype.hasOwnProperty.call(catalog, key)) {
      return { locale, text: catalog[key] };
    }
    const next = Object.prototype.hasOwnProperty.call(fallback, locale)
      ? fallback[locale] : [];
    for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]);
  }
  return null;
}
```

**Why correct:** The reversed push order visits fallbacks in declared depth-first priority; visited nodes prevent cycles. Own-property checks avoid treating inherited fields as catalog entries. **Complexity:** `O(V+E)` time and space in the reachable fallback graph, excluding text storage.

**Follow-ups:** Breadth-first priority is a different contract; confirm which one is desired. Cache by catalog release, locale and key so old translations do not survive a release switch accidentally. Log fallback usage by locale. `Intl` locale matching formats values; it does not search your application catalogs. [Intl documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

## J2. Truncate by user-perceived characters

**Statement:** Return the first `limit` grapheme clusters of a string. Limit is a nonnegative integer. Do not split a combined accent or a joined emoji sequence. The locale is an explicit input.

```ts
function truncateGraphemes(text: string, limit: number, locale: string): string {
  const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
  const result: string[] = [];
  for (const part of segmenter.segment(text)) {
    if (result.length === limit) break;
    result.push(part.segment);
  }
  return result.join('');
}
```

**Examples:** `('e\u0301x',1,'en') → 'e\u0301'`; `('👩‍💻!',1,'en') → '👩‍💻'`; any text with limit zero → `''`.

**Reasoning:** UTF-16 length and even code-point iteration can split a grapheme. The segmentation API provides the requested unit. Check support in the assessment/runtime; use a supported segmentation library when required by your deployment. [Intl.Segmenter reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

**Complexity:** Budget linear work in the input length and linear output storage as a conservative practical model; the API does not specify a portable Big-O guarantee. **Follow-up:** Grapheme count is not visual width. Normalization, collation, line breaking, and truncation are separate requirements; truncating translated text can also change meaning.

## J3. Bound concurrent vendor work while preserving result order

**Statement:** Apply an async function to every input using at most `limit` concurrent calls. Return results in input order, even when work finishes out of order. A task rejection rejects the returned promise. `limit` must be a positive integer. Already-running work is not canceled, and other workers may continue; this simple helper is not fail-fast scheduling or a durable workflow engine.

```ts
async function mapWithConcurrency<T, R>(
  values: T[], limit: number, work: (value: T, index: number) => Promise<R>
): Promise<R[]> {
  if (!Number.isInteger(limit) || limit <= 0) throw new Error('Invalid concurrency');
  const output = new Array<R>(values.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < values.length) {
      const index = next++;
      output[index] = await work(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, () => worker()));
  return output;
}
```

**Reasoning:** Each worker claims an index synchronously before awaiting; JavaScript's single-thread execution makes those claims distinct. There are at most `limit` workers. Assigning results by original index preserves ordering. **Complexity:** `O(n)` scheduling/output work; at most `min(n,limit)` active promises. Latency depends on task durations and provider behavior.

**Follow-ups:** Concurrency limits do not impose requests per second. Add separate rate limiting, retry budgets and idempotency. For cancellation, pass an `AbortSignal` and define what happens to scheduled, in-flight, and completed work. CPU-heavy processing can still block Node's event loop. Durable jobs need external state and recovery, not only an in-process queue.

## J4. React job-status panel with stale-response protection

**Statement:** Build a read-only translation-job panel. Switching `jobId` quickly must never display the previous job's result as the current job. Handle loading, error and empty translation states, label the output language, and format the update time using an explicit locale/timezone.

**API contract for this exercise:** `GET /api/translation-jobs/{id}` returns `{id, targetLocale, updatedAt, text}`. `text` is a string or null; `updatedAt` is a valid ISO instant. The server handles authorization. This is a component example for a React application, not a runnable website added to this documentation repository.

```tsx
import { useEffect, useState } from 'react';

type Job = { id: string; targetLocale: string; updatedAt: string; text: string | null };
type JobState = {
  key: string;
  status: 'loading' | 'ready' | 'error';
  job?: Job;
};

function isJob(value: unknown): value is Job {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.targetLocale === 'string'
    && typeof v.updatedAt === 'string' && Number.isFinite(Date.parse(v.updatedAt))
    && (typeof v.text === 'string' || v.text === null);
}

export function TranslationJobPanel({
  jobId, locale, timeZone
}: { jobId: string; locale: string; timeZone: string }) {
  const [state, setState] = useState<JobState>({ key: jobId, status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ key: jobId, status: 'loading' });
    async function load() {
      try {
        const response = await fetch(`/api/translation-jobs/${encodeURIComponent(jobId)}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Request failed');
        const value: unknown = await response.json();
        if (!isJob(value) || value.id !== jobId) throw new Error('Invalid response');
        if (active) setState({ key: jobId, status: 'ready', job: value });
      } catch {
        if (active) setState({ key: jobId, status: 'error' });
      }
    }
    void load();
    return () => { active = false; controller.abort(); };
  }, [jobId]);

  // Guard even the render before the new effect has run.
  if (state.key !== jobId || state.status === 'loading') {
    return <p role="status">Loading translation…</p>;
  }
  if (state.status === 'error' || !state.job) {
    return <p role="alert">Unable to load this translation.</p>;
  }
  const job = state.job;
  const updated = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium', timeStyle: 'short', timeZone
  }).format(new Date(job.updatedAt));
  return (
    <section aria-label="Translation job">
      <h2>Translation {job.id}</h2>
      <time dateTime={job.updatedAt}>{updated}</time>
      {job.text === null ? <p>No translation yet.</p>
        : <p lang={job.targetLocale} dir="auto">{job.text}</p>}
    </section>
  );
}
```

The cancellation/ignore pattern follows [React's effect guidance](https://react.dev/learn/synchronizing-with-effects). The component's UI labels are English for the exercise; a production version would source them from the app's catalog. Props are assumed to contain valid locale/timezone identifiers. A framework loader or supported query library may be preferable in an existing app. In a React Server Components application, place this interactive component behind the appropriate client boundary.

**Why it works:** Cleanup prevents a retired request from applying its result; the state key also prevents a transient stale render when props change. Parsing validates unknown response data rather than trusting a TypeScript cast. Rendering text as content avoids inserting raw translation HTML.

**Verification cases for a React test environment:** Resolve A after B and verify B remains visible; unmount before resolution; return HTTP 500; return invalid JSON shape; return null text; return an empty but valid translation; verify explicit timezone formatting and accessible status/error output. This repository has no React app/test runtime, so this TSX example is reviewed teaching code; the Node verification script executes the three pure/async helpers, not this UI.

### Follow-ups with answers

| Question | Answer |
| --- | --- |
| Add approval/editing? | Submit an expected revision/ETag; backend validates permission and version. On conflict preserve the draft and show a merge/reload choice. |
| Optimistic approval? | Only if the action is safely reversible and UX handles rejection. Never let a client-only optimistic flag authorize publication. |
| Thousands of rows? | Server pagination/filtering, stable row IDs, bounded rendering/virtualization if measured, and keyboard/focus behavior tested. |
| Why not `dangerouslySetInnerHTML`? | Translation content is not automatically trusted markup. Prefer structured rich-text tokens; sanitize with an approved policy if HTML is required. |
| Strict Mode issues? | Effects should tolerate setup/cleanup/retry. Do not submit approval mutations in mount effects; use deliberate user actions and server idempotency. |
| Why explicit locale/timezone? | Browser/server defaults differ and can produce inconsistent or misleading timestamps. A date-only stay is not the same as an instant. |
| Why not append “s” for plural? | Languages have different plural categories and sentence structures. Use full translated messages and supported plural/message formatting. |

## Role-specific review prompts

1. A worker retries every error forever. Identify permanent vs. transient failures, timeout ambiguity, retry budget, rate limits and dead-letter/reconciliation behavior.
2. A cache uses only `messageKey` as its key. Explain missing locale, application and release dimensions; test cross-locale leakage and stale results.
3. A React screen uses array indices as keys and loses unsaved edits after sorting. Use stable entity IDs and explicit draft ownership; preserve conflicts across refresh.
4. A translation callback publishes `latestText` without checking source revision. Explain stale-result protection and immutable release manifests.
5. An LLM marks its own translation “high confidence.” Explain external evaluation, human review by content risk, and placeholder/format checks.

**Preparation outcome:** Be able to implement J1–J3, explain J4's lifecycle and race conditions, and discuss the translation platform in the design workbook. This complements the reported DSA questions rather than replacing them with framework trivia.
