"""本番80枚・タイプ・共有画像・ローカルリンクを標準ライブラリで確認する。"""

import hashlib
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import struct
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
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
    characters = {(item["gender"], item["type"]): item for item in read_browser_data(ROOT / "data/type_characters.js")}
    types = read_browser_data(ROOT / "data/result_types.js")
    cards = manifest["cards"]
    check(len(cards) == len(faces) and {card["id"] for card in cards} == set(faces), "共有画像: 本番の顔と件数・IDが不一致")
    for card in cards:
        face = faces.get(card["id"])
        if face is None:
            continue
        context = f'共有画像: {card["id"]}'
        check(card["gender"] == face["gender"] and card["asset_version"] == face["asset_version"], f"{context}: 性別・バージョンが不一致")
        check(card["source_image"] == face["image"] and card["source_sha256"] == face["generation"]["image_sha256"], f"{context}: 元の顔写真が更新されています。共有画像も書き出し直してください")
        character = characters[(face["gender"], face["type"])]
        result_type = next(item for item in types[face["gender"]] if item["id"] == face["type"])
        check(card.get("character_id") == character["id"] and card.get("character_sha256") == character["sha256"], f"{context}: キャラクターが更新されています。共有画像も書き出し直してください")
        check(card.get("type_id") == result_type["id"] and card.get("type_label") == result_type["label"] and card.get("classification_label") == result_type["classification_label"], f"{context}: タイプ表示が更新されています。共有画像も書き出し直してください")
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



def check_promotion_card(check, referenced):
    from build_share_pages import read_browser_data

    card = json.loads((ROOT / "data/promotion_card.json").read_text())
    check(card["source_data"] == "data/type_characters.js", "宣材画像: キャラクターの記録が参照されていない")
    characters = {item["id"]: item for item in read_browser_data(ROOT / card["source_data"])}
    sources = card["source_characters"]
    check(len(sources) == 8 and len({source["id"] for source in sources}) == 8, "宣材画像: 異なる8体が指定されていない")
    for source in sources:
        character = characters.get(source["id"])
        check(character is not None and character["sha256"] == source["sha256"], f'宣材画像: キャラクターが更新されています {source["id"]}')
    generation = card["generation"]
    check(generation["template"] == "scripts/templates/promotion_card.html" and hashlib.sha256((ROOT / generation["template"]).read_bytes()).hexdigest() == generation["template_sha256"], "宣材画像: テンプレート変更後に再生成してください")
    html = (ROOT / "index.html").read_text()
    parser = Links()
    parser.feed(html)
    check(bool(card["generation"]["prompt"]) and card["review_status"] == "visual_checked", "宣材画像: 制作記録・目視確認がない")

    expected_path = f'assets/promo/home-characters-v1-{card["image_sha256"][:12]}.png'
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


def check_characters(check, referenced):
    from build_share_pages import read_browser_data

    types = read_browser_data(ROOT / "data/result_types.js")
    characters = read_browser_data(ROOT / "data/type_characters.js")
    prompts = json.loads((ROOT / "data/character_prompts_v1.json").read_text())["characters"]
    expected = {(gender, item["id"]) for gender, items in types.items() for item in items}
    check(len(characters) == 16 and {(item["gender"], item["type"]) for item in characters} == expected, "キャラクター: 男女8タイプずつの対応が不正")
    check(len({item["sha256"] for item in characters}) == 16, "キャラクター: 画像が重複")
    for character in characters:
        context = character["id"]
        check(context == f'{character["gender"]}_{character["type"]}', f"{context}: キャラクターIDが不正")
        check(character["image"] == f'assets/characters/v1/{context}.png', f"{context}: キャラクターのパスが不正")
        prompt = next((item for item in prompts if item["id"] == context), None)
        check(prompt is not None and hashlib.sha256(prompt["prompt"].encode()).hexdigest() == character["prompt_sha256"], f"{context}: キャラクターのプロンプト記録が不一致")
        check(character["generation_tool"] == "built-in image_gen" and character["review_status"] == "visual_checked", f"{context}: 制作・確認記録がない")
        path = ROOT / character["image"]
        check(path.is_file(), f"{context}: キャラクター画像がない")
        if not path.is_file():
            continue
        raw = path.read_bytes()
        check(raw.startswith(b"\x89PNG\r\n\x1a\n") and struct.unpack(">II", raw[16:24]) == (character["width"], character["height"]), f"{context}: キャラクターの画像寸法が不正")
        check(hashlib.sha256(raw).hexdigest() == character["sha256"], f"{context}: キャラクターのハッシュ不一致")
        referenced.add(path.resolve())


def check_pv_assets(check, referenced):
    """PVの登録済みファイルだけを許可し、旧顔画像の混入検査を維持する。"""
    expected = {
        "type-checker-30s.mp4", "type-checker-15s.mp4",
        "type-checker-30s.srt", "type-checker-15s.srt",
        "type-checker-30s.vtt", "type-checker-15s.vtt",
        "type-checker-cover.jpg", "post-caption.txt",
    }
    manifest = json.loads((ROOT / "marketing/pv/manifest.json").read_text())
    files = manifest["files"]
    check(set(files) == expected, "PV: 登録された完成ファイルの一覧が不一致")
    for name in sorted(expected):
        path = ROOT / "assets/promo" / name
        check(path.is_file(), f"PV: ファイルがない {name}")
        if not path.is_file() or name not in files:
            continue
        raw = path.read_bytes()
        check(len(raw) == files[name]["bytes"] and hashlib.sha256(raw).hexdigest() == files[name]["sha256"], f"PV: サイズ・ハッシュが不一致 {name}")
        check(0 < len(raw) < 25 * 1024 * 1024, f"PV: ファイルが空、または25MiB以上 {name}")
        if name == "type-checker-cover.jpg":
            check(jpeg_dimensions(raw) == (1080, 1920), "PV: サムネイルのJPEG寸法が不正")
            referenced.add(path.resolve())


