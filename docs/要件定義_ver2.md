# 顔タイプ診断アプリ：特徴量・診断ロジック設計

## 1. アプリ概要

ユーザーに2枚の顔画像を提示し、「どちらの顔が好みか」を選択してもらう。

これを数十回繰り返し、選択された顔画像が持つ特徴量からユーザーの好みを推定する。

最終的には、

> あなたの好きな顔は「クール美人系」です。

のように、人間が直感的に理解できるタイプとして診断結果を表示する。

各顔画像は、事前に定義した特徴量をもとに画像生成AIで生成する。

---

# 2. 設計上の重要方針

画像生成に必要な特徴量と、ユーザーに提示する診断ラベルを同じ粒度にしない。

以下の3階層に分離する。

```text
Level 1: Shape Features
画像生成・比較に使用する細粒度の形態特徴

        ↓ 変換

Level 2: Impression Features
人間が認識する「印象」の特徴

        ↓ 分類

Level 3: Type Labels
ユーザーに提示する最終的な診断タイプ
```

目的は、

* 画像生成では細かく制御できる
* 分析ではユーザーの好みを詳細に保持できる
* 最終結果では直感的で分かりやすい表現ができる

という3つを両立させること。

---

# 3. Level 1: Shape Features

## 3.1 目的

画像生成AIに渡すための、比較的客観的・形態的な特徴量。

「かわいい」「クール」などの抽象的な概念ではなく、可能な限り顔そのものの形状を表現する。

例：

```text
eye_angle
    垂れ目 ←→ つり目

eye_shape
    丸い ←→ 切れ長

eye_size
    小さい ←→ 大きい

eyebrow_angle
    平行 ←→ 角度がある

face_shape
    丸い ←→ 面長

jaw_shape
    丸い ←→ シャープ

nose_height
    低い ←→ 高い

nose_size
    小さい ←→ 大きい

mouth_size
    小さい ←→ 大きい

facial_feature_position
    幼い配置 ←→ 大人っぽい配置
```

実際には20〜30程度の特徴量を持つことを想定する。

---

# 4. Shape Featuresの値

基本的に、形態的に対立関係が成立するものについては一次元の連続値として扱う。

例：

```text
eye_angle = 1
→ 非常に垂れ目

eye_angle = 5
→ 中間

eye_angle = 10
→ 非常につり目
```

あるいは内部的には、

```text
-1.0 ～ +1.0
```

として扱ってもよい。

UIや画像生成プロンプトとの互換性を考えて適切な形式を選択すること。

重要なのは、

```text
垂れ目度
つり目度
```

を別々の独立変数にするのではなく、

```text
垂れ目 ←→ つり目
```

という一つの軸として表現すること。

ただし、これは**物理的・形態的に対立関係が成立する特徴に限定する。**

---

# 5. Level 2: Impression Features

## 5.1 目的

Shape Featuresから、人間が顔を見たときに感じる印象へ変換する。

候補：

```text
cute
cool
mature
youthful
soft
sharp
glamorous
approachable
mysterious
androgynous
```

最終的には6〜10程度に整理する。

---

# 6. Impression Featuresは対立軸にしない

ここはShape Featuresとの重要な違い。

例えば、

```text
かわいい ←→ クール
```

という一本の軸にはしない。

「かわいくてクール」という顔も存在するためである。

したがって、

```text
cute = 0.8
cool = 0.6
mature = 0.7
soft = 0.3
```

のように、それぞれ独立したスコアとして保持する。

原則として、

```text
0.0 ～ 1.0
```

で管理する。

---

# 7. Shape → Impression変換

複数のShape FeaturesからImpression Featuresを算出する。

例えば概念的には、

```text
cool =
    eye_angle * 0.20
  + eye_shape * 0.25
  + jaw_shape * 0.20
  + eyebrow_angle * 0.15
  + facial_feature_position * 0.20
```

のような変換になる。

ただし、初期段階でこの重みが正しいことを前提としない。

PoCでは仮の重みを設定する。

将来的にはユーザーの選択データなどを利用して、重みや変換ロジックを改善できる設計にしておく。

そのため、Shape → Impression変換ロジックをハードコードで各所に分散させないこと。

設定ファイルや専用モジュールとして分離し、後から変更可能にする。

---

# 8. Level 3: Type Labels

最終的にユーザーへ提示する、人間が理解しやすい診断結果。

8種類程度を想定する。

初期候補：

```text
王道かわいい系
清楚系
綺麗なお姉さん系
クール美人系
ミステリアス系
愛嬌系
中性的タイプ
華やかタイプ
```

各タイプはImpression Features上の特徴によって定義する。

例：

```text
クール美人系

cool       : high
mature     : high
sharp      : high
cute       : low-medium
approachable: low-medium
```

単純なif文だけではなく、

「各タイプの代表ベクトルとの距離」

によって最も近いタイプを選択する方式も検討する。

例：

```text
User Impression Vector

cute        = 0.31
cool        = 0.82
mature      = 0.76
soft        = 0.28
sharp       = 0.79
glamorous   = 0.55
approachable = 0.35
mysterious  = 0.68
```

これと各タイプの代表ベクトルを比較し、最も近いタイプを診断結果とする。

---

# 9. ユーザーの好みの算出

各顔画像はShape Featuresを保持している。

例：

```json
{
  "imageId": "face_001",
  "features": {
    "eyeAngle": 0.7,
    "eyeShape": 0.5,
    "eyeSize": 0.2,
    "jawShape": 0.6,
    "noseHeight": 0.3
  }
}
```

