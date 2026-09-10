# 顔画像生成 ver6.1 — 男女各60人

[120枚の画像一覧](顔画像一覧_ver6.html) · [設定一覧](顔設定一覧_男女各60人_ver6.html)

ver6.1の男女各60人の設定に基づき、内蔵 `image_gen` で1人につき1枚、計120枚を生成した。プロンプトは計画JSONの各レコードの `prompt` をそのまま使用した。全員が架空の成人日本人27歳、自然な下ろし前髪、正面、無地のスタジオ背景。女性は小ぶりな丸形・短い卵型・卵型と、細〜中程度の眉を指定している。

## 保存先と対応関係

- 画像: `assets/male/`、`assets/female/`
- 生成済み特徴量・使用プロンプト: [男性](../data/male_faces.js)、[女性](../data/female_faces.js)
- 生成前の計画: [男性](../data/plans/male_faces_v6.json)、[女性](../data/plans/female_faces_v6.json)
- 取り込み処理: [import_face_v6.py](../scripts/import_face_v6.py)

2026-09-10に男女各60枚を診断本体へ採用し、旧本番の男女各40枚を置き換えた。生成時の `assets/planned/v6/` から本番の `assets/<gender>/` へ画像を移し、生成済みの特徴量と履歴も `data/<gender>_faces.js` に移した。画像の再生成・再加工や採点用タグの変更は行っていない。

計画JSONは生成前の記録として保存し、`image=null` と当時の `planned_image` を保つ。現在の画像参照は本番データの `image` を使う。取り込みスクリプトは採用済みver6.1の再取り込みを防ぎ、新しい生成を別バージョンで行うよう案内する。

各生成レコードに元画像名、元画像と計画のSHA-256、顔検出位置、正規化後の画像SHA-256を保存した。`scripts/normalize_face_asset.py --input ... --dest ...` により、すべて1200×1600のPNGに揃えた。生成した原画像はCodexの生成先にも残している。

特徴量は生成目標であり、画像からの実測値ではない。`shape_feature_source=generation_target`、`shape_calibrated=false` を保つ。前髪による眉の部分的な隠れは指定どおり許容する。

## 確認用一覧

性別・IDによる絞り込み、通常・顔を大きく・胸元までの表示を利用できる。画像下にはIDだけを表示する。診断中の顔選択カードには特徴ラベルや採点のヒントを表示しない。

## 検証

生成完了時に `python3 scripts/check_integrity.py` が成功。本番採用後は旧80枚を除いた全170枚（本番120枚・試作50枚）について、画像の欠け、1200×1600のサイズ、ハッシュ、対応レコード、ローカルリンクを検証する。本番セットは計画との特徴量・プロンプト一致と、画像ハッシュの一意性も確認する。

全120枚の正面構図、自然な下ろし前髪、輪郭の可視性、文字なしを目視確認し、各レコードの `visual_review` に記録した。形態26項目の数値は実測していないため、`unverified_features` に残している。

男性012と女性051は、正規化時の余白補完により服の端に不自然な模様が出たため、同じプロンプトで再生成した。採用画像を再確認し、初回画像のハッシュと差し替え理由を `generation.discarded_attempts` に記録した。最終120枚のうち14枚は画像端に余白補完を含み、その範囲も確認済み。

Chromiumで一覧ページの全120枚の読み込み、性別・ID検索、該当なしの表示、表示範囲の切り替えを確認した。PC幅1440pxとスマートフォン幅390pxで表示を確認し、横方向のはみ出しとブラウザ例外はなかった。

## 画像への直接リンク

