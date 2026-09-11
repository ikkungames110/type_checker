const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {resolve} = require('../js/type_presentation.js');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, '../data', name), 'utf8').split('=').slice(1).join('=').trim().replace(/;$/, ''));
const characters = read('type_characters.js');
const female = read('female_faces.js');
const male = read('male_faces.js');

test('男女の顔が混ざった入力でも、女性キュートは001〜005と専用キャラだけを表示する', () => {
  const faces = [...female, ...male].reverse();
  const before = faces.map(face => face.id);
  const result = resolve('female', 'cute', faces, characters);
  assert.equal(result.character.id, 'female_cute');
  assert.deepEqual(result.examples.map(face => face.id), ['female_001','female_002','female_003','female_004','female_005']);
  assert.deepEqual(faces.map(face => face.id), before);
});

test('男性の最後のタイプにも同じタイプの5人を揃える', () => {
  const result = resolve('male', 'cool_hard', [...female,...male], characters);
  assert.equal(result.character.id, 'male_cool_hard');
  assert.deepEqual(result.examples.map(face => face.id), ['male_036','male_037','male_038','male_039','male_040']);
});

test('キャラ欠落・重複・性別違いで、別タイプを代わりに表示しない', () => {
  assert.throws(() => resolve('female','cute',female,characters.filter(c=>c.id!=='female_cute')));
  assert.throws(() => resolve('female','cute',female,[...characters,characters[0]]));
  assert.throws(() => resolve('male','cute',[...female,...male],characters));
});

test('顔が足りない、または同じ画像IDが重複していたら検出する', () => {
  assert.throws(() => resolve('female','cute',female.slice(1),characters));
  const duplicate = [female[0],female[0],...female.slice(2)];
  assert.throws(() => resolve('female','cute',duplicate,characters));
});
