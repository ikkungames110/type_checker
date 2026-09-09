"""顔そのものの差を優先した10系統×4人の生成計画。画像生成前に全80件を保存する。"""

from collections import Counter
import hashlib
import json
from pathlib import Path

from build_face_plan_v3 import HAIR, OUTLINE_KEYS, tags


ROOT = Path(__file__).resolve().parents[1]
OUTLINES = {
    'round': ('小ぶりな丸型', [.18,.25,.28,.43,.15,.43,.85,.28,.56]),
    'short_oval': ('短い卵型', [.30,.30,.38,.40,.25,.35,.66,.36,.54]),
    'oval': ('卵型', [.50,.48,.50,.46,.38,.43,.50,.43,.52]),
    'long_oval': ('面長卵型', [.82,.73,.67,.32,.32,.33,.50,.43,.51]),
    'soft_square': ('ベース型', [.33,.36,.42,.73,.68,.68,.37,.45,.54]),
    'rectangle': ('長方形', [.78,.63,.73,.68,.73,.67,.30,.48,.51]),
    'heart': ('逆三角型', [.48,.43,.45,.20,.38,.17,.18,.49,.52]),
    'diamond': ('菱形', [.63,.52,.57,.30,.57,.28,.30,.73,.52]),
}
FEATURE_KEYS = ['eye_shape','eye_angle','eye_size','eye_spacing','upper_eyelid_crease',
                'lower_eyelid_fullness','eyebrow_angle','eyebrow_arch','eyebrow_thickness',
                'eyebrow_eye_distance','nose_bridge_height','nose_width','nose_tip_roundness',
                'mouth_width','lip_fullness','upper_lip_share','cupid_bow_definition']