def main():
    from build_share_pages import read_browser_data
    errors = []
    def check(ok, message):
        if not ok:
            errors.append(message)
    referenced = set()
    types = read_browser_data(ROOT / "data/result_types.js")
    expected = {
        "female": ["cute", "active_cute", "fresh", "cool_casual", "feminine", "soft_elegant", "elegant", "cool"],
        "male": ["charming_soft", "charming_hard", "fresh_soft", "fresh_hard", "elegant_soft", "elegant_hard", "cool_soft", "cool_hard"],
    }
    records = []
    for gender, ids in expected.items():
        faces = read_browser_data(ROOT / f"data/{gender}_faces.js")
        records.extend(faces)
        check([item["id"] for item in types[gender]] == ids, f"{gender}: 結果の8タイプが不正")
        labels = {item["id"]: item["label"] for item in types[gender]}
        classifications = {item["id"]: item["classification_label"] for item in types[gender]}
        check(len(set(labels.values())) == 8 and all(item.get("copy") for item in types[gender]), f"{gender}: 結果名・説明が不正")
        check([f["id"] for f in faces] == [f"{gender}_{i:03d}" for i in range(1, 41)], f"{gender}: 40件のIDが不正")
        check(Counter(f["type"] for f in faces) == Counter({t: 5 for t in ids}), f"{gender}: 各タイプ5枚ではない")
        for face in faces:
            context = face["id"]
            check(face["gender"] == gender and face["asset_version"] == "v8" and face["age"] == 25, f"{context}: 性別・世代・年齢が不正")
            check(face["label"] == labels.get(face["type"]), f"{context}: 表示タイプ名が不一致")
            check(face["classification_label"] == classifications.get(face["type"]), f"{context}: 分類名が不一致")
            check(not {"tags", "shape_features", "appearance_features"}.intersection(face), f"{context}: 旧特徴量が残っています")
            check(face["image"] == f"assets/{gender}/{context}.png", f"{context}: 画像パスが不正")
            path = ROOT / face["image"]
            check(path.is_file(), f"{context}: 顔画像がありません")
            if not path.is_file():
                continue
            raw = path.read_bytes()
            check(raw.startswith(b"\x89PNG\r\n\x1a\n") and struct.unpack(">II", raw[16:24]) == (1200, 1600), f"{context}: PNG寸法が不正")
            generation = face["generation"]
            check(hashlib.sha256(raw).hexdigest() == generation["image_sha256"], f"{context}: 画像ハッシュ不一致")
            check(hashlib.sha256(face["prompt"].encode()).hexdigest() == generation["prompt_sha256"], f"{context}: プロンプトハッシュ不一致")
            check("25" in face["prompt"] and bool(face["identity_brief"]), f"{context}: 個別の25歳生成指示がない")
            check(generation["method"] == "built-in image_gen" and generation["face_detected"] is True, f"{context}: 個別生成・顔検出記録が不正")
            check(generation["normalizer"] == "scripts/normalize_face_asset.py", f"{context}: 正規化処理が不正")
            referenced.add(path.resolve())
    for key in ("source_sha256", "image_sha256", "prompt_sha256"):
        check(len({f["generation"][key] for f in records}) == 80, f"顔写真: {key}が重複")
    check_characters(check, referenced)
    check_share_cards(check, referenced)
    check_promotion_card(check, referenced)
    check_pv_assets(check, referenced)
    images = {p.resolve() for p in (ROOT / "assets").rglob("*") if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}}
    check(images == referenced and len(images) == 178, "旧画像または対応データのない画像が残っています")
    check(not (ROOT / "assets/previews").exists(), "旧試作画像が残っています")
    html = (ROOT / "index.html").read_text()
    for character_id in ("female_fresh", "male_fresh_soft"):
        check(f'assets/characters/v1/{character_id}.png' in html, f"トップ画像: {character_id}が使われていない")
    domain = (ROOT / "CNAME").read_text().strip()
    check(f'<link rel="canonical" href="https://{domain}/top/">' in html, "トップのcanonicalが不一致")
    def local_path(source, target):
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or not parsed.path:
            return
        path = (source.parent / unquote(parsed.path)).resolve()
        check(path.is_relative_to(ROOT) and path.exists(), f"{source.relative_to(ROOT)}: リンク先がない {target}")
    for source in [ROOT / "index.html", ROOT / "404.html", ROOT / "README.md", *sorted((ROOT / "docs").glob("*"))]:
        if source.suffix not in {".html", ".md"}:
            continue
        text = source.read_text()
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
    print("整合性OK: 顔80枚・キャラクター16体・キャラクター共有80枚・宣材1枚・PVサムネイル1枚、タイプ・生成記録・ハッシュ・リンク")


if __name__ == "__main__":
    main()
