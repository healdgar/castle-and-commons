/* Grown woodland presentation only. Native positions, clearings and the simulation are owned by the game.
   Whole-tree directional images are instanced; detailed meshes have fixed global budgets. */
(()=>{
'use strict';
const LIMITS={near:256,middle:2048};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function weights(pixels){const far=clamp((14-pixels)/4,0,1),near=clamp((pixels-48)/16,0,1);return[far,1-far-near,near];}
const COVER=`
varying vec2 vCover;
float woodlandDither(){vec2 p=mod(floor(gl_FragCoord.xy),4.);return (mod(p.x+p.y*2.,4.)*4.+mod(p.y+p.x*2.,4.)+.5)/16.;}
void woodlandCut(){float d=woodlandDither();if(d<vCover.x||d>=vCover.y)discard;}
`;
const VERTEX=`
attribute vec2 aCover;attribute vec4 aTile;attribute vec4 aShape;attribute float aPlant;varying vec4 vView,vShape;varying vec4 vTile;
varying vec4 vFrame0,vFrame1,vFrame2,vInfo;
uniform vec3 uLightDirection;
#include <common>
#include <shadowmap_pars_vertex>
void main(){
 mat4 frame=modelMatrix*instanceMatrix;
 vec3 centre=(frame*vec4(aShape.xyz,1.)).xyz;
 #ifdef WOODLAND_SHADOW
 vec3 delta=uLightDirection;
 #else
 vec3 delta=cameraPosition-centre;
 #endif
 vec3 eye=normalize(vec3(dot(delta,frame[0].xyz)/dot(frame[0].xyz,frame[0].xyz),dot(delta,frame[1].xyz)/dot(frame[1].xyz,frame[1].xyz),dot(delta,frame[2].xyz)/dot(frame[2].xyz,frame[2].xyz)));
 float az=atan(eye.z,eye.x);vec3 right=vec3(sin(az),0.,-cos(az)),up=normalize(cross(eye,right));
 #ifdef WOODLAND_VOLUME
 vec3 p=position;
 #else
 vec3 p=aShape.xyz+aShape.w*((uv.x*2.-1.)*right+(uv.y*2.-1.)*up);
 #endif
 vec4 worldPosition=frame*vec4(p,1.),mvPosition=viewMatrix*worldPosition;
 gl_Position=projectionMatrix*mvPosition;
 vView=vec4(uv,az,asin(clamp(eye.y,-1.,1.)));vShape=aShape;vTile=aTile;vInfo=vec4(aCover,-mvPosition.z,aPlant+.1);
 #ifdef WOODLAND_VOLUME
 vView=vec4(p,1.);
 #endif
 #ifdef USE_INSTANCING_COLOR
 vInfo.w=aPlant+instanceColor.g*.1;
 #endif
 vFrame0=vec4(frame[0].xyz,frame[3].x);vFrame1=vec4(frame[1].xyz,frame[3].y);vFrame2=vec4(frame[2].xyz,frame[3].z);
 vec3 transformedNormal=normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz);
 #include <shadowmap_vertex>
}
`;
const SAMPLE=`
varying vec4 vView,vShape;varying vec4 vTile;
varying vec4 vFrame0,vFrame1,vFrame2,vInfo;
uniform sampler2D uColour,uNormal,uDepth;
uniform vec2 uAtlasSize;uniform float uLeafless;
uniform mat4 projectionMatrix;
float woodlandDither(){vec2 p=mod(floor(gl_FragCoord.xy),4.);return (mod(p.x+p.y*2.,4.)*4.+mod(p.y+p.x*2.,4.)+.5)/16.;}
vec2 tileUV(vec2 q,float tile){float stride=vTile.z+2.*vTile.w;vec2 origin=vTile.xy;return vec2((origin.x+mod(tile,8.)*stride+vTile.w+q.x*vTile.z)/uAtlasSize.x,1.-(origin.y+floor(tile/8.)*stride+vTile.w+q.y*vTile.z)/uAtlasSize.y);}
bool validUV(vec2 q){return q.x>=0.&&q.y>=0.&&q.x<=1.&&q.y<=1.;}
// Leaf clusters bud and shed in object space. They stay opaque and keep their
// pattern as the camera moves; neither screen-door noise nor a whole-tree fade.
float clusterHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float clusterRank(vec3 p){
 vec3 q=p*9.+vec3(vFrame0.w,0.,vFrame2.w)*.017,i=floor(q),f=fract(q);f=f*f*(3.-2.*f);
 return mix(mix(mix(clusterHash(i),clusterHash(i+vec3(1.,0.,0.)),f.x),mix(clusterHash(i+vec3(0.,1.,0.)),clusterHash(i+vec3(1.,1.,0.)),f.x),f.y),
            mix(mix(clusterHash(i+vec3(0.,0.,1.)),clusterHash(i+vec3(1.,0.,1.)),f.x),mix(clusterHash(i+vec3(0.,1.,1.)),clusterHash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
void woodlandSample(out vec3 albedo,out vec3 normal,out vec3 hit,out float coverage,out float leaf){
 #ifdef WOODLAND_VOLUME
 vec3 delta=cameraPosition-vec3(vFrame0.w,vFrame1.w,vFrame2.w);
 vec3 localCamera=vec3(dot(delta,vFrame0.xyz)/dot(vFrame0.xyz,vFrame0.xyz),dot(delta,vFrame1.xyz)/dot(vFrame1.xyz,vFrame1.xyz),dot(delta,vFrame2.xyz)/dot(vFrame2.xyz,vFrame2.xyz));
 vec3 eye=normalize(localCamera-vView.xyz),start=(vView.xyz-vShape.xyz)/vShape.w;
 float az=atan(eye.z,eye.x),elevation=asin(clamp(eye.y,-1.,1.));
 #else
 float az=vView.z,elevation=vView.w;vec3 eye=vec3(cos(elevation)*cos(az),sin(elevation),cos(elevation)*sin(az));if(az<0.)az+=6.283185307;
 vec3 right=vec3(sin(az),0.,-cos(az)),up=normalize(cross(eye,right));
 vec3 start=(vView.x*2.-1.)*right+(vView.y*2.-1.)*up;
 #endif
 if(az<0.)az+=6.283185307;
 float ap=az/0.785398163,al=floor(ap),aw=fract(ap),ep=clamp(asin(clamp(eye.y,-1.,1.))/0.610865238,0.,2.),el=floor(min(ep,1.99999)),ew=ep-el;
 albedo=vec3(0.);normal=vec3(0.);hit=vec3(0.);coverage=0.;leaf=0.;
 float loss=uLeafless*(1.-mod(floor(floor(vInfo.w)/16.),2.));
 #ifdef WOODLAND_SHADOW
 // One fixed light-facing sample suffices for a caster; never pay for beauty blending in the shadow map.
 al=floor(ap+.5);aw=0.;el=floor(ep+.5);ew=0.;
 #endif
 for(int i=0;i<4;i++){
  float ai=mod(al+float(i-i/2*2),8.),ei=el+float(i/2),w=(i-i/2*2==0?1.-aw:aw)*(i/2==0?1.-ew:ew);if(w<=0.0001)continue;
  for(int season=0;season<2;season++){
   if(season==0&&loss>=.9999||season==1&&loss<=.0001)continue;
   float a=ai*.785398163,e=ei*.610865238,tile=float(season)*24.+ei*8.+ai;
   vec3 se=vec3(cos(e)*cos(a),sin(e),cos(e)*sin(a)),sr=vec3(sin(a),0.,-cos(a)),su=cross(se,sr);
   vec3 p=start;vec2 q=vec2(0.),lastQ=vec2(0.);vec4 d=vec4(0.);float hasHit=0.;
   for(int j=0;j<3;j++){
    q=vec2(.5+.5*dot(p,sr),.5-.5*dot(p,su));if(!validUV(q))break;
    vec4 next=texture2D(uDepth,tileUV(q,tile));if(next.a<.1)break;d=next;lastQ=q;hasHit=1.;
    float depth=(d.r*255.*256.+d.g*255.)/65535.;float den=dot(eye,se);if(abs(den)<.05)break;
    p=start+eye*((1.-2.*depth-dot(start,se))/den);
   }
   // A neighbouring projection can land on a different branch. Reject rays
   // outside the baked sphere instead of painting a streak across the volume.
   if(hasHit<.5)continue;
   #ifdef WOODLAND_VOLUME
   vec2 projected=vec2(.5+.5*dot(p,sr),.5-.5*dot(p,su));
   if(length(p)>1.03||length(projected-lastQ)>2./vTile.z)continue;
   #endif
   // When a leafy cluster sheds, reveal the actual dormant branch surface
   // along this ray. Never blend its depth into the former leaf's depth.
   if(season==0&&d.b>.5&&loss>clusterRank(p))continue;
   vec2 uv=tileUV(lastQ,tile);vec4 colour=texture2D(uColour,uv);float c=colour.a*w;
   if(colour.a<.1)continue;
   albedo+=colour.rgb*c;normal+=(texture2D(uNormal,uv).rgb*2.-1.)*c;hit+=p*c;leaf+=d.b*c;coverage+=c;break;
  }
 }
 if(coverage<.1)discard;albedo/=coverage;leaf/=coverage;
 normal=length(normal)>.001?normalize(normal):vec3(0.,1.,0.);
 hit=vShape.xyz+vShape.w*hit/coverage;
}
vec3 woodlandWorld(vec3 p){return vec3(vFrame0.w,vFrame1.w,vFrame2.w)+vFrame0.xyz*p.x+vFrame1.xyz*p.y+vFrame2.xyz*p.z;}
float woodlandDepth(vec3 p){vec4 clip=projectionMatrix*viewMatrix*vec4(woodlandWorld(p),1.);return .5+.5*clip.z/clip.w;}
`;
const FRAGMENT=`
#include <common>
#include <packing>
uniform bool receiveShadow;
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
uniform vec3 uLightDirection,uSunColour,uSkyColour,uGroundColour,uAmbientColour,fogColor;
uniform float fogNear,fogFar,uAutumn;
${SAMPLE}
#ifdef WOODLAND_VOLUME
#if NUM_DIR_LIGHT_SHADOWS > 0
uniform mat4 directionalShadowMatrix[NUM_DIR_LIGHT_SHADOWS];
#endif
float volumeShadow(vec3 world){
 float shadow=1.;
 #if NUM_DIR_LIGHT_SHADOWS > 0
 DirectionalLightShadow light=directionalLightShadows[0];
 if(receiveShadow)shadow=getShadow(directionalShadowMap[0],light.shadowMapSize,light.shadowBias,light.shadowRadius,directionalShadowMatrix[0]*vec4(world,1.));
 #endif
 return shadow;
}
#endif
void main(){
 float d=woodlandDither();if(d<vInfo.x||d>=vInfo.y)discard;
 vec3 albedo,normal,hit;float coverage,leaf;woodlandSample(albedo,normal,hit,coverage,leaf);
 // Retain the established broadleaf palette. Conifers decode native sRGB
 // before lighting, with the same selection in their distant representation.
 if(vInfo.w>=32.)albedo=mix(albedo/12.92,pow((albedo+.055)/1.055,vec3(2.4)),step(vec3(.04045),albedo));
 vec3 wn=normalize(vFrame0.xyz*normal.x/dot(vFrame0.xyz,vFrame0.xyz)+vFrame1.xyz*normal.y/dot(vFrame1.xyz,vFrame1.xyz)+vFrame2.xyz*normal.z/dot(vFrame2.xyz,vFrame2.xyz));
 albedo*=mix(vec3(1.),vec3(1.15,.7,.32),leaf*uAutumn*(1.-mod(floor(floor(vInfo.w)/16.),2.)))*fract(vInfo.w)*10.;
 #ifdef WOODLAND_VOLUME
 float shadow=volumeShadow(woodlandWorld(hit));
 #else
 float shadow=getShadowMask();
 #endif
 vec3 light=uAmbientColour+mix(uGroundColour,uSkyColour,wn.y*.5+.5)+uSunColour*max(0.,dot(wn,uLightDirection))*shadow;
 gl_FragColor=vec4(albedo*light,1.);
 #ifdef USE_FOG
 gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,smoothstep(fogNear,fogFar,vInfo.z));
 #endif
 #ifdef WRITE_DEPTH
 gl_FragDepthEXT=woodlandDepth(hit);
 #endif
}
`;
const DEPTH_FRAGMENT=`
#include <common>
#include <packing>
${SAMPLE}
void main(){vec3 albedo,normal,hit;float coverage,leaf;woodlandSample(albedo,normal,hit,coverage,leaf);
 float depth=woodlandDepth(hit);
 #ifdef WRITE_DEPTH
 gl_FragDepthEXT=depth;
 #else
 depth=gl_FragCoord.z;
 #endif
 gl_FragColor=packDepthToRGBA(depth);
}
`;

async function load({THREE:T,base='assets/woodland/',timeout=15000}){
 const embedded=typeof document!=='undefined'&&document.getElementById('woodlandassets'),files=embedded?JSON.parse(embedded.textContent):null;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout),textures=[],geometries=[];
 let failed=false;
 const asset=name=>{if(!Object.prototype.hasOwnProperty.call(files,name))throw Error('Missing embedded woodland asset: '+name);return files[name];};
 const json=async name=>{if(files)return JSON.parse(asset(name));const r=await fetch(base+name,{signal:controller.signal});if(!r.ok)throw Error('Woodland HTTP '+r.status+': '+name);return r.json();};
 const texture=name=>new Promise((resolve,reject)=>{
  const url=files?asset(name):base+name;
  const timer=setTimeout(()=>reject(Error('Woodland texture timed out: '+name)),timeout);
  new T.TextureLoader().load(url,t=>{clearTimeout(timer);if(failed){t.dispose();reject(Error('Woodland loading cancelled'));return;}textures.push(t);t.generateMipmaps=false;t.minFilter=t.magFilter=T.LinearFilter;resolve(t);},undefined,()=>{clearTimeout(timer);reject(Error('Missing woodland texture '+name));});
 });
 const geometry=(data,scale)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(data.positions.flat().map(v=>v*scale),3));g.setAttribute('normal',new T.Float32BufferAttribute(data.normals.flat(),3));g.setAttribute('uv',new T.Float32BufferAttribute(data.uvs.flat(),2));g.setIndex(data.indices);geometries.push(g);return g;};
 try{
  const library=await json('library.json');if(library.format!=='castle.woodland'||library.version!==1||!library.plants?.length||library.plants.length>12||['dec','pine','small'].some(role=>!library.plants.some(p=>p.role===role)))throw Error('Unsupported woodland library');
  const spec=library.atlas,atlas=await Promise.all([spec.colour,spec.normal,spec.depth].map(texture));
  for(const t of atlas.slice(1))t.minFilter=t.magFilter=T.NearestFilter;
  const plants=await Promise.all(library.plants.map(async (row,variant)=>{
   const dir=row.id+'/',a=row.atlas;
   const volumeTiers=row.representation==='volume'?await Promise.all([row.volume,row.middleVolume].map(async file=>geometry(await json(dir+file),row.scale))):[],volume=volumeTiers[0]||null;
   const tiers=await Promise.all(row.lods.map(async (lod,i)=>{const data=await json(dir+lod.file),wood=i&&row.middleWood?await json(dir+row.middleWood):data.wood,map=volume?null:await texture(dir+lod.texture);return{wood:geometry(wood,row.scale),foliage:volume?null:geometry(data.foliage,row.scale),map};}));
   return{...row,variant,centre:new T.Vector3(...a.centre).multiplyScalar(row.scale),radius:a.radius*row.scale,tiers,volume,volumeTiers};
  }));
  return{plants,atlas,atlasSpec:spec,dispose(){textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());}};
 }catch(error){failed=true;controller.abort();textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());throw error;}
 finally{clearTimeout(timer);}
}

