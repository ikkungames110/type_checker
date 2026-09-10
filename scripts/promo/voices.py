"""日本語ナレーションを文ごとに生成し、再編集用の音源を保存する。"""
import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'marketing/pv/voice'
LINES = {
    'hook': '好きな顔、秒で選べる？',
    'left': 'こっち！',
    'right': 'いや、こっち！',
    'neither': 'どっちもタイプじゃない？',
    'okay': 'それもアリ！',
    'twenty': '好きな顔を、20回タップ！',
    'both': '男性も、女性も。',
    'reveal': 'そして、結果は？',
    'reaction': 'え、好み、出ちゃった！',
    'friends': '友だちと比べてみて！',
    'cta': '好みの顔タイプ診断。今すぐ！',
    'cta_short': 'あなたも、診断してみて！',
}


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for key, line in LINES.items():
        destination = OUT / f'{key}.mp3'
        if not destination.exists():
            voice = edge_tts.Communicate(line, 'ja-JP-NanamiNeural', rate='+15%', pitch='+4Hz')
            await voice.save(str(destination))
        print(f'{key}: {line}', flush=True)
    (OUT / 'voices.json').write_text(json.dumps({
        'engine': 'Microsoft Edge online TTS via edge-tts',
        'voice': 'ja-JP-NanamiNeural', 'rate': '+15%', 'pitch': '+4Hz', 'lines': LINES,
    }, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    asyncio.run(main())
