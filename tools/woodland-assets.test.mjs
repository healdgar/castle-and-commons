import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {woodlandFiles,scriptSafe} from './embed-woodland.mjs';
const root=new URL('../assets/woodland/',import.meta.url),library=JSON.parse(fs.readFileSync(new URL('library.json',root)));
const context=vm.createContext({console,Math});vm.runInContext(fs.readFileSync(new URL('../assets/woodland-renderer.js',import.meta.url),'utf8'),context);

test('single-file releases contain the current renderer and every finished asset it loads',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const data=html.match(/<script type="text\/plain" id="woodlandassets">([\s\S]*?)<\/script>/),renderer=html.match(/<script id="woodlandrenderer">\n([\s\S]*?)\n<\/script>/);
 assert(data&&renderer,'run node tools/embed-woodland.mjs before releasing');
 assert.equal(renderer[1],scriptSafe(fs.readFileSync(new URL('../assets/woodland-renderer.js',import.meta.url),'utf8')));
 const files=JSON.parse(data[1]);assert.equal(JSON.stringify(files),JSON.stringify(woodlandFiles()));
 for(const [name,body]of Object.entries(files))assert.equal((name.endsWith('.png')?Buffer.from(body.split(',')[1],'base64'):Buffer.from(body)).compare(fs.readFileSync(new URL(name,root))),0,name);
 assert(!html.includes('<script src="assets/woodland-renderer.js">'),'the preview must not need a separately published script');
});

test('an incomplete embedded release reports the missing asset instead of fetching another host',async()=>{
 let fetched=false;
 const c=vm.createContext({console,Math,AbortController,setTimeout,clearTimeout,document:{getElementById:()=>({textContent:'{}'})},fetch:()=>{fetched=true;throw Error('External assets are unavailable');}});
 vm.runInContext(fs.readFileSync(new URL('../assets/woodland-renderer.js',import.meta.url),'utf8'),c);
 await assert.rejects(c.CastleWoodland.load({THREE:{}}),/Missing embedded woodland asset: library.json/);assert.equal(fetched,false);
});

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
  assert.equal(b.readUInt32BE(16),library.atlas.width);assert.equal(b.readUInt32BE(20),library.atlas.height);}
});

