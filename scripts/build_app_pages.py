"""ルートに診断アプリを配置し、旧画面URLはルートへ転送する。"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEGACY_PAGES = ("top", "quiz", "result", "ad")


def build_app_pages(destination):
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    (destination / "index.html").write_text(source, encoding="utf-8")
    # 単純なローカルサーバーでも旧リンクを利用できるようにする。
    redirect = '''<!doctype html>
<html lang="ja"><head><meta charset="utf-8">
<title>診断へ移動</title>
<meta name="robots" content="noindex, follow">
<script>
const target = new URL("/", location.origin);
target.search = location.search;
target.hash = location.hash;
location.replace(target.href);
</script>
</head><body><a href="/">好みの顔タイプ診断へ</a></body></html>
'''
    for name in LEGACY_PAGES:
        page = destination / name / "index.html"
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text(redirect, encoding="utf-8")
    print("診断画面: ドメイン直下で切り替え、旧画面URLはルートへ転送")
