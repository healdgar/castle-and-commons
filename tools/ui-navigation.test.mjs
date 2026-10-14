import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const fn=n=>html.match(new RegExp('^function '+n+'\\b[\\s\\S]*?(?=^function |^async function |^const |^/\\*|$(?![\\s\\S]))','m'))[0];
function infoRuntime(){
  const elements=new Map(),requests=[];const el=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',scrollTop:0,attrs:{},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}});return elements.get(id);};
  const W={settlements:[{name:'A'},{name:'B'}]},contextUI={navigation:0,kind:null,scroll:new Map()},infoUI={};
  const C=vm.createContext({W,contextUI,infoUI,ADV_PENDING:null,document:{getElementById:el},console:{error(){}},esc:String,setHTML:(e,h)=>e.innerHTML=h,workerHTML:String,hideInspect(){},contextShow:k=>{if(contextUI.kind!==k)contextUI.navigation++;contextUI.kind=k;},contextSync(){},contextExpand:on=>contextUI.expanded=on,BACKGROUND:{request:(_,payload)=>new Promise((resolve,reject)=>requests.push({payload,resolve,reject}))}});
  vm.runInContext(['contextInfoKey','workerQuery','workerOpenInfo'].map(fn).join('\n'),C);return{C,W,contextUI,infoUI,requests,el};
}
test('town refresh retains scope, scroll and the same town request without touching world records',async()=>{
  const {C,W,infoUI,requests,el}=infoRuntime(),before=JSON.stringify(W);
  let pending=C.workerOpenInfo('accounts',W.settlements[1]);requests[0].resolve({html:'Town B'});await pending;
  el('contextcontent').scrollTop=91;pending=C.workerOpenInfo('accounts-refresh');assert.equal(requests[1].payload.town,1);assert.equal(requests[1].payload.infoKind,'accounts');requests[1].resolve({html:'Refreshed B'});await pending;
  assert.equal(infoUI.town,W.settlements[1]);assert.equal(el('contextcontent').scrollTop,91);assert.equal(el('infobody').innerHTML,'Refreshed B');assert.equal(JSON.stringify(W),before);
});
test('two concurrent town views keep the newest reply regardless of delivery order',async()=>{
  const {C,W,requests,el}=infoRuntime();const a=C.workerOpenInfo('accounts',W.settlements[0]),b=C.workerOpenInfo('accounts',W.settlements[1]);assert.equal(requests.length,2);
  requests[1].resolve({html:'B'});await b;requests[0].resolve({html:'A'});await a;assert.equal(el('infobody').innerHTML,'B');assert.equal(el('contextpanel').attrs['aria-busy'],undefined);
});
test('closing or opening a root view invalidates actual late replies and stale errors',async()=>{
  for(const next of [null,'drawer'])for(const failed of [false,true]){
    const {C,requests,contextUI,el}=infoRuntime();const pending=C.workerOpenInfo('accounts');contextUI.kind=next;contextUI.navigation++;el('infobody').innerHTML='new view';
    if(failed)requests[0].reject(Error('obsolete'));else requests[0].resolve({html:'old view'});await pending;assert.equal(el('infobody').innerHTML,'new view');
  }
});
test('pending views have visible status and current failures have recoverable inline errors',async()=>{
  const {C,requests,el}=infoRuntime();const pending=C.workerOpenInfo('reference',null,'family:0');assert.match(el('infobody').innerHTML,/role="status"/);assert.equal(el('contextpanel').attrs['aria-busy'],'true');requests[0].reject(Error('offline'));await pending;assert.match(el('infobody').innerHTML,/role="alert".*offline/);assert.match(el('infobody').innerHTML,/Close it and try again/);assert.equal(el('contextpanel').attrs['aria-busy'],undefined);
});
test('Back keeps at most 24 routes and does not cache private records or HTML',()=>{
  let route;const contextUI={history:[]};const C=vm.createContext({contextUI,contextRoute:()=>route});vm.runInContext(fn('contextRemember'),C);
  for(let i=0;i<40;i++){route={key:'insp:p'+i,code:'p'+i,kind:'insp'};C.contextRemember('insp:next');}assert.equal(contextUI.history.length,24);assert.equal(contextUI.history[0].code,'p16');C.contextRemember('insp:next');assert.equal(contextUI.history.length,24);contextUI.restoring=true;route={key:'extra'};C.contextRemember('next');assert.equal(contextUI.history.length,24);
});
test('Back resolves the current foreground record, restores view, scroll and camera, and rejects superseded completion',async()=>{
  for(const superseded of [false,true]){
    let finish;const route={kind:'insp',code:'p7',expanded:true,view:'family',scroll:90,camera:{x:12,z:34,dist:150}},contextUI={history:[route],navigation:4};const calls=[],content={scrollTop:0};
    const C=vm.createContext({contextUI,BACKGROUND:null,workerInspectionTarget:c=>({type:'person',liveCode:c}),contextExpand:v=>calls.push(['expanded',v]),showInspect:p=>{calls.push(['pick',p.liveCode]);contextUI.navigation++;return new Promise(r=>finish=r);},setInspectorView:v=>calls.push(['view',v]),contextSync(){},markManual(){},flyTo:(...v)=>calls.push(['camera',...v]),document:{getElementById:id=>id==='contextcontent'?content:{focus(){}}}});vm.runInContext(fn('contextBack'),C);
    const pending=C.contextBack();if(superseded)contextUI.navigation++;finish();await pending;assert.deepEqual(calls[1],['pick','p7']);assert.equal(content.scrollTop,superseded?0:90);assert.equal(calls.some(c=>c[0]==='camera'),!superseded);assert.equal(contextUI.restoring,false);
  }
});
function followRuntime(){const army={id:3},caravan={renderKey:'route:7'},W={armies:[army],caravans:[caravan],settlements:[{kind:'capital'}]},cam={},calls=[];const C=vm.createContext({W,cam,hAt:()=>5,flyTo:(...x)=>calls.push(['fly',...x]),showInspect:p=>calls.push(['inspect',p.workerCode]),orderFeedbackBegin:()=>1,orderFeedbackFinish:(t,r)=>calls.push(['failure',r.accepted])});vm.runInContext(fn('workerFollowInspector'),C);return{C,W,cam,calls,army,caravan};}
test('name-opened actor cards follow the live projected actor identity, including a commander and keyed caravan',()=>{
  const {C,W,cam,army,caravan}=followRuntime(),before=JSON.stringify(W);C.workerFollowInspector({type:'reference',workerCode:'n9',workerCard:{follow:{type:'army',code:'a3'}}});assert.equal(cam.follow,army);C.workerFollowInspector({type:'reference',workerCard:{follow:{type:'caravan',code:'caravan:k:route%3A7'}}});assert.equal(cam.follow,caravan);assert.equal(cam.dist,140);assert.equal(JSON.stringify(W),before);
});
test('named person and dead-person home controls use the supplied identity and exact destination',()=>{
  const {C,cam,calls}=followRuntime();C.workerFollowInspector({type:'reference',workerCode:'p7',_anchor:{x:1,z:2},workerCard:{follow:{type:'person',code:'p7'}}});assert.equal(cam.follow.pid,7);assert.deepEqual(calls[0],['fly',1,2,150]);C.workerFollowInspector({type:'reference',workerCode:'p8',_anchor:{x:99,z:99},workerCard:{follow:{type:'building',code:'building:0:k:home',at:{x:3,z:4},inspect:true}}});assert.deepEqual(calls.slice(-2),[['fly',3,4,60],['inspect','building:0:k:home']]);
});
test('missing travellers report failure and never follow an invented actor',()=>{
  const {C,cam,calls}=followRuntime();C.workerFollowInspector({workerCard:{follow:{type:'army',code:'a99'}}});assert.equal(cam.follow,undefined);assert.deepEqual(calls,[['failure',false]]);
});
const accessible=fn('initAccessibleUI'),start=accessible.indexOf("document.addEventListener('keydown',e=>{"),end=accessible.indexOf('\n  },true);',start);
const keyboardSource=accessible.slice(start+"document.addEventListener('keydown',".length,end)+'\n  }';
function keyboardRuntime(dialog={id:'contextpanel'}){const calls=[];const C=vm.createContext({activeUIDialog:dialog,contextExpand:v=>calls.push(['expand',v]),focusable:()=>[],document:{getElementById:()=>({getAttribute:()=> 'false'})},closeToolMenu(){}});return{handle:vm.runInContext('('+keyboardSource+')',C),calls};}
test('expanded dialog tabs still accept arrow navigation and focus the newly selected tab',()=>{
  const {handle}=keyboardRuntime(),calls=[],tabs=[0,1,2].map(i=>({hidden:false,click:()=>calls.push(['click',i]),focus:()=>calls.push(['focus',i])}));for(const t of tabs)t.closest=()=>({querySelectorAll:()=>tabs});const e={key:'ArrowLeft',target:{closest:q=>q==='[role=tab]'?tabs[1]:null},preventDefault(){this.defaultPrevented=true;}};handle(e);assert.deepEqual(calls,[['click',0],['focus',0]]);assert.equal(e.defaultPrevented,true);
});
test('custom controls work inside expanded dialogs while nested native anchors keep their own activation',()=>{
  const {handle}=keyboardRuntime();for(const native of [false,true]){let clicks=0;const e={key:'Enter',target:{closest:q=>q==='[role=button]'?{click:()=>clicks++}:native&&q.startsWith('button,a,')?{}:null},preventDefault(){this.defaultPrevented=true;}};handle(e);assert.equal(clicks,native?0:1);assert.equal(!!e.defaultPrevented,!native);}
});
test('Escape still minimizes the expanded sheet and empty dialog Tab still traps focus',()=>{
  const {handle,calls}=keyboardRuntime();for(const key of ['Escape','Tab']){const e={key,preventDefault(){this.defaultPrevented=true;},stopPropagation(){}};handle(e);assert.equal(e.defaultPrevented,true);}assert.deepEqual(calls,[['expand',false]]);
});
test('ambiguous families carry real member and place context without changing the records',()=>{
  const W={fams:[{home:0},{home:1}],settlements:[{name:'East',folk:[{fam:0,gn:'Anne'}],dead:[]},{name:'West',folk:[{fam:1,gn:'Bert'}],dead:[{fam:1,gn:'Old',dead:true}]}]},before=JSON.stringify(W);const C=vm.createContext({W,infoUI:{reference:'choose:'+encodeURIComponent(JSON.stringify(['family:0','family:1']))},folkName:p=>p.gn,referenceTarget:()=>null,referenceTitle:()=> 'Shared family',esc:String});vm.runInContext(fn('referenceChoiceContext')+'\n'+fn('referenceInfoHTML'),C);const result=C.referenceInfoHTML();assert.match(result,/East.*Anne.*East/);assert.match(result,/West.*Bert.*West/);assert.equal(JSON.stringify(W),before);
});
test('closing a pending card clears busy state, route history and navigation ownership',()=>{
  const panel={hidden:false,removeAttribute:k=>assert.equal(k,'aria-busy')},contextUI={ready:true,kind:'info',history:[{}],navigation:7},C=vm.createContext({contextUI,contextExpand(){},orderFeedbackPosition(){},Event:class{},document:{getElementById:id=>id==='contextpanel'?panel:{focus(){}},dispatchEvent(){}}});vm.runInContext(fn('contextDismiss'),C);C.contextDismiss();assert.equal(contextUI.navigation,8);assert.equal(contextUI.kind,null);assert.equal(contextUI.history.length,0);assert.equal(panel.hidden,true);
});
test('named-card replies cannot replace a newer card or a newly opened root panel',async()=>{
  for(const root of [false,true]){
    const {C,contextUI,requests}=infoRuntime(),installed=[];contextUI.expanded=false;
    Object.assign(C,{inspTarget:null,inspectorPickCode:p=>p?.workerCode||null,setInspectorView(){},showInspect:p=>installed.push(p.workerCode)});C.document.getElementById('inspfollow').style={};vm.runInContext(fn('workerShowInspector'),C);
    const first=C.workerShowInspector({type:'reference',workerCode:'p1'});if(root){contextUI.kind='drawer';contextUI.navigation++;requests[0].resolve({title:'Old person'});await first;assert.deepEqual(installed,[]);}else{const next=C.workerShowInspector({type:'reference',workerCode:'p2'});requests[1].resolve({title:'New person'});await next;requests[0].resolve({title:'Old person'});await first;assert.deepEqual(installed,['p2']);}
  }
});
test('expanding an inspector invalidates its older compact reply',async()=>{
  const {C,contextUI,requests}=infoRuntime(),installed=[];contextUI.expanded=false;Object.assign(C,{inspTarget:null,inspectorPickCode:p=>p?.workerCode||null,setInspectorView(){},showInspect:p=>installed.push(p.workerCard.body)});C.document.getElementById('inspfollow').style={};vm.runInContext(fn('workerShowInspector'),C);const pick={workerCode:'p1'},compact=C.workerShowInspector(pick);contextUI.expanded=true;const full=C.workerShowInspector(pick);requests[1].resolve({body:'Full record'});await full;requests[0].resolve({body:'Compact record'});await compact;assert.deepEqual(installed,['Full record']);
});
test('half-second refreshes share a slow linked town request and let its reply open the card',async()=>{
  const {C,contextUI,requests,el}=infoRuntime(),installed=[];contextUI.kind='insp';contextUI.expanded=true;contextUI.navigation=7;
  Object.assign(C,{inspTarget:null,BACKGROUND:C.BACKGROUND,backgroundApplying:false,uiBusy:()=>false,inspectorPickCode:p=>p?.workerCode||null,setInspectorView(){},showInspect:p=>installed.push(p.workerCard.title)});el('inspfollow').style={};
  vm.runInContext(fn('workerShowInspector')+'\n'+fn('refreshInspect'),C);
  const pick={type:'reference',workerCode:'s0'},pending=C.workerShowInspector(pick);
  for(let i=0;i<20;i++)assert.equal(C.refreshInspect(),pending);
  assert.equal(requests.length,1);assert.equal(contextUI.navigation,7);assert.match(el('insptitle').innerHTML,/Opening card/);
  requests[0].resolve({title:'Rougecastel'});await pending;assert.deepEqual(installed,['Rougecastel']);assert.equal(el('contextpanel').attrs['aria-busy'],undefined);
});
test('reopening the same town from a different panel makes its inspector current',async()=>{
  const {C,contextUI,requests,el}=infoRuntime(),installed=[];contextUI.kind='drawer';contextUI.expanded=false;
  Object.assign(C,{inspTarget:{workerCode:'s0'},inspectorPickCode:p=>p?.workerCode||null,setInspectorView(){},showInspect:p=>installed.push(p.workerCard.title)});el('inspfollow').style={};vm.runInContext(fn('workerShowInspector'),C);
  const pending=C.workerShowInspector({workerCode:'s0'});assert.equal(contextUI.kind,'insp');requests[0].resolve({title:'Rougecastel'});await pending;assert.deepEqual(installed,['Rougecastel']);assert.equal(el('contextpanel').attrs['aria-busy'],undefined);
});
test('a surname chooser explains empty family records instead of offering indistinguishable dead ends',()=>{
  const W={fams:[{home:0},{home:0},{home:0}],settlements:[{name:'East',folk:[{fam:0,gn:'Anne'}],dead:[]}]},codes=['family:0','family:1','family:2'],C=vm.createContext({W,infoUI:{reference:'choose:'+encodeURIComponent(JSON.stringify(codes))},referenceTarget:()=>({label:'Shared family'}),referenceTitle:()=> 'Shared family',folkName:p=>p.gn,esc:String});vm.runInContext(fn('referenceChoiceContext')+'\n'+fn('referenceInfoHTML'),C);const result=C.referenceInfoHTML();assert.equal((result.match(/data-nm=/g)||[]).length,1);assert.match(result,/Anne/);assert.match(result,/2 other families have no named members currently recorded/);assert.equal(C.referenceChoiceContext('family:1',new Map()),null);
});
test('a chooser makes one people census for all its family choices and prefers living representatives',()=>{
  let reads=0;const people=Array.from({length:30},(_,fam)=>({fam,gn:'Person '+fam})),town={name:'East',dead:[{fam:0,gn:'Old',dead:true}]};Object.defineProperty(town,'folk',{get(){reads++;return people;}});const W={fams:people.map(()=>({home:0})),settlements:[town]},C=vm.createContext({W,infoUI:{reference:'choose:'+encodeURIComponent(JSON.stringify(people.map(p=>'family:'+p.fam)))},folkName:p=>p.gn,referenceTarget:()=>null,referenceTitle:()=> 'Shared family',esc:String});vm.runInContext(fn('referenceChoiceContext')+'\n'+fn('referenceInfoHTML'),C);const result=C.referenceInfoHTML();assert.equal(reads,1);assert.equal((result.match(/data-nm=/g)||[]).length,30);assert.ok(result.includes('Person 0'));assert.ok(!result.includes('Old'));
});
test('advisor frame controls mirror available Back and omit impossible planning expansion',async()=>{
  const a=html.indexOf('  synthetic(scope){'),b=html.indexOf('\n  VIEWS:',a),source=html.slice(a,b).trim().replace(/,$/,'');let backs=0;const contextUI={kind:'insp',expanded:false,history:[{}]},C=vm.createContext({contextUI,contextBack:async()=>backs++,contextDismiss(){},contextExpand(){}}),frame=vm.runInContext('({'+source+'})',C);let controls=frame.synthetic('context');assert.equal(controls[0].name,'context:back');await controls[0]._act();assert.equal(backs,1);contextUI.history=[];assert.ok(!frame.synthetic('context').some(c=>c.name==='context:back'));contextUI.kind='plan';contextUI.history=[{}];assert.deepEqual(Array.from(frame.synthetic('context'),c=>c.name),['context:close']);
});
test('family choices distinguish namesakes by recorded age, trade and member count',()=>{
  const W={fams:[{home:0},{home:0}],settlements:[{name:'East',folk:[{id:1,fam:0,gn:'Milon',b:-31*360,tr:'weaver'},{id:2,fam:1,gn:'Milon',b:-45*360,tr:'miller'}],dead:[]}]},C=vm.createContext({W,infoUI:{reference:'choose:'+encodeURIComponent(JSON.stringify(['family:0','family:1']))},day:()=>0,ageYrs:p=>-p.b/360,folkName:p=>p.gn,referenceTarget:()=>null,referenceTitle:()=> 'Shared family',esc:String});vm.runInContext(fn('referenceChoiceContext')+'\n'+fn('referenceInfoHTML'),C);const result=C.referenceInfoHTML();assert.match(result,/Milon · aged 31 · weaver/);assert.match(result,/Milon · aged 45 · miller/);assert.equal((result.match(/1 listed member/g)||[]).length,2);
});
test('family census keeps actual soldiers, travelling residents and promoted people without double-counting or world writes',()=>{
  const home={name:'Home',folk:[],dead:[]},away={name:'Away',folk:[],dead:[]},resident={id:1,fam:0,gn:'Anne',si:0},soldier={id:2,fam:0,gn:'Bert',home:0,tr:'miller'},traveller={id:3,fam:0,gn:'Cora',si:0},promoted={id:4,fam:0,gn:'Duke'},W={fams:[{home:0}],settlements:[home,away],armies:[{name:'The Watch',at:1,men:[soldier]}],travellers:[{p:traveller,from:0,to:1,depart:0,arrive:10}],notables:[{id:9,fp:promoted,alive:true}]};home.folk=[resident,traveller];const before=JSON.stringify(W),tables=[],C=vm.createContext({W,infoUI:{reference:'family:0'},day:()=>1,folkName:p=>p.gn,famName:()=> 'Shared',fullTitle:()=> 'Duke Dumont',ageOf:()=>40,referenceTitle:()=> 'Shared family',esc:String,detailTable:(id,title,heads,rows)=>{tables.push(rows);return '';}});vm.runInContext(fn('referenceChoiceContext')+'\n'+fn('referenceInfoHTML'),C);C.referenceInfoHTML();const rows=tables[0];assert.equal(rows.length,4);assert.ok(rows.some(r=>r[0].includes('data-nm="p2"')&&r[1]==='with The Watch'));assert.ok(rows.some(r=>r[0].includes('data-nm="p3"')&&r[1]==='travelling to Away'));assert.ok(rows.some(r=>r[0].includes('data-nm="n9"')&&r[1]==='recorded in the annals'));C.infoUI.reference='choose:'+encodeURIComponent(JSON.stringify(['family:0']));C.referenceTarget=()=>null;assert.match(C.referenceInfoHTML(),/4 listed members/);assert.equal(JSON.stringify(W),before);
});
test('UI person references resolve actual army rolls and annals people while leaving the simulation finder and world untouched',()=>{
  const home={name:'Home'},p={id:7,home:0,gn:'Bert'},promoted={id:9,fp:{id:8},alive:true},a={id:3,at:0,men:[p]},W={settlements:[home],armies:[a],notables:[promoted]},before=JSON.stringify(W),finder=()=>null,C=vm.createContext({W,findPerson:finder,folkName:p=>p.gn,fullTitle:()=> 'Duke'});vm.runInContext(fn('referenceTarget'),C);assert.equal(C.referenceTarget('p7').pick.p,p);assert.equal(C.referenceTarget('p7').pick.a,a);assert.equal(C.referenceTarget('p7').town,home);assert.equal(C.referenceTarget('p8').pick.n,promoted);assert.equal(C.findPerson,finder);assert.equal(JSON.stringify(W),before);
});
test('an enlisted person anchors to the host before looking for a town walker or home',()=>{
  const a={id:3},W={};Object.defineProperty(W,'travellers',{get(){throw Error('host position must take precedence');}});const C=vm.createContext({W,BACKGROUND:null,agentPos:actor=>{assert.equal(actor,a);return{x:12,z:34};},hAt:()=>5});vm.runInContext(fn('contextAnchor'),C);const p=C.contextAnchor({type:'person',p:{dead:false},a});assert.equal(p.x,12);assert.equal(p.z,34);assert.equal(p.y,9);
});
test('trade references retain town scope and the realm-wide living trade census',()=>{
  const W={settlements:[{name:'East',folk:[{id:1,si:0,tr:'weaver'},{id:2,si:0,tr:'miller'},{id:3,si:0,tr:'weaver',dead:true}]},{name:'West',folk:[{id:4,si:1,tr:'weaver'}]}]},before=JSON.stringify(W),tables=[],C=vm.createContext({W,infoUI:{reference:'trade:0:weaver',town:W.settlements[0]},detailPerson:p=>'person:'+p.id,referenceTitle:()=> 'Weaver',esc:String,detailTable:(id,title,heads,rows)=>{tables.push(rows);return '';}});vm.runInContext(fn('referenceInfoHTML'),C);C.referenceInfoHTML();assert.equal(tables[0].length,1);assert.equal(tables[0][0][0],'person:1');C.infoUI.town=null;C.referenceInfoHTML();assert.equal(tables[1].length,2);assert.equal(tables[1][1][1],'West');assert.equal(JSON.stringify(W),before);
});
test('foreground person navigation uses the same current army record and camera destination',()=>{
  const a={id:3},p={id:7},pick={type:'person',p,a,s:{name:'Home'}},calls=[],cam={},C=vm.createContext({BACKGROUND:null,MODEL_ONLY:true,cam,markManual(){},referenceTarget:()=>({pick}),agentPos:actor=>{assert.equal(actor,a);return{x:12,z:34};},flyTo:(...x)=>calls.push(x),showInspect:pk=>assert.equal(pk,pick)});vm.runInContext(fn('goName'),C);C.goName('p7');assert.equal(cam.follow,a);assert.deepEqual(calls,[[12,34,260]]);
});
function dateRuntime(){const C=vm.createContext({W:Object.freeze({startAD:1066,clock:Object.freeze({day:0})}),SEASONS:Object.freeze(['Spring','Summer','Autumn','Winter'])});vm.runInContext(fn('dateStr')+'\n'+fn('displayDateStr'),C);return C;}
test('card dates before the opening use valid seasons and days across earlier-year boundaries',()=>{
  const C=dateRuntime();for(const [d,expected]of [[-1,'Winter 90, AD 1065'],[-90,'Winter 1, AD 1065'],[-91,'Autumn 90, AD 1065'],[-360,'Spring 1, AD 1065'],[-361,'Winter 90, AD 1064'],[-360.25,'Winter 90, AD 1064'],[-720,'Spring 1, AD 1064']])assert.equal(C.displayDateStr(d),expected);
});
test('card date normalization preserves current/future formatting and world records',()=>{
  const C=dateRuntime(),before=JSON.stringify(C.W);for(let d=0;d<=720;d+=17)assert.equal(C.displayDateStr(d+.25),C.dateStr(d+.25));assert.equal(JSON.stringify(C.W),before);
});
test('a missing card date is stated as unrecorded rather than fabricated as today',()=>{
  const C=dateRuntime();for(const d of [undefined,null,NaN,Infinity])assert.equal(C.displayDateStr(d),'date not recorded');
});
test('Back to a non-inspector view clears inspTarget so half-second refreshes do not reopen the card',async()=>{
  const {C,contextUI,requests,el}=infoRuntime(),route={kind:'drawer',expanded:false,tab:'crown',section:'houses',ledgerOpen:false,scroll:48};
  contextUI.ready=true;contextUI.kind='insp';contextUI.history=[{kind:'chron'},route];
  Object.assign(C,{G:{ledgerOpen:true},crownSection:'overview',inspTarget:{workerCode:'s0'},backgroundApplying:false,uiBusy:()=>false,inspectorPickCode:p=>p?.workerCode||null,
    hideInspect(){C.inspTarget=null;},selectTab(){},setDrawerClosed(){},workerRefreshCourt:()=>Promise.resolve(),setInspectorView(){},showInspect(){assert.fail('must not reopen');}});
  el('contextcontent').focus=()=>{};el('contextback').focus=()=>{};el('inspfollow').style={};
  vm.runInContext([fn('contextBack'),fn('workerShowInspector'),fn('refreshInspect')].join('\n'),C);
  await C.contextBack();assert.equal(C.inspTarget,null);assert.equal(contextUI.kind,'drawer');assert.equal(contextUI.history.length,1);
  C.refreshInspect();assert.equal(requests.length,0);assert.equal(contextUI.kind,'drawer');assert.equal(contextUI.history.length,1);assert.equal(el('contextcontent').scrollTop,48);
});
test('refreshInspect skips non-inspector panels, refreshes project cards in worker mode, and preserves navigation in foreground mode',()=>{
  const {C,contextUI}=infoRuntime(),shown=[];contextUI.ready=true;contextUI.kind='info';contextUI.navigation=5;
  Object.assign(C,{inspTarget:{type:'settlement'},backgroundApplying:false,uiBusy:()=>false,workerShowInspector:()=>assert.fail('inactive inspector'),showInspect:pk=>shown.push([pk.type,C.backgroundApplying])});
  vm.runInContext(fn('refreshInspect'),C);C.refreshInspect();assert.deepEqual(shown,[]);
  contextUI.kind='insp';C.inspTarget={type:'project',key:'p0'};C.refreshInspect();assert.deepEqual(shown,[['project',true]]);assert.equal(C.backgroundApplying,false);
  C.BACKGROUND=null;C.inspTarget={type:'settlement'};C.refreshInspect();assert.deepEqual(shown.at(-1),['settlement',true]);assert.equal(contextUI.navigation,5);
});
test('switching between inspector cards in worker mode resets view, side and scroll while Back restoration keeps them',async()=>{
  const {C,contextUI,requests,el}=infoRuntime(),views=[];contextUI.kind='insp';contextUI.expanded=false;contextUI.side='right';contextUI.scroll.set('insp',140);el('contextcontent').scrollTop=140;
  Object.assign(C,{inspTarget:{workerCode:'s0'},inspectorView:'orders',inspectorPickCode:p=>p?.workerCode||null,setInspectorView:v=>views.push(v),showInspect(){}});
  el('inspfollow').style={};vm.runInContext(fn('workerShowInspector'),C);
  let pending=C.workerShowInspector({workerCode:'s1'});requests[0].resolve({title:'B',sub:'',body:'',actions:''});await pending;
  assert.equal(C.inspectorView,'details');assert.equal(contextUI.side,null);assert.equal(contextUI.scroll.has('insp'),false);assert.equal(el('contextcontent').scrollTop,0);assert.equal(views.at(-1),'details');
  C.inspectorView='orders';contextUI.side='left';contextUI.scroll.set('insp',88);el('contextcontent').scrollTop=88;contextUI.restoring=true;
  pending=C.workerShowInspector({workerCode:'s0'});assert.equal(C.inspectorView,'orders');assert.equal(contextUI.side,'left');assert.equal(el('contextcontent').scrollTop,88);
  requests[1].resolve({title:'A',sub:'',body:'',actions:''});await pending;
});
test('contextShow closes an open drawer when switching to info or inspector panels',()=>{
  const closed=[],drawer={classList:{contains:k=>k==='closed'&&closed.includes(true)}};
  const panel={hidden:true,removeAttribute(){}},content={scrollTop:0,append(c){c.parentElement=this;}},info={parentElement:{id:'old'}};
  const C=vm.createContext({contextUI:{ready:true,kind:'drawer',side:'left',expanded:false,scroll:new Map(),history:[]},CONTEXT_IDS:{drawer:'drawer',info:'infobody'},
    setDrawerClosed:v=>closed.push(v),contextExpand(){},refreshCrownPanel(){},refreshHousePanel(){},contextSync(){},contextPosition(){},
    document:{getElementById:id=>({drawer,contextpanel:panel,contextcontent:content,infobody:info})[id]}});
  vm.runInContext(fn('contextShow'),C);C.contextShow('info');assert.deepEqual(closed,[true]);assert.equal(C.contextUI.kind,'info');
});

