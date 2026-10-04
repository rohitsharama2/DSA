# CodeSignal: 90-Minute Progressive Coding Workbook

[Airbnb roadmap](README.md) · [Platform setup](CodeSignal-Assessment-Guide-and-Examples.md) · [Candidate questions and answers](Candidate-Questions-and-Solutions.md)

**Your current priority:** Prepare for the 90-minute assessment. Use this workbook first. Duration alone does not prove the invitation is an ICA: custom assessments can also last 90 minutes. Until its exact label is available, this is our working preparation track.

CodeSignal's official ICA has one project with four progressive levels and a maximum of 90 minutes. Each level extends earlier behavior, so backward compatibility matters. This workbook uses that structure with an **original booking-store problem**, not an actual Airbnb assessment. [Official ICA guidance](https://support.codesignal.com/hc/en-us/articles/19116922232983-What-are-the-Industry-Coding-Assessment-ICA-rules)

## 1. How to practice

Read only the requirements first. Start a 90-minute timer and implement levels in order. Compare against the complete reference solution afterward. On a second attempt, change the domain or requirements so you are practicing implementation rather than recall.

| Time | Target |
| --- | --- |
| 0–5 minutes | Read contracts, sketch data model, inspect supplied interfaces |
| 5–20 | Level 1: reservation correctness |
| 20–35 | Level 2: cancellation and deterministic queries |
| 35–60 | Level 3: holds and expiration |
| 60–80 | Level 4: atomic rescheduling |
| 80–90 | Regression tests, boundary fixes, submission verification |

These are rehearsal budgets. When a level takes longer, prioritize working behavior and tests over speculative abstractions. Completing all four levels here is a learning target, not an official passing criterion.

## 2. Shared problem statement and contracts

Build a single-process, in-memory reservation store. Each record has a unique active `id`, a `listing`, and a half-open stay interval `[start,end)`. Reservations for different listings may overlap. Reservations for the same listing may touch at endpoints but may not overlap.

- IDs and listing names are nonempty strings; IDs are globally unique among active records.
- Start/end days are nonnegative safe integers with `start < end`.
- Every public method receives `now`, a nonnegative safe-integer timestamp. Calls arrive in nondecreasing timestamp order; repeated timestamps are allowed. Invalid or decreasing time throws an error.
- Days describe the stay; timestamps describe when commands run. They are different units.
- Holds expire at `expiresAt`; they are active only while `now < expiresAt`.
- Public methods first advance time and remove expired holds, even if the requested operation then fails.
- Canceled/expired IDs can be reused. Confirmed records do not expire automatically when their stay ends in this exercise.
- Invalid creation/rescheduling arguments return `false`. Missing records return `false` for mutation operations.
- Return copies from query methods so callers cannot mutate stored state.
- Calls are sequential. This is not a distributed transaction or payment implementation.

## 3. Level 1 — Create confirmed reservations

Implement `reserve(id, listing, start, end, now): boolean`.

Return `true` only if the record is valid, its ID is unused, and its dates do not conflict with any active record for that listing. On failure, do not create or partially change a reservation.

**Example:** `reserve('a','home',2,5,0) → true`; `reserve('b','home',5,7,0) → true`; `reserve('c','home',4,6,0) → false`.

**Reasoning:** A map makes ID lookup simple. Scan active records to detect overlap using `start < record.end && record.start < end`. Equal endpoints do not conflict.

## 4. Level 2 — Cancel and query

Implement `cancel(id, now): boolean` and `list(listing, now): BookingRecord[]`.

Cancellation removes either kind of active record once holds are introduced. Listing returns active records ordered by start day, then ID using ordinary string comparison. Include `status` and `expiresAt` in results from the beginning; confirmed reservations have `expiresAt: null`.

**Example:** Cancel `a` → `true`; cancel `a` again → `false`; list `home` → only `b` remains. Mutating the returned array or a record must not change the store.

## 5. Level 3 — Holds and confirmation

Implement `hold(id, listing, start, end, now, ttl): boolean` and `confirm(id, now): boolean`.

A hold blocks the same inventory as a confirmed booking. Its TTL must be a positive safe integer, and `now + ttl` must remain safe. Confirmation succeeds only for an active hold and changes it to confirmed, clearing expiry. Confirming an already-confirmed record returns `false` in this contract.

**Example:** Hold `[2,5)` at time 100 with TTL 10 → `true`. A competing reservation at 109 → `false`. Confirmation at 110 → `false`, since expiry occurs at the boundary. The same dates are now bookable.

**Reasoning:** Use explicit time and lazy expiration before each public operation. There is no need for real timers. Centralize cleanup so a forgotten expiry check does not make one API disagree with another.

## 6. Level 4 — Atomic rescheduling

Implement `reschedule(id, newStart, newEnd, now): boolean` for confirmed reservations only. Keep the listing and ID unchanged.

Ignore the reservation itself when checking conflicts. Validate everything before changing dates. A failed reschedule must leave its old interval intact, although normal expiry cleanup can still remove other records.

**Example:** With `a=[2,5)` and `b=[5,7)` on one listing, moving `a` to `[4,6)` fails and `a` stays `[2,5)`. Moving it to `[0,2)` succeeds.

## 7. Complete TypeScript solution — all four levels

