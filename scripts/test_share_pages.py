"""SNS用のキャラクターと、既存共有URLに表示する同タイプの顔5枚を検証する。"""

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
        if tag == "img" and values.get("src"):
            self.images.append(values["src"])
        if tag == "script":
            self.scripts.append(values)


class SharePagesTest(unittest.TestCase):
    def test_existing_share_urls_show_character_and_exactly_five_matching_examples(self):
        types = read_browser_data(ROOT / "data/result_types.js")
        faces = [face for gender in ("female", "male") for face in read_browser_data(ROOT / f"data/{gender}_faces.js")]
        cards = {card["id"]: card for card in json.loads((ROOT / "data/share_cards.json").read_text())["cards"]}
        characters = {(item["gender"], item["type"]): item for item in read_browser_data(ROOT / "data/type_characters.js")}
        site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            self.assertEqual(build_share_pages(destination), 80)
            self.assertEqual(len(list(destination.rglob("index.html"))), 80)
            for face in faces:
                result_type = next(item for item in types[face["gender"]] if item["id"] == face["type"])
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
                character = characters[(face["gender"], face["type"])]
                self.assertEqual(len(parsed.images), 6)
                self.assertEqual((page.parent / urlsplit(parsed.images[0]).path).resolve(), destination / character["image"])
                expected_examples = {destination / item["image"] for item in faces if item["gender"] == face["gender"] and item["type"] == face["type"]}
                actual_examples = {(page.parent / urlsplit(src).path).resolve() for src in parsed.images[1:]}
                self.assertEqual(actual_examples, expected_examples)
                self.assertEqual(len(actual_examples), 5)
                self.assertEqual(cards[face["id"]]["character_id"], character["id"])
                self.assertIn(f'<div class="shared-code">{result_type["code"]}</div>', html)
                self.assertIn("例えば、こんな顔", html)
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

    def test_changed_character_requires_all_five_share_images_to_be_rendered_again(self):
        from build_share_pages import read_browser_data as original

        def changed(path):
            data = original(path)
            if path.name == "type_characters.js":
                data[0]["sha256"] = "changed-character"
            return data

        errors = []
        with patch("build_share_pages.read_browser_data", side_effect=changed):
            check_integrity.check_share_cards(lambda ok, message: errors.append(message) if not ok else None, set())
        self.assertEqual(len(errors), 5)
        self.assertTrue(all("キャラクターが更新" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
