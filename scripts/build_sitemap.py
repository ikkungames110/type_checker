"""検索の入口と現行の単一タイプの正規URLだけをサイトマップに掲載する。"""
from pathlib import Path
from xml.etree import ElementTree as ET

from build_share_pages import read_browser_data

ROOT = Path(__file__).resolve().parents[1]
NAMESPACE = 'http://www.sitemaps.org/schemas/sitemap/0.9'


def build_sitemap(destination):
    site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
    types = read_browser_data(ROOT / 'data/result_types.js')
    paths = ['top/'] + [
        f'share/letters/{gender}/{item["code"]}/'
        for gender in ('female', 'male') for item in types[gender]
    ]
    ET.register_namespace('', NAMESPACE)
    root = ET.Element(f'{{{NAMESPACE}}}urlset')
    for path in paths:
        if not (destination / path / 'index.html').is_file():
            raise ValueError(f'サイトマップのリンク先がありません: {path}')
        url = ET.SubElement(root, f'{{{NAMESPACE}}}url')
        ET.SubElement(url, f'{{{NAMESPACE}}}loc').text = site + path
    ET.indent(root)
    ET.ElementTree(root).write(destination / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    print(f'サイトマップ: {len(paths)}件の正規URL')
