# 好みの顔タイプ診断

男女各40枚の顔画像を使う、ビルド不要の静的Webアプリです。

## 起動

リポジトリのルートで次を実行し、`http://localhost:8000/` を開きます。

```bash
python3 -m http.server 8000
```

公開時は `index.html`、`data/`、`assets/`、`js/` を同じ階層構造で配置してください。
画像・データのURLはページからの相対パスなので、ドメイン直下でも
`/type_checker/` のようなサブディレクトリでも利用できます。
`docs/` の確認ページも公開する場合は、同じ構造で配置してください。
独自ドメインの設定値は `CNAME` の `type_checker.shianstudio.com` です。
`index.html` の `canonical` も `https://type_checker.shianstudio.com/` に合わせています。
公開先を変更するときは、この2か所を更新してください。

## Cloudflare Pagesへの公開

公開URL: [https://type-checker-shianstudio.pages.dev/](https://type-checker-shianstudio.pages.dev/)

2026-09-07にPagesへ公開しました。独自ドメイン `type_checker.shianstudio.com` は
Cloudflare APIにエラー `8000015`（`Domain is invalid`）で拒否され、未設定です。
代替ドメインの確定後に `CNAME` と `canonical` を更新し、PagesのカスタムドメインとDNSを設定してください。
今回使用したWranglerのOAuth認証にはDNSレコードの操作権限がなく、DNS APIは403を返しました。

Pagesプロジェクトは `type-checker-shianstudio`、本番ブランチは `main` です。
Wranglerでログイン済みの環境から、次のコマンドで更新します。

```bash
python3 scripts/build_pages.py
npx wrangler@4.129.0 pages deploy dist --project-name type-checker-shianstudio --branch main
```

未ログインの場合は `npx wrangler@4.129.0 login` を先に実行してください。
公開用の `dist/` には診断画面・画像・データ・確認資料を配置します。
Gitの管理情報、ローカル設定、`Zone.Identifier` は含めません。
これは直接アップロードによる公開です。GitへのpushだけではPagesは更新されません。
独自ドメインはPagesのカスタムドメインとDNSで設定します。`CNAME` ファイル単体では設定されません。

## ファイル構成

- `index.html`: 診断画面。
- `js/face_deck.js`: 未表示の顔を優先する出題・差し替え処理。
- `data/male_faces.js`、`data/female_faces.js`: 本番画像に対応する各40件の特徴量。
- `assets/male/`、`assets/female/`: 本番画像。各1200×1600 PNG。
- `data/previews/`、`assets/previews/`: ver3の男性試作10件、ver4・ver5の男女各10件の記録・画像。
- `data/plans/`: 生成前の計画。`planned_image` は計画当時の保存予定先で、実在画像の参照先は本番データの `image` です。
- `docs/`: 設計資料・生成記録・画像の確認ページ。
- `scripts/`: 生成計画の作成、画像正規化、ファイル整合性の確認。

[本番80枚の一覧](docs/顔画像一覧_ver3.html) / [試作10枚の一覧](docs/男性画像試作_ver3.html)

## 次の生成用設定（ver6・男女各60人）

[男女各60人の設定一覧](docs/顔設定一覧_男女各60人_ver6.html)で、計120人の日本語の特徴と26項目の数値を比較できます。
全120人を「自然な下ろし前髪」に統一。女性は小ぶりな丸形・短い卵型・卵型が各20人、細眉・中程度の眉が各30人です。基準の試作10人にも今回の制約を反映しています。性別・輪郭・目の形などで絞り込み、IDから全設定・プロンプトを確認でき、CSVも保存できます。
今回は設定の作成で、追加画像は未生成です。[設計と保存形式](docs/顔設定一覧_男女各60人_ver6.md)に配分と再作成方法を記載しています。

## 顔の出題順と広告

60枚の場合は、シャッフルした先頭40枚を通常20問分に、残り20枚を差し替え用に確保します。「どっちもタイプじゃない」は回答数とスコアを進めず、41・42枚目から2枚ずつ差し替えます。
差し替え10回分を使った後は、未表示の顔をシャッフルして補充します。未表示の通常枠も先に使い切るため、序盤の11回目で既出の顔へ戻ることはありません。実際に全枚を表示した後に全体を再シャッフルします。
現行の画像は各40枚なので現在は40枚で一巡します。60枚の生成・登録後は同じ処理で60枚を使います。[出題処理](js/face_deck.js)は `node --test scripts/test_face_deck.cjs` で検証できます。

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

[試作20枚の確認ページ](docs/顔画像試作_ver4.html)で、新旧の画像を切り替えて比較できます。
頬のこけを除き、丸顔を小ぶりにし、全体の容姿の水準を引き上げた方向性確認用です。
生成前の計画は男女各40件、今回生成した画像は各10枚です。本番80枚への採用はユーザー確認後に判断します。
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
