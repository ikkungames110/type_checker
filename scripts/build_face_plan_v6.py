"""ver5の10人を基準に、男女各60人の設定と閲覧用HTMLを再現可能に生成する。"""

from collections import Counter
from copy import deepcopy
import hashlib
import json
from pathlib import Path
import random

from build_face_plan_v3 import HAIR, KEYS, OUTLINE_KEYS, SCHEMA, tags
from build_face_plan_v5 import OUTLINES


ROOT = Path(__file__).resolve().parents[1]
COUNT = 60
VERSION = '6.0.0'
GROUPS = {
    'eyes': ('目', KEYS[:6]),
    'brows': ('眉', KEYS[6:10]),
    'outline': ('輪郭・頬', KEYS[10:19]),
    'nose': ('鼻', KEYS[19:22]),
    'mouth': ('口・唇', KEYS[22:]),
}
TAG_NAMES = dict(cool='クール', cute='かわいい', tsurime='つり目', tareme='垂れ目',
                 adult='大人っぽさ', idol='アイドル感', mysterious='ミステリアス',
                 shortFace='中顔面の短さ', soft='柔らかさ', sharp='シャープさ')


def spec(values, boundaries, labels, phrases):
    return dict(values=values, boundaries=boundaries, labels=labels, phrases=phrases)


