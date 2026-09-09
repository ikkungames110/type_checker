// 試作画像の特徴量は生成目標。ユーザー確認前。
window.FEMALE_FACE_PREVIEW_V4 = [
  {
    "id": "female_023",
    "gender": "female",
    "image": "assets/previews/v4/female/female_023.png",
    "label": "丸型・細アーモンド・水平・唇中間／中間・センターパート",
    "tags": {
      "cool": 0.42,
      "cute": 0.44,
      "tsurime": 0.0,
      "tareme": 0.0,
      "adult": 0.27,
      "idol": 0.39,
      "mysterious": 0.63,
      "shortFace": 0.68,
      "soft": 0.64,
      "sharp": 0.44
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a petite round face with a short midface, a compact softly curved jaw and a small rounded chin; gentle cheek curves within a small facial outline, delicate rather than broad proportions. Eyes: long almond eyes with a low vertical opening; level inner and outer eye corners; subtle upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a clearly thinner upper lip than lower lip; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a softly defined nasal bridge, a softly contoured nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, fine eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a center part, forehead exposed and side strands tucked behind the ears. Additional proportions: subtly sized eyes, slightly close-set eyes, low eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.22,
      "midface_ratio": 0.32,
      "lower_face_ratio": 0.32,
      "jaw_width": 0.4,
      "jaw_angularity": 0.18,
      "chin_width": 0.36,
      "chin_roundness": 0.72,
      "cheekbone_prominence": 0.28,
      "cheek_fullness": 0.56,
      "eye_angle": 0.5,
      "eye_shape": 0.675,
      "eye_size": 0.2,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.2,
      "eyebrow_eye_distance": 0.2,
      "nose_bridge_height": 0.2,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.5,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.2,
      "cupid_bow_definition": 0.5
    },
    "appearance_features": {
      "face_outline": "round",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 0,
      "eye_shape": 3,
      "eye_angle": 2,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 1,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 0,
      "eyebrow_angle": 1,
      "hair": 0,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 0,
      "cupid_bow_definition": 1,
      "eye_size": 0,
      "eye_spacing": 0,
      "eyebrow_eye_distance": 0,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-748e3550-8913-44c5-9de5-d41b01fb613d.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "dbd31a1fc228dfcd3136327955af248b0bfd55761f5055407aa701cbc0e384ec",
      "face_box": [
        292,
        347,
        507,
        507
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "11ad62e70505cf00669f1993d0facefb45c2b244eb842661cb4559af3c4e9dd8"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬はなめらかで顎幅は小ぶり。丸型指定は短い卵型寄り、切れ長の目は目標より開きが大きい。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "female_027",
    "gender": "female",
    "image": "assets/previews/v4/female/female_027.png",
    "label": "丸型・丸アーモンド・垂れ・唇やや短い／中間・額出し",
    "tags": {
      "cool": 0.34,
      "cute": 0.54,
      "tsurime": 0.0,
      "tareme": 0.7,
      "adult": 0.39,
      "idol": 0.51,
      "mysterious": 0.53,
      "shortFace": 0.68,
      "soft": 0.64,
      "sharp": 0.35
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a petite round face with a short midface, a compact softly curved jaw and a small rounded chin; gentle cheek curves within a small facial outline, delicate rather than broad proportions. Eyes: rounded almond eyes with a tall central opening; clearly downturned outer corners, a natural gentle downward slant about 4 degrees; subtle upper-eyelid creases. Mouth: a slightly narrow mouth; ordinary medium-thin lips with restrained natural volume; a moderately thinner upper lip than lower lip; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slightly broader nose width, a well-defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: arched eyebrow contours, fine eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: black shoulder-length hair with the front section lifted and swept back, full forehead visible, side hair tucked behind the ears. Additional proportions: medium-sized eyes, slightly close-set eyes, balanced eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.22,
      "midface_ratio": 0.32,
      "lower_face_ratio": 0.32,
      "jaw_width": 0.4,
      "jaw_angularity": 0.18,
      "chin_width": 0.36,
      "chin_roundness": 0.72,
      "cheekbone_prominence": 0.28,
      "cheek_fullness": 0.56,
      "eye_angle": 0.15,
      "eye_shape": 0.325,
      "eye_size": 0.5,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.8,
      "eyebrow_thickness": 0.2,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.8,
      "nose_width": 0.8,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.325,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.5,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "round",
      "hair_style": "up_bang"
    },
    "design_levels": {
      "outline": 0,
      "eye_shape": 1,
      "eye_angle": 0,
      "mouth_width": 1,
      "lip_fullness": 2,
      "nose_width": 2,
      "nose_bridge_height": 2,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 2,
      "eyebrow_thickness": 0,
      "eyebrow_angle": 0,
      "hair": 2,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 1,
      "cupid_bow_definition": 0,
      "eye_size": 1,
      "eye_spacing": 0,
      "eyebrow_eye_distance": 1,
      "lower_eyelid_fullness": 0
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-084ca92d-23a0-4f02-bb56-6719e6f34779.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "644c4326bf68aebf7ce513aac4b6eead519c274186f1f8f7c7a7c1f98dff23e7",
      "face_box": [
        277,
        295,
        513,
        513
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "e84a3df67f5ee0b5659198ddde7a8214b0b9d12330f7b07f1f34b9221a6aef99"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。小ぶりな丸い顎と自然な頬のふくらみ。額出し指定に対して中央に短い後れ毛が少し残る。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "female_034",
    "gender": "female",
    "image": "assets/previews/v4/female/female_034.png",
    "label": "菱形・アーモンド・やや垂れ・唇やや短い／やや薄い・センターパート",
    "tags": {
      "cool": 0.41,
      "cute": 0.53,
      "tsurime": 0.0,
      "tareme": 0.35,
      "adult": 0.53,
      "idol": 0.51,
      "mysterious": 0.56,
      "shortFace": 0.5,
      "soft": 0.45,
      "sharp": 0.57
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a refined small diamond-shaped face with softly defined cheekbones, gently narrower temples and a tapered compact jaw; cheekbones blend smoothly into gently convex lower cheeks. Eyes: balanced almond eyes of moderate length; slightly downturned outer corners, about 2 degrees downward; subtle upper-eyelid creases. Mouth: a slightly narrow mouth; slender lips with restrained volume; nearly equal upper and lower lip thickness; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a balanced nose width, a moderately defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, medium-width eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a center part, forehead exposed and side strands tucked behind the ears. Additional proportions: prominent large eyes, slightly close-set eyes, open eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.57,
      "midface_ratio": 0.5,
      "lower_face_ratio": 0.5,
      "jaw_width": 0.34,
      "jaw_angularity": 0.44,
      "chin_width": 0.3,
      "chin_roundness": 0.4,
      "cheekbone_prominence": 0.57,
      "cheek_fullness": 0.5,
      "eye_angle": 0.325,
      "eye_shape": 0.5,
      "eye_size": 0.8,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.5,
      "eyebrow_eye_distance": 0.8,
      "nose_bridge_height": 0.5,
      "nose_width": 0.5,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.325,
      "lip_fullness": 0.325,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "diamond",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 7,
      "eye_shape": 2,
      "eye_angle": 1,
      "mouth_width": 1,
      "lip_fullness": 1,
      "nose_width": 1,
      "nose_bridge_height": 1,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 1,
      "eyebrow_angle": 0,
      "hair": 0,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 2,
      "cupid_bow_definition": 0,
      "eye_size": 2,
      "eye_spacing": 0,
      "eyebrow_eye_distance": 2,
      "lower_eyelid_fullness": 0
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-4db6809b-a281-4dee-9451-7444b3e8b0d4.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "dd390cd006391f23fd77db007d2afcc2ee8e0a3be737ce6af797328f86250514",
      "face_box": [
        296,
        319,
        483,
        483
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "4bad783ff77b19cafb0f6ef0be90ca64c8e7eb5e889bb61a87734e14960c1b46"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬骨の張りは穏やかで下頬に自然な厚み。菱形は卵型に近い柔らかな表現。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "female_039",
    "gender": "female",
    "image": "assets/previews/v4/female/female_039.png",
    "label": "ベース型・丸アーモンド・つり・唇中間／中間・自然な下ろし前髪",
    "tags": {
      "cool": 0.53,
      "cute": 0.64,
      "tsurime": 0.7,
      "tareme": 0.0,
      "adult": 0.4,
      "idol": 0.63,
      "mysterious": 0.44,
      "shortFace": 0.62,
      "soft": 0.45,
      "sharp": 0.51
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a compact soft-square face, a gently defined jaw with subtle corners and a neat moderately rounded chin; smooth healthy cheek contours and proportionate lower-face width. Eyes: rounded almond eyes with a tall central opening; clearly upturned outer corners, a natural upward slant about 4 degrees; clearly visible upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a moderately thinner upper lip than lower lip; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a moderately defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, full eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a soft, loosely separated fringe falling naturally over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; side hair tucked behind the ears, no rounded bowl silhouette and no blunt straight fringe. Additional proportions: prominent large eyes, balanced eye spacing, low eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.34,
      "midface_ratio": 0.38,
      "lower_face_ratio": 0.4,
      "jaw_width": 0.62,
      "jaw_angularity": 0.52,
      "chin_width": 0.54,
      "chin_roundness": 0.48,
      "cheekbone_prominence": 0.4,
      "cheek_fullness": 0.52,
      "eye_angle": 0.85,
      "eye_shape": 0.325,
      "eye_size": 0.8,
      "eye_spacing": 0.5,
      "upper_eyelid_crease": 0.8,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.2,
      "nose_bridge_height": 0.5,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.5,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "soft_square",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 4,
      "eye_shape": 1,
      "eye_angle": 4,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 1,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 1,
      "hair": 1,
      "upper_eyelid_crease": 2,
      "upper_lip_share": 1,
      "cupid_bow_definition": 0,
      "eye_size": 2,
      "eye_spacing": 1,
      "eyebrow_eye_distance": 0,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-c5fa1bc2-e327-4609-a98c-29dfda1fb334.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "c7b858858aea4d7e7819c233b22392934461364bc4213a5166950d3064aae7b0",
      "face_box": [
        271,
        280,
        528,
        528
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "0fb5575c42c74ed9d41f4eca18c5592bd5f678b5b12f68000e82fb1fc05c02ed"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。顎の横幅を抑えた柔らかな輪郭。ベース型の角張りは弱めで短い卵型寄り。前髪が眉にかかる。",
      "unverified_features": [
        "eyebrow_arch",
        "eyebrow_thickness",
        "eyebrow_angle",
        "eyebrow_eye_distance"
      ],
      "user_approved": false
    }
  },
  {
    "id": "female_037",
    "gender": "female",
    "image": "assets/previews/v4/female/female_037.png",
    "label": "卵型・丸い・ややつり・唇中間／中間・センターパート",
    "tags": {
      "cool": 0.48,
      "cute": 0.6,
      "tsurime": 0.35,
      "tareme": 0.0,
      "adult": 0.54,
      "idol": 0.61,
      "mysterious": 0.43,
      "shortFace": 0.52,
      "soft": 0.49,
      "sharp": 0.46
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a small balanced oval face with smooth softly supported cheeks and an elegant gently tapered jaw. Eyes: round open eyes, short horizontally and visibly tall vertically; slightly upturned outer corners, about 2 degrees upward; moderately visible upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; nearly equal upper and lower lip thickness; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a balanced nose width, a well-defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, full eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a center part, forehead exposed and side strands tucked behind the ears. Additional proportions: prominent large eyes, slightly wide-set eyes, balanced eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.5,
      "midface_ratio": 0.48,
      "lower_face_ratio": 0.48,
      "jaw_width": 0.42,
      "jaw_angularity": 0.35,
      "chin_width": 0.4,
      "chin_roundness": 0.5,
      "cheekbone_prominence": 0.4,
      "cheek_fullness": 0.5,
      "eye_angle": 0.675,
      "eye_shape": 0.15,
      "eye_size": 0.8,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.5,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.8,
      "nose_width": 0.5,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.5
    },
    "appearance_features": {
      "face_outline": "oval",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 2,
      "eye_shape": 0,
      "eye_angle": 3,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 1,
      "nose_bridge_height": 2,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 1,
      "hair": 0,
      "upper_eyelid_crease": 1,
      "upper_lip_share": 2,
      "cupid_bow_definition": 1,
      "eye_size": 2,
      "eye_spacing": 2,
      "eyebrow_eye_distance": 1,
      "lower_eyelid_fullness": 0
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-62058fed-0e5d-4ca0-aaea-75c53a5b254e.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "76dedaf075a0af15aaa74d195102010254299eb58a3accb474445f0eb1d17d9b",
      "face_box": [
        306,
        321,
        486,
        486
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "645a5d8e29bfc4f9385c9ebfb58f3b282cbcca47ee2db54e861f29b313956bea"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。なめらかな卵型、開きのある目、自然な薄め〜中間の口元。頬の量は適度。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "female_015",
    "gender": "female",
    "image": "assets/previews/v4/female/female_015.png",
    "label": "短い卵型・アーモンド・垂れ・唇中間／やや薄い・自然な下ろし前髪",
    "tags": {
      "cool": 0.37,
      "cute": 0.51,
      "tsurime": 0.0,
      "tareme": 0.7,
      "adult": 0.32,
      "idol": 0.43,
      "mysterious": 0.45,
      "shortFace": 0.68,
      "soft": 0.54,
      "sharp": 0.46
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a petite short oval face with smooth healthy cheeks, a gently tapering compact jaw and a small softly rounded chin. Eyes: balanced almond eyes of moderate length; clearly downturned outer corners, a natural gentle downward slant about 4 degrees; moderately visible upper-eyelid creases. Mouth: an ordinary medium-width mouth; slender lips with restrained volume; nearly equal upper and lower lip thickness; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a balanced nose width, a softly defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, medium-width eyebrows, distinctly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a soft, loosely separated fringe falling naturally over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; side hair tucked behind the ears, no rounded bowl silhouette and no blunt straight fringe. Additional proportions: subtly sized eyes, balanced eye spacing, balanced eyebrow-to-eye spacing, gently full lower eyelids. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.32,
      "midface_ratio": 0.32,
      "lower_face_ratio": 0.4,
      "jaw_width": 0.36,
      "jaw_angularity": 0.28,
      "chin_width": 0.34,
      "chin_roundness": 0.62,
      "cheekbone_prominence": 0.34,
      "cheek_fullness": 0.52,
      "eye_angle": 0.15,
      "eye_shape": 0.5,
      "eye_size": 0.2,
      "eye_spacing": 0.5,
      "upper_eyelid_crease": 0.5,
      "lower_eyelid_fullness": 0.8,
      "eyebrow_angle": 0.8,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.5,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.2,
      "nose_width": 0.5,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.5,
      "lip_fullness": 0.325,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "short_oval",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 1,
      "eye_shape": 2,
      "eye_angle": 0,
      "mouth_width": 2,
      "lip_fullness": 1,
      "nose_width": 1,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 1,
      "eyebrow_angle": 2,
      "hair": 1,
      "upper_eyelid_crease": 1,
      "upper_lip_share": 2,
      "cupid_bow_definition": 0,
      "eye_size": 0,
      "eye_spacing": 1,
      "eyebrow_eye_distance": 1,
      "lower_eyelid_fullness": 2
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-79cc026a-7be8-4c8c-8759-5560df482e6c.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "5ab36120bce59f6bf375e47bfea58b7239e1dd3d9df97fee9b7058fb1d02d089",
      "face_box": [
        301,
        294,
        482,
        482
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "6045a9273baa1536336eda0c759d80354f95b968a897461b62f51f0129e2d620"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。小ぶりな卵型と柔らかい頬。目尻の下向きは穏やか。前髪で眉が一部隠れる。",
      "unverified_features": [
        "eyebrow_arch",
        "eyebrow_thickness",
        "eyebrow_angle",
        "eyebrow_eye_distance"
      ],
      "user_approved": false
    }
  },
  {
    "id": "female_013",
    "gender": "female",
    "image": "assets/previews/v4/female/female_013.png",
    "label": "面長卵型・切れ長・やや垂れ・唇中間／薄い・センターパート",
    "tags": {
      "cool": 0.53,
      "cute": 0.4,
      "tsurime": 0.0,
      "tareme": 0.35,
      "adult": 0.63,
      "idol": 0.44,
      "mysterious": 0.51,
      "shortFace": 0.38,
      "soft": 0.6,
      "sharp": 0.54
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a refined slightly elongated small oval face, a gracefully longer midface and softly rounded narrow jaw; smooth gently convex cheeks with healthy volume. Eyes: distinctly elongated narrow eyes with a low vertical opening, naturally open rather than squinting; slightly downturned outer corners, about 2 degrees downward; clearly visible upper-eyelid creases. Mouth: an ordinary medium-width mouth; naturally thin upper and lower lips; nearly equal upper and lower lip thickness; a distinctly defined natural Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a well-defined nasal bridge, a gently rounded nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, medium-width eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a center part, forehead exposed and side strands tucked behind the ears. Additional proportions: medium-sized eyes, slightly wide-set eyes, balanced eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.7,
      "midface_ratio": 0.62,
      "lower_face_ratio": 0.58,
      "jaw_width": 0.34,
      "jaw_angularity": 0.3,
      "chin_width": 0.32,
      "chin_roundness": 0.52,
      "cheekbone_prominence": 0.36,
      "cheek_fullness": 0.49,
      "eye_angle": 0.325,
      "eye_shape": 0.85,
      "eye_size": 0.5,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.8,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.5,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.8,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.8,
      "mouth_width": 0.5,
      "lip_fullness": 0.15,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.8
    },
    "appearance_features": {
      "face_outline": "long_oval",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 3,
      "eye_shape": 4,
      "eye_angle": 1,
      "mouth_width": 2,
      "lip_fullness": 0,
      "nose_width": 0,
      "nose_bridge_height": 2,
      "nose_tip_roundness": 2,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 1,
      "eyebrow_angle": 0,
      "hair": 0,
      "upper_eyelid_crease": 2,
      "upper_lip_share": 2,
      "cupid_bow_definition": 2,
      "eye_size": 1,
      "eye_spacing": 2,
      "eyebrow_eye_distance": 1,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-4678e4bf-d346-4913-a1ad-2417ae5bb413.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "f90254870a7cd50a42e9152fca46ebbb0ad82cc5d42a9e2c3b088e221d2962ea",
      "face_box": [
        284,
        330,
        478,
        478
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "b264535ec0d793c2dfa509ccbe1e73e0eae1f4d4e91d3aa1258630a52f99b287"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。縦長寄りの卵型を保ちつつ下頬の厚みを確保。切れ長指定より目の縦の開きは大きい。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "female_028",
    "gender": "female",
    "image": "assets/previews/v4/female/female_028.png",
    "label": "面長卵型・細アーモンド・垂れ・唇中間／やや薄い・自然な下ろし前髪",
    "tags": {
      "cool": 0.43,
      "cute": 0.48,
      "tsurime": 0.0,
      "tareme": 0.7,
      "adult": 0.57,
      "idol": 0.45,
      "mysterious": 0.49,
      "shortFace": 0.38,
      "soft": 0.55,
      "sharp": 0.43
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a refined slightly elongated small oval face, a gracefully longer midface and softly rounded narrow jaw; smooth gently convex cheeks with healthy volume. Eyes: long almond eyes with a low vertical opening; clearly downturned outer corners, a natural gentle downward slant about 4 degrees; subtle upper-eyelid creases. Mouth: an ordinary medium-width mouth; slender lips with restrained volume; a moderately thinner upper lip than lower lip; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slightly broader nose width, a moderately defined nasal bridge, a softly contoured nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, full eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a soft, loosely separated fringe falling naturally over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; side hair tucked behind the ears, no rounded bowl silhouette and no blunt straight fringe. Additional proportions: medium-sized eyes, slightly close-set eyes, open eyebrow-to-eye spacing, gently full lower eyelids. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.7,
      "midface_ratio": 0.62,
      "lower_face_ratio": 0.58,
      "jaw_width": 0.34,
      "jaw_angularity": 0.3,
      "chin_width": 0.32,
      "chin_roundness": 0.52,
      "cheekbone_prominence": 0.36,
      "cheek_fullness": 0.49,
      "eye_angle": 0.15,
      "eye_shape": 0.675,
      "eye_size": 0.5,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.8,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.8,
      "nose_bridge_height": 0.5,
      "nose_width": 0.8,
      "nose_tip_roundness": 0.5,
      "mouth_width": 0.5,
      "lip_fullness": 0.325,
      "upper_lip_share": 0.5,
      "cupid_bow_definition": 0.5
    },
    "appearance_features": {
      "face_outline": "long_oval",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 3,
      "eye_shape": 3,
      "eye_angle": 0,
      "mouth_width": 2,
      "lip_fullness": 1,
      "nose_width": 2,
      "nose_bridge_height": 1,
      "nose_tip_roundness": 1,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 1,
      "hair": 1,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 1,
      "cupid_bow_definition": 1,
      "eye_size": 1,
      "eye_spacing": 0,
      "eyebrow_eye_distance": 2,
      "lower_eyelid_fullness": 2
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-f2520e3f-4958-4ff4-b740-80035b2d10e0.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "ee69d747d1b412c92246f73881b7ccf7fc04b0308ee646f26c62b70386135a5c",
      "face_box": [
        313,
        263,
        472,
        472
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "1451c7eced46c0e9594d8e4e172619effbece88cc8cb870afebd7c9bec22c44b"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。面長寄りで小ぶりな顎、なめらかな頬。頭部にわずかな傾きがあるため、目尻の角度は未確認。",
      "unverified_features": [
        "eyebrow_arch",
        "eyebrow_thickness",
        "eyebrow_angle",
        "eyebrow_eye_distance",
        "eye_angle"
      ],
      "user_approved": false
    }
  },
  {
    "id": "female_012",
    "gender": "female",
    "image": "assets/previews/v4/female/female_012.png",
    "label": "長方形・丸アーモンド・水平・唇短い／中間・センターパート",
    "tags": {
      "cool": 0.36,
      "cute": 0.57,
      "tsurime": 0.0,
      "tareme": 0.0,
      "adult": 0.5,
      "idol": 0.52,
      "mysterious": 0.45,
      "shortFace": 0.45,
      "soft": 0.46,
      "sharp": 0.53
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a refined moderately elongated rectangular face, gently straighter side contours, neat softly defined jaw corners and a proportionate chin; healthy smooth cheeks. Eyes: rounded almond eyes with a tall central opening; level inner and outer eye corners; clearly visible upper-eyelid creases. Mouth: a compact narrow mouth; ordinary medium-thin lips with restrained natural volume; nearly equal upper and lower lip thickness; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a softly defined nasal bridge, a gently rounded nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: straight eyebrow contours, full eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a center part, forehead exposed and side strands tucked behind the ears. Additional proportions: medium-sized eyes, slightly wide-set eyes, low eyebrow-to-eye spacing, gently full lower eyelids. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.68,
      "midface_ratio": 0.55,
      "lower_face_ratio": 0.6,
      "jaw_width": 0.58,
      "jaw_angularity": 0.56,
      "chin_width": 0.5,
      "chin_roundness": 0.38,
      "cheekbone_prominence": 0.42,
      "cheek_fullness": 0.49,
      "eye_angle": 0.5,
      "eye_shape": 0.325,
      "eye_size": 0.5,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.8,
      "lower_eyelid_fullness": 0.8,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.2,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.2,
      "nose_bridge_height": 0.2,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.8,
      "mouth_width": 0.15,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "rectangle",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 5,
      "eye_shape": 1,
      "eye_angle": 2,
      "mouth_width": 0,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 2,
      "eyebrow_arch": 0,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 0,
      "hair": 0,
      "upper_eyelid_crease": 2,
      "upper_lip_share": 2,
      "cupid_bow_definition": 0,
      "eye_size": 1,
      "eye_spacing": 2,
      "eyebrow_eye_distance": 0,
      "lower_eyelid_fullness": 2
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-4b0a5451-7229-4fa6-8dac-4e12d70a255d.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "4f676bc389cd6d11000a0245bdf7b261260694fa6f9ded11847a765d81b145e8",
      "face_box": [
        309,
        276,
        473,
        473
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        0.0
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "e7b802f85ecb6aa1d854f533b11c6f90f732d1ff397d9199f58a218df2f0fe7b"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。顎の側面は比較的直線的だが長方形の幅は穏やか。頬の自然な厚みと小ぶりな口元。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "female_033",
    "gender": "female",
    "image": "assets/previews/v4/female/female_033.png",
    "label": "逆三角型・丸アーモンド・やや垂れ・唇中間／中間・自然な下ろし前髪",
    "tags": {
      "cool": 0.28,
      "cute": 0.62,
      "tsurime": 0.0,
      "tareme": 0.35,
      "adult": 0.41,
      "idol": 0.58,
      "mysterious": 0.44,
      "shortFace": 0.55,
      "soft": 0.61,
      "sharp": 0.44
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally beautiful Japanese leading actress and beauty model, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese woman, age 27. Individual facial characteristics: a petite heart-shaped face, a gently wider forehead tapering to a compact jaw and delicate softly pointed chin, with smoothly supported healthy cheeks. Eyes: rounded almond eyes with a tall central opening; slightly downturned outer corners, about 2 degrees downward; moderately visible upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a moderately thinner upper lip than lower lip; a distinctly defined natural Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slightly broader nose width, a softly defined nasal bridge, a gently rounded nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: arched eyebrow contours, fine eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black shoulder-length hair with a soft, loosely separated fringe falling naturally over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; side hair tucked behind the ears, no rounded bowl silhouette and no blunt straight fringe. Additional proportions: prominent large eyes, balanced eye spacing, balanced eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
    "shape_features": {
      "face_length_width": 0.48,
      "midface_ratio": 0.45,
      "lower_face_ratio": 0.46,
      "jaw_width": 0.28,
      "jaw_angularity": 0.3,
      "chin_width": 0.26,
      "chin_roundness": 0.32,
      "cheekbone_prominence": 0.42,
      "cheek_fullness": 0.51,
      "eye_angle": 0.325,
      "eye_shape": 0.325,
      "eye_size": 0.8,
      "eye_spacing": 0.5,
      "upper_eyelid_crease": 0.5,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.8,
      "eyebrow_thickness": 0.2,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.2,
      "nose_width": 0.8,
      "nose_tip_roundness": 0.8,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.5,
      "cupid_bow_definition": 0.8
    },
    "appearance_features": {
      "face_outline": "heart",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 6,
      "eye_shape": 1,
      "eye_angle": 1,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 2,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 2,
      "eyebrow_arch": 2,
      "eyebrow_thickness": 0,
      "eyebrow_angle": 0,
      "hair": 1,
      "upper_eyelid_crease": 1,
      "upper_lip_share": 1,
      "cupid_bow_definition": 2,
      "eye_size": 2,
      "eye_spacing": 1,
      "eyebrow_eye_distance": 1,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/female_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-c95953d7-7076-4007-8a9d-f727b8417a6b.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "bd33b61a31ab3997f6474f11648b57034ac33b96105c652390950b3737d00197",
      "face_box": [
        270,
        318,
        543,
        543
      ],
      "face_detected": true,
      "crop_shift_source_pixels": [
        0.0,
        -8.55
      ],
      "padding_required": false,
      "output_size": [
        1200,
        1600
      ],
      "normalizer": "scripts/normalize_face_asset.py",
      "image_sha256": "3c6d7e2f313301c6051ea7e514babdfd3976e212051b70257888cf92d13e2fc5"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。上顔面から小さな顎へ自然に細くなる輪郭。頬はなめらかで、前髪は眉にかかる長さ。",
      "unverified_features": [
        "eyebrow_arch",
        "eyebrow_thickness",
        "eyebrow_angle",
        "eyebrow_eye_distance"
      ],
      "user_approved": false
    }
  }
];
