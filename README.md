# 好みの顔タイプ診断

男女各60枚の顔画像（ver6.1）を使う静的Webアプリです。Pythonのビルドで診断画面と顔写真付き共有ページを公開します。

## 起動

リポジトリのルートで次を実行し、`http://localhost:8000/` を開きます。

```bash
python3 scripts/build_pages.py
python3 -m http.server 8000 --directory dist
```

公開時は `dist/` の内容をそのまま配置してください。`index.html`、`data/`、`assets/`、`js/`、生成した `share/` と `robots.txt` が必要です。
画像・データのURLはページからの相対パスなので、ドメイン直下でも
`/type_checker/` のようなサブディレクトリでも利用できます。
`docs/` の確認ページも公開する場合は、同じ構造で配置してください。
独自ドメインの設定値は `CNAME` の `type-checker.shianstudio.com` です。
`index.html` の `canonical` も `https://type-checker.shianstudio.com/` に合わせています。
公開先を変更するときは、この2か所を更新してください。

## Cloudflare Pagesへの公開

公開URL: [https://type-checker.shianstudio.com/](https://type-checker.shianstudio.com/)
PagesのURL: [https://type-checker-shianstudio.pages.dev/](https://type-checker-shianstudio.pages.dev/)

Pagesプロジェクト `type-checker-shianstudio` はGitHubのこのリポジトリと連携しています。
`main` へのpushで自動ビルド・本番公開が始まります。push後はCloudflare Pagesの
該当コミットのProductionデプロイが成功し、公開URLに変更が反映されたことまで確認してください。

Cloudflare Pagesのビルド設定は次のとおりです。

- 本番ブランチ: `main`
- ルートディレクトリ: リポジトリ直下
- ビルドコマンド: `python3 scripts/build_pages.py`
- 出力ディレクトリ: `dist`（`wrangler.jsonc` の `pages_build_output_dir` と一致）

`dist/` はGit管理外です。ビルドコマンドを空にすると `Output directory "dist" not found`
で公開に失敗します。`scripts/build_pages.py` が整合性確認後に公開用ファイルを集めます。

手動で再公開する場合は、Wranglerでログイン済みの環境から次のコマンドを実行します。

```bash
python3 scripts/build_pages.py
npx wrangler@4.129.0 pages deploy dist --project-name type-checker-shianstudio --branch main
```

未ログインの場合は `npx wrangler@4.129.0 login` を先に実行してください。
公開用の `dist/` には診断画面・画像・データ・確認資料を配置します。
Gitの管理情報、ローカル設定、`Zone.Identifier` は含めません。
独自ドメインはPagesのカスタムドメインとDNSで設定します。`CNAME` ファイル単体では設定されません。

## ファイル構成

- `index.html`: 診断画面。
- `js/face_deck.js`: 未表示の顔を優先する出題・差し替え処理。
- `data/male_faces.js`、`data/female_faces.js`: 本番画像に対応する各60件の特徴量・生成記録。
- `assets/male/`、`assets/female/`: 本番画像。各1200×1600 PNG。
- `assets/share/`、`data/share_cards.json`: 本番120人に対応する顔写真付きの共有画像と、元写真・出力画像のハッシュ。
- `data/result_types.js`: 診断と共有ページで共通のタイプ名・判定条件。
- `data/previews/`、`assets/previews/`: ver3の男性試作10件、ver4・ver5の男女各10件の記録・画像。
- `data/plans/`: 生成前の計画。`planned_image` は計画当時の保存予定先で、実在画像の参照先は本番・試作・生成済みデータの `image` です。
- `docs/`: 設計資料・生成記録・画像の確認ページ。
- `scripts/`: 生成計画の作成、画像正規化、ファイル整合性の確認。

[本番120枚の一覧](docs/顔画像一覧_ver6.html) / [試作10枚の一覧](docs/男性画像試作_ver3.html)

## 新しい生成画像と設定（ver6.1・男女各60人）

[本番120枚の画像一覧](docs/顔画像一覧_ver6.html)で、性別・IDによる絞り込みと顔の拡大表示を利用できます。
内蔵 `image_gen` で全員を個別に生成し、1200×1600に正規化しました。画像は `assets/<gender>/`、特徴量・使用プロンプト・生成記録は `data/<gender>_faces.js` に移し、診断と結果表示に採用しています。以前の男女各40枚とその本番データは置き換えました。[制作記録](docs/顔画像生成_ver6.md)に画像への直接リンクがあります。

トップ画面には、このセットの `female_008` と `male_002` を重ねて表示します。初期表示は女性が手前で、「好みの女性を診断」「好みの男性を診断」のホバー・キーボードフォーカスに合わせて、該当する写真がふわっと手前に移ります。移動は680ms、透明度の変化は1000msで、退く写真が透明な間に前後を入れ替えます。ホバーやフォーカスが外れても最後に選んだ写真を保ち、別の性別を操作すると切り替わります。端末の「動きを減らす」設定ではアニメーションを省きます。

[男女各60人の設定一覧](docs/顔設定一覧_男女各60人_ver6.html)で、計120人の日本語の特徴と26項目の数値を比較できます。
全120人を「自然な下ろし前髪」に統一。女性は小ぶりな丸形・短い卵型・卵型が各20人、細眉・中程度の眉が各30人です。基準の試作10人にも今回の制約を反映しています。性別・輪郭・目の形などで絞り込み、IDから全設定・プロンプトを確認でき、CSVも保存できます。
生成前の計画は記録としてそのまま残し、実在画像の参照には生成済みデータの `image` を使用します。[設計と保存形式](docs/顔設定一覧_男女各60人_ver6.md)に配分と再作成方法を記載しています。

## 顔の出題順と広告

60枚の場合は、シャッフルした先頭40枚を通常20問分に、残り20枚を差し替え用に確保します。「どっちもタイプじゃない」は回答数とスコアを進めず、41・42枚目から2枚ずつ差し替えます。
差し替え10回分を使った後は、未表示の顔をシャッフルして補充します。未表示の通常枠も先に使い切るため、序盤の11回目で既出の顔へ戻ることはありません。実際に全枚を表示した後に全体を再シャッフルします。
本番は男女各60枚で一巡します。[出題処理](js/face_deck.js)は `node --test scripts/test_face_deck.cjs` で検証できます。

診断結果には黒地の大きな「Xで結果をシェア」ボタンを配置しています。スマートフォンでは結果の説明直下・顔写真の前に表示します。タイプ名・上位の特徴・顔写真付きの共有URL・ハッシュタグを入れたXの投稿画面を別タブで開きます。[X公式のWeb Intents](https://docs.x.com/x-for-websites/web-intents/overview)を使うリンクで、投稿の確定は利用者がX上で行います。「結果をコピー」も同じ共有URLをコピーします。

共有URLは `share/v6.1/<顔ID>/<タイプID>/` です。ビルド時に120人×6タイプの静的HTMLを生成し、診断結果と同じ写真・タイプ名を表示します。HTMLの先頭に `twitter:card=summary_large_image`、`twitter:image` と [Open Graph](https://ogp.me/) のメタ情報を埋め込むため、JavaScriptを実行しないXのクローラーも顔写真を取得できます。画像は1200×600のJPEGで、元の縦長写真を切り取らずに配置しています。

これは共有URLの画像カードを自動表示する方式です。Web Intentから画像ファイルを直接添付する機能は使用しません。X上の表示タイミングやキャッシュはX側で管理されます。

共有画像はGitに保存してあるため、通常のPagesビルドに画像生成環境は不要です。写真や共有カードのデザインを変えた場合は、次の手順で画像とマニフェストを再作成して一緒にコミットしてください。前回のマニフェストにある古い共有画像も整理します。

```bash
npm ci
npx playwright install --with-deps chromium
npm run render:share-cards
npm test
python3 scripts/build_pages.py
```

テンプレートは `scripts/templates/share_card.html`、書き出し処理は `scripts/render_share_cards.cjs` です。既存Chromiumを使う場合は `SHARE_CARD_CHROMIUM` に実行ファイルを指定できます。ビルド時には共有画像と元写真のハッシュ・件数・サイズも確認し、写真だけ更新されて共有画像が古いままの公開を防ぎます。

PC広告は画面幅800px以上で `pid:85394 / mid:596134 / asid:1943673`、要素ID `im-f9eb908dad6a4cf49b5ea04a2cd2e6f5` を使用します。スマートフォン枠は従来どおり。回答や画面切り替えでは広告タグを再実行しません。

## 最新の試作（ver5・男女各10枚）

[新しい試作20枚の確認ページ](docs/顔画像試作_ver5.html)は、目・眉・鼻・輪郭の差を明確にした男女各10枚です。
一重と二重、目の縦横比、眉の太さ、鼻筋の高さと長さ、顎の幅・形を10系統ずつ設計しました。
「顔を大きく」表示で顔そのものを比較でき、前回の試作にも切り替えられます。
頬のこけを避け、丸顔は小ぶりにする条件と、整った容姿は維持します。

保存先は `assets/previews/v5/<gender>/`、対応する特徴量・最終プロンプトは `data/previews/<gender>_faces_v5.js`。
男女各40件の計画を画像生成前に保存し、その先頭10件ずつを生成しています。
詳細は[ver5制作記録](docs/顔画像試作_ver5.md)にまとめています。

## 前回の試作（ver4・男女各10枚）

[試作20枚の確認ページ](docs/顔画像試作_ver4.html)で、当時の試作を確認できます。削除した旧本番画像との比較機能は終了しました。
頬のこけを除き、丸顔を小ぶりにし、全体の容姿の水準を引き上げた方向性確認用です。
生成前の計画は男女各40件、生成した画像は各10枚です。現在の本番はver6.1の男女各60枚です。
画像は `assets/previews/v4/<gender>/`、最終プロンプト・特徴量・生成記録は
`data/previews/<gender>_faces_v4.js`、詳しい経緯は[制作記録](docs/顔画像試作_ver4.md)に保存しています。

## コピー後の整合性確認

追加パッケージなしで、画像の存在・件数・サイズ・ハッシュ、特徴量、HTMLとMarkdownのローカルリンクを確認できます。

```bash
python3 scripts/check_integrity.py
```

`Zone.Identifier` はWindowsのダウンロード元情報で、アプリには不要です。Gitでは無視します。

## 画像正規化

画像加工を行う場合だけ依存パッケージをインストールします。

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python scripts/normalize_face_asset.py --input /path/to/generated/portrait.png --dest assets/female/female_001.png
```

`--input` と `--dest` の相対パスは実行時のカレントディレクトリを基準にします。
入力を省略すると `~/.codex/generated_images/` 内の最新画像を使うため、別環境からコピーした画像には `--input` を明示してください。
画像を更新するときは対応する特徴量・生成記録・画像ハッシュも更新します。
既存の顔検出器を利用するため、OpenCVは `opencv-python-headless<5` を使用します。
