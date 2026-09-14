"""既存80人と未採用候補80人を、JavaScriptなしでも見られる比較HTMLへ出力する。"""

import json
from html import escape
from pathlib import Path

from build_share_pages import read_browser_data

ROOT = Path(__file__).resolve().parents[1]


def build_gallery():
    plan = json.loads((ROOT / "data/previews/face_additions_v8.json").read_text())
    types = read_browser_data(ROOT / "data/result_types.js")
    sections, options = [], []
    for gender, gender_label in (("female", "女性"), ("male", "男性")):
        current = read_browser_data(ROOT / f"data/{gender}_faces.js")
        groups = []
        for type_record in types[gender]:
            key = f'{gender}:{type_record["id"]}'
            options.append(f'<option value="{key}" data-gender="{gender}">{gender_label} · {escape(type_record["classification_label"])} / {type_record["code"]}</option>')
            rows = []
            for source, label, records in (("current", "既存", current), ("addition", "追加候補", plan["records"])):
                selected = [r for r in records if r["gender"] == gender and r["type"] == type_record["id"]]
                assert len(selected) == 5, (key, source)
                cards = []
                for record in selected:
                    image_path = ROOT / record["image"]
                    if source == "addition" and record["status"] != "generated":
                        raise ValueError(f'未生成: {record["id"]}')
                    if not image_path.is_file():
                        raise FileNotFoundError(image_path)
                    name = escape(f'{type_record["classification_label"]} · {label} · {record["id"]}')
                    cards.append(f'''<figure data-id="{record['id']}">
  <a class="portrait" href="../{record['image']}" data-title="{name}" aria-label="{name}を拡大">
    <img src="../{record['image']}" alt="{name}の顔写真" width="1200" height="1600" loading="lazy" decoding="async">
  </a><figcaption>{record['id']}</figcaption>
</figure>''')
                rows.append(f'<div class="cohort" data-source="{source}"><h4><span class="badge {source}">{label}</span><span>5人</span></h4><div class="grid">{"".join(cards)}</div></div>')
            groups.append(f'''<section class="type-group" data-gender="{gender}" data-type="{key}" aria-labelledby="{gender}-{type_record['id']}">
<div class="type-heading"><div><p class="type-code">{type_record['code']}</p><h3 id="{gender}-{type_record['id']}">{escape(type_record['label'])}</h3><p class="classification">（{escape(type_record['classification_label'])}）</p></div><p class="group-count">既存5人 ＋ 追加5人</p></div>
{"".join(rows)}</section>''')
        sections.append(f'<section class="gender-section" data-gender="{gender}" aria-labelledby="heading-{gender}"><h2 id="heading-{gender}">{gender_label}<span>8タイプ · 80人</span></h2>{"".join(groups)}</section>')
    template = (ROOT / "scripts/templates/face_additions_gallery.html").read_text()
    result = template.replace("{{TYPE_OPTIONS}}", "\n".join(options)).replace("{{SECTIONS}}", "\n".join(sections))
    destination = ROOT / "docs/face-types-additions.html"
    destination.write_text(result)
    print(f"比較HTML: 16タイプ × 既存5人・追加5人 = 160人 → {destination}")
    return destination


if __name__ == "__main__":
    build_gallery()
