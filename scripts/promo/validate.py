"""完成MP4を全フレーム検査し、収録結果と現行データの対応を確認する。"""
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

import cv2
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_share_pages import read_browser_data


def main():
    manifest = json.loads((ROOT / 'marketing/pv/manifest.json').read_text())
    capture_path = ROOT / 'marketing/pv/source/capture.json'
    capture = json.loads(capture_path.read_text())
    types = read_browser_data(ROOT / 'data/result_types.js')
    characters = read_browser_data(ROOT / 'data/type_characters.js')
    assert manifest['captureDate'] == capture['capturedAt']
    for gender, session in capture['sessions'].items():
        faces = read_browser_data(ROOT / f'data/{gender}_faces.js')
        by_id = {face['id']: face for face in faces}
        choices = session['saved']['chosenIds']
        assert len(choices) == 20
        assert sum(e['name'] == 'choice-before' for e in session['events']) == 20
        assert sum(e.get('selector') == '#skipButton' for e in session['events']) == 1
        counts = Counter(by_id[face_id]['type'] for face_id in choices)
        winner = next(t for t in types[gender] if t['code'] == session['resultCode'])
        assert counts[winner['id']] == max(counts.values())
        assert session['saved']['selectedCode'] == winner['code']
        assert session['resultTitle'] == winner['label']
        character = next(c for c in characters if c['gender'] == gender and c['type'] == winner['id'])
        assert session['resultCharacter'] == character['image'] + '?v=' + character['sha256'][:12]
        examples = session['examplePortraits']
        assert len(examples) == len({f['id'] for f in examples}) == 5
        assert {f['id'] for f in examples} == {f['id'] for f in faces if f['type'] == winner['id']}
        for face in examples:
            record = by_id[face['id']]
            assert face['src'] == record['image'] + '?v=' + str(record['asset_version'])
        assert manifest['results'][gender] == {
            'code': winner['code'], 'title': winner['label'],
            'character': session['resultCharacter'], 'examples': examples,
        }

    for name, record in manifest['files'].items():
        raw = (ROOT / 'assets/promo' / name).read_bytes()
        assert len(raw) == record['bytes'] < 25 * 1024 * 1024
        assert hashlib.sha256(raw).hexdigest() == record['sha256']

    report = {'captureSha256': hashlib.sha256(capture_path.read_bytes()).hexdigest(),
              'captureDate': capture['capturedAt'], 'resultMappings': 'passed',
              'manifestHashes': 'passed', 'videos': []}
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    for seconds in (30, 15):
        name = f'type-checker-{seconds}s.mp4'
        path = ROOT / 'assets/promo' / name
        raw = path.read_bytes()
        assert 0 < raw.index(b'moov') < raw.index(b'mdat')
        # 音声も含めて最後まで復号する。壊れたパケットはエラーにする。
        subprocess.run([ffmpeg, '-v', 'error', '-xerror', '-i', str(path), '-f', 'null', '-'], check=True)
        info = subprocess.run([ffmpeg, '-hide_banner', '-i', str(path), '-af',
                               'loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json',
                               '-f', 'null', '-'], capture_output=True, text=True, check=True).stderr
        assert 'Video: h264' in info and 'Audio: aac' in info
        audio = json.loads(re.search(r'\{\s*"input_i".*?\}', info, re.S).group())
        assert -18 < float(audio['input_i']) < -14
        assert float(audio['input_tp']) <= -1.5
        video = cv2.VideoCapture(str(path))
        assert (video.get(cv2.CAP_PROP_FRAME_WIDTH), video.get(cv2.CAP_PROP_FRAME_HEIGHT)) == (1080, 1920)
        assert video.get(cv2.CAP_PROP_FPS) == 30
        frames = 0
        quiz_frames = 0
        while True:
            ok, frame = video.read()
            if not ok:
                break
            assert frame.std() > 12, f'{name}: blank frame {frames}'
            t = frames / 30
            if seconds == 15:
                for start, end in manifest['shortEdits']:
                    if t < end - start:
                        t += start
                        break
                    t -= end - start
            if 3 <= t < 16.5:
                gender = 'male' if 13.5 <= t < 15 else 'female'
                bounds = capture['sessions'][gender]['duelBounds']
                screen_y, crop_y = (470, 0) if t < 10 else (510, 73) if t < 13.5 else (490, 0)
                scale = 870 / 440
                for left, right in ((.08, .42), (.58, .92)):
                    x1, x2 = [round(65 + (bounds['x'] + bounds['width'] * n) * scale) for n in (left, right)]
                    y1, y2 = [round(screen_y + (bounds['y'] - crop_y + bounds['height'] * n) * scale) for n in (.15, .8)]
                    assert frame[y1:y2, x1:x2].std(axis=(0, 1)).mean() > 8, f'{name}: empty choice card {frames}'
                quiz_frames += 1
            frames += 1
        video.release()
        assert frames == seconds * 30
        report['videos'].append({'seconds': seconds, 'dimensions': [1080, 1920],
                                 'fps': 30, 'framesDecoded': frames, 'quizFramesChecked': quiz_frames,
                                 'emptyChoiceCards': 0, 'fullDecode': 'passed',
                                 'audio': audio, 'fastStart': True, **manifest['files'][name]})
        print(f'{name}: {frames} frames, H.264/AAC, {audio["input_i"]} LUFS, passed', flush=True)
    (ROOT / 'marketing/pv/validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
