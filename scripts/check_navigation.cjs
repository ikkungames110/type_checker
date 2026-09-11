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

      for(const variant of ['03','05']){
        await page.goto(routeUrl(`top/${variant}`));
        await ready('top');
      }
      await page.goto(site.href);
      const topDocument = await ready('top');
      assert.equal(await page.locator('#sampleA img').getAttribute('src'), 'assets/characters/v1/female_fresh.png');
      assert.equal(await page.locator('#sampleB img').getAttribute('src'), 'assets/characters/v1/male_fresh_soft.png');
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
      const resultData = await page.evaluate(key => {
        const saved = JSON.parse(sessionStorage.getItem(key));
        const records = saved.gender === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS;
        const types = window.FACE_RESULT_TYPES[saved.gender];
        const byId = new Map(records.map(face => [face.id, face]));
        const counts = Object.fromEntries(types.map(type=>[type.code,0]));
        saved.chosenIds.forEach(id=>{counts[types.find(type=>type.id===byId.get(id).type).code]++;});
        const codes=['ASQ','ASV','ACQ','ACV','RSQ','RSV','RCQ','RCV'].filter(code=>counts[code]===Math.max(...Object.values(counts)));
        return {codes,counts,total:saved.chosenIds.length,types:codes.map(code=>{
          const type=types.find(type=>type.code===code);
          return {...type,character:window.FACE_CHARACTERS.find(c=>c.gender===saved.gender&&c.type===type.id),examples:records.filter(face=>face.type===type.id).map(face=>face.id).sort()};
        })};
      },sessionKey);
      assert.equal(resultData.total,20);
      assert.deepEqual(await page.locator('#resultCodes [data-code]').evaluateAll(nodes=>nodes.map(n=>n.dataset.code)),resultData.codes);
      assert.equal(await page.locator('#resultTypes .letter-type').count(),resultData.codes.length);
      for(const type of resultData.types){
        const card=page.locator(`#resultTypes [data-code="${type.code}"]`);
        assert.equal(await card.locator('h2').innerText(),type.label);
        assert.equal(await card.locator('.result-classification').innerText(),`(${type.classification_label}タイプ)`);
        assert.ok((await card.locator('img').getAttribute('src')).startsWith(type.character.image+'?v='));
        await card.locator('img').evaluate(img=>img.decode());
        assert.deepEqual(await page.locator(`#resultExamples [data-code="${type.code}"] img`).evaluateAll(nodes=>nodes.map(n=>n.dataset.faceId).sort()),type.examples);
      }
      for(const code of resultData.codes){
        assert.deepEqual(await page.locator(`#resultBreakdown [data-code="${code}"] [data-letter]`).evaluateAll(nodes=>nodes.map(n=>n.dataset.letter)),[...code]);
      }
      assert.equal(await page.locator('#resultBreakdown [data-letter]').count(),resultData.codes.length*3);
      const meanings={A:'軽やか',R:'落ち着き',S:'柔らか',C:'凛と',Q:'さりげなさ',V:'華やか'};
      for(const code of resultData.codes) for(const letter of code){
        assert.equal(await page.locator(`#resultBreakdown [data-code="${code}"] [data-letter="${letter}"] dd`).innerText(),meanings[letter]);
      }
      assert.doesNotMatch(await page.locator('#resultBreakdown').innerText(), /%|回|票/);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const codeText=await page.locator('#resultCodes').innerText();
      const originalShare=await page.locator('#xShareButton').getAttribute('href');
      const share=new URL(originalShare);
      assert.equal(share.hostname,'x.com');
      assert.ok(share.searchParams.get('text').includes(resultData.codes.join(' / ')));
      const shareUrl=new URL(share.searchParams.get('url'));
      assert.equal(shareUrl.pathname,`/share/letters/${gender}/${resultData.codes.join('-')}/`);
      assert.equal(shareUrl.search,'');
      const sharedPage=await context.newPage();
      sharedPage.on('pageerror',error=>errors.push(error.message));
      await sharedPage.goto(new URL(shareUrl.pathname+shareUrl.search,site).href);
      assert.deepEqual(await sharedPage.locator('#shared-codes [data-code]').evaluateAll(nodes=>nodes.map(n=>n.dataset.code)),resultData.codes);
      assert.equal(await sharedPage.locator('#shared-types .letter-type').count(),resultData.codes.length);
      assert.equal(await sharedPage.locator('#shared-breakdown').innerText(),await page.locator('#resultBreakdown').innerText());
      assert.equal(await sharedPage.locator('.example-grid img').count(),resultData.codes.length*5);
      await sharedPage.goto(new URL(shareUrl.pathname+'?a=0&s=20&q=10',site).href);
      assert.equal(await sharedPage.locator('#shared-breakdown').innerText(),await page.locator('#resultBreakdown').innerText());
      await sharedPage.close();
      await page.screenshot({path:`/tmp/type-checker-letters-result-${gender}-${width}.png`,fullPage:true});
      await page.reload();await ready('result');
      assert.equal(await page.locator('#resultCodes').innerText(),codeText);
      assert.equal(await page.locator('#xShareButton').getAttribute('href'),originalShare);
      await page.goBack();await ready('top');await page.goForward();await ready('result');
      assert.equal(await page.locator('#resultCodes').innerText(),codeText);

      // 旧winnerIdを無視して再計算。最多同票のタイプだけを表示する。
      for(const [second,expected] of [['ACQ',['ASQ','ACQ']],['RCQ',['ASQ','RCQ']],['RCV',['ASQ','RCV']]]){
        await page.evaluate(({key,second})=>{
          const saved=JSON.parse(sessionStorage.getItem(key));
          const faces=saved.gender==='female'?FEMALE_FACE_ASSETS:MALE_FACE_ASSETS;
          const types=FACE_RESULT_TYPES[saved.gender];
          const faceFor=code=>faces.find(face=>face.type===types.find(type=>type.code===code).id).id;
          saved.chosenIds=[...Array(10).fill(faceFor('ASQ')),...Array(10).fill(faceFor(second))];
          saved.winnerId='old-random-winner';delete saved.scoringVersion;
          sessionStorage.setItem(key,JSON.stringify(saved));
        },{key:sessionKey,second});
        await page.reload();await ready('result');
        assert.deepEqual(await page.locator('#resultCodes [data-code]').evaluateAll(nodes=>nodes.map(n=>n.dataset.code)),expected);
        assert.equal(await page.locator('#resultTypes .letter-type').count(),expected.length);
        assert.equal(await page.locator('#resultExamples img').count(),expected.length*5);
        const tieShare=await page.locator('#xShareButton').getAttribute('href');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        if(second==='ACQ')await page.screenshot({path:`/tmp/type-checker-letters-tie-${gender}-${width}.png`,fullPage:true});
        await page.reload();await ready('result');
        assert.equal(await page.locator('#xShareButton').getAttribute('href'),tieShare);
      }
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
      console.log(`${gender} / ${width}px: 3画面・40枚一巡・異タイプ二択・21組目除外・タイプ別採点・同点・文字の意味・復元・共有・広告・保存エラー OK`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
