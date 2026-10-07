// Node.js 22.13+; execute TypeScript directly from the round-wise Markdown.
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const files = ['../rounds/01-DSA-Coding-Questions-and-Solutions.md', '../rounds/05-JS-TS-React-and-I18n.md'];
const blocks = files.flatMap(file => [...readFileSync(new URL(file, import.meta.url), 'utf8')
  .matchAll(/```ts\n([\s\S]*?)```/g)].map(match => match[1]));
const code = stripTypeScriptTypes(blocks.join('\n'));
const tests = String.raw`
(async () => {
let checks=0;
function eq(a,b){assert.deepEqual(a,b);checks++;}
let seed=7007;
function rnd(n){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;}
const sortGroups=groups=>groups.map(g=>[...g].sort((a,b)=>a-b)).sort((a,b)=>a[0]-b[0]);
function reach(points,radii){
 const n=points.length;
 const d=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>
   i===j || (points[i][0]-points[j][0])**2+(points[i][1]-points[j][1])**2<=radii[i]**2));
 for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++)d[i][j] ||= d[i][k]&&d[k][j];
 return d;
}
function uncommonBrute(words){return words.map((word,i)=>{
 const candidates=[];
 for(let a=0;a<word.length;a++)for(let b=a+1;b<=word.length;b++){
  const part=word.slice(a,b);if(words.every((other,j)=>j===i||!other.includes(part)))candidates.push(part);
 }
 candidates.sort((a,b)=>a.length-b.length||(a<b?-1:a>b?1:0));return candidates[0]??'';
});}
function downhillBrute(g,r,c){let best=1;
 for(const [dr,dc]of[[1,0],[-1,0],[0,1],[0,-1]]){const nr=r+dr,nc=c+dc;
 if(nr>=0&&nr<g.length&&nc>=0&&nc<g[0].length&&g[nr][nc]<g[r][c])best=Math.max(best,1+downhillBrute(g,nr,nc));}
 return best;
}
function matrixBrute(grid){const n=grid.length;if(!n||grid[0][0]||grid[n-1][n-1])return -1;
 const d=Array.from({length:n},()=>Array(n).fill(Infinity));d[0][0]=1;
 for(let pass=0;pass<n*n;pass++)for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(!grid[r][c]){
 for(let a=0;a<n;a++)for(let b=0;b<n;b++)if(!grid[a][b]&&Math.max(Math.abs(a-r),Math.abs(b-c))===1)d[a][b]=Math.min(d[a][b],d[r][c]+1);}
 return Number.isFinite(d[n-1][n-1])?d[n-1][n-1]:-1;
}
function windowBrute(s,t){if(!t)return '';let best='';
 for(let a=0;a<s.length;a++)for(let b=a+1;b<=s.length;b++){
 const counts={};for(const ch of s.slice(a,b))counts[ch]=(counts[ch]??0)+1;
 let ok=true;for(const ch of t){counts[ch]=(counts[ch]??0)-1;if(counts[ch]<0)ok=false;}
 if(ok&&(!best||b-a<best.length))best=s.slice(a,b);
 }return best;
}
function flightBrute(n,flights,src,dst,k){let best=Infinity;
 function walk(city,left,cost){if(city===dst)best=Math.min(best,cost);if(left===0)return;
 for(const[u,v,p]of flights)if(u===city)walk(v,left-1,cost+p);}
 walk(src,k+1,0);return Number.isFinite(best)?best:-1;
}
for(let trial=0;trial<120;trial++){
 const pts=Array.from({length:rnd(8)},()=>[rnd(11)-5,rnd(11)-5]),radius=rnd(6);
 const closure=reach(pts,pts.map(()=>radius)),seen=new Set(),groups=[];
 for(let i=0;i<pts.length;i++)if(!seen.has(i)){const group=[];for(let j=0;j<pts.length;j++)if(closure[i][j]){group.push(j);seen.add(j);}groups.push(group);}
 eq(sortGroups(propertyGroups(pts,radius)),groups);
 const radii=pts.map(()=>rnd(6)),directed=reach(pts,radii);
 eq(maxPropertyRipple(pts.map((p,i)=>[...p,radii[i]])),Math.max(0,...directed.map(row=>row.filter(Boolean).length)));
 const words=Array.from({length:2+rnd(4)},()=>Array.from({length:1+rnd(5)},()=>String.fromCharCode(97+rnd(3))).join(''));
 eq(shortestUncommon(words),uncommonBrute(words));
 const rows=1+rnd(3),cols=1+rnd(3),g=Array.from({length:rows},()=>Array.from({length:cols},()=>rnd(10)-5));
 const starts=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)starts.push([r,c]);
 eq(downhillScores(g,starts),starts.map(([r,c])=>downhillBrute(g,r,c)));
 const n=1+rnd(4),grid=Array.from({length:n},()=>Array.from({length:n},()=>rnd(3)===0?1:0));
 eq(shortestClearPath(grid),matrixBrute(grid));
 const s=Array.from({length:rnd(10)},()=>String.fromCharCode(65+rnd(3))).join('');
 const t=Array.from({length:rnd(5)},()=>String.fromCharCode(65+rnd(3))).join('');
 eq(minimumCoveringWindow(s,t),windowBrute(s,t));
 const cities=2+rnd(4),flights=[];
 for(let a=0;a<cities;a++)for(let b=0;b<cities;b++)if(a!==b&&rnd(3))flights.push([a,b,1+rnd(10)]);
 const k=rnd(cities),dst=cities-1,result=cheapestFlightRoute(cities,flights,0,dst,k);
 eq(result.cost,flightBrute(cities,flights,0,dst,k));
 if(result.cost!==-1){eq(result.path[0],0);eq(result.path.at(-1),dst);assert.ok(result.path.length<=k+2);checks++;
 let sum=0;for(let i=1;i<result.path.length;i++){const f=flights.find(([a,b])=>a===result.path[i-1]&&b===result.path[i]);assert.ok(f);sum+=f[2];}eq(sum,result.cost);}
 const terrain=Array.from({length:1+rnd(10)},()=>rnd(6)),original=[...terrain],volume=rnd(10);
 const filled=pourWater(terrain,volume,rnd(terrain.length));eq(terrain,original);
 eq(filled.reduce((a,b)=>a+b,0)-terrain.reduce((a,b)=>a+b,0),volume);
 assert.ok(filled.every((x,i)=>x>=terrain[i]));checks++;
}
eq(propertyGroups([[0,0],[2,0],[4,0],[10,0]],2),[[0,1,2],[3]]);
eq(maxPropertyRipple([[0,0,1],[3,0,3],[6,0,1]]),3);
eq(shortestUncommon(['abc','abd','b']),['c','d','']);
eq(downhillScores([[4,3],[1,2]],[[0,0],[1,1]]),[4,2]);
eq(downhillScores([],[[0,0]]),[0]);
eq(downhillScores([Array.from({length:100000},(_,i)=>100000-i)],[[0,0],[0,99999]]),[100000,1]);
eq(shortestClearPath([[0,1],[1,0]]),2);eq(shortestClearPath([]),-1);
eq(minimumCoveringWindow('AAABBC','ABC'),'ABBC');eq(minimumCoveringWindow('AAABBC','AABC'),'AABBC');
eq(slidingPuzzleMoves([[1,2,3],[4,0,5]]),1);eq(slidingPuzzleMoves([[1,2,3],[5,4,0]]),-1);
eq(slidingPuzzleMoves([[4,1,2],[5,0,3]]),5);eq(slidingPuzzleMoves([[1,2,3],[4,5,6],[7,0,8]]),1);
eq(slidingPuzzleMoves([[1,2,3],[4,5,0]]),0);
eq(cheapestFlightRoute(3,[[0,1,4],[1,2,4],[0,2,12]],0,2,0),{cost:12,path:[0,2]});
eq(cheapestFlightRoute(3,[[0,1,4],[1,2,4],[0,2,12]],0,2,1),{cost:8,path:[0,1,2]});
eq(pourWater([2,1,2],2,1),[2,3,2]);eq(pourWater([2,1,1,2,1,2,2],4,3),[2,2,2,3,2,2,2]);
eq(pourWater([1],3,0),[4]);eq(pourWater([3,1,3],0,1),[3,1,3]);
eq(renderTerrain([2,1,2],[2,3,2]),' W \n+W+\n+++\n---');
const fallback={'fr-CA':['fr','en'],fr:['en'],en:['fr-CA']};
eq(resolveTranslation({fr:{welcome:'Salut'},en:{welcome:'Hi'}},fallback,'fr-CA','welcome'),{locale:'fr',text:'Salut'});
eq(resolveTranslation({'fr-CA':{welcome:''},fr:{welcome:'Salut'}},fallback,'fr-CA','welcome'),{locale:'fr-CA',text:''});
eq(resolveTranslation({},fallback,'fr-CA','missing'),null);
eq(resolveTranslation({}, {},'en','toString'),null);
eq(truncateGraphemes('e\u0301x',1,'en'),'e\u0301');eq(truncateGraphemes('👩‍💻!',1,'en'),'👩‍💻');eq(truncateGraphemes('abc',0,'en'),'');
let active=0,maxActive=0;
const mapped=await mapWithConcurrency([3,1,4,2],2,async(value)=>{active++;maxActive=Math.max(maxActive,active);
 for(let i=0;i<value;i++)await Promise.resolve();active--;return value*2;});
eq(mapped,[6,2,8,4]);eq(maxActive,2);eq(active,0);
eq(await mapWithConcurrency([],4,async x=>x),[]);
await assert.rejects(()=>mapWithConcurrency([1],0,async x=>x));checks++;
await assert.rejects(()=>mapWithConcurrency([1],1,async()=>{throw new Error('failure');}));checks++;
console.log('PASS: '+checks+' assertions for round-wise DSA and role-specific helpers.');
})()
`;
await vm.runInNewContext(code+'\n'+tests, {assert,console,Intl}, {timeout:30000});
console.log(`Executed ${blocks.length} TypeScript blocks. React TSX requires a React test environment and is not executed here.`);
