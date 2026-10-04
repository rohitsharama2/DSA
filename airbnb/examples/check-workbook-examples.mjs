// Run with Node.js 22.13+ (built-in TypeScript stripping); no npm dependencies.
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const files = [
  '../CodeSignal-Assessment-Guide-and-Examples.md',
  '../CodeSignal-90-Minute-Progressive-Workbook.md',
  '../Candidate-Questions-and-Solutions.md',
];
const blocks = files.flatMap(file => [...readFileSync(new URL(file, import.meta.url), 'utf8')
  .matchAll(/```ts\n([\s\S]*?)```/g)].map(match => match[1]));
const source = stripTypeScriptTypes(blocks.join('\n'));
const tests = `
let checks = 0;
function eq(actual, expected) { assert.deepEqual(actual, expected); checks++; }
let seed = 20261004;
function rnd(n) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % n; }
function bruteSessions(tasks, cap) {
  let best = tasks.length;
  const bins = [];
  function visit(i) {
    if (i === tasks.length) { best = Math.min(best, bins.length); return; }
    for (let b = 0; b < bins.length; b++) {
      if (bins[b] + tasks[i] <= cap) {
        bins[b] += tasks[i]; visit(i + 1); bins[b] -= tasks[i];
      }
    }
    if (bins.length < best) { bins.push(tasks[i]); visit(i + 1); bins.pop(); }
  }
  visit(0); return best;
}
function brutePartition(nums) {
  let best = Infinity;
  const total = nums.reduce((a,b) => a+b, 0);
  function visit(i, count, sum) {
    if (i === nums.length) {
      if (count === nums.length/2) best = Math.min(best, Math.abs(total-2*sum));
      return;
    }
    visit(i+1,count,sum); visit(i+1,count+1,sum+nums[i]);
  }
  visit(0,0,0); return best;
}
function bruteSplit(availability, start, end) {
  const names = Object.keys(availability).sort();
  const covers = (name, a, b) => {
    for (let day=a; day<=b; day++) if (!availability[name].includes(day)) return false;
    return true;
  };
  const pairs = [];
  for (const a of names) for (const b of names) {
    if (a === b) continue;
    for (let k=start; k<end; k++) if (covers(a,start,k) && covers(b,k+1,end)) {
      pairs.push([a,b]); break;
    }
  }
  return {singleStays:names.filter(name=>covers(name,start,end)),splitStays:pairs};
}
function bruteMenu(need, offers) {
  // Independent finite-state shortest-path search (Dijkstra, simple linear frontier).
  const pending = [[0, need]], done = new Set();
  while (pending.length) {
    pending.sort((a,b)=>b[0]-a[0]);
    const [cost, state] = pending.pop(), key = state.join(',');
    if (done.has(key)) continue;
    done.add(key);
    if (state.every(x=>x===0)) return cost;
    for (const offer of offers) pending.push([cost+offer.price,
      state.map((x,i)=>Math.max(0,x-offer.quantities[i]))]);
  }
  return -1;
}
function bruteTree(root) {
  if (!root) return 0;
  function inspect(node, low, high) {
    if (!node) return 0;
    if (!(low<node.val && node.val<high)) return null;
    const a=inspect(node.left,low,node.val), b=inspect(node.right,node.val,high);
    return a===null || b===null ? null : a+b+node.val;
  }
  return Math.max(0,inspect(root,-Infinity,Infinity) ?? 0,
    bruteTree(root.left),bruteTree(root.right));
}
for (let t=0; t<150; t++) {
  const values=Array.from({length:rnd(9)},()=>rnd(20)), k=1+rnd(10), budget=rnd(30);
  const sums=[]; for(let i=0;i+k<=values.length;i++) sums.push(values.slice(i,i+k).reduce((a,b)=>a+b,0));
  eq(cheapestStay(values,k),sums.length?Math.min(...sums):-1);
  let pairs=0; for(let i=0;i<values.length;i++) for(let j=i+1;j<values.length;j++) if(values[i]+values[j]<=budget) pairs++;
  eq(countBudgetPairs(values,budget),pairs);
  const rows=1+rnd(4),cols=1+rnd(4),grid=Array.from({length:rows},()=>Array.from({length:cols},()=>rnd(10)));
  const queries=[],expected=[];
  for(let q=0;q<5;q++) {
    const r1=rnd(rows),r2=r1+rnd(rows-r1),c1=rnd(cols),c2=c1+rnd(cols-c1);
    queries.push([r1,c1,r2,c2]); let total=0;
    for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) total+=grid[r][c];
    expected.push(total);
  }
  eq(rectangleTotals(grid,queries),expected);
  const cap=1+rnd(6),tasks=Array.from({length:rnd(8)},()=>1+rnd(cap));
  eq(minSessions(tasks,cap),bruteSessions(tasks,cap));
  const nums=Array.from({length:2*(1+rnd(5))},()=>rnd(21)-10);
  eq(minimumPartitionDifference(nums),brutePartition(nums));
  const heights=Array.from({length:rnd(15)},()=>1+rnd(6)),dp=[];
  heights.forEach((h,i)=> { dp[i]=1; for(let j=0;j<i;j++) if(heights[j]<=h) dp[i]=Math.max(dp[i],dp[j]+1); });
  eq(longestObstacleCourseAtEachPosition(heights),dp);
  const availability={A:[],B:[],C:[]};
  for(const days of Object.values(availability)) for(let day=1;day<=5;day++) if(rnd(3)) days.push(day);
  eq(splitStays(availability,1,5),bruteSplit(availability,1,5));
  const need=[rnd(4),rnd(4)],offers=Array.from({length:3},()=>({quantities:[rnd(3),rnd(3)],price:rnd(8)}));
  for(const offer of offers) if(offer.quantities.every(x=>x===0)) offer.quantities[0]=1;
  eq(minimumMenuCost(need,offers),bruteMenu(need,offers));
  function tree(depth) { return depth===0 || rnd(4)===0 ? null : {val:rnd(15)-7,left:tree(depth-1),right:tree(depth-1)}; }
  const root=tree(4); eq(maxSumBST(root),bruteTree(root));
  const costs=Array.from({length:2+rnd(8)},()=>rnd(20));
  function stairs(i) { return i>=costs.length?0:costs[i]+Math.min(stairs(i+1),stairs(i+2)); }
  eq(minCostClimbingStairs(costs),Math.min(stairs(0),stairs(1)));
  const target=rnd(12), bundles=[{size:2,cost:3},{size:3,cost:4}];
  function exact(x) { if(x===0)return 0;if(x<0)return Infinity;return Math.min(exact(x-2)+3,exact(x-3)+4); }
  const expectedCost=exact(target); eq(cheapestExactOrder(target,bundles),Number.isFinite(expectedCost)?expectedCost:-1);
}
eq(minimumMenuCost([2,1],[{quantities:[1,0],price:500},{quantities:[0,1],price:300},{quantities:[1,1],price:650}]),1150);
eq(splitStays({A:[1,2],B:[3,4],C:[1,2,3,4]},1,4),{singleStays:['C'],splitStays:[['A','B'],['A','C'],['C','B']]});
eq(splitStays({A:[1,1],B:[1]},1,1),{singleStays:['A','B'],splitStays:[]});
eq(minCostClimbingStairs([1,100,1,1,1,100,1,1,100,1]),6);
eq(minimumPartitionDifference([3,9,7,3]),2);
eq(maxSumBST({val:5,left:{val:3,left:{val:2,left:null,right:null},right:{val:6,left:null,right:null}},right:{val:8,left:null,right:null}}),11);
const simple=new BookingStore();
eq(simple.reserve('a','h',2,5),true);eq(simple.reserve('b','h',5,7),true);eq(simple.reserve('c','h',4,6),false);
const simpleCopy=simple.list('h');simpleCopy[0].start=99;eq(simple.list('h')[0].start,2);eq(simple.cancel('a'),true);eq(simple.cancel('a'),false);
const store=new ProgressiveBookingStore();
eq(store.reserve('a','h',2,5,0),true);eq(store.reserve('b','h',5,7,0),true);
eq(store.reserve('c','h',4,6,0),false);eq(store.reserve('a','other',2,5,0),false);
eq(store.reserve('d','other',2,5,0),true);eq(store.reserve('bad','h',5,5,0),false);
eq(store.reschedule('a',4,6,1),false);eq(store.list('h',1).map(x=>[x.start,x.end]),[[2,5],[5,7]]);
eq(store.reschedule('a',2,5,1),true);eq(store.reschedule('a',0,2,1),true);
const copy=store.list('h',1);copy[0].start=99;eq(store.list('h',1)[0].start,0);
eq(store.cancel('a',2),true);eq(store.cancel('a',2),false);eq(store.reserve('a','h',0,2,2),true);
assert.throws(()=>store.list('h',1));checks++;
const holds=new ProgressiveBookingStore();
eq(holds.hold('x','h',2,5,100,10),true);eq(holds.reserve('y','h',2,5,109),false);
eq(holds.confirm('x',110),false);eq(holds.reserve('y','h',2,5,110),true);
eq(holds.hold('x','h',5,7,110,10),true);eq(holds.confirm('x',119),true);
eq(holds.confirm('x',120),false);eq(holds.reserve('z','h',5,7,200),false);
eq(holds.hold('bad','h',9,10,200,0),false);eq(holds.reschedule('missing',9,10,200),false);
// Deep skewed tree demonstrates the iterative solution avoids recursion overflow.
let deep=null;for(let v=20000;v>=1;v--)deep={val:v,left:null,right:deep};eq(maxSumBST(deep),20000*20001/2);
console.log('PASS: '+checks+' assertions, including deterministic randomized brute-force comparisons and progressive-store regression cases.');
`;
vm.runInNewContext(source + '\n' + tests, { assert, console }, { timeout: 30000 });
console.log(`Executed ${blocks.length} TypeScript blocks directly from the Markdown workbooks.`);
