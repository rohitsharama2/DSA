// Original practice solutions. Inputs follow the contracts below; no libraries.

// 207: n >= 0 integer; prerequisites are valid [course, prerequisite] IDs.
export function canFinish(n, prerequisites) {
  const graph = Array.from({ length: n }, () => []);
  const degree = Array(n).fill(0);
  for (const [course, prior] of prerequisites) {
    graph[prior].push(course);
    degree[course]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (degree[i] === 0) queue.push(i);
  for (let head = 0; head < queue.length; head++) {
    for (const next of graph[queue[head]]) if (--degree[next] === 0) queue.push(next);
  }
  return queue.length === n;
}

// 239: finite numeric values; integer k in [1, nums.length]. Reject invalid k.
export function slidingWindowMaximum(nums, k) {
  if (!Number.isInteger(k) || k < 1 || k > nums.length) throw new Error('Invalid window');
  const deque = Array(k), output = [];
  let head = 0, size = 0;
  for (let i = 0; i < nums.length; i++) {
    while (size && deque[head] <= i - k) { head = (head + 1) % k; size--; }
    while (size && nums[deque[(head + size - 1) % k]] <= nums[i]) size--;
    deque[(head + size) % k] = i;
    size++;
    if (i >= k - 1) output.push(nums[deque[head]]);
  }
  return output;
}

// 33: rotation of a strictly increasing finite numeric array; -1 if absent.
export function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

// 4: sorted finite numeric arrays; arithmetic safely representable; not both empty.
export function medianSortedArrays(a, b) {
  if (a.length > b.length) return medianSortedArrays(b, a);
  if (a.length + b.length === 0) throw new Error('No median for empty input');
  const half = Math.floor((a.length + b.length + 1) / 2);
  let lo = 0, hi = a.length;
  while (lo <= hi) {
    const i = lo + Math.floor((hi - lo) / 2), j = half - i;
    const al = i === 0 ? -Infinity : a[i - 1], ar = i === a.length ? Infinity : a[i];
    const bl = j === 0 ? -Infinity : b[j - 1], br = j === b.length ? Infinity : b[j];
    if (al > br) hi = i - 1;
    else if (bl > ar) lo = i + 1;
    else {
      const left = Math.max(al, bl);
      return (a.length + b.length) % 2 ? left : (left + Math.min(ar, br)) / 2;
    }
  }
  throw new Error('Inputs must be sorted');
}

// 139: strings compared as UTF-16 code units; empty text true, empty words ignored.
export function wordBreak(text, words) {
  const root = { next: new Map(), terminal: false };
  for (const word of words) {
    if (!word.length) continue;
    let node = root;
    for (let i = 0; i < word.length; i++) {
      if (!node.next.has(word[i])) node.next.set(word[i], { next: new Map(), terminal: false });
      node = node.next.get(word[i]);
    }
    node.terminal = true;
  }
  const reachable = Array(text.length + 1).fill(false);
  reachable[0] = true;
  for (let i = 0; i < text.length; i++) {
    if (!reachable[i]) continue;
    let node = root;
    for (let j = i; j < text.length; j++) {
      node = node.next.get(text[j]);
      if (!node) break;
      if (node.terminal) reachable[j + 1] = true;
    }
  }
  return reachable[text.length];
}

// 72: unit-cost insert/delete/replace, UTF-16 code units; return distance only.
export function editDistance(a, b) {
  if (b.length > a.length) [a, b] = [b, a];
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = Array(b.length + 1);
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      current[j] = a[i - 1] === b[j - 1] ? previous[j - 1]
        : 1 + Math.min(previous[j], current[j - 1], previous[j - 1]);
    }
    previous = current;
  }
  return previous[b.length];
}

// 210: same valid graph contract as 207; any order, or [] for a cycle.
export function findOrder(n, prerequisites) {
  const graph = Array.from({ length: n }, () => []), degree = Array(n).fill(0);
  for (const [course, prior] of prerequisites) { graph[prior].push(course); degree[course]++; }
  const order = [];
  for (let i = 0; i < n; i++) if (!degree[i]) order.push(i);
  for (let head = 0; head < order.length; head++) {
    for (const next of graph[order[head]]) if (--degree[next] === 0) order.push(next);
  }
  return order.length === n ? order : [];
}

// 269: lowercase English words; any valid character order; '' if impossible/empty.
export function alienOrder(words) {
  const edges = new Map(), degree = new Map();
  for (const word of words) for (const ch of word) {
    if (!edges.has(ch)) { edges.set(ch, new Set()); degree.set(ch, 0); }
  }
  for (let i = 1; i < words.length; i++) {
    const a = words[i - 1], b = words[i];
    let j = 0;
    while (j < Math.min(a.length, b.length) && a[j] === b[j]) j++;
    if (j === Math.min(a.length, b.length)) {
      if (a.length > b.length) return '';
    } else if (!edges.get(a[j]).has(b[j])) {
      edges.get(a[j]).add(b[j]); degree.set(b[j], degree.get(b[j]) + 1);
    }
  }
  const order = [...degree.keys()].filter(ch => degree.get(ch) === 0);
  for (let head = 0; head < order.length; head++) for (const next of edges.get(order[head])) {
    degree.set(next, degree.get(next) - 1);
    if (!degree.get(next)) order.push(next);
  }
  return order.length === edges.size ? order.join('') : '';
}

