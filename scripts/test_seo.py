"""サイトマップから、索引可能な静的本文・正規URLまでの整合性を確認する。"""
from pathlib import Path
import tempfile
import unittest
from xml.etree import ElementTree as ET
from urllib.parse import urlparse

from build_app_pages import build_app_pages
from build_letter_share_pages import build_letter_share_pages
from build_sitemap import build_sitemap, NAMESPACE, ROOT
from test_share_pages import PageMetadata


class SeoTest(unittest.TestCase):
    def test_discoverable_canonical_pages(self):
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            build_app_pages(destination)
            build_letter_share_pages(destination)
            build_sitemap(destination)
            urls = [node.text for node in ET.parse(destination / 'sitemap.xml').findall(f'.//{{{NAMESPACE}}}loc')]
            self.assertEqual(len(urls), 17)
            self.assertEqual(len(set(urls)), 17)
            for url in urls:
                path = urlparse(url).path
                html = (destination / path.lstrip('/') / 'index.html').read_text()
                metadata = PageMetadata(html)
                self.assertEqual(metadata.canonical, url)
                self.assertNotIn('noindex', metadata.metadata.get('robots', ''))
                if path != '/top/':
                    self.assertIn('の顔タイプ「', html.split('</title>')[0])
            self.assertIn('Sitemap: https://type-checker.shianstudio.com/sitemap.xml', (ROOT / 'robots.txt').read_text())
            for name in ('quiz', 'result'):
                html = (destination / name / 'index.html').read_text()
                self.assertNotIn('<title>好みの顔タイプ診断｜', html)
                self.assertIn('noindex, follow', html)

    def test_missing_sitemap_target_fails_build(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(ValueError):
                build_sitemap(Path(directory))
