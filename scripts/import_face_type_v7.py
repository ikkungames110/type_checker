"""内蔵image_genの出力を正規化し、8タイプ試作の生成記録を更新する。"""

import argparse
import fcntl
import hashlib
import json
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--id", required=True)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--version", choices=("v7", "v8"), default="v7")
    args = parser.parse_args()
    source = args.input.resolve(strict=True)
    data_path = ROOT / f"data/previews/face_types_{args.version}.js"
    global_name = f"window.FACE_TYPE_PREVIEW_{args.version.upper()} = "
    # 個別生成の完了順が前後しても、取り込み同士が生成記録を上書きしないようにする。
    with data_path.open("r+", encoding="utf-8") as handle:
        fcntl.flock(handle, fcntl.LOCK_EX)
        import_record(handle, global_name, source, args.id, parser)


def import_record(handle, global_name, source, record_id, parser):
    original = handle.read()
    prefix, payload = original.split(global_name, 1)
    data = json.loads(payload.rstrip().removesuffix(";"))
    record = next((record for record in data["records"] if record["id"] == record_id), None)
    if record is None:
        parser.error(f"Unknown portrait id: {record_id}")
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
    handle.seek(0)
    handle.write(prefix + global_name + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
    handle.truncate()
    print(result.stdout.strip())


if __name__ == "__main__":
    main()
