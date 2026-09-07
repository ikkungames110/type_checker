# 好みの顔タイプ診断

男女各40枚の顔画像を使う、ビルド不要の静的Webアプリです。

## 起動

リポジトリのルートで次を実行し、`http://localhost:8000/` を開きます。

```bash
python3 -m http.server 8000
```

公開時は `index.html`、`data/`、`assets/` を同じ階層構造で配置してください。
画像・データのURLはページからの相対パスなので、ドメイン直下でも
`/type_checker/` のようなサブディレクトリでも利用できます。
`docs/` の確認ページも公開する場合は、同じ構造で配置してください。
公開先URLは固定していません。検索エンジン向けの `canonical` を指定する場合は、公開先の確定後に `index.html` へ追加してください。

## ファイル構成

- `index.html`: 診断画面。
- `data/male_faces.js`、`data/female_faces.js`: 本番画像に対応する各40件の特徴量。
- `assets/male/`、`assets/female/`: 本番画像。各1200×1600 PNG。
- `data/previews/`、`assets/previews/v3/male/`: 男性試作10件の記録と画像。
- `data/plans/`: 生成前の計画。`planned_image` は計画当時の保存予定先で、実在画像の参照先は本番データの `image` です。
- `docs/`: 設計資料・生成記録・画像の確認ページ。
- `scripts/`: 生成計画の作成、画像正規化、ファイル整合性の確認。

[本番80枚の一覧](docs/顔画像一覧_ver3.html) / [試作10枚の一覧](docs/男性画像試作_ver3.html)

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
