import { BinaryHeap } from '../android-studio-tech-lead/coding-solutions.mjs';

// Helper: integer IDs 0..n-1; union by size and path compression.
export class DSU {
  constructor(n) { this.parent = Array.from({length:n},(_,i)=>i); this.size=Array(n).fill(1); this.count=n; }
  find(x) { while (x!==this.parent[x]) { this.parent[x]=this.parent[this.parent[x]]; x=this.parent[x]; } return x; }
  union(a,b) {
    a=this.find(a); b=this.find(b); if(a===b)return false;
    if(this.size[a]<this.size[b]) [a,b]=[b,a];
    this.parent[b]=a; this.size[a]+=this.size[b]; this.count--; return true;
  }
}

// 2115: unique recipe names; ingredient lists; supplies are reusable, not consumed.
export function findAllRecipes(recipes, ingredients, supplies) {
  const waiting=new Map(), missing=Array(recipes.length).fill(0);
  ingredients.forEach((list,i)=>{ for(const item of new Set(list)) {
    if(!waiting.has(item))waiting.set(item,[]);
    waiting.get(item).push(i); missing[i]++;
  }});
  const available=new Set(supplies), queue=[...available];
  for(let i=0;i<recipes.length;i++)if(!missing[i]&&!available.has(recipes[i])) {
    available.add(recipes[i]);queue.push(recipes[i]);
  }
  for(let head=0;head<queue.length;head++)for(const i of waiting.get(queue[head])??[]) {
    if(--missing[i]===0&&!available.has(recipes[i])) { available.add(recipes[i]);queue.push(recipes[i]); }
  }
  return recipes.filter(name=>available.has(name));
}

// 994: rectangular grid of 0/1/2; returns minutes or -1. Does not mutate input.
export function orangesRotting(grid) {
  const a=grid.map(row=>[...row]), rows=a.length, cols=a[0]?.length??0, queue=[];
  let fresh=0, minutes=0;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) {
    if(a[r][c]===1)fresh++; else if(a[r][c]===2)queue.push([r,c,0]);
  }
  for(let head=0;head<queue.length;head++) {
    const [r,c,t]=queue[head];minutes=Math.max(minutes,t);
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&a[nr][nc]===1) {
        a[nr][nc]=2;fresh--;queue.push([nr,nc,t+1]);
      }
    }
  }
  return fresh?-1:minutes;
}

// 1368: nonempty rectangle; arrows 1 right, 2 left, 3 down, 4 up. No mutation.
export function minGridCost(grid) {
  const rows=grid.length,cols=grid[0].length,dist=Array(rows*cols).fill(Infinity);
  const deque=new Map();let front=0,back=0;
  dist[0]=0;deque.set(back++,[0,0]);
  const moves=[[0,1],[0,-1],[1,0],[-1,0]];
  while(front<back) {
    const [id,cost]=deque.get(front);deque.delete(front++);
    if(cost!==dist[id])continue;
    if(id===dist.length-1)return cost;
    const r=Math.floor(id/cols),c=id%cols;
    moves.forEach(([dr,dc],i)=>{
      const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=rows||nc<0||nc>=cols)return;
      const to=nr*cols+nc,weight=grid[r][c]===i+1?0:1,next=cost+weight;
      if(next<dist[to]) {dist[to]=next;if(weight)deque.set(back++,[to,next]);else deque.set(--front,[to,next]);}
    });
  }
  return dist.at(-1);
}

// 684: undirected tree on 1..n plus one edge; return last redundant edge in order.
export function findRedundantConnection(edges) {
  const dsu=new DSU(edges.length+1);let answer=[];
  for(const [a,b] of edges)if(!dsu.union(a,b))answer=[a,b];
  return answer;
}

// 721: [name,...emails]; connected accounts have consistent names; output order arbitrary.
export function accountsMerge(accounts) {
  const dsu=new DSU(accounts.length),owner=new Map();
  accounts.forEach((account,i)=>{for(const email of account.slice(1)) {
    if(owner.has(email))dsu.union(i,owner.get(email));else owner.set(email,i);
  }});
  const groups=new Map();
  for(const [email,i] of owner) {
    const root=dsu.find(i);if(!groups.has(root))groups.set(root,[]);groups.get(root).push(email);
  }
  const result=[...groups].map(([root,emails])=>[accounts[root][0],...emails.sort()]);
  accounts.forEach(a=>{if(a.length===1)result.push([...a]);});
  return result;
}

