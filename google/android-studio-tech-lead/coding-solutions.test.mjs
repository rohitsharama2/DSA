import assert from 'node:assert/strict';
import * as extra from './coding-solutions.mjs';
import { canFinish, slidingWindowMaximum, searchRotated, medianSortedArrays, wordBreak, editDistance } from './coding-solutions.mjs';
let checks = 0, seed = 161026;
const eq = (a,b) => { assert.deepEqual(a,b); checks++; };
const rnd = n => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed % n; };
const str = n => Array.from({length:n},()=> 'abc'[rnd(3)]).join('');
// Independent cycle oracle: transitive closure has a diagonal iff cyclic.
function finishReference(n, edges) {
  const paths = Array.from({length:n},()=>Array(n).fill(false));
  for (const [to,from] of edges) paths[from][to]=true;
  for(let k=0;k<n;k++) for(let i=0;i<n;i++) for(let j=0;j<n;j++) paths[i][j] ||= paths[i][k] && paths[k][j];
  return !paths.some((row,i)=>row[i]);
}
// Small recursive oracle enumerates segmentation choices, not trie transitions.
function breakReference(s, words) {
  if (!s.length) return true;
  return words.some(w=>w.length && s.startsWith(w) && breakReference(s.slice(w.length), words));
}
// Brute recursive edit definition for short strings, no rolling rows.
function editReference(a,b) {
  if (!a.length || !b.length) return a.length+b.length;
  if (a[0]===b[0]) return editReference(a.slice(1),b.slice(1));
  return 1+Math.min(editReference(a.slice(1),b),editReference(a,b.slice(1)),editReference(a.slice(1),b.slice(1)));
}
eq(canFinish(0,[]),true); eq(canFinish(1,[[0,0]]),false);
eq(canFinish(2,[[1,0],[1,0]]),true);
eq(slidingWindowMaximum([1,3,-1,-3,5,3,6,7],3),[3,3,5,5,6,7]);
for (const [xs,k] of [[[],1],[[1],0],[[1],2],[[1],1.5]]) { assert.throws(()=>slidingWindowMaximum(xs,k));checks++; }
assert.throws(()=>medianSortedArrays([],[])); checks++;
eq(medianSortedArrays([1,3],[2]),2);eq(medianSortedArrays([1,2],[3,4]),2.5);
eq(wordBreak('leetcode',['leet','code']),true);eq(wordBreak('catsandog',['cats','dog','sand','and','cat']),false);
eq(wordBreak('',[]),true);eq(wordBreak('x',['']),false);
eq(editDistance('horse','ros'),3);eq(editDistance('intention','execution'),5);
for (let t=0;t<220;t++) {
  const n=1+rnd(8),edges=Array.from({length:rnd(20)},()=>[rnd(n),rnd(n)]);
  eq(canFinish(n,edges),finishReference(n,edges));
  const values=Array.from({length:1+rnd(35)},()=>rnd(30)-15), k=1+rnd(values.length), copy=[...values];
  eq(slidingWindowMaximum(values,k),values.slice(k-1).map((_,i)=>Math.max(...values.slice(i,i+k))));
  eq(values,copy);
  const sorted=Array.from({length:rnd(20)},(_,i)=>i*3-10),pivot=rnd(sorted.length+1);
  const rotated=[...sorted.slice(pivot),...sorted.slice(0,pivot)];
  for (const target of [...sorted,-12,100]) eq(searchRotated(rotated,target),rotated.indexOf(target));
  const a=Array.from({length:rnd(15)},()=>rnd(30)-15).sort((x,y)=>x-y);
  const b=Array.from({length:1+rnd(15)},()=>rnd(30)-15).sort((x,y)=>x-y);
  const joined=[...a,...b].sort((x,y)=>x-y), mid=Math.floor(joined.length/2), snapshot=JSON.stringify([a,b]);
  eq(medianSortedArrays(a,b),joined.length%2?joined[mid]:(joined[mid-1]+joined[mid])/2);
  eq(JSON.stringify([a,b]),snapshot);
  const s=str(rnd(9)),words=Array.from({length:rnd(7)},()=>str(rnd(4)));
  eq(wordBreak(s,words),breakReference(s,words));
  const x=str(rnd(5)),y=str(rnd(5));
  eq(editDistance(x,y),editReference(x,y));
}

