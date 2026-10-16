import assert from 'node:assert/strict';
import * as s from './general-coding.mjs';
let checks=0,seed=4326;
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const rnd=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
const tree=(val,left=null,right=null)=>({val,left,right});
const list=values=>values.reduceRight((next,val)=>({val,next}),null);
function values(head){const result=[],seen=new Set();while(head){assert.ok(!seen.has(head),'list cycle');seen.add(head);result.push(head.val);head=head.next;}return result;}
const canon=groups=>groups.map(x=>[...x].sort()).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
eq(s.findAllRecipes(['bread','sandwich'],[['yeast','flour'],['bread','ham']],['yeast','flour','ham']),['bread','sandwich']);
eq(s.findAllRecipes(['a','b'],[['b'],['a']],[]),[]);
eq(s.findAllRecipes(['a','b'],[[],['a','a']],[]),['a','b']);
eq(s.orangesRotting([[2,1,1],[1,1,0],[0,1,1]]),4);eq(s.orangesRotting([[1]]),-1);eq(s.orangesRotting([]),0);
eq(s.minGridCost([[1,1,3],[3,2,2],[1,1,4]]),0);eq(s.minGridCost([[4]]),0);
eq(s.findRedundantConnection([[1,2],[1,3],[2,3]]),[2,3]);
eq(canon(s.accountsMerge([['A','a','b'],['A','b','c'],['B','d'],['A','x']])),canon([['A','a','b','c'],['B','d'],['A','x']]));
eq(s.accountsMerge([['A'],['A']]),[['A'],['A']]);
for(const root of [null,tree(1),tree(1,tree(2,null,tree(4)),tree(3)),tree(-5,null,tree(-5))])eq(s.deserialize(s.serialize(root)),root);
const calendar=new s.MyCalendar();eq(calendar.book(10,20),true);eq(calendar.book(15,25),false);eq(calendar.book(20,30),true);eq(calendar.book(10,20),false);
eq(canon(s.groupAnagrams(['eat','tea','tan','ate','nat','bat',''])),canon([['eat','tea','ate'],['tan','nat'],['bat'],['']]));
eq(s.subarraySum([1,-1,0],0),3);
eq(values(s.mergeKLists([list([1,4,5]),list([1,3,4]),list([2,6])])),[1,1,2,3,4,4,5,6]);eq(s.mergeKLists([]),null);
eq(s.connectSticks([2,3,7]),17);eq(s.connectSticks([]),0);
eq(s.splitArray([7,2,5,10,8],2),18);eq(s.minEatingSpeed([3,6,7,11],8),4);
eq(s.longestIncreasingPath([[9,9,4],[6,6,8],[2,1,1]]),4);eq(s.longestIncreasingPath([]),0);
eq(s.lengthOfLIS([10,9,2,5,3,7,101,18]),4);eq(s.longestCommonSubsequence('abcde','ace'),3);
eq(s.generateParenthesis(0),['']);eq(s.generateParenthesis(3).sort(),['((()))','(()())','(())()','()(())','()()()'].sort());
eq(s.findWords([['a','b'],['c','d']],['ab','ac','abd','aba','ab']).sort(),['ab','abd','ac'].sort());
eq(s.findCheapestPrice(3,[[0,1,100],[1,2,100],[0,2,500]],0,2,0),500);eq(s.findCheapestPrice(3,[[0,1,100],[1,2,100]],0,2,1),200);
eq(s.minimumEffortPath([[1,2,2],[3,8,2],[5,3,5]]),2);eq(s.minimumEffortPath([[1]]),0);
eq(s.minimumTotalDistance([4,5],[[0,1],[6,1]]),5);eq(s.minimumTotalDistance([1],[]),null);eq(s.minimumTotalDistance([],[]),0);
eq(s.makeConnected(4,[[0,1],[0,2],[1,2]]),1);eq(s.makeConnected(4,[[0,1]]),-1);
eq(s.removeStones([[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]),5);eq(s.removeStones([]),0);
eq(s.maxProbability(3,[[0,1],[1,2],[0,2]],[0.5,0.5,0.2],0,2),0.25);eq(s.maxProbability(1,[],[],0,0),1);
eq(s.copyRandomList(null),null);eq(s.reorderList(null),null);eq(values(s.reorderList(list([1,2,3,4,5]))),[1,5,2,4,3]);
eq(s.maxPathSum(tree(-10,tree(9),tree(20,tree(15),tree(7)))),42);eq(s.maxPathSum(tree(-3)),-3);
eq(s.topKFrequent([1,1,1,2,2,3],2),[1,2]);eq(s.topKFrequent([2,1],0),[]);
// Slow references use repeated reachability, enumeration and relaxation.
function components(n,edges){const graph=Array.from({length:n},()=>[]);for(const[a,b]of edges){graph[a].push(b);graph[b].push(a);}const seen=new Set();let count=0;
 for(let i=0;i<n;i++)if(!seen.has(i)){count++;const stack=[i];seen.add(i);while(stack.length)for(const j of graph[stack.pop()])if(!seen.has(j)){seen.add(j);stack.push(j);}}return count;}
function gridEdges(grid,weight){const rows=grid.length,cols=grid[0].length,edges=[];
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)[[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr,dc],i)=>{const nr=r+dr,nc=c+dc;if(nr>=0&&nr<rows&&nc>=0&&nc<cols)edges.push([r*cols+c,nr*cols+nc,weight(r,c,nr,nc,i)]);});return edges;}
function gridReference(grid,minimax){const n=grid.length*grid[0].length,d=Array(n).fill(Infinity);d[0]=0;
 const edges=gridEdges(grid,(r,c,nr,nc,i)=>minimax?Math.abs(grid[r][c]-grid[nr][nc]):Number(grid[r][c]!==i+1));
 for(let k=0;k<n-1;k++)for(const[a,b,w]of edges)d[b]=Math.min(d[b],minimax?Math.max(d[a],w):d[a]+w);return d[n-1];}
