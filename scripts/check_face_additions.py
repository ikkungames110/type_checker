"""追加写真の件数・生成記録・画像と、21組目以降の出題データを検査する。"""

from collections import Counter
import hashlib
import json
from pathlib import Path
import struct

from build_share_pages import read_browser_data
from build_additional_faces import runtime_records

ROOT = Path(__file__).resolve().parents[1]


def check_face_additions(check, referenced):
    plan = json.loads((ROOT / "data/previews/face_additions_v8.json").read_text())
    additions = plan["records"]
    current = [r for gender in ("female", "male") for r in read_browser_data(ROOT / f"data/{gender}_faces.js")]
    types = read_browser_data(ROOT / "data/result_types.js")
    check(plan["status"] == "active-after-first-20-pairs", "追加写真: 採用状態が不正")
    check(read_browser_data(ROOT / "data/additional_faces.js") == runtime_records(plan), "追加写真: ブラウザ用データと制作記録が不一致")
    check(len(additions) == 80, "追加写真: 80人ではない")
    check(len(current) == 80 and not {r["id"] for r in current} & {r["id"] for r in additions}, "追加写真: 最初の20組用データに混在")
    check(Counter((r["gender"], r["type"]) for r in additions) == Counter((r["gender"], r["type"]) for r in current), "追加写真: 男女各タイプ5人ではない")
    normalizer_hash = hashlib.sha256((ROOT / "scripts/normalize_face_asset.py").read_bytes()).hexdigest()
    for gender in ("female", "male"):
        check([r["id"] for r in additions if r["gender"] == gender] == [f"{gender}_{i:03d}" for i in range(41, 81)], f"追加写真: {gender}のIDが不正")
    for record in additions:
        context = f'追加写真 {record["id"]}'
        generation = record["generation"]
        type_record = next((t for t in types[record["gender"]] if t["id"] == record["type"]), {})
        check(all(record.get(k) == type_record.get(k) for k in ("label", "classification_label")), f"{context}: タイプ名不一致")
        check(record["status"] == "generated" and record["age"] == 25 and record["asset_version"] == "v8-additions-preview", f"{context}: 生成状態・年齢・世代が不正")
        check(record["image"] == f'assets/previews/v8-additions/{record["gender"]}/{record["id"]}.png', f"{context}: 保存先が不正")
        check(not {"tags", "shape_features", "appearance_features"}.intersection(record), f"{context}: 不要な特徴量")
        check(generation["method"] == "built-in image_gen" and generation.get("face_detected") is True, f"{context}: 個別生成・顔検出記録が不正")
        check(generation.get("normalizer_sha256") == normalizer_hash, f"{context}: 正規化処理のハッシュ不一致")
        check(hashlib.sha256(record["prompt"].encode()).hexdigest() == generation["prompt_sha256"], f"{context}: プロンプトハッシュ不一致")
        check(record["identity_brief"] in record["prompt"] and "EXACTLY 25" in record["prompt"], f"{context}: 個人設定・年齢指定がない")
        path = ROOT / record["image"]
        check(path.is_file(), f"{context}: 画像なし")
        if path.is_file():
            raw = path.read_bytes()
            check(raw.startswith(b"\x89PNG\r\n\x1a\n") and struct.unpack(">II", raw[16:24]) == (1200, 1600), f"{context}: PNG寸法不正")
            check(hashlib.sha256(raw).hexdigest() == generation.get("image_sha256"), f"{context}: 画像ハッシュ不一致")
            referenced.add(path.resolve())
    for key in ("source_sha256", "image_sha256", "prompt_sha256"):
        check(len({r["generation"].get(key) for r in current + additions}) == 160, f"追加写真: {key}が既存または候補と重複")


if __name__ == "__main__":
    errors = []
    check_face_additions(lambda ok, message: None if ok else errors.append(message), set())
    if errors:
        raise SystemExit("\n".join(errors))
    print("追加写真OK: 80人・男女各タイプ5人・25歳・1200×1600・生成記録・ハッシュ・既存と分離")
