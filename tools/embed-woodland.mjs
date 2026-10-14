// Carry finished woodland assets with the page, including single-file browser previews.
// The growth engine stays in Forestmodeler. Only files used by the renderer are embedded.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function woodlandFiles(){
 const base=path.join(root,'assets/woodland'),library=JSON.parse(fs.readFileSync(path.join(base,'library.json'),'utf8'));
 const files={'library.json':fs.readFileSync(path.join(base,'library.json'),'utf8')},png=name=>{files[name]='data:image/png;base64,'+fs.readFileSync(path.join(base,name)).toString('base64');};
 for(const name of [library.atlas.colour,library.atlas.normal,library.atlas.depth])png(name);
 for(const row of library.plants)for(const lod of row.lods){const name=row.id+'/'+lod.file;files[name]=fs.readFileSync(path.join(base,name),'utf8');png(row.id+'/'+lod.texture);}
 return files;
}
export const scriptSafe=text=>text.replace(/<\/script/gi,'<\\/script');
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const file=path.join(root,'index.html'),source=fs.readFileSync(file,'utf8');
 const body='<script type="text/plain" id="woodlandassets">'+scriptSafe(JSON.stringify(woodlandFiles()))+'</script>\n<script id="woodlandrenderer">\n'+scriptSafe(fs.readFileSync(path.join(root,'assets/woodland-renderer.js'),'utf8'))+'\n</script>';
 const slot=/(?:<script src="assets\/woodland-renderer\.js"><\/script>|<script type="text\/plain" id="woodlandassets">[\s\S]*?<\/script>\s*<script id="woodlandrenderer">[\s\S]*?<\/script>)/;
 if(!slot.test(source))throw Error('Missing woodland embedding slot');
 fs.writeFileSync(file,source.replace(slot,()=>body));
 console.log('woodland embedded: '+body.length+' chars');
}
