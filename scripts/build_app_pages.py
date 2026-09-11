"""共通テンプレートから、通常のページ遷移で開く3画面を生成する。"""

from pathlib import Path
import re
from html import escape
from build_share_pages import read_browser_data


ROOT = Path(__file__).resolve().parents[1]
PAGES = {"top": "startScreen", "quiz": "quizScreen", "result": "resultScreen"}


def build_app_pages(destination):
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
    types = read_browser_data(ROOT / "data/result_types.js")
    groups = []
    for gender, label in (("female", "女性"), ("male", "男性")):
        links = ''.join(
            f'<li><a href="/share/letters/{gender}/{item["code"]}/">'
            f'{item["code"]} · {escape(item["label"])}</a>'
            f'<small>({escape(item["classification_label"])}タイプ)</small></li>'
            for item in types[gender]
        )
        groups.append(f'<section class="content-card"><h3>好きな{label}の顔・8タイプ</h3><ul class="type-links">{links}</ul></section>')
    source = source.replace('<!-- SEO_TYPE_LINKS -->', '\n'.join(groups))
    for name, screen in PAGES.items():
        html = source.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="../">', 1)
        html = html.replace('<body data-page="top">', f'<body data-page="{name}">', 1)
        html = html.replace(f'href="{site}top/"', f'href="{site}{name}/"', 1)
        html = html.replace(f'property="og:url" content="{site}top/"', f'property="og:url" content="{site}{name}/"', 1)
        html = re.sub(
            r'<section class="screen(?: active)?" id="([^"]+)">',
            lambda match: f'<section class="screen{" active" if match[1] == screen else ""}" id="{match[1]}">',
            html,
        )
        if name != "top":
            title = "診断中" if name == "quiz" else "診断結果"
            html = re.sub(r"<title>.*?</title>", f"<title>{title} | 好みの顔タイプ診断</title>", html, count=1)
            html = html.replace('<meta name="author"', '<meta name="robots" content="noindex, follow">\n  <meta name="author"', 1)
        page = destination / name / "index.html"
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text(html, encoding="utf-8")

    # Pagesでは_redirectsでHTTPリダイレクト。単純なローカルサーバーにも対応する。
    head = source.split('  <style>', 1)[0]
    redirect = head + '''  <script>
    const topPage = new URL("top/", location.href);
    topPage.search = location.search;
    topPage.hash = location.hash;
    location.replace(topPage.href);
  </script>
  <meta http-equiv="refresh" content="0;url=top/">
</head>
<body><p><a href="top/">トップ画面へ移動する</a></p></body>
</html>
'''
    (destination / "index.html").write_text(redirect, encoding="utf-8")
    print("診断画面: /top/・/quiz/・/result/、ドメイン直下はトップへリダイレクト")