# 同じ区切りを数値からの日本語説明・生成指示・配分検証の全てに使用する。
LEVELS = {
    'eye_shape': spec([.12,.30,.50,.70,.90], [.2,.4,.6,.8],
        ['丸い目','丸アーモンド','アーモンド','細アーモンド','切れ長'],
        ['round eyes with tall vertical apertures','rounded almond eyes','balanced almond eyes',
         'long slender almond eyes','very elongated narrow eyes with low vertical apertures']),
    'eye_angle': spec([.12,.30,.50,.70,.88], [.2,.4,.6,.8],
        ['垂れ目','やや垂れ目','水平','ややつり目','つり目'],
        ['distinctly downturned outer corners','slightly downturned outer corners','level eye corners',
         'slightly upturned outer corners','distinctly upturned outer corners']),
    'upper_eyelid_crease': spec([.05,.35,.85], [.2,.6], ['一重','奥二重','二重'],
        ['monolids with no visible upper-lid fold','hooded inner double lids with a discreet fold',
         'clear double eyelids with a visible fold']),
    'eye_size': spec([.25,.50,.80], [.35,.65], ['小さめ','中程度','大きめ'],
        ['small eye apertures relative to the face','medium eye apertures','large expressive eye apertures']),
    'eye_spacing': spec([.35,.50,.72], [.43,.62], ['やや寄り目','標準間隔','やや離れ目'],
        ['slightly close-set eyes','balanced eye spacing','visibly wide-set eyes within a natural range']),
    'lower_eyelid_fullness': spec([.20,.45,.72], [.35,.6], ['涙袋控えめ','涙袋中程度','涙袋ふっくら'],
        ['smooth restrained lower lids','moderate lower-lid fullness','naturally full lower lids']),
    'eyebrow_angle': spec([.15,.50,.82], [.35,.65], ['水平眉','少し上がる眉','上がる眉'],
        ['nearly horizontal eyebrows','slightly rising eyebrows','distinctly rising eyebrows']),
    'eyebrow_arch': spec([.15,.50,.82], [.35,.65], ['直線眉','緩い曲線眉','アーチ眉'],
        ['straight brow contours','gently curved brow contours','distinct arched brow contours']),
    'eyebrow_thickness': spec([.25,.50,.82], [.35,.65], ['細眉','中程度の眉','太眉'],
        ['fine eyebrows','medium-width eyebrows','full thick eyebrows']),
    'eyebrow_eye_distance': spec([.22,.48,.72], [.35,.6], ['眉と目が近い','眉と目の距離は中間','眉と目が離れる'],
        ['brows close above the eyes','moderate brow-to-eye distance','open space between brows and eyes']),
    'nose_bridge_height': spec([.22,.50,.82], [.35,.65], ['低めの鼻筋','中程度の鼻筋','高い鼻筋'],
        ['a low softly defined nasal bridge','a moderately defined nasal bridge','a high well-defined nasal bridge']),
    'nose_width': spec([.25,.47,.67], [.35,.6], ['細い鼻幅','中程度の鼻幅','やや広い鼻幅'],
        ['a slender natural nose width','a balanced nose width','a slightly broader natural nose base']),
    'nose_tip_roundness': spec([.20,.50,.82], [.35,.65], ['すっきりした鼻先','中程度の鼻先','丸い鼻先'],
        ['a refined tapered nose tip','a softly contoured nose tip','a visibly rounded nose tip']),
    'mouth_width': spec([.25,.37,.48], [.30,.43], ['小ぶりな口','やや小ぶりな口','中程度の口'],
        ['a petite narrow mouth','a slightly narrow mouth','an ordinary medium-width mouth']),
    'lip_fullness': spec([.18,.32,.46], [.25,.4], ['薄い唇','やや薄い唇','中程度の唇'],
        ['naturally thin lips','slender lips with restrained volume','natural medium-thin lips']),
    'upper_lip_share': spec([.25,.50,.78], [.4,.65], ['下唇主体','上唇やや薄め','上下の厚みが近い'],
        ['an upper lip clearly thinner than the lower lip','an upper lip moderately thinner than the lower lip',
         'upper and lower lips close in thickness']),
    'cupid_bow_definition': spec([.20,.50,.80], [.35,.65], ['上唇の山は緩い','上唇の山は中程度','上唇の山は明瞭'],
        ['a shallow Cupid bow','a moderate Cupid bow','a clearly defined natural Cupid bow']),
}
OUTLINE_NAMES = list(OUTLINES)
OUTLINE_PHRASES = {
    'round': 'a petite round face, very short midface and lower face, small curved jaw and short rounded chin; round through short proportions, never heavy cheeks',
    'short_oval': 'a short oval face, compact midface and lower face, gently tapered small jaw and softly rounded chin',
    'oval': 'a medium-length oval face, balanced midface and lower face, smoothly tapered jaw and softly contoured chin',
    'long_oval': 'a distinctly long oval face, long midface and lower face, narrow jaw and slender rounded chin',
    'soft_square': 'a compact square face, defined jaw corners and a relatively broad short squared chin, athletic natural structure',
    'rectangle': 'a distinctly rectangular long face, long lower face, straight side contours, defined jaw corners and a squared chin',
    'heart': 'a heart-shaped face, upper face visibly wider than the slender jaw, a small pointed chin, healthy smooth cheek support',
    'diamond': 'a diamond face, outer cheekbones the widest point, narrower temples and a tapered angular small chin; lower cheeks smoothly filled beneath the cheekbones',
}


def level(key, value):
    return sum(value >= boundary for boundary in LEVELS[key]['boundaries'])


def design_levels(record):
    return dict(outline=OUTLINE_NAMES.index(record['appearance_features']['face_outline']),
                hair=[h[0] for h in HAIR[record['gender']]].index(record['appearance_features']['hair_style']),
                **{key: level(key, record['shape_features'][key]) for key in LEVELS})


def pair_cost(a, b):
    joint, ac, bc = Counter(zip(a, b)), Counter(a), Counter(b)
    return sum((joint[x,y] - nx*ny/COUNT)**2/(nx*ny/COUNT)
               for x,nx in ac.items() for y,ny in bc.items())


