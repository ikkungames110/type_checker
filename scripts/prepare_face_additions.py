"""既存v8の撮影条件を引き継ぎ、追加80人の全プロンプトを生成前に確定する。"""

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "data/previews/face_additions_v8.json"

# 各行が独立した人物。髪型だけでなく、輪郭・目・鼻・口の組み合わせを変える。
BRIEFS = {
    "female": {
        "cute": [
            "Short pear-shaped softly rounded face, broad soft lower cheeks, small round eyes with gently folded lids, a tiny low nose with a round tip, a broad delicate cupid's bow mouth. Straight black shoulder-length hair with a thin curved fringe; gentle affectionate expression.",
            "Compact heart-oval face with full upper cheeks and a soft broad chin, slightly upturned round almond eyes, fine level brows, a short broad-based nose and a small plush lower lip. Dark brown rounded bob with a diagonal fringe; quietly playful sweetness.",
            "Small circular face with a softly recessed rounded chin, close-set gentle oval eyes with delicate double lids, a neat narrow low nose and a wide softly full mouth. Chestnut straight collarbone hair parted at the side; warm restrained smile.",
            "Short broad soft oval face with softly low cheekbones, wide-set crescent eyes with round inner corners, softly curved brows, a petite blunt nose and a narrow full bow-shaped mouth. Black soft ear-length bob with wispy bangs; tender calm charm.",
            "Petite soft diamond-round face with plump central cheeks, luminous rounded monolid eyes, fine arched brows, a short neat straight nose and a generous lower lip beneath a fine upper lip. Dark brown shoulder-length loose waves with a light middle fringe; sweet approachable warmth.",
        ],
        "active_cute": [
            "Compact rounded triangular face with broad lower cheeks, big wide-set upward almond eyes, bold curved brows, a small broad nose and a wide strongly drawn cupid's bow. Black short layered bob with an open side part; bright magnetic vitality.",
            "Short broad heart-oval face and softly blunt chin, round close-set eyes with deep clear lids, high thick brows, a short substantial round-tipped nose and a compact full mouth. Chestnut collarbone waves with thin bangs; spirited confident expression.",
            "Compact round-square face with prominent apple cheeks, large softly downturned dark eyes, thick straight brows, a neat high short nose and broad plush lips. Black straight jaw-length bob tucked behind ears; lively warm presence.",
            "Short diamond-rounded face, broad upper cheeks and tiny rounded chin, big horizontal oval eyes with pronounced lids, strong angled brows, a low neat nose and a wide lower lip. Dark brown short shag with airy curtain bangs; expressive mischievous charm.",
            "Broad compact oval face with a rounded firm chin, striking round hooded eyes set wide apart, a softly high nose bridge and a small deeply curved full mouth. Black shoulder-length loose curls with open forehead; confident cheerful beauty.",
        ],
        "fresh": [
            "Short gently pear-shaped face with a wide rounded chin, small widely spaced horizontal monolid eyes, fine gently curved brows, a modest narrow nose and a broad fine mouth. Black straight short bob with a center part; easy natural freshness.",
            "Compact oval face with soft high cheeks, small close-set shallow almond eyes and nearly straight lids, a low round-tipped nose and a small flat soft mouth. Dark chestnut collarbone hair with fine side fringe; relaxed clear beauty.",
            "Broad short oval face with a smooth low jaw, narrow wide-set downturned eyes with light double lids, a modest straight broad-based nose and fine bowed lips. Black shoulder-length layers tucked behind ears; airy unassuming charm.",
            "Small soft rectangular face with a rounded blunt chin, calm narrow monolid eyes, thin arched brows, a petite subtly upturned nose and a wider mouth with a softly full lower lip. Dark brown pixie-length layers with soft bangs; gentle sporty freshness.",
            "Compact soft heart face with a broad forehead and rounded cheeks, modest horizontal almond eyes, delicate light brows, a short straight low nose and a fine small cupid's bow. Black smooth chin-length bob with airy curtain fringe; quiet natural charm.",
        ],
        "cool_casual": [
            "Short hexagonal face with angular low cheekbones and a small blunt chin, wide-set narrow level monolid eyes, firm straight brows, a short narrow square-tipped nose and broad flat lips. Black ear-length straight crop with open forehead; casual androgynous poise.",
            "Compact triangular angular face with a broad clean jaw, closer-set slender upward eyes, low straight brows, a neat broad nose and a small thin-lipped mouth. Dark brown short layered bob with wispy uneven fringe; clear independent charm.",
            "Short narrow rectangular face with sharp youthful cheek contours, long shallow-set hooded eyes, delicate angled brows, a short straight nose and a wide finely curved upper lip. Black straight jaw-length hair center-parted; relaxed graphic beauty.",
            "Broad compact angular oval face with a tapered flat chin, widely spaced slim almond eyes, full level brows, a broader low bridge with a neat nose tip and compact full straight lips. Black short tousled pixie with side fringe; sporty restrained presence.",
            "Small short kite-shaped face with broad temples and a clearly cut rounded jaw, close-set horizontal monolid eyes, a slim slightly upturned nose and a long fine-lipped mouth. Chestnut sleek cropped shag tucked off both eyes; cool unforced individuality.",
        ],
        "feminine": [
            "Long soft pear-oval face with generous low cheek fullness, wide-set rounded almond eyes with gentle outer slopes, fine curved brows, a slim softly rounded nose and a broad full lower lip. Black long gentle waves with open side part; warm romantic serenity.",
            "Elongated soft oval face with a broad rounded chin, close-set softly hooded large eyes, softly full brows, a smooth high narrow nose and a small plush bow-shaped mouth. Dark chestnut collarbone waves with curtain fringe; tender luminous beauty.",
            "Long soft diamond face with rounded high cheeks, large level eyes with clear curved lids, a moderately broad smooth nose and a wide gently curved full mouth. Black silky long hair swept behind shoulders; graceful youthful warmth.",
            "Long egg-shaped face with a delicate rounded lower jaw, large widely spaced gently upturned eyes, thin arched brows, a long round-tipped nose and a narrow full lower lip. Dark brown medium loose waves with airy side bangs; quiet romantic charm.",
            "Soft elongated round-square face with smooth full cheeks, expressive close-set oval eyes, fine softly straight brows, a neat short high nose and generous lips with a shallow cupid's bow. Black long layers with softly curled ends and center part; gentle assured beauty.",
        ],
        "soft_elegant": [
            "Long gently pear-shaped oval face with a soft full lower cheek, small wide-set horizontal hooded eyes, fine curved brows, a slim round-tipped nose and a wide delicate mouth. Black smooth long bob with an open side part; understated warm grace.",
            "Elongated narrow soft rectangular face with a rounded blunt chin, close-set shallow monolid eyes, light level brows, a modest long nose and a compact gently full lower lip. Brown straight collarbone hair with airy side bangs; calm fine-featured elegance.",
            "Long balanced soft diamond face with modest cheekbones and healthy fullness, small gently downturned eyes with subtle lids, a short narrow high nose and fine softly bowed lips. Black medium layers loosely parted in the middle; serene approachable beauty.",
            "Long softly oval face with a broad smooth forehead and delicate chin, narrow wide-set almond eyes, fine angled brows, a broader low straight nose and a wide fine upper lip over a soft lower lip. Dark chestnut shoulder-length hair tucked behind ears; airy quiet poise.",
            "Slender elongated egg-shaped face with rounded high cheeks, close-set gentle horizontal eyes, a long delicate straight nose and a small almost straight fine mouth. Black smooth collarbone bob with light curtain fringe; youthful restrained refinement.",
        ],
        "elegant": [
            "Long sculpted pear-oval face with a firm rounded jaw, large wide-set upward almond eyes, bold arched brows, a high slim round-tipped nose and a broad full cupid's bow mouth. Black long loose waves with open forehead; luminous assertive glamour.",
            "Elongated broad diamond face with a small blunt chin, large close-set level eyes with deep clear lids, thick softly angled brows, a substantial elegant nose and compact full lips. Dark brown silky shoulder waves with a side part; commanding youthful beauty.",
            "Long sculpted oval face with broad low cheekbones, striking large gently downturned eyes, defined curved brows, a narrow high straight nose and a wide full lower lip. Black collarbone layers with soft side fringe; warm dramatic presence.",
            "Long angular heart-oval face with smooth youthful cheeks, wide-set round hooded eyes, strong level brows, a bold softly broad nose and a narrow deeply bowed mouth. Chestnut long loose waves swept behind shoulders; vivid poised beauty.",
            "Balanced long rectangular-oval face with a clear jaw and softly rounded chin, large closer-set upturned dark eyes, graceful thick arched brows, a long fine nose and generous straight-defined lips. Black sleek long bob with center part; confident fashion-lead presence.",
        ],
        "cool": [
            "Long hexagonal face with strong low cheekbones and a narrow blunt chin, wide-set level monolid eyes, fine angled brows, a slim high squared-tip nose and a wide straight fine mouth. Black long straight hair with an open side part; composed youthful sharpness.",
            "Elongated angular pear-oval face with a broad crisp jaw, close-set narrow hooded eyes, straight dark brows, a long delicately rounded nose and a small firm lower lip. Dark brown straight shoulder-length hair tucked behind ears; quiet incisive beauty.",
            "Long narrow angular oval face with a softly flat chin, widely spaced slightly downturned slender eyes, level fine brows, a broad high straight nose and a narrow fine cupid's bow. Black sleek collarbone hair with center part; clear statuesque presence.",
            "Long kite-shaped face with broad temples and straight jaw lines, close-set upturned monolid eyes, firm angled brows, a narrow low straight nose and a wide full flat lower lip. Black long straight layers with light side fringe; restrained youthful intensity.",
            "Long broad angular oval face with a clean square chin, narrow horizontal almond eyes with subtle lids, thin straight brows, a high smooth nose with a rounded tip and compact precise lips. Chestnut straight long bob with open forehead; calm high-fashion beauty.",
        ],
    },
    "male": {
        "charming_soft": [
            "Short soft pear-shaped face with a broad rounded chin, wide-set gentle oval eyes with clear lids, curved fine brows, a neat round-tipped low nose and wide softly full lips. Black medium straight hair with airy side fringe; affectionate adult male charm.",
            "Compact soft heart-oval face with round upper cheeks, close-set crescent monolid eyes, thick softly curved brows, a short narrow nose and a small full bow-shaped mouth. Dark brown loose short waves with a middle part; tender playful warmth.",
            "Broad softly round-square face with smooth low cheeks, wide-set softly downturned round eyes, a modest high straight nose and a broad fine upper lip over a full lower lip. Black soft ear-length crop with a thin fringe; friendly quiet sweetness.",
            "Small round-oval face with a gently broad chin, bright close-set almond eyes with round corners, level brows, a short broad nose and a compact gently curved mouth. Chestnut straight layered hair tucked off the eyes; easy warm male beauty.",
            "Short soft diamond face with plush high cheeks and round chin, large relaxed hooded eyes, softly arched brows, a slim round-tipped nose and wide full bowed lips. Black short tousled hair with a soft side part; calm lovable charm.",
        ],
        "charming_hard": [
            "Compact broad pear-oval face with a firm rounded jaw, large wide-set round eyes with deep lids, bold angled brows, a short high slim nose and a broad full cupid's bow mouth. Black short wavy crop with side part; playful magnetic confidence.",
            "Short sculpted heart face with prominent youthful cheeks, intense close-set upturned almond eyes, thick curved brows, a substantial round-tipped nose and a compact wide lower lip. Dark brown short layers with open forehead; energetic handsome warmth.",
            "Broad compact round-square face with a blunt chin, large horizontal hooded eyes, full straight brows, a neat narrow high nose and generous sharply defined lips. Black medium waves with curtain fringe; lively concentrated presence.",
            "Short angular diamond-oval face with a broad lower jaw, large gently downturned eyes set wide apart, thick arched brows, a strong short broad nose and a small full bowed mouth. Chestnut textured crop with light bangs; spirited approachable beauty.",
            "Compact broad oval face with a firm small chin, striking close-set rounded monolid eyes, strong angled brows, a short straight nose and a wide fine upper lip over a full lower lip. Black straight short hair loosely brushed up; bright athletic charm.",
        ],
        "fresh_soft": [
            "Short soft pear-oval face with a rounded broad chin, small wide-set level monolid eyes, light curved brows, a narrow low round-tipped nose and a wide delicate mouth. Black airy short layers with open side part; quiet friendly freshness.",
            "Compact rounded oval face with smooth high cheeks, close-set small softly downturned eyes with subtle lids, a modest broad straight nose and compact flat soft lips. Dark brown straight crop with a fine fringe; clean unforced warmth.",
            "Short soft rectangular face with rounded jaw corners, shallow wide-set almond eyes, fine straight brows, a short small high nose and a generous fine-lipped mouth. Black medium light waves tucked away from the eyes; relaxed breezy charm.",
            "Broad compact soft heart face with a small round chin, narrow horizontal hooded eyes, thin slightly angled brows, a short low broad-based nose and a small bowed upper lip. Chestnut smooth short hair with a loose middle part; serene approachable beauty.",
            "Small short oval face with a broad forehead and gently low cheeks, narrow close-set monolid eyes, understated brows, a neat round-tipped nose and a wider softly full lower lip. Black short straight layers with airy side bangs; candid gentle freshness.",
        ],
        "fresh_hard": [
            "Short angular hexagonal face with a blunt narrow chin, wide-set slender hooded eyes, low firm brows, a short slim high nose and broad flat-defined lips. Black short textured crew crop; sporty youthful sharpness.",
            "Compact angular pear-shaped face with a broad clean jaw, close-set level monolid eyes, thick straight brows, a neat wide nose and a narrow thin-lipped mouth. Dark brown cropped shag with a side fringe; relaxed athletic confidence.",
            "Short narrow rectangular face with crisp high cheekbones, wide-set upward almond eyes with subtle lids, fine angled brows, a short straight broad-based nose and a wide fine mouth. Black ear-length smooth layers with open forehead; fresh model-like individuality.",
            "Broad compact angular oval face with a tapered square chin, small close-set hooded eyes, distinct level brows, a short round-tipped narrow nose and a full flat lower lip. Chestnut textured short hair with soft center fringe; clear unforced strength.",
            "Short kite-shaped face with broad upper cheeks and a firm rounded jaw, narrow gently downturned monolid eyes, thick angled brows, a low straight nose and compact precise lips. Black short crop with thin irregular bangs; quiet crisp youthful charm.",
        ],
        "elegant_soft": [
            "Long soft pear-oval face with broad full lower cheeks, large wide-set gently hooded eyes, fine curved brows, a long slim round-tipped nose and a wide softly full mouth. Black smooth medium hair with open side part; gracious romantic warmth.",
            "Elongated soft oval face with a small broad rounded chin, close-set warm upward almond eyes, softly thick brows, a high smooth broad-based nose and a compact full cupid's bow. Dark chestnut loose short waves with a middle part; luminous young leading-man beauty.",
            "Long softly diamond-shaped face with smooth high cheeks, large level oval eyes with clear lids, a modest narrow straight nose and generous gently curved lips. Black collar-length layers tucked behind ears; calm expressive elegance.",
            "Long egg-shaped face with a soft strong lower jaw, wide-set rounded downturned eyes, light arched brows, a long broad rounded nose and a small full lower lip. Brown wavy medium hair with side fringe; tender refined presence.",
            "Elongated soft round-square face with healthy cheek volume, close-set large almond eyes, fine level brows, a short high neat nose and a broad bowed fine upper lip over a plush lower lip. Black swept-back soft waves; youthful romantic composure.",
        ],
        "elegant_hard": [
            "Long sculpted pear-oval face with a broad firm jaw, large wide-set upturned almond eyes, thick angled brows, a slim high square-tipped nose and a wide full bowed mouth. Black dense short waves with open side part; bold youthful glamour.",
            "Elongated broad diamond face with a blunt rounded chin, close-set large round hooded eyes, expressive thick arched brows, a strong broad high nose and compact full straight lips. Dark brown medium textured hair with curtain fringe; magnetic athletic beauty.",
            "Long strong oval face with pronounced low cheekbones, large wide-set gently downturned eyes, straight bold brows, a long narrow rounded-tip nose and a broad defined lower lip. Black short hair brushed loosely back; warm commanding presence.",
            "Broad long angular heart-oval face with firm jaw corners, large close-set level almond eyes with deep lids, full curved brows, a substantial high straight nose and a small generous cupid's bow. Chestnut short wavy crop with side fringe; striking poised beauty.",
            "Long sculpted rectangular-oval face with a broad clean chin, large upward hooded eyes, thick nearly straight brows, a slim smooth high nose and wide naturally full lips. Black medium waves parted off center; confident polished young male presence.",
        ],
        "cool_soft": [
            "Long softly pear-shaped face with a broad rounded chin, wide-set narrow horizontal monolid eyes, fine gently angled brows, a slim low straight nose and a wide delicate mouth. Black smooth medium side-parted hair; serene intellectual warmth.",
            "Elongated narrow oval face with soft high cheeks, close-set small downturned hooded eyes, light straight brows, a longer broad round-tipped nose and compact flat soft lips. Dark brown straight short hair with airy fringe; quiet youthful refinement.",
            "Long softly hexagonal face with a narrow blunt chin, wide-set slender almond eyes with subtle lids, fine level brows, a short high narrow nose and a wide full flat lower lip. Black collar-length layers with a loose middle part; gentle poised beauty.",
            "Long balanced soft rectangular face with smooth youthful cheeks, narrow close-set monolid eyes, thin angled brows, a long neat high nose and a small fine cupid's bow mouth. Chestnut smooth crop swept to the side; understated calm charm.",
            "Elongated soft heart-oval face with a rounded broad chin, narrow relaxed level eyes, delicate straight brows, a modest broad-based nose and wide finely shaped lips. Black short light waves with forehead open; clear gentle elegance.",
        ],
        "cool_hard": [
            "Long angular hexagonal face with broad low cheekbones and a firm blunt chin, widely spaced narrow monolid eyes, strong angled brows, a high narrow squared-tip nose and a broad flat firm mouth. Black very short textured crop; focused powerful youthful beauty.",
            "Long angular pear-oval face with a strong wide square jaw, close-set slender upward hooded eyes, thick level brows, a long round-tipped substantial nose and compact thin lips. Dark brown short straight hair side-parted; composed incisive presence.",
            "Elongated angular oval face with a narrow square chin, wide-set horizontal almond eyes with subtle lids, bold straight brows, a broad high straight nose and a small full flat lower lip. Black short brushed-back hair; clear athletic intensity.",
            "Long broad kite-shaped face with angular temples and a crisp jaw, very narrow close-set monolid eyes, heavy angled brows, a slim long straight nose and a wide fine bowed upper lip. Black short textured shag with a light side fringe; calm formidable young beauty.",
            "Long clean rectangular face with strong cheekbones and a rounded firm chin, narrow wide-set slightly downturned hooded eyes, thick straight brows, a short high broad-based nose and compact sharply defined full lips. Chestnut neat crew cut; quiet masculine strength.",
        ],
    },
}


