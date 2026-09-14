// 起動済みの静的サーバーで160枚の比較ページを確認する。
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');

const base = process.env.SITE_URL || 'http://127.0.0.1:8000/';
const url = new URL('docs/face-types-additions.html', base).href;
const screenshotDir = process.env.GALLERY_SCREENSHOTS || '/tmp/type-checker-additions-review';

(async () => {
  const browser = await chromium.launch({ headless: true });
  fs.mkdirSync(screenshotDir, { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1200 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(url);
    const figures = page.locator('.type-group:not([hidden]) .cohort:not([hidden]) figure');
    const loaded = async () => {
      await figures.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.querySelectorAll('.type-group:not([hidden]) .cohort:not([hidden]) img')].every(image => image.complete && image.naturalWidth === 1200 && image.naturalHeight === 1600));
      await figures.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    };
    assert.equal(await figures.count(), 160);
    assert.equal(await page.locator('.type-group').count(), 16);
    assert.equal(new Set(await page.locator('figure').evaluateAll(items => items.map(item => item.dataset.id))).size, 160);
    const typeKeys = await page.locator('#type-filter option').evaluateAll(options => options.map(option => option.value).filter(value => value !== 'all'));
    for (const key of typeKeys) {
      await page.selectOption('#type-filter', key);
      assert.equal(await figures.count(), 10);
      assert.equal(await page.locator('.type-group:not([hidden]) [data-source="current"] figure').count(), 5);
      assert.equal(await page.locator('.type-group:not([hidden]) [data-source="addition"] figure').count(), 5);
      await loaded();
      await page.locator('.type-group:not([hidden])').screenshot({ path: `${screenshotDir}/${key.replace(':', '-')}.png` });
    }
    await page.selectOption('#source-filter', 'addition');
    assert.equal(await figures.count(), 5);
    await page.locator('.type-group:not([hidden]) [data-source="addition"] .portrait').first().click();
    assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), true);
    const original = await page.locator('#original-link').getAttribute('href');
    await page.keyboard.press('ArrowRight');
    assert.notEqual(await page.locator('#original-link').getAttribute('href'), original);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#original-link').getAttribute('href'), original);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(dialog => dialog.open), false);
    await page.click('button[data-gender="female"]');
    assert.equal(await figures.count(), 40);
    assert.equal(await page.locator('#type-filter option').count(), 9);
    await page.selectOption('#source-filter', 'current');
    assert.equal(await figures.count(), 40);
    await page.click('button[data-gender="male"]');
    assert.equal(await figures.count(), 40);
    await page.selectOption('#source-filter', 'all');
    assert.equal(await figures.count(), 80);
    await page.click('button[data-gender="all"]');
    assert.equal(await figures.count(), 160);
    for (const width of [1600, 900, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.selectOption('#type-filter', 'female:cute');
      await loaded();
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.screenshot({ path: `${screenshotDir}/page-${width}.png`, fullPage: true });
      await page.check('#face-crop');
      assert.equal(await page.locator('body').evaluate(body => body.classList.contains('face-crop')), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.uncheck('#face-crop');
    }
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => sessionStorage.length), 0);
    await context.close();
    const staticContext = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(url);
    assert.equal(await staticPage.locator('figure').count(), 160);
    assert.equal(await staticPage.locator('#gallery-controls').isHidden(), true);
    assert.equal(await staticPage.locator('.portrait').first().getAttribute('href'), '../assets/female/female_001.png');
    await staticContext.close();
    console.log('比較ページOK: 160枚・16タイプ・既存/追加・全画像読込・絞り込み・拡大/矢印/Escape・3画面幅・JavaScriptなし');
    console.log(`目視確認用スクリーンショット: ${screenshotDir}`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
