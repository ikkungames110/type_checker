"""3画面の静的HTML、ルート転送、宣材カード・画像URLを検証する。"""

from pathlib import Path
import tempfile
import unittest
from urllib.parse import urljoin

from build_app_pages import ROOT, PAGES, build_app_pages
from test_share_pages import PageMetadata


class AppPagesTest(unittest.TestCase):
    def test_three_documents_have_route_metadata_and_working_asset_base(self):
        site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            build_app_pages(destination)
            for name, screen in PAGES.items():
                html = (destination / name / "index.html").read_text()
                parsed = PageMetadata(html)
                self.assertIn('<base href="../">', html)
                self.assertIn(f'<body data-page="{name}">', html)
                self.assertEqual(html.count('class="screen active"'), 1)
                self.assertIn(f'class="screen active" id="{screen}"', html)
                self.assertEqual(parsed.canonical, site + name + "/")
                self.assertEqual(parsed.metadata["og:url"], parsed.canonical)
                self.assertEqual(parsed.metadata["twitter:card"], "summary_large_image")
                self.assertEqual(parsed.metadata["twitter:image"], parsed.metadata["og:image"])
                self.assertEqual(parsed.metadata.get("robots"), None if name == "top" else "noindex, follow")
                base = urljoin((destination / name / "index.html").as_uri(), "../")
                for asset in parsed.images + [script['src'] for script in parsed.scripts if 'src' in script]:
                    if asset.startswith("https://"):
                        self.assertEqual(asset, "https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104")
                        continue
                    self.assertTrue(urljoin(base, asset).startswith(destination.as_uri() + '/'))
                    self.assertTrue((ROOT / asset.split('?', 1)[0]).is_file())
            redirect = (destination / "index.html").read_text()
            self.assertIn('http-equiv="refresh" content="0;url=top/"', redirect)
            self.assertNotIn("adsbyimobile", redirect)
            self.assertIn("/ /top/ 301", (ROOT / "_redirects").read_text().splitlines())


if __name__ == "__main__":
    unittest.main()
