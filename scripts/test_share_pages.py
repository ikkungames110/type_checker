"""SNSクローラーが取得する生HTMLと、診断で選ばれる写真の対応を検証する。"""

from html.parser import HTMLParser
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.parse import urlsplit

import check_integrity
from build_share_pages import ROOT, build_share_pages, read_browser_data


class PageMetadata(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.metadata = {}
        self.canonical = None
        self.images = []
        self.scripts = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "meta":
            self.metadata[values.get("name", values.get("property"))] = values.get("content")
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical = values["href"]
        if tag == "img":
            self.images.append(values["src"])
        if tag == "script":
            self.scripts.append(values)


class SharePagesTest(unittest.TestCase):
    def test_every_face_and_result_has_its_own_static_image_card(self):
        types = read_browser_data(ROOT / "data/result_types.js")
        faces = [face for gender in ("female", "male") for face in read_browser_data(ROOT / f"data/{gender}_faces.js")]
        cards = {card["id"]: card for card in json.loads((ROOT / "data/share_cards.json").read_text())["cards"]}
        site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            self.assertEqual(build_share_pages(destination), 720)
            self.assertEqual(len(list(destination.rglob("index.html"))), 720)
            for face in faces:
                for result_type in types:
                    relative = f'share/{face["asset_version"]}/{face["id"]}/{result_type["id"]}/'
                    page = destination / relative / "index.html"
                    html = page.read_text()
                    parsed = PageMetadata(html)
                    self.assertEqual(parsed.scripts, [])
                    self.assertNotIn("${", html)
                    self.assertEqual(parsed.canonical, site + relative)
                    self.assertEqual(parsed.metadata["og:url"], parsed.canonical)
                    self.assertEqual(parsed.metadata["twitter:card"], "summary_large_image")
                    self.assertEqual(parsed.metadata["twitter:image"], site + cards[face["id"]]["image"])
                    self.assertEqual(parsed.metadata["twitter:image"], parsed.metadata["og:image"])
                    self.assertEqual(parsed.metadata["twitter:title"], result_type["label"] + " | 好みの顔タイプ診断")
                    self.assertEqual((page.parent / urlsplit(parsed.images[0]).path).resolve(), destination / face["image"])
                    self.assertIn("自分のタイプを診断する", html)

    def test_new_portrait_requires_matching_share_image(self):
        from build_share_pages import read_browser_data as original

        def changed(path):
            data = original(path)
            if path.name == "female_faces.js":
                data[0]["generation"]["image_sha256"] = "new-portrait"
            return data

        errors = []
        with patch("build_share_pages.read_browser_data", side_effect=changed):
            check_integrity.check_share_cards(lambda ok, message: errors.append(message) if not ok else None, set())
        self.assertEqual(len(errors), 1)
        self.assertIn("female_001: 元の顔写真が更新", errors[0])


if __name__ == "__main__":
    unittest.main()
