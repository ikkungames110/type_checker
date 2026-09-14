"""ルートの診断HTML、旧URL転送、宣材カード・画像URLを検証する。"""

from pathlib import Path
import tempfile
import unittest

from build_app_pages import ROOT, LEGACY_PAGES, build_app_pages
from test_share_pages import PageMetadata


class AppPagesTest(unittest.TestCase):
    def test_root_app_and_legacy_redirects(self):
        site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            build_app_pages(destination)
            html = (destination / "index.html").read_text()
            parsed = PageMetadata(html)
            self.assertEqual(parsed.canonical, site)
            self.assertEqual(parsed.metadata["og:url"], site)
            self.assertEqual(parsed.metadata["twitter:card"], "summary_large_image")
            self.assertEqual(parsed.metadata["twitter:image"], parsed.metadata["og:image"])
            self.assertIsNone(parsed.metadata.get("robots"))
            self.assertEqual(html.count('class="screen active"'), 1)
            self.assertIn('class="screen active" id="startScreen"', html)
            self.assertNotIn('resultRectangleAd', html)
            for asset in parsed.images + [script['src'] for script in parsed.scripts if 'src' in script]:
                if asset.startswith("https://"):
                    self.assertEqual(asset, "https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104")
                    continue
                self.assertTrue((ROOT / asset.split('?', 1)[0]).is_file())
            redirects = (ROOT / "_redirects").read_text().splitlines()
            self.assertFalse(any(line.startswith('/ ') for line in redirects))
            for name in LEGACY_PAGES:
                redirect = (destination / name / "index.html").read_text()
                self.assertIn('new URL("/", location.origin)', redirect)
                self.assertNotIn("adsbyimobile", redirect)
                self.assertIn(f"/{name}/ / 301", redirects)
            self.assertFalse(any('/top/03/' in line or '/top/05/' in line for line in redirects))


if __name__ == "__main__":
    unittest.main()