# 輪郭、髪型、17部位目標、主要な形態指定。一重・二重も美醜の差にせず個性として保持する。
PROFILES = {
 'male': [
  ('切れ長一重・細眉・低めの鼻筋', 'oval', 0,
   [.95,.85,.20,.60,.05,.25,.20,.10,.25,.65,.22,.38,.50,.40,.22,.40,.30],
   'A distinctly understated, sleek Japanese face: very long NARROW MONOLID eyes with no visible upper-lid fold, small vertical eye openings and noticeably rising outer corners. Fine almost straight eyebrows set relatively high above the eyes. A low softly defined nasal bridge and a neat small nose. Medium oval outline, a smooth rounded chin and softly supported cheeks. Thin straight lips. The narrow monolid eye structure and fine brows are essential to his handsome identity.'),
  ('丸い二重・短い顔・丸い鼻先', 'short_oval', 1,
   [.08,.12,.85,.58,.85,.65,.20,.30,.65,.45,.28,.53,.82,.32,.45,.35,.60],
   'A bright, sweet-looking adult man with large ROUND double-lidded eyes, tall open eye apertures and clearly drooping outer corners. A very short midface, small rounded jaw and soft compact chin. A short low-bridged nose with a visibly rounded tip, straight full eyebrows and a small softly defined mouth. Natural youthful facial softness at adult age 27. Preserve his big round drooping eyes and short facial proportions.'),
  ('彫りの深い目・角張った顎・太眉', 'soft_square', 2,
   [.50,.55,.64,.32,.92,.20,.50,.65,.92,.16,.90,.57,.25,.50,.32,.38,.70],
   'A strikingly handsome masculine adult with a compact SQUARE lower face, visible jaw corners and a broad squared chin. Deep-set medium-large almond eyes with pronounced double eyelids, relatively close-set eyes beneath dense dark thick low-set eyebrows. A high straight substantial nasal bridge with a firm refined tip. A naturally strong athletic facial structure, smooth well-supported cheeks and a medium-width thin-lipped mouth. His square chin, thick low brows and deep-set eyes must be unmistakable.'),
  ('細長い輪郭・細い水平眼・細い鼻', 'long_oval', 0,
   [.90,.50,.25,.47,.25,.15,.30,.70,.20,.50,.78,.18,.20,.34,.15,.45,.35],
   'An elegant androgynous-looking adult man with a visibly LONG slender oval face, long midface and long narrow softly rounded chin. Small elongated horizontal eyes with hooded inner double lids, delicate thin arched eyebrows, a long high narrow nose and very thin finely drawn lips. Restrained, cool intellectual beauty. Keep his long facial proportions and small horizontal eye apertures; his cheeks retain smooth healthy volume.'),
  ('小ぶりな丸顔・垂れ一重・横長眉', 'round', 1,
   [.78,.12,.25,.75,.05,.50,.12,.10,.73,.50,.18,.60,.85,.35,.30,.35,.20],
   'A charming adult man with a genuinely ROUND but petite face: short midface, short lower face and a small rounded chin, with a compact curved outline. Small gently downturned monolid eyes set relatively wide apart. Broad straight eyebrows, a low nasal bridge and a small rounded button-like tip. Short soft lips. Keep the face round through its short proportions and rounded chin, with modest cheek volume and a normal slim neck.'),
  ('逆三角型・上がった猫目・尖り気味の顎', 'heart', 2,
   [.82,.92,.48,.42,.45,.22,.85,.65,.40,.30,.73,.22,.15,.28,.23,.45,.80],
   'A charismatic sharp-featured adult man with a HEART-shaped face: visibly wider forehead and upper face taper sharply toward a very narrow jaw and small pointed chin. Long feline eyes with strongly upturned outer corners and subtle inner double lids. Rising angular eyebrows, a slender high nose with a neat pointed tip and a compact thin-lipped mouth with a crisp Cupid bow. Preserve the V-shaped lower face and upward eye slant, with healthy smooth cheeks.'),
  ('縦長の顔・大きな垂れ目・長い鼻筋', 'long_oval', 0,
   [.25,.08,.80,.35,.90,.35,.35,.80,.76,.22,.92,.40,.38,.47,.40,.30,.55],
   'A refined, mature-looking handsome man, age 27, with a noticeably long midface and long softly rounded lower face. Large deep-set DOWN-TURNED eyes with broad clear double-lid folds, thick curved brows close to the eyes. A long prominent high nasal bridge with a very slight natural convexity and a slim softly rounded tip. Medium-width restrained lips. A distinguished expressive face with smooth filled-out cheeks and no aging lines.'),
  ('短い角型・水平一重・幅のある鼻筋', 'soft_square', 2,
   [.65,.50,.37,.57,.08,.25,.12,.10,.90,.20,.48,.72,.67,.45,.22,.40,.25],
   'A handsome sporty adult with a SHORT SQUARE face, wide angular lower jaw and a short broad chin. Level horizontally elongated monolid eyes, broad dense straight brows close above them. A medium-height straight nasal bridge with a visibly wider natural nose base and rounded tip. Thin horizontal lips and a compact midface. Give him a clear robust square facial structure and smooth healthy cheeks, without widening his neck or making him heavy.'),
  ('離れ気味の二重・穏やかな眉・短い鼻', 'oval', 1,
   [.30,.25,.68,.82,.80,.70,.20,.40,.43,.70,.40,.43,.70,.30,.48,.25,.40],
   'A gentle, airy-looking attractive adult man with a balanced medium oval face and a soft oval chin. Wide-set generously open rounded almond eyes with clear double lids and mildly downturned corners. Fine softly curved brows set noticeably farther above the eyes. A short delicately rounded nose with a moderate-low bridge and a small mouth with a thin upper lip and softly fuller lower lip. Preserve the wide eye spacing, open brow area and gentle eye shape.'),
  ('菱形・大きな水平眼・高い眉山', 'diamond', 0,
   [.42,.53,.76,.48,.88,.35,.75,.88,.56,.36,.77,.28,.28,.40,.28,.40,.80],
   'A distinctive handsome man with a DIAMOND face: outer cheekbones are the widest part, temples distinctly narrower and jaw tapering toward a small angular chin. Large horizontally open almond eyes with clear double eyelids, clean high-arched angular brows and a straight high narrow nose. A finely shaped medium-small mouth with thin lips and a clear Cupid bow. Cheekbone breadth defines the outline while the lower cheeks remain smoothly filled, never hollow.'),
 ],
 'female': [
  ('小ぶりな丸顔・大きな丸い二重・短い鼻', 'round', 1,
   [.06,.20,.88,.60,.90,.65,.10,.20,.40,.57,.20,.42,.85,.25,.42,.32,.50],
   'A radiant, sweetly beautiful adult woman with a genuinely ROUND petite face, exceptionally short midface, short rounded chin and compact curved jaw. Very large ROUND eyes with tall vertical openings, clear double eyelids and softly drooping outer corners. Delicate nearly horizontal brows, a short low-bridged button nose with a round tip and a tiny softly shaped mouth. Her short round facial proportions and large round eyes are essential. Adult age 27, normal slim neck, modest smooth cheek volume.'),
  ('面長・切れ長一重・細い鼻筋', 'long_oval', 0,
   [.97,.90,.18,.68,.03,.18,.30,.20,.24,.64,.85,.18,.20,.38,.15,.45,.30],
   'A strikingly elegant Japanese fashion beauty with a LONG narrow oval face, long midface and long slender rounded chin. Extremely elongated NARROW MONOLID eyes with no visible lid fold, small vertical apertures and distinctly upturned outer corners. Fine long almost straight eyebrows, a long high narrow straight nose, very thin clean lips. Preserve the small monolid eye openings and elongated facial proportions as the source of her beauty. Healthy smooth cheeks with natural soft-tissue support.'),
  ('ベース型・厚めの眉・奥二重', 'soft_square', 2,
   [.60,.50,.42,.45,.35,.20,.15,.10,.85,.22,.55,.66,.60,.45,.35,.35,.35],
   'A fresh, confidently beautiful athletic-looking adult woman with a SHORT SQUARE face, clear jaw corners and a short squared chin. Medium horizontally elongated eyes with hooded inner double lids and level corners. Dense broad straight eyebrows sit close above the eyes. A moderately defined straight nose with a slightly wider natural base and softly rounded tip, medium-small understated lips. Maintain the square jaw and strong straight brows with smooth healthy cheeks and normal slim neck.'),
  ('逆三角型・つり猫目・細いアーチ眉', 'heart', 0,
   [.86,.94,.52,.38,.50,.25,.87,.88,.22,.45,.75,.18,.12,.28,.23,.48,.90],
   'A captivating feline-looking adult Japanese beauty with a HEART-shaped face, wider upper face narrowing decisively to a delicate very pointed chin. Long oblique cat eyes with strongly raised outer corners and a fine double-lid crease. Slender high-arched eyebrows, a narrow high nose with a sharply refined small tip and finely shaped thin lips with a crisp Cupid bow. Preserve the oblique feline eyes, delicate arches and V-shaped jaw. Smooth healthy cheek volume.'),
  ('長い卵型・深い垂れ二重・立体的な鼻', 'long_oval', 2,
   [.23,.07,.82,.32,.94,.33,.40,.77,.70,.20,.93,.43,.35,.50,.45,.28,.60],
   'A memorably beautiful mature-looking Japanese woman, age 27, with a LONG midface, long oval lower face and a softly rounded chin. Large DEEP-SET downward-slanting eyes with broad clear double-lid folds, thick gracefully arched brows sitting low over the eyes. A prominent long high nose with a slight natural convex bridge and refined tip. A medium-width mouth with restrained medium-thin lips. Distinguished, expressive facial beauty with naturally supported cheeks and youthful skin.'),
  ('小ぶりな丸顔・細い垂れ一重・低い鼻筋', 'round', 0,
   [.88,.10,.20,.80,.04,.43,.10,.10,.28,.65,.15,.55,.80,.28,.22,.40,.20],
   'A quietly charming adult Japanese beauty with a SMALL ROUND face, short central face and compact rounded chin. Small narrow downturned MONOLID eyes, noticeably wide apart, with smooth upper lids. Thin horizontal brows set relatively high. A low softly defined nasal bridge, small round tip and delicate short thin lips. Make her softly round face, narrow drooping monolids and wide eye spacing clear; her cheeks have modest healthy volume and her neck is slim.'),
  ('菱形・横長の大きな二重・高い眉山', 'diamond', 2,
   [.50,.50,.80,.50,.90,.30,.72,.90,.45,.30,.77,.27,.25,.42,.28,.45,.80],
   'A distinctive glamorous Japanese beauty with a DIAMOND-shaped face: visible cheekbone breadth, narrow temples and a slim angular chin. Large horizontally open almond eyes with pronounced double eyelids and level corners. Clean angular high-arched brows, a high straight narrow nose and a precise thin-lipped mouth. Preserve the width at the outer cheekbones and the straight eye axis. Lower cheeks retain smooth natural soft tissue with no hollows or dark cheekbone shadows.'),
  ('短い卵型・離れた丸目・丸い鼻先', 'short_oval', 1,
   [.10,.15,.86,.85,.88,.78,.25,.50,.26,.72,.32,.65,.85,.32,.49,.25,.45],
   'A warm, naturally lovely adult woman with a SHORT OVAL face and a small softly rounded jaw. Large round slightly drooping double-lidded eyes set visibly wide apart, gently full lower lids and delicate softly curved brows with generous brow-to-eye space. A short low-to-medium nasal bridge and a wider softly rounded nose tip. Small mouth with a thin upper lip and moderate lower lip. Preserve the open eye spacing, round eye apertures and short facial proportions.'),
  ('長方形・細い水平眼・薄い唇', 'rectangle', 0,
   [.92,.50,.23,.44,.25,.20,.73,.25,.75,.25,.35,.64,.52,.42,.14,.45,.20],
   'A cool, poised, beautiful adult woman with a visibly RECTANGULAR face, longer lower face, straight side contours and a squared chin. Small elongated horizontal eyes with discreet inner double lids. Thick rising nearly straight brows, a softly defined medium-low nose bridge with a slightly wider base, and very thin straight lips. Preserve the long rectangular outline, squared chin and restrained eye apertures. Smooth healthy cheeks and balanced professional grooming.'),
  ('卵型・大きな上向き二重・濃いアーチ眉', 'oval', 1,
   [.35,.83,.85,.37,.93,.40,.78,.75,.80,.30,.88,.25,.22,.42,.35,.38,.70],
   'A vivid, striking adult Japanese beauty with a balanced medium OVAL face and a softly tapered chin. Large expressive upward-slanting almond eyes with deep clear double eyelids. Strong dark arched eyebrows close above the eyes, a high slender straight nose with a small refined tip, and finely defined medium-small thin lips. Preserve the strong brow-and-eye structure, large upturned double-lidded eyes and high nose bridge. Healthy smooth cheeks with natural skin texture.'),
 ],
}


