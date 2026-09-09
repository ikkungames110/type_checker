// 試作画像の特徴量は生成目標。ユーザー確認前。
window.MALE_FACE_PREVIEW_V4 = [
  {
    "id": "male_001",
    "gender": "male",
    "image": "assets/previews/v4/male/male_001.png",
    "label": "丸型・アーモンド・つり・唇中間／中間・センターパート",
    "tags": {
      "cool": 0.4,
      "cute": 0.5,
      "tsurime": 0.7,
      "tareme": 0.0,
      "adult": 0.27,
      "idol": 0.46,
      "mysterious": 0.62,
      "shortFace": 0.68,
      "soft": 0.64,
      "sharp": 0.44
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a petite round face with a short midface, a compact softly curved jaw and a small rounded chin; gentle cheek curves within a small facial outline, delicate rather than broad proportions. Eyes: balanced almond eyes of moderate length; clearly upturned outer corners, a natural upward slant about 4 degrees; subtle upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a clearly thinner upper lip than lower lip; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a softly defined nasal bridge, a softly contoured nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, fine eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black hair with a clearly visible center part, two curtain sections swept to the sides above the eyebrows, ears visible. Additional proportions: medium-sized eyes, balanced eye spacing, low eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.85,
      "eye_shape": 0.5,
      "eye_size": 0.5,
      "eye_spacing": 0.5,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.2,
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
      "eye_shape": 2,
      "eye_angle": 4,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 1,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 0,
      "eyebrow_angle": 0,
      "hair": 0,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 0,
      "cupid_bow_definition": 1,
      "eye_size": 1,
      "eye_spacing": 1,
      "eyebrow_eye_distance": 0,
      "lower_eyelid_fullness": 0
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-201c7832-f883-4879-ae06-0a177847af07.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "1b85bb3d101ba2d804e51af86bd6acd77f9541e474b046326d18b65241ed6a1c",
      "face_box": [
        312,
        322,
        465,
        465
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
      "image_sha256": "3329ce630818ff72d39f543c87dac74a486a2263bcd5f84f94a113bf73b16009"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬はなめらかで小ぶりな顎。丸型指定は短い卵型寄り、つり目の傾斜は目標より穏やか。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "male_027",
    "gender": "male",
    "image": "assets/previews/v4/male/male_027.png",
    "label": "丸型・丸アーモンド・やや垂れ・唇やや短い／薄い・自然な下ろし前髪",
    "tags": {
      "cool": 0.42,
      "cute": 0.66,
      "tsurime": 0.0,
      "tareme": 0.35,
      "adult": 0.39,
      "idol": 0.61,
      "mysterious": 0.44,
      "shortFace": 0.68,
      "soft": 0.59,
      "sharp": 0.43
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a petite round face with a short midface, a compact softly curved jaw and a small rounded chin; gentle cheek curves within a small facial outline, delicate rather than broad proportions. Eyes: rounded almond eyes with a tall central opening; slightly downturned outer corners, about 2 degrees downward; clearly visible upper-eyelid creases. Mouth: a slightly narrow mouth; naturally thin upper and lower lips; nearly equal upper and lower lip thickness; a distinctly defined natural Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a balanced nose width, a well-defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, medium-width eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: ordinary layered short black hair with a soft, loosely separated fringe falling naturally down over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; light natural volume and irregular strands, no bowl-cut outline and no blunt straight fringe. Additional proportions: prominent large eyes, slightly close-set eyes, low eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.325,
      "eye_shape": 0.325,
      "eye_size": 0.8,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.8,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.5,
      "eyebrow_eye_distance": 0.2,
      "nose_bridge_height": 0.8,
      "nose_width": 0.5,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.325,
      "lip_fullness": 0.15,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.8
    },
    "appearance_features": {
      "face_outline": "round",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 0,
      "eye_shape": 1,
      "eye_angle": 1,
      "mouth_width": 1,
      "lip_fullness": 0,
      "nose_width": 1,
      "nose_bridge_height": 2,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 1,
      "eyebrow_angle": 1,
      "hair": 1,
      "upper_eyelid_crease": 2,
      "upper_lip_share": 2,
      "cupid_bow_definition": 2,
      "eye_size": 2,
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
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-f558577d-5340-470a-84fb-697074064000.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "4411e45823d87e4cc81de52bc69d52e2378dfcf82874a3e039be1a3d1545d670",
      "face_box": [
        289,
        377,
        493,
        493
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
      "image_sha256": "a137ea296b9013eb0083bdfac734da8416948ec4a34e7f48678fd80a4aabb649"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬の自然な丸みと小さな顎。下ろし前髪は眉にかかる長さ。輪郭は丸型と短い卵型の中間程度。",
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
    "id": "male_003",
    "gender": "male",
    "image": "assets/previews/v4/male/male_003.png",
    "label": "菱形・丸い・やや垂れ・唇短い／やや薄い・センターパート",
    "tags": {
      "cool": 0.31,
      "cute": 0.65,
      "tsurime": 0.0,
      "tareme": 0.35,
      "adult": 0.47,
      "idol": 0.57,
      "mysterious": 0.4,
      "shortFace": 0.5,
      "soft": 0.5,
      "sharp": 0.61
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a refined small diamond-shaped face with softly defined cheekbones, gently narrower temples and a tapered compact jaw; cheekbones blend smoothly into gently convex lower cheeks. Eyes: round open eyes, short horizontally and visibly tall vertically; slightly downturned outer corners, about 2 degrees downward; moderately visible upper-eyelid creases. Mouth: a compact narrow mouth; slender lips with restrained volume; a clearly thinner upper lip than lower lip; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a softly defined nasal bridge, a softly contoured nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, medium-width eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black hair with a clearly visible center part, two curtain sections swept to the sides above the eyebrows, ears visible. Additional proportions: prominent large eyes, slightly close-set eyes, open eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_shape": 0.15,
      "eye_size": 0.8,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.5,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.5,
      "eyebrow_eye_distance": 0.8,
      "nose_bridge_height": 0.2,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.5,
      "mouth_width": 0.15,
      "lip_fullness": 0.325,
      "upper_lip_share": 0.2,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "diamond",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 7,
      "eye_shape": 0,
      "eye_angle": 1,
      "mouth_width": 0,
      "lip_fullness": 1,
      "nose_width": 0,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 1,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 1,
      "eyebrow_angle": 1,
      "hair": 0,
      "upper_eyelid_crease": 1,
      "upper_lip_share": 0,
      "cupid_bow_definition": 0,
      "eye_size": 2,
      "eye_spacing": 0,
      "eyebrow_eye_distance": 2,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-289ff36c-87b1-4f59-bf64-f7ad6f5f277b.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "bafa9d6aadc68fa7bcf81c74023b19f50b63f4d9c32db994a928823b7e232714",
      "face_box": [
        311,
        370,
        470,
        470
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
      "image_sha256": "1bd23fdb6233e558a47bfc8d5a7e4d443d8f9ce98eca5884aa7b712ed818acd8"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬骨から下頬までなめらか。菱形の角張りは穏やかで、丸い目はアーモンド寄り。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "male_005",
    "gender": "male",
    "image": "assets/previews/v4/male/male_005.png",
    "label": "ベース型・細アーモンド・ややつり・唇中間／中間・センターパート",
    "tags": {
      "cool": 0.6,
      "cute": 0.49,
      "tsurime": 0.35,
      "tareme": 0.0,
      "adult": 0.46,
      "idol": 0.49,
      "mysterious": 0.65,
      "shortFace": 0.62,
      "soft": 0.45,
      "sharp": 0.51
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a compact soft-square face, a gently defined jaw with subtle corners and a neat moderately rounded chin; smooth healthy cheek contours and proportionate lower-face width. Eyes: long almond eyes with a low vertical opening; slightly upturned outer corners, about 2 degrees upward; subtle upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a clearly thinner upper lip than lower lip; a distinctly defined natural Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a well-defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, full eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black hair with a clearly visible center part, two curtain sections swept to the sides above the eyebrows, ears visible. Additional proportions: medium-sized eyes, slightly wide-set eyes, low eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.675,
      "eye_shape": 0.675,
      "eye_size": 0.5,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.2,
      "nose_bridge_height": 0.8,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.2,
      "cupid_bow_definition": 0.8
    },
    "appearance_features": {
      "face_outline": "soft_square",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 4,
      "eye_shape": 3,
      "eye_angle": 3,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 2,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 0,
      "hair": 0,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 0,
      "cupid_bow_definition": 2,
      "eye_size": 1,
      "eye_spacing": 2,
      "eyebrow_eye_distance": 0,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-1af4ee46-6ffa-493f-aa4e-7fda56ef9ad5.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "9594ea0298b9badb5ab286f07ad2a85d353ff177a2b92dff7ad44cbbdefc0d8f",
      "face_box": [
        318,
        365,
        453,
        453
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
      "image_sha256": "15e8e6ce4b870240acde10ba7b8651227da00f9c51303eaf6a3cb0140eb308ff"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬の厚みを保ち、顎の角を柔らかく表現。ベース型の横幅は目標より控えめ。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "male_006",
    "gender": "male",
    "image": "assets/previews/v4/male/male_006.png",
    "label": "卵型・丸アーモンド・水平・唇やや短い／中間・自然な下ろし前髪",
    "tags": {
      "cool": 0.32,
      "cute": 0.42,
      "tsurime": 0.0,
      "tareme": 0.0,
      "adult": 0.42,
      "idol": 0.37,
      "mysterious": 0.49,
      "shortFace": 0.52,
      "soft": 0.54,
      "sharp": 0.51
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a small balanced oval face with smooth softly supported cheeks and an elegant gently tapered jaw. Eyes: rounded almond eyes with a tall central opening; level inner and outer eye corners; subtle upper-eyelid creases. Mouth: a slightly narrow mouth; ordinary medium-thin lips with restrained natural volume; nearly equal upper and lower lip thickness; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a softly defined nasal bridge, a softly contoured nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, fine eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: ordinary layered short black hair with a soft, loosely separated fringe falling naturally down over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; light natural volume and irregular strands, no bowl-cut outline and no blunt straight fringe. Additional proportions: subtly sized eyes, slightly wide-set eyes, open eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.5,
      "eye_shape": 0.325,
      "eye_size": 0.2,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.2,
      "eyebrow_eye_distance": 0.8,
      "nose_bridge_height": 0.2,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.5,
      "mouth_width": 0.325,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.5
    },
    "appearance_features": {
      "face_outline": "oval",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 2,
      "eye_shape": 1,
      "eye_angle": 2,
      "mouth_width": 1,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 1,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 0,
      "eyebrow_angle": 0,
      "hair": 1,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 2,
      "cupid_bow_definition": 1,
      "eye_size": 0,
      "eye_spacing": 2,
      "eyebrow_eye_distance": 2,
      "lower_eyelid_fullness": 0
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-9d1d02c5-4558-47a3-9003-a2d359b3f613.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "1ccdfdb929f699f36cf83cff4aaace0f6d62ca279d1b58e116cc55d1f9a8db14",
      "face_box": [
        303,
        312,
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
      "image_sha256": "ee10c22bfc269054e53c655d094370867df3753e1ffb8a30ee046dd6c6d4290a"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。小ぶりな卵型と自然な頬。眉にかかる下ろし前髪、口元は中間程度の自然な厚み。",
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
    "id": "male_008",
    "gender": "male",
    "image": "assets/previews/v4/male/male_008.png",
    "label": "短い卵型・丸い・垂れ・唇短い／中間・自然な下ろし前髪",
    "tags": {
      "cool": 0.24,
      "cute": 0.69,
      "tsurime": 0.0,
      "tareme": 0.7,
      "adult": 0.32,
      "idol": 0.58,
      "mysterious": 0.42,
      "shortFace": 0.68,
      "soft": 0.49,
      "sharp": 0.4
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a petite short oval face with smooth healthy cheeks, a gently tapering compact jaw and a small softly rounded chin. Eyes: round open eyes, short horizontally and visibly tall vertically; clearly downturned outer corners, a natural gentle downward slant about 4 degrees; subtle upper-eyelid creases. Mouth: a compact narrow mouth; ordinary medium-thin lips with restrained natural volume; nearly equal upper and lower lip thickness; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slightly broader nose width, a softly defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: straight eyebrow contours, full eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: ordinary layered short black hair with a soft, loosely separated fringe falling naturally down over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; light natural volume and irregular strands, no bowl-cut outline and no blunt straight fringe. Additional proportions: prominent large eyes, slightly wide-set eyes, open eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_shape": 0.15,
      "eye_size": 0.8,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.2,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.8,
      "nose_bridge_height": 0.2,
      "nose_width": 0.8,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.15,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.8,
      "cupid_bow_definition": 0.5
    },
    "appearance_features": {
      "face_outline": "short_oval",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 1,
      "eye_shape": 0,
      "eye_angle": 0,
      "mouth_width": 0,
      "lip_fullness": 2,
      "nose_width": 2,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 0,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 1,
      "hair": 1,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 2,
      "cupid_bow_definition": 1,
      "eye_size": 2,
      "eye_spacing": 2,
      "eyebrow_eye_distance": 2,
      "lower_eyelid_fullness": 1
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-69e14417-4fe5-4468-bc95-6e5b88ee0c17.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "502fab3fdeb99eb56d3ac2afeacdcc7abb13515d86ac719fa737e03a7c07f04c",
      "face_box": [
        322,
        337,
        469,
        469
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
      "image_sha256": "58ccd71f0c3087154af16c56be5540e94c37be1bf50ef17c987a59a9fbe4d07f"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。短い卵型に丸みのある目。頬の量は適度で下顎はすっきり。前髪で眉の一部が隠れる。",
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
    "id": "male_021",
    "gender": "male",
    "image": "assets/previews/v4/male/male_021.png",
    "label": "面長卵型・丸アーモンド・垂れ・唇中間／中間・アップバング",
    "tags": {
      "cool": 0.24,
      "cute": 0.58,
      "tsurime": 0.0,
      "tareme": 0.7,
      "adult": 0.51,
      "idol": 0.54,
      "mysterious": 0.56,
      "shortFace": 0.38,
      "soft": 0.55,
      "sharp": 0.5
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a refined slightly elongated small oval face, a gracefully longer midface and softly rounded narrow jaw; smooth gently convex cheeks with healthy volume. Eyes: rounded almond eyes with a tall central opening; clearly downturned outer corners, a natural gentle downward slant about 4 degrees; subtle upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a clearly thinner upper lip than lower lip; a distinctly defined natural Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a softly defined nasal bridge, a gently rounded nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: straight eyebrow contours, full eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: short black hair with the entire front fringe lifted up and back, fully exposed forehead, short sides, no skin fade. Additional proportions: prominent large eyes, slightly close-set eyes, low eyebrow-to-eye spacing, moderate lower-eyelid fullness. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_shape": 0.325,
      "eye_size": 0.8,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.5,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.2,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.2,
      "nose_bridge_height": 0.2,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.8,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.2,
      "cupid_bow_definition": 0.8
    },
    "appearance_features": {
      "face_outline": "long_oval",
      "hair_style": "up_bang"
    },
    "design_levels": {
      "outline": 3,
      "eye_shape": 1,
      "eye_angle": 0,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 2,
      "eyebrow_arch": 0,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 0,
      "hair": 2,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 0,
      "cupid_bow_definition": 2,
      "eye_size": 2,
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
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-eee31528-1d0a-46ac-929e-9f28d81af350.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "14360e3b54f986c78127e0eeb54d3e1aaf9c11fc64811d74b6deaa8bd7f6dbfb",
      "face_box": [
        309,
        333,
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
      "image_sha256": "084f43d15516bb001e92b8990cc87076f006fb77438088c58e5fe8c703dfab9c"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬の厚みが残る面長寄りの卵型。額を出した髪型。垂れ目指定は弱めに出ている。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "male_024",
    "gender": "male",
    "image": "assets/previews/v4/male/male_024.png",
    "label": "面長卵型・丸い・つり・唇やや短い／中間・センターパート",
    "tags": {
      "cool": 0.43,
      "cute": 0.5,
      "tsurime": 0.7,
      "tareme": 0.0,
      "adult": 0.51,
      "idol": 0.49,
      "mysterious": 0.38,
      "shortFace": 0.38,
      "soft": 0.51,
      "sharp": 0.41
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a refined slightly elongated small oval face, a gracefully longer midface and softly rounded narrow jaw; smooth gently convex cheeks with healthy volume. Eyes: round open eyes, short horizontally and visibly tall vertically; clearly upturned outer corners, a natural upward slant about 4 degrees; clearly visible upper-eyelid creases. Mouth: a slightly narrow mouth; ordinary medium-thin lips with restrained natural volume; a clearly thinner upper lip than lower lip; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slightly broader nose width, a softly defined nasal bridge, a softly contoured nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: straight eyebrow contours, fine eyebrows, distinctly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black hair with a clearly visible center part, two curtain sections swept to the sides above the eyebrows, ears visible. Additional proportions: medium-sized eyes, slightly wide-set eyes, balanced eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.85,
      "eye_shape": 0.15,
      "eye_size": 0.5,
      "eye_spacing": 0.8,
      "upper_eyelid_crease": 0.8,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.8,
      "eyebrow_arch": 0.2,
      "eyebrow_thickness": 0.2,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.2,
      "nose_width": 0.8,
      "nose_tip_roundness": 0.5,
      "mouth_width": 0.325,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.2,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "long_oval",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 3,
      "eye_shape": 0,
      "eye_angle": 4,
      "mouth_width": 1,
      "lip_fullness": 2,
      "nose_width": 2,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 1,
      "eyebrow_arch": 0,
      "eyebrow_thickness": 0,
      "eyebrow_angle": 2,
      "hair": 0,
      "upper_eyelid_crease": 2,
      "upper_lip_share": 0,
      "cupid_bow_definition": 0,
      "eye_size": 1,
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
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-e2be3e9f-b19b-4a36-9260-236a29c5f1c3.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "8d5e6ce72493485c747e19e24e8f987c2d836e4473259bb325f6f2feb201a2a4",
      "face_box": [
        329,
        370,
        444,
        444
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
      "image_sha256": "2bd6b06ad5ae823995e05c7c554f3e6203eb16a216c6f153026ab620c6173025"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。頬のこけがない、やや縦長の卵型。丸い目・上向きの目尻は目標より穏やか。",
      "unverified_features": [],
      "user_approved": false
    }
  },
  {
    "id": "male_028",
    "gender": "male",
    "image": "assets/previews/v4/male/male_028.png",
    "label": "長方形・アーモンド・つり・唇中間／中間・自然な下ろし前髪",
    "tags": {
      "cool": 0.64,
      "cute": 0.44,
      "tsurime": 0.7,
      "tareme": 0.0,
      "adult": 0.62,
      "idol": 0.5,
      "mysterious": 0.46,
      "shortFace": 0.45,
      "soft": 0.5,
      "sharp": 0.53
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a refined moderately elongated rectangular face, gently straighter side contours, neat softly defined jaw corners and a proportionate chin; healthy smooth cheeks. Eyes: balanced almond eyes of moderate length; clearly upturned outer corners, a natural upward slant about 4 degrees; clearly visible upper-eyelid creases. Mouth: an ordinary medium-width mouth; ordinary medium-thin lips with restrained natural volume; a moderately thinner upper lip than lower lip; a moderate Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a slender nose width, a well-defined nasal bridge, a gently rounded nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: gently curved eyebrow contours, medium-width eyebrows, slightly rising eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: ordinary layered short black hair with a soft, loosely separated fringe falling naturally down over the eyebrows; wispy tips reach just below the eyebrows but stay out of the eyes; light natural volume and irregular strands, no bowl-cut outline and no blunt straight fringe. Additional proportions: medium-sized eyes, balanced eye spacing, balanced eyebrow-to-eye spacing, smooth lower-eyelid contours. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.85,
      "eye_shape": 0.5,
      "eye_size": 0.5,
      "eye_spacing": 0.5,
      "upper_eyelid_crease": 0.8,
      "lower_eyelid_fullness": 0.2,
      "eyebrow_angle": 0.5,
      "eyebrow_arch": 0.5,
      "eyebrow_thickness": 0.5,
      "eyebrow_eye_distance": 0.5,
      "nose_bridge_height": 0.8,
      "nose_width": 0.2,
      "nose_tip_roundness": 0.8,
      "mouth_width": 0.5,
      "lip_fullness": 0.5,
      "upper_lip_share": 0.5,
      "cupid_bow_definition": 0.5
    },
    "appearance_features": {
      "face_outline": "rectangle",
      "hair_style": "fringe_down"
    },
    "design_levels": {
      "outline": 5,
      "eye_shape": 2,
      "eye_angle": 4,
      "mouth_width": 2,
      "lip_fullness": 2,
      "nose_width": 0,
      "nose_bridge_height": 2,
      "nose_tip_roundness": 2,
      "eyebrow_arch": 1,
      "eyebrow_thickness": 1,
      "eyebrow_angle": 1,
      "hair": 1,
      "upper_eyelid_crease": 2,
      "upper_lip_share": 1,
      "cupid_bow_definition": 1,
      "eye_size": 1,
      "eye_spacing": 1,
      "eyebrow_eye_distance": 1,
      "lower_eyelid_fullness": 0
    },
    "schema_version": "3.1.0",
    "mapping_version": "shape-impression-1",
    "asset_version": "v4-preview",
    "review_status": "awaiting_user_review",
    "shape_feature_source": "generation_target",
    "plan_version": "4.0.0",
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-e63a2921-d144-481c-b0bf-1046c42bee34.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "2b363e27e88df5318bace2af11fb1c62dbbb89f0caa42f771443780c34cdb36b",
      "face_box": [
        322,
        368,
        452,
        452
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
      "image_sha256": "65f33e3ee3f18ab94588f4b5d621e9180ff071b22b5295237a14569aaaf25921"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。顎の側面は比較的直線的で、頬はなめらか。長方形の幅と角は控えめ。前髪が眉にかかる。",
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
    "id": "male_038",
    "gender": "male",
    "image": "assets/previews/v4/male/male_038.png",
    "label": "逆三角型・丸い・ややつり・唇やや短い／薄い・センターパート",
    "tags": {
      "cool": 0.3,
      "cute": 0.63,
      "tsurime": 0.35,
      "tareme": 0.0,
      "adult": 0.41,
      "idol": 0.5,
      "mysterious": 0.39,
      "shortFace": 0.55,
      "soft": 0.52,
      "sharp": 0.52
    },
    "prompt": "Primary request: a new fictional adult portrait with the visual appeal of an exceptionally handsome Japanese male lead actor, age 27. A consistently high beauty standard is essential: elegant harmonious facial proportions, luminous clear skin with realistic fine texture, attractive alert eyes and immaculate professional grooming. Use a petite well-balanced face, a normal healthy slim neck and shoulders. The cheeks MUST be smooth and gently convex from cheekbone to mouth, retaining natural healthy soft tissue. No sunken or hollow cheeks, no gaunt face, no buccal hollows, no deep cheekbone shadows, no harsh sculpting or visible ribs of facial bones. Roundness means a short compact facial shape with a neat small jaw, never swollen cheeks, a broad heavy lower face, jowls, double chin or a thick neck. Keep distinctive individual faces across the series, all equally carefully cast and beautifully photographed. Use case: photorealistic-natural. Create one distinct fictional adult Japanese man, age 27. Individual facial characteristics: a petite heart-shaped face, a gently wider forehead tapering to a compact jaw and delicate softly pointed chin, with smoothly supported healthy cheeks. Eyes: round open eyes, short horizontally and visibly tall vertically; slightly upturned outer corners, about 2 degrees upward; subtle upper-eyelid creases. Mouth: a slightly narrow mouth; naturally thin upper and lower lips; a clearly thinner upper lip than lower lip; a softly curved upper lip with a shallow Cupid bow. Keep the mouth compact to average in width and the lips thin to moderate; no large mouth, no thick or plumped lips, no overlining. Nose: a balanced nose width, a softly defined nasal bridge, a refined tapered nose tip; an elegantly proportioned natural nose with its specified width and tip, harmonized with the eyes and mouth. Brows: arched eyebrow contours, full eyebrows, nearly horizontal eyebrows; naturally groomed, no extreme arches or shaved brows. Hair: straight black hair with a clearly visible center part, two curtain sections swept to the sides above the eyebrows, ears visible. Additional proportions: medium-sized eyes, slightly close-set eyes, open eyebrow-to-eye spacing, gently full lower eyelids. Harmonize all these traits into a strikingly beautiful, highly photogenic face. Keep the individual eye shape, eye slant and outline recognizable with tasteful, moderate anatomical variation. Prioritize overall facial harmony if a literal combination looks awkward. Every person in this series should meet the same high leading-actor or beauty-campaign casting standard. Realistic editorial beauty photograph with natural skin texture, dark brown eyes, subtle polished editorial grooming and barely visible natural makeup, no contour makeup, no facial hair, no jewelry or glasses. Front-facing, head level, eyes at camera, relaxed neutral expression, closed lips without smile. Plain light-gray crew-neck top. Neutral light-gray studio background and large soft frontal beauty lighting with gentle fill that keeps the cheek planes evenly illuminated. Portrait 3:4 canvas. Moderately pulled-back camera, crop at middle of chest, show full head and shoulders and natural background around the head. Face from hairline to chin occupies about 38 percent of image height, face center at 50 percent width and 38 percent height. Keep eyes and full cheek and jaw contours visible. For a downward fringe, allow natural partial eyebrow coverage and do not shorten the fringe to expose the eyebrows. No baby bangs or above-eyebrow fringe. No tight face crop, no waist or legs, no caricature, no text, no watermark.",
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
      "eye_angle": 0.675,
      "eye_shape": 0.15,
      "eye_size": 0.5,
      "eye_spacing": 0.2,
      "upper_eyelid_crease": 0.2,
      "lower_eyelid_fullness": 0.8,
      "eyebrow_angle": 0.2,
      "eyebrow_arch": 0.8,
      "eyebrow_thickness": 0.8,
      "eyebrow_eye_distance": 0.8,
      "nose_bridge_height": 0.2,
      "nose_width": 0.5,
      "nose_tip_roundness": 0.2,
      "mouth_width": 0.325,
      "lip_fullness": 0.15,
      "upper_lip_share": 0.2,
      "cupid_bow_definition": 0.2
    },
    "appearance_features": {
      "face_outline": "heart",
      "hair_style": "center_part"
    },
    "design_levels": {
      "outline": 6,
      "eye_shape": 0,
      "eye_angle": 3,
      "mouth_width": 1,
      "lip_fullness": 0,
      "nose_width": 1,
      "nose_bridge_height": 0,
      "nose_tip_roundness": 0,
      "eyebrow_arch": 2,
      "eyebrow_thickness": 2,
      "eyebrow_angle": 0,
      "hair": 0,
      "upper_eyelid_crease": 0,
      "upper_lip_share": 0,
      "cupid_bow_definition": 0,
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
    "source_plan": "data/plans/male_faces_v4.json",
    "generation": {
      "method": "builtin_image_gen",
      "date": "2026-09-09",
      "source_file": "exec-2b07dde4-bb01-468b-817f-befaf9cdf746.png",
      "source_size": [
        1086,
        1448
      ],
      "source_sha256": "2204c9e32370bd89c24a8dcf4f524f73003d620b893fe0cdab8c3c6fc159dcd1",
      "face_box": [
        330,
        373,
        442,
        442
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
      "image_sha256": "6314f3c978613d504ab99a56c32ba0b8b18c24a5841e301a674da9eb9428a9a3"
    },
    "visual_review": {
      "status": "visual_checked",
      "shape_calibrated": false,
      "notes": "新規生成原寸と正規化後の一覧を目視確認。頬のこけ・過剰な頬の量は見られない。上顔面から小ぶりな顎へなだらかに細くなる。逆三角型の先端は尖りすぎず、頬の厚みを維持。",
      "unverified_features": [],
      "user_approved": false
    }
  }
];
