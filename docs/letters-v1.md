# 3文字の採点とOGP別入口

## 採点

前回の8タイプ案を採用し、`data/result_types.js` の `code` が顔タイプと3文字の唯一の対応表です。軸は `data/type_axes.js`、集計は `js/face_scoring.js`。

| 軸 | 文字と表示 |
| --- | --- |
| 全体の雰囲気 | A: 軽やか / R: 落ち着き |
| 顔立ちの印象 | S: 柔らか / C: 凛と |
| 印象の強さ | Q: さりげなさ / V: 華やか |

1枚選ぶと、その顔のタイプに1票を加算します。最多のタイプが複数ある場合は、その中から等確率で1タイプを選びます。文字の組み合わせから別タイプを推測しません。スキップは加点しません。

保存済みの回答列から再集計し、`type-votes-v2` の `selectedCode` が最多タイプに含まれる場合は維持します。旧 `winnerId` は無視します。初回に選んだコードを保存するため、再読み込み後も表示と共有先は変わりません。抽選の説明は画面に表示しません。

結果は大きなコード、対応キャラクター、同じタイプの顔5枚を表示。その下にA/R・S/C・Q/Vの両側を文章で説明し、選ばれた側を背景色・枠・ラベルで強調します。割合・票数・集計方法・写真の例番号は表示しません。選択カードは写真のみです。

## 共有

新しい結果は `/share/letters/<gender>/<code>/` を使用します。既存の全非空部分集合・旧文字結果URLと54枚のOGP、80個の顔/タイプ共有URLは維持します。追加の同率タイプ用ページにはトップの宣材画像を使います。旧 `a`・`s`・`q` クエリは無視します。

## OGP別入口

- [03: 好きの小さな本棚](https://type-checker.shianstudio.com/top/03/)
- [05: ふたつの空気](https://type-checker.shianstudio.com/top/05/)

`build_top_variants.py` が個別のOGP付きHTMLを生成します。画像は20案のPNGそのもので、ハッシュを確認して参照。canonical / og:urlは各入口に固定します。JavaScriptで `/top/` へ `location.replace` し、クエリとフラグメントを引き継ぎます。JavaScript無効の場合は通常トップへのリンクを表示します。

初期HTMLに画像情報を残すため、通常トップへのHTTPリダイレクトやmeta refreshは使いません。末尾スラッシュの正規化はCloudflare Pagesの静的ページ処理に従います。[Cloudflareのページ配信仕様](https://developers.cloudflare.com/pages/configuration/serving-pages/)・[リダイレクト設定](https://developers.cloudflare.com/pages/configuration/redirects/)。SNSサービス上でのカードのキャッシュ更新時期まではこの実装から制御しません。

## 再生成・確認

```bash
npm test
node scripts/render_share_cards.cjs
node scripts/render_letter_share_cards.cjs
node scripts/render_character_ogp.cjs
npm run build
python3 -m http.server 8000 --directory dist
npm run test:navigation
```

- `test_face_scoring.cjs`: タイプ別加算、最多候補の集計、同率候補の等確率選択、保存コードの維持・再選択、男女の対応、共有先の検証。
- `test_letter_pages.py`: 2つの入口メタデータ、54共有ページの全キャラ・全タイプの顔5枚、静的OGP。
- `check_navigation.cjs`: PC/スマホ、実際の20回答、出題・スキップ、復元、旧保存の再計算、同率から1タイプの表示、左右の文字説明と強調、シェア先の一致、保存エラー、OGP入口からトップへの移動。広告はモック。
- ビルド: 画像・タイプコード・キャラ・OGP・元データのハッシュとリンクを検証。

このWSL環境のNode実行には `LD_LIBRARY_PATH=/home/aoi/src/github.com/ikkungames110/x-follow/.runtime/usr/lib/x86_64-linux-gnu` を付けます。