function create({THREE:T,library,scene,camera,renderer,G,spots,size,hash}){
 const state={dirty:true,records:[],far:[],pools:[],near:0,middle:0,rebuilds:0,lastRebuildMs:0},matrix=new T.Matrix4(),projection=new T.Matrix4(),frustum=new T.Frustum(),point=new T.Vector3();
 const lighting={uLightDirection:{value:new T.Vector3(0,1,0)},uSunColour:{value:new T.Color()},uSkyColour:{value:new T.Color()},uGroundColour:{value:new T.Color()},uAmbientColour:{value:new T.Color()},uAutumn:{value:0}};
 const writeDepth=renderer.capabilities.isWebGL2||!!renderer.getContext().getExtension('EXT_frag_depth');
 const old=G.treeInstances,original=G.treeChunks,map=new WeakMap(),chunks=5,cs=size*1.4/chunks,cix=v=>clamp(Math.floor((v+size*.7)/cs),0,chunks-1);
 function meshMaterial(row,leaf){
  const m=new T.MeshLambertMaterial(leaf?{map:row.map,side:T.DoubleSide,alphaTest:.5}:{color:new T.Color(...row.wood)});
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,G.seasonU,lighting);sh.uniforms.uDormant={value:row.season};
   sh.vertexShader='attribute vec2 aCover;varying vec2 vCover;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvCover=aCover;');
   sh.fragmentShader=COVER+'uniform float uLeafless,uDormant,uAutumn;\n'+sh.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nwoodlandCut();'+(leaf?'if(woodlandDither()<uLeafless*(1.-uDormant))discard;':''));
   if(leaf)sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb*=mix(vec3(1.),vec3(1.15,.7,.32),uAutumn);');
  };m.customProgramCacheKey=()=>leaf?'woodland-leaf':'woodland-wood';return m;
 }
 const spec=library.atlasSpec,uniforms=T.UniformsUtils.merge([T.UniformsLib.lights,T.UniformsLib.fog]);
 Object.assign(uniforms,lighting,{uLeafless:G.seasonU.uLeafless,uAtlasSize:{value:new T.Vector2(library.atlas[0].image.width,library.atlas[0].image.height)},uColour:{value:library.atlas[0]},uNormal:{value:library.atlas[1]},uDepth:{value:library.atlas[2]}});
 // r128 takes shadowSide from the beauty material even with customDepthMaterial.
 // The light-facing card would otherwise be culled as a front face in the PCF pass.
 const material=new T.ShaderMaterial({uniforms,vertexShader:VERTEX,fragmentShader:FRAGMENT,lights:true,fog:true,shadowSide:T.DoubleSide,extensions:{fragDepth:writeDepth},defines:writeDepth?{WRITE_DEPTH:1}:{}});
 const volumeMaterial=new T.ShaderMaterial({uniforms,vertexShader:VERTEX,fragmentShader:FRAGMENT,lights:true,fog:true,side:T.DoubleSide,extensions:{fragDepth:writeDepth},defines:{WOODLAND_VOLUME:1,...(writeDepth?{WRITE_DEPTH:1}:{})}});
 const depth=new T.ShaderMaterial({uniforms,vertexShader:VERTEX,fragmentShader:DEPTH_FRAGMENT,extensions:{fragDepth:writeDepth},defines:{WOODLAND_SHADOW:1,...(writeDepth?{WRITE_DEPTH:1}:{})},side:T.DoubleSide});
 const plants=library.plants.map(row=>{
  row.near=[];row.middle=[];
  for(let tier=0;tier<2;tier++){
   const limit=tier?LIMITS.middle:LIMITS.near,source=row.tiers[tier],volume=row.volumeTiers?.[tier],cover=new T.InstancedBufferAttribute(new Float32Array(limit*2),2),pool=[];
   for(const leaf of [false,true]){const g=(leaf?(volume||source.foliage):source.wood).clone();g.setAttribute('aCover',cover);
    if(volume&&leaf){const shape=new Float32Array(limit*4),tile=new Float32Array(limit*4),plant=new Float32Array(limit);for(let i=0;i<limit;i++){shape.set([...row.centre.toArray(),row.radius],i*4);tile.set([...row.atlas.origin,row.atlas.tileSize,row.atlas.padding],i*4);plant[i]=row.variant+row.season*16+(row.role==='pine'?32:0);}g.setAttribute('aShape',new T.InstancedBufferAttribute(shape,4));g.setAttribute('aTile',new T.InstancedBufferAttribute(tile,4));g.setAttribute('aPlant',new T.InstancedBufferAttribute(plant,1));}
    const m=new T.InstancedMesh(g,volume&&leaf?volumeMaterial:meshMaterial({...row,map:source.map},leaf),limit);m.count=0;m.frustumCulled=false;m.receiveShadow=true;m.userData.woodlandTier=tier?'middle':'near';scene.add(m);pool.push(m);}
   for(let i=0;i<limit;i++)pool[0].setColorAt(i,new T.Color(1,1,1));
   if(pool[1]){pool[1].instanceMatrix=pool[0].instanceMatrix;pool[1].instanceColor=pool[0].instanceColor;}pool.cover=cover;pool.used=0;row[tier?'middle':'near']=pool;state.pools.push(pool);
  }
  return row;
 });
 const groups=new Map();
 for(const [kind,list]of Object.entries(spots)){
  const choices=plants.filter(p=>p.role===kind);
  for(const t of list){const row=choices[Math.floor(hash(t.x*.81+t.z*1.17)*choices.length)],chunk=cix(t.z)*chunks+cix(t.x),key=chunk;
   if(!groups.has(key))groups.set(key,{chunk,records:[]});groups.get(key).records.push({t,row,old:old.get(t)});}
 }
 for(const {chunk,records}of groups.values()){
  const geometry=new T.PlaneGeometry(2,2),cover=new T.InstancedBufferAttribute(new Float32Array(records.length*2),2),shape=new T.InstancedBufferAttribute(new Float32Array(records.length*4),4),plant=new T.InstancedBufferAttribute(new Float32Array(records.length),1),tile=new T.InstancedBufferAttribute(new Float32Array(records.length*4),4);geometry.setAttribute('aCover',cover);geometry.setAttribute('aShape',shape);geometry.setAttribute('aPlant',plant);geometry.setAttribute('aTile',tile);
  const bounds=new T.Box3();for(const r of records){const row=r.row;r.old.m.getMatrixAt(r.old.ci,matrix);const e=matrix.elements,s=Math.max(Math.hypot(e[0],e[1],e[2]),Math.hypot(e[4],e[5],e[6]),Math.hypot(e[8],e[9],e[10])),radius=(row.centre.length()+row.radius)*Math.max(s,r.t.s*1.5);
   bounds.expandByPoint(new T.Vector3(e[12]-radius,e[13]-radius,e[14]-radius));bounds.expandByPoint(new T.Vector3(e[12]+radius,e[13]+radius,e[14]+radius));}
  geometry.boundingSphere=bounds.getBoundingSphere(new T.Sphere());
  const m=new T.InstancedMesh(geometry,material,records.length);m.castShadow=true;m.receiveShadow=true;m.customDepthMaterial=depth;m.userData.woodlandTier='far';
  records.forEach((r,i)=>{const row=r.row;shape.setXYZW(i,row.centre.x,row.centre.y,row.centre.z,row.radius);plant.setX(i,row.variant+row.season*16+(row.volume&&row.role==='pine'?32:0));tile.setXYZW(i,...row.atlas.origin,row.atlas.tileSize,row.atlas.padding);r.old.m.getMatrixAt(r.old.ci,matrix);m.setMatrixAt(i,matrix);r.color=new T.Color().setRGB(.9+r.t.v*.12,.9+r.t.v*.12,.9+r.t.v*.12);m.setColorAt(i,r.color);cover.setXY(i,0,1);
   const v={m,ci:i,shown:r.old.shown};map.set(r.t,v);r.view=v;r.position=new T.Vector3(matrix.elements[12],matrix.elements[13],matrix.elements[14]);r.height=row.centre.y+row.radius;
   r.scale=Math.hypot(matrix.elements[4],matrix.elements[5],matrix.elements[6]);r.cover=cover;state.records.push(r);delete r.old;});
  m.instanceMatrix.needsUpdate=true;scene.add(m);state.far.push(m);
 }
 for(const m of original)scene.remove(m);
 G.treeChunks=state.far;G.treeInstances=map;
 const previous={position:new T.Vector3(Infinity,Infinity,Infinity),direction:new T.Vector3()},direction=new T.Vector3(),sphere=new T.Sphere();let lastTime=-Infinity;
 function update(now,force=false){
  if(!state.active)return;
  lighting.uLightDirection.value.copy(G.sun.position).sub(G.sun.target.position).normalize();lighting.uSunColour.value.copy(G.sun.color).multiplyScalar(G.sun.intensity);
  lighting.uSkyColour.value.copy(G.hemi.color).multiplyScalar(G.hemi.intensity);lighting.uGroundColour.value.copy(G.hemi.groundColor).multiplyScalar(G.hemi.intensity);lighting.uAmbientColour.value.copy(G.amb.color).multiplyScalar(G.amb.intensity);
  lighting.uAutumn.value=G.seasonU.uDormancy.value*(1.-G.seasonU.uLeafless.value);
  camera.getWorldDirection(direction);
  if(!force&&!state.dirty&&camera.position.distanceToSquared(previous.position)<16&&direction.dot(previous.direction)>.9999)return;
  if(!force&&!state.dirty&&now-lastTime<.15)return;
  const start=performance.now();lastTime=now;state.dirty=false;previous.position.copy(camera.position);previous.direction.copy(direction);
  projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);
  const pixelScale=renderer.domElement.clientHeight/(2*Math.tan(camera.fov*Math.PI/360)),candidates=[];
  // Reset just the promoted entries; untouched distant trees need no per-frame work.
  for(const r of state.promoted||[]){r.cover.setXY(r.view.ci,0,1);r.cover.needsUpdate=true;}
  state.promoted=[];
  for(const r of state.records){if(r.view.shown===false)continue;
   // A tree hidden when the preview was loaded can later return. Read its live Y scale, not the initial tiny hidden matrix.
   r.scale=Math.abs(r.view.m.instanceMatrix.array[r.view.ci*16+5]);
   const depth=point.copy(r.position).sub(camera.position).dot(direction);if(depth<=1)continue;
   const pixels=r.height*r.scale*pixelScale/depth;if(pixels<=10)continue;
   point.copy(r.position);point.y+=r.height*r.scale*.5;
   sphere.center.copy(point);sphere.radius=r.row.radius*r.scale*1.5;if(!frustum.intersectsSphere(sphere))continue;
   candidates.push({r,pixels});
  }
  candidates.sort((a,b)=>b.pixels-a.pixels);state.near=state.middle=0;
  for(const pool of state.pools)pool.used=0;
  for(const {r,pixels}of candidates){let [far,middle,near]=weights(pixels);
   if(near&&state.near>=LIMITS.near){middle+=near;near=0;}
   if(middle&&state.middle>=LIMITS.middle){far+=middle;middle=0;}
   if(far===1)continue;
   r.cover.setXY(r.view.ci,0,far);r.cover.needsUpdate=true;state.promoted.push(r);
   for(const [name,weight,lo,hi]of [['near',near,far+middle,1],['middle',middle,far,far+middle]]){if(!weight)continue;
    const pool=r.row[name],i=pool.used++;r.view.m.getMatrixAt(r.view.ci,matrix);pool[0].setMatrixAt(i,matrix);pool[0].setColorAt(i,r.color);pool.cover.setXY(i,lo,hi);state[name]++;}
  }
  for(const pool of state.pools){for(const m of pool)m.count=pool.used;pool[0].instanceMatrix.needsUpdate=true;pool[0].instanceColor.needsUpdate=true;pool.cover.needsUpdate=true;}
  state.rebuilds++;state.lastRebuildMs=performance.now()-start;
 }
 function setEnabled(on){
  if(state.active===on)return;
  const from=on?old:map,to=on?map:old;
  for(const r of state.records){const a=from.get(r.t),b=to.get(r.t);a.m.getMatrixAt(a.ci,matrix);b.m.setMatrixAt(b.ci,matrix);b.shown=a.shown;b.m.instanceMatrix.needsUpdate=true;}
  for(const m of original)if(on)scene.remove(m);else scene.add(m);
  for(const m of state.far)if(on)scene.add(m);else scene.remove(m);
  for(const pool of state.pools)for(const m of pool)m.visible=on;
  G.treeChunks=on?state.far:original;G.treeInstances=on?map:old;state.active=on;state.dirty=true;
 }
 return Object.assign(state,{active:true,setEnabled,update,writeDepth,limits:LIMITS,plants,dispose(){setEnabled(false);for(const m of state.far)m.geometry.dispose();for(const pool of state.pools)for(const m of pool){scene.remove(m);m.geometry.dispose();m.material.dispose();}material.dispose();depth.dispose();library.dispose();}});
}
globalThis.CastleWoodland={load,create,weights,LIMITS};
})();
