"""タイプ別集計の共有ページを生成する。旧文字別結果のURLも維持する。"""
from html import escape
from itertools import product, combinations
import json
from pathlib import Path
from string import Template
from build_share_pages import read_browser_data

ROOT = Path(__file__).resolve().parents[1]


def letter_results(types, axes):
    choices = []
    for axis in axes:
        letters = [option['letter'] for option in axis['options']]
        choices.append([[letters[0]], [letters[1]], letters])
    by_code = {item['code']: item for item in types}
    for combination in product(*choices):
        codes = [''.join(letters) for letters in product(*combination)]
        yield codes, [by_code[code] for code in codes]


def type_results(types, axes):
    by_code = {item['code']: item for item in types}
    ordered = [''.join(letters) for letters in product(*[[o['letter'] for o in a['options']] for a in axes])]
    for size in range(1, 9):
        for subset in combinations(ordered, size):
            yield list(subset), [by_code[code] for code in subset]


def build_letter_share_pages(destination):
    types = read_browser_data(ROOT / 'data/result_types.js')
    axes = read_browser_data(ROOT / 'data/type_axes.js')
    characters = {(c['gender'], c['type']): c for c in read_browser_data(ROOT / 'data/type_characters.js')}
    manifest = json.loads((ROOT / 'data/letter_share_cards.json').read_text())
    cards = {(c['gender'], c['key']): c for c in manifest['cards']}
    template = Template((ROOT / 'scripts/templates/shared_letters.html').read_text())
    site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
    promotion = json.loads((ROOT / 'data/promotion_card.json').read_text())
    count = 0
    for gender, gender_label in [('female','女性'), ('male','男性')]:
        faces = read_browser_data(ROOT / f'data/{gender}_faces.js')
        for codes, winners in type_results(types[gender], axes):
            key = '-'.join(codes)
            relative = f'share/letters/{gender}/{key}/'
            card = cards.get((gender,key))
            card_image = card['image'] if card else promotion['image']
            type_html = []
            example_html = []
            for index, result in enumerate(winners):
                char = characters[(gender,result['id'])]
                code, label, classification, copy = [escape(result[field],quote=True) for field in ['code','label','classification_label','copy']]
                image = escape(char['image'],quote=True) + '?v=' + char['sha256'][:12]
                type_html.append(f'<article class="letter-type" data-code="{code}"><img src="../../../../{image}" width="1254" height="1254" alt="{code}・{classification}タイプのキャラクター"><div><div class="type-code">{code}</div><h2>{label}</h2><p class="result-classification">({classification}タイプ)</p><p class="result-copy">{copy}</p></div></article>')
                examples = sorted((face for face in faces if face['type'] == result['id']), key=lambda f:f['id'])
                if len(examples) != 5 or len({face['id'] for face in examples}) != 5:
                    raise ValueError(f'{gender}/{code}: 顔の例が5枚ではありません')
                images = ''.join(f'<figure><img src="../../../../{escape(face["image"],quote=True)}?v=8" data-face-id="{face["id"]}" width="1200" height="1600" loading="lazy" alt="{code}・{classification}タイプの顔の例 {i}"></figure>' for i,face in enumerate(examples,1))
                if len(codes) > 1:
                    example_html.append(f'<details class="example-group" data-code="{code}"{" open" if index == 0 else ""}><summary>{code} · {classification}の顔5枚</summary><div class="example-grid">{images}</div></details>')
                else:
                    example_html.append(f'<div class="example-group" data-code="{code}"><div class="example-grid">{images}</div></div>')
            values = {
                'title':' / '.join(codes), 'description':f'惹かれる{gender_label}の顔のタイプは「{" / ".join(codes)}」。あなたの「好き」も、20回の選択から見つけてみる。',
                'page_url':site+relative, 'card_url':site+card_image, 'image_alt':f'{" / ".join(codes)}の顔タイプとキャラクター' if card else '好みの顔タイプ診断のキャラクターたち',
                'gender':gender, 'gender_label':gender_label, 'key':key,
                'card_mime':'image/jpeg' if card else 'image/png',
                'single_class':'single' if len(codes) == 1 else '', 'multiple_class':'multiple' if len(codes) > 1 else '',
            }
            values = {key:escape(value,quote=True) for key,value in values.items()}
            values.update(codes_html='<i class="code-separator">/</i>'.join(f'<span data-code="{code}">{code}</span>' for code in codes),types_html=''.join(type_html),examples_html=''.join(example_html))
            page = destination / relative / 'index.html'
            page.parent.mkdir(parents=True,exist_ok=True)
            page.write_text(template.substitute(values),encoding='utf-8')
            count += 1
    print(f'3文字の共有結果: {count}件（男女・単独・同点の全組み合わせ）')
    return count