// 297: finite numeric values; proper binary tree {val,left,right}. Own JSON BFS format.
export function serialize(root) {
  const values=[],queue=[root];
  for(let head=0;head<queue.length;head++) {
    const node=queue[head];values.push(node?node.val:null);
    if(node)queue.push(node.left??null,node.right??null);
  }
  return JSON.stringify(values);
}
export function deserialize(text) {
  const values=JSON.parse(text);
  if(values[0]===null)return null;
  const root={val:values[0],left:null,right:null},queue=[root];let i=1;
  for(let head=0;head<queue.length;head++)for(const side of ['left','right']) {
    const value=values[i++];
    if(value!==null) { const node={val:value,left:null,right:null};queue[head][side]=node;queue.push(node); }
  }
  return root;
}

// 729: finite start < end; half-open [start,end); simple sorted-array implementation.
export class MyCalendar {
  constructor(){this.events=[];}
  book(start,end) {
    let lo=0,hi=this.events.length;
    while(lo<hi){const mid=Math.floor((lo+hi)/2);if(this.events[mid][0]<start)lo=mid+1;else hi=mid;}
    if(lo>0&&this.events[lo-1][1]>start)return false;
    if(lo<this.events.length&&end>this.events[lo][0])return false;
    this.events.splice(lo,0,[start,end]);return true;
  }
}

// 49: lowercase a-z strings; grouping/order arbitrary.
export function groupAnagrams(words) {
  const groups=new Map();
  for(const word of words) {
    const counts=Array(26).fill(0);for(const ch of word)counts[ch.charCodeAt(0)-97]++;
    const key=counts.join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(word);
  }
  return [...groups.values()];
}

// 560: safe integer inputs, prefix sums and answer; supports negatives.
export function subarraySum(nums,k) {
  const seen=new Map([[0,1]]);let sum=0,count=0;
  for(const x of nums){sum+=x;count+=seen.get(sum-k)??0;seen.set(sum,(seen.get(sum)??0)+1);}
  return count;
}

// 23: disjoint acyclic sorted lists {val,next}; reuses/mutates nodes. Requires BinaryHeap.
export function mergeKLists(lists) {
  const heap=new BinaryHeap((a,b)=>a.val<b.val);
  for(const node of lists)if(node)heap.push(node);
  const dummy={next:null};let tail=dummy;
  while(heap.size){const node=heap.pop();if(node.next)heap.push(node.next);tail.next=node;tail=node;}
  if(tail!==dummy)tail.next=null;
  return dummy.next;
}

// 1167: nonnegative safe integer lengths and safe sums; empty/single costs 0.
export function connectSticks(sticks) {
  const heap=new BinaryHeap((a,b)=>a<b);for(const x of sticks)heap.push(x);
  let cost=0;while(heap.size>1){const x=heap.pop()+heap.pop();cost+=x;heap.push(x);}return cost;
}

// 410: nonempty nonnegative integer nums, 1 <= k <= n, total sum safely representable.
export function splitArray(nums,k) {
  let lo=0,hi=0;for(const x of nums){lo=Math.max(lo,x);hi+=x;}
  while(lo<hi) {
    const mid=lo+Math.floor((hi-lo)/2);let groups=1,sum=0;
    for(const x of nums){if(sum+x>mid){groups++;sum=x;}else sum+=x;}
    if(groups<=k)hi=mid;else lo=mid+1;
  }
  return lo;
}

// 875: nonempty positive integer piles; h >= piles.length; safe hour sums.
export function minEatingSpeed(piles,h) {
  let lo=1,hi=1;for(const x of piles)hi=Math.max(hi,x);
  while(lo<hi) {
    const mid=lo+Math.floor((hi-lo)/2);let hours=0;
    for(const x of piles)hours+=Math.ceil(x/mid);
    if(hours<=h)hi=mid;else lo=mid+1;
  }
  return lo;
}