function assignmentReference(robots,factories){let best=Infinity;const used=Array(factories.length).fill(0);
 function visit(i,cost){if(i===robots.length){best=Math.min(best,cost);return;}factories.forEach(([pos,cap],j)=>{if(used[j]<cap){used[j]++;visit(i+1,cost+Math.abs(robots[i]-pos));used[j]--;}});}visit(0,0);return best===Infinity?null:best;}
function splitReference(a,k){function visit(start,left){if(left===1)return a.slice(start).reduce((x,y)=>x+y,0);let sum=0,best=Infinity;
 for(let end=start;end<=a.length-left;end++){sum+=a[end];best=Math.min(best,Math.max(sum,visit(end+1,left-1)));}return best;}return visit(0,k);}
function lcsReference(a,b){if(!a.length||!b.length)return 0;if(a[0]===b[0])return 1+lcsReference(a.slice(1),b.slice(1));return Math.max(lcsReference(a.slice(1),b),lcsReference(a,b.slice(1)));}
function stickReference(a){if(a.length<2)return 0;let best=Infinity;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const sum=a[i]+a[j];best=Math.min(best,sum+stickReference([...a.filter((_,k)=>k!==i&&k!==j),sum]));}return best;}
function pathReference(a){const rows=a.length,cols=a[0].length;function dfs(r,c){let best=1;for(const[dr,dc]of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&a[nr][nc]>a[r][c])best=Math.max(best,1+dfs(nr,nc));}return best;}return Math.max(...a.flatMap((row,r)=>row.map((_,c)=>dfs(r,c))));}
for(let t=0;t<100;t++){
 const grid=Array.from({length:1+rnd(3)},()=>Array.from({length:3},()=>1+rnd(4))),before=JSON.stringify(grid);
 eq(s.minGridCost(grid),gridReference(grid,false));eq(s.minimumEffortPath(grid),gridReference(grid,true));eq(s.longestIncreasingPath(grid),pathReference(grid));eq(JSON.stringify(grid),before);
 const nums=Array.from({length:1+rnd(8)},()=>rnd(10)),target=rnd(10)-3;
 let count=0;for(let i=0;i<nums.length;i++){let sum=0;for(let j=i;j<nums.length;j++){sum+=nums[j];if(sum===target)count++;}}eq(s.subarraySum(nums,target),count);
 let lis=0;for(let mask=0;mask<2**nums.length;mask++){const seq=nums.filter((_,i)=>mask&(1<<i));if(seq.every((x,i)=>i===0||seq[i-1]<x))lis=Math.max(lis,seq.length);}eq(s.lengthOfLIS(nums),lis);
 const k=1+rnd(nums.length);eq(s.splitArray(nums,k),splitReference(nums,k));
 const piles=nums.map(x=>x+1),h=piles.length+rnd(20);let speed=1;while(piles.reduce((a,b)=>a+Math.ceil(b/speed),0)>h)speed++;eq(s.minEatingSpeed(piles,h),speed);
 const a=Array.from({length:rnd(6)},()=> 'abc'[rnd(3)]).join(''),b=Array.from({length:rnd(6)},()=> 'abc'[rnd(3)]).join('');eq(s.longestCommonSubsequence(a,b),lcsReference(a,b));
 const counts=new Map();for(const x of nums)counts.set(x,(counts.get(x)??0)+1);const top=rnd(counts.size+1);
 eq(s.topKFrequent(nums,top),[...counts].sort((a,b)=>b[1]-a[1]||a[0]-b[0]).slice(0,top).map(x=>x[0]));
 const robots=Array.from({length:rnd(5)},()=>rnd(12)-6),factories=Array.from({length:rnd(4)},()=>[rnd(12)-6,rnd(4)]),snapshot=JSON.stringify([robots,factories]);
 eq(s.minimumTotalDistance(robots,factories),assignmentReference(robots,factories));eq(JSON.stringify([robots,factories]),snapshot);
 const n=1+rnd(7),edges=Array.from({length:rnd(12)},()=>[rnd(n),rnd(n)]);eq(s.makeConnected(n,edges),edges.length<n-1?-1:components(n,edges)-1);
 const stones=[...new Set(Array.from({length:rnd(10)},()=>`${rnd(4)},${rnd(4)}`))].map(x=>x.split(',').map(Number)),links=[];
 for(let i=0;i<stones.length;i++)for(let j=i+1;j<stones.length;j++)if(stones[i][0]===stones[j][0]||stones[i][1]===stones[j][1])links.push([i,j]);eq(s.removeStones(stones),stones.length-components(stones.length,links));
 const nodes=nums.map(val=>({val,next:null,random:null}));nodes.forEach((node,i)=>{node.next=nodes[i+1]??null;node.random=nodes[rnd(nodes.length+1)]??null;});
 const oldNext=nodes.map(x=>x.next),oldRandom=nodes.map(x=>x.random);let copy=s.copyRandomList(nodes[0]),copies=[];while(copy){copies.push(copy);copy=copy.next;}
 eq(copies.map(x=>x.val),nums);copies.forEach((x,i)=>{eq(nodes.includes(x),false);eq(copies.indexOf(x.random),nodes.indexOf(nodes[i].random));eq(nodes[i].next===oldNext[i],true);eq(nodes[i].random===oldRandom[i],true);});
 const sequence=[];for(let lo=0,hi=nums.length-1;lo<=hi;lo++,hi--){sequence.push(nums[lo]);if(lo!==hi)sequence.push(nums[hi]);}eq(values(s.reorderList(list(nums))),sequence);
 const groups=Array.from({length:rnd(5)},()=>Array.from({length:rnd(7)},()=>rnd(20)).sort((a,b)=>a-b));eq(values(s.mergeKLists(groups.map(list))),groups.flat().sort((a,b)=>a-b));
}
for(let t=0;t<20;t++){const a=Array.from({length:rnd(6)},()=>rnd(8));eq(s.connectSticks(a),stickReference(a));}
// Calendar against naive interval overlap; recipe supply fixed-point oracle.
for(let t=0;t<40;t++){
 const cal=new s.MyCalendar(),events=[];for(let i=0;i<30;i++){const start=rnd(50),end=start+1+rnd(8),expected=events.every(([a,b])=>end<=a||start>=b);eq(cal.book(start,end),expected);if(expected)events.push([start,end]);}
 const recipes=['a','b','c','d'],ingredients=recipes.map(()=>Array.from({length:rnd(4)},()=>['a','b','c','d','x','y'][rnd(6)])),supplies=['x'];
 const have=new Set(supplies);let changed=true;while(changed){changed=false;recipes.forEach((r,i)=>{if(!have.has(r)&&ingredients[i].every(x=>have.has(x))){have.add(r);changed=true;}});}eq(s.findAllRecipes(recipes,ingredients,supplies).sort(),recipes.filter(x=>have.has(x)).sort());
}
// Probability and bounded-flight reference enumerate all walks up to a safe bound.
for(let t=0;t<50;t++){
 const n=1+rnd(5),edges=[],prob=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(rnd(2)){edges.push([i,j]);prob.push(rnd(11)/10);}
 const graph=Array.from({length:n},()=>[]);edges.forEach(([a,b],i)=>{graph[a].push([b,prob[i]]);graph[b].push([a,prob[i]]);});let best=0;
 function walk(u,p,seen){if(u===n-1)best=Math.max(best,p);for(const[v,w]of graph[u])if(!seen.has(v))walk(v,p*w,new Set([...seen,v]));}walk(0,1,new Set([0]));eq(s.maxProbability(n,edges,prob,0,n-1),best);
 const flights=edges.map(([a,b])=>[a,b,1+rnd(10)]),k=rnd(4);let cheapest=Infinity;
 function flight(u,cost,left){if(u===n-1)cheapest=Math.min(cheapest,cost);if(!left)return;for(const[a,b,w]of flights)if(a===u)flight(b,cost+w,left-1);}flight(0,0,k+1);eq(s.findCheapestPrice(n,flights,0,n-1,k),cheapest===Infinity?-1:cheapest);
}
console.log(`PASS: ${checks} assertions across 28 general Google coding solutions.`);
