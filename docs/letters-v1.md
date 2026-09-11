# 3文字の採点とOGP別入口

## 採点

前回の8タイプ案を採用し、`data/result_types.js` の `code` が顔タイプと3文字の唯一の対応表です。軸は `data/type_axes.js`、集計は `js/face_scoring.js`。

| 軸 | 文字と表示 |
| --- | --- |
| 全体の雰囲気 | A: 軽やか / R: 落ち着き |
| 顔立ちの印象 | S: 柔らか / C: 凛と |
| 印象の強さ | Q: さりげなさ / V: 華やか |

1枚選ぶと、そのタイプの3文字に各1票。各軸の多数を採用し、同点なら両方を使った全組み合わせを表示します。各軸の割合は、その文字の票数 ÷ 20 × 100。スキップは加点しません。

- ASQを8回、ACVを6回、RCQを6回選ぶと、A14/R6・S8/C12・Q14/V6となり、結果は **ACQ**。選択回数が最多のASQではありません。
- ASQを10回、ACQを10回なら **ASQ / ACQ**。S/Cは50%ずつ。
- ASQを10回、RCQを10回なら4タイプ。ASQを10回、RCVを10回なら全8タイプ。

抽選はしません。保存済みの回答列から計算するので、再読み込みや回答順で結果は変わりません。v8の顔とデッキは継続し、同じsessionStorageキーを使います。旧 `winnerId` は無視して再計算。新しい保存には `scoringVersion: letters-v1` を付けます。

結果はコードを大きく表示し、全結果タイプのキャラクターを掲載。各タイプの顔5枚を表示し、複数タイプでは開閉できるグループにします。その下に6文字の割合を載せます。票数・集計方法の説明・写真の例番号は表示しません。選択カードは写真のみです。

## 共有

`/share/letters/<gender>/<codes>/` に、各軸が左優勢・右優勢・同点の27通り×男女＝54ページを生成。キャラと3文字入りのOGPも54枚あります。OGPと結果コードは静的HTMLに含みます。

例: [ASQ / ACQ の共有結果](https://type-checker.shianstudio.com/share/letters/female/ASQ-ACQ/?a=20&s=10&q=20)。`a`・`s`・`q` は各軸の先頭文字の票数で、もう一方は20から引きます。整数0〜20で、復元した結果がページのコードに一致する場合だけ割合を表示。不正値・不足値・矛盾した値の場合は、架空の割合を表示せずタイプの紹介だけを表示します。

割合は訪問者ごとに異なりますが、OGPはそのタイプの共通画像です。以前の80個の共有URLも、キャラ・大きなコード・顔5枚のページとして維持します。旧URLに回答履歴が含まれていないため、割合は追加しません。

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

- `test_face_scoring.cjs`: 文字別加算、タイプの最多票と異なる判定、1/2/3軸同点、男女の対応、割合、共有値の検証。
- `test_letter_pages.py`: 2つの入口メタデータ、54共有ページの全キャラ・全タイプの顔5枚、静的OGP。
- `check_navigation.cjs`: PC/スマホ、実際の20回答、出題・スキップ、復元、旧保存の再計算、同点2/4/8タイプ、割合、シェア先の一致、保存エラー、OGP入口からトップへの移動。広告はモック。
- ビルド: 画像・タイプコード・キャラ・OGP・元データのハッシュとリンクを検証。

このWSL環境のNode実行には `LD_LIBRARY_PATH=/home/aoi/src/github.com/ikkungames110/x-follow/.runtime/usr/lib/x86_64-linux-gnu` を付けます。
