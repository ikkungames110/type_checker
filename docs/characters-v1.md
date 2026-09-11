# 顔タイプのキャラクター化

制作日: 2026-09-11。画像生成は **built-in image_gen** を使用。

[キャラクター16体と各タイプの顔5枚を見る](characters.html)。女性・男性を切り替えて、実際の共有結果ページも開ける。

## 見せ方

- トップは女性フレッシュ・男性フレッシュソフトのキャラクター。
- サイトカードは男女8体の集合と「その『好き』に、名前を。」。
- 診断の二択は今までの顔写真。判定後はタイプのキャラクターと名前を主役にする。
- その下に「例えば、こんな顔」と、同じ性別・タイプの異なる5人を並べる。選択済みの写真だけには限定しない。
- 結果のOGPもキャラクター。既存の80共有URLは維持し、各ページに同タイプの5枚を表示する。

写真は実在人物の撮影写真ではなく、従来の架空の成人・全員25歳の生成素材。キャラクターは顔の印象を表す目印であり、性格・職業・年齢の分類には使わない。キャラクター制作時は3文字を未導入。その後、[文字別採点と割合表示](letters-v1.md)を実装しました。

## 生成素材とプロンプト

- 保存先: `assets/characters/v1/<gender>_<type>.png`（16枚、各1254×1254、透過PNG）。
- [全16体の最終プロンプト](../data/character_prompts_v1.json)。生成前に全案を用意し、1体ずつ独立して生成。
- [ファイル・元画像名・ハッシュ・確認記録](../data/type_characters.js)。元画像をそのままコピーし、画像編集や再圧縮はしていない。
- 共通指示: オリジナルの成人デフォルメキャラクター、大きく簡略化した頭部、切り紙のような幾何学的な服と髪、控えめな配色、全身、透明背景、文字・ロゴなし。タイプ別に顔の丸み・目元・髪型・服の輪郭・色を変える。
- 特定サービスのキャラクター画像を入力素材として使用していない。

## 再生成と検証

顔・タイプとキャラクターの対応は `js/type_presentation.js`。キャラの欠落・重複、5枚に満たない場合は別タイプで補わず検出する。

```bash
npm test
node scripts/render_share_cards.cjs
node scripts/render_promotion_card.cjs
# サイトカードを目視確認して data/promotion_card.json の review_status を visual_checked にする
python3 scripts/build_pages.py
python3 -m http.server 8000 --directory dist
npm run test:navigation
```

このWSL環境でChromiumの共有ライブラリが必要な場合、Nodeのコマンドの前に次を付ける。

```bash
LD_LIBRARY_PATH=/home/aoi/src/github.com/ikkungames110/x-follow/.runtime/usr/lib/x86_64-linux-gnu
```

サイトカード・結果カードはHTML/CSSと既存キャラPNGをPlaywrightで描画。生成ツールを再実行する必要はない。キャラ画像・結果名・描画テンプレートが変わったらカードも再生成する。制作・画像・タイプ・メタデータの対応はビルドで検査する。

`npm test` は19件のJavaScriptテストと7件のPythonテスト。80共有ページすべてで、キャラ1体と一致する顔5枚、OGP、旧URLを確認する。PC・スマホのブラウザ検証では、20回選択、結果・5枚の例、再読み込み、同点結果の保存、共有ページを確認する。
