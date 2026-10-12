// Node.js 22.13+: execute the worked Markdown code rather than duplicate solutions.
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const files = [
  '../stripe/rounds/01-DSA-and-Multipart-Coding.md',
  '../stripe/rounds/02-Integration-and-Bug-Squash.md',
  '../netflix/rounds/01-DSA-and-Stateful-Coding.md',
];
const blocks = files.flatMap(file => [...readFileSync(new URL(file, import.meta.url), 'utf8')
  .matchAll(/```ts\n([\s\S]*?)```/g)].map(match => match[1]));
assert.equal(blocks.length, 8, 'Expected all eight worked solution blocks');
const code = stripTypeScriptTypes(blocks.join('\n'));
const tests = String.raw`
(async () => {
let checks = 0, seed = 121026;
function eq(a, b) { assert.deepEqual(a, b); checks++; }
function throws(fn) { assert.throws(fn); checks++; }
async function rejects(fn) { await assert.rejects(fn); checks++; }
function rnd(n) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return (seed >>> 8) % n; }

eq(parseCsvRecord('a,"b,c","d""e",'), ['a','b,c','d"e','']);
eq(parseCsvRecord(''), ['']);
eq(parseCsvRecord(',,""'), ['','','']);
eq(parseCsvRecord(' a ,b '), [' a ','b ']);
for (const bad of ['"unclosed','a"b','"a"x','a\nb','a\rb']) throws(() => parseCsvRecord(bad));
// Independent CSV encoder: property is decode(encode(fields)) == fields.
for (let t = 0; t < 150; t++) {
  const fields = Array.from({ length: 1 + rnd(8) }, () =>
    Array.from({ length: rnd(15) }, () => ['a',',','"',' ', 'é'][rnd(5)]).join(''));
  const encoded = fields.map(field => '"' + field.replaceAll('"','""') + '"').join(',');
  eq(parseCsvRecord(encoded), fields);
}
eq(subscriptionSchedule([{id:'a',start:10,end:20}], [5,20,5]), [
  {id:'a',at:10,kind:'welcome'}, {id:'a',at:15,kind:'reminder'}, {id:'a',at:20,kind:'expiry'}
]);
eq(subscriptionSchedule([], []), []);
// Reference enumerates times and IDs instead of generating/sorting events.
for (let t = 0; t < 100; t++) {
  const items = Array.from({length:rnd(6)}, (_,i) => {
    const start = rnd(10); return {id:String.fromCharCode(97+i), start, end:start+rnd(10)};
  }).reverse();
  const offsets = Array.from({length:rnd(5)}, () => 1+rnd(10));
  const expected = [];
  for (let at = 0; at < 20; at++) for (const item of [...items].sort((a,b) => a.id < b.id ? -1 : 1)) {
    if (at === item.start) expected.push({id:item.id,at,kind:'welcome'});
    if (at >= item.start && offsets.includes(item.end-at)) expected.push({id:item.id,at,kind:'reminder'});
    if (at === item.end) expected.push({id:item.id,at,kind:'expiry'});
  }
  eq(subscriptionSchedule(items,offsets), expected);
}
const replay = new RequestReplay(); let calls = 0;
const handler = () => String(++calls);
eq(replay.run('a','1',{x:1,y:[2,{a:true,b:null}]},handler), '1');
eq(replay.run('a','1',{y:[2,{b:null,a:true}],x:1},handler), '1');
eq(calls,1);
throws(() => replay.run('a','1',{x:2},handler));
eq(calls,1);
eq(replay.run('b','1',{x:2},handler),'2');
throws(() => replay.run('a','fail',null,() => {throw new Error('no effect');}));
eq(replay.run('a','fail',null,handler),'3');
eq(canonicalJson({a:[1,2]}), '{"a":[1,2]}');
eq(canonicalJson([2,1]) === canonicalJson([1,2]), false);
eq(canonicalJson({a:1}) === canonicalJson('{"a":1}'), false);
eq(canonicalJson(-0), canonicalJson(0));
eq(replay.run('a:b','c',null,handler),'4');
eq(replay.run('a','b:c',null,handler),'5');

const paid = (id,version,amountMinor,currency='USD',status='paid') => ({id,version,amountMinor,currency,status});
const records = [paid('a',1,'100'),paid('b',1,'70','EUR'),paid('a',2,'100','USD','void'),paid('b',1,'70','EUR'),paid('c',1,'40')];
let requests = [];
const result = await aggregatePaymentPages(async cursor => {
  requests.push(cursor);
  return cursor === null ? {items:records.slice(0,2),nextCursor:'p2'} : {items:records.slice(2),nextCursor:null};
});
eq([...result], [['EUR',70n],['USD',40n]]);
eq(requests, [null,'p2']);
eq([...(await aggregatePaymentPages(async () => ({items:[],nextCursor:null})))], []);
eq([...(await aggregatePaymentPages(async () => ({items:[paid('big',1,'9007199254740993')],nextCursor:null})))], [['USD',9007199254740993n]]);
await rejects(() => aggregatePaymentPages(async () => ({items:[],nextCursor:'loop'})));
await rejects(() => aggregatePaymentPages(async cursor => {
  if (cursor !== null) throw new Error('network failure');
  return {items:[paid('x',1,'4')],nextCursor:'p2'};
}));
await rejects(() => aggregatePaymentPages(async () => ({items:[paid('x',1,'2'),paid('x',1,'3')],nextCursor:null})));
await rejects(() => aggregatePaymentPages(async () => ({items:[paid('x',2,'7'),paid('x',1,'2'),paid('x',1,'3')],nextCursor:null})));
for (const bad of [paid('x',1,'-1'),paid('x',1,'1.1'),paid('x',-1,'1'),paid('x',1,'01'),paid('x',1,'1','usd')]) {
  await rejects(() => aggregatePaymentPages(async () => ({items:[bad],nextCursor:null})));
}
// Random version order and duplicates; reference selects maxima from the full input.
for (let trial = 0; trial < 50; trial++) {
  const rows = [];
  for (let id = 0; id < 5; id++) for (let version = 0; version < 1+rnd(4); version++) {
    const row = paid(String(id),version,String(rnd(100)),rnd(2)?'USD':'EUR',rnd(3)?'paid':'void');
    rows.push(row); if(rnd(2)) rows.push({...row});
  }
  for(let i=rows.length-1;i>0;i--){const j=rnd(i+1);[rows[i],rows[j]]=[rows[j],rows[i]];}
  const expected = new Map();
  for (const id of new Set(rows.map(row=>row.id))) {
    const row = rows.filter(row=>row.id===id).sort((a,b)=>b.version-a.version)[0];
    if(row.status==='paid') expected.set(row.currency,(expected.get(row.currency)??0n)+BigInt(row.amountMinor));
  }
  const actual = await aggregatePaymentPages(async cursor => {
    const start = cursor === null ? 0 : Number(cursor), end = Math.min(start+3,rows.length);
    return {items:rows.slice(start,end), nextCursor:end<rows.length?String(end):null};
  });
  const ordered = map => [...map].sort((a,b)=>a[0]<b[0]?-1:1);
  eq(ordered(actual),ordered(expected));
}

const cache = new TimedCache();
cache.set('a','old',5,10); cache.set('a','new',10,12);
eq(cache.get('a',15),'new'); eq(cache.get('a',22),null);
cache.set('empty','',5,22); eq(cache.get('empty',22),'');
cache.set('empty','gone',0,22); eq(cache.count(22),0);
throws(()=>cache.get('a',21)); throws(()=>cache.set('a','x',-1,23));
const randomCache = new TimedCache(), cacheLog = []; let now = 0;
for (let i=0;i<350;i++) {
  now += rnd(3); const key = String(rnd(8));
  if(rnd(2)) {
    const ttl=rnd(15),value='v'+i;
    randomCache.set(key,value,ttl,now); cacheLog.push({key,value,at:now,ttl});
  } else {
    const last=[...cacheLog].reverse().find(e=>e.key===key);
    eq(randomCache.get(key,now),last&&now<last.at+last.ttl?last.value:null);
  }
  let count=0;
  for(const key of new Set(cacheLog.map(e=>e.key))){const last=[...cacheLog].reverse().find(e=>e.key===key);if(now<last.at+last.ttl)count++;}
  eq(randomCache.count(now),count);
}
const store = new VersionedStore(), writes=[];
store.set('a','A',2);store.set('a','B',5);store.set('a','C',5);
eq(store.get('a',1),null);eq(store.get('a',4),'A');eq(store.get('a',5),'C');
throws(()=>store.set('a','bad',4));eq(store.get('a',5),'C');
const randomStore=new VersionedStore(), lastTimes=new Map();
for(let i=0;i<350;i++) {
  const key=String(rnd(5)),time=(lastTimes.get(key)??0)+rnd(4),value='v'+i;
  randomStore.set(key,value,time);lastTimes.set(key,time);writes.push({key,time,value});
  const query=rnd(120),queryKey=String(rnd(6));
  const eligible=writes.filter(w=>w.key===queryKey&&w.time<=query);
  eq(randomStore.get(queryKey,query),eligible.length?eligible[eligible.length-1].value:null);
}
const history=new TextHistory();let states=[''],index=0;
for(let i=0;i<400;i++) {
  const op=rnd(3);
  if(op===0){const value='s'+rnd(8);if(value!==states[index]){states=states.slice(0,index+1);states.push(value);index++;}eq(history.replace(value),states[index]);}
  else if(op===1){index=Math.max(0,index-1);eq(history.undo(),states[index]);}
  else{index=Math.min(states.length-1,index+1);eq(history.redo(),states[index]);}
  eq(history.value(),states[index]);
}
const branch = new TextHistory();branch.replace('A');branch.replace('B');eq(branch.undo(),'A');
branch.replace('A');eq(branch.redo(),'B');branch.undo();branch.replace('C');eq(branch.redo(),'C');

eq(minimumNotificationTime([2n,3n],5n),6n);
eq(minimumNotificationTime([],0n),0n);
eq(minimumNotificationTime([9007199254740993n],3n),27021597764222979n);
throws(()=>minimumNotificationTime([],1n));throws(()=>minimumNotificationTime([0n],1n));
throws(()=>minimumNotificationTime([1n],-1n));
for(let t=0;t<180;t++) {
  const times=Array.from({length:1+rnd(5)},()=>1+rnd(9)),target=rnd(30);
  let expected=0;while(times.reduce((sum,time)=>sum+Math.floor(expected/time),0)<target)expected++;
  eq(minimumNotificationTime(times.map(BigInt),BigInt(target)),BigInt(expected));
}
console.log('PASS: '+checks+' assertions across eight Stripe/Netflix worked solutions.');
})()
`;
await vm.runInNewContext(code + '\n' + tests, { assert, console }, { timeout: 30000 });
console.log(`Executed ${blocks.length} TypeScript blocks directly from Markdown (runtime checks only).`);
