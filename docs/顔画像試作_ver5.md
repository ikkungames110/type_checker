# 顔画像の試作 ver5：顔立ちの差を明確にした男女各10枚

[20枚の確認ページ](顔画像試作_ver5.html)で「通常」「顔を大きく」「胸元まで」を切り替えられる。[前回のver4](顔画像試作_ver4.html)にも切り替え、全体の似通い方を比較できる。

## 今回の修正

ver4は、容姿を整える指示と全員に小ぶりで穏やかな顔立ちを指定した結果、目・鼻・輪郭が似通った。ver5では部位の違いを弱める指示を除き、各性別で異なる10系統を明示設計した。

- 目：細い一重、奥二重、大きな丸い二重、深い二重、つり目、垂れ目。
- 眉：細い直線、太い直線、細いアーチ、太いアーチ。眉と目の間隔も変更。
- 鼻：短く低い丸い鼻先、細く高い鼻筋、長く立体的な鼻筋、やや幅のある鼻。
- 輪郭：短い丸型、短い卵型、面長、角のある顎、尖り気味の顎、頬骨を幅の基準にする菱形。

頬の自然な厚み、過剰に膨らまない小ぶりな丸顔、整った容姿は共通条件。架空の成人日本人27歳、正面、閉口、灰色の服・背景、リアルな編集写真で統一。目や鼻の違いを一般的なモデル顔へ置換しないことを、プロンプトの優先事項にした。

## 計画・特徴量・実際のプロンプト

画像生成前に男女各40件を保存。10系統それぞれに4人分の特徴量とプロンプトを定義し、今回の画像は各系統の第1人物にあたる先頭10件ずつ。目的抽出であり、診断用の独立した部位配分としての検証は未実施。ver4と同じIDでも別の特徴を持つ新規人物。

- [男性40件の計画](../data/plans/male_faces_v5.json) / [女性40件の計画](../data/plans/female_faces_v5.json)
- [男性10件の選定](../data/previews/male_v5_selection.json) / [女性10件の選定](../data/previews/female_v5_selection.json)
- [男性の特徴量と最終プロンプト](../data/previews/male_faces_v5.js) / [女性の特徴量と最終プロンプト](../data/previews/female_faces_v5.js)
- [計画の再作成スクリプト](../scripts/build_face_plan_v5.py)

内蔵 `image_gen` を使用し、1人につき1回ずつ新規生成。実際に使った最終指示は各レコードの `prompt`。女性002は強いアイラインを除去し、女性004は目の縦幅とアイメイクを修正、男性010は頬骨下の影と凹みを弱める追加編集を実施。編集前の生成指示は `plan_prompt`、参照元ファイル名とSHA-256は `generation` に残す。CLI/APIでの画像生成は使用していない。

## 保存先と正規化

画像は `assets/previews/v5/<gender>/<id>.png`、ブラウザglobalは `data/previews/<gender>_faces_v5.js`。既存の [normalize_face_asset.py](../scripts/normalize_face_asset.py) で1200×1600・顔中心へ正規化する。

一部の生成画像では切り出し範囲が元画像の端を越えたため、従来の端1行・1列の引き伸ばしを近傍画素の反転補完へ変更した。顔の形態はこの処理で変更しない。補完の有無と方式は `generation.padding_required` / `padding_mode` に記録。

[取り込みスクリプト](../scripts/import_face_preview_v4.py)は `--version v5` に対応。編集を伴う場合は `--edit-prompt` と `--reference-image` を指定する。

```bash
.venv/bin/python scripts/import_face_preview_v4.py --version v5 --id male_001 --input /path/to/generated.png
python3 scripts/check_integrity.py
```

## 画像一覧

| 男性 | 女性 |
| --- | --- |
| [male_001](../assets/previews/v5/male/male_001.png) | [female_001](../assets/previews/v5/female/female_001.png) |
| [male_002](../assets/previews/v5/male/male_002.png) | [female_002](../assets/previews/v5/female/female_002.png) |
| [male_003](../assets/previews/v5/male/male_003.png) | [female_003](../assets/previews/v5/female/female_003.png) |
| [male_004](../assets/previews/v5/male/male_004.png) | [female_004](../assets/previews/v5/female/female_004.png) |
| [male_005](../assets/previews/v5/male/male_005.png) | [female_005](../assets/previews/v5/female/female_005.png) |
| [male_006](../assets/previews/v5/male/male_006.png) | [female_006](../assets/previews/v5/female/female_006.png) |
| [male_007](../assets/previews/v5/male/male_007.png) | [female_007](../assets/previews/v5/female/female_007.png) |
| [male_008](../assets/previews/v5/male/male_008.png) | [female_008](../assets/previews/v5/female/female_008.png) |
| [male_009](../assets/previews/v5/male/male_009.png) | [female_009](../assets/previews/v5/female/female_009.png) |
| [male_010](../assets/previews/v5/male/male_010.png) | [female_010](../assets/previews/v5/female/female_010.png) |

## 数値と採用状態

形態26項目と互換10タグは生成目標。画像からの実測値ではなく、`shape_feature_source=generation_target`、`shape_calibrated=false` を保つ。目視で認めた目標との差は各レコードの `visual_review.notes` に保存する。採用判断はユーザー確認前で、本番画像への組み込みは行っていない。

20枚を通常表示と顔拡大表示で比較済み。女性004の目には指定より丸さとアイメイクが残り、女性006の目の開きも指定より大きい。男性005の頬は他より厚め。男性001と004、女性001と008など近い方向の組み合わせは残るが、輪郭や鼻・目の違いを確認し、各画像のメモに記録した。数値の校正と容姿の好み・採用判断は別途必要。

## 検証

- `python3 scripts/check_integrity.py` で本番80件・試作50件の計130枚、画像と特徴量の対応、ハッシュ、ローカルリンクを検証済み。ver5は20枚すべて異なる画像ハッシュ。
- ブラウザで20枚の読み込み、1200×1600、画像下のIDのみの表示、ver4/ver5切り替え、3種類の表示サイズを確認。
- 幅390pxで横にはみ出さず、ブラウザ例外・HTTPエラーなし。
- 余白補完は顔領域を変えないことを配列で確認し、画像端も目視で確認。