def make_plan(gender):
    records = []
    subject = 'handsome man' if gender == 'male' else 'beautiful woman'
    for variant in range(4):
        for profile_index, (label, outline, hair_index, values, identity) in enumerate(PROFILES[gender]):
            shape = dict(zip(OUTLINE_KEYS, OUTLINES[outline][1]))
            shape.update(zip(FEATURE_KEYS, values))
            # 追加30件も生成前に特徴を確定。試作は各系統の第1人物だけを生成する。
            hair = HAIR[gender][(hair_index + variant) % 3]
            variation = ''
            if variant:
                shape['eye_spacing'] = [.35, .50, .70][variant-1]
                shape['mouth_width'] = [.25, .38, .50][variant-1]
                shape['lip_fullness'] = [.18, .32, .48][variant-1]
                variation = ('Secondary proportion overrides for this separate person: '
                    + ['slightly close-set eyes; a petite mouth with very thin lips.',
                       'balanced eye spacing; a medium-small mouth with slender lips.',
                       'slightly wide-set eyes; an average-width mouth with restrained medium-thin lips.'][variant-1] + ' ')
            ident = f'{gender}_{len(records)+1:03d}'
            prompt = (
                'Use case: photorealistic-natural. Generate one completely NEW fictional adult Japanese '
                + subject + ', age 27. An unrelated new facial identity for a face-preference quiz.\n'
                + 'IDENTITY — highest priority: ' + identity + '\n' + variation
                + 'These specific anatomical characteristics define this individual. Keep every stated eye shape, eyelid structure, facial length, nose geometry and jaw shape clearly visible; do not average them into a standard idol face or reuse the identity from earlier portraits. '
                + 'The subject is highly attractive through these individual features, with polished natural grooming and harmonious realistic anatomy. '
                + 'Keep cheeks naturally supported and smooth: no sunken cheeks, no buccal hollows, no heavy puffiness, no double chin. '
                + 'Mouth remains small to average, lips thin to moderate, never plumped.\n'
                + f'Hair: {hair[2]}. '
                + 'Dark brown irises, natural black hair, realistic clear skin texture, minimal natural makeup, no contour makeup, no facial hair, no jewelry, no glasses. '
                + 'Realistic editorial beauty photograph. Front-facing head level, look straight at camera, relaxed neutral expression, closed lips. '
                + 'Plain light-gray crew-neck shirt, neutral light-gray studio background, soft even frontal studio lighting. '
                + 'Vertical 3:4 portrait, full head, shoulders and mid-chest visible. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. '
                + 'Keep the eyes and full cheek/jaw outline unobstructed, no tight crop, no text, no watermark.'
            )
            records.append(dict(id=ident, gender=gender, image=None,
                planned_image=f'assets/previews/v5/{gender}/{ident}.png',
                label=OUTLINES[outline][0]+'・'+label, tags=tags(shape), prompt=prompt,
                shape_features=shape, appearance_features=dict(face_outline=outline,hair_style=hair[0]),
                profile_index=profile_index+1, profile_variant=variant+1,
                schema_version='3.1.0', mapping_version='shape-impression-1', plan_version='5.0.0',
                asset_version='v5-planned', review_status='planned', shape_feature_source='generation_target',
                source_plan=f'data/plans/{gender}_faces_v5.json'))
    return dict(plan_version='5.0.0',schema_version='3.1.0',gender=gender,records=records,
                method='10種類の顔立ちを明示設計し、各4人の全40件を画像生成前に確定。先頭10件を試作。',
                coverage=dict(Counter(r['appearance_features']['face_outline'] for r in records)))


def main():
    for gender in PROFILES:
        plan = make_plan(gender)
        path = ROOT / f'data/plans/{gender}_faces_v5.json'
        path.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
        selection = dict(gender=gender,population=40,sample_size=10,
                         ids=[r['id'] for r in plan['records'][:10]],
                         method='顔立ちの異なる10系統から各1人。目・眉・鼻・輪郭の差を確認する目的抽出。',
                         source_plan=str(path.relative_to(ROOT)),
                         plan_sha256=hashlib.sha256(path.read_bytes()).hexdigest())
        (ROOT / f'data/previews/{gender}_v5_selection.json').write_text(
            json.dumps(selection,ensure_ascii=False,indent=2)+'\n')
        print(f'{gender}: 全40件の計画、試作10件の選定を保存')


if __name__ == '__main__':
    main()
