import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const driver=fs.readFileSync(new URL('./model-run.cjs',import.meta.url),'utf8');
const start=driver.indexOf('function readModelReport('),end=driver.indexOf('\n}',start)+2;
assert.ok(start>=0&&end>start,'the report reader must remain extractable');
const reader=driver.slice(start,end),readModelReport=vm.runInNewContext('('+reader+')',{fs,JSON,Error});
const identity={srcSHA:'build-a',seed:1001,fate:42,coast:'sea',startAD:1066,km:null};
function fixture(t,report={...identity,windows:[{from:0,to:30,cpuMsPerDay:12}],runs:[{fromTick:0,toTick:30}]}){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'furlong-model-report-'));
  t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'run.json');fs.writeFileSync(file,JSON.stringify(report));return {file,report};
}

test('matching reports retain every previous window and run',t=>{
  const {file,report}=fixture(t),before=fs.readFileSync(file);
  assert.deepEqual(readModelReport(file,{...identity,src:'/different/path/same-build.html'}),report);
  assert.deepEqual(fs.readFileSync(file),before,'reading does not rewrite evidence');
});

for(const [key,value] of Object.entries({srcSHA:'build-b',seed:2002,fate:43,coast:'land',startAD:850,km:6})){
  test(`a different ${key} cannot append to the old report`,t=>{
    const {file}=fixture(t),before=fs.readFileSync(file);
    assert.throws(()=>readModelReport(file,{...identity,[key]:value}),error=>error.message.includes(`(${key})`)&&error.message.includes('choose a new --out path'));
    assert.deepEqual(fs.readFileSync(file),before,'rejected reports remain intact');
  });
}

test('legacy reports without km accept only the default map size',t=>{
  const legacy={...identity};delete legacy.km;const {file}=fixture(t,legacy);
  assert.deepEqual(readModelReport(file,identity),legacy);
  assert.throws(()=>readModelReport(file,{...identity,km:6}),/\(km\)/);
});

test('missing reports remain new and malformed evidence is not overwritten',t=>{
  const {file}=fixture(t);fs.writeFileSync(file,'incomplete report');
  assert.throws(()=>readModelReport(file,identity),SyntaxError);
  assert.equal(fs.readFileSync(file,'utf8'),'incomplete report');
  assert.equal(readModelReport(file+'.missing',identity),null);assert.equal(readModelReport(undefined,identity),null);
  assert.equal(fs.existsSync(file+'.missing'),false);
});

test('the CLI refuses a mismatched report before booting or appending',t=>{
  const source=new URL('../index.html',import.meta.url),srcSHA=createHash('sha256').update(fs.readFileSync(source)).digest('hex');
  const {file}=fixture(t,{...identity,srcSHA}),before=fs.readFileSync(file);
  const result=spawnSync(process.execPath,[fileURLToPath(new URL('./model-run.cjs',import.meta.url)),'--seed','2002','--y','1066','--days','1','--out',file],{encoding:'utf8',timeout:5000});
  assert.equal(result.error,undefined);assert.notEqual(result.status,0);assert.match(result.stderr,/different simulation source\/world \(seed\)/);
  assert.doesNotMatch(result.stderr,/booted/);assert.deepEqual(fs.readFileSync(file),before);
});

test('the report guard and day parts survive the single-file snapshot loader',t=>{
  const {file}=fixture(t),dir=path.dirname(file),script=path.join(dir,'snapshot.cjs'),blob=path.join(dir,'snapshot.blob');
  const parts=driver.match(/^const PARTS=.*$/m)?.[0];assert.ok(parts);
  fs.writeFileSync(script,`const fs=require('node:fs'),path=require('node:path'),BUILD=true,HERE=${JSON.stringify(fileURLToPath(new URL('.',import.meta.url)))};\n${reader}\n${parts}\nrequire('node:v8').startupSnapshot.setDeserializeMainFunction(()=>{const r=readModelReport(${JSON.stringify(file)},${JSON.stringify(identity)});if(r.windows[0].cpuMsPerDay!==12||!PARTS.includes('tickCastles'))throw Error('lost snapshot inputs');process.stdout.write('snapshot report OK');});`);
  const built=spawnSync(process.execPath,['--build-snapshot','--snapshot-blob',blob,script],{encoding:'utf8',timeout:10000});
  assert.equal(built.error,undefined);assert.equal(built.status,0,built.stderr);
  const resumed=spawnSync(process.execPath,['--snapshot-blob',blob],{encoding:'utf8',timeout:10000});
  assert.equal(resumed.error,undefined);assert.equal(resumed.status,0,resumed.stderr);assert.equal(resumed.stdout,'snapshot report OK');
});
