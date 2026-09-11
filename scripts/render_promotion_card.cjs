// キャラクター集合のサイトカードを描画し、記録とトップのOGPを同期する。
const {chromium}=require('playwright');
const {readFile,writeFile,mkdir,rename}=require('node:fs/promises');
const {createHash}=require('node:crypto');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const parse=source=>JSON.parse(source.split('=').slice(1).join('=').trim().replace(/;$/,''));
async function main(){
  const all=parse(await readFile(path.join(root,'data/type_characters.js'),'utf8'));
  const ids=['female_cute','female_active_cute','female_fresh','female_cool_casual','male_elegant_soft','male_elegant_hard','male_cool_soft','male_cool_hard'];
  const characters=ids.map(id=>{const item=all.find(c=>c.id===id);if(!item)throw Error(`キャラクターがない: ${id}`);return item;});
  const template='scripts/templates/promotion_card.html';
  const browser=await chromium.launch({headless:true});let bytes;
  try{const page=await browser.newPage({viewport:{width:1200,height:600},deviceScaleFactor:1});await page.goto(pathToFileURL(path.join(root,template)).href);const images=[];for(const c of characters){const data=await readFile(path.join(root,c.image));if(hash(data)!==c.sha256)throw Error(`${c.id}: ハッシュ不一致`);images.push(`data:image/png;base64,${data.toString('base64')}`);}await page.evaluate(async images=>{const target=document.getElementById('characters');for(const src of images){const img=document.createElement('img');img.src=src;img.alt='';target.append(img);}await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));},images);bytes=await page.screenshot({type:'png'});}finally{await browser.close();}
  const imageHash=hash(bytes),image=`assets/promo/home-characters-v1-${imageHash.slice(0,12)}.png`;
  const manifestPath=path.join(root,'data/promotion_card.json');
  const previous=JSON.parse(await readFile(manifestPath,'utf8'));
  await writeFile(path.join(root,image),bytes);
  const manifest={id:'homepage-characters-v1',image,image_sha256:imageHash,width:1200,height:600,source_data:'data/type_characters.js',source_characters:characters.map(c=>({id:c.id,sha256:c.sha256})),generation:{tool:'Playwright HTML render',template,template_sha256:hash(await readFile(path.join(root,template))),prompt:'独自のデフォルメキャラクター8体を並べ、その「好き」に、名前を。という見出しを添える。顔写真は載せない。'},review_status:'pending'};
  await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  const indexPath=path.join(root,'index.html');let html=await readFile(indexPath,'utf8');
  const title='その「好き」に、名前を。 | 好みの顔タイプ診断';
  const description='気になる顔を20回選んで、惹かれるタイプをキャラクターで発見。同じタイプの顔5枚も見られます。女性・男性を選んで診断できます。';
  const alt='デフォルメされた男女8体のキャラクターが並ぶ好みの顔タイプ診断のカード。その「好き」に、名前を。気になる顔を、直感で20回。';
  const values={'og:title':title,'twitter:title':title,'og:description':description,'twitter:description':description,'og:image':`https://type-checker.shianstudio.com/${image}`,'og:image:secure_url':`https://type-checker.shianstudio.com/${image}`,'twitter:image':`https://type-checker.shianstudio.com/${image}`,'og:image:alt':alt,'twitter:image:alt':alt,'og:image:width':'1200','og:image:height':'600'};
  for(const [key,value] of Object.entries(values)){const pattern=new RegExp(`(<meta (?:property|name)="${key}" content=")[^"]*(">)`);if(!pattern.test(html))throw Error(`メタデータがない: ${key}`);html=html.replace(pattern,(_,before,after)=>before+value+after);}
  await writeFile(indexPath,html);
  if(previous.id==='homepage-promotion-v8'){
    // 過去の比較ページに置く旧カードを、公開資産の現行セットから分離する。
    await mkdir(path.join(root,'docs/card-lab-assets'),{recursive:true});
    await rename(path.join(root,previous.image),path.join(root,'docs/card-lab-assets/previous-home.png'));
    const lab=path.join(root,'docs/card-lab.html');await writeFile(lab,(await readFile(lab,'utf8')).replace('../'+previous.image,'card-lab-assets/previous-home.png').replace('現在のサイトカードと比べる','以前のサイトカードと比べる').replace('現在のカード。','以前のカード。'));
  }else if(previous.image!==image){
    // このスクリプト自身の過去出力だけを更新する。
    const {unlink}=require('node:fs/promises');if(/^assets\/promo\/home-characters-v1-[a-f0-9]{12}\.png$/.test(previous.image))await unlink(path.join(root,previous.image));
  }
  console.log(`キャラクターのサイトカードを描画しました: ${image}（目視確認待ち）`);
}
main().catch(error=>{console.error(error);process.exitCode=1});
