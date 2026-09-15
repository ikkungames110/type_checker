// 実広告は読み込まず、抽選・保存・広告リクエスト・下部の高さをブラウザーで検証する。
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const site = process.env.SITE_URL || 'http://127.0.0.1:8000/';
const key = 'face-diagnosis:mobile-ad-variant:v1';
const ids = { double: [1943443, 1944283], large: [1944662] };

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [random, variant, blocked, saved] of [
      [0, 'double', false, null], [0.499999, 'double', false, null],
      [0.5, 'large', false, null], [0.999999, 'large', false, null],
      [0.9, 'double', false, 'double'], [0.1, 'large', false, 'large'],
      [0.9, 'large', false, 'invalid'], [0.9, 'large', true, null]
    ]) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin === new URL(site).origin) return route.continue();
        if (url.hostname === 'imp-adedge.i-mobile.co.jp') return route.fulfill({
          contentType: 'application/javascript', body: 'window.__adLoads = (window.__adLoads || 0) + 1;'
        });
        return route.fulfill({ status: 204, body: '' });
      });
      await context.addInitScript(({ random, blocked, saved, key }) => {
        Math.random = () => random;
        if (saved && !sessionStorage.getItem(key)) sessionStorage.setItem(key, saved);
        if (blocked) {
          Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error('Storage disabled'); };
        }
      }, { random, blocked, saved, key });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const check = async () => {
        await page.waitForFunction(count => window.__adLoads === count, ids[variant].length);
        assert.deepEqual(await page.evaluate(() => window.adsbyimobile.map(ad => ad.asid)), ids[variant]);
        assert.equal(await page.locator('#fixedAds > div:visible').count(), ids[variant].length);
        await page.waitForFunction(() => getComputedStyle(document.body).paddingBottom === '100px');
        for (const fraction of [0, 0.5, 1]) {
          const box = await page.evaluate(fraction => {
            scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * fraction);
            const rect = document.querySelector('#fixedAds').getBoundingClientRect();
            return { bottom: rect.bottom, height: rect.height, viewport: innerHeight };
          }, fraction);
          assert.equal(box.height, 100);
          assert.equal(box.bottom, box.viewport);
        }
      };
      await page.goto(site);
      await check();
      if (!blocked) {
        assert.equal(await page.evaluate(key => sessionStorage.getItem(key), key), variant);
        // 再読み込みでは逆側の乱数でも保存済みの枠を維持する。
        await page.addInitScript(value => { Math.random = () => value; }, variant === 'double' ? 0.9 : 0.1);
        await page.reload();
        await check();
        if (random === 0.5) {
          await page.locator('.gender-btn[data-gender="female"]').click();
          await check();
          for (let choice = 0; choice < 20; choice++) await page.locator('#leftCard').click();
          await page.waitForFunction(() => document.body.dataset.page === 'result');
          await check();
          await page.locator('#restartButton').click();
          await page.waitForFunction(() => document.body.dataset.page === 'top');
          await check();
        }
      }
      await page.setViewportSize({ width: 1280, height: 844 });
      await page.waitForFunction(count => window.__adLoads === count, ids[variant].length + 1);
      assert.equal(await page.locator('#fixedAds').isVisible(), false);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => !document.querySelector('#fixedAds').hidden);
      assert.deepEqual(await page.evaluate(() => window.adsbyimobile.map(ad => ad.asid)), [...ids[variant], 1943673]);
      assert.equal(await page.evaluate(() => window.__adLoads), ids[variant].length + 1);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log('スマホ広告: 50%の境界・両配置・保存復元・不正保存値・保存不可・画面幅変更 OK');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
