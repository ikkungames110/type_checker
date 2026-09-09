"""コピー後の画像・特徴量・ローカルリンクを標準ライブラリだけで確認する。"""

import hashlib
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
TAG_KEYS = {
    "cool", "cute", "tsurime", "tareme", "adult", "idol", "mysterious",
    "shortFace", "soft", "sharp",
}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.targets = []

    def handle_starttag(self, tag, attrs):
        self.targets.extend(value for key, value in attrs if key in {"src", "href"} and value)


def main():
    errors = []

    def check(condition, message):
        if not condition:
            errors.append(message)

    def local_path(source, target):
        url = urlsplit(target)
        if url.scheme or url.netloc or not url.path:
            return None
        path = (source.parent / unquote(url.path)).resolve()
        if not path.is_relative_to(ROOT):
            errors.append(f"{source.relative_to(ROOT)}: リポジトリ外への参照 {target}")
            return None
        check(path.is_file(), f"{source.relative_to(ROOT)}: 参照先がない {target}")
        return path

    referenced = set()
    datasets = [
        ("data/male_faces.js", "MALE_FACE_ASSETS", "male", 40, "assets/male"),
        ("data/female_faces.js", "FEMALE_FACE_ASSETS", "female", 40, "assets/female"),
        ("data/previews/male_faces_v3.js", "MALE_FACE_PREVIEW_V3", "male", 10, "assets/previews/v3/male"),
        ("data/previews/male_faces_v4.js", "MALE_FACE_PREVIEW_V4", "male", 10, "assets/previews/v4/male"),
        ("data/previews/female_faces_v4.js", "FEMALE_FACE_PREVIEW_V4", "female", 10, "assets/previews/v4/female"),
        ("data/previews/male_faces_v5.js", "MALE_FACE_PREVIEW_V5", "male", 10, "assets/previews/v5/male"),
        ("data/previews/female_faces_v5.js", "FEMALE_FACE_PREVIEW_V5", "female", 10, "assets/previews/v5/female"),
    ]
    for filename, global_name, gender, count, directory in datasets:
        source = ROOT / filename
        text = source.read_text(encoding="utf-8")
        match = re.fullmatch(rf"(?:\s|//[^\n]*\n)*window\.{global_name}\s*=\s*(\[.*\]);?\s*", text, re.S)
        check(match is not None, f"{filename}: ブラウザglobalの形式が不正")
        if match is None:
            continue
        records = json.loads(match[1])
        ids = [record["id"] for record in records]
        check(len(records) == count and len(set(ids)) == count, f"{filename}: 件数またはID重複が不正")
        if count == 40:
            check(set(ids) == {f"{gender}_{i:03d}" for i in range(1, 41)}, f"{filename}: IDに欠落がある")
        if global_name.endswith(("_V4", "_V5")):
            from build_face_plan_v3 import tags as derive_tags

            version = global_name.rsplit('_', 1)[1].lower()
            selection = json.loads((ROOT / f"data/previews/{gender}_{version}_selection.json").read_text())
            plan_path = ROOT / selection["source_plan"]
            plan = json.loads(plan_path.read_text())
            planned = {record["id"]: record for record in plan["records"]}
            check(len(plan["records"]) == 40 and set(planned) == {f"{gender}_{i:03d}" for i in range(1, 41)}, f"{plan_path.name}: 計画40件が不正")
            check(hashlib.sha256(plan_path.read_bytes()).hexdigest() == selection["plan_sha256"], f"{filename}: 選定時の計画ハッシュ不一致")
            check(ids == selection["ids"], f"{filename}: 選定ID・順序が不一致")
            for target in plan["records"]:
                check(target["image"] is None, f"{target['id']}: 未生成の計画にimageを指定している")
                check(target["tags"] == derive_tags(target["shape_features"]), f"{target['id']}: 計画のタグ再計算不一致")
            for record in records:
                target = planned.get(record["id"], {})
                for key in ("tags", "shape_features", "appearance_features"):
                    check(record[key] == target.get(key), f"{filename}: {record['id']}の{key}が生成計画と不一致")
                check(record.get('plan_prompt', record['prompt']) == target.get('prompt'), f"{filename}: {record['id']}の生成元プロンプトが計画と不一致")
                check(record["image"] == target.get("planned_image"), f"{filename}: 計画の保存先と不一致")
        for record in records:
            context = f"{filename}: {record['id']}"
            check(record["gender"] == gender, f"{context}: gender不一致")
            check(record["image"] == f"{directory}/{record['id']}.png", f"{context}: 画像パスが不正")
            check(bool(record.get("label")) and bool(record.get("prompt")), f"{context}: 必須メタデータがない")
            tags = record["tags"]
            check(set(tags) == TAG_KEYS, f"{context}: タグキーが不一致")
            check(all(type(v) in (int, float) and 0 <= v <= 1 for v in tags.values()), f"{context}: タグ値が範囲外")
            for target in [record.get("source_plan"), record.get("generation", {}).get("normalizer")]:
                if target:
                    local_path(ROOT / "index.html", target)
            path = local_path(ROOT / "index.html", record["image"])
            if path is None or not path.is_file():
                continue
            check(path not in referenced, f"{context}: 画像参照が重複")
            referenced.add(path)
            raw = path.read_bytes()
            is_png = raw.startswith(b"\x89PNG\r\n\x1a\n") and len(raw) >= 24
            check(is_png, f"{context}: PNGではない")
            if is_png:
                check(struct.unpack(">II", raw[16:24]) == (1200, 1600), f"{context}: サイズ不一致")
            check(hashlib.sha256(raw).hexdigest() == record["generation"]["image_sha256"], f"{context}: 画像ハッシュ不一致")

    # 未生成の60人計画は実在アセットの集合に加えず、設定・基準画像・HTMLとの一致を検証する。
    from build_face_plan_v6 import LEVELS, design_levels, describe, make_prompt
    from build_face_plan_v3 import KEYS, tags as derive_tags

    new_plans = []
    signatures = set()
    for gender in ('female', 'male'):
        source = ROOT / f'data/plans/{gender}_faces_v6.json'
        plan = json.loads(source.read_text())
        new_plans.append(plan)
        records = plan['records']
        check(plan['population'] == len(records) == 60, f'{source.name}: 人数が60人ではない')
        check([r['id'] for r in records] == [f'{gender}_{i:03d}' for i in range(1,61)], f'{source.name}: IDまたは順序が不正')
        reference = ROOT / plan['reference_plan']
        anchors = json.loads(reference.read_text())['records'][:10]
        check(hashlib.sha256(reference.read_bytes()).hexdigest() == plan['reference_plan_sha256'], f'{source.name}: 基準計画ハッシュ不一致')
        for i,record in enumerate(records):
            context = f'{source.name}: {record["id"]}'
            shape = record['shape_features']
            check(set(shape) == set(KEYS), f'{context}: 形態26項目が不正')
            check(all(type(v) in (int,float) and 0 <= v <= 1 for v in shape.values()), f'{context}: 形態値の範囲外')
            check(.51 <= shape['cheek_fullness'] <= .56 and max(shape['mouth_width'],shape['lip_fullness']) <= .5, f'{context}: 共通制約から逸脱')
            check(record['gender'] == gender and record['image'] is None, f'{context}: 性別・未生成状態が不正')
            check(record['planned_image'] == f'assets/planned/v6/{gender}/{record["id"]}.png', f'{context}: 保存予定先が不正')
            check(set(record['tags']) == TAG_KEYS and record['tags'] == derive_tags(shape), f'{context}: 派生タグ不一致')
            check(record['design_levels'] == design_levels(record), f'{context}: 数値と分類が不一致')
            appearance = record['appearance_features']
            check(record['description'] == describe(shape,appearance['face_outline'],appearance['hair_style'],gender), f'{context}: 日本語説明が数値と不一致')
            check(record['prompt'] == make_prompt(record), f'{context}: 生成指示が数値と不一致')
            signature = tuple(shape[k] for k in KEYS)
            check(signature not in signatures, f'{context}: 他の人物と形態26項目が完全一致')
            signatures.add(signature)
            if i < 10:
                check(shape == anchors[i]['shape_features'] and appearance == anchors[i]['appearance_features'], f'{context}: 基準10人の設定が変更されている')
                check(record['reference_image'] == f'assets/previews/v5/{gender}/{record["id"]}.png', f'{context}: 基準画像が不一致')
                local_path(ROOT/'index.html',record['reference_image'])
            else:
                check(record['reference_image'] is None, f'{context}: 新規人物に別人の基準画像を割り当てている')
        for key, coverage in plan['coverage'].items():
            counts = Counter(r['design_levels'][key] for r in records)
            size = 8 if key == 'outline' else 3 if key == 'hair' else len(LEVELS[key]['values'])
            check(len(coverage) == size, f'{source.name}: {key}の配分カテゴリ数が不正')
            check([c['count'] for c in coverage] == [counts[i] for i in range(size)], f'{source.name}: {key}の配分記録が不一致')
            check([counts[i] for i in range(size)] == [60//size + (i < 60%size) for i in range(size)], f'{source.name}: {key}の配分に偏り')
    catalog = (ROOT/'docs/顔設定一覧_男女各60人_ver6.html').read_text()
    embedded = re.search(r'<script type="application/json" id="plan-data">(.*?)</script>',catalog,re.S)
    check(embedded is not None, 'ver6 HTML: 設定データがない')
    if embedded:
        check(json.loads(embedded[1])['plans'] == new_plans, 'ver6 HTML: 計画JSONと内容が不一致')

    images = {path.resolve() for path in (ROOT / "assets").rglob("*") if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}}
    for path in sorted(images - referenced):
        errors.append(f"{path.relative_to(ROOT)}: 対応する特徴量レコードがない")

    domain = (ROOT / "CNAME").read_text(encoding="utf-8").strip()
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    check(f'<link rel="canonical" href="https://{domain}/">' in html, "index.html: canonicalとCNAMEが不一致")

    documents = [ROOT / "index.html", ROOT / "README.md", *sorted((ROOT / "docs").glob("*"))]
    for source in documents:
        if source.suffix not in {".html", ".md"}:
            continue
        text = source.read_text(encoding="utf-8")
        if source.suffix == ".html":
            parser = Links()
            parser.feed(text)
            targets = parser.targets
        else:
            targets = re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", text)
        for target in targets:
            local_path(source, target)

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"整合性OK: 本番80件・試作50件、画像{len(referenced)}枚、ver6計画120人、特徴量・画像ハッシュ・配分・HTML・ローカルリンク")


if __name__ == "__main__":
    main()
