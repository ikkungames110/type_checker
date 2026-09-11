// 20案のHTMLを1200×630のPNGに書き出す。本番OGPの選択は変更しない。
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {createHash}=require('node:crypto');
const {execFileSync}=require('node:child_process');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
(async()=>{
 const root=path.resolve(__dirname,'..');const output=path.join(root,'docs/character-ogp-assets');
 await fs.mkdir(path.join(output,'cards'),{recursive:true});const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  const base=pathToFileURL(path.join(root,'docs/character-ogp.html'));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base.href+'?render=01');
  const concepts=await page.evaluate(()=>CHARACTER_OGP.concepts);
  if(concepts.length!==20)throw new Error('Expected 20 concepts');
  const cards=[];
  for(const c of concepts){
   await page.goto(base.href+'?render='+c.id);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
   const sources=await page.evaluate(()=>[...document.querySelectorAll('.character')].map(el=>{const c=FACE_CHARACTERS.find(c=>c.id===el.dataset.character);return {id:c.id,code:el.dataset.code,image:c.image,sha256:c.sha256};}));
   for(const source of sources)if(hash(await fs.readFile(path.join(root,source.image)))!==source.sha256)throw new Error('Character hash mismatch: '+source.id);
   const file=`cards/${c.id}-${c.theme}.png`;await page.locator('.ogp-card').screenshot({path:path.join(output,file)});
   const layout=await page.evaluate(()=>{const title=document.querySelector('h1');const rect=title.getBoundingClientRect();const range=document.createRange();range.selectNodeContents(title);return {title: [...range.getClientRects()].map(r=>({x:r.x,y:r.y,right:r.right,bottom:r.bottom})),box:{x:rect.x,right:rect.right,bottom:rect.bottom}};});
   if(layout.title.some(r=>r.right>1170||r.bottom>580||r.x<28))throw new Error('Title outside safe area: '+c.id);
   cards.push({id:c.id,name:c.name,theme:c.theme,group:c.group,title:c.title,sub:c.sub,file,width:1200,height:630,sha256:hash(await fs.readFile(path.join(output,file))),characters:sources});
   console.log(c.id+' '+c.name+' / '+sources.map(s=>s.code).join(', '));
  }
  if(errors.length)throw new Error(errors.join('\n'));
  const manifest={source:'docs/character-ogp.html',method:'Playwright HTML/CSS render using existing character PNGs',code_status:'proposal',render_sources:{}};
  for(const name of ['docs/character-ogp.html','docs/character-ogp-assets/cards.css','docs/character-ogp-assets/gallery.css','docs/character-ogp-assets/concepts.js','docs/character-ogp-assets/app.js'])manifest.render_sources[name]=hash(await fs.readFile(path.join(root,name)));
  manifest.cards=cards;await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  await page.setViewportSize({width:1440,height:1240});
  const tiles=await Promise.all(cards.map(async c=>`<figure><img src="data:image/png;base64,${(await fs.readFile(path.join(output,c.file))).toString('base64')}"><figcaption>${c.id} / ${c.name}</figcaption></figure>`));
  await page.setContent(`<html lang="ja"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:20px;background:#f5f4e9;color:#42513c;font-family:"Noto Sans CJK JP",sans-serif}main{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}figure{margin:0}img{display:block;width:100%}figcaption{font-size:12px;padding:8px 0}h1{font-size:20px;font-weight:400;margin:0 0 20px}</style><h1>キャラと3文字 / OGP 20案</h1><main>${tiles.join('')}</main></html>`);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
  await page.screenshot({path:path.join(output,'contact-sheet.jpg'),type:'jpeg',quality:92,fullPage:true});
  execFileSync('python3',['-c','from pathlib import Path; import sys,zipfile\np=Path(sys.argv[1])\nwith zipfile.ZipFile(p / "cards.zip", "w", zipfile.ZIP_DEFLATED) as z:\n for f in sorted((p / "cards").glob("*.png")): z.write(f, f.name)',output]);
  console.log('20案のPNG・マニフェスト・一覧シート・ZIPを書き出しました。');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
