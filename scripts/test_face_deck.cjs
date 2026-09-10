const assert = require('node:assert/strict');
const test = require('node:test');
const { FaceDeck } = require('../js/face_deck.js');

const faces = count => Array.from({ length: count }, (_, i) => ({ id: `face_${i + 1}` }));
const ids = pair => pair.map(face => Number(face.id.split('_')[1]));
const unchangedOrder = () => 0.999999;

test('通常20問は1〜40枚目、スキップは41枚目以降から差し替える', () => {
  const source = faces(60);
  const deck = new FaceDeck(source, 20, unchangedOrder);
  assert.deepEqual(ids(deck.next()), [1, 2]);
  assert.deepEqual(ids(deck.skip()), [41, 42]);
  assert.deepEqual(ids(deck.next()), [3, 4]);
  assert.deepEqual(ids(deck.skip()), [43, 44]);
  assert.deepEqual(ids(deck.next()), [5, 6]);
  assert.deepEqual(ids(source.slice(0, 2)), [1, 2]);
});

test('20問目で10回差し替えて60枚を使い切り、11回目に全体を再シャッフルする', () => {
  const deck = new FaceDeck(faces(60), 20, unchangedOrder);
  const shown = [];
  for (let i = 0; i < 20; i += 1) shown.push(...ids(deck.next()));
  for (let i = 0; i < 10; i += 1) shown.push(...ids(deck.skip()));
  assert.equal(new Set(shown).size, 60);
  assert.equal(deck.cycle, 1);
  assert.deepEqual(ids(deck.skip()), [1, 2]);
  assert.equal(deck.cycle, 2);
});

test('序盤で11回スキップしても、残った未表示の顔を優先して重複しない', () => {
  const deck = new FaceDeck(faces(60), 20, unchangedOrder);
  const shown = [...ids(deck.next())];
  for (let i = 0; i < 10; i += 1) shown.push(...ids(deck.skip()));
  assert.deepEqual(shown.slice(-2), [59, 60]);
  shown.push(...ids(deck.skip()));
  assert.deepEqual(shown.slice(-2), [3, 4]);
  assert.equal(deck.cycle, 1);
  while (shown.length < 60) shown.push(...ids(deck.next()));
  assert.equal(new Set(shown).size, 60);
  deck.next();
  assert.equal(deck.cycle, 2);
});

test('40枚・60枚・少数の代替素材でも、選択とスキップを混ぜた各巡で重複しない', () => {
  for (const count of [6, 40, 60, 80]) {
    for (let seed = 1; seed <= 12; seed += 1) {
      let value = seed;
      const random = () => ((value = (Math.imul(value, 1664525) + 1013904223) >>> 0) / 2 ** 32);
      const deck = new FaceDeck(faces(count), 20, random);
      let seen = new Set(), cycle = 1;
      for (let turn = 0; turn < count * 3; turn += 1) {
        const pair = turn % 4 === 0 ? deck.next() : deck.skip();
        if (deck.cycle !== cycle) {
          assert.equal(seen.size, count);
          seen = new Set();
          cycle = deck.cycle;
        }
        for (const face of pair) {
          assert.ok(!seen.has(face.id), `${count}枚: 同じ巡で${face.id}が再表示`);
          seen.add(face.id);
        }
      }
    }
  }
});

test('不足・奇数・重複IDのデータは受け付けない', () => {
  for (const source of [[], faces(1), faces(3), [{ id:'same' }, { id:'same' }]]) {
    assert.throws(() => new FaceDeck(source), /偶数件/);
  }
});

test('保存・復元後も表示中の2枚と出題・差し替えの順序を引き継ぐ', () => {
  const source = faces(60);
  let deck = new FaceDeck(source, 20, unchangedOrder);
  deck.next();
  const shown = new Set(ids(deck.current));
  for (let turn = 0; turn < 29; turn += 1) {
    const saved = JSON.parse(JSON.stringify(deck.snapshot()));
    const restored = FaceDeck.restore(source, saved, 20, unchangedOrder);
    assert.deepEqual(restored.current, deck.current);
    assert.equal(restored.current[0], source.find(face => face.id === saved.current[0]));
    const operation = turn % 3 ? 'skip' : 'next';
    assert.deepEqual(restored[operation](), deck[operation]());
    for (const id of ids(restored.current)) {
      assert.ok(!shown.has(id));
      shown.add(id);
    }
    deck = restored;
  }
  assert.equal(shown.size, 60);
  deck = FaceDeck.restore(source, deck.snapshot(), 20, unchangedOrder);
  deck.next();
  assert.equal(deck.cycle, 2);
});

test('壊れた保存データ・異なる顔セットは復元しない', () => {
  const source = faces(60);
  const deck = new FaceDeck(source, 20, unchangedOrder);
  deck.next();
  for (const change of [
    saved => { saved.current = ['unknown', 'face_2']; },
    saved => { saved.normal[0] = saved.reserve[0]; },
    saved => { saved.unseen.push('face_1'); },
    saved => { saved.cycle = 0; },
    saved => { saved.questionCount = 10; },
    saved => { saved.faceIds.reverse(); }
  ]) {
    const saved = deck.snapshot();
    change(saved);
    assert.throws(() => FaceDeck.restore(source, saved), /無効/);
  }
  assert.throws(() => FaceDeck.restore(source, null), /無効/);
});
