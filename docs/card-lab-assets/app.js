/* 比較ページ専用。診断本体のデータ・採点・メタデータは変更しない。 */
(() => {
  'use strict';
  const siteUrl = 'https://type-checker.shianstudio.com/top/';
  const concepts = [
    { id:'01', theme:'moon', name:'月明かりの輪郭', mood:'mystery', recommended:true, title:['なぜか、','目で追ってしまう顔。'], sub:'20回の選択で、好きの輪郭をたどる。', post:'好きな顔って、説明しようとすると難しい。\n直感で20回選ぶと、好みの輪郭が少し見えてきます。', note:'深い緑と細い軌道。静かな不思議さと、診断内容の分かりやすさを両立する第一候補。写真ありではアーチ状の額装で、人物を作品のように見せる。' },
    { id:'02', theme:'paper', name:'まだ名前のない好き', mood:'mystery', title:['その「好き」に、','まだ名前がない。'], sub:'顔を選んで、惹かれるタイプを見つける。', post:'「なんとなく好き」に、名前をつけてみる。\n顔を選んでいく、小さな好みの診断です。', note:'紙の質感を思わせる色と、余白に置いた問い。写真なしは「？」を主役に、写真ありは一枚のプリントとして配置。診断名を残し、何のサイトかは隠さない。' },
    { id:'03', theme:'memo', name:'ふと気づく', mood:'quiet', recommended:true, title:['好みって、','案外知らない。'], sub:'気になる顔を選ぶ、20問。', post:'「自分の好みは分かってる」と思っている人にも。\n気になる顔を選びながら、少し確かめてみませんか。', note:'身近な言い回しとセージ色。疑問を大げさにせず、試すきっかけを渡す。写真ありでも本文と人物の余白を広く取り、圧迫感を抑える。' },
    { id:'04', theme:'choice', name:'理由は、あとで', mood:'quiet', title:['理由はあとで。','まず、どっち？'], sub:'直感で選ぶ、好みの顔タイプ診断。', post:'うまく説明できなくても、選ぶことはできる。\n気になる顔を20回選ぶ診断を作りました。', note:'説明より体験へ誘う案。二つの重なる輪は選択の象徴。写真ありは作中の顔の一例として見せる。実際の二択画面と誤解させるダミーボタンは置かない。' },
    { id:'05', theme:'archive', name:'好きの観測室', mood:'mystery', title:['何度も惹かれる。','そこに、何がある？'], sub:'20回の選択から、好みをたどる。', post:'気になる顔を、ひとつずつ選んでいく。\n最後に、どんなタイプに惹かれたのかを見てみる。', note:'紺色の方眼と輪郭線で、観察ノートのような雰囲気に。研究機関・精密測定を装う数値は使わず、選択を振り返る体験として表現。' },
    { id:'06', theme:'letter', name:'小さな手紙', mood:'quiet', title:['「どんな顔が好き？」','と聞かれたら。'], sub:'言葉にする前に、選んでみる。', post:'「どんな顔が好き？」の答えを、少し探してみる。\n女性・男性を選んで遊べる、顔タイプ診断です。', note:'友人からの一言のような入口。くすんだローズ色と手紙のモチーフで柔らかく。大きなハートや強い恋愛の断定を避け、日常の会話に寄せる。' },
    { id:'07', theme:'code', name:'三文字の暗号', mood:'type', future:true, title:['あなたの「好き」を、','3文字にすると。'], sub:'20回選んで、8つの顔タイプへ。', post:'惹かれる顔の印象を、3文字で。\n20回の選択から、自分の「好き」を見つける診断。', note:'空欄の3文字を、解いてみたくなる仕掛けに。MBTIの名称や科学的な権威は借りず、独自の好みコードとして見せる。コード導入後に使う先行案。' },
    { id:'08', theme:'library', name:'好きの小さな図鑑', mood:'type', recommended:true, future:true, title:['8つの「好き」。','あなたは、どれ？'], sub:'顔を選んで、好みの3文字を見つける。', post:'顔の好みに、8つの呼び名をつけてみました。\n自分と友だちで、どこが同じで、どこが違うんだろう。', note:'ラブキャラの一覧性と、エムグラムの並べて伝える見せ方からの着想。結果の種類が見えるので、比較する会話が始まりやすいと考える。コード導入が前提。' },
    { id:'09', theme:'eclipse', name:'好きの余白', mood:'mystery', title:['なぜ、その顔に','惹かれるんだろう。'], sub:'好みの輪郭をたどる、20回の選択。', post:'顔の好みは、言葉にしきれない。\nまずは直感で選んで、自分の「好き」を眺めてみる。', note:'月食を思わせる円と、暗い青の余白。今回もっとも謎めいた方向。運命や潜在意識を断定せず、自分の選択を眺める体験として着地させる。' },
    { id:'10', theme:'ticket', name:'持ち帰る、好き', mood:'type', future:true, title:['私の「好き」に、','小さな名札を。'], sub:'8つの顔タイプから、好みの3文字へ。', post:'「私はRSQが好き」みたいに、好みを話せたら。\n顔を選んで、自分のタイプを持ち帰る診断。', note:'性格免許証の「結果を一枚の持ち物にする」発想を、控えめな名札に置き換えた案。RSQは結果例で、実際の結果を保証するものではない。コード導入が前提。' }
  ];
  const typeRows = [
    ['ASQ','木漏れ日の顔','親しみやすい柔らかさ。さりげない表情に、つい目が向く。','キュート','チャーミングソフト'],
    ['ASV','陽だまりの顔','柔らかな華やかさ。ぱっと気持ちが明るくなる印象に惹かれる。','アクティブキュート','チャーミングハード'],
    ['ACQ','風のような顔','軽やかで、すっきり。気負わない凛々しさに目が向く。','フレッシュ','フレッシュソフト'],
    ['ACV','きらめきの顔','軽やかさの中の鮮明さ。ひと目で印象に残る顔に惹かれる。','クールカジュアル','フレッシュハード'],
    ['RSQ','余韻のある顔','静かで、柔らかい。控えめなのに、あとから思い出す。','ソフトエレガント','エレガントソフト'],
    ['RSV','花ひらく顔','落ち着いた雰囲気と、柔らかな華やぎ。その余裕に惹かれる。','フェミニン','エレガントハード'],
    ['RCQ','月明かりの顔','静かな存在感。すっきりした表情を、もう少し見ていたい。','クール','クールソフト'],
    ['RCV','星を射る顔','凛とした華やかさ。視線を引きつける、鮮明な印象に惹かれる。','エレガント','クールハード']
  ];
  const axisRows = [
    {name:'01 / 全体の雰囲気',options:[['A','Airy','軽やか'],['R','Refined','落ち着き']]},
    {name:'02 / 顔立ちの印象',options:[['S','Soft','柔らか'],['C','Crisp','凛と']]},
    {name:'03 / 印象の強さ',options:[['Q','Quiet','さりげなさ'],['V','Vivid','華やか']]}
  ];
  const references = [
    {name:'Love Type 系 / ラブキャラ診断64',url:'https://lovecharacter64.jp/',image:'https://lovecharacter64.jp/og-image.png',size:'5000 × 2625（OGメタデータ）',proof:'2026年8月の運営会社発表では、ラブタイプ診断全体で累計1億回・5,000万人。64版単体の数字ではない。',source:'https://prtimes.jp/main/html/rd/p/000000031.000172366.html',observed:'確認したOGPは淡いピンク、丸みのあるロゴ、多数のキャラクター。トップのカード自体には個別の文字コードを並べていない。',lesson:'一覧で「自分はどれ？」を作り、結果はコードと愛称で会話にする。今回の08の着想。',caution:'旧 lovetype16.com は取得時403。現公式チームの64版を観察対象にした。'},
    {name:'16Personalities',url:'https://www.16personalities.com/ja',image:'https://www.16personalities.com/static/images/og/1200x630-homepage.png',size:'1200 × 630',proof:'公式トップに多数の累計診断回数を掲示する定番事例。2026年のSNSカード別の拡散数は未確認。',source:'https://www.16personalities.com/ja',observed:'OGPは多面体風の人物たちが集うイラスト。大きな煽り文句や顔写真を使わず、色と人物群で世界観を揃えている。',lesson:'写真なしでも一目で分かる視覚言語を作る。3文字のコード案では、表示順を固定して覚えやすくする。',caution:'MBTIそのものとは別サービス。今回のコードも独自の顔の印象分類である。'},
    {name:'エムグラム診断',url:'https://mgram.me/ja',image:'https://assets.mgram.me/public/images/fb01.png',size:'1200 × 630',proof:'公式説明では、2017年の開始から世界で1,200万人以上が利用。集計基準日はページに明記されていない。',source:'https://mgram.me/ja/about',observed:'色分けした3×3のタイルと、短いハッシュタグ。結果の要約がそのまま視覚的な主役になっている。',lesson:'結果を一覧で読める形にする。8タイプの一覧や、コード・名前・一文の結果表示に活かす。',caution:'mgramの「8性格」は特徴8要素であり、2×2×2の8分類ではない。'},
    {name:'性格免許証 / ハニホー',url:'https://seikaku.hanihoh.com/license/',image:'https://seikaku.hanihoh.com/license/image/ogimage.png',size:'760 × 412',proof:'2019年の女子大生トレンド調査で、3月の流行として挙げられた過去のヒット事例。現在のバズを示すものではない。',source:'https://prtimes.jp/main/html/rd/p/000000006.000048437.html',observed:'OGPに免許証の結果見本を置き、隣に診断名を大きく表示。受け取れるものがカードを見ただけで分かる。',lesson:'「診断する」だけでなく「結果を持ち帰る」体験を見せる。今回の10の着想。',caution:'観察したのは現在のOGP。2019年当時と同一画像かは未確認。'},
    {name:'悪口診断',url:'https://www.waruguchi16.jp/',image:'https://www.waruguchi16.jp/images/og-v2.png',size:'1200 × 630',proof:'2026年8月6日の運営発表では、累計350万回の診断と、1か月1,945万PV。運営による公表値。',source:'https://prtimes.jp/main/html/rd/p/000000001.000183241.html',observed:'黒い背景、大きなタイトル、赤の強調、16キャラクター。短いテーマと結果の種類が強く伝わる。',lesson:'短いテーマと覚えやすい名前は参考になる。今回の好み診断では、柔らかい問いと言葉に置き換える。',caution:'刺激的なコピーで成功した事例もあるため、「穏やかなほど拡散する」とは結論づけない。'}
  ];
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const cardHtml = (c, variant) => `<div class="preview-frame"><div class="card ${c.theme} ${variant}" role="img" aria-label="${esc(c.title.join(''))} ${esc(c.sub)} ${variant==='photo'?'女性の顔写真あり':'写真なし'}"><span class="brand">SHIAN STUDIO / 好みの顔タイプ診断</span><h4 class="card-title">${c.title.map(esc).join('<br>')}</h4><p class="card-sub">${esc(c.sub)}</p><div class="motif" aria-hidden="true">${c.theme==='library'?typeRows.map(r=>`<span>${r[0]}</span>`).join(''):''}</div>${variant==='photo'?'<img class="portrait" src="../assets/female/female_011.png" alt="" fetchpriority="high">':''}<div class="card-foot"><span>${c.future?'3 LETTERS / 8 TYPES':'20 CHOICES / FACE TYPE'}</span><span>${variant==='photo'?'写真は診断素材の一例':'type-checker.shianstudio.com'}</span></div></div></div>`;
  window.CARD_LAB = {concepts,typeRows,cardHtml};
  const params = new URLSearchParams(location.search);
  if(params.has('render')) {
    const concept = concepts.find(c=>c.id===params.get('render'));
    if(!concept) { document.body.textContent='候補が見つかりません。';return; }
    document.body.className='render-mode';
    document.body.innerHTML=cardHtml(concept,params.get('variant')==='photo'?'photo':'none');
    return;
  }
  const storageKey='shian-card-lab-favorites-v1';
  let saved = new Set();
  try { const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(stored)) saved=new Set(stored.filter(id=>concepts.some(c=>c.id===id))); } catch { /* ストレージ無効でも比較は使える。 */ }
  let view='both',mood='all',feed=false,selectedCode='RSQ';
  const toast = message => {const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600);};
  const postText = c => `${c.post}\n\n${siteUrl}`;
  function renderGallery() {
    const visible=concepts.filter(c=>mood==='all'||(mood==='saved'?saved.has(c.id):c.mood===mood));
    document.getElementById('count').textContent=`${visible.length}案 / ${visible.length*(view==='both'?2:1)}枚`;
    const gallery=document.getElementById('gallery');
    gallery.className=`${view==='both'?'':'single-view'} ${feed?'feed-mode':''}`;
    gallery.innerHTML=visible.map(c=>`<article class="concept" id="concept-${c.id}"><div class="concept-head"><span class="concept-number">${c.id}</span><div class="concept-title"><h3>${c.name}${c.recommended?'<span class="recommend">おすすめ</span>':''}</h3><p>${{mystery:'謎めいた / 好奇心',quiet:'自然・静か / 共感',type:'タイプ・収集 / 会話'}[c.mood]}</p></div>${c.future?'<span class="future-tag">3文字導入後の案</span>':''}<button class="save-button" data-save="${c.id}" aria-label="${c.id} ${c.name}をお気に入りに保存" aria-pressed="${saved.has(c.id)}">${saved.has(c.id)?'♥ 保存済み':'♡ 保存'}</button></div><div class="card-pair">${(view==='both'?['none','photo']:[view]).map(v=>`<div class="variant"><div class="variant-label">${v==='none'?'A / 写真なし':'B / 女性の顔写真あり'}</div><div class="feed-author"><span class="avatar">S</span><div>SHIAN STUDIO<br><small>@shianstudio · 投稿イメージ</small></div></div><p class="feed-text">${esc(c.post)}</p><button class="preview-button" data-open="${c.id}" data-variant="${v}" aria-label="${c.id} ${v==='none'?'写真なし':'女性写真あり'}を拡大">${cardHtml(c,v)}<div class="link-meta"><small>type-checker.shianstudio.com</small><p>${esc(c.title.join(''))} | 好みの顔タイプ診断</p></div></button></div>`).join('')}</div><div class="copy-row"><p><small>投稿文${c.future?' / コード導入後の案':''}</small>${esc(c.post)}</p><button class="copy-button" data-copy="${c.id}">投稿文をコピー ↗</button></div><details><summary>この案の狙い・メタデータ案</summary><p>${esc(c.note)}</p><p>OGタイトル：${esc(c.title.join(''))} | 好みの顔タイプ診断<br>OG説明：${c.future?'2択で気になる顔を20回選び、惹かれる顔の印象を8タイプ・3文字で表示。女性・男性を選べます。':'2択で気になる顔を20回選び、惹かれやすいタイプを見つけるブラウザ診断。女性・男性を選べます。'}</p></details></article>`).join('');
    document.getElementById('empty').hidden=visible.length!==0;
  }
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.view;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderGallery();}));
  document.getElementById('mood-filter').addEventListener('change',event=>{mood=event.target.value;renderGallery();});
  document.getElementById('feed-toggle').addEventListener('click',event=>{feed=!feed;event.currentTarget.setAttribute('aria-pressed',String(feed));event.currentTarget.textContent=feed?'カードだけ見る':'投稿内で見る';renderGallery();});
  document.getElementById('gallery').addEventListener('click',async event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.save){const id=button.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem(storageKey,JSON.stringify([...saved]));}catch{toast('このブラウザでは再読み込み後の保存はできません。');}renderGallery();document.querySelector(`[data-save="${id}"]`)?.focus({preventScroll:true});}
    if(button.dataset.open){const c=concepts.find(c=>c.id===button.dataset.open),v=button.dataset.variant;document.getElementById('dialog-title').textContent=`${c.id} ${c.name} / ${v==='none'?'写真なし':'女性写真あり'}`;document.getElementById('dialog-card').innerHTML=cardHtml(c,v);const download=document.getElementById('download-card');download.href=`card-lab-assets/cards/${c.id}-${v}.png`;download.download=`shian-card-${c.id}-${v}.png`;document.getElementById('card-dialog').showModal();}
    if(button.dataset.copy){const c=concepts.find(c=>c.id===button.dataset.copy);let copied=false;try{if(navigator.clipboard){await navigator.clipboard.writeText(postText(c));copied=true;}}catch{/* ローカルHTML等では下のコピー方法を試す。 */}if(!copied){const area=document.createElement('textarea');area.value=postText(c);area.style.cssText='position:fixed;left:-9999px';document.body.append(area);area.select();try{copied=document.execCommand('copy');}catch{}area.remove();button.focus();}toast(copied?'投稿文とサイトURLをコピーしました。':'コピーできませんでした。表示中の投稿文を選択してコピーしてください。');}
  });
  const dialog=document.getElementById('card-dialog');
  document.getElementById('dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
  function updateType() {
    const row=typeRows.find(r=>r[0]===selectedCode);
    document.getElementById('result-code').textContent=row[0];
    document.getElementById('result-name').textContent=row[1];
    document.getElementById('result-copy').textContent=row[2];
    document.getElementById('result-tags').innerHTML=axisRows.map((axis,i)=>`<span>${axis.options.find(o=>o[0]===selectedCode[i])[2]}</span>`).join('');
    document.querySelectorAll('[data-axis]').forEach(button=>button.setAttribute('aria-pressed',String(selectedCode[Number(button.dataset.axis)]===button.dataset.letter)));
    document.querySelectorAll('[data-type]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.type===selectedCode)));
  }
  document.getElementById('axes').innerHTML=axisRows.map((axis,i)=>`<div class="axis"><span class="axis-title" id="axis-${i}">${axis.name}</span><div class="segmented" role="group" aria-labelledby="axis-${i}">${axis.options.map(([code,english,label])=>`<button data-axis="${i}" data-letter="${code}" aria-pressed="false" title="${english}"><b>${code}</b><span>${label}<br><small>${english}</small></span></button>`).join('')}</div></div>`).join('');
  document.getElementById('type-grid').innerHTML=typeRows.map(row=>`<button class="type-tile" data-type="${row[0]}" aria-pressed="false"><b>${row[0]}</b><h3>${row[1]}</h3><p>${row[2]}</p></button>`).join('');
  document.querySelectorAll('[data-axis]').forEach(button=>button.addEventListener('click',()=>{const code=selectedCode.split('');code[Number(button.dataset.axis)]=button.dataset.letter;selectedCode=code.join('');updateType();}));
  document.querySelectorAll('[data-type]').forEach(button=>button.addEventListener('click',()=>{selectedCode=button.dataset.type;updateType();}));
  document.getElementById('mapping').innerHTML=typeRows.map(row=>`<tr><td>${row[0]}</td><td>${row[3]}</td><td>${row[4]}</td></tr>`).join('');
  document.getElementById('research-list').innerHTML=references.map(ref=>`<article class="reference"><figure><a href="${ref.image}" target="_blank" rel="noopener noreferrer"><img class="reference-image" src="${ref.image}" alt="${esc(ref.name)}の公式OGP画像" loading="lazy" referrerpolicy="no-referrer"></a><figcaption>出典：${esc(ref.name)} 公式サイト / ${esc(ref.size)}<br>参照用の公式OGP画像。画像の権利は各権利者に帰属。</figcaption></figure><div><h3>${esc(ref.name)}</h3><p><b>人気の根拠</b>${esc(ref.proof)} <a href="${ref.source}" target="_blank" rel="noopener noreferrer">出典 ↗</a></p><p><b>OGPの観察</b>${esc(ref.observed)}</p><p><b>今回への解釈</b>${esc(ref.lesson)}</p><p>${esc(ref.caution)}</p><div class="ref-links"><a href="${ref.url}" target="_blank" rel="noopener noreferrer">公式サイト ↗</a><a href="${ref.image}" target="_blank" rel="noopener noreferrer">OGP原画像 ↗</a></div></div></article>`).join('');
  document.querySelectorAll('.reference-image').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const p=document.createElement('p');p.className='small-note';p.textContent='参照画像を読み込めませんでした。「OGP原画像」からご確認ください。';img.parentElement.replaceWith(p);}));
  renderGallery();updateType();
})();
