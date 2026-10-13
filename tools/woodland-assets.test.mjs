import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=new URL('../assets/woodland/',import.meta.url),library=JSON.parse(fs.readFileSync(new URL('library.json',root)));
const context=vm.createContext({console,Math});vm.runInContext(fs.readFileSync(new URL('../assets/woodland-renderer.js',import.meta.url),'utf8'),context);

test('imported files match the native authoring receipts and retain their actual species',()=>{
 assert.equal(library.plants.length,7);assert.equal(new Set(library.plants.map(p=>p.id)).size,7);
 for(const p of library.plants){const dir=new URL(p.id+'/',root),m=JSON.parse(fs.readFileSync(new URL('manifest.json',dir)));
  assert.equal(p.species,m.species);assert.equal(p.sourceFingerprint,m.sourceFingerprint);assert.equal(m.rootsIncluded,false);assert.equal(m.upAxis,'Y');
  for(const [name,receipt]of Object.entries(m.files)){const b=fs.readFileSync(new URL(name,dir));assert.equal(b.length,receipt.bytes,name);assert.equal(createHash('sha256').update(b).digest('hex'),receipt.sha256,name);}
  assert(p.scale>0&&Number.isFinite(p.scale));assert.equal(p.season,m.dormantFoliage/m.peakFoliage);
  assert.equal(p.lods.length,2);
  for(const [i,lod]of p.lods.entries()){const mesh=JSON.parse(fs.readFileSync(new URL(lod.file,dir)));
   assert.equal(mesh.triangles,lod.triangles);assert(mesh.triangles<=(i?64:500));assert.equal(mesh.wood.indices.length/3+mesh.foliage.indices.length/3,mesh.triangles);
   assert([...mesh.wood.positions,...mesh.foliage.positions].flat().every(Number.isFinite));}
 }
});

test('directional image rows contain all azimuths, elevations and seasons in runtime order',()=>{
 for(const p of library.plants){const m=JSON.parse(fs.readFileSync(new URL(p.id+'/manifest.json',root))),a=m.impostor,stride=a.tileSize+2*a.padding;
  assert.equal(a.tiles.length,48);
  a.tiles.forEach((t,i)=>{assert.deepEqual(t.rect,[(i%8)*stride+a.padding,Math.floor(i/8)*stride+a.padding,a.tileSize,a.tileSize]);assert.equal(t.season,i<24?'leafy':'dormant');assert(Math.abs(t.azimuth-(i%8)*Math.PI/4)<1e-8);assert(Math.abs(t.elevation-(Math.floor(i/8)%3)*35*Math.PI/180)<1e-8);});
 }
});

test('the packed runtime atlases retain their checksums and complete bank dimensions',()=>{
 for(const [name,receipt]of Object.entries(library.atlasFiles)){const b=fs.readFileSync(new URL(name,root));assert.equal(b.length,receipt.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),receipt.sha256);
  assert.equal(b.readUInt32BE(16),library.atlas.columns*library.atlas.bankSize);assert.equal(b.readUInt32BE(20),Math.ceil(library.plants.length/library.atlas.columns)*library.atlas.bankSize);}
});

test('distance transitions preserve full coverage and stay continuous at both tier boundaries',()=>{
 for(let pixels=0;pixels<=150;pixels+=.125){const w=context.CastleWoodland.weights(pixels);assert(w.every(v=>v>=0&&v<=1));assert(Math.abs(w.reduce((a,b)=>a+b,0)-1)<1e-12);}
 for(const boundary of [10,14,48,64]){const a=context.CastleWoodland.weights(boundary-.00001),b=context.CastleWoodland.weights(boundary+.00001);assert(a.every((v,i)=>Math.abs(v-b[i])<.00001));}
 assert.equal(context.CastleWoodland.weights(0)[0],1);assert.equal(context.CastleWoodland.weights(150)[2],1);
});

test('clearing changes only the native instance and invalidates its detailed presentation',()=>{
 const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),code=source.slice(source.indexOf('function showTree('),source.indexOf('\nfunction clearLandAt('));
 const t={x:1,z:2,k:'dec',v:.5,s:1,cut:false},m={instanceMatrix:{}},entry={m,ci:3,shown:true},G={treeInstances:new WeakMap([[t,entry]]),woodland:{dirty:false},feat:true},calls=[],features=[];
 const c=vm.createContext({G,setInst:(...a)=>calls.push(a),hAt:()=>12,treeSX:()=>1,treeSY:()=>1,treeSZ:()=>1,featTree:(_t,delta)=>features.push(delta)});vm.runInContext(code,c);c.showTree(t,false);
 assert.equal(entry.shown,false);assert.equal(G.woodland.dirty,true);assert.equal(m.instanceMatrix.needsUpdate,true);assert.deepEqual(features,[-1]);assert.equal(calls[0][1],3);assert.deepEqual(calls[0].slice(-3),[.001,.001,.001]);assert.equal(t.cut,false);
});

test('the preview control changes appearance in place and keeps the realm link',async()=>{
 const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),code=source.slice(source.indexOf('async function setGrownTrees('),source.indexOf('\nfunction treeGeom('));
 const button={dataset:{},textContent:'',disabled:false},G={},W={treeSpots:{dec:[],pine:[],small:[]}},location={href:'https://game.test/?other=keep#s=1001&f=42&c=sea&y=1066'};
 const c=vm.createContext({G,W,location,URL,document:{getElementById:()=>button},console:{warn(){}},history:{replaceState:(_a,_b,url)=>{location.href=url;}},THREE:{},scene:{},camera:{},renderer:{},SIZE:9,hash01:()=>.5,
  CastleWoodland:{load:async()=>({}),create:()=>({active:true,setEnabled(on){this.active=on;}})}});
 vm.runInContext(code,c);await c.setGrownTrees(true);assert.equal(button.textContent,'Use original trees');assert.equal(new URL(location.href).searchParams.get('woodland'),'1');
 await c.setGrownTrees(false);assert.equal(button.textContent,'Preview grown trees');assert.equal(new URL(location.href).searchParams.has('woodland'),false);assert.equal(new URL(location.href).searchParams.get('other'),'keep');assert.equal(new URL(location.href).hash,'#s=1001&f=42&c=sea&y=1066');assert.equal(button.disabled,false);
});

test('a missing asset leaves the preview button usable and explains that it can be retried',async()=>{
 const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),code=source.slice(source.indexOf('async function setGrownTrees('),source.indexOf('\nfunction treeGeom(')),button={dataset:{},disabled:false};
 const c=vm.createContext({G:{},THREE:{},document:{getElementById:()=>button},console:{warn(){}},CastleWoodland:{load:async()=>{throw Error('missing library');}}});
 vm.runInContext(code,c);await c.setGrownTrees(true);assert.equal(button.disabled,false);assert.match(button.textContent,/unavailable.*retry/);assert.match(button.title,/could not be loaded/);assert.equal(c.G.woodland,undefined);
});