// 329: rectangular finite numeric matrix; strictly increasing orthogonal paths.
export function longestIncreasingPath(matrix) {
  const rows=matrix.length,cols=matrix[0]?.length??0;
  if(!rows||!cols)return 0;
  const degree=Array(rows*cols).fill(0),queue=[],moves=[[1,0],[-1,0],[0,1],[0,-1]];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) {
    for(const [dr,dc] of moves){const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&matrix[nr][nc]<matrix[r][c])degree[r*cols+c]++;
    }
    if(!degree[r*cols+c])queue.push(r*cols+c);
  }
  let head=0,layers=0;
  while(head<queue.length) {
    const end=queue.length;layers++;
    while(head<end){const id=queue[head++],r=Math.floor(id/cols),c=id%cols;
      for(const [dr,dc] of moves){const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&matrix[nr][nc]>matrix[r][c]&&--degree[nr*cols+nc]===0)queue.push(nr*cols+nc);
      }
    }
  }
  return layers;
}

// 300: finite numbers; strictly increasing subsequence, length only.
export function lengthOfLIS(nums) {
  const tails=[];
  for(const x of nums){let lo=0,hi=tails.length;
    while(lo<hi){const mid=Math.floor((lo+hi)/2);if(tails[mid]<x)lo=mid+1;else hi=mid;}
    tails[lo]=x;
  }
  return tails.length;
}

// 1143: UTF-16 code-unit strings; LCS length only.
export function longestCommonSubsequence(a,b) {
  if(b.length>a.length)[a,b]=[b,a];
  let previous=Array(b.length+1).fill(0);
  for(let i=1;i<=a.length;i++){const row=Array(b.length+1).fill(0);
    for(let j=1;j<=b.length;j++)row[j]=a[i-1]===b[j-1]?previous[j-1]+1:Math.max(previous[j],row[j-1]);
    previous=row;
  }
  return previous[b.length];
}

// 22: integer n >= 0; n=0 gives ['']; output size can be exponential.
export function generateParenthesis(n) {
  const result=[],path=[];
  function visit(open,close){if(close===n){result.push(path.join(''));return;}
    if(open<n){path.push('(');visit(open+1,close);path.pop();}
    if(close<open){path.push(')');visit(open,close+1);path.pop();}
  }
  visit(0,0);return result;
}

// 212: rectangular lowercase character board, nonempty words; no cell reuse/no mutation.
export function findWords(board,words) {
  const root={children:new Map(),word:null};
  for(const word of words){let node=root;for(const ch of word){if(!node.children.has(ch))node.children.set(ch,{children:new Map(),word:null});node=node.children.get(ch);}node.word=word;}
  const rows=board.length,cols=board[0]?.length??0,seen=new Set(),output=[];
  function visit(r,c,parent){if(r<0||r>=rows||c<0||c>=cols||seen.has(r*cols+c))return;
    const node=parent.children.get(board[r][c]);if(!node)return;
    if(node.word!==null){output.push(node.word);node.word=null;}
    seen.add(r*cols+c);
    visit(r+1,c,node);visit(r-1,c,node);visit(r,c+1,node);visit(r,c-1,node);
    seen.delete(r*cols+c);
  }
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)visit(r,c,root);
  return output;
}

// 787: directed nonnegative-cost flights, 0-based IDs, at most k stops (k+1 edges).
export function findCheapestPrice(n,flights,src,dst,k) {
  let dist=Array(n).fill(Infinity);dist[src]=0;
  for(let edges=0;edges<=k;edges++){const next=[...dist];
    for(const [a,b,cost] of flights)next[b]=Math.min(next[b],dist[a]+cost);
    dist=next;
  }
  return dist[dst]===Infinity?-1:dist[dst];
}

// 1631: nonempty rectangle, finite heights with safe differences; minimax edge cost.
export function minimumEffortPath(heights) {
  const rows=heights.length,cols=heights[0].length,dist=Array(rows*cols).fill(Infinity);
  const heap=new BinaryHeap((a,b)=>a[0]<b[0]);dist[0]=0;heap.push([0,0]);
  while(heap.size){const [cost,id]=heap.pop();if(cost!==dist[id])continue;if(id===dist.length-1)return cost;
    const r=Math.floor(id/cols),c=id%cols;
    for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;
      if(nr<0||nr>=rows||nc<0||nc>=cols)continue;
      const to=nr*cols+nc,next=Math.max(cost,Math.abs(heights[r][c]-heights[nr][nc]));
      if(next<dist[to]){dist[to]=next;heap.push([next,to]);}
    }
  }
}

