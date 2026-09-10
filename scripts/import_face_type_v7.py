"""内蔵image_genの出力を正規化し、8タイプ試作の生成記録を更新する。"""

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/previews/face_types_v7.js"
GLOBAL = "window.FACE_TYPE_PREVIEW_V7 = "


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--id", required=True)
    parser.add_argument("--input", type=Path, required=True)
    args = parser.parse_args()
    source = args.input.resolve(strict=True)
    original = DATA.read_text(encoding="utf-8")
    prefix, payload = original.split(GLOBAL, 1)
    data = json.loads(payload.rstrip().removesuffix(";"))
    record = next((record for record in data["records"] if record["id"] == args.id), None)
    if record is None:
        parser.error(f"Unknown portrait id: {args.id}")
    destination = ROOT / record["image"]
    normalizer = "scripts/normalize_face_asset.py"
    result = subprocess.run(
        [sys.executable, str(ROOT / normalizer), "--input", str(source), "--dest", str(destination)],
        check=True, capture_output=True, text=True,
    )
    record["generation"] = {
        "method": "built-in image_gen",
        "source_file": source.name,
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "prompt_sha256": hashlib.sha256(record["prompt"].encode("utf-8")).hexdigest(),
        "normalizer": normalizer,
        "face_detected": "face_detected=True" in result.stdout,
        "image_sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
    }
    DATA.write_text(prefix + GLOBAL + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(result.stdout.strip())


if __name__ == "__main__":
    main()
