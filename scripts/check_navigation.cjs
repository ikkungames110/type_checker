// 起動済みの静的サーバーで3画面を検証。広告配信はモックし、実広告へのアクセスを発生させない。
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const site = new URL(process.env.SITE_URL || 'http://127.0.0.1:8000/');
const sessionKey = 'face-diagnosis:v8';
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
      const shownFirstCycle = new Set();
      let observedPairs = 0;
      let rejectedTypes = new Set();
      const inspectPair = async () => {
        const saved = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), sessionKey);
        const records = await page.evaluate(g => g === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS, gender);
        const current = saved.deck.current.map(id => records.find(face => face.id === id));
        assert.notEqual(current[0].type, current[1].type);
        assert.equal(await page.locator('#duel img').evaluateAll(imgs => imgs.every(img => Math.abs(img.clientWidth / img.clientHeight - 0.75) < 0.01)), true);
        assert.equal(saved.deck.shownPairs, ++observedPairs);
        if (observedPairs <= 20) {
          current.forEach(face => { assert.ok(!shownFirstCycle.has(face.id)); shownFirstCycle.add(face.id); });
          if (observedPairs === 20) assert.equal(shownFirstCycle.size, 40);
        } else {
          current.forEach(face => assert.ok(!rejectedTypes.has(face.type)));
        }
        return current;
      };
      const pair = () => page.locator('#duel img').evaluateAll(images => images.map(image => image.getAttribute('src')));

      await page.goto(site.href);
      const topDocument = await ready('top');
      assert.equal(await page.locator('#sampleA img').getAttribute('src'), 'assets/female/female_011.png?v=8');
      assert.equal(await page.locator('#sampleB img').getAttribute('src'), 'assets/male/male_011.png?v=8');
      await page.locator('#sampleA img').evaluate(img => img.decode());
      await page.screenshot({ path: `/tmp/type-checker-v8-top-${width}.png` });
      await page.locator(`.gender-btn[data-gender="${gender}"]`).click();
      const quizDocument = await ready('quiz');
      assert.notEqual(quizDocument, topDocument);
      assert.equal(await page.locator('#roundLabel').innerText(), '0 / 20');
      const firstPair = await pair();
      rejectedTypes = new Set((await inspectPair()).map(face => face.type));
      await page.locator('#skipButton').click();
      assert.notDeepEqual(await pair(), firstPair);
      await inspectPair();
      assert.equal(await page.locator('#roundLabel').innerText(), '0 / 20');
      for (let i = 0; i < 5; i += 1) { await page.locator(i % 2 ? '#rightCard' : '#leftCard').click(); await inspectPair(); }
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
      for (let i = 5; i < 19; i += 1) { await page.locator(i % 2 ? '#rightCard' : '#leftCard').click(); await inspectPair(); }
      assert.equal(observedPairs, 21);
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
      const resultData = await page.evaluate(key => {
        const saved = JSON.parse(sessionStorage.getItem(key));
        const records = saved.gender === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS;
        const byId = new Map(records.map(face => [face.id, face]));
        const scores = {};
        for (const id of saved.chosenIds) scores[byId.get(id).type] = (scores[byId.get(id).type] || 0) + 1;
        const portraitId = document.querySelector('#resultPortrait img').getAttribute('src').match(/(female|male)_\d{3}/)[0];
        const winner = byId.get(portraitId).type;
        return { chosen: saved.chosenIds.includes(portraitId), total: Object.values(scores).reduce((a,b) => a+b,0),
          max: Math.max(...Object.values(scores)), winnerCount: scores[winner], winner,
          savedWinner: saved.winnerId,
          classification: window.FACE_RESULT_TYPES[saved.gender].find(type => type.id === winner).classification_label,
          label: window.FACE_RESULT_TYPES[saved.gender].find(type => type.id === winner).label };
      }, sessionKey);
      assert.equal(resultData.total, 20);
      assert.equal(resultData.chosen, true);
      assert.equal(resultData.max, resultData.winnerCount);
      assert.equal(title, resultData.label);
      assert.equal(resultData.savedWinner, resultData.winner);
      assert.equal(await page.locator('#resultClassification').innerText(), `(${resultData.classification}タイプ)`);
      assert.equal(await page.locator('#resultBars').count(), 0);
      await page.locator('#resultPortrait img').evaluate(img => img.decode());
      assert.equal(await page.locator('#resultPortrait img').evaluate(img => Math.abs(img.clientWidth / img.clientHeight - 0.75) < 0.01), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.screenshot({ path: `/tmp/type-checker-v8-result-${gender}-${width}.png`, fullPage: true });
      assert.ok(portrait.startsWith(`assets/${gender}/`));
      const share = new URL(await page.locator('#xShareButton').getAttribute('href'));
      const shareUrl = new URL(share.searchParams.get('url'));
      assert.match(shareUrl.pathname, new RegExp(`^/share/v8/${gender}_\\d{3}/[a-z_]+/$`));
      assert.ok(portrait.includes(shareUrl.pathname.split('/')[3]));
      const sharedPage = await context.newPage();
      await sharedPage.goto(new URL(shareUrl.pathname, site).href);
      assert.equal(await sharedPage.locator('.result-classification').innerText(), `(${resultData.classification}タイプ)`);
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

      // 保存済みの旧形式が同率1位でも、一度抽選した結果と共有URLを保持する。
      const tiedTypes = await page.evaluate(key => {
        const saved = JSON.parse(sessionStorage.getItem(key));
        const faces = saved.gender === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS;
        const first = faces[0];
        const second = faces.find(face => face.type !== first.type);
        saved.chosenIds = [...Array(10).fill(first.id), ...Array(10).fill(second.id)];
        delete saved.winnerId;
        sessionStorage.setItem(key, JSON.stringify(saved));
        return [first.type, second.type];
      }, sessionKey);
      await page.reload();
      await ready('result');
      const tiedWinner = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).winnerId, sessionKey);
      const tiedShare = await page.locator('#xShareButton').getAttribute('href');
      assert.ok(tiedTypes.includes(tiedWinner));
      await page.reload();
      await ready('result');
      assert.equal(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).winnerId, sessionKey), tiedWinner);
      assert.equal(await page.locator('#xShareButton').getAttribute('href'), tiedShare);
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
      console.log(`${gender} / ${width}px: 3画面・40枚一巡・異タイプ二択・21組目除外・20票の採点・復元・共有・広告・保存エラー OK`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
