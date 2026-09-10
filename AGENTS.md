# Repository Instructions

- After making any file modification for the user, commit the change and push it to the configured Git remote.
- If push is not possible, report the reason clearly and leave the working tree state explicit.
- Cloudflare Pages is connected to this GitHub repository. A push to `main` triggers production deployment; verify the matching deployment succeeds and the live site reflects the change before reporting completion. The build command is `python3 scripts/build_pages.py`, the output directory is `dist`, and the production URL is `https://type-checker.shianstudio.com/`.
- Keep generated face assets and their feature metadata in sync: image files live under `assets/`, and the corresponding feature records live under `data/`.
- Do not show feature labels, tag names, arrows, or other scoring hints on the face choice cards during the quiz. The choice cards should present only the portrait images; `label` and `tags` are metadata for scoring and result generation, not in-quiz display text.

## Generated Face Asset Workflow

- The newer type-based v8 gallery is separate from the v6.1 production quiz: `docs/face-types-v8.html`, `data/previews/face_types_v8.js`, and `assets/previews/v8/<gender>/`. It contains five independently generated identities for each of eight types per gender (80 portraits). Every prompt and record must specify age 25; elegant/cool proportions must not be expressed by making the person look older. Preserve differences between identities within a type. These type-based records use `type` for scoring and have no numeric feature vectors or compatibility tags; the v6 plan-specific appearance constraints below do not apply to v8.

- Use the existing male set as the format reference: feature records are stored as a browser global in `data/<gender>_faces.js`, with one object per asset containing `id`, `gender`, `image`, `label`, `tags`, and `prompt`.
- Create the full feature set before generating images. The current production app uses the v6.1 set with 60 records per gender; the previous 40-record sets have been replaced. Keep plans in `data/plans/` separate from production data. Use zero-padded ids and filenames such as `female_001` / `assets/female/female_001.png`.
- Keep the same tag keys across genders so scoring remains comparable: `cool`, `cute`, `tsurime`, `tareme`, `adult`, `idol`, `mysterious`, `shortFace`, `soft`, and `sharp`. Tag values are normalized numbers from `0.00` to `1.00`.
- The latest 60-person plans use `fringe_down` (自然な下ろし前髪) for everyone. Female outlines are limited to `round`, `short_oval`, and `oval`; female `eyebrow_thickness` must be at most `0.50`. Apply these constraints to baseline identities as well. The adopted v6.1 portraits live in `assets/<gender>/`, with their full generated feature records in `data/<gender>_faces.js`. The plans retain their original `planned_image` values as historical metadata; actual assets must be located through the production records' `image` fields.
- Prompts should describe adult Japanese face portraits, front-facing composition, neutral studio background, realistic editorial beauty photo style, and include `no text, no watermark`.
- Generate one portrait per feature record from that record's prompt, then normalize it with `scripts/normalize_face_asset.py --dest assets/<gender>/<id>.png` so assets are consistently `1200x1600` and face-centered.
- After generation, confirm that every `image` path in the data file exists under `assets/` and that every generated asset has a corresponding feature record in `data/`.
