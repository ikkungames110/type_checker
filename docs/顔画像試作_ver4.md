# 顔画像の試作 ver4：男女各10枚

[20枚の確認ページ](顔画像試作_ver4.html)では、新しい試作と同じIDの旧画像を切り替えて比較できる。今回は方向性を確認するための試作で、本番データへの採用前。

## 改訂した条件

- 頬骨から口元まで、自然な軟部組織の厚みとなめらかな曲面を保つ。頬のこけ・深い頬骨の影・骨張りを除く。
- 丸顔の特徴は短い顔と曲線に残し、顎幅と頬の量を抑えた小ぶりな輪郭にする。首・肩も標準的な健康的体格で統一する。
- 全員を主演俳優・美容広告モデル級の整った容姿という共通条件にする。輪郭・目・鼻・眉・口元の組み合わせは、顔全体の調和を優先する。
- 架空の成人日本人27歳、正面・水平・閉口、灰色の服と背景、自然な肌の質感を残したリアルなスタジオ写真。口幅と唇の厚さは既存の小ぶり〜中間の範囲を維持。

## 生成計画と対象

画像生成前に男女各40件の計画を確定した。ver3のID・部位配分を引き継ぎ、8輪郭の文章と9個の輪郭形態値を改訂して、互換10タグを再計算した。今回は各8輪郭を1件ずつ、丸顔と面長卵型を各1件追加した目的抽出で、無作為抽出ではない。

- [男性40件の計画](../data/plans/male_faces_v4.json) / [女性40件の計画](../data/plans/female_faces_v4.json)
- [男性10件の選定](../data/previews/male_v4_selection.json) / [女性10件の選定](../data/previews/female_v4_selection.json)
- [男性の最終プロンプト・特徴量](../data/previews/male_faces_v4.js) / [女性の最終プロンプト・特徴量](../data/previews/female_faces_v4.js)

内蔵 `image_gen` を使用し、各レコードの `prompt` から1人1枚ずつ新規生成。旧画像の人物を維持する編集ではない。各 `prompt` が実際に送信した最終プロンプトで、CLI/APIでの生成は使用していない。

## 保存と正規化

画像は `assets/previews/v4/<gender>/<id>.png`、対応するブラウザglobalは `data/previews/<gender>_faces_v4.js`。全画像を既存の `normalize_face_asset.py --input ... --dest ...` で1200×1600・顔中心へ正規化し、生成元ファイル名とハッシュ、出力ハッシュ、顔検出枠、余白補完の有無を保存する。

取り込みは [import_face_preview_v4.py](../scripts/import_face_preview_v4.py) で実施。顔検出器の互換性のため、依存は `opencv-python-headless<5` に指定した。

```bash
.venv/bin/python scripts/import_face_preview_v4.py --id male_001 --input /path/to/generated.png
python3 scripts/check_integrity.py
```

計画は [build_face_plan_v4.py](../scripts/build_face_plan_v4.py) で再作成可能。未生成の計画は `image=null` と `planned_image` を持ち、実在画像の参照は試作JSの `image` が正本。

## 確認用画像

| 男性 | 女性 |
| --- | --- |
| [male_001](../assets/previews/v4/male/male_001.png) | [female_023](../assets/previews/v4/female/female_023.png) |
| [male_027](../assets/previews/v4/male/male_027.png) | [female_027](../assets/previews/v4/female/female_027.png) |
| [male_003](../assets/previews/v4/male/male_003.png) | [female_034](../assets/previews/v4/female/female_034.png) |
| [male_005](../assets/previews/v4/male/male_005.png) | [female_039](../assets/previews/v4/female/female_039.png) |
| [male_006](../assets/previews/v4/male/male_006.png) | [female_037](../assets/previews/v4/female/female_037.png) |
| [male_008](../assets/previews/v4/male/male_008.png) | [female_015](../assets/previews/v4/female/female_015.png) |
| [male_021](../assets/previews/v4/male/male_021.png) | [female_013](../assets/previews/v4/female/female_013.png) |
| [male_024](../assets/previews/v4/male/male_024.png) | [female_028](../assets/previews/v4/female/female_028.png) |
| [male_028](../assets/previews/v4/male/male_028.png) | [female_012](../assets/previews/v4/female/female_012.png) |
| [male_038](../assets/previews/v4/male/male_038.png) | [female_033](../assets/previews/v4/female/female_033.png) |

## 特徴量の扱い

形態値とタグは生成目標で、画像からの実測値ではない。全体の調和を優先したため、一部の丸顔が短い卵型寄りになるなど、輪郭・目の細さや傾きの差が指定より穏やかに出る場合がある。目視の差は各レコードの `visual_review.notes` に記録する。容姿の水準と好みの比較としての有用性は、この20枚でユーザーに確認してもらう。

診断中のカード表示は既存の画像のみ。今回の試作一覧も、画像と識別用IDを表示し、特徴ラベルや採点タグは表示しない。

## 確認結果

20枚すべてについて生成画像と正規化後の一覧を目視確認し、`visual_review.status=visual_checked` を記録した。頬のこけや過剰な頬の量は見られない。採用の状態は `review_status=awaiting_user_review`、`user_approved=false`。

全20枚で顔検出成功、1200×1600、余白補完0件、完全重複0件。リポジトリ全体の110枚の画像と特徴量・画像ハッシュ・ローカルリンクの整合性チェックも通過した。

Chromiumで男女各10枚の読み込み、新旧切り替え、胸元までの表示切り替え、IDのみのキャプション、幅390pxで横はみ出しがないことを確認。JavaScript例外・HTTPエラーは0件。PCとスマートフォンのスクリーンショットでも一覧の表示を確認した。
