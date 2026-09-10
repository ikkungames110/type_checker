# 「好きな顔、秒で選べる？」宣伝PV

YouTube Shorts / TikTok向けの30秒版と15秒版。1080 × 1920、9:16、30 fps、H.264 / AAC、音声付き。完成動画は `assets/promo/`、視聴・保存ページは `/docs/promo.html`。

## 構成

| 時間 | 内容 |
| --- | --- |
| 0–3秒 | 「好きな顔、秒で選べる？」。サイトのトップで使用している男女の写真 |
| 3–6秒 | 実際の女性診断を操作。「こっち！…いや、こっち！」 |
| 6–10秒 | 実際の「どっちもタイプじゃない」ボタン。「それもアリ！」 |
| 10–13.5秒 | 20回選ぶ操作を早送り |
| 13.5–16.5秒 | 男性・女性の診断画面 |
| 16.5–18.5秒 | 19回選択済みの実画面で結果を待つ演出 |
| 18.5–23秒 | 収録で実際に出た結果の画面と、その結果の写真 |
| 23–26秒 | 女性・男性それぞれの実際の結果を並べる |
| 26–30秒 | サイト名、URL、「今すぐ診断する」 |

15秒版は冒頭、20回選択、男女、結果、CTAを短く再構成しています。音声も尺に合わせて別にミックスしています。

## 素材と編集

- `source/`: 本番サイトをPlaywrightで操作した録画・スクリーンショット。`capture.json` に収録日、出典URL、実際の操作時刻、20回答、スキップ、結果を記録。
- 本番のHTML・診断ロジック・出題・採点・表示コピーは変更せず収録。広告・外部サイトの通信は遮断。本番から取得した画像を録画用のメモリキャッシュで再利用。画像の読み込み前の不要な待ち時間は使っていません。
- 動画編集で画面をトリミング、早送り。写真の読み込み中のフレームは直後の実録画フレームまで詰めています。タップ位置の円、テロップ、紙吹雪は編集で追加。結果は実際に表示された一例で、結果名・分類はスクリーンショットを使用。
- 写真は現行v8のサイト内画像。冒頭・最後は `female_011` と `male_011`。結果写真は `capture.json` に記録された結果と一致。
- `voice/`: Microsoft Edgeオンライン音声合成を [edge-tts](https://github.com/rany2/edge-tts) から利用。標準音声 `ja-JP-NanamiNeural`。既存の人物の声の複製はしていません。文ごとの音源と台本を保存。
- BGM・効果音: 今回のPV用にPython / NumPyで作曲・合成。120 BPM。既存楽曲、外部音楽サンプルは使用していません。
- フォント: Noto Sans CJK。画像と動画の合成はPillow、OpenCV、[FFmpeg](https://ffmpeg.org/)を使用。
- 音声はナレーションに合わせてBGM音量を下げ、`loudnorm` で -16 LUFS / true peak -1.5 dBTP を目標に調整。
- 字幕: 大きなテロップは映像に焼き込み。音声の全文は同梱のSRT / VTTにも収録。
- 公開先で再生を始めやすいようにMP4の `moov` を先頭に配置。各ファイルはCloudflare Pagesの25 MiB制限未満。

## 再生成

通常のサイトビルドは完成済みの素材をコピーするだけで、録画や音声合成は行いません。

```bash
npm ci
npx playwright install --with-deps chromium
python3 -m venv .venv
.venv/bin/python -m pip install -r scripts/promo/requirements.txt

# 必要な場合のみ再収録（本番のランダム出題と実際の回答による結果を使用）
node scripts/promo/capture.cjs

# 保存済み音声がある場合は再利用
.venv/bin/python scripts/promo/voices.py

# NotoSansCJK-Bold.ttc / NotoSansCJK-Regular.ttc の場所を指定
PROMO_FONT_DIR=/path/to/fonts .venv/bin/python scripts/promo/render.py --preview
PROMO_FONT_DIR=/path/to/fonts .venv/bin/python scripts/promo/render.py

npm test
python3 scripts/build_pages.py
```

`PROMO_FONT_DIR` の既定は `~/.local/share/fonts`。中間ファイルの保存先は `PROMO_WORK_DIR`（既定 `/tmp/type-checker-pv`）。確認用の各シーンの静止画、一覧画像、エンコードログ、ミックス音声をここへ出力します。公開元を変更する場合は `PROMO_SITE_URL` を指定します。

`manifest.json` に完成ファイルのサイズ・SHA-256、音声設定、15秒版の編集位置を記録します。動画の再編集後は、完成物と記録をまとめて更新してください。
