// 実広告は読み込まず、細い二枠への固定・旧保存値・広告リクエスト・下部の高さをブラウザーで検証する。
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const site = process.env.SITE_URL || 'http://127.0.0.1:8000/';
const key = 'face-diagnosis:mobile-ad-variant:v1';
const ids = [1943443, 1944752];

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [random, blocked, saved] of [
      [0, false, null], [0.499999, false, null],
      [0.5, false, null], [0.999999, false, null],
      [0.9, false, 'double'], [0.1, false, 'large'],
      [0.9, false, 'invalid'], [0.9, true, null]
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
        await page.waitForFunction(count => window.__adLoads === count, ids.length);
        assert.deepEqual(await page.evaluate(() => window.adsbyimobile.map(ad => ad.asid)), ids);
        assert.deepEqual(await page.evaluate(() => window.adsbyimobile), [
          { pid: 85394, mid: 596132, asid: 1943443, type: 'banner', display: 'inline', elementid: 'im-8062997010fc4d0d9409440e7545ffb5' },
          { pid: 85394, mid: 596132, asid: 1944752, type: 'banner', display: 'inline', elementid: 'im-a053b4d717c34924ac4978b686f09e3a' }
        ]);
        assert.equal(await page.evaluate(() => {
          const issued = document.querySelector('#mobileBannerTags').content;
          return [...issued.querySelectorAll('div')].every(tag =>
            document.getElementById(tag.id).innerHTML === tag.innerHTML);
        }), true, '実行後も発行タグのscript属性・本文を保持する');
        assert.equal(await page.locator('#fixedAds > div:visible').count(), ids.length);
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
        assert.equal(await page.evaluate(key => sessionStorage.getItem(key), key), saved);
        // 旧抽選結果や乱数が変わっても、再読み込み後は細い二枠だけを使う。
        await page.addInitScript(value => { Math.random = () => value; }, 1 - random);
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
      await page.waitForFunction(count => window.__adLoads === count, ids.length + 1);
      assert.equal(await page.locator('#fixedAds').isVisible(), false);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => !document.querySelector('#fixedAds').hidden);
      assert.deepEqual(await page.evaluate(() => window.adsbyimobile.map(ad => ad.asid)), [...ids, 1943673]);
      assert.equal(await page.evaluate(() => window.__adLoads), ids.length + 1);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log('スマホ広告: 常に細い二枠・旧保存値の無視・保存不可・再読み込み・画面幅変更 OK');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
