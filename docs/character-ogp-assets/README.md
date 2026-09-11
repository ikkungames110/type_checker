# キャラ＋3文字のOGP 20案

既存の `assets/characters/v1/` のPNGをそのまま使用し、HTML/CSSをPlaywrightで1200×630のPNGに描画。画像生成による追加のキャラ制作・編集はしていません。

- [20案の比較ページ](../character-ogp.html): 拡大、左右キーによる移動、4方向の絞り込み、候補保存、SNS幅、投稿文コピー、PNG保存。
- [20枚のZIP](cards.zip)、[一覧シート](contact-sheet.jpg)、[出力一覧と使用キャラのハッシュ](manifest.json)。
- `concepts.js`: 20案のコピー・狙い・キャラID、8タイプの仮コード対応。
- `cards.css`: 1200×630のカードの構図。`gallery.css` は比較ページの見た目。
- `app.js`: カードのHTMLと比較ページの操作。

余白・謎めく・会話・図鑑の4方向、5案ずつ。1〜4体のキャラを使用。01・02・03・16を、異なる見せ方を比較する最初の候補にしています。クリック率や拡散率を測定した順位ではありません。SNS幅は360pxを目安とした表示確認で、各SNSの実表示の再現ではありません。

3文字は[前回の表示案](../card-lab-assets/research.md)を引き継ぎ、現在は本番の文字別採点にも導入しています。03と05は専用入口 `/top/03/`・`/top/05/` のOGPにも使っています。[採点と入口の仕様](../letters-v1.md)。

```bash
node scripts/render_character_ogp.cjs
npm run build
python3 -m http.server 8000 --directory dist
```

このWSL環境ではNode実行時に `LD_LIBRARY_PATH=/home/aoi/src/github.com/ikkungames110/x-follow/.runtime/usr/lib/x86_64-linux-gnu` が必要です。

レンダラーは使用キャラのハッシュ、見出しの安全範囲、画像読み込み、JavaScriptエラーを確認し、PNG20枚・マニフェスト・一覧シート・ZIPを出力します。再生成後は全20案を目視確認します。
