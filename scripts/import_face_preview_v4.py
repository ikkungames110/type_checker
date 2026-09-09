"""内蔵imagegenの出力を正規化し、対応する試作特徴量を一緒に保存する。"""

import argparse
from copy import deepcopy
from datetime import datetime, timezone
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
        parser.error('IDのgenderが不正です')
    selection = json.loads((ROOT / f'data/previews/{gender}_v4_selection.json').read_text())
    if args.id not in selection['ids']:
        parser.error('試作対象のIDではありません')
    plan = json.loads((ROOT / selection['source_plan']).read_text())
    record = deepcopy(next(r for r in plan['records'] if r['id'] == args.id))
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
    subprocess.run([sys.executable, str(ROOT / 'scripts/normalize_face_asset.py'),
                    '--input', str(source), '--dest', str(destination)], check=True)
    record.update(image=record.pop('planned_image'), asset_version='v4-preview',
                  review_status='awaiting_visual_check', generation=dict(
                      method='builtin_image_gen', date=datetime.now(timezone.utc).date().isoformat(),
                      source_file=source.name, source_size=[raw.shape[1], raw.shape[0]],
                      source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                      face_box=[x, y, w, h], face_detected=True,
                      crop_shift_source_pixels=[round(fitted_x-crop_x, 2), round(fitted_y-crop_y, 2)],
                      padding_required=padding, output_size=[1200, 1600],
                      normalizer='scripts/normalize_face_asset.py',
                      image_sha256=hashlib.sha256(destination.read_bytes()).hexdigest()),
                  visual_review=dict(status='pending', shape_calibrated=False,
                                     notes='', unverified_features=[]))
    target = ROOT / f'data/previews/{gender}_faces_v4.js'
    records = json.loads(target.read_text().split('=', 1)[1].strip().removesuffix(';')) if target.exists() else []
    records = [r for r in records if r['id'] != args.id] + [record]
    records.sort(key=lambda r: selection['ids'].index(r['id']))
    target.write_text('// 試作画像の特徴量は生成目標。ユーザー確認前。\n'
                      f'window.{gender.upper()}_FACE_PREVIEW_V4 = '
                      + json.dumps(records, ensure_ascii=False, indent=2) + ';\n')
    print(f'{args.id}: 特徴量保存、padding_required={padding}')


if __name__ == '__main__':
    main()
