"""PVの破損・欠落・登録外ファイルを公開ビルドで検出する。"""
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

import check_integrity


class PVAssetsTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'marketing/pv').mkdir(parents=True)
        (self.root / 'assets/promo').mkdir(parents=True)
        manifest = check_integrity.ROOT / 'marketing/pv/manifest.json'
        shutil.copy2(manifest, self.root / 'marketing/pv/manifest.json')
        for name in json.loads(manifest.read_text())['files']:
            shutil.copy2(check_integrity.ROOT / 'assets/promo' / name, self.root / 'assets/promo' / name)

    def inspect(self):
        errors, images = [], set()
        with patch.object(check_integrity, 'ROOT', self.root):
            check_integrity.check_pv_assets(lambda ok, message: errors.append(message) if not ok else None, images)
        return errors, images

    def test_registered_assets_and_only_cover_are_accepted(self):
        errors, images = self.inspect()
        self.assertEqual(errors, [])
        self.assertEqual(images, {(self.root / 'assets/promo/type-checker-cover.jpg').resolve()})

    def test_modified_video_and_missing_subtitle_are_rejected(self):
        with (self.root / 'assets/promo/type-checker-30s.mp4').open('ab') as handle:
            handle.write(b'corrupt')
        (self.root / 'assets/promo/type-checker-15s.srt').unlink()
        errors, _ = self.inspect()
        self.assertTrue(any('ハッシュが不一致 type-checker-30s.mp4' in error for error in errors))
        self.assertTrue(any('ファイルがない type-checker-15s.srt' in error for error in errors))

    def test_manifest_cannot_register_an_extra_image(self):
        path = self.root / 'marketing/pv/manifest.json'
        manifest = json.loads(path.read_text())
        manifest['files']['old-face.jpg'] = {'bytes': 1, 'sha256': '0' * 64}
        path.write_text(json.dumps(manifest))
        errors, images = self.inspect()
        self.assertIn('PV: 登録された完成ファイルの一覧が不一致', errors)
        self.assertEqual(len(images), 1)


if __name__ == '__main__':
    unittest.main()
