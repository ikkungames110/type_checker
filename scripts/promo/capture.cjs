// 公開中のサイトを実際に操作して録画する。広告通信と外部投稿は発生させない。
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '../..');
const destination = path.join(root, 'marketing/pv/source');
const site = new URL(process.env.PROMO_SITE_URL || 'https://type-checker.shianstudio.com/');

async function main() {
  await fs.mkdir(destination, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = { capturedAt: new Date().toISOString(), site: site.href, viewport: { width: 440, height: 880 }, sessions: {} };
  try {
    for (const gender of ['female', 'male']) {
      const context = await browser.newContext({
        viewport: report.viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
        recordVideo: { dir: destination, size: { width: 440, height: 880 } },
      });
      const imageCache = new Map();
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin !== site.origin) return route.fulfill({ status: 204, body: '' });
        if (!url.pathname.endsWith('.png')) return route.continue();
        // ルーティングで無効になるHTTPキャッシュを補い、本番の画像を同じバイト列で再利用する。
        if (!imageCache.has(url.href)) {
          const response = await route.fetch();
          assert.equal(response.status(), 200);
          imageCache.set(url.href, await response.body());
        }
        return route.fulfill({ contentType: 'image/png', body: imageCache.get(url.href) });
      });
      const page = await context.newPage();
      const session = { events: [] };
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const start = performance.now();
      const mark = async (name, extra = {}) => {
        session.events.push({ name, time: (performance.now() - start) / 1000, ...extra });
      };
      const ready = () => page.locator('#duel img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      const snap = async name => page.screenshot({ path: path.join(destination, `${gender}-${name}.png`) });
      const tap = async selector => {
        const box = await page.locator(selector).boundingBox();
        await mark('tap', { selector, x: box.x + box.width / 2, y: box.y + box.height / 2 });
        await page.locator(selector).click();
      };
      await page.goto(new URL('top/', site).href);
      await page.locator('#sampleA img').evaluate(img => img.decode());
      // 診断中の画像読み込み待ちを減らす。表示や出題・採点処理は変更しない。
      await page.evaluate(async () => {
        const faces = [...window.FEMALE_FACE_ASSETS, ...window.MALE_FACE_ASSETS];
        await Promise.all(faces.map(face => new Promise(resolve => {
          const img = new Image(); img.onload = img.onerror = resolve; img.src = `${face.image}?v=${face.asset_version}`;
        })));
      });
      await snap('top');
      await mark('top');
      await page.waitForTimeout(1200);
      await tap(`[data-gender="${gender}"]`);
      await page.waitForURL('**/quiz/');
      await ready();
      await mark('quiz');
      await snap('quiz');
      session.quizBounds = await page.locator('#quizScreen').boundingBox();
      session.duelBounds = await page.locator('#duel').boundingBox();
      session.skipBounds = await page.locator('#skipButton').boundingBox();
      await page.waitForTimeout(1700);
      for (let i = 0; i < 20; i++) {
        if (i === 3) {
          await mark('skip-before');
          await page.waitForTimeout(1300);
          await tap('#skipButton');
          await ready();
          assert.equal(await page.locator('#roundLabel').innerText(), '3 / 20');
          await mark('skip-after');
          await page.waitForTimeout(1300);
        }
        // 例示用の選択。通常のタップだけで20回回答し、画面が返した結果を使う。
        const selectedIndex = await page.evaluate(({ gender, i }) => {
          const saved = JSON.parse(sessionStorage.getItem('face-diagnosis:v8'));
          const records = gender === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS;
          const favorites = gender === 'female' ? ['fresh', 'cute', 'soft_elegant'] : ['fresh_soft', 'charming_soft', 'cool_soft'];
          const ranks = saved.deck.current.map(id => {
            const rank = favorites.indexOf(records.find(face => face.id === id).type);
            return rank < 0 ? 10 : rank;
          });
          return ranks[0] === ranks[1] ? i % 2 : Number(ranks[1] < ranks[0]);
        }, { gender, i });
        await mark('choice-before', { index: i + 1 });
        if (i === 19) await snap('last-choice');
        await tap(selectedIndex === 0 ? '#leftCard' : '#rightCard');
        if (i < 19) {
          await ready();
          await page.waitForTimeout(i < 3 ? 1050 : 480);
        }
      }
      await page.waitForURL('**/result/');
      await page.locator('#resultPortrait img').evaluate(img => img.decode());
      await mark('result');
      session.resultTitle = await page.locator('#resultTitle').innerText();
      session.classification = await page.locator('#resultClassification').innerText();
      session.resultPortrait = await page.locator('#resultPortrait img').getAttribute('src');
      session.resultSummaryBounds = await page.locator('.result-summary').boundingBox();
      session.resultPortraitBounds = await page.locator('#resultPortrait').boundingBox();
      session.saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('face-diagnosis:v8')));
      assert.equal(session.saved.chosenIds.length, 20);
      await snap('result');
      await page.screenshot({ path: path.join(destination, `${gender}-result-full.png`), fullPage: true });
      await page.waitForTimeout(2200);
      await page.evaluate(() => document.querySelector('#resultPortrait').scrollIntoView({ behavior: 'smooth', block: 'center' }));
      await page.waitForTimeout(1600);
      await mark('result-scroll');
      await snap('result-portrait');
      await page.waitForTimeout(1800);
      assert.deepEqual(errors, []);
      const video = page.video();
      await context.close();
      await video.saveAs(path.join(destination, `${gender}-session.webm`));
      await video.delete();
      report.sessions[gender] = session;
      console.log(`${gender}: ${session.resultTitle} / 20 choices, 1 skip, recorded`);
    }
  } finally {
    await browser.close();
  }
  await fs.writeFile(path.join(destination, 'capture.json'), JSON.stringify(report, null, 2) + '\n');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
