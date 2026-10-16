// Run from any directory; requires Node.js 22.13+ for the original TS example checker.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url)), root=resolve(here,'../..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const docs=read('google/solutions/Coding-Answers.md');
const sourcePaths=['google/android-studio-tech-lead/coding-solutions.mjs','google/solutions/general-coding.mjs'];
const ids=new Set();let blocks=0;
for(const path of sourcePaths){const source=read(path),matches=[...source.matchAll(/^\/\/ (\d+|Helper):/gm)];
 for(let i=0;i<matches.length;i++){
  const match=matches[i],block=source.slice(match.index,matches[i+1]?.index??source.length).trim();
  assert.ok(docs.includes('```js\n'+block+'\n```'),`Guide code differs from runnable source: ${path}, ${match[1]}`);
  blocks++;if(match[1]!=='Helper'){assert.ok(!ids.has(match[1]),`Duplicate solution ${match[1]}`);ids.add(match[1]);}
 }
}
assert.equal(ids.size,44);assert.equal(blocks,46);
const bank=read('google/rounds/01-DSA-Coding-Questions-and-Solutions.md');
const rows=bank.split('\n').filter(line=>/^\| \d+ \|/.test(line));
assert.equal(rows.length,43,'Every general bank entry must be present');
for(const row of rows)assert.match(row,/\]\((?:\.\.\/solutions\/Coding-Answers\.md#lc-\d+|#bank-\d+)\)/,'Every bank row needs a local solution link');
const track=read('google/android-studio-tech-lead/01-Coding-Track.md');
assert.equal((track.match(/\]\(\.\.\/solutions\/Coding-Answers\.md#lc-\d+\)/g)??[]).length,16);
function markdownFiles(directory){return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?markdownFiles(resolve(directory,entry.name)):entry.name.endsWith('.md')?[resolve(directory,entry.name)]:[]);}
function anchors(text){const result=new Set(),counts=new Map();
 for(const match of text.matchAll(/<a\s+id="([^"]+)"/g))result.add(match[1]);
 for(const match of text.matchAll(/^#{1,6} (.+)$/gm)){
  const base=match[1].toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,'').replace(/ /g,'-');
  const count=counts.get(base)??0;counts.set(base,count+1);result.add(count?`${base}-${count}`:base);
 }return result;
}
let links=0;
for(const file of markdownFiles(resolve(root,'google'))){const text=readFileSync(file,'utf8');assert.equal((text.match(/^```/gm)??[]).length%2,0,`Unbalanced fence: ${file}`);
 for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
  const link=match[1];if(/^[a-z]+:/i.test(link))continue;
  const [path,anchor]=link.split('#'),target=path?resolve(dirname(file),path):file;
  let content;try{content=readFileSync(target,'utf8');}catch(error){throw new Error(`Missing link in ${file}: ${link}`,{cause:error});}
  if(anchor&&extname(target)==='.md')assert.ok(anchors(content).has(decodeURIComponent(anchor)),`Missing anchor in ${file}: ${link}`);
  links++;
 }
}
console.log(`PASS: 44 complete JS answers, 43 general-bank links, 16 role links, ${links} local links and synchronized code blocks.`);
for(const relative of ['google/android-studio-tech-lead/coding-solutions.test.mjs','google/solutions/general-coding.test.mjs','examples/check-agoda-google-examples.mjs']){
 const result=spawnSync(process.execPath,[resolve(root,relative)],{cwd:root,stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
