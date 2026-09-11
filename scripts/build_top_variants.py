"""OGPは静的HTMLに保持し、ブラウザだけJavaScriptで通常トップへ移動する。"""
from html import escape
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VARIANTS = ('03', '05')


def build_top_variants(destination):
    site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
    base = 'docs/character-ogp-assets/'
    cards = json.loads((ROOT / base / 'manifest.json').read_text())['cards']
    for variant in VARIANTS:
        card = next(card for card in cards if card['id'] == variant)
        image = base + card['file']
        if hashlib.sha256((ROOT / image).read_bytes()).hexdigest() != card['sha256']:
            raise ValueError(f'OGP {variant}: 画像のハッシュ不一致')
        page_url = site + f'top/{variant}/'
        title = ''.join(card['title']) + ' | 好みの顔タイプ診断'
        description = card['sub']
        image_url = site + image + '?v=' + card['sha256'][:12]
        values = {
            'og:type':'website', 'og:site_name':'好みの顔タイプ診断', 'og:locale':'ja_JP',
            'og:title':title, 'og:description':description, 'og:url':page_url,
            'og:image':image_url, 'og:image:secure_url':image_url, 'og:image:type':'image/png',
            'og:image:width':str(card['width']), 'og:image:height':str(card['height']),
            'og:image:alt':title, 'twitter:card':'summary_large_image',
            'twitter:title':title, 'twitter:description':description, 'twitter:image':image_url, 'twitter:image:alt':title,
        }
        meta = '\n'.join(f'  <meta {"name" if key.startswith("twitter:") else "property"}="{key}" content="{escape(value, quote=True)}">' for key,value in values.items())
        html = f'''<!doctype html>
<html lang="ja"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,follow">
  <title>{escape(title)}</title>
  <meta name="description" content="{escape(description, quote=True)}">
  <link rel="canonical" href="{page_url}">
{meta}
  <script>
    const target = new URL('/top/', location.origin);
    target.search = location.search;
    target.hash = location.hash;
    location.replace(target.href);
  </script>
</head><body><p>診断トップへ移動しています。<a href="/top/">好みの顔タイプ診断を開く</a></p></body></html>
'''
        page = destination / 'top' / variant / 'index.html'
        page.parent.mkdir(parents=True, exist_ok=True)
        page.write_text(html, encoding='utf-8')
    print('OGP別入口: /top/03/・/top/05/ → 通常トップ')
