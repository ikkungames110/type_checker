// 比較用HTMLから20枚を書き出す。診断・本番OGPは変更しない。
// 実行: node scripts/render_card_lab.cjs
const { chromium } = require('playwright');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');

async function main() {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'docs/card-lab-assets/cards');
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
    const base = pathToFileURL(path.join(root,'docs/card-lab.html'));
    const manifest = [];
    for(let i=1;i<=10;i++) {
      const id = String(i).padStart(2,'0');
      for(const variant of ['none','photo']) {
        const url = new URL(base);url.searchParams.set('render',id);url.searchParams.set('variant',variant);
        await page.goto(url.href);
        await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
        const filename = `${id}-${variant}.png`;
        await page.locator('.card').screenshot({path:path.join(output,filename)});
        manifest.push({id,variant,file:`cards/${filename}`,width:1200,height:630});
      }
    }
    await writeFile(path.join(output,'../manifest.json'),JSON.stringify({date:'2026-09-11',source:'docs/card-lab.html',cards:manifest},null,2)+'\n');
    execFileSync('python3', ['-c',
      'from pathlib import Path; import sys, zipfile\np=Path(sys.argv[1])\nwith zipfile.ZipFile(p.parent / "cards.zip", "w", zipfile.ZIP_DEFLATED) as z:\n for f in sorted(p.glob("*.png")): z.write(f, f.name)', output
    ]);
    console.log('比較用カード20枚を書き出しました: docs/card-lab-assets/cards/');
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
