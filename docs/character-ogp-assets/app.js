(() => {
  'use strict';
  const {concepts,types} = window.CHARACTER_OGP;
  const groups = {quiet:'余白',mystery:'謎めく',talk:'会話',collection:'図鑑'};
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const character = id => {const entry=FACE_CHARACTERS.find(c=>c.id===id);if(!entry)throw new Error('Unknown character: '+id);const type=types.find(t=>t[entry.gender]===entry.type);if(!type)throw new Error('Missing code: '+id);return {...entry,code:type.code,name:type.name};};
  const filename = c => `${c.id}-${c.theme}.png`;
  const imagePath = c => `character-ogp-assets/cards/${filename(c)}`;
  const annotations={sage:'余韻のある顔',midnight:'3 LETTERS / YOUR KIND OF FACE',letterform:'YOUR KIND OF FACE',postcard:'Dear, your favorite.',fieldnote:'A NOTE ON YOUR FAVORITE',floating:'3 LETTERS / 8 TYPES',burgundy:'RCV / 星を射る顔',windows:'A SMALL COLLECTION OF FAVORITES',exchange:'WHAT IS YOUR TYPE?',ticket:'MY FAVORITE / 好みの顔タイプ診断',index:'THE INDEX OF ATTRACTION',whisper:'a little word for your favorite'};
  function cardHtml(c){
    const noLabels=['sage','letterform','fieldnote','orbit','white','petal','ticket'];
    const showBig=['sage','letterform','fieldnote','orbit','white','petal','ticket'];
    const first=character(c.chars[0]);
    return `<article class="ogp-card ${c.theme}" aria-label="${esc(c.title.join(''))}"><span class="brand">好みの顔タイプ診断</span><div class="motif"></div><h1>${c.title.map(esc).join('<br>')}</h1><p class="sub">${esc(c.sub)}</p>${c.chars.map(id=>{const ch=character(id);return `<figure class="character ${noLabels.includes(c.theme)?'no-label':''}" data-character="${ch.id}" data-code="${ch.code}"><img src="../${ch.image}" alt="${ch.classification_label}のキャラクター"><figcaption><b class="code">${ch.code}</b><span class="type-name">${ch.name}</span></figcaption></figure>`;}).join('')}${showBig.includes(c.theme)?`<div class="big-code">${first.code}</div>`:''}${annotations[c.theme]?`<span class="annotation">${annotations[c.theme]}</span>`:''}${c.theme==='midnight'?'<span class="star">✧</span>':''}${c.theme==='postcard'?'<span class="stamp">ACQ</span>':''}<div class="foot"><span>3 LETTERS / 8 FACE TYPES</span><span>SHIAN STUDIO</span></div></article>`;
  }
  window.CHARACTER_OGP.cardHtml=cardHtml;
  window.CHARACTER_OGP.character=character;
  const params=new URLSearchParams(location.search);
  if(params.has('render')){const c=concepts.find(c=>c.id===params.get('render'));if(!c)throw new Error('Unknown concept');document.body.className='render-mode';document.body.innerHTML=cardHtml(c);return;}
  const key='shian-character-ogp-favorites-v1';let saved=new Set();
  try{const previous=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(previous))saved=new Set(previous.filter(id=>concepts.some(c=>c.id===id)));}catch{}
  let filter='all',visible=concepts,activeId=null;
  const dialog=document.getElementById('preview');
  const toast=message=>{const node=document.getElementById('toast');node.textContent=message;node.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove('visible'),2500);};
  const postText=c=>c.post+'\n\nhttps://type-checker.shianstudio.com/top/';
  function render(){
    visible=concepts.filter(c=>filter==='all'||(filter==='saved'?saved.has(c.id):c.group===filter));
    document.getElementById('count').textContent=`${visible.length}案 / 全20案`;
    document.getElementById('empty').hidden=visible.length>0;
    document.getElementById('concepts').innerHTML=visible.map(c=>`<article class="concept" id="concept-${c.id}"><div class="concept-head"><span class="number">${c.id}</span><h3>${esc(c.name)}${c.recommended?'<span class="recommend">おすすめ</span>':''}</h3><button class="save" data-save="${c.id}" aria-pressed="${saved.has(c.id)}" aria-label="${c.id} ${esc(c.name)}を候補に保存">${saved.has(c.id)?'♥ 候補':'♡ 候補に'}</button></div><button class="preview-button" data-preview="${c.id}" aria-label="${c.id} ${esc(c.name)}を拡大"><img src="${imagePath(c)}" width="1200" height="630" loading="lazy" alt="${esc(c.title.join(''))} / ${c.chars.map(id=>character(id).code).join('・')}"></button><div class="meta"><span>${groups[c.group]} · ${c.chars.length}体</span><span>${c.chars.map(id=>character(id).code).join(' / ')}</span></div><p class="note">${esc(c.note)}</p><details><summary>合わせる投稿文</summary><p>${esc(c.post)}</p></details><div class="card-actions"><a href="${imagePath(c)}" download="${filename(c)}">PNGを保存 ↓</a><button class="copy-button" data-copy="${c.id}">投稿文をコピー</button></div></article>`).join('');
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  }
  function show(id){const c=concepts.find(c=>c.id===id);activeId=id;document.getElementById('preview-title').textContent=c.id+' / '+c.name;const img=document.getElementById('preview-image');img.src=imagePath(c);img.alt=c.title.join('')+' / '+c.chars.map(id=>character(id).code).join('・');const a=document.getElementById('preview-download');a.href=imagePath(c);a.download=filename(c);document.getElementById('preview-note').textContent=c.note;const index=visible.findIndex(c=>c.id===id);document.getElementById('position').textContent=`${index+1} / ${visible.length}`;document.getElementById('previous').disabled=index===0;document.getElementById('next').disabled=index===visible.length-1;if(!dialog.open)dialog.showModal();}
  function step(n){const index=visible.findIndex(c=>c.id===activeId);if(visible[index+n])show(visible[index+n].id);}
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));
  document.getElementById('size').addEventListener('change',e=>document.getElementById('concepts').classList.toggle('feed-mode',e.target.value==='feed'));
  document.getElementById('concepts').addEventListener('click',async e=>{
    const preview=e.target.closest('[data-preview]');if(preview){show(preview.dataset.preview);return;}
    const save=e.target.closest('[data-save]');if(save){const id=save.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);try{localStorage.setItem(key,JSON.stringify([...saved]));}catch{toast('この環境では候補はページを閉じるまで保持されます。');}render();document.querySelector(`[data-save="${id}"]`)?.focus({preventScroll:true});return;}
    const copy=e.target.closest('[data-copy]');if(copy){const c=concepts.find(c=>c.id===copy.dataset.copy);try{await navigator.clipboard.writeText(postText(c));toast('投稿文をコピーしました。');}catch{const details=copy.closest('.concept').querySelector('details');details.open=true;const node=details.querySelector('p');node.textContent=postText(c);const range=document.createRange();range.selectNodeContents(node);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);toast('投稿文を選択しました。コピーして使えます。');}}
  });
  document.getElementById('close').addEventListener('click',()=>dialog.close());
  document.getElementById('previous').addEventListener('click',()=>step(-1));document.getElementById('next').addEventListener('click',()=>step(1));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();});
  document.getElementById('type-table').innerHTML=types.map(t=>`<tr><td>${t.code}</td><td>${t.name}</td><td>${character('female_'+t.female).classification_label}</td><td>${character('male_'+t.male).classification_label}</td></tr>`).join('');
  document.querySelectorAll('.editor-note a,.hero-preview').forEach(a=>a.addEventListener('click',()=>{filter='all';render();}));
  render();
  if(location.hash.startsWith('#concept-'))requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
