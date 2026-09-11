/* OGP検討用。3文字は本番のresult_types.jsと同じ対応。 */
window.CHARACTER_OGP = {
  types: [
    {code:'ASQ',name:'木漏れ日の顔',female:'cute',male:'charming_soft'},
    {code:'ASV',name:'陽だまりの顔',female:'active_cute',male:'charming_hard'},
    {code:'ACQ',name:'風のような顔',female:'fresh',male:'fresh_soft'},
    {code:'ACV',name:'きらめきの顔',female:'cool_casual',male:'fresh_hard'},
    {code:'RSQ',name:'余韻のある顔',female:'soft_elegant',male:'elegant_soft'},
    {code:'RSV',name:'花ひらく顔',female:'feminine',male:'elegant_hard'},
    {code:'RCQ',name:'月明かりの顔',female:'cool',male:'cool_soft'},
    {code:'RCV',name:'星を射る顔',female:'elegant',male:'cool_hard'}
  ],
  concepts: [
    {id:'01',theme:'sage',group:'quiet',name:'好きの標本',recommended:true,title:['その「好き」に、','名前を。'],sub:'気になる顔を選んで、好みの3文字へ。',chars:['female_soft_elegant'],note:'最初の一枚に。淡いセージと大きなキャラで、診断の世界観を素直に伝える。',post:'「なんとなく好き」に、名前をつけてみる。\n気になる顔を選んで、好みの3文字へ。'},
    {id:'02',theme:'midnight',group:'mystery',name:'月明かりの暗号',recommended:true,title:['なぜか、','気になる。'],sub:'あなたが惹かれる顔は、どんなタイプ？',chars:['female_cool'],note:'深い緑の夜と細い軌道。キャラの顔を見せつつ、コードを小さな謎にする。',post:'理由はうまく言えないけど、なぜか気になる顔。\nあなたの「好き」は、どの3文字？'},
    {id:'03',theme:'shelf',group:'collection',name:'好きの小さな本棚',recommended:true,title:['あなたの「好き」は、どの3文字？'],sub:'好みの顔タイプ診断',chars:['female_cute','female_fresh','female_feminine'],note:'3体だけの小さな図鑑。コードとキャラが一対一で見え、結果の種類を想像しやすい。',post:'ASQ、ACQ、RSV。\n顔の「好き」に、いくつかの呼び名を。あなたはどれだろう。'},
    {id:'04',theme:'letterform',group:'quiet',name:'三文字を、主役に',title:['好きって、こんな輪郭。'],sub:'顔を選んで、あなたのタイプを見つける。',chars:['female_cute'],note:'大きなASQと小さめの一文。タイムラインで縮小されても、3文字が先に目に入る。',post:'自分の「好き」を3文字で言えたら、\nちょっと誰かに話したくなる。'},
    {id:'05',theme:'duet',group:'talk',name:'ふたつの空気',title:['惹かれるのは、どっちの空気？'],sub:'気になる顔を、直感で20回。',chars:['female_active_cute','female_cool_casual'],note:'暖色と寒色に1体ずつ。2つの印象を並べて、選んでみたい気持ちを作る。',post:'ぱっと明るい雰囲気と、さらっと涼しい雰囲気。\n自分が惹かれるのは、どっちだろう。'},
    {id:'06',theme:'postcard',group:'quiet',name:'好きへのポストカード',title:['「どんな顔が好き？」','と聞かれたら。'],sub:'言葉にする前に、選んでみる。',chars:['female_fresh'],note:'一枚の便箋のように。手紙の余白と小さな宛名コードで、個人的な問いにする。',post:'「どんな顔が好き？」の答えを、少し探してみる。\n直感で選ぶ、好みの顔タイプ診断。'},
    {id:'07',theme:'nightgallery',group:'mystery',name:'夜のギャラリー',title:['目が合う前に、気になっていた。'],sub:'惹かれる顔の印象を、3文字に。',chars:['male_elegant_soft','male_cool_soft','male_cool_hard'],note:'3つのアーチを夜の展示室に。落ち着いた男性キャラを選び、静かな余韻を強める。',post:'気づくと目で追ってしまうのは、どんな顔？\n惹かれる印象を、3文字で見つけてみる。'},
    {id:'08',theme:'fieldnote',group:'collection',name:'好みの観察ノート',title:['好みって、','案外知らない。'],sub:'20回選んで、好きの輪郭をたどる。',chars:['male_fresh_soft'],note:'淡い青の方眼と標本ラベル。キャラ・コード・名前を、観察ノートの一項目にする。',post:'自分の好みは分かっている、と思っていたけど。\n選んでみたら、ちょっと意外かもしれない。'},
    {id:'09',theme:'orbit',group:'mystery',name:'余韻の軌道',title:['言葉にできない、','あの感じ。'],sub:'その「好き」を、3文字で。',chars:['female_soft_elegant','male_elegant_soft'],note:'同じRSQの男女キャラを、ひとつの軌道に。中央の大きなコードで印象をまとめる。',post:'華やかさより、あとから思い出すような余韻。\nそんな「好き」にも、呼び名があったら。'},
    {id:'10',theme:'floating',group:'collection',name:'好きのカードを並べる',title:['まだ知らない','「好き」がある。'],sub:'顔を選んで、8つのタイプへ。',chars:['female_cute','female_active_cute','female_fresh'],note:'3枚のキャラカードを、少しずつずらして重ねる。持ち帰れる結果を予感させる。',post:'知っているつもりの「好き」を、もう一度。\n顔を選んで、自分のタイプを眺めてみる。'},
    {id:'11',theme:'burgundy',group:'mystery',name:'一目の余韻',title:['一目で、','心に残る。'],sub:'あなたが惹かれるのは、どんな顔？',chars:['female_elegant'],note:'ワイン色とクリーム色のコントラスト。華やかなキャラを1体だけ、作品のように額装。',post:'一目で心に残る顔には、何があるんだろう。\n直感で選びながら、好みをたどる。'},
    {id:'12',theme:'white',group:'quiet',name:'静かな大文字',title:['好きに、','理由はいらない。'],sub:'20回の選択から、好みの3文字へ。',chars:['male_cool_hard'],note:'白地・黒文字・一体のキャラ。装飾を絞り、3文字と問いをはっきり読ませる。',post:'理由は説明できなくても、選ぶことはできる。\n気になる顔を、直感で20回。'},
    {id:'13',theme:'windows',group:'collection',name:'四つの窓',title:['まだ知らない','「好き」に会う。'],sub:'あなたは、どんな顔に惹かれる？',chars:['female_active_cute','male_charming_soft','female_cool','male_elegant_hard'],note:'4体を色の違う窓に。男女を混ぜても、コードを各キャラの足元に置いて読みやすく。',post:'顔の好みを、ちょっと見比べてみる。\n今まで言葉にしていなかった「好き」が見つかるかも。'},
    {id:'14',theme:'breeze',group:'talk',name:'隣にある好き',title:['気づけば、同じ雰囲気に惹かれる。'],sub:'「なんとなく」を、3文字に。',chars:['female_fresh','male_fresh_soft'],note:'同じACQの男女キャラを余白のある横並びに。色も動きも穏やかな、日常に近い案。',post:'振り返ると、いつも似た雰囲気の顔が好き。\nその「なんとなく」を、少し言葉にしてみる。'},
    {id:'15',theme:'petal',group:'mystery',name:'好きの正体',title:['好きの正体は、','3文字かもしれない。'],sub:'気になる顔から、自分のタイプへ。',chars:['female_feminine'],note:'薄いローズの円と大きなRSV。やわらかい不思議さで、コピーを読みたくなる配置。',post:'好きの正体は、3文字かもしれない。\n気になる顔を選びながら、その輪郭を探す。'},
    {id:'16',theme:'exchange',group:'talk',name:'好きの交換ノート',recommended:true,title:['友だちの「好き」と、','比べてみたい。'],sub:'顔の好みを、3文字で話そう。',chars:['female_cool_casual','male_charming_hard'],note:'2枚の小さな名札を横に添える。結果を見せ合う会話を、すぐ想像できる案。',post:'私はACVが気になる。友だちはASVらしい。\n顔の好みって、話してみるとおもしろい。'},
    {id:'17',theme:'lineup',group:'talk',name:'好きが並ぶ午後',title:['どんな顔が好き？'],sub:'その答えに、3文字の名前を。',chars:['female_cute','male_fresh_soft','female_feminine'],note:'3体をゆったり同じ地面に並べる。パネルを使わず、キャラそのものの親しみやすさを出す。',post:'「どんな顔が好き？」\nいつも曖昧になる答えを、3文字で持ち帰ってみる。'},
    {id:'18',theme:'ticket',group:'quiet',name:'小さな名札',title:['私の「好き」の、','小さな名札。'],sub:'気になる顔を20回選んで、タイプを見つける。',chars:['male_charming_soft'],note:'クリーム色のチケットに一体とASQ。診断のあとに手元に残る一枚を見せる。',post:'自分の「好き」に、小さな名札をつける。\nあとで誰かに見せたくなる、顔タイプ診断。'},
    {id:'19',theme:'index',group:'collection',name:'好きの索引',title:['あなたの「好き」は、','何ていう名前？'],sub:'20回の選択から、3文字の顔タイプへ。',chars:['male_charming_soft','male_elegant_soft','male_cool_soft'],note:'3文字を索引のように縦に並べ、各行にキャラを添える。コードを覚えやすく見せる案。',post:'木漏れ日の顔、余韻のある顔、月明かりの顔。\nあなたが惹かれる印象には、どんな名前が似合うだろう。'},
    {id:'20',theme:'whisper',group:'talk',name:'なんとなく、の合言葉',title:['「なんとなく好き」を、','3文字に。'],sub:'好みの顔タイプ診断',chars:['female_soft_elegant','male_cool_soft'],note:'中央の短いコピーを2体で囲む。ラベンダー色の静けさと、話しかけるような距離感。',post:'うまく説明できない「なんとなく好き」を、3文字に。\nあなたのタイプも、見つけてみる。'}
  ]
};