ユーザーが二択で選択した画像の特徴量を蓄積する。

ただし、単純に「選択された画像の特徴量を全部足す」だけに依存しない設計にする。

将来的に、

```text
選択画像 - 非選択画像
```

という差分から嗜好を推定する方式や、

Bradley-Terry系のペアワイズ比較モデルなどへ変更できる余地を残す。

PoCでは単純な集計方式でも構わないが、集計処理を独立したモジュールとして実装する。

---

# 10. 診断処理全体

概念的な処理フローは以下。

```text
二択画像表示
    ↓
ユーザーが好みの画像を選択
    ↓
選択結果を保存
    ↓
数十回繰り返す
    ↓
Shape Featuresからユーザーの嗜好ベクトルを算出
    ↓
Shape → Impression変換
    ↓
User Impression Vectorを生成
    ↓
Type Labelとの類似度を計算
    ↓
最も近いタイプを決定
    ↓
診断結果表示
```

---

# 11. 診断結果UI

診断結果を単純に、

> クール美人系

だけで終わらせない。

3段階で情報を表示できる構造にする。

## Primary Result

```text
あなたの好きなタイプは
「クール美人系」
```

## Impression Result

例：

```text
大人っぽさ     82
クールさ       76
シャープさ     71
かわいさ       43
親しみやすさ   38
```

## Detailed Preference

Shape Featuresから特に強い傾向を抽出する。

例：

```text
特に、

・切れ長の目
・ややつり目
・シャープな輪郭

を好む傾向があります。
```

これによって、

「診断としての分かりやすさ」

と

「自分の選択からちゃんと分析された感」

を両立する。

---

# 12. 重要なデータ構造

最低でも以下の概念を分離する。

```text
ShapeFeatureDefinition

ImpressionFeatureDefinition

ShapeToImpressionMapping

TypeDefinition

FaceImage

UserChoice

UserShapePreference

UserImpressionPreference

DiagnosisResult
```

これらを一つの巨大なオブジェクトや処理にまとめない。

---

# 13. 将来的なデータ分析

初期段階では8タイプを人間が仮定義する。

ただし、将来的には実際のユーザーデータを利用する。

大量のUser Impression Vectorが集まったらクラスタリングを行い、

```text
本当にユーザーの好みは8タイプ程度に分類できるのか

どのようなタイプが自然に形成されるのか

各タイプを特徴づけるImpression Featuresは何か
```

を分析する。

その結果によってType Labels自体を変更できるようにする。

したがって、

```text
Type Label
Shape Features
Impression Features
```

を密結合させない。

---

# 14. 設計原則

このシステムでは以下を厳守する。

### 1. 生成と表示を分離する

画像生成用の特徴量を、そのまま診断結果としてユーザーに表示しない。

### 2. Shape / Impression / Typeの3階層にする

```text
Shape Features
↓
Impression Features
↓
Type Labels
```

### 3. Shape Featuresは具体的にする

可能な限り顔の形態そのものを表現する。

### 4. Impression Featuresは人間が理解できる抽象概念にする

「かわいい」「クール」「大人っぽい」など。

### 5. Impression Featuresは原則独立スコアにする

「かわいい ↔ クール」のような無理な二項対立にしない。

### 6. Type Labelは固定ロジックに密結合させない

後からタイプ数・名称・代表ベクトルを変更可能にする。

### 7. 各変換ロジックを交換可能にする

特に、

```text
UserChoice
↓
Shape Preference

Shape Preference
↓
Impression Preference

Impression Preference
↓
Type
```

の3つはそれぞれ独立したロジックとして実装する。

---

# 15. PoCでの優先順位

最初から高度な機械学習を実装する必要はない。

PoCでは以下でよい。

```text
Shape Features
20〜30個

↓

人間が設定した重みによる
Shape → Impression変換

↓

Impression Features
6〜10個

↓

人間が設定した
8タイプの代表ベクトル

↓

ベクトル距離による
タイプ判定
```

まずはこの構造で実際に診断が成立することを確認する。

その後、ユーザーデータが蓄積した段階で、

* Shape → Impressionの重み改善
* ペアワイズ比較による嗜好推定
* クラスタリングによるタイプ再定義
* 診断精度の検証

などを行う。

---

# 16. Codexへの実装指示

既存コードを確認し、現在の実装を可能な限り活かしながら、この設計に適合するようリファクタリング・実装すること。

特に以下を重視する。

1. Shape Features / Impression Features / Type Labelsを明確に分離する。
2. 各特徴量定義を一箇所で管理する。
3. Shape → Impressionの変換ルールを交換可能にする。
4. Impression → Typeの分類ルールを交換可能にする。
5. UserChoice → UserPreferenceの集計方法を交換可能にする。
6. 将来的な機械学習・クラスタリング導入を妨げないデータ構造にする。
7. 診断結果にはTypeだけでなく、Impressionスコアと主要Shape Featuresも含める。
8. 既存コードに不要な大規模変更は行わない。
9. 実装前に既存コードを調査し、変更対象と実装方針を整理する。
10. 不明点について勝手に大きな仕様変更をせず、既存実装と本ドキュメントから合理的に判断する。

最終的な目的は、

> **画像生成に必要な細かい特徴量を維持しながら、ユーザーには直感的で面白い診断結果を提供できるアーキテクチャ**

を構築することである。
