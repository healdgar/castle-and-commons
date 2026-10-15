// The real world codec, in a tiny controlled world: no generation or replacement
// serializer. This checks saved dependency identity, not paid completion.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {inlineGameScript,contextFor} from './simulation-boundary.mjs';
const source=inlineGameScript(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
const identity='c'.repeat(64),read=(c,s)=>vm.runInContext(s,c);
test('world save retains the actual commissioned prerequisite through damage, repair and replacement',async()=>{
 const c=contextFor(source,'#s=1001&f=42&c=sea&y=1200');
 read(c,`SEED=1001;FATE=42;START_AD=1200;RS=seedStreams(SEED,FATE);
 W={name:'Dependency test',clock:{day:37},startAD:1200,settlements:[],houses:[{name:'The Crown',gold:1000}],households:new Map(),notables:[],armies:[],roads:[],projects:[],petitions:[],treasury:2000};
 const s={name:'Testford',pos:{x:0,z:0},owner:0,pop:2,stores:{grain:0},folk:[],buildings:[]};W.settlements.push(s);W.capital=s;
 const C=compoundEnsure(s,'castle',0),b={idx:0,s,arch:'hall',compoundKey:'hall',state:'sound',ownerId:'lord',title:propertyRightsResolve('lord')};s.buildings.push(b);W.bldList=[b];
 const component=compoundBindBuilding(C,b,['residential']);W.projects.push({type:'compound',compoundId:C.id,ownerId:0,requires:[{key:'hall',purpose:'residential'}],prerequisites:[{component,object:b,key:'hall',purpose:'residential'}],paid:8,materialPaid:3,worked:2});
 b.state='ruin';`);
 const save=c=>read(c,`worldSave({sourceSHA256:${JSON.stringify(identity)}})`),doc=await save(c),loaded=contextFor(source,'#s=1001&f=42&c=sea&y=1200');loaded.__doc=doc;
 await read(loaded,`worldLoad(__doc,{sourceSHA256:${JSON.stringify(identity)}})`);assert.deepEqual(await save(loaded),doc,'same source re-saves byte for byte');
 assert.equal(read(loaded,`(()=>{const q=W.projects[0],C=W.capital.compounds[0],R=q.prerequisites[0];return R.component===C.components[0]&&R.object===W.bldList[0]&&R.object===W.capital.buildings[0]})()`),true);
 const check=`compoundPrerequisiteCheck(W.projects[0],W.capital,W.capital.compounds[0])`;
 assert.equal(read(loaded,check+'.reason'),'capability-prerequisite');
 read(loaded,'W.bldList[0].state="sound"');assert.equal(read(loaded,check+'.ok'),true);
 read(loaded,'W.bldList[0]={...W.bldList[0]}');assert.equal(read(loaded,check+'.abandon'),true);assert.equal(read(loaded,check+'.reason'),'component-prerequisite-lost');
 assert.equal(read(loaded,'W.projects[0].paid+W.projects[0].materialPaid'),11);
});