```ts
interface BookingRecord {
  id: string;
  listing: string;
  start: number;
  end: number;
  status: 'held' | 'confirmed';
  expiresAt: number | null;
}

class ProgressiveBookingStore {
  private records = new Map<string, BookingRecord>();
  private lastTime = -1;

  private advance(now: number): void {
    if (!Number.isSafeInteger(now) || now < 0 || now < this.lastTime) {
      throw new Error('Time must be a nondecreasing nonnegative safe integer');
    }
    this.lastTime = now;
    for (const [id, record] of this.records) {
      if (record.status === 'held' && record.expiresAt! <= now) {
        this.records.delete(id);
      }
    }
  }

  private validDates(start: number, end: number): boolean {
    return Number.isSafeInteger(start) && Number.isSafeInteger(end)
      && start >= 0 && start < end;
  }

  private conflicts(
    listing: string, start: number, end: number, ignoreId?: string
  ): boolean {
    for (const record of this.records.values()) {
      if (record.id !== ignoreId && record.listing === listing
        && start < record.end && record.start < end) return true;
    }
    return false;
  }

  private insert(
    id: string, listing: string, start: number, end: number,
    status: 'held' | 'confirmed', expiresAt: number | null
  ): boolean {
    if (!id || !listing || !this.validDates(start, end)
      || this.records.has(id) || this.conflicts(listing, start, end)) return false;
    this.records.set(id, { id, listing, start, end, status, expiresAt });
    return true;
  }

  reserve(id: string, listing: string, start: number, end: number, now: number): boolean {
    this.advance(now);
    return this.insert(id, listing, start, end, 'confirmed', null);
  }

  cancel(id: string, now: number): boolean {
    this.advance(now);
    return this.records.delete(id);
  }

  list(listing: string, now: number): BookingRecord[] {
    this.advance(now);
    return [...this.records.values()]
      .filter(record => record.listing === listing)
      .sort((a, b) => a.start - b.start
        || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map(record => ({ ...record }));
  }

  hold(
    id: string, listing: string, start: number, end: number,
    now: number, ttl: number
  ): boolean {
    this.advance(now);
    if (!Number.isSafeInteger(ttl) || ttl <= 0
      || !Number.isSafeInteger(now + ttl)) return false;
    return this.insert(id, listing, start, end, 'held', now + ttl);
  }

  confirm(id: string, now: number): boolean {
    this.advance(now);
    const record = this.records.get(id);
    if (!record || record.status !== 'held') return false;
    record.status = 'confirmed';
    record.expiresAt = null;
    return true;
  }

  reschedule(id: string, start: number, end: number, now: number): boolean {
    this.advance(now);
    const record = this.records.get(id);
    if (!record || record.status !== 'confirmed' || !this.validDates(start, end)
      || this.conflicts(record.listing, start, end, id)) return false;
    record.start = start;
    record.end = end;
    return true;
  }
}
```

**Correctness:** After cleanup, all stored holds are active. Insertion rejects any conflicting interval before mutation. Confirmation changes no dates and keeps the already-exclusive inventory. Cancellation only frees inventory. Rescheduling checks against every other active record before mutating. Therefore every public operation preserves the no-overlap invariant for each listing.

**Complexity:** For `n` stored records and `k` query matches, cleanup scans `O(n)`, so even cancellation and confirmation are `O(n)` in this implementation. Reserve, hold, and reschedule are `O(n)`. List is `O(n + k log k)` time and `O(n)` temporary space. Persistent storage is `O(n)`.

**Optimization answer:** With much larger data, index reservations by listing and manage expirations with a min-heap. Reused IDs require an expiry/version token so an old heap entry cannot delete a newer record. Add these structures only when constraints justify their maintenance cost.

## 8. Regression cases with expected answers

Run each group on a fresh store. Within a group, timestamps never decrease.

| Group | Operations | Expected |
| --- | --- | --- |
| Adjacent vs. overlapping | Reserve `a/home/[2,5)`, `b/home/[5,7)`, `c/home/[4,6)` at 0 | `true, true, false` |
| ID uniqueness | Reserve same ID for another listing | `false` while original is active |
| Listing independence | Different IDs, same dates, different listings | Both succeed |
| Invalid interval | Reserve `[5,5)` or negative start | `false` |
| Expiry | Hold at 100/TTL 10; competing reserve at 109; confirm at 110 | `true, false, false` |
| Confirmation | Hold at 100/TTL 10; confirm at 109; competing reserve at 200 | `true, true, false` |
| Atomic failure | Create `a=[2,5)`, `b=[5,7)`; move `a` to `[4,6)` | `false`; listing still shows original dates |
| Self exclusion | Reschedule `a` to its existing dates | `true` |
| Copy safety | Modify a returned record; query again | Store remains unchanged |
| Time validation | Any command at 9 after a command at 10 | Throws |

## 9. Two additional 90-minute prompts

These are transfer exercises after the fully solved booking problem.

**In-memory key-value store:** Level 1 set/get/delete; level 2 prefix scans sorted by key; level 3 TTL using explicit timestamps; level 4 snapshot/restore with a specified TTL policy. Define absent values, exact expiry, overwrite behavior, and whether restore resets remaining TTL. Reuse the map, cleanup, copy, and deterministic-ordering ideas above.

**Task manager:** Level 1 add/complete tasks; level 2 list by priority then creation sequence; level 3 dependencies; level 4 reassignment with capacity constraints. Define cycle rejection, duplicate IDs, completed dependency behavior, and rollback on invalid updates. Reuse validate-before-mutate and regression checks.

**Start now:** Implement the four booking levels from a blank editor under the timer. Then compare behavior against the regression table before reading the reference implementation.
