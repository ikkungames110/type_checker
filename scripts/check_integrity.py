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
        self.metadata = {}

    def handle_starttag(self, tag, attrs):
        self.targets.extend(value for key, value in attrs if key in {"src", "href"} and value)
        if tag == "meta":
            values = dict(attrs)
            self.metadata[values.get("name", values.get("property"))] = values.get("content")


def jpeg_dimensions(raw):
    if not raw.startswith(b"\xff\xd8"):
        return None
    offset = 2
    while offset + 4 <= len(raw):
        if raw[offset] != 0xFF:
            return None
        marker = raw[offset + 1]
        length = int.from_bytes(raw[offset + 2:offset + 4], "big")
        if marker in {0xC0, 0xC1, 0xC2} and length >= 7:
            height, width = struct.unpack(">HH", raw[offset + 5:offset + 9])
            return width, height
        if marker in {0xDA, 0xD9} or length < 2:
            return None
        offset += 2 + length
    return None


def check_share_cards(check, referenced):
    from build_share_pages import read_browser_data

    manifest = json.loads((ROOT / "data/share_cards.json").read_text())
    check(manifest["template"] == "scripts/templates/share_card.html", "共有画像: テンプレートが不正")
    check(hashlib.sha256((ROOT / manifest["template"]).read_bytes()).hexdigest() == manifest["template_sha256"], "共有画像: テンプレート変更後に画像を書き出し直してください")
    faces = {face["id"]: face for gender in ("female", "male") for face in read_browser_data(ROOT / f"data/{gender}_faces.js")}
    cards = manifest["cards"]
    check(len(cards) == len(faces) and {card["id"] for card in cards} == set(faces), "共有画像: 本番の顔と件数・IDが不一致")
    for card in cards:
        face = faces.get(card["id"])
        if face is None:
            continue
        context = f'共有画像: {card["id"]}'
        check(card["gender"] == face["gender"] and card["asset_version"] == face["asset_version"], f"{context}: 性別・バージョンが不一致")
        check(card["source_image"] == face["image"] and card["source_sha256"] == face["generation"]["image_sha256"], f"{context}: 元の顔写真が更新されています。共有画像も書き出し直してください")
        expected_path = f'assets/share/{face["asset_version"]}/{face["id"]}-{card["image_sha256"][:12]}.jpg'
        check(card["image"] == expected_path, f"{context}: 画像パスが不正")
        image_path = ROOT / expected_path
        check(image_path.is_file(), f"{context}: 画像がない")
        if not image_path.is_file():
            continue
        raw = image_path.read_bytes()
        check(jpeg_dimensions(raw) == (card["width"], card["height"]) == (1200, 600), f"{context}: JPEG・サイズが不正")
        check(len(raw) < 5_000_000, f"{context}: 画像が5MB以上")
        check(hashlib.sha256(raw).hexdigest() == card["image_sha256"], f"{context}: 画像ハッシュが不一致")
        check(image_path.resolve() not in referenced, f"{context}: 画像参照が重複")
        referenced.add(image_path.resolve())

    types = read_browser_data(ROOT / "data/result_types.js")
    check(len(types) == len({item["id"] for item in types}) == 6, "共有タイプ: 件数またはIDが不正")
    check(types[-1]["tags"] == [], "共有タイプ: 最後の判定に既定値がない")
    for item in types:
        check(re.fullmatch(r"[a-z]+", item["id"]) is not None and bool(item["label"]), "共有タイプ: IDまたはタイプ名が不正")
        check(set(item["tags"]) <= TAG_KEYS, "共有タイプ: 不明な採点タグ")


