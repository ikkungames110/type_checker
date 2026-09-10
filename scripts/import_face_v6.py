"""ver6の内蔵画像生成結果を正規化し、計画に対応する特徴量を保存する。"""

import argparse
from copy import deepcopy
from datetime import datetime, timezone
import fcntl
import hashlib
import json
from pathlib import Path
import subprocess
import sys

import cv2

from normalize_face_asset import detect_face, fit_crop_origin


ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--id', required=True)
    parser.add_argument('--input', type=Path, required=True)
    args = parser.parse_args()
    gender = args.id.split('_')[0]
    if gender not in {'male', 'female'}:
        parser.error('IDの性別が不正です')
    production_path = ROOT / f'data/{gender}_faces.js'
    if production_path.exists():
        production = json.loads(production_path.read_text().split('=', 1)[1].strip().removesuffix(';'))
        if any(r.get('asset_version') == 'v6.1' for r in production):
            parser.error('ver6.1は本番採用済みです。新しい生成は別バージョンの計画・保存先で行ってください')
    plan_path = ROOT / f'data/plans/{gender}_faces_v6.json'
    plan = json.loads(plan_path.read_text())
    candidates = [r for r in plan['records'] if r['id'] == args.id]
    if len(candidates) != 1:
        parser.error('計画に存在するIDを指定してください')
    record = deepcopy(candidates[0])
    source = args.input.resolve()
    raw = cv2.imread(str(source))
    if raw is None:
        parser.error(f'画像を読めません: {source}')
    face = detect_face(raw)
    if face is None:
        parser.error('正面顔を検出できません。構図を確認してください')
    x, y, w, h = map(int, face)
    scale = 620 / h
    crop_w, crop_h = 1200 / scale, 1600 / scale
    crop_x, crop_y = x + w / 2 - 600 / scale, y + h / 2 - 610 / scale
    fitted_x, fitted_y = fit_crop_origin(raw, crop_x, crop_y, crop_w, crop_h)
    padding = fitted_x < 0 or fitted_y < 0 or fitted_x + crop_w > raw.shape[1] or fitted_y + crop_h > raw.shape[0]
    destination = ROOT / record['planned_image']
    if destination.exists():
        parser.error(f'既存画像は上書きしません: {destination}')
    subprocess.run([sys.executable, str(ROOT / 'scripts/normalize_face_asset.py'),
                    '--input', str(source), '--dest', str(destination)], check=True)
    record.update(image=record.pop('planned_image'), asset_version='v6.1',
                  review_status='awaiting_visual_check', generation=dict(
                      method='builtin_image_gen', date=datetime.now(timezone.utc).date().isoformat(),
                      source_file=source.name, source_size=[raw.shape[1], raw.shape[0]],
                      source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                      plan_sha256=hashlib.sha256(plan_path.read_bytes()).hexdigest(),
                      face_box=[x, y, w, h], face_detected=True,
                      crop_shift_source_pixels=[round(fitted_x-crop_x, 2), round(fitted_y-crop_y, 2)],
                      padding_required=padding, padding_mode='reflect_101' if padding else 'none',
                      output_size=[1200, 1600],
                      normalizer='scripts/normalize_face_asset.py',
                      image_sha256=hashlib.sha256(destination.read_bytes()).hexdigest()),
                  visual_review=dict(status='pending', shape_calibrated=False,
                                     notes='', unverified_features=[]))
    target = ROOT / f'data/generated/{gender}_faces_v6.js'
    target.parent.mkdir(parents=True, exist_ok=True)
    # 同じ性別の取り込みが同時に完了しても、特徴量を取りこぼさない。
    with plan_path.open() as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        records = json.loads(target.read_text().split('=', 1)[1].strip().removesuffix(';')) if target.exists() else []
        records = [r for r in records if r['id'] != args.id] + [record]
        records.sort(key=lambda r: r['id'])
        target.write_text('// ver6生成画像。形態値は生成目標であり実測値ではない。\n'
                          f'window.{gender.upper()}_FACE_GENERATED_V6 = '
                          + json.dumps(records, ensure_ascii=False, indent=2) + ';\n')
    print(json.dumps(dict(id=args.id, image=record['image'], padding_required=padding)))


if __name__ == '__main__':
    main()
