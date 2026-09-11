"""キャラクターのOGPと、同タイプの顔5枚が読める静的結果ページを作る。"""

from html import escape
import json
from pathlib import Path
from string import Template


ROOT = Path(__file__).resolve().parents[1]


def read_browser_data(path):
    return json.loads(path.read_text(encoding="utf-8").split("=", 1)[1].strip().removesuffix(";"))


def build_share_pages(destination):
    site_url = f'https://{(ROOT / "CNAME").read_text().strip()}/'
    types = read_browser_data(ROOT / "data/result_types.js")
    characters = {(item["gender"], item["type"]): item for item in read_browser_data(ROOT / "data/type_characters.js")}
    manifest = json.loads((ROOT / "data/share_cards.json").read_text())
    cards = {card["id"]: card for card in manifest["cards"]}
    template = Template((ROOT / "scripts/templates/shared_result.html").read_text())
    count = 0
    for gender, gender_label in (("female", "女性"), ("male", "男性")):
        faces = read_browser_data(ROOT / f"data/{gender}_faces.js")
        for face in faces:
            card = cards[face["id"]]
            result_type = next(item for item in types[gender] if item["id"] == face["type"])
            character = characters[(gender, result_type["id"])]
            examples = [item for item in faces if item["type"] == result_type["id"]]
            if len(examples) != 5:
                raise ValueError(f'{gender}/{result_type["id"]}: 顔の例が5枚ではありません')
            relative = f'share/{face["asset_version"]}/{face["id"]}/{result_type["id"]}/'
            values = {
                "title": result_type["label"],
                "code": result_type["code"],
                "classification_label": result_type["classification_label"],
                "description": f'好みの{gender_label}の顔は「{result_type["label"]}」。あなたも20問の2択で、惹かれる顔を見つけてみませんか？',
                "page_url": site_url + relative,
                "card_url": site_url + card["image"],
                "character_path": character["image"] + "?v=" + character["sha256"][:12],
                "image_alt": f'{result_type["classification_label"]}タイプを表すキャラクター',
                "result_copy": result_type["copy"],
                "gender_label": gender_label,
            }
            page = destination / relative / "index.html"
            page.parent.mkdir(parents=True, exist_ok=True)
            escaped = {key: escape(value, quote=True) for key, value in values.items()}
            escaped["examples_html"] = "".join(
                f'<figure><img src="../../../../{escape(item["image"], quote=True)}?v=8" width="1200" height="1600" loading="lazy" alt="{escape(result_type["classification_label"], quote=True)}タイプの顔の例 {index}"></figure>'
                for index, item in enumerate(examples, 1)
            )
            page.write_text(template.substitute(escaped), encoding="utf-8")
            count += 1
    print(f"キャラクター＋同タイプの顔5枚の共有ページ: {count}件")
    return count