// 2463: safe positions/costs; factories [position,nonnegative integer capacity].
// Does not mutate inputs; null if insufficient capacity, 0 for no robots.
export function minimumTotalDistance(robots,factories) {
  const a=[...robots].sort((x,y)=>x-y),b=factories.map(x=>[...x]).sort((x,y)=>x[0]-y[0]);
  let dp=Array(a.length+1).fill(Infinity);dp[0]=0;
  for(const [position,capacity] of b){const next=[...dp];
    for(let i=1;i<=a.length;i++){let cost=0;
      for(let count=1;count<=Math.min(capacity,i);count++) {cost+=Math.abs(a[i-count]-position);next[i]=Math.min(next[i],dp[i-count]+cost);}
    }
    dp=next;
  }
  return dp[a.length]===Infinity?null:dp[a.length];
}

// 1319: n>=1 vertices, undirected cables, can move redundant cables.
export function makeConnected(n,connections) {
  if(connections.length<n-1)return -1;
  const dsu=new DSU(n);for(const [a,b] of connections)dsu.union(a,b);return dsu.count-1;
}

// 947: unique coordinate pairs; remove a stone only if another shares row or column.
export function removeStones(stones) {
  const dsu=new DSU(stones.length),rows=new Map(),cols=new Map();
  stones.forEach(([r,c],i)=>{
    if(rows.has(r))dsu.union(i,rows.get(r));else rows.set(r,i);
    if(cols.has(c))dsu.union(i,cols.get(c));else cols.set(c,i);
  });
  return stones.length-dsu.count;
}

// 1514: undirected graph, probabilities in [0,1], 0-based valid IDs. Requires BinaryHeap.
export function maxProbability(n,edges,probabilities,start,end) {
  const graph=Array.from({length:n},()=>[]);
  edges.forEach(([a,b],i)=>{graph[a].push([b,probabilities[i]]);graph[b].push([a,probabilities[i]]);});
  const best=Array(n).fill(0),heap=new BinaryHeap((a,b)=>a[0]>b[0]);best[start]=1;heap.push([1,start]);
  while(heap.size){const [prob,node]=heap.pop();if(prob!==best[node])continue;if(node===end)return prob;
    for(const [to,p] of graph[node]){const next=prob*p;if(next>best[to]){best[to]=next;heap.push([next,to]);}}
  }
  return 0;
}

// 138: acyclic next chain, random points within it or null; preserve original nodes.
export function copyRandomList(head) {
  const copies=new Map([[null,null]]);
  for(let node=head;node;node=node.next)copies.set(node,{val:node.val,next:null,random:null});
  for(let node=head;node;node=node.next){const copy=copies.get(node);copy.next=copies.get(node.next);copy.random=copies.get(node.random);}
  return copies.get(head);
}

// 143: acyclic list; mutate next links into L0,Ln,L1,Ln-1,...; return head for convenience.
export function reorderList(head) {
  if(!head||!head.next)return head;
  let slow=head,fast=head;
  while(fast.next&&fast.next.next){slow=slow.next;fast=fast.next.next;}
  let node=slow.next,previous=null;slow.next=null;
  while(node){const next=node.next;node.next=previous;previous=node;node=next;}
  let first=head,second=previous;
  while(second){const a=first.next,b=second.next;first.next=second;second.next=a;first=a;second=b;}
  return head;
}

// 124: nonempty proper binary tree, safe integer values/sums; nonempty path required.
export function maxPathSum(root) {
  let best=-Infinity;
  function gain(node){if(!node)return 0;const left=Math.max(0,gain(node.left)),right=Math.max(0,gain(node.right));
    best=Math.max(best,node.val+left+right);return node.val+Math.max(left,right);
  }
  gain(root);return best;
}

// 347: finite numeric values, 0<=k<=distinct count; ties use smaller value first.
export function topKFrequent(nums,k) {
  const counts=new Map();for(const x of nums)counts.set(x,(counts.get(x)??0)+1);
  const heap=new BinaryHeap((a,b)=>a[1]<b[1]||(a[1]===b[1]&&a[0]>b[0]));
  for(const entry of counts){heap.push(entry);if(heap.size>k)heap.pop();}
  const result=[];while(heap.size)result.push(heap.pop()[0]);return result.reverse();
}
