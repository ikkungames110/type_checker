# 好みの顔タイプ診断

全員25歳の設定で個別生成した、男女各40枚（8タイプ×5人）の顔写真を使う静的Webアプリです。[本番サイト](https://type-checker.shianstudio.com/top/) / [80枚の比較ページ](docs/face-types-v8.html)

## 出題と採点

- 二択は必ず異なるタイプ同士。最初の20組で、対象の40枚を重複なくすべて表示します。
- 好きな顔を選ぶと、その顔の `type` に1点。20回選ぶと結果を表示します。特徴量やタグの加算はありません。
- 「どっちもタイプじゃない」は選択回数・得点を増やさず、両方の所属タイプを記録して次の二択へ進みます。
- 21組目以降は、その診断中に一度でも「タイプじゃない」としたタイプを除外します。最初の20組の出題には影響しません。
- 除外が7タイプ以上になった時点で制限を解除し、以降は全8タイプから出題します。
- 追加出題でも、対象タイプの未表示画像を優先します。対象が奇数枚の場合は最後の1枚を優先し、相手を次の一巡から補充するため、同じタイプ同士にはなりません。
- 最多得票のタイプが結果。同率1位の場合は、そのタイプの中から等確率でランダムに選び、結果を保存します。再読み込みで再抽選はしません。結果写真も、そのタイプ内で実際に選んだ画像のうち選択回数が最多のものを使い、同数なら直近の選択を優先します。

出題は [face_deck.js](js/face_deck.js)、採点は [face_scoring.js](js/face_scoring.js)、男女8種類ずつの結果名・説明は [result_types.js](data/result_types.js) にあります。クイズの二択カードには画像だけを表示します。結果には選択回数を出さず、キャッチコピーの右下に「(キュートタイプ)」などの分類名を添えます。女性の結果名は「顔」で統一しています。

## 画像

本番画像は `assets/female/`・`assets/male/` に各40枚。対応するタイプ・年齢・全プロンプト・生成記録は [女性データ](data/female_faces.js) と [男性データ](data/male_faces.js) に保存しています。採用したv8以外の顔画像・旧試作・旧共有画像は削除しました。以前の制作資料はGit履歴から確認できます。

トップ画面は `female_011` と `male_011`。リンク共有時の宣材画像も `female_011` を使い、[制作記録](data/promotion_card.json)を保存しています。詳しくは [v8制作・本番適用記録](docs/顔タイプ生成_ver8.md) を参照してください。

結果共有URLは `share/v8/<顔ID>/<タイプID>/`。所属タイプと一致する80ページのみ生成し、結果と同じ写真・名前を表示します。共有用の80枚のJPEGと宣材PNGはGitに保存し、通常の公開ビルドでは画像を生成しません。共有画像の再作成は次のコマンドです。

```bash
npm ci
npx playwright install --with-deps chromium
npm run render:share-cards
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

## 宣伝PV

[30秒版・15秒版の視聴とダウンロード](https://type-checker.shianstudio.com/docs/promo.html)。YouTube Shorts / TikTok向けの縦1080×1920動画です。実際の操作映像、日本語ナレーション、オリジナルBGMを使用。完成MP4、字幕、サムネイル、投稿文は `assets/promo/`、収録素材と再生成方法は [PV制作記録](marketing/pv/README.md) にあります。

## 公開

Cloudflare PagesはこのGitHubリポジトリに接続されています。`main` へのpushで本番公開されるため、対応するコミットのデプロイ成功と実サイトでの反映を確認します。

- プロジェクト: `type-checker-shianstudio`
- ビルド: `python3 scripts/build_pages.py`
- 出力: `dist`（Git管理外）
- 本番: `https://type-checker.shianstudio.com/`

ビルドは画像の存在・サイズ・ハッシュ・タイプと人数・共有画像・リンクを検査します。`404.html` により、削除済みの旧画像・旧共有ページは404になります。
