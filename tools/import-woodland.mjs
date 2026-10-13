#!/usr/bin/env node
// Import finished woodland exports, never the growth engine. Preserve the source receipts.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.resolve(process.argv[2]||'../forestmodeler/web/assets/woodland-aa');
const dest=path.resolve(process.argv[3]||path.join(root,'assets/woodland'));
if(fs.existsSync(dest))throw Error('Choose a fresh destination; imported assets are not silently overwritten.');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const library=read(path.join(source,'library.json'));
if(library.format!=='gardenplans.woodland-library'||library.version!==1||!library.plants.length)throw Error('Unsupported or empty woodland library');
const roles={oak:['dec',9.96],birch:['small',6.15],fir:['pine',8.6],larch:['pine',8.6]};
const plants=[];
// Validate everything before creating the game directory.
for(const row of library.plants){
 const dir=path.dirname(path.join(source,row.manifest)),m=read(path.join(dir,'manifest.json')),a=m.impostor;
 if(m.format!=='gardenplans.woodland'||m.version!==1||m.upAxis!=='Y'||m.rootsIncluded||!roles[row.key])throw Error('Unsupported woodland source '+row.id);
 for(const [file,receipt] of Object.entries(m.files)){const bytes=fs.readFileSync(path.join(dir,file));if(createHash('sha256').update(bytes).digest('hex')!==receipt.sha256)throw Error('Asset receipt mismatch: '+file);}
 if(a.tiles.length!==48||a.size[0]!==a.size[1])throw Error('Expected the complete 8×3×2 directional grid');
 const stride=a.tileSize+2*a.padding;
 a.tiles.forEach((t,i)=>{const expected=[(i%8)*stride+a.padding,Math.floor(i/8)*stride+a.padding,a.tileSize,a.tileSize];
  if(JSON.stringify(t.rect)!==JSON.stringify(expected)||t.season!==(i<24?'leafy':'dormant')||Math.abs(t.azimuth-(i%8)*Math.PI/4)>1e-8||Math.abs(t.elevation-(Math.floor(i/8)%3)*35*Math.PI/180)>1e-8)throw Error('Unexpected atlas ordering');});
 const lods=m.lods.map((lod,i)=>{const mesh=read(path.join(dir,lod.file));if(mesh.triangles>lod.budget||mesh.triangles>(i?64:500))throw Error('Mesh exceeds game budget');return{file:lod.file,texture:mesh.foliageTexture,triangles:mesh.triangles};});
 const [role,height]=roles[row.key],scale=height/a.bounds[1][1];
 plants.push({id:row.id,role,species:m.species,seed:m.seed,sourceFingerprint:m.sourceFingerprint,scale,season:m.dormantFoliage/m.peakFoliage,
  wood:m.materials.wood.colour,lods,atlas:{centre:a.centre,radius:a.radius,size:a.size[0],tileSize:a.tileSize,padding:a.padding,colour:a.colour,normal:a.normal,depth:a.depth},dir,manifest:m});
}
fs.mkdirSync(dest,{recursive:true});
for(const p of plants){
 const target=path.join(dest,p.id);fs.mkdirSync(target);
 for(const name of ['manifest.json',...Object.keys(p.manifest.files)])fs.copyFileSync(path.join(p.dir,name),path.join(target,name));
 delete p.dir;delete p.manifest;
}
fs.writeFileSync(path.join(dest,'library.json'),JSON.stringify({format:'castle.woodland',version:1,source:'healdgar/forestmodeler',sourceCommit:'dbcbce43db701018db4908262ab316b20fa1bbc0',
 note:'North American native genomes, used as a rendering trial. Uniform display scaling preserves the existing game tree heights; it is not a biological age or species claim.',
 atlas:{columns:4,bankSize:plants[0].atlas.size,tileSize:plants[0].atlas.tileSize,padding:plants[0].atlas.padding,colour:'colour.png',normal:'normal.png',depth:'depth.png'},plants},null,2)+'\n');
execFileSync(process.env.WOODLAND_PYTHON||'python3',[path.join(root,'tools/pack-woodland.py'),dest],{stdio:'inherit'});
const game=read(path.join(dest,'library.json'));game.atlasFiles=Object.fromEntries(['colour.png','normal.png','depth.png'].map(name=>{const b=fs.readFileSync(path.join(dest,name));return[name,{bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')}];}));
fs.writeFileSync(path.join(dest,'library.json'),JSON.stringify(game,null,2)+'\n');
console.log('Imported '+plants.length+' grown individuals into '+dest);
