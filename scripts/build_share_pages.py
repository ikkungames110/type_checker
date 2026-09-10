"""XがJavaScriptなしで顔写真を取得できる、結果ごとの静的HTMLを作る。"""

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
    manifest = json.loads((ROOT / "data/share_cards.json").read_text())
    cards = {card["id"]: card for card in manifest["cards"]}
    template = Template((ROOT / "scripts/templates/shared_result.html").read_text())
    count = 0
    for gender, gender_label in (("female", "女性"), ("male", "男性")):
        for face in read_browser_data(ROOT / f"data/{gender}_faces.js"):
            card = cards[face["id"]]
            result_type = next(item for item in types[gender] if item["id"] == face["type"])
            relative = f'share/{face["asset_version"]}/{face["id"]}/{result_type["id"]}/'
            values = {
                "title": result_type["label"],
                "description": f'好みの{gender_label}の顔は「{result_type["label"]}」。あなたも20問の2択で、惹かれる顔を見つけてみませんか？',
                "page_url": site_url + relative,
                "card_url": site_url + card["image"],
                "portrait_path": face["image"] + "?v=" + face["asset_version"],
                "image_alt": f'診断結果に選ばれた架空の成人{gender_label}の顔写真',
                "gender_label": gender_label,
            }
            page = destination / relative / "index.html"
            page.parent.mkdir(parents=True, exist_ok=True)
            page.write_text(template.substitute({key: escape(value, quote=True) for key, value in values.items()}), encoding="utf-8")
            count += 1
    print(f"顔写真付きの共有ページ: {count}件")
    return count
