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
        await page.waitForURL(site.href);
        await page.waitForFunction(expected => document.body.dataset.page === expected, name);
        const expectedAdLoads = width < 800 ? 2 : 1;
        await page.waitForFunction(expected => window.__adLoads === expected, expectedAdLoads, { polling: 100 }).catch(async error => {
          console.error('広告の検証状態', await page.evaluate(() => ({ loads: window.__adLoads, ads: window.adsbyimobile, width: innerWidth, page: document.body.dataset.page })));
          throw error;
        });
        assert.equal(await page.locator('.screen.active').count(), 1);
        assert.equal(await page.locator('body').getAttribute('data-page'), name);
        const ad = await page.evaluate(() => window.adsbyimobile[0]);
        assert.equal(ad.asid, width >= 800 ? 1943673 : 1943443);
        if (width < 800) {
          const banner = page.locator('#im-7313d3409a394418ac40b004be47b9e3');
          // 配信サイズを再現して、ページ先頭・途中・末尾で固定位置と余白を確認する。
          await banner.evaluate(node => { node.style.height = '50px'; });
          await page.waitForFunction(() => getComputedStyle(document.body).paddingBottom === '100px');
          for (const position of [0, 0.5, 1]) {
            const geometry = await banner.evaluate((node, position) => {
              window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * position);
              const fixed = node.parentElement;
              const box = fixed.getBoundingClientRect();
              return { bottom: box.bottom, left: box.left, width: box.width, viewportWidth: innerWidth,
                viewportHeight: innerHeight, position: getComputedStyle(fixed).position };
            }, position);
            assert.equal(geometry.position, 'fixed');
            assert.equal(geometry.bottom, geometry.viewportHeight);
            assert.equal(geometry.left, 0);
            assert.equal(geometry.width, geometry.viewportWidth);
          }
          assert.deepEqual(await page.evaluate(() => window.adsbyimobile.map(ad => ad.asid)), [1943443, 1944283]);
          const upper = page.locator('#im-0188de672a6d45f9866ae278a4d4ef39');
          await upper.evaluate(node => { node.style.height = '70px'; });
          await page.waitForFunction(() => getComputedStyle(document.body).paddingBottom === '120px');
          const upperBox = await upper.boundingBox();
          const lowerBox = await banner.boundingBox();
          assert.equal(upperBox.y + upperBox.height, lowerBox.y);
          await upper.evaluate(node => { node.style.height = '50px'; });
          await page.waitForFunction(() => getComputedStyle(document.body).paddingBottom === '100px');
          await page.evaluate(() => window.scrollTo(0, 0));
          assert.equal(await page.locator('.ad-placement').isVisible(), false);
        } else {
          assert.equal(await page.locator('#fixedAds').isVisible(), false);
        }
        assert.equal(await page.locator('#resultRectangleAd').count(), 0);
        return page.evaluate(() => window.__documentId);
      };
      const shownFirstCycle = new Set();
      let observedPairs = 0;
      let rejectedTypes = new Set();
      const inspectPair = async () => {
        const saved = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), sessionKey);
        const records = await page.evaluate(g => [...(g === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS), ...window.ADDITIONAL_FACE_ASSETS[g]], gender);
        const current = saved.deck.current.map(id => records.find(face => face.id === id));
        assert.notEqual(current[0].type, current[1].type);
        assert.equal(await page.locator('#duel img').evaluateAll(imgs => imgs.every(img => Math.abs(img.clientWidth / img.clientHeight - 0.75) < 0.01)), true);
        assert.equal(saved.deck.shownPairs, ++observedPairs);
        if (observedPairs <= 20) {
          current.forEach(face => { assert.ok(Number(face.id.slice(-3)) <= 40); assert.ok(!shownFirstCycle.has(face.id)); shownFirstCycle.add(face.id); });
          if (observedPairs === 20) assert.equal(shownFirstCycle.size, 40);
        } else {
          current.forEach(face => { assert.ok(Number(face.id.slice(-3)) > 40); assert.ok(!rejectedTypes.has(face.type)); });
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
      assert.equal(await page.locator('#sampleA img').getAttribute('src'), 'assets/female/female_011.png');
      assert.equal(await page.locator('#sampleB img').getAttribute('src'), 'assets/male/male_011.png');
      await page.locator('#sampleA img').evaluate(img => img.decode());
      await page.screenshot({ path: `/tmp/type-checker-v8-top-${width}.png` });
      await page.locator(`.gender-btn[data-gender="${gender}"]`).click();
      const quizDocument = await ready('quiz');
      assert.equal(quizDocument, topDocument);
      assert.equal(await page.locator('#roundLabel').innerText(), '0 / 20');
      const firstPair = await pair();
      rejectedTypes = new Set((await inspectPair()).map(face => face.type));
      await page.locator('#skipButton').click();
      assert.notDeepEqual(await pair(), firstPair);
      await inspectPair();
      assert.equal(await page.locator('#roundLabel').innerText(), '0 / 20');
      for (let i = 0; i < 5; i += 1) { await page.locator(i % 2 ? '#rightCard' : '#leftCard').click(); await inspectPair(); }
      assert.equal(await page.evaluate(() => window.__documentId), quizDocument);
      assert.equal(await page.evaluate(() => window.__adLoads), width < 800 ? 2 : 1);
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
      assert.equal(await page.evaluate(() => window.__documentId), beforeCacheRestore);
      await ready('quiz');
      assert.equal(await page.locator('#roundLabel').innerText(), '5 / 20');
      assert.deepEqual(await pair(), savedPair);

      // 未完了で結果URLを開いた場合は、進行中の診断へ戻す。
      await page.goto(routeUrl('result'));
      let resumedDocument = await ready('quiz');
      assert.equal(await page.locator('#roundLabel').innerText(), '5 / 20');
      for (let i = 5; i < 19; i += 1) { await page.locator(i % 2 ? '#rightCard' : '#leftCard').click(); await inspectPair(); }
      assert.equal(observedPairs, 21);
      const finalPair = await pair();
      const additionalSaved = await page.evaluate(key => sessionStorage.getItem(key), sessionKey);
      await page.reload(); resumedDocument = await ready('quiz');
      assert.deepEqual(await pair(), finalPair);
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), sessionKey), additionalSaved);
      await page.evaluate(() => {
        window.__originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = () => { throw new Error('Storage disabled'); };
      });
      await page.locator('#rightCard').click();
      assert.equal(page.url(), site.href);
      assert.equal(await page.locator('#roundLabel').innerText(), '19 / 20');
      assert.deepEqual(await pair(), finalPair);
      assert.equal(await page.locator('#sessionError').isVisible(), true);
      await page.evaluate(() => { Storage.prototype.setItem = window.__originalSetItem; });
      await page.locator('#rightCard').click();
      assert.equal(await ready('result'), resumedDocument);
      const resultData = await page.evaluate(key => {
        const saved = JSON.parse(sessionStorage.getItem(key));
        const originals = saved.gender === 'female' ? window.FEMALE_FACE_ASSETS : window.MALE_FACE_ASSETS;
        const records = [...originals, ...window.ADDITIONAL_FACE_ASSETS[saved.gender]];
        const types = window.FACE_RESULT_TYPES[saved.gender];
        const byId = new Map(records.map(face => [face.id, face]));
        const counts = Object.fromEntries(types.map(type=>[type.code,0]));
        saved.chosenIds.forEach(id=>{counts[types.find(type=>type.id===byId.get(id).type).code]++;});
        const candidates=['ASQ','ASV','ACQ','ACV','RSQ','RSV','RCQ','RCV'].filter(code=>counts[code]===Math.max(...Object.values(counts)));
        const codes=[saved.selectedCode];
        if (!candidates.includes(saved.selectedCode)) throw new Error('結果が最多タイプに含まれません');
        return {codes,counts,total:saved.chosenIds.length,types:codes.map(code=>{
          const type=types.find(type=>type.code===code);
          return {...type,character:window.FACE_CHARACTERS.find(c=>c.gender===saved.gender&&c.type===type.id),examples:originals.filter(face=>face.type===type.id).map(face=>face.id).sort()};
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
        assert.deepEqual(await page.locator(`#resultBreakdown [data-code="${code}"] .selected[data-letter]`).evaluateAll(nodes=>nodes.map(n=>n.dataset.letter)),[...code]);
      }
      assert.equal(await page.locator('#resultBreakdown [data-letter]').count(),resultData.codes.length*6);
      const meanings={A:'軽やか',R:'落ち着き',S:'柔らか',C:'凛と',Q:'さりげなさ',V:'華やか'};
      for(const code of resultData.codes) for(const letter of code){
        assert.equal(await page.locator(`#resultBreakdown [data-code="${code}"] [data-letter="${letter}"] dd strong`).innerText(),meanings[letter]);
      }
      assert.doesNotMatch(await page.locator('#resultBreakdown').innerText(), /%|回|票/);
      assert.doesNotMatch(await page.locator('#resultScreen').innerText(), /ランダム|抽選|同率|同点/);
      const axisPairs=await page.locator('#resultBreakdown dl').evaluateAll(lists=>lists.map(list=>[...list.children].map(item=>({letter:item.dataset.letter,description:item.querySelector('dd p').textContent,selected:item.classList.contains('selected'),x:item.getBoundingClientRect().x,y:item.getBoundingClientRect().y}))));
      assert.deepEqual(axisPairs.map(pair=>pair.map(item=>item.letter)),[['A','R'],['S','C'],['Q','V']]);
      for(const pair of axisPairs){
        assert.equal(pair.filter(item=>item.selected).length,1);
        assert.ok(pair.every(item=>item.description.length>30));
        assert.equal(pair[0].y,pair[1].y);
        assert.ok(pair[0].x<pair[1].x);
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const catalog = page.locator('#resultCatalog');
      assert.equal(await catalog.locator('.letter-type').count(),16);
      assert.equal(await catalog.locator('.catalog-group').first().getAttribute('data-gender'),gender);
      for (const target of ['female','male']) {
        const group = catalog.locator(`[data-gender="${target}"]`);
        if (target !== gender) await group.locator('summary').click();
        const expected = await page.evaluate(target => FACE_RESULT_TYPES[target].map(type => ({
          ...type, image: FACE_CHARACTERS.find(c => c.gender === target && c.type === type.id).image
        })), target);
        assert.equal(await group.locator('.letter-type').count(),8);
        for (const type of expected) {
          const card = group.locator(`[data-code="${type.code}"]`);
          assert.equal(await card.isVisible(),true);
          assert.equal(await card.locator('h4').innerText(),type.label);
          assert.equal(await card.locator('.result-classification').innerText(),`(${type.classification_label}タイプ)`);
          assert.ok((await card.locator('img').getAttribute('src')).startsWith(type.image+'?v='));
          await card.scrollIntoViewIfNeeded();
          await card.locator('img').evaluate(img => img.decode());
        }
        if (target !== gender) await group.locator('summary').click();
      }
      await page.locator('.character-catalog').screenshot({path:`/tmp/type-checker-catalog-${gender}-${width}.png`});
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
      await sharedPage.waitForURL(site.href);
      assert.equal(await sharedPage.locator('#startScreen').isVisible(),true);
      await sharedPage.goto(new URL(shareUrl.pathname+'?a=0&s=20&q=10',site).href);
      await sharedPage.waitForURL(site.href);
      assert.equal(await sharedPage.locator('#startScreen').isVisible(),true);
      await sharedPage.close();
      await page.screenshot({path:`/tmp/type-checker-letters-result-${gender}-${width}.png`,fullPage:true});
      await page.reload();await ready('result');
      assert.equal(await page.locator('#resultCodes').innerText(),codeText);
      assert.equal(await page.locator('#xShareButton').getAttribute('href'),originalShare);
      assert.equal(await page.evaluate(() => {
        const share = document.querySelector('#xShareButton');
        const details = document.querySelector('.result-share .result-details');
        return !!details && Boolean(share.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING);
      }), true);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: text => { window.__copiedResult = text; return Promise.resolve(); } }
        });
      });
      await page.locator('#shareButton').click();
      assert.match(await page.evaluate(() => window.__copiedResult), /\n#好みの顔タイプ診断$/);
      await page.goto(new URL('404.html', site).href);
      await page.goBack(); await ready('result');
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
        const displayed=await page.locator('#resultCodes [data-code]').evaluateAll(nodes=>nodes.map(n=>n.dataset.code));
        assert.equal(displayed.length,1);
        assert.ok(expected.includes(displayed[0]));
        assert.equal(await page.locator('#resultTypes .letter-type').count(),1);
        assert.equal(await page.locator('#resultExamples img').count(),5);
        const tieShare=await page.locator('#xShareButton').getAttribute('href');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        if(second==='ACQ')await page.screenshot({path:`/tmp/type-checker-letters-tie-${gender}-${width}.png`,fullPage:true});
        await page.reload();await ready('result');
        assert.equal(await page.locator('#xShareButton').getAttribute('href'),tieShare);
      }
      const beforeRestart = await page.evaluate(() => window.__documentId);
      const restartDocuments = [];
      let restartAdRequests = 0;
      const recordRestart = request => {
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) restartDocuments.push(request.url());
        if (new URL(request.url()).hostname === 'imp-adedge.i-mobile.co.jp') restartAdRequests++;
      };
      page.on('request', recordRestart);
      await page.locator('#restartButton').click();
      assert.notEqual(await ready('top'), beforeRestart);
      page.off('request', recordRestart);
      assert.deepEqual(restartDocuments, [routeUrl('restart'), site.href]);
      // 同じURLのスクリプト取得はブラウザーがまとめる場合がある。各枠の実行回数はreadyで確認する。
      assert.ok(restartAdRequests >= 1);
      // 全ページ撮影時の一時的なviewport変更で広告の幅切り替えを発火させない。
      await page.screenshot({path:`/tmp/type-checker-ad-${width}.png`});
      await ready('top');
      assert.equal(await page.evaluate(key => sessionStorage.getItem(key), sessionKey), null);
      // スキップなしなら既存40人だけで20回答に到達し、追加画像は読み込まない。
      const requestedAdditions = [];
      const recordAddition = request => {
        if (request.url().includes('/assets/previews/v8-additions/')) requestedAdditions.push(request.url());
      };
      page.on('request', recordAddition);
      await page.locator(`.gender-btn[data-gender="${gender}"]`).click();
      await ready('quiz');
      const originalIds = new Set();
      for (let i = 0; i < 20; i++) {
        const saved = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), sessionKey);
        assert.equal(saved.deck.shownPairs, i + 1);
        saved.deck.current.forEach(id => { assert.ok(Number(id.slice(-3)) <= 40); assert.ok(!originalIds.has(id)); originalIds.add(id); });
        await page.locator('#leftCard').click();
      }
      await ready('result');
      assert.equal(originalIds.size, 40);
      assert.deepEqual(requestedAdditions, []);
      page.off('request', recordAddition);

      // 旧保存形式の21組目からも回答を失わず移行し、次の再読み込みでペアを変えない。
      const legacyChoices = await page.evaluate(key => {
        const saved = JSON.parse(sessionStorage.getItem(key));
        saved.selectedCount = 19; saved.chosenIds = saved.chosenIds.slice(0, 19);
        saved.deck.version = 2; delete saved.deck.additionalFaceKeys;
        saved.deck.shownPairs = 21; saved.deck.cycle = 2;
        const records = saved.gender === 'female' ? FEMALE_FACE_ASSETS : MALE_FACE_ASSETS;
        const currentTypes = saved.deck.current.map(id => records.find(f => f.id === id).type);
        saved.deck.rejectedTypes = FACE_RESULT_TYPES[saved.gender].map(t => t.id).filter(t => !currentTypes.includes(t)).slice(0, 2);
        sessionStorage.setItem(key, JSON.stringify(saved));
        return saved.chosenIds;
      }, sessionKey);
      await page.reload(); await ready('quiz');
      const migrated = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), sessionKey);
      assert.equal(migrated.deck.version, 3);
      assert.equal(migrated.deck.shownPairs, 21);
      assert.deepEqual(migrated.chosenIds, legacyChoices);
      migrated.deck.current.forEach(id => assert.ok(Number(id.slice(-3)) > 40));
      const migratedPair = await pair();
      await page.reload(); await ready('quiz');
      assert.deepEqual(await pair(), migratedPair);
      await page.locator('#leftCard').click(); await ready('result');
      assert.equal(await page.locator('#resultExamples img').count(), 5);
      await page.locator('#restartButton').click(); await ready('top');
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
      assert.equal(page.url(), site.href);
      assert.equal(await page.locator('#sessionError').isVisible(), true);
      // 幅の変更でも同じ枠を二重に読み込まず、PCでは固定広告用の余白を外す。
      await page.setViewportSize({ width: width < 800 ? 1280 : 390, height: 900 });
      await page.waitForFunction(() => window.__adLoads === 3);
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(expected => document.querySelector('#fixedAds').hidden === expected, width >= 800);
      assert.equal(await page.evaluate(() => window.__adLoads), 3);
      assert.equal(await page.evaluate(() => new Set(window.adsbyimobile.map(ad => ad.elementid)).size), 3);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`${gender} / ${width}px: 3画面・40枚一巡・異タイプ二択・21組目から追加写真・除外・タイプ別採点・同点・文字の意味・復元・共有・広告・保存エラー OK`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
