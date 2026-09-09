"""頬・輪郭・容姿の共通条件を改訂し、各40件の計画と試作20件の選定を保存する。"""

from copy import deepcopy
import hashlib
import json
from pathlib import Path

from build_face_plan_v3 import OUTLINES, OUTLINE_KEYS, tags


ROOT = Path(__file__).resolve().parents[1]
# 同じ形態座標を使い、丸顔の幅と頬の量、面長・菱形の骨張りを抑える。
REVISED_OUTLINES = {
    'round': ('a petite round face with a short midface, a compact softly curved jaw and a small rounded chin; gentle cheek curves within a small facial outline, delicate rather than broad proportions', [.22,.32,.32,.40,.18,.36,.72,.28,.56]),
    'short_oval': ('a petite short oval face with smooth healthy cheeks, a gently tapering compact jaw and a small softly rounded chin', [.32,.32,.40,.36,.28,.34,.62,.34,.52]),
    'oval': ('a small balanced oval face with smooth softly supported cheeks and an elegant gently tapered jaw', [.50,.48,.48,.42,.35,.40,.50,.40,.50]),
    'long_oval': ('a refined slightly elongated small oval face, a gracefully longer midface and softly rounded narrow jaw; smooth gently convex cheeks with healthy volume', [.70,.62,.58,.34,.30,.32,.52,.36,.49]),
    'soft_square': ('a compact soft-square face, a gently defined jaw with subtle corners and a neat moderately rounded chin; smooth healthy cheek contours and proportionate lower-face width', [.34,.38,.40,.62,.52,.54,.48,.40,.52]),
    'rectangle': ('a refined moderately elongated rectangular face, gently straighter side contours, neat softly defined jaw corners and a proportionate chin; healthy smooth cheeks', [.68,.55,.60,.58,.56,.50,.38,.42,.49]),
    'heart': ('a petite heart-shaped face, a gently wider forehead tapering to a compact jaw and delicate softly pointed chin, with smoothly supported healthy cheeks', [.48,.45,.46,.28,.30,.26,.32,.42,.51]),
    'diamond': ('a refined small diamond-shaped face with softly defined cheekbones, gently narrower temples and a tapered compact jaw; cheekbones blend smoothly into gently convex lower cheeks', [.57,.50,.50,.34,.44,.30,.40,.57,.50]),
}

# 各8輪郭を含め、丸顔と面長を2件ずつ。無作為抽出ではなく今回の修正確認用。
SELECTION = {
    'male': [1, 27, 3, 5, 6, 8, 21, 24, 28, 38],
    'female': [23, 27, 34, 39, 37, 15, 13, 28, 12, 33],
}


def make_plan(gender):
    source = ROOT / f'data/plans/{gender}_faces_v3.json'
    plan = deepcopy(json.loads(source.read_text()))
    for record in plan['records']:
        outline_key = record['appearance_features']['face_outline']
        description, values = REVISED_OUTLINES[outline_key]
        record['shape_features'].update(zip(OUTLINE_KEYS, values))
        record['tags'] = tags(record['shape_features'])
        prompt = record['prompt']
        original_outline = next(item[2] for item in OUTLINES if item[0] == outline_key)
        prompt = prompt.replace(original_outline, description)
        prompt = prompt.replace('Facial identity, highest priority:', 'Individual facial characteristics:')
        prompt = prompt.replace(
            'The person is attractive and well-groomed THROUGH these specific individual features; preserve the described face outline, lip thickness and eye geometry rather than replacing them with a generic model face. All anatomy stays within a normal adult range.',
            'Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard.'
        )
        prompt = prompt.replace('an ordinary natural nose, with its specified width and tip clearly visible', 'an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth')
        prompt = prompt.replace('minimal natural makeup', 'subtle polished editorial grooming and barely visible natural makeup')
        prompt = prompt.replace('even soft frontal lighting', 'large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated')
        subject = 'exceptionally handsome Japanese male lead actor' if gender == 'male' else 'exceptionally beautiful Japanese leading actress and beauty model'
        quality = (
            f'Primary request: a new fictional adult portrait with the visual appeal of an {subject}, age 27. '
            'A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. '
            'Use a petite well-balanced face, a normal healthy slim neck and shoulders. '
            'The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. '
            'No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. '
            'Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. '
            'Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. '
        )
        record.update(
            prompt=quality + prompt,
            image=None,
            planned_image=f"assets/previews/v4/{gender}/{record['id']}.png",
            asset_version='v4-planned',
            review_status='planned',
            plan_version='4.0.0',
            source_plan=f'data/plans/{gender}_faces_v4.json',
        )
    plan.update(plan_version='4.0.0', based_on=str(source.relative_to(ROOT)),
                revision_note='全員の容姿の共通水準を引き上げ、頬のこけを除外。丸顔は小ぶりな輪郭と適度な頬の量に変更。形態値は生成目標。')
    return plan


def main():
    for gender in SELECTION:
        plan = make_plan(gender)
        path = ROOT / f'data/plans/{gender}_faces_v4.json'
        path.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
        ids = [f'{gender}_{number:03d}' for number in SELECTION[gender]]
        selection = dict(gender=gender, population=40, sample_size=10, ids=ids,
                         method='8輪郭を各1件、丸顔と面長卵型を各1件追加した目的抽出',
                         source_plan=str(path.relative_to(ROOT)),
                         plan_sha256=hashlib.sha256(path.read_bytes()).hexdigest())
        (ROOT / f'data/previews/{gender}_v4_selection.json').write_text(
            json.dumps(selection, ensure_ascii=False, indent=2) + '\n')
        print(f'{gender}: 計画40件、試作対象 {", ".join(ids)}')


if __name__ == '__main__':
    main()
