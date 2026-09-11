// 各軸の単独・同点を組み合わせた27通り×男女の結果OGP。
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const parse=source=>JSON.parse(source.slice(source.indexOf('=')+1).trim().replace(/;$/,''));
(async()=>{
 const template='scripts/templates/letter_share_card.html';
 const types=parse(await fs.readFile(path.join(root,'data/result_types.js'),'utf8'));
 const axes=parse(await fs.readFile(path.join(root,'data/type_axes.js'),'utf8'));
 const chars=parse(await fs.readFile(path.join(root,'data/type_characters.js'),'utf8'));
 const combinations=axes.reduce((states,axis)=>states.flatMap(state=>[[axis.options[0].letter],[axis.options[1].letter],axis.options.map(o=>o.letter)].map(options=>[...state,options])),[[]]);
 const manifestPath=path.join(root,'data/letter_share_cards.json');let previous=[];try{previous=JSON.parse(await fs.readFile(manifestPath,'utf8')).cards;}catch(e){if(e.code!=='ENOENT')throw e;}
 const browser=await chromium.launch({headless:true});const cards=[];
 try{
  const page=await browser.newPage({viewport:{width:1200,height:600},deviceScaleFactor:1});
  await page.goto(pathToFileURL(path.join(root,template)).href);await page.evaluate(()=>document.fonts.ready);
  for(const gender of ['female','male']){
   const directory=`assets/share/letters/${gender}`;await fs.mkdir(path.join(root,directory),{recursive:true});
   for(const combo of combinations){
    const codes=combo.reduce((prefixes,letters)=>prefixes.flatMap(prefix=>letters.map(letter=>prefix+letter)),['']);
    const winners=codes.map(code=>types[gender].find(type=>type.code===code));
    const characters=winners.map(type=>chars.find(c=>c.gender===gender&&c.type===type.id));
    const images=await Promise.all(characters.map(async c=>{const b=await fs.readFile(path.join(root,c.image));if(hash(b)!==c.sha256)throw new Error('Character hash mismatch: '+c.id);return 'data:image/png;base64,'+b.toString('base64');}));
    await page.evaluate(async({gender,codes,winners,images})=>{
     document.body.classList.toggle('dense',codes.length>=4);
     document.getElementById('target').textContent=`私が惹かれる${gender==='female'?'女性':'男性'}の顔のタイプ`;
     const target=document.getElementById('codes');target.className='codes count-'+codes.length;target.replaceChildren();
     codes.forEach((code,index)=>{if(index){const sep=document.createElement('i');sep.textContent='/';target.append(sep);}const span=document.createElement('span');span.textContent=code;target.append(span);});
     document.getElementById('type-title').textContent=codes.length===1?winners[0].label:`${codes.length}つのタイプに、心が動く。`;
     const group=document.getElementById('characters');group.className='characters count-'+codes.length;group.replaceChildren();
     images.forEach((image,index)=>{const figure=document.createElement('figure');const img=document.createElement('img');img.src=image;img.alt=codes[index];const caption=document.createElement('figcaption');caption.textContent=codes[index];figure.append(img,caption);group.append(figure);});
     await Promise.all([...document.images].map(img=>img.decode()));
    },{gender,codes,winners,images});
    const outside=await page.evaluate(()=>[...document.querySelectorAll('.copy>*')].some(el=>el.getBoundingClientRect().bottom>570||el.getBoundingClientRect().top<28));if(outside)throw new Error('Result text overflow: '+codes.join('-'));
    const bytes=await page.screenshot({type:'jpeg',quality:90});const sha=hash(bytes);const key=codes.join('-');const image=`${directory}/${key}-${sha.slice(0,12)}.jpg`;await fs.writeFile(path.join(root,image),bytes);
    cards.push({gender,codes,key,image,image_sha256:sha,width:1200,height:600,types:winners.map(t=>({id:t.id,code:t.code,label:t.label,classification_label:t.classification_label})),characters:characters.map(c=>({id:c.id,sha256:c.sha256}))});
   }
   console.log(gender+': 単独・同点を含む27通りの共有画像');
  }
 }finally{await browser.close();}
 await fs.writeFile(manifestPath,JSON.stringify({template,template_sha256:hash(await fs.readFile(path.join(root,template))),cards},null,2)+'\n');
 const current=new Set(cards.map(c=>c.image));for(const old of previous)if(!current.has(old.image)&&/^assets\/share\/letters\/(female|male)\/[A-Z-]+-[a-f0-9]{12}\.jpg$/.test(old.image))await fs.unlink(path.join(root,old.image)).catch(e=>{if(e.code!=='ENOENT')throw e;});
})().catch(e=>{console.error(e);process.exitCode=1;});
