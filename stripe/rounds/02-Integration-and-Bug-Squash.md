# Stripe: API integration and bug squash

[Round-wise index](README.md) · [Coding workbook](01-DSA-and-Multipart-Coding.md) · [Sources](Research-Sources.md)

S1/S2 report practical integration and debugging. Everything below is an **original fixture**, independent of any employer's private assessment. Rehearse in the IDE/runtime you expect to use.

## Q4. Paginated payment-state aggregation

**Contract:** `fetchPage(cursor)` is injected and returns `{items,nextCursor}`. The initial cursor is `null`; a returned `null` ends traversal. Each record has `id`, nonnegative safe-integer `version`, uppercase three-letter `currency`, nonnegative integer string `amountMinor`, and `paid | void` status. Repeated IDs replace older versions. Equal versions must have identical payloads; conflicting copies are an error. Aggregate only the newest paid records by currency using `bigint`. Throw on invalid records, cursor loops, or page failures; never return partial totals. Page envelopes follow the declared type.

The injected function can be a test fixture or an HTTP adapter. This exercise makes no real payment calls and needs no API credentials.

```ts
type PaymentRecord = {
  id: string; version: number; currency: string; amountMinor: string; status: 'paid' | 'void';
};
type PaymentPage = { items: PaymentRecord[]; nextCursor: string | null };
async function aggregatePaymentPages(
  fetchPage: (cursor: string | null) => Promise<PaymentPage>
): Promise<Map<string, bigint>> {
  const seen = new Set<string | null>();
  const latest = new Map<string, PaymentRecord>();
  const versions = new Map<string, Map<number, string>>();
  let cursor: string | null = null;
  do {
    if (seen.has(cursor)) throw new Error('Cursor cycle');
    seen.add(cursor);
    const page = await fetchPage(cursor);
    for (const item of page.items) {
      if (!item.id || !Number.isSafeInteger(item.version) || item.version < 0
        || !/^[A-Z]{3}$/.test(item.currency) || !/^(0|[1-9][0-9]*)$/.test(item.amountMinor)
        || (item.status !== 'paid' && item.status !== 'void')) throw new Error('Invalid record');
      const signature = JSON.stringify([item.currency, item.amountMinor, item.status]);
      const history = versions.get(item.id) ?? new Map<number, string>();
      if (history.has(item.version) && history.get(item.version) !== signature) throw new Error('Conflicting record version');
      history.set(item.version, signature);
      versions.set(item.id, history);
      const prior = latest.get(item.id);
      if (!prior || item.version > prior.version) latest.set(item.id, { ...item });
    }
    cursor = page.nextCursor;
  } while (cursor !== null);
  const totals = new Map<string, bigint>();
  for (const item of latest.values()) if (item.status === 'paid') {
    totals.set(item.currency, (totals.get(item.currency) ?? 0n) + BigInt(item.amountMinor));
  }
  return totals;
}
```

**Fixture:** Page 1: `a/v1/USD/100/paid`, `b/v1/EUR/70/paid`. Page 2: `a/v2/USD/100/void`, duplicate `b/v1/EUR/70/paid`, `c/v1/USD/40/paid`. Result: EUR `70n`, USD `40n`.

**Correctness:** The map retains the maximum observed version for every ID; equal-version conflicts cannot silently choose a winner. Summing after the final page prevents old paid records from surviving newer void records. Currency groups never mix.

**Complexity:** `O(r+p)` record/page operations and `O(v+p)` retained entries for distinct `(ID,version)` pairs and cursors, excluding payload length and bigint arithmetic costs. Retaining version fingerprints detects conflicting old versions even after a newer version arrives. Cursor dependency requires sequential page discovery. Total network latency is separate.

**Follow-ups:** Parse HTTP JSON as `unknown` and validate its envelope before calling typed domain code; check `response.ok`, deadlines, and cancellation. Retry transient failures under a bounded budget only when the operation permits it. Ask whether pagination provides a stable snapshot: version deduplication alone cannot discover records omitted by concurrent page changes.

## Debugging drill A: wrong result at a boundary

An expiration helper uses `entry.expiresAt < now` to mark an item expired. The contract says an item is live precisely when `now < expiresAt`.

**Reproduce:** Insert at time 10 with TTL 5, then read at 15. The item is incorrectly returned. Also test 14 and 16 to isolate the boundary.

**Fix and explanation:** Use `entry.expiresAt <= now` for expiration. Add a regression for the exact boundary, zero TTL, and refreshing an entry before its old deadline. A `setTimeout` patch does not repair a wrong predicate and makes deterministic testing harder. See the Netflix timed-cache solution for a complete implementation.

## Debugging drill B: duplicate side effect under concurrency

**Deliberately broken pseudocode:**

```text
if not processed.has(requestId):
    await applyEffect(request)
    processed.add(requestId)
```

**Reproduce:** Hold the first request inside `applyEffect`; start a second identical request; both pass the membership check before either records completion.

**Reasoned fix:** In one process, record a shared in-flight promise synchronously before awaiting. Decide whether failed attempts can retry and whether the failure can have an unknown external effect. Across workers, claim a persistent unique request key and coordinate the business write transactionally; use an outbox or downstream idempotency where effects cross service boundaries. Changing the position of one `Set.add` does not solve crash recovery.

**Regression cases:** Same key concurrently, same key/different payload, two tenants, handler rejection before effects, and ambiguous failure after a remote side effect. Scope the fix to the actual contract instead of claiming universal exactly-once behavior.

## A repeatable 45-minute bug-squash rehearsal

1. Run the failing test and capture expected versus actual behavior; minimize its input.
2. Trace from test to public entry point and the first incorrect state. Use `rg` for symbols and a breakpoint for runtime values.
3. State one hypothesis and the observation that would falsify it.
4. Make the smallest cause-level fix; run the reproduction and nearby regression tests.
5. Explain why the change works, what it might affect, and one remaining uncertainty.

Budget about 8 minutes to reproduce, 15 to investigate, 12 to repair, and 10 to verify/explain. Practice on an unfamiliar small module too; recognizing these two fixtures alone is not sufficient debugging preparation.

## Optional AI-assisted variant

Only if the invitation includes such a round: review a generated implementation against the stated contract, add a failing edge case, and correct it. S2 is evidence of one reported format, not a company-wide tool policy. The core skill is independent validation of code and assumptions.
