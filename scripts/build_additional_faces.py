"""追加写真の制作記録から、21組目以降に使うブラウザ用データを生成する。"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME_KEYS = ("id", "gender", "type", "image", "asset_version")


def runtime_records(plan):
    return {gender: [{key: record[key] for key in RUNTIME_KEYS}
                     for record in plan["records"] if record["gender"] == gender]
            for gender in ("female", "male")}


if __name__ == "__main__":
    plan = json.loads((ROOT / "data/previews/face_additions_v8.json").read_text())
    if plan["status"] != "active-after-first-20-pairs" or any(r["status"] != "generated" for r in plan["records"]):
        raise SystemExit("採用済み・生成済みの追加写真が必要です")
    (ROOT / "data/additional_faces.js").write_text(
        "// 制作記録から生成。21組目以降の出題専用。\nwindow.ADDITIONAL_FACE_ASSETS = " +
        json.dumps(runtime_records(plan), ensure_ascii=False, indent=2) + ";\n")
    print("追加出題データ: 男女各40人 → data/additional_faces.js")
