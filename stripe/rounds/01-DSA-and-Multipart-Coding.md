# Stripe: DSA and multipart practical coding

[Round-wise index](README.md) · [Sources](Research-Sources.md) · [Integration and debugging](02-Integration-and-Bug-Squash.md)

**Updated October 12, 2026. Language: TypeScript.** The worked contracts are original. S1/S2 support practice around parsing, maps, duplicate handling, and extension of working code; they do not establish exact questions or frequencies.

## Prioritized question bank

P0 = first; P1 = breadth; P2 = stretch. These **24 LeetCode analogues** train useful patterns. Spend at least as much practical time on the local exercises and debugging as on this bank if your confirmed loop includes integration/bug squash.

| # | Priority / pattern | Practice | Explain or extend |
| --- | --- | --- | --- |
| 1 | P0 parsing | [165 Compare Version Numbers](https://leetcode.com/problems/compare-version-numbers/) | Token boundaries, leading zeros, integer size |
| 2 | P0 parsing | [8 String to Integer](https://leetcode.com/problems/string-to-integer-atoi/) | Explicit grammar and overflow policy |
| 3 | P0 strings | [20 Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) | Stack invariant and malformed input |
| 4 | P0 parsing | [394 Decode String](https://leetcode.com/problems/decode-string/) | Nested state, output-size cost |
| 5 | P0 strings | [71 Simplify Path](https://leetcode.com/problems/simplify-path/) | Empty tokens and normalization contract |
| 6 | P0 sorting | [937 Reorder Data in Log Files](https://leetcode.com/problems/reorder-data-in-log-files/) | Stable tie rules and classification |
| 7 | P0 maps | [49 Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Canonical keys and alphabet assumptions |
| 8 | P0 maps | [1 Two Sum](https://leetcode.com/problems/two-sum/) | Repeated values and insertion order |
| 9 | P0 counting | [811 Subdomain Visit Count](https://leetcode.com/problems/subdomain-visit-count/) | Parse, validate, aggregate |
| 10 | P0 simulation | [1604 Alert Using Same Key-Card Three or More Times in a One Hour Period](https://leetcode.com/problems/alert-using-same-key-card-three-or-more-times-in-a-one-hour-period/) | Time parsing, sorting, window boundaries |
| 11 | P0 intervals | [56 Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Endpoint semantics and input mutation |
| 12 | P0 intervals | [57 Insert Interval](https://leetcode.com/problems/insert-interval/) | Exploit existing order |
| 13 | P1 stateful API | [1396 Design Underground System](https://leetcode.com/problems/design-underground-system/) | Record lifecycle and aggregate queries |
| 14 | P1 stateful API | [981 Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) | Per-key sorted history and predecessor lookup |
| 15 | P1 cache | [146 LRU Cache](https://leetcode.com/problems/lru-cache/) | Access order vs. insertion order |
| 16 | P1 queue | [933 Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/) | Inclusive boundary and ordered timestamps |
| 17 | P1 heap | [347 Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Ties and batch vs. online |
| 18 | P1 heap | [23 Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | Ordered event-stream merge |
| 19 | P1 graph | [207 Course Schedule](https://leetcode.com/problems/course-schedule/) | Dependencies and cycle detection |
| 20 | P1 graph | [399 Evaluate Division](https://leetcode.com/problems/evaluate-division/) | Weighted paths; analogy only, not a currency-pricing model |
| 21 | P1 prefix sums | [560 Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Duplicate prefixes and negatives |
| 22 | P1 window | [3 Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Keep the left boundary monotone |
| 23 | P2 DP | [322 Coin Change](https://leetcode.com/problems/coin-change/) | Recurrence, impossible totals, repeated choices |
| 24 | P2 backtracking | [39 Combination Sum](https://leetcode.com/problems/combination-sum/) | Deduplication and output-sensitive complexity |

## Q1. Parse a CSV record

**Evidence:** Parsing/data processing is a theme in S2 and a suggestion in S4. This CSV contract is our own drill. Parse exactly one record into fields. Allow commas inside quoted fields and doubled quotes as escapes. Quotes may begin only at the start of a field; after a closing quote only a comma or end is valid. Preserve spaces. Reject CR/LF, unclosed quotes, and stray quotes. Empty input means one empty field. This deliberately excludes multiline CSV and is not a full CSV file parser.

**Examples:** `a,"b,c","d""e",` becomes `['a','b,c','d"e','']`; empty input becomes `['']`.

**Approach:** A state machine distinguishes unquoted content, quoted content, and a closed quote. Splitting on commas fails as soon as a quoted comma appears.

```ts
function parseCsvRecord(record: string): string[] {
  if (/[\r\n]/.test(record)) throw new Error('Only one record is supported');
  const fields: string[] = [];
  let field: string[] = [], quoted = false, closed = false;
  for (let i = 0; i < record.length; i++) {
    const ch = record[i];
    if (quoted) {
      if (ch !== '"') field.push(ch);
      else if (record[i + 1] === '"') { field.push('"'); i++; }
      else { quoted = false; closed = true; }
    } else if (ch === ',') {
      fields.push(field.join('')); field = []; closed = false;
    } else if (closed) {
      throw new Error('Unexpected content after quote');
    } else if (ch === '"') {
      if (field.length) throw new Error('Quote inside unquoted field');
      quoted = true;
    } else field.push(ch);
  }
  if (quoted) throw new Error('Unclosed quote');
  fields.push(field.join(''));
  return fields;
}
```

**Correctness:** A comma ends a field exactly when outside a quoted section. Inside quotes, paired quotes contribute one literal quote and an unpaired quote closes the section. The closed state rejects ambiguous trailing text.

**Complexity:** `O(n)` time and `O(n)` space, including output and field buffers. Characters are buffered and joined once per field.

**Follow-ups:** Parse multiple records with quoted newlines by carrying state across line boundaries; stream chunks while retaining incomplete quote state; validate column count after parsing. Do not simply split a general CSV file on newlines.

## Q2. Subscription email schedule

**Evidence:** S1 describes this theme. **Original contract:** each subscription has a unique ID and integer start/end with `start <= end`. Emit a welcome at start, an expiry at end, and reminders `d` units before end for each unique positive integer offset `d`, provided reminder time is at or after start. No changes/cancellations in this base version. All times/differences fit safe integers. Sort by time, then ID using JavaScript lexical order, then kind `welcome < reminder < expiry`.

**Example:** `{id:'a',start:10,end:20}` with offsets `[5,20,5]` gives welcome at 10, reminder at 15, expiry at 20.

```ts
type Subscription = { id: string; start: number; end: number };
type ScheduledEmail = { id: string; at: number; kind: 'welcome' | 'reminder' | 'expiry' };
function subscriptionSchedule(items: Subscription[], offsets: number[]): ScheduledEmail[] {
  const result: ScheduledEmail[] = [];
  const uniqueOffsets = [...new Set(offsets)];
  const priority = { welcome: 0, reminder: 1, expiry: 2 };
  for (const item of items) {
    result.push({ id: item.id, at: item.start, kind: 'welcome' });
    for (const offset of uniqueOffsets) {
      const at = item.end - offset;
      if (at >= item.start) result.push({ id: item.id, at, kind: 'reminder' });
    }
    result.push({ id: item.id, at: item.end, kind: 'expiry' });
  }
  return result.sort((a, b) => a.at - b.at
    || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    || priority[a.kind] - priority[b.kind]);
}
```

**Correctness:** Enumeration emits precisely the valid events from the contract, and the comparator defines every required tie. **Complexity:** With `n` subscriptions, `d` supplied offsets, `u` unique offsets, and `e` emitted events: `O(d + nu + e log e)` time, `O(u+e)` space, treating IDs as bounded length.

**Tests:** No subscriptions, no reminders, duplicates in offsets, reminder at start, simultaneous users, zero-length subscription. Contract validation belongs at the boundary; invalid IDs/durations/offsets are excluded here.

**Follow-ups:** Cancellation or extension requires invalidating old events, for example via subscription versions. Use an injected clock and a send ledger for execution; producing a sorted array does not provide durable scheduling or retry-safe email delivery. Clarify whether already-sent reminders can be rescheduled.

## Q3. Replay-safe in-memory request processing

**Evidence:** S1 mentions duplicate requests and JSON comparison. **Our contract:** requests carry `(tenant,id,payload)`. JSON payloads contain only null, booleans, strings, finite numbers, arrays, and ordinary string-keyed objects; no cycles, undefined, custom prototypes, or unsafe integer input. Ignore object-key order, preserve array order, and treat numeric `-0` like `0`. Reusing an ID within the same tenant with a different payload is an error. A synchronous handler returns an immutable string response. Cache successful results only; handler failure is assumed to have no side effect.

```ts
type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
function canonicalJson(value: JsonValue): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)!;
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
  return '{' + Object.keys(value).sort()
    .map(key => JSON.stringify(key) + ':' + canonicalJson(value[key])).join(',') + '}';
}
class RequestReplay {
  private tenants = new Map<string, Map<string, { signature: string; response: string }>>();
  run(tenant: string, id: string, payload: JsonValue, handler: () => string): string {
    const signature = canonicalJson(payload);
    const prior = this.tenants.get(tenant)?.get(id);
    if (prior) {
      if (prior.signature !== signature) throw new Error('Idempotency conflict');
      return prior.response;
    }
    const response = handler();
    let entries = this.tenants.get(tenant);
    if (!entries) { entries = new Map(); this.tenants.set(tenant, entries); }
    entries.set(id, { signature, response });
    return response;
  }
}
```

**Example:** Tenant A's `r1` with `{x:1,y:2}` then `{y:2,x:1}` invokes the handler once. `{x:2,y:2}` conflicts. Tenant B may independently use `r1`.

**Correctness:** Sorting object keys gives equal allowed JSON structures equal signatures while preserving array order. Nested maps keep tenant/request boundaries unambiguous. Successful cached requests bypass the handler.

**Complexity:** Canonicalization sorts keys per object and processes the serialized payload; key comparisons and nested intermediate string construction add costs. It is not constant time in payload size. Storage grows with all retained signatures/responses; this baseline has no expiry policy. Restrict depth or use iterative processing for untrusted/deep data.

**Limits/follow-ups:** This is single-process, synchronous, non-reentrant practice code. Async calls need an in-flight state, concurrent workers need atomic persistent coordination, and crashes require transactional effects or reconciliation. A process-local map does not make payments exactly once. Our failure-caching rule intentionally differs from the [real Stripe API](https://docs.stripe.com/api/idempotent_requests), which can retain an executed request's failure response too.

## Multipart rehearsal

Use 45 minutes: 5 to clarify; 15 for a minimal working first part and tests; 15 for one changed requirement; 10 for regressions and complexity. Prefer small helpers with stable interfaces. Avoid speculative frameworks; extend only after the next contract is understood.