def check_promotion_card(check, referenced):
    from build_share_pages import read_browser_data

    card = json.loads((ROOT / "data/promotion_card.json").read_text())
    faces = read_browser_data(ROOT / card["source_data"])
    face = next((face for face in faces if face["id"] == card["source_id"]), None)
    check(face is not None, "宣材画像: 元写真の特徴量レコードがない")
    if face is not None:
        check(card["source_image"] == face["image"] and card["source_sha256"] == face["generation"]["image_sha256"], "宣材画像: 元写真が更新されています。宣材も見直してください")
    html = (ROOT / "index.html").read_text()
    parser = Links()
    parser.feed(html)
    check(card["source_image"] in {urlsplit(target).path for target in parser.targets}, "宣材画像: 元写真がトップ画面で使われていない")
    check(bool(card["generation"]["prompt"]) and card["review_status"] == "visual_checked", "宣材画像: 制作記録・目視確認がない")

    expected_path = f'assets/promo/home-v1-{card["image_sha256"][:12]}.png'
    check(card["image"] == expected_path, "宣材画像: 画像パスが不正")
    image_path = ROOT / expected_path
    check(image_path.is_file(), "宣材画像: 画像がない")
    if image_path.is_file():
        raw = image_path.read_bytes()
        is_png = raw.startswith(b"\x89PNG\r\n\x1a\n") and len(raw) >= 24
        check(is_png, "宣材画像: PNGではない")
        if is_png:
            check(struct.unpack(">II", raw[16:24]) == (card["width"], card["height"]), "宣材画像: サイズが記録と不一致")
        check(card["width"] == card["height"] * 2 and 300 <= card["width"] <= 4096 and card["height"] >= 157, "宣材画像: Xカード用のサイズが不正")
        check(len(raw) < 5_000_000, "宣材画像: 画像が5MB以上")
        check(hashlib.sha256(raw).hexdigest() == card["image_sha256"], "宣材画像: 画像ハッシュが不一致")
        check(image_path.resolve() not in referenced, "宣材画像: 画像参照が重複")
        referenced.add(image_path.resolve())

    site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
    meta = parser.metadata
    check(meta.get("og:url") == site + "top/", "宣材画像: og:urlとトップ画面URLが不一致")
    check(meta.get("twitter:card") == "summary_large_image", "宣材画像: Xの大きな画像カードが未設定")
    for key in ("og:image", "og:image:secure_url", "twitter:image"):
        check(meta.get(key) == site + card["image"], f"宣材画像: {key}のURLが不一致")
    check(meta.get("og:image:type") == "image/png", "宣材画像: MIMEタイプが不一致")
    for dimension in ("width", "height"):
        check(meta.get(f"og:image:{dimension}") == str(card[dimension]), f"宣材画像: {dimension}がメタ情報と不一致")
    for key in ("title", "description", "image:alt"):
        check(bool(meta.get(f"og:{key}")) and meta.get(f"og:{key}") == meta.get(f"twitter:{key}"), f"宣材画像: {key}のOGP・X設定がないか不一致")


