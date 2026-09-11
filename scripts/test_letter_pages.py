"""OGP別入口と、同点を含む54通りの共有結果の静的HTMLを確認する。"""
from pathlib import Path
import json
import tempfile
import unittest
from urllib.parse import urlsplit
from build_top_variants import ROOT, build_top_variants
from build_letter_share_pages import build_letter_share_pages, letter_results
from build_share_pages import read_browser_data
from test_share_pages import PageMetadata


class LetterPagesTest(unittest.TestCase):
    def test_top_03_and_05_have_independent_ogp_before_browser_redirect(self):
        cards = json.loads((ROOT / 'docs/character-ogp-assets/manifest.json').read_text())['cards']
        site = f'https://{(ROOT / "CNAME").read_text().strip()}/'
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory)
            build_top_variants(destination)
            images=[]
            for variant in ['03','05']:
                html=(destination/'top'/variant/'index.html').read_text()
                parsed=PageMetadata(html)
                card=next(c for c in cards if c['id']==variant)
                self.assertEqual(parsed.canonical,site+f'top/{variant}/')
                self.assertEqual(parsed.metadata['og:url'],parsed.canonical)
                expected=site+'docs/character-ogp-assets/'+card['file']+'?v='+card['sha256'][:12]
                self.assertEqual(parsed.metadata['og:image'],expected)
                self.assertEqual(parsed.metadata['twitter:image'],expected)
                self.assertEqual(parsed.metadata['twitter:card'],'summary_large_image')
                self.assertEqual(parsed.metadata['og:image:width'],'1200')
                self.assertEqual(parsed.metadata['og:image:height'],'630')
                self.assertIn("new URL('/top/', location.origin)",html)
                self.assertIn('location.replace(target.href)',html)
                self.assertIn('target.search = location.search',html)
                self.assertNotIn('http-equiv="refresh"',html)
                self.assertNotIn('adsbyimobile',html)
                images.append(expected)
            self.assertNotEqual(*images)

    def test_all_54_results_have_every_tied_character_and_five_faces_per_type(self):
        types=read_browser_data(ROOT/'data/result_types.js')
        axes=read_browser_data(ROOT/'data/type_axes.js')
        characters={(c['gender'],c['type']):c for c in read_browser_data(ROOT/'data/type_characters.js')}
        site=f'https://{(ROOT/"CNAME").read_text().strip()}/'
        with tempfile.TemporaryDirectory() as directory:
            destination=Path(directory)
            self.assertEqual(build_letter_share_pages(destination),54)
            self.assertEqual(len(list(destination.rglob('index.html'))),54)
            for gender in types:
                faces=read_browser_data(ROOT/f'data/{gender}_faces.js')
                for codes,winners in letter_results(types[gender],axes):
                    relative=f'share/letters/{gender}/{"-".join(codes)}/'
                    page=destination/relative/'index.html'
                    html=page.read_text();parsed=PageMetadata(html)
                    self.assertEqual(parsed.canonical,site+relative)
                    self.assertEqual(parsed.metadata['og:url'],parsed.canonical)
                    self.assertEqual(parsed.metadata['og:title'],' / '.join(codes)+' | 好みの顔タイプ診断')
                    self.assertEqual(parsed.metadata['og:image'],parsed.metadata['twitter:image'])
                    self.assertEqual(len(parsed.images),len(codes)*6)
                    actual={(page.parent/urlsplit(src).path).resolve() for src in parsed.images}
                    expected={destination/characters[(gender,t['id'])]['image'] for t in winners}
                    expected.update(destination/f['image'] for f in faces if f['type'] in {t['id'] for t in winners})
                    self.assertEqual(actual,expected)
                    self.assertNotIn('${',html)
                    self.assertIn('id="shared-breakdown" aria-label="3つの軸の割合" hidden',html)
                    self.assertNotIn('50%',html)  # 回答を含まないURLで架空の比率を示さない。
                    self.assertEqual(html.count('class="type-code"'),len(codes))
                    self.assertTrue(all((ROOT/urlsplit(s['src']).path.removeprefix('../../../../')).is_file() for s in parsed.scripts))


if __name__=='__main__':
    unittest.main()