// Check any topological order, not a single expected order.
for(let t=0;t<100;t++) {
  const n=1+rnd(7),edges=Array.from({length:rnd(15)},()=>[rnd(n),rnd(n)]);
  const order=extra.findOrder(n,edges),possible=finishReference(n,edges);
  eq(order.length,possible?n:0);
  if(possible){eq(new Set(order).size,n);for(const [to,from] of edges)eq(order.indexOf(from)<order.indexOf(to),true);}
}
function permutations(a){if(!a.length)return [[]];return a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[x,...p]));}
function respects(words,order){const rank=new Map([...order].map((c,i)=>[c,i]));
  for(let i=1;i<words.length;i++){const a=words[i-1],b=words[i];let j=0;while(j<Math.min(a.length,b.length)&&a[j]===b[j])j++;
    if(j===Math.min(a.length,b.length)){if(a.length>b.length)return false;}else if(rank.get(a[j])>=rank.get(b[j]))return false;
  }return true;
}
for(let t=0;t<100;t++){
  const words=Array.from({length:1+rnd(6)},()=>str(1+rnd(3))),chars=[...new Set(words.join(''))];
  const possible=permutations(chars).some(p=>respects(words,p.join(''))),answer=extra.alienOrder(words);
  eq(answer!=='',possible);if(possible){eq([...answer].sort(),chars.sort());eq(respects(words,answer),true);}
}
function ladderOracle(begin,end,words){if(begin===end)return 1;if(!words.includes(end))return 0;
  const queue=[[begin,1]],seen=new Set([begin]);
  for(let h=0;h<queue.length;h++){const [word,d]=queue[h];for(const next of words){let differences=0;
    for(let i=0;i<word.length;i++)differences+=word[i]!==next[i];
    if(differences!==1||seen.has(next))continue;if(next===end)return d+1;seen.add(next);queue.push([next,d+1]);
  }}return 0;
}
const universe=[];for(const a of 'abc')for(const b of 'abc')for(const c of 'abc')universe.push(a+b+c);
for(let t=0;t<80;t++){const words=universe.filter(()=>rnd(3)!==0),begin=universe[rnd(27)],end=universe[rnd(27)];eq(extra.ladderLength(begin,end,words),ladderOracle(begin,end,words));}
// LCA oracle via explicit ancestor lists; duplicate values force identity checks.
for(let t=0;t<60;t++){
  const nodes=Array.from({length:1+rnd(25)},()=>({val:0,left:null,right:null})),parent=new Map([[nodes[0],null]]);
  for(let i=1;i<nodes.length;i++){const p=nodes[Math.floor((i-1)/2)];p[i%2?'left':'right']=nodes[i];parent.set(nodes[i],p);}
  const p=nodes[rnd(nodes.length)],q=nodes[rnd(nodes.length)],ancestors=new Set();for(let x=p;x;x=parent.get(x))ancestors.add(x);
  let expected=q;while(!ancestors.has(expected))expected=parent.get(expected);
  eq(extra.lowestCommonAncestor(nodes[0],p,q)===expected,true);
}
for(let t=0;t<60;t++){
  const median=new extra.MedianFinder(),values=[];assert.throws(()=>median.findMedian());checks++;
  for(let i=0;i<40;i++){const x=rnd(30)-15;values.push(x);median.addNum(x);const sorted=[...values].sort((a,b)=>a-b),m=Math.floor(sorted.length/2);
    eq(median.findMedian(),sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2);
  }
  const capacity=rnd(6),cache=new extra.LRUCache(capacity),oracle=new Map();
  for(let i=0;i<80;i++){const key=rnd(10);if(rnd(3)){const value=rnd(100);cache.put(key,value);oracle.delete(key);oracle.set(key,value);if(oracle.size>capacity)oracle.delete(oracle.keys().next().value);}
    else {const value=oracle.get(key)??-1;eq(cache.get(key),value);if(oracle.has(key)){oracle.delete(key);oracle.set(key,value);}}
    eq([...cache.nodes.keys()].sort(),[...oracle.keys()].sort());
  }
}
function intervalOracle(input){const parts=input.map(x=>[...x]);let changed=true;
 while(changed){changed=false;outer:for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++)if(Math.max(parts[i][0],parts[j][0])<=Math.min(parts[i][1],parts[j][1])){parts[i]=[Math.min(parts[i][0],parts[j][0]),Math.max(parts[i][1],parts[j][1])];parts.splice(j,1);changed=true;break outer;}}
 return parts.sort((a,b)=>a[0]-b[0]);
}
function windowOracle(s,t){if(!t.length)return '';let best='';for(let i=0;i<s.length;i++)for(let j=i+1;j<=s.length;j++){
 const remaining=s.slice(i,j).split('');let valid=true;for(const ch of t){const at=remaining.indexOf(ch);if(at<0){valid=false;break;}remaining.splice(at,1);}
 if(valid&&(!best||j-i<best.length))best=s.slice(i,j);
}return best;}
function coinOracle(coins,amount){const queue=[[0,0]],seen=new Set([0]);for(let h=0;h<queue.length;h++){const [value,d]=queue[h];if(value===amount)return d;for(const c of coins)if(value+c<=amount&&!seen.has(value+c)){seen.add(value+c);queue.push([value+c,d+1]);}}return -1;}
function networkOracle(edges,n,k){const d=Array(n+1).fill(Infinity);d[k]=0;for(let i=1;i<n;i++)for(const [a,b,w] of edges)d[b]=Math.min(d[b],d[a]+w);const maximum=Math.max(...d.slice(1));return maximum===Infinity?-1:maximum;}
for(let t=0;t<140;t++){
 const intervals=Array.from({length:rnd(9)},()=>{const a=rnd(20)-10;return[a,a+rnd(7)];}),copy=JSON.stringify(intervals);
 eq(extra.mergeIntervals(intervals),intervalOracle(intervals));eq(JSON.stringify(intervals),copy);
 eq(extra.minWindow(str(rnd(9)),''),'');const s=str(rnd(9)),target=str(rnd(5));eq(extra.minWindow(s,target),windowOracle(s,target));
 const coins=Array.from({length:rnd(5)},()=>1+rnd(7)),amount=rnd(25);eq(extra.coinChange(coins,amount),coinOracle(coins,amount));
 const n=1+rnd(7),edges=Array.from({length:rnd(20)},()=>[1+rnd(n),1+rnd(n),rnd(10)]),k=1+rnd(n);eq(extra.networkDelayTime(edges,n,k),networkOracle(edges,n,k));
}
console.log(`PASS: ${checks} assertions across all 16 Android Studio track coding solutions.`);
