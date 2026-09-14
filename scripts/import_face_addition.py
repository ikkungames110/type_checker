"""内蔵 image_gen の出力を既存と同じ方法で正規化し、候補の生成記録を更新する。"""

import argparse
import hashlib
import json
from pathlib import Path

import cv2
from normalize_face_asset import normalize

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data/previews/face_additions_v8.json"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("identity")
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text())
    record = next(r for r in manifest["records"] if r["id"] == args.identity)
    destination = ROOT / record["image"]
    if destination.exists():
        raise SystemExit(f"既存の候補を上書きしません: {destination}")
    original = cv2.imread(str(args.source), cv2.IMREAD_COLOR)
    if original is None:
        raise SystemExit(f"画像を読み込めません: {args.source}")
    normalized, detected = normalize(original)
    if not detected:
        raise SystemExit(f"顔を検出できません: {args.source}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not cv2.imwrite(str(destination), normalized):
        raise SystemExit(f"画像を保存できません: {destination}")
    record["status"] = "generated"
    record["generation"].update({
        "source_file": args.source.name,
        "source_sha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
        "normalizer": "scripts/normalize_face_asset.py",
        "normalizer_sha256": hashlib.sha256((ROOT / "scripts/normalize_face_asset.py").read_bytes()).hexdigest(),
        "face_detected": detected,
        "image_sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
    })
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"{args.identity}: 1200×1600、顔検出成功、生成記録保存")


if __name__ == "__main__":
    main()
