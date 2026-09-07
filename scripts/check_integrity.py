"""コピー後の画像・特徴量・ローカルリンクを標準ライブラリだけで確認する。"""

import hashlib
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

    images = {path.resolve() for path in (ROOT / "assets").rglob("*") if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}}
    for path in sorted(images - referenced):
        errors.append(f"{path.relative_to(ROOT)}: 対応する特徴量レコードがない")

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
    print(f"整合性OK: 本番80件・試作10件、画像{len(referenced)}枚、特徴量・画像ハッシュ・ローカルリンク")


if __name__ == "__main__":
    main()