// 127: same-length lowercase English words. Number of words in route; 0 if none.
// Extension: begin === end returns 1 even if not in dictionary.
export function ladderLength(begin, end, wordList) {
  if (begin === end) return 1;
  const remaining = new Set(wordList);
  if (!remaining.has(end)) return 0;
  remaining.delete(begin);
  const queue = [[begin, 1]];
  for (let head = 0; head < queue.length; head++) {
    const [word, length] = queue[head];
    for (let i = 0; i < word.length; i++) for (let code = 97; code <= 122; code++) {
      const ch = String.fromCharCode(code);
      if (ch === word[i]) continue;
      const next = word.slice(0, i) + ch + word.slice(i + 1);
      if (!remaining.has(next)) continue;
      if (next === end) return length + 1;
      remaining.delete(next); // Mark at enqueue, not dequeue.
      queue.push([next, length + 1]);
    }
  }
  return 0;
}

// 236: proper binary tree, nodes {val,left,right}; p and q are present node objects.
// Returns the actual ancestor object; missing-node variants need additional checks.
export function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  return left && right ? root : left || right;
}

// Helper: comparator returns true when a should be popped before b.
export class BinaryHeap {
  constructor(before) { this.data = []; this.before = before; }
  get size() { return this.data.length; }
  peek() { return this.data[0]; }
  push(value) {
    this.data.push(value);
    let i = this.size - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.before(this.data[i], this.data[p])) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  pop() {
    if (!this.size) throw new Error('Empty heap');
    const first = this.data[0], last = this.data.pop();
    if (this.size) {
      this.data[0] = last;
      let i = 0;
      while (2 * i + 1 < this.size) {
        let child = 2 * i + 1;
        if (child + 1 < this.size && this.before(this.data[child + 1], this.data[child])) child++;
        if (!this.before(this.data[child], this.data[i])) break;
        [this.data[i], this.data[child]] = [this.data[child], this.data[i]];
        i = child;
      }
    }
    return first;
  }
}

// 295: finite numeric stream, median sums safely representable. Requires BinaryHeap.
export class MedianFinder {
  constructor() {
    this.lower = new BinaryHeap((a, b) => a > b);
    this.upper = new BinaryHeap((a, b) => a < b);
  }
  addNum(value) {
    if (!this.lower.size || value <= this.lower.peek()) this.lower.push(value);
    else this.upper.push(value);
    if (this.lower.size > this.upper.size + 1) this.upper.push(this.lower.pop());
    if (this.upper.size > this.lower.size) this.lower.push(this.upper.pop());
  }
  findMedian() {
    if (!this.lower.size) throw new Error('Empty stream');
    return this.lower.size > this.upper.size ? this.lower.peek()
      : (this.lower.peek() + this.upper.peek()) / 2;
  }
}

// 146: capacity >= 0 integer, numeric keys/values; get returns -1 when absent.
export class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity < 0) throw new Error('Invalid capacity');
    this.capacity = capacity;
    this.nodes = new Map();
    this.head = { next: null, prev: null };
    this.tail = { next: null, prev: this.head };
    this.head.next = this.tail;
  }
  detach(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  promote(node) {
    node.prev = this.head; node.next = this.head.next;
    node.next.prev = node; this.head.next = node;
  }
  get(key) {
    const node = this.nodes.get(key);
    if (!node) return -1;
    this.detach(node); this.promote(node);
    return node.value;
  }
  put(key, value) {
    if (!this.capacity) return;
    let node = this.nodes.get(key);
    if (node) { this.detach(node); node.value = value; }
    else { node = { key, value }; this.nodes.set(key, node); }
    this.promote(node);
    if (this.nodes.size > this.capacity) {
      const oldest = this.tail.prev;
      this.detach(oldest); this.nodes.delete(oldest.key);
    }
  }
}

// 56: finite numeric closed intervals [start,end], start <= end; no input mutation.
export function mergeIntervals(intervals) {
  const sorted = intervals.map(pair => [...pair]).sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];
    if (!last || start > last[1]) merged.push([start, end]);
    else last[1] = Math.max(last[1], end);
  }
  return merged;
}

// 76: UTF-16 code units; return shortest covering substring, earliest on ties.
// Empty target or no covering substring => ''.
export function minWindow(s, t) {
  if (!t.length) return '';
  const need = new Map();
  for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) ?? 0) + 1);
  let missing = t.length, left = 0, bestStart = 0, bestLength = Infinity;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing--;
      need.set(ch, need.get(ch) - 1);
    }
    while (missing === 0) {
      if (right - left + 1 < bestLength) { bestStart = left; bestLength = right - left + 1; }
      const old = s[left++];
      if (need.has(old)) {
        need.set(old, need.get(old) + 1);
        if (need.get(old) > 0) missing++;
      }
    }
  }
  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}

// 322: positive integer denominations; amount >= 0 integer. Unlimited reuse.
export function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let total = 1; total <= amount; total++) for (const coin of coins) {
    if (coin <= total) dp[total] = Math.min(dp[total], dp[total - coin] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 743: n >= 1, vertices 1..n, times [from,to,nonnegativeWeight], valid source k.
// All sums safely representable. Requires BinaryHeap; returns -1 if unreachable.
export function networkDelayTime(times, n, k) {
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [from, to, weight] of times) graph[from].push([to, weight]);
  const distance = Array(n + 1).fill(Infinity);
  distance[k] = 0;
  const heap = new BinaryHeap((a, b) => a.cost < b.cost);
  heap.push({ vertex: k, cost: 0 });
  while (heap.size) {
    const { vertex, cost } = heap.pop();
    if (cost !== distance[vertex]) continue;
    for (const [to, weight] of graph[vertex]) {
      const next = cost + weight;
      if (next < distance[to]) { distance[to] = next; heap.push({ vertex: to, cost: next }); }
    }
  }
  let answer = 0;
  for (let vertex = 1; vertex <= n; vertex++) answer = Math.max(answer, distance[vertex]);
  return answer === Infinity ? -1 : answer;
}
