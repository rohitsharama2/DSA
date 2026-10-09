// Node.js 22.13+: run the TypeScript embedded in both company workbooks.
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const files = [
  '../agoda/rounds/01-DSA-Coding-Questions-and-Solutions.md',
  '../google/rounds/01-DSA-Coding-Questions-and-Solutions.md',
];
const blocks = files.flatMap(file => [...readFileSync(new URL(file, import.meta.url), 'utf8')
  .matchAll(/```ts\n([\s\S]*?)```/g)].map(match => match[1]));
assert.equal(blocks.length, 8, 'All eight worked solution blocks must be exercised');
const code = stripTypeScriptTypes(blocks.join('\n'));
const tests = String.raw`
let checks = 0;
function eq(actual, expected) { assert.deepEqual(actual, expected); checks++; }
function ok(value) { assert.ok(value); checks++; }
function throws(fn) { assert.throws(fn); checks++; }
let seed = 90126;
function rnd(n) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % n; }

// Parser fixtures, malformed grammar, exact arithmetic, and non-recursive depth.
for (const [formula, expected] of [
  ['', 0], ['CH4', 16], ['H(CH4)2', 33], ['O2', 16], ['C12H22O11', 254],
  ['((CH4))', 16], ['(CH)12O2', 172], ['H1', 1], ['((H2)3O)2', 28],
]) eq(formulaWeight(formula), expected);
for (const bad of ['()', '(H', 'H)', 'X', '2H', 'H0', 'H01', 'H 2', 'H-2', '(())',
  'C9007199254740991', 'H9007199254740992', 'H9007199254740991H']) {
  throws(() => formulaWeight(bad));
}
eq(formulaWeight('H9007199254740991'), Number.MAX_SAFE_INTEGER);
eq(formulaWeight('('.repeat(10000) + 'H' + ')'.repeat(10000)), 1);
// Generate an expression tree and independently evaluate its weight while rendering.
function makeFormula(depth) {
  let text = '', total = 0;
  for (let term = 0, count = 1 + rnd(3); term < count; term++) {
    const multiplier = 1 + rnd(12);
    if (depth && rnd(2)) {
      const child = makeFormula(depth - 1);
      text += '(' + child.text + ')' + multiplier;
      total += child.total * multiplier;
    } else {
      const symbol = ['C', 'H', 'O'][rnd(3)];
      text += symbol + multiplier;
      total += ({ C: 12, H: 1, O: 8 })[symbol] * multiplier;
    }
  }
  return { text, total };
}
for (let t = 0; t < 120; t++) {
  const formula = makeFormula(3);
  eq(formulaWeight(formula.text), formula.total);
  const values = Array.from({ length: rnd(20) }, () => rnd(13) - 6);
  const before = [...values];
  const expected = values.map((value, i) => {
    for (let j = i - 1; j >= 0; j--) if (values[j] < value) return j;
    return -1;
  });
  eq(previousSmaller(values), expected);
  eq(denseRanks(values), values.map(value => new Set(values.filter(x => x < value)).size + 1));
  eq(values, before);
}
eq(previousSmaller([4,5,2,2,7]), [-1,0,-1,-1,3]);
eq(denseRanks([40,10,20,20]), [3,1,2,2]);
const dict = new MaxDictionary(), oracle = {};
eq(dict.max(), null);
for (let t = 0; t < 250; t++) {
  const key = 'k' + rnd(8);
  if (rnd(3) === 0) {
    eq(dict.delete(key), Object.hasOwn(oracle, key));
    delete oracle[key];
  } else {
    const value = rnd(40) - 30;
    dict.set(key, value); oracle[key] = value;
  }
  const values = Object.values(oracle);
  eq(dict.max(), values.length ? Math.max(...values) : null);
}

// Validate any valid alphabet, rather than requiring a specific topological order.
function respectsWords(words, order) {
  const chars = new Set(words.join(''));
  if (order === null || order.length !== chars.size || new Set(order).size !== chars.size) return false;
  if ([...order].some(ch => !chars.has(ch))) return false;
  const rank = Object.fromEntries([...order].map((ch, i) => [ch, i]));
  for (let i = 1; i < words.length; i++) {
    const a = words[i - 1], b = words[i];
    let j = 0;
    while (j < Math.min(a.length, b.length) && a[j] === b[j]) j++;
    if (j === Math.min(a.length, b.length)) { if (a.length > b.length) return false; }
    else if (rank[a[j]] >= rank[b[j]]) return false;
  }
  return true;
}
function permutations(a) {
  if (!a.length) return [''];
  return a.flatMap((ch, i) => permutations(a.filter((_, j) => i !== j)).map(rest => ch + rest));
}
eq(alienOrder(['wrt','wrf','er','ett','rftt']), 'wertf');
eq(alienOrder(['abc','ab']), null);
eq(alienOrder(['z','x','z']), null);
eq(alienOrder([]), '');
ok(respectsWords(['za','zb','ca','cb'], alienOrder(['za','zb','ca','cb'])));
for (let t = 0; t < 150; t++) {
  const words = Array.from({ length: rnd(7) }, () =>
    Array.from({ length: rnd(4) }, () => 'abc'[rnd(3)]).join(''));
  const possible = permutations([...new Set(words.join(''))]).some(order => respectsWords(words, order));
  const result = alienOrder(words);
  eq(result !== null, possible);
  if (possible) ok(respectsWords(words, result));
}

// Bellman-Ford reference deliberately uses no deque or greedy finalization.
function shortestReference(graph, source) {
  const distance = Array(graph.length).fill(Infinity); distance[source] = 0;
  for (let pass = 1; pass < graph.length; pass++) {
    const next = [...distance];
    for (let u = 0; u < graph.length; u++) for (const { to, weight } of graph[u]) {
      next[to] = Math.min(next[to], distance[u] + weight);
    }
    distance.splice(0, distance.length, ...next);
  }
  return distance;
}
eq(zeroOneDistances([
  [{to:1,weight:1},{to:2,weight:0}], [{to:3,weight:1}], [{to:1,weight:0}], []
], 0), [0,0,0,1]);
for (let t = 0; t < 180; t++) {
  const n = 1 + rnd(9), graph = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) if (rnd(3) === 0) {
    graph[u].push({ to: v, weight: rnd(2) });
    if (rnd(4) === 0) graph[u].push({ to: v, weight: rnd(2) });
  }
  const source = rnd(n);
  eq(zeroOneDistances(graph, source), shortestReference(graph, source));
}

// Connectivity reference recomputes reachability at every candidate timestamp.
function connectedReference(n, logs) {
  if (n === 1) return 0;
  for (const time of [...new Set(logs.map(x => x[0]))].sort((a,b) => a-b)) {
    const graph = Array.from({ length: n }, () => []);
    for (const [at, a, b] of logs) if (at <= time) { graph[a].push(b); graph[b].push(a); }
    const seen = new Set([0]), queue = [0];
    for (let h = 0; h < queue.length; h++) for (const v of graph[queue[h]]) {
      if (!seen.has(v)) { seen.add(v); queue.push(v); }
    }
    if (seen.size === n) return time;
  }
  return null;
}
eq(earliestConnected(4, [[8,2,3],[2,0,1],[5,1,2]]), 8);
for (let t = 0; t < 150; t++) {
  const n = 1 + rnd(8);
  const logs = Array.from({ length: rnd(18) }, () => [rnd(10),rnd(n),rnd(n)]);
  const original = JSON.stringify(logs);
  eq(earliestConnected(n, logs), connectedReference(n, logs));
  eq(JSON.stringify(logs), original);
}

// Compare merge greediness against exhaustive pair choices on small inputs.
function mergeReference(values) {
  if (values.length < 2) return 0;
  let best = Infinity;
  for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
    const sum = values[i] + values[j];
    best = Math.min(best, sum + mergeReference([...values.filter((_, k) => k !== i && k !== j), sum]));
  }
  return best;
}
eq(optimalMergeCost([2,3,7]), 17);
eq(optimalMergeCost([]), 0);
eq(optimalMergeCost([99]), 0);
for (let t = 0; t < 70; t++) {
  const values = Array.from({ length: rnd(7) }, () => rnd(12));
  eq(optimalMergeCost(values), mergeReference(values));
  const heap = new NumberMinHeap();
  for (const value of values) heap.push(value);
  const sorted = [];
  while (heap.size) sorted.push(heap.pop());
  eq(sorted, [...values].sort((a,b) => a-b));
  throws(() => heap.pop());
}
console.log('PASS: ' + checks + ' assertions across eight worked solutions.');
`;
vm.runInNewContext(code + '\n' + tests, { assert, console }, { timeout: 30000 });
console.log(`Executed ${blocks.length} TypeScript blocks directly from Markdown (runtime checks only).`);