def main():
    if DEST.exists():
        raise SystemExit(f"既存の生成計画を上書きしません: {DEST}")
    records = []
    for gender, groups in BRIEFS.items():
        source = (ROOT / f"data/{gender}_faces.js").read_text()
        current = json.loads(source[source.index("["):source.rindex("]") + 1])
        assert len(current) == 40
        assert list(groups) == list(dict.fromkeys(r["type"] for r in current))
        for group_index, (type_id, briefs) in enumerate(groups.items()):
            base = next(r for r in current if r["type"] == type_id)
            assert len(briefs) == 5
            for index, brief in enumerate(briefs):
                identity = f"{gender}_{41 + group_index * 5 + index:03d}"
                prompt = base["prompt"].replace(base["identity_brief"], brief)
                records.append({
                    "id": identity, "gender": gender, "type": type_id,
                    "label": base["label"], "classification_label": base["classification_label"],
                    "description": base["description"], "variant": index + 6, "age": 25,
                    "asset_version": "v8-additions-preview", "status": "planned",
                    "image": f"assets/previews/v8-additions/{gender}/{identity}.png",
                    "identity_brief": brief, "prompt": prompt,
                    "generation": {"method": "built-in image_gen", "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest()},
                })
    assert len(records) == len({r["prompt"] for r in records}) == 80
    document = {"version": "v8-additions-preview", "status": "preview-only", "age": 25,
                "portraits_per_gender": 40, "additional_portraits_per_type": 5,
                "review_status": "pending", "records": records}
    DEST.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    print(f"全80人の個別プロンプトを保存: {DEST}")


if __name__ == "__main__":
    main()
