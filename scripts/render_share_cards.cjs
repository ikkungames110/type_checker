// 既存の顔写真をHTMLに配置し、Xカード用のJPEGとして書き出す。
// 写真そのものや採点用の特徴量は変更しない。
const { chromium } = require('playwright');
const { readFile, writeFile, mkdir, unlink } = require('node:fs/promises');
const { createHash } = require('node:crypto');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const template = 'scripts/templates/share_card.html';
const parseData = source => JSON.parse(source.slice(source.indexOf('=') + 1).trim().replace(/;$/, ''));

async function main() {
  const manifestPath = path.join(root, 'data/share_cards.json');
  let previous = [];
  try {
    previous = JSON.parse(await readFile(manifestPath, 'utf8')).cards;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const templateHash = hash(await readFile(path.join(root, template)));
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.SHARE_CARD_CHROMIUM ? { executablePath: process.env.SHARE_CARD_CHROMIUM } : {})
  });
  const cards = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 600 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(root, template)).href);
    await page.evaluate(() => document.fonts.ready);
    for (const gender of ['female', 'male']) {
      const records = parseData(await readFile(path.join(root, `data/${gender}_faces.js`), 'utf8'));
      for (const face of records) {
        const original = await readFile(path.join(root, face.image));
        const sourceHash = hash(original);
        if (sourceHash !== face.generation.image_sha256) throw new Error(`${face.id}: 元画像のハッシュ不一致`);
        const directory = `assets/share/${face.asset_version}`;
        await mkdir(path.join(root, directory), { recursive: true });
        await page.evaluate(async ({ portrait, gender }) => {
          const image = document.getElementById('portrait');
          image.src = portrait;
          document.getElementById('target').textContent = `私が惹かれる${gender === 'female' ? '女性' : '男性'}の顔は…`;
          await image.decode();
        }, { portrait: `data:image/png;base64,${original.toString('base64')}`, gender });
        const bytes = await page.screenshot({ type: 'jpeg', quality: 90 });
        const imageHash = hash(bytes);
        const image = `${directory}/${face.id}-${imageHash.slice(0, 12)}.jpg`;
        await writeFile(path.join(root, image), bytes);
        cards.push({
          id: face.id, gender, asset_version: face.asset_version, image,
          source_image: face.image, source_sha256: sourceHash,
          image_sha256: imageHash, width: 1200, height: 600
        });
      }
      console.log(`${gender}: 顔写真付き共有カード${records.length}枚を書き出しました`);
    }
  } finally {
    await browser.close();
  }
  await writeFile(manifestPath, JSON.stringify({
    template, template_sha256: templateHash, cards
  }, null, 2) + '\n');
  const currentImages = new Set(cards.map(card => card.image));
  for (const old of previous) {
    // 前回のマニフェストに記録された、この処理の出力だけを整理する。
    if (!currentImages.has(old.image) && /^assets\/share\/v[\d.]+\/(female|male)_\d{3}-[a-f0-9]{12}\.jpg$/.test(old.image)) {
      await unlink(path.join(root, old.image)).catch(error => { if (error.code !== 'ENOENT') throw error; });
    }
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