test('populated view banks fit without overlap and every tree uses its own bounded 3D volume',()=>{
 const boxes=[];
 for(const p of library.plants){const [x,y]=p.atlas.origin,[width,height]=p.atlas.packedSize;assert(x>=0&&y>=0&&x+width<=library.atlas.width&&y+height<=library.atlas.height);
  assert.equal(height,6*(p.atlas.tileSize+2*p.atlas.padding));
  for(const [a,b,w,h]of boxes)assert(x+width<=a||a+w<=x||y+height<=b||b+h<=y,'atlas banks overlap');boxes.push([x,y,width,height]);
  assert.equal(p.representation,'volume');assert(p.atlas.tileSize>=96);
   for(const [i,file]of [p.volume,p.middleVolume].entries()){const v=JSON.parse(fs.readFileSync(new URL(p.id+'/'+file,root))),native=JSON.parse(fs.readFileSync(new URL(p.id+'/'+p.lods[i].file,root)));
    const wood=i&&p.middleWood?JSON.parse(fs.readFileSync(new URL(p.id+'/'+p.middleWood,root))):native.wood;
    assert.equal(v.indices.length/3,v.triangles);assert(v.triangles<=(i?12:36));assert(wood.indices.length/3+v.triangles<=(i?64:500));assert(v.positions.flat().every(Number.isFinite));}
 }
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

test('near and middle pools share initialized instance colours and copy each promoted tree’s brightness variation',()=>{
 class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this;}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}normalize(){return this;}dot(v){return this.x*v.x+this.y*v.y+this.z*v.z;}distanceToSquared(){return 100;}length(){return Math.hypot(this.x,this.y,this.z);}toArray(){return[this.x,this.y,this.z];}}
 class Color{constructor(r=1,g=1,b=1){this.r=r;this.g=g;this.b=b;}setRGB(r,g,b){this.r=r;this.g=g;this.b=b;return this;}copy(c){return this.setRGB(c.r,c.g,c.b);}multiplyScalar(s){return this.setRGB(this.r*s,this.g*s,this.b*s);}}
 class Matrix4{constructor(){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,10,1];}multiplyMatrices(){return this;}}
 class InstancedBufferAttribute{constructor(array,itemSize){this.array=array;this.itemSize=itemSize;this.needsUpdate=false;}setX(i,x){this.array[i]=x;}setXY(i,x,y){this.array[i*2]=x;this.array[i*2+1]=y;}setXYZW(i,x,y,z,w){this.array.set([x,y,z,w],i*4);}}
 class InstancedMesh{constructor(g,m,count){this.geometry=g;this.material=m;this.count=count;this.userData={};this.instanceMatrix=new InstancedBufferAttribute(new Float32Array(count*16),16);for(let i=0;i<count;i++)this.instanceMatrix.array.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,10,1],i*16);this.instanceColor=null;}getMatrixAt(i,m){m.elements=Array.from(this.instanceMatrix.array.slice(i*16,i*16+16));}setMatrixAt(i,m){this.instanceMatrix.array.set(m.elements,i*16);}setColorAt(i,c){if(!this.instanceColor)this.instanceColor=new InstancedBufferAttribute(new Float32Array(this.instanceMatrix.array.length/16*3),3);this.instanceColor.array.set([c.r,c.g,c.b],i*3);}}
 function Geom(){this.attributes={};this.setAttribute=(k,v)=>this.attributes[k]=v;this.clone=()=>new Geom();}
 const geom=()=>new Geom(),THREE={Vector3,Vector2:class{},Color,Matrix4,Frustum:class{setFromProjectionMatrix(){}intersectsSphere(){return true;}},Sphere:class{constructor(){this.center=new Vector3();}},Box3:class{expandByPoint(){}getBoundingSphere(s){return s;}},InstancedBufferAttribute,InstancedMesh,PlaneGeometry:Geom,MeshLambertMaterial:class{},ShaderMaterial:class{},UniformsUtils:{merge:()=>({})},UniformsLib:{lights:{},fog:{}},DoubleSide:2};
 const row={id:'oak',role:'dec',variant:0,season:.25,wood:[.3,.2,.1],centre:new Vector3(0,4,0),radius:3,atlas:{origin:[0,0],tileSize:96,padding:2},tiers:[{wood:geom(),foliage:geom()},{wood:geom(),foliage:geom()}],volumeTiers:[geom(),geom()],volume:geom()};
 const spot={x:0,z:10,k:'dec',v:.75,s:1,cut:false},oldMesh=new InstancedMesh(geom(),{},1),G={treeInstances:new WeakMap([[spot,{m:oldMesh,ci:0,shown:true}]]),treeChunks:[oldMesh],seasonU:{uLeafless:{value:0},uDormancy:{value:0}},sun:{position:new Vector3(0,10,0),target:{position:new Vector3()},color:new Color(),intensity:1},hemi:{color:new Color(),groundColor:new Color(),intensity:1},amb:{color:new Color(),intensity:1}};
 const c=vm.createContext({console,Math,performance:{now:()=>0}});vm.runInContext(fs.readFileSync(new URL('../assets/woodland-renderer.js',import.meta.url),'utf8'),c);
 const w=c.CastleWoodland.create({THREE,library:{plants:[row],atlas:[{image:{width:64,height:64}},{},{}],atlasSpec:{}},scene:{add(){},remove(){}},camera:{position:new Vector3(0,0,0),fov:45,projectionMatrix:new Matrix4(),matrixWorldInverse:new Matrix4(),getWorldDirection:d=>d.copy(new Vector3(0,0,1))},renderer:{capabilities:{isWebGL2:true},domElement:{clientHeight:800}},G,spots:{dec:[spot],pine:[],small:[]},size:100,hash:()=>0});
 assert.ok(row.near[0].instanceColor);assert.equal(row.near[1].instanceColor,row.near[0].instanceColor);assert.equal(row.middle[1].instanceColor,row.middle[0].instanceColor);
 w.update(1,true);assert.equal(w.near,1);assert(Math.abs(row.near[1].instanceColor.array[1]-(.9+spot.v*.12))<1e-6);assert.equal(row.near[0].instanceColor.needsUpdate,true);
});

