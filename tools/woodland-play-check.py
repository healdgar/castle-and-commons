# Optional authoring check: Python Playwright and an installed Chrome/Chromium.
# All captures and records go to a fresh --out folder, never the source tree.
import argparse,json,subprocess,base64,time,hashlib,os,threading,http.server,functools,shutil,re
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser(description='Capture the grown woodland trial in a real paused worker world, compare original views, and check camera-independent winter shadows.')
parser.add_argument('--out',type=Path,required=True);parser.add_argument('--chrome',default=shutil.which('chromium') or shutil.which('google-chrome') or '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');parser.add_argument('--webgl1',action='store_true');parser.add_argument('--standalone',action='store_true',help='Reject every external woodland asset, as in an HTML-only preview');args=parser.parse_args()
root=Path(__file__).resolve().parents[1];out=args.out.resolve();out.mkdir(parents=True,exist_ok=True)
if (out/'audit.json').exists():raise SystemExit('Choose a fresh output directory')
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
result={'sourceSHA256':hashlib.sha256((root/'index.html').read_bytes()).hexdigest(),'views':[],'errors':[],'loadBefore':os.getloadavg(),'forcedWebGL1':args.webgl1,'rendererSHA256':hashlib.sha256((root/'assets/woodland-renderer.js').read_bytes()).hexdigest(), 'librarySHA256':hashlib.sha256((root/'assets/woodland/library.json').read_bytes()).hexdigest()};start=time.monotonic()
result['standalone']=args.standalone;result['externalWoodlandRequests']=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=args.chrome,headless=True,args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=browser.new_page(viewport={'width':1440,'height':1000});page.add_init_script('window.requestAnimationFrame=()=>0;');page.on('pageerror',lambda e:result['errors'].append(str(e)));page.on('console',lambda m:result['errors'].append(m.text) if m.type=='error' else print('Console '+m.type+': '+m.text[:500],flush=True) if m.type=='warning' else None)
 def remote(route):
  r=subprocess.run(['curl','--fail','--silent','--show-error','--max-time','30',route.request.url],capture_output=True)
  if r.returncode: raise RuntimeError('Remote resource failed: '+route.request.url)
  route.fulfill(status=200,content_type='text/css' if 'fonts.googleapis.com' in route.request.url else 'font/woff2' if 'fonts.gstatic.com' in route.request.url else 'text/javascript',body=r.stdout)
 page.route('https://**/*',remote)
 if args.standalone:
  def missing_woodland(route):
   result['externalWoodlandRequests'].append(route.request.url);route.fulfill(status=404,body='Woodland assets are not separately published')
  page.route('**/assets/woodland**',missing_woodland)
 if args.webgl1:page.route('**/index.html',lambda route:route.fulfill(content_type='text/html',body=(root/'index.html').read_text().replace('renderer=new THREE.WebGLRenderer(', 'renderer=new THREE.WebGL1Renderer(')))
 try:
  if args.standalone:
   # An opaque sandbox has no same-origin asset directory, like a single-file app preview.
   html=(root/'index.html').read_text();packed=re.search(r'<script type="text/plain" id="woodlandassets">[\s\S]*?</script>\s*<script id="woodlandrenderer">[\s\S]*?</script>',html).group(0)
   page.set_content('<iframe sandbox="allow-scripts"></iframe>')
   three=subprocess.check_output(['curl','--fail','--silent','--show-error','--max-time','30','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js']).decode().replace('</script','<\\/script')
   page.evaluate('(html)=>document.querySelector("iframe").srcdoc=html','<script>'+three+'</script>'+packed)
   page.wait_for_function('document.querySelector("iframe")!==null',polling=100)
   frame=page.frames[1];frame.wait_for_function('typeof CastleWoodland!=="undefined"&&typeof THREE!=="undefined"',polling=100)
   result['embeddedFrame']=frame.evaluate('(async()=>{let fetches=0;window.fetch=()=>{fetches++;throw Error("No asset host in this preview");};const x=await CastleWoodland.load({THREE});const r={origin:self.origin,plants:x.plants.length,textures:x.atlas.length,fetches};x.dispose();return r;})()')
   assert result['embeddedFrame']=={'origin':'null','plants':7,'textures':3,'fetches':0},result['embeddedFrame']
  page.goto('http://127.0.0.1:'+str(server.server_port)+'/index.html#s=1001&f=42&c=sea&y=1066&km=9&fresh=1',wait_until='domcontentloaded')
  page.wait_for_function('document.getElementById("loading")===null&&!!renderer&&!!BACKGROUND&&G.rivers',polling=100,timeout=180000)
  page.evaluate('(async()=>{await workerSetSpeed(0);installPresentation(await BACKGROUND.request("view",{kind:"landscape"}));await G.miniatureReady;await G.waterRippleReady;contextDismiss();cam.mode="free";})()')
  assert page.evaluate('!G.woodland')
  page.evaluate('window.__initiallyHiddenTree=W.treeSpots.dec.find(t=>G.treeInstances.get(t).shown&&!t.cut);showTree(__initiallyHiddenTree,false)')
  page.locator('#menubtn').click();page.locator('#menuwoodland').click();page.wait_for_function('!document.querySelector("#menuwoodland").disabled',polling=100);print('Preview button:',page.locator('#menuwoodland').inner_text(),flush=True);assert page.evaluate('!!G.woodland&&G.woodland.active')
  result['initiallyHiddenRestoration']=page.evaluate('(()=>{const t=__initiallyHiddenTree,r=G.woodland.records.find(r=>r.t===t);showTree(t,true);G.woodland.update(0,true);return{shown:r.view.shown,scale:r.scale};})()');assert result['initiallyHiddenRestoration']['shown'] and result['initiallyHiddenRestoration']['scale']>.01
  page.evaluate('document.body.classList.add("hideui")')
  result['gpu']=page.evaluate('(()=>{const gl=renderer.getContext(),e=gl.getExtension("WEBGL_debug_renderer_info");return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);})()')
  result['baseline']=page.evaluate('({day:day(),treeCounts:Object.fromEntries(Object.entries(W.treeSpots).map(([k,v])=>[k,v.length])),trees:G.treeChunks.map(m=>({count:m.count,triangles:m.geometry.attributes.position.count/3,receive:m.receiveShadow,cast:m.castShadow})),atlasReady:G.miniatureU.uMiniatureReady.value,rippleReady:G.waterRippleU.uWaterRippleReady.value})')
  views=[
   ('01-broadleaf-close','(()=>{const t=W.treeSpots.dec.find(t=>Math.hypot(t.x,t.z)<3000);return[t.x,t.z,55,.6,0];})()',1),
   ('02-broadleaf-reverse','(()=>{const t=W.treeSpots.dec.find(t=>Math.hypot(t.x,t.z)<3000);return[t.x,t.z,55,2.1,0];})()',1),
   ('03-conifer-close','(()=>{const t=W.treeSpots.pine.find(t=>Math.hypot(t.x,t.z)<3000)||W.treeSpots.pine[0];return[t.x,t.z,65,.6,0];})()',1),
   ('04-broadleaf-winter','(()=>{const t=W.treeSpots.dec.find(t=>Math.hypot(t.x,t.z)<3000);return[t.x,t.z,55,.6,0];})()',3),
   ('05-town-textures','[W.capital.pos.x,W.capital.pos.z,100,2.3,0]',1),
   ('06-shadow-before-cutoff','[W.capital.pos.x,W.capital.pos.z,1590,2.3,0]',1),
   ('07-shadow-after-cutoff','[W.capital.pos.x,W.capital.pos.z,1610,2.3,0]',1),
   ('08-realm','[0,0,4200,.8,0]',1)]
  if GROW_VOLUMES:=page.evaluate('G.woodland.plants.some(p=>p.volume)'):
   for plant in page.evaluate('G.woodland.plants.filter(p=>p.volume).map(p=>p.id)'):
    pose='(()=>{const r=G.woodland.records.find(r=>r.row.id==='+json.dumps(plant)+'&&r.view.shown&&!r.t.cut&&Math.hypot(r.t.x,r.t.z)<3000);return[r.t.x,r.t.z,45,.6,-.4];})()'
    views.append(('volume-'+plant,pose,1));views.append(('volume-'+plant+'-winter',pose,3))
   views.append(('volume-conifer-eye-level',views[2][1].replace('65,.6,0','25,.6,-.8'),1));views.append(('volume-conifer-reverse',views[2][1].replace('65,.6,0','65,2.1,0'),1))
  views.extend([
   ('broadleaf-spring-buds',views[0][1],0,.08),
   ('broadleaf-spring-partial',views[0][1],0,.225),
   ('broadleaf-spring-full',views[0][1],0,.38),
   ('broadleaf-autumn-shedding',views[0][1],2,.60)])
  for name,expression,season,*stage in views:
   blend=stage[0] if stage else .25
   page.evaluate('(()=>{const q='+expression+';flyTo(...q);cam.pitchBias=cam.cur.pitchBias=q[4];cam.cur.focus.copy(cam.focus);cam.cur.dist=cam.dist;cam.cur.yaw=cam.yaw;updateCamera(0,0);animateWorld(0,0);lastSeasonKey="";updateTerrainColors('+str(season)+','+str(blend)+',1);scene.updateMatrixWorld(true);if(G.woodland)G.woodland.update(0,true);renderer.render(scene,camera);})()')
   inspect=page.evaluate('(()=>{const gl=renderer.getContext();return{woodland:G.woodland?{near:G.woodland.near,middle:G.woodland.middle,records:G.woodland.records.length,batches:G.woodland.far.length,rebuildWallMs:G.woodland.lastRebuildMs,writeDepth:G.woodland.writeDepth}:null,day:day(),camera:camera.position.toArray(),distance:cam.cur.dist,render:{...renderer.info.render},geometry:renderer.info.memory.geometries,textures:renderer.info.memory.textures,shadowEnabled:G.sun.castShadow,shadowExtent:G.sun.shadow.camera.right,shadowTexel:G.sun.shadow.camera.right*2/2048,leafless:G.seasonU.uLeafless.value,glError:gl.getError(),linked:renderer.info.programs.every(p=>gl.getProgramParameter(p.program,gl.LINK_STATUS))};})()')
   data=page.context.new_cdp_session(page).send('Page.captureScreenshot',{'format':'png'})['data'];(out/(name+'.png')).write_bytes(base64.b64decode(data));result['views'].append({'name':name,**inspect});print(name+' '+json.dumps(inspect),flush=True);assert inspect['linked'] and inspect['glError']==0,inspect
  
  # Matched original views from the same paused realm, not a separately generated world.
  for name,expression,season in [views[0],views[3],views[7]]:
   page.evaluate('(()=>{G.woodland.setEnabled(false);const q='+expression+';flyTo(...q);cam.pitchBias=cam.cur.pitchBias=q[4];cam.cur.focus.copy(cam.focus);cam.cur.dist=cam.dist;cam.cur.yaw=cam.yaw;updateCamera(0,0);animateWorld(0,0);lastSeasonKey="";updateTerrainColors('+str(season)+',.25,1);scene.updateMatrixWorld(true);renderer.render(scene,camera);})()')
   data=page.context.new_cdp_session(page).send('Page.captureScreenshot',{'format':'png'})['data'];(out/(name+'-original.png')).write_bytes(base64.b64decode(data))
   result['views'].append({'name':name+'-original','render':page.evaluate('({...renderer.info.render})')})
  page.evaluate('G.woodland.setEnabled(true)')
  # Isolate woodland: unrelated buildings cannot make an empty tree map pass.
  page.evaluate('window.__otherCasters=[];scene.traverse(m=>{if(m.isMesh&&m.castShadow&&!G.woodland.far.includes(m)){__otherCasters.push(m);m.castShadow=false;}})')
  for shadowName,season,blend in [('winterShadow',3,.25),('springShadow',0,.225)]:
   shadow=[]
   for yaw in [.6,2.1]:
    digest=page.evaluate('(async()=>{const t=W.treeSpots.dec.find(t=>Math.hypot(t.x,t.z)<3000);flyTo(t.x,t.z,55,'+str(yaw)+',0);cam.cur.focus.copy(cam.focus);cam.cur.dist=cam.dist;cam.cur.yaw=cam.yaw;updateCamera(0,0);animateWorld(0,0);lastSeasonKey="";updateTerrainColors('+str(season)+','+str(blend)+',1);scene.updateMatrixWorld(true);G.woodland.update(0,true);renderer.render(scene,camera);const target=G.sun.shadow.map,pixels=new Uint8Array(target.width*target.height*4);renderer.readRenderTargetPixels(target,0,0,target.width,target.height,pixels);let drawnPixels=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]!==255||pixels[i+1]!==255||pixels[i+2]!==255||pixels[i+3]!==255)drawnPixels++;return {drawnPixels,sha256:[...new Uint8Array(await crypto.subtle.digest("SHA-256",pixels))].map(v=>v.toString(16).padStart(2,"0")).join("")};})()')
    assert digest["drawnPixels"]>128,"empty woodland shadow map"
    shadow.append(digest)
   assert shadow[0]==shadow[1],shadow
   result[shadowName]={**shadow[0],'cameraOnlyRotationUnchanged':True}
  assert result['springShadow']['drawnPixels']>result['winterShadow']['drawnPixels'],'leaf clusters must cast additional shadow'
  page.evaluate('__otherCasters.forEach(m=>m.castShadow=true)')
  result['ab']=page.evaluate('(()=>{const before=G.woodland.records.map(r=>r.view.shown);G.woodland.setEnabled(false);const original={instances:G.treeChunks.reduce((n,m)=>n+m.count,0),nativeShown:G.woodland.records.map(r=>G.treeInstances.get(r.t).shown)};G.woodland.setEnabled(true);G.woodland.update(0,true);return{before,original,after:G.woodland.records.map(r=>r.view.shown)};})()')
  assert result['ab']['before']==result['ab']['original']['nativeShown']==result['ab']['after']
  result['ab']={'matchedInstances':len(result['ab']['before']),'originalInstances':result['ab']['original']['instances']}
  if GROW_VOLUMES:
   result['volumes']=page.evaluate('(()=>{const before=G.woodland.records.filter(r=>r.row.volume).map(r=>[r.view.shown,...r.view.m.instanceMatrix.array.slice(r.view.ci*16,r.view.ci*16+16)]),r=G.woodland.records.find(r=>r.row.volume&&r.view.shown&&!r.t.cut);showTree(r.t,false);G.woodland.update(0,true);const hidden=!G.woodland.promoted.includes(r);showTree(r.t,true);G.woodland.update(0,true);return{hidden,unchanged:JSON.stringify(before)===JSON.stringify(G.woodland.records.filter(r=>r.row.volume).map(r=>[r.view.shown,...r.view.m.instanceMatrix.array.slice(r.view.ci*16,r.view.ci*16+16)])),tiers:G.woodland.plants.filter(p=>p.volume).map(p=>({id:p.id,near:p.near[1].geometry.index.count/3,middle:p.middle[1].geometry.index.count/3}))};})()')
   assert result['volumes']['hidden'] and result['volumes']['unchanged'] and all(t['near']<=36 and t['middle']<=12 for t in result['volumes']['tiers']),result['volumes']
  # Clear and restore just the presentation; no model state or command is invented.
  result['clearing']=page.evaluate('(()=>{const r=G.woodland.promoted.find(r=>r.view.shown!==false),t=r.t;showTree(t,false);G.woodland.update(0,true);const removed=!G.woodland.promoted.includes(r);G.woodland.setEnabled(false);const oldHidden=G.treeInstances.get(t).shown===false;showTree(t,true);G.woodland.setEnabled(true);G.woodland.update(0,true);return{removed,oldHidden,restored:r.view.shown===true};})()')
  assert all(result['clearing'].values()),result['clearing']
  result['endDay']=page.evaluate('day()');assert result['endDay']==0
  assert not result['errors'],result['errors']
  if args.standalone:assert not result['externalWoodlandRequests'],result['externalWoodlandRequests']
 finally:
  browser.close();server.shutdown();result['wallSeconds']=time.monotonic()-start;result['loadAfter']=os.getloadavg();(out/'audit.json').write_text(json.dumps(result,indent=2))
