// 起動済みの静的サーバーで3画面を検証。広告配信はモックし、実広告へのアクセスを発生させない。
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const site = new URL(process.env.SITE_URL || 'http://127.0.0.1:8000/');
const sessionKey = 'face-diagnosis:v1';
const routeUrl = name => new URL(`${name}/`, site).href;

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [gender, width] of [['female', 1280], ['male', 390]]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin === site.origin) return route.continue();
        if (url.hostname === 'imp-adedge.i-mobile.co.jp') {
          return route.fulfill({ contentType: 'application/javascript', body: 'window.__adLoads = (window.__adLoads || 0) + 1;' });
        }
        return route.fulfill({ status: 204, body: '' });
      });
      await context.addInitScript(() => { window.__documentId = crypto.randomUUID(); });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {
        if (new URL(response.url()).origin === site.origin && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
      });
      const ready = async name => {
        await page.waitForURL(routeUrl(name));
        await page.waitForFunction(() => window.__adLoads === 1);
        assert.equal(await page.locator('.screen.active').count(), 1);
        assert.equal(await page.locator('body').getAttribute('data-page'), name);
        const ad = await page.evaluate(() => window.adsbyimobile[0]);
        assert.equal(ad.asid, width >= 800 ? 1943673 : 1943443);
        return page.evaluate(() => window.__documentId);
      };
      const pair = () => page.locator('#duel img').evaluateAll(images => images.map(image => image.getAttribute('src')));

      await page.goto(site.href);
      const topDocument = await ready('top');
      await page.locator(`.gender-btn[data-gender="${gender}"]`).click();
      const quizDocument = await ready('quiz');
      assert.notEqual(quizDocument, topDocument);
      assert.equal(await page.locator('#roundLabel').innerText(), '0 / 20');
      const firstPair = await pair();
      await page.locator('#skipButton').click();
      assert.notDeepEqual(await pair(), firstPair);
      assert.equal(await page.locator('#roundLabel').innerText(), '0 / 20');
      for (let i = 0; i < 5; i += 1) await page.locator(i % 2 ? '#rightCard' : '#leftCard').click();
      assert.equal(await page.evaluate(() => window.__documentId), quizDocument);
      assert.equal(await page.evaluate(() => window.__adLoads), 1);
      assert.equal((await page.locator('#leftCard').innerText()).trim(), '');
      assert.equal(await page.locator('#leftCard img').getAttribute('alt'), '');
      const savedPair = await pair();
      const saved = await page.evaluate(key => sessionStorage.getItem(key), sessionKey);
      await page.reload();
      assert.notEqual(await ready('quiz'), quizDocument);
      assert.equal(await page.locator('#roundLabel').innerText(), '5 / 20');
      assert.deepEqual(await pair(), savedPair);
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), sessionKey), saved);
      const beforeCacheRestore = await page.evaluate(() => window.__documentId);
      await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
      await page.waitForFunction(previous => window.__documentId !== previous, beforeCacheRestore);
      await ready('quiz');
      assert.equal(await page.locator('#roundLabel').innerText(), '5 / 20');
      assert.deepEqual(await pair(), savedPair);

      // 未完了で結果URLを開いた場合は、進行中の診断へ戻す。
      await page.goto(routeUrl('result'));
      const resumedDocument = await ready('quiz');
      assert.equal(await page.locator('#roundLabel').innerText(), '5 / 20');
      for (let i = 5; i < 19; i += 1) await page.locator(i % 2 ? '#rightCard' : '#leftCard').click();
      const finalPair = await pair();
      await page.evaluate(() => {
        window.__originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = () => { throw new Error('Storage disabled'); };
      });
      await page.locator('#rightCard').click();
      assert.equal(page.url(), routeUrl('quiz'));
      assert.equal(await page.locator('#roundLabel').innerText(), '19 / 20');
      assert.deepEqual(await pair(), finalPair);
      assert.equal(await page.locator('#sessionError').isVisible(), true);
      await page.evaluate(() => { Storage.prototype.setItem = window.__originalSetItem; });
      await page.locator('#rightCard').click();
      assert.notEqual(await ready('result'), resumedDocument);
      const title = await page.locator('#resultTitle').innerText();
      const portrait = await page.locator('#resultPortrait img').getAttribute('src');
      assert.ok(title);
      assert.ok(portrait.startsWith(`assets/${gender}/`));
      const share = new URL(await page.locator('#xShareButton').getAttribute('href'));
      const shareUrl = new URL(share.searchParams.get('url'));
      assert.match(shareUrl.pathname, new RegExp(`^/share/v6\\.1/${gender}_\\d{3}/[a-z]+/$`));
      assert.ok(portrait.includes(shareUrl.pathname.split('/')[3]));
      const sharedPage = await context.newPage();
      await sharedPage.goto(new URL(shareUrl.pathname, site).href);
      assert.equal(new URL(await sharedPage.locator('.cta').getAttribute('href'), sharedPage.url()).href, routeUrl('top'));
      await sharedPage.close();
      await page.reload();
      await ready('result');
      assert.equal(await page.locator('#resultTitle').innerText(), title);
      assert.equal(await page.locator('#resultPortrait img').getAttribute('src'), portrait);

      // 完了後に戻っても20問目を再回答させず、進む操作で同じ結果を開ける。
      await page.goBack();
      await ready('top');
      await page.goForward();
      await ready('result');
      assert.equal(await page.locator('#resultTitle').innerText(), title);
      await page.locator('#restartButton').click();
      await ready('top');
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), sessionKey), null);
      for (const name of ['quiz', 'result']) {
        await page.goto(routeUrl(name));
        await ready('top');
      }
      await page.evaluate(key => sessionStorage.setItem(key, '{broken'), sessionKey);
      await page.goto(routeUrl('quiz'));
      await ready('top');

      // 保存が禁止されている場合は開始前に案内し、空の診断画面へ遷移しない。
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage disabled'); }; });
      await page.locator(`.gender-btn[data-gender="${gender}"]`).click();
      assert.equal(page.url(), routeUrl('top'));
      assert.equal(await page.locator('#sessionError').isVisible(), true);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`${gender} / ${width}px: 3画面の通常遷移・広告初期化・20問・途中/結果の復元・履歴・直接アクセス・保存エラー OK`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