def check_type_previews(check, referenced):
    source = ROOT / "data/previews/face_types_v7.js"
    match = re.fullmatch(r"(?:\s|//[^\n]*\n)*window\.FACE_TYPE_PREVIEW_V7\s*=\s*(\{.*\});?\s*", source.read_text(), re.S)
    check(match is not None, "ver7: ブラウザglobalの形式が不正")
    if match is None:
        return
    data = json.loads(match[1])
    records = data["records"]
    expected = {
        "female": ["cute", "active_cute", "fresh", "cool_casual", "feminine", "soft_elegant", "elegant", "cool"],
        "male": ["charming_soft", "charming_hard", "fresh_soft", "fresh_hard", "elegant_soft", "elegant_hard", "cool_soft", "cool_hard"],
    }
    check(data["version"] == "v7" and data["status"] == "preview", "ver7: 試作バージョンが不正")
    check(data["scoring"] == {"key": "type", "points_per_choice": 1}, "ver7: タイプ単位の採点定義が不正")
    check(len(records) == 16, "ver7: 男女各8件ではない")
    for gender, types in expected.items():
        subset = [record for record in records if record["gender"] == gender]
        check([record["id"] for record in subset] == [f"{gender}_{i:03d}" for i in range(1, 9)], f"ver7 {gender}: IDが不正")
        check([record["type"] for record in subset] == types, f"ver7 {gender}: 8タイプが揃っていない")
    hashes = set()
    for record in records:
        context = f"ver7 {record['id']}"
        expected_path = f"assets/previews/v7/{record['gender']}/{record['id']}.png"
        check(record["image"] == expected_path, f"{context}: 画像パスが不正")
        check(not {"tags", "shape_features", "appearance_features"}.intersection(record), f"{context}: 不要な特徴量がある")
        check(bool(record.get("label")) and bool(record.get("prompt")), f"{context}: タイプ名・プロンプトがない")
        path = (ROOT / expected_path).resolve()
        check(path.is_file(), f"{context}: 画像がない")
        if not path.is_file():
            continue
        check(path not in referenced, f"{context}: 画像参照が重複")
        referenced.add(path)
        raw = path.read_bytes()
        check(raw.startswith(b"\x89PNG\r\n\x1a\n") and len(raw) >= 24 and struct.unpack(">II", raw[16:24]) == (1200, 1600), f"{context}: PNG形式・サイズが不正")
        digest = hashlib.sha256(raw).hexdigest()
        check(digest not in hashes, f"{context}: 別人物と画像が同一")
        hashes.add(digest)
        generation = record.get("generation", {})
        check(generation.get("image_sha256") == digest, f"{context}: 画像ハッシュ不一致")
        check(generation.get("prompt_sha256") == hashlib.sha256(record["prompt"].encode("utf-8")).hexdigest(), f"{context}: 使用プロンプトのハッシュ不一致")
        check(generation.get("method") == "built-in image_gen", f"{context}: 生成方法が不正")
        check(generation.get("face_detected") is True, f"{context}: 正面顔を検出していない")
        check(generation.get("normalizer") == "scripts/normalize_face_asset.py", f"{context}: 正規化方法が不正")


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
        ("data/male_faces.js", "MALE_FACE_ASSETS", "male", 60, "assets/male"),
        ("data/female_faces.js", "FEMALE_FACE_ASSETS", "female", 60, "assets/female"),
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
        if count in {40, 60}:
            check(set(ids) == {f"{gender}_{i:03d}" for i in range(1, count + 1)}, f"{filename}: IDに欠落がある")
        if global_name.endswith('_FACE_ASSETS'):
            plan_path = ROOT / f'data/plans/{gender}_faces_v6.json'
            plan = json.loads(plan_path.read_text())
            planned = {r['id']: r for r in plan['records']}
            plan_hash = hashlib.sha256(plan_path.read_bytes()).hexdigest()
            check(len({r['generation']['image_sha256'] for r in records}) == count, f'{filename}: 生成画像が重複')
            for record in records:
                target = planned.get(record['id'], {})
                for key in ('tags', 'shape_features', 'appearance_features', 'prompt', 'label', 'description', 'design_levels', 'source_plan'):
                    check(record.get(key) == target.get(key), f"{filename}: {record['id']}の{key}がver6計画と不一致")
                check(record['asset_version'] == 'v6.1', f'{filename}: 本番画像がver6.1ではない')
                check(record['review_status'] == 'visual_checked', f'{filename}: 本番画像が目視確認済みではない')
                check(record['generation']['plan_sha256'] == plan_hash, f'{filename}: 生成元の計画ハッシュ不一致')
                check(record['generation']['face_detected'] is True, f'{filename}: 正面顔を検出していない')
                check(record['shape_calibrated'] is False, f'{filename}: 生成目標を実測値として扱っている')
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

    # 生成前の計画はそのまま残し、実在アセットは生成データからのみ参照する。
    from build_face_plan_v6 import category_targets, constrain_anchor, design_levels, describe, make_prompt
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
            check(appearance['hair_style'] == 'fringe_down', f'{context}: 自然な下ろし前髪ではない')
            if gender == 'female':
                check(appearance['face_outline'] in {'round','short_oval','oval'}, f'{context}: 女性の輪郭制約に違反')
                check(shape['eyebrow_thickness'] <= .50, f'{context}: 女性の眉が太い')
            check(record['description'] == describe(shape,appearance['face_outline'],appearance['hair_style'],gender), f'{context}: 日本語説明が数値と不一致')
            check(record['prompt'] == make_prompt(record), f'{context}: 生成指示が数値と不一致')
            signature = tuple(shape[k] for k in KEYS)
            check(signature not in signatures, f'{context}: 他の人物と形態26項目が完全一致')
            signatures.add(signature)
            if i < 10:
                revised = constrain_anchor(anchors[i])
                check(shape == revised['shape_features'] and appearance == revised['appearance_features'], f'{context}: 基準10人への条件反映が不一致')
                check(record['reference_image'] == f'assets/previews/v5/{gender}/{record["id"]}.png', f'{context}: 基準画像が不一致')
                local_path(ROOT/'index.html',record['reference_image'])
            else:
                check(record['reference_image'] is None, f'{context}: 新規人物に別人の基準画像を割り当てている')
        for key, coverage in plan['coverage'].items():
            counts = Counter(r['design_levels'][key] for r in records)
            targets = category_targets(gender)[key]
            size = len(targets)
            check(len(coverage) == size, f'{source.name}: {key}の配分カテゴリ数が不正')
            check([c['count'] for c in coverage] == [counts[i] for i in range(size)], f'{source.name}: {key}の配分記録が不一致')
            check([counts[i] for i in range(size)] == targets, f'{source.name}: {key}の配分が指定と不一致')
    catalog = (ROOT/'docs/顔設定一覧_男女各60人_ver6.html').read_text()
    embedded = re.search(r'<script type="application/json" id="plan-data">(.*?)</script>',catalog,re.S)
    check(embedded is not None, 'ver6 HTML: 設定データがない')
    if embedded:
        check(json.loads(embedded[1])['plans'] == new_plans, 'ver6 HTML: 計画JSONと内容が不一致')

    check_type_previews(check, referenced)
    check_share_cards(check, referenced)
    check_promotion_card(check, referenced)
    images = {path.resolve() for path in (ROOT / "assets").rglob("*") if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}}
    for path in sorted(images - referenced):
        errors.append(f"{path.relative_to(ROOT)}: 対応するデータレコードがない")

    domain = (ROOT / "CNAME").read_text(encoding="utf-8").strip()
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    check(f'<link rel="canonical" href="https://{domain}/top/">' in html, "index.html: canonicalとトップ画面URLが不一致")

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
    print(f"整合性OK: 本番ver6.1 120件・試作66件（ver7の16タイプを含む）・共有カード120件・宣材1件、画像{len(referenced)}枚、ver6計画120人、タイプ・特徴量・画像ハッシュ・配分・HTML・ローカルリンク")


if __name__ == "__main__":
    main()