def extend_columns(anchors, seed):
    """先頭10人を固定し、全60人で各カテゴリの人数差が最大1になるよう補完。"""
    rng = random.Random(seed)
    fixed = [design_levels(r) for r in anchors]
    sizes = {'outline': 8, **{k:len(s['values']) for k,s in LEVELS.items()}, 'hair':3}
    columns = {}
    for key, size in sizes.items():
        prefix = [r[key] for r in fixed]
        counts = Counter(prefix)
        tail = [i for i in range(size) for _ in range(COUNT//size + (i < COUNT%size) - counts[i])]
        assert len(tail) == 50
        candidates = []
        for _ in range(220):
            rng.shuffle(tail)
            candidates.append(prefix + tail.copy())
        columns[key] = min(candidates, key=lambda a:sum(pair_cost(a,b) for b in columns.values()))
    return columns


def describe(shape, outline, hair, gender):
    d = {key: s['labels'][level(key, shape[key])] for key,s in LEVELS.items()}
    return dict(outline=OUTLINES[outline][0],
                eyes='・'.join(d[k] for k in ['eye_shape','eye_angle','upper_eyelid_crease','eye_size','eye_spacing']),
                brows='・'.join(d[k] for k in ['eyebrow_thickness','eyebrow_arch','eyebrow_angle','eyebrow_eye_distance']),
                nose='・'.join(d[k] for k in ['nose_bridge_height','nose_width','nose_tip_roundness']),
                mouth='・'.join(d[k] for k in ['mouth_width','lip_fullness','upper_lip_share','cupid_bow_definition']),
                hair=next(h[1] for h in HAIR[gender] if h[0] == hair))


def make_prompt(record):
    shape, appearance = record['shape_features'], record['appearance_features']
    p = {k:s['phrases'][level(k,shape[k])] for k,s in LEVELS.items()}
    hair = next(h[2] for h in HAIR[record['gender']] if h[0] == appearance['hair_style'])
    subject = 'handsome man' if record['gender']=='male' else 'beautiful woman'
    return (
        f'Generate one distinct fictional adult Japanese {subject}, age 27. '
        'IDENTITY, highest priority: ' + OUTLINE_PHRASES[appearance['face_outline']] + '. '
        + 'Eyes: ' + '; '.join(p[k] for k in ['eye_shape','eye_angle','upper_eyelid_crease','eye_size','eye_spacing','lower_eyelid_fullness']) + '. '
        + 'Brows: ' + '; '.join(p[k] for k in ['eyebrow_thickness','eyebrow_arch','eyebrow_angle','eyebrow_eye_distance']) + '. '
        + 'Nose: ' + '; '.join(p[k] for k in ['nose_bridge_height','nose_width','nose_tip_roundness']) + '. '
        + 'Mouth: ' + '; '.join(p[k] for k in ['mouth_width','lip_fullness','upper_lip_share','cupid_bow_definition']) + '. '
        'Keep these anatomical contrasts clear and create an unrelated identity; do not average them into a generic idol face. '
        'High attractiveness through harmonious individual features and polished natural grooming. '
        'Naturally supported smooth cheeks, no sunken cheeks, no buccal hollows, no dark concave cheekbone shadows. '
        'Round faces remain petite with modest cheek fullness, no heavy puffiness or double chin. Normal slim neck. '
        'Mouth small to average, lips thin to moderate, no plumped lips. '
        f'Hair: {hair}. Dark brown irises, natural black hair, realistic skin texture. '
        'Minimal natural makeup, no winged eyeliner, no dramatic false lashes, no contour makeup, no facial hair, jewelry or glasses. '
        'Realistic editorial beauty photo, front-facing head level, eyes at camera, neutral expression, closed lips. '
        'Plain light-gray crew-neck shirt, neutral light-gray studio background, soft even frontal lighting. '
        'Vertical 3:4 portrait, full head, shoulders and mid-chest visible. Face from hairline to chin about 38 percent of image height, '
        'face center at 50 percent width and 38 percent height. Eyes and full cheek/jaw outline unobstructed. '
        'For downward fringe, allow partial eyebrow coverage with natural separated strands. No tight crop, no text, no watermark.'
    )


def make_plan(gender, seed):
    source = ROOT / f'data/plans/{gender}_faces_v5.json'
    anchors = json.loads(source.read_text())['records'][:10]
    columns = extend_columns(anchors, seed)
    records = []
    for i in range(COUNT):
        c = {k:v[i] for k,v in columns.items()}
        outline = OUTLINE_NAMES[c['outline']]
        shape = dict(zip(OUTLINE_KEYS, OUTLINES[outline][1]))
        shape.update({k:s['values'][c[k]] for k,s in LEVELS.items()})
        appearance = dict(face_outline=outline, hair_style=HAIR[gender][c['hair']][0])
        if i < 10:
            shape = deepcopy(anchors[i]['shape_features'])
            appearance = deepcopy(anchors[i]['appearance_features'])
        ident = f'{gender}_{i+1:03d}'
        description = describe(shape, outline, appearance['hair_style'], gender)
        record = dict(id=ident, gender=gender, image=None,
                      planned_image=f'assets/planned/v6/{gender}/{ident}.png',
                      label='・'.join([description['outline'], LEVELS['eye_shape']['labels'][c['eye_shape']],
                                      LEVELS['upper_eyelid_crease']['labels'][c['upper_eyelid_crease']],
                                      LEVELS['eyebrow_thickness']['labels'][c['eyebrow_thickness']],
                                      LEVELS['nose_bridge_height']['labels'][c['nose_bridge_height']]]),
                      tags=tags(shape), shape_features={k:shape[k] for k in KEYS},
                      appearance_features=appearance, description=description, design_levels=c,
                      schema_version='3.1.0', mapping_version='shape-impression-1', plan_version=VERSION,
                      asset_version='v6-planned', review_status='planned',
                      shape_feature_source='generation_target', shape_calibrated=False,
                      design_basis='v5-reference' if i<10 else 'expanded-combination',
                      source_plan=f'data/plans/{gender}_faces_v6.json',
                      reference_image=f'assets/previews/v5/{gender}/{ident}.png' if i<10 else None)
        record['prompt'] = make_prompt(record)
        records.append(record)
    coverage = {key:[dict(label=label, count=Counter(columns[key])[i]) for i,label in enumerate(labels)]
                for key,labels in dict(outline=[v[0] for v in OUTLINES.values()],
                    **{k:s['labels'] for k,s in LEVELS.items()}, hair=[h[1] for h in HAIR[gender]]).items()}
    return dict(plan_version=VERSION, schema_version='3.1.0', gender=gender, population=COUNT,
                design_seed=seed, reference_plan=str(source.relative_to(ROOT)),
                reference_plan_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                method='ver5の先頭10人の形態・髪型を維持し、50人を追加。分類ごとの人数を均等化し、部位の固定的な組み合わせを減らす決定的な探索。統計的独立性や実画像での識別性は未検証。',
                common_constraints=dict(age=27, nationality='Japanese', cheek_fullness_range=[.51,.56],
                    mouth_width_max=.50, lip_fullness_max=.50, no_sunken_cheeks=True,
                    petite_round_faces=True, attractiveness='全員が個々の顔立ちを保った整った容姿'),
                coverage=coverage, records=records)


def build():
    plans = [make_plan(gender,seed) for gender,seed in [('female',6090961),('male',6090962)]]
    for plan in plans:
        (ROOT/f"data/plans/{plan['gender']}_faces_v6.json").write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
    payload = dict(plans=plans, features=SCHEMA['features'], groups=GROUPS, levels=LEVELS,
                   tag_names=TAG_NAMES, outlines={k:v[0] for k,v in OUTLINES.items()})
    template = (ROOT/'scripts/templates/face_plan_v6.html').read_text()
    embedded = json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
    (ROOT/'docs/顔設定一覧_男女各60人_ver6.html').write_text(template.replace('__PLAN_DATA__',embedded))
    print('男女各60人の計画JSON・設定一覧HTMLを保存')


if __name__ == '__main__':
    build()
