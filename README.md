# 好みの顔タイプ診断

全員25歳の設定で個別生成した、男女各40枚（8タイプ×5人）の顔写真を使う静的Webアプリです。結果は3文字コード・キャラクター・同タイプの顔5枚・結果の文字の意味で表示します。[本番サイト](https://type-checker.shianstudio.com/top/) / [キャラクター16体と顔の例](https://type-checker.shianstudio.com/docs/characters.html) / [80枚の比較ページ](docs/face-types-v8.html)

## 出題と採点

- 二択は異なるタイプ同士。最初の20組で40人全員が一度ずつ登場します。
- 20回、好みに近い顔を選びます。ASQの画像なら、ASQのタイプへ1票加算します。
- 8タイプそれぞれの選択回数を集計し、最多のタイプを結果にします。
- 最多が同点の場合は、その中から1タイプを等確率で選び、結果コードを保存します。再読み込み後も同じ結果を表示し、画面では抽選について説明しません。
- 結果には大きなコード、該当キャラ、タイプごとに顔5枚、結果の文字の意味を表示。割合・票数・集計方法の説明・写真の例番号は表示しません。A/R・S/C・Q/Vを左右に並べ、各文字の文章による説明と、結果側の強調を表示します。
- 「どっちもタイプじゃない」は加点せず、両方のタイプを除外候補にします。除外は21組目以降に適用。7タイプ以上が除外されたら、その診断中は全8タイプを使う状態へ戻します。
- 回答・表示中の二択・一巡の残り・除外情報を保存し、再読み込み後も継続します。古い保存済み回答もタイプ別の選択回数で再計算します。

出題は [face_deck.js](js/face_deck.js)、採点は [face_scoring.js](js/face_scoring.js)、男女8タイプのコード・結果名は [result_types.js](data/result_types.js)、3軸の定義は [type_axes.js](data/type_axes.js)。選択カードには画像のみを表示します。分類名は結果タイトルの右下に添え、女性の結果名は「顔」で統一しています。

## 画像

本番画像は `assets/female/`・`assets/male/` に各40枚。対応するタイプ・年齢・全プロンプト・生成記録は [女性データ](data/female_faces.js) と [男性データ](data/male_faces.js) に保存しています。採用したv8以外の顔画像・旧試作・旧共有画像は削除しました。以前の制作資料はGit履歴から確認できます。

トップ画面は `female_011`・`male_011` の顔写真。サイトカードには男女8体を並べています。結果のキャラ16体は `assets/characters/v1/`、顔の例との対応は [type_presentation.js](js/type_presentation.js) にあります。[キャラクター制作・再生成手順](docs/characters-v1.md) / [サイトカードの制作記録](data/promotion_card.json)。写真自体の記録は [v8制作記録](docs/顔タイプ生成_ver8.md) を参照してください。

新しい結果共有URLは `share/letters/<gender>/<コードをハイフンで連結>/`。共有先でも結果コードの文字の意味を表示します。得点クエリは付けず、旧URLのクエリも無視します。男女255通りずつ、510ページを生成し、旧54ページも維持します。既存の54枚のOGPを使用し、追加の同票組み合わせにはトップのキャラクター集合カードを使用します。既存の `share/v8/<顔ID>/<タイプID>/` 80ページも維持し、3文字を追加しています。画像はGitに保存し、通常ビルドでは再生成しません。

```bash
npm ci
npx playwright install --with-deps chromium
npm run render:share-cards
node scripts/render_letter_share_cards.cjs
node scripts/render_promotion_card.cjs
```

## 起動と確認

```bash
npm test
python3 scripts/build_pages.py
python3 -m http.server 8000 --directory dist
npm run test:navigation
```

`http://localhost:8000/` を開きます。`test:navigation` はPC・スマホの診断、再読み込み、履歴、結果共有を確認し、広告通信はモックします。別環境では `SITE_URL` を指定できます。

画面は `/top/`・`/quiz/`・`/result/` の3つ。通常のページ遷移で広告を初期化します。回答・表示中の二択・除外タイプ・一巡の残りは `sessionStorage` の `face-diagnosis:v8` に保存し、再読み込み後も復元します。旧データの診断状態は引き継ぎません。

## サイトカードの比較案

[キャラ＋3文字のOGP 20案](https://type-checker.shianstudio.com/docs/character-ogp)。既存キャラを1〜4体ずつ使用し、余白・謎めく・会話・図鑑の4方向で5案ずつ用意。PNG保存、一覧シート、ZIP、拡大、候補の保存、SNS幅での比較ができます。3文字の対応は診断本体にも導入しました。[制作・再生成手順](docs/character-ogp-assets/README.md)。

[初回の10案×写真あり・なしの比較ページ](https://type-checker.shianstudio.com/docs/card-lab.html)。短い問いかけと静かな雰囲気の20枚、投稿文、3文字で表す8タイプの提案、5つの診断サービスのOGP調査を保存しています。現在はキャラクター版と3文字コードを採用しています。初回の提案として保存した資料です。

ローカルでは `docs/card-lab.html` を開きます。[調査・分類の注意点と再生成手順](docs/card-lab-assets/research.md)を参照してください。

## OGPを切り替える入口

- [03の画像で共有するURL](https://type-checker.shianstudio.com/top/03/) — 好きの小さな本棚。
- [05の画像で共有するURL](https://type-checker.shianstudio.com/top/05/) — ふたつの空気。

どちらも静的HTMLに別々のOGPを持ち、人が開くとJavaScriptで通常のトップへ移動します。通常の `/top/` のOGPは維持しています。初期HTMLとブラウザ遷移を別々に検証します。[3文字の採点・共有・OGP入口の仕様](docs/letters-v1.md)。

## 宣伝PV

[30秒版・15秒版の視聴とダウンロード](https://type-checker.shianstudio.com/docs/promo.html)。YouTube Shorts / TikTok向けの縦1080×1920動画です。実際の操作映像、日本語ナレーション、オリジナルBGMを使用。完成MP4、字幕、サムネイル、投稿文は `assets/promo/`、収録素材と再生成方法は [PV制作記録](marketing/pv/README.md) にあります。

## 公開

Cloudflare PagesはこのGitHubリポジトリに接続されています。`main` へのpushで本番公開されるため、対応するコミットのデプロイ成功と実サイトでの反映を確認します。

- プロジェクト: `type-checker-shianstudio`
- ビルド: `python3 scripts/build_pages.py`
- 出力: `dist`（Git管理外）
- 本番: `https://type-checker.shianstudio.com/`

ビルドは画像の存在・サイズ・ハッシュ・タイプと人数・共有画像・リンクを検査します。`404.html` により、削除済みの旧画像・旧共有ページは404になります。