| 男性 | 女性 |
| --- | --- |
| [male_001](../assets/male/male_001.png) | [female_001](../assets/female/female_001.png) |
| [male_002](../assets/male/male_002.png) | [female_002](../assets/female/female_002.png) |
| [male_003](../assets/male/male_003.png) | [female_003](../assets/female/female_003.png) |
| [male_004](../assets/male/male_004.png) | [female_004](../assets/female/female_004.png) |
| [male_005](../assets/male/male_005.png) | [female_005](../assets/female/female_005.png) |
| [male_006](../assets/male/male_006.png) | [female_006](../assets/female/female_006.png) |
| [male_007](../assets/male/male_007.png) | [female_007](../assets/female/female_007.png) |
| [male_008](../assets/male/male_008.png) | [female_008](../assets/female/female_008.png) |
| [male_009](../assets/male/male_009.png) | [female_009](../assets/female/female_009.png) |
| [male_010](../assets/male/male_010.png) | [female_010](../assets/female/female_010.png) |
| [male_011](../assets/male/male_011.png) | [female_011](../assets/female/female_011.png) |
| [male_012](../assets/male/male_012.png) | [female_012](../assets/female/female_012.png) |
| [male_013](../assets/male/male_013.png) | [female_013](../assets/female/female_013.png) |
| [male_014](../assets/male/male_014.png) | [female_014](../assets/female/female_014.png) |
| [male_015](../assets/male/male_015.png) | [female_015](../assets/female/female_015.png) |
| [male_016](../assets/male/male_016.png) | [female_016](../assets/female/female_016.png) |
| [male_017](../assets/male/male_017.png) | [female_017](../assets/female/female_017.png) |
| [male_018](../assets/male/male_018.png) | [female_018](../assets/female/female_018.png) |
| [male_019](../assets/male/male_019.png) | [female_019](../assets/female/female_019.png) |
| [male_020](../assets/male/male_020.png) | [female_020](../assets/female/female_020.png) |
| [male_021](../assets/male/male_021.png) | [female_021](../assets/female/female_021.png) |
| [male_022](../assets/male/male_022.png) | [female_022](../assets/female/female_022.png) |
| [male_023](../assets/male/male_023.png) | [female_023](../assets/female/female_023.png) |
| [male_024](../assets/male/male_024.png) | [female_024](../assets/female/female_024.png) |
| [male_025](../assets/male/male_025.png) | [female_025](../assets/female/female_025.png) |
| [male_026](../assets/male/male_026.png) | [female_026](../assets/female/female_026.png) |
| [male_027](../assets/male/male_027.png) | [female_027](../assets/female/female_027.png) |
| [male_028](../assets/male/male_028.png) | [female_028](../assets/female/female_028.png) |
| [male_029](../assets/male/male_029.png) | [female_029](../assets/female/female_029.png) |
| [male_030](../assets/male/male_030.png) | [female_030](../assets/female/female_030.png) |
| [male_031](../assets/male/male_031.png) | [female_031](../assets/female/female_031.png) |
| [male_032](../assets/male/male_032.png) | [female_032](../assets/female/female_032.png) |
| [male_033](../assets/male/male_033.png) | [female_033](../assets/female/female_033.png) |
| [male_034](../assets/male/male_034.png) | [female_034](../assets/female/female_034.png) |
| [male_035](../assets/male/male_035.png) | [female_035](../assets/female/female_035.png) |
| [male_036](../assets/male/male_036.png) | [female_036](../assets/female/female_036.png) |
| [male_037](../assets/male/male_037.png) | [female_037](../assets/female/female_037.png) |
| [male_038](../assets/male/male_038.png) | [female_038](../assets/female/female_038.png) |
| [male_039](../assets/male/male_039.png) | [female_039](../assets/female/female_039.png) |
| [male_040](../assets/male/male_040.png) | [female_040](../assets/female/female_040.png) |
| [male_041](../assets/male/male_041.png) | [female_041](../assets/female/female_041.png) |
| [male_042](../assets/male/male_042.png) | [female_042](../assets/female/female_042.png) |
| [male_043](../assets/male/male_043.png) | [female_043](../assets/female/female_043.png) |
| [male_044](../assets/male/male_044.png) | [female_044](../assets/female/female_044.png) |
| [male_045](../assets/male/male_045.png) | [female_045](../assets/female/female_045.png) |
| [male_046](../assets/male/male_046.png) | [female_046](../assets/female/female_046.png) |
| [male_047](../assets/male/male_047.png) | [female_047](../assets/female/female_047.png) |
| [male_048](../assets/male/male_048.png) | [female_048](../assets/female/female_048.png) |
| [male_049](../assets/male/male_049.png) | [female_049](../assets/female/female_049.png) |
| [male_050](../assets/male/male_050.png) | [female_050](../assets/female/female_050.png) |
| [male_051](../assets/male/male_051.png) | [female_051](../assets/female/female_051.png) |
| [male_052](../assets/male/male_052.png) | [female_052](../assets/female/female_052.png) |
| [male_053](../assets/male/male_053.png) | [female_053](../assets/female/female_053.png) |
| [male_054](../assets/male/male_054.png) | [female_054](../assets/female/female_054.png) |
| [male_055](../assets/male/male_055.png) | [female_055](../assets/female/female_055.png) |
| [male_056](../assets/male/male_056.png) | [female_056](../assets/female/female_056.png) |
| [male_057](../assets/male/male_057.png) | [female_057](../assets/female/female_057.png) |
| [male_058](../assets/male/male_058.png) | [female_058](../assets/female/female_058.png) |
| [male_059](../assets/male/male_059.png) | [female_059](../assets/female/female_059.png) |
| [male_060](../assets/male/male_060.png) | [female_060](../assets/female/female_060.png) |
