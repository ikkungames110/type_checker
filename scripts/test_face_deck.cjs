const assert = require('node:assert/strict');
const test = require('node:test');
const { FaceDeck } = require('../js/face_deck.js');
const faces = Array.from({ length: 40 }, (_, i) => ({ id: `face_${i + 1}`, type: `type_${Math.floor(i / 5)}`, asset_version: 'v8' }));
const rng = seed => () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const checkPair = pair => { assert.equal(pair.length, 2); assert.notEqual(pair[0].id, pair[1].id); assert.notEqual(pair[0].type, pair[1].type); };

for (const mode of ['next', 'skip', 'mixed']) {
  test(`${mode}: 最初の20組で40枚を一度ずつ表示し、同じタイプ同士を組まない`, () => {
    for (let seed = 1; seed <= 200; seed++) {
      const deck = new FaceDeck(faces, 20, rng(seed));
      const shown = new Set();
      for (let turn = 0; turn < 20; turn++) {
        const pair = turn === 0 || mode === 'next' || (mode === 'mixed' && turn % 3) ? deck.next() : deck.skip();
        checkPair(pair);
        for (const face of pair) { assert.ok(!shown.has(face.id)); shown.add(face.id); }
        assert.equal(deck.cycle, 1);
      }
      assert.equal(shown.size, 40);
      assert.equal(deck.shownPairs, 20);
    }
  });
}

test('1回目に除外しても一巡目は全員を見せ、21回目からその2タイプを出さない', () => {
  for (let seed = 1; seed <= 100; seed++) {
    const deck = new FaceDeck(faces, 20, rng(seed));
    const excluded = new Set(deck.next().map(f => f.type));
    deck.skip();
    while (deck.shownPairs < 20) deck.next();
    for (let cycle = 0; cycle < 3; cycle++) {
      const seen = new Set();
      for (let turn = 0; turn < 15; turn++) {
        const pair = deck.next(); checkPair(pair);
        for (const face of pair) { assert.ok(!excluded.has(face.type)); assert.ok(!seen.has(face.id)); seen.add(face.id); }
      }
      assert.equal(seen.size, 30);
    }
  }
});

test('6タイプの除外時は残る2タイプの10枚を一巡ごとに出す', () => {
  const deck = new FaceDeck(faces, 20, rng(42));
  for (let i = 0; i < 20; i++) {
    const pair = deck.next();
    if (pair.every(f => Number(f.type.slice(-1)) < 6)) pair.forEach(f => deck.rejectedTypes.add(f.type));
  }
  // 6種類という境界条件を固定して、追加出題を検証する。
  deck.rejectedTypes = new Set(Array.from({ length: 6 }, (_, i) => `type_${i}`));
  for (let cycle = 0; cycle < 3; cycle++) {
    const shown = new Set();
    for (let i = 0; i < 5; i++) {
      const pair = deck.next(); checkPair(pair);
      assert.deepEqual(new Set(pair.map(f => f.type)), new Set(['type_6', 'type_7']));
      pair.forEach(f => { assert.ok(!shown.has(f.id)); shown.add(f.id); });
    }
    assert.equal(shown.size, 10);
  }
});

test('除外がちょうど7タイプになった直後から全タイプを復帰させ、その後も解除を維持する', () => {
  const deck = new FaceDeck(faces, 20, rng(9));
  for (let i = 0; i < 20; i++) deck.next();
  deck.rejectedTypes = new Set(['type_0','type_1','type_2','type_3','type_4']);
  deck.next();
  assert.equal(deck.allTypes, false);
  const shown = new Set(deck.skip().map(f => f.id));
  assert.equal(deck.rejectedTypes.size, 7);
  assert.equal(deck.allTypes, true);
  for (let i = 1; i < 20; i++) deck.next().forEach(f => { assert.ok(!shown.has(f.id)); shown.add(f.id); });
  assert.equal(shown.size, 40);
  assert.equal(new Set([...shown].map(id => faces.find(f => f.id === id).type)).size, 8);
  for (let i = 0; i < 30; i++) { checkPair(deck.skip()); assert.equal(deck.allTypes, true); }
});

test('奇数の3タイプが残っても未表示の15枚を優先し、同タイプの二択や停止を起こさない', () => {
  for (let seed = 1; seed <= 100; seed++) {
    const deck = new FaceDeck(faces, 20, rng(seed));
    for (let i = 0; i < 20; i++) deck.next();
    deck.rejectedTypes = new Set(['type_0','type_1','type_2','type_3','type_4']);
    const seen = new Set();
    for (let i = 0; i < 8; i++) {
      const pair = deck.next(); checkPair(pair);
      pair.forEach(f => { assert.ok(!deck.rejectedTypes.has(f.type)); if (i < 7) assert.ok(!seen.has(f.id)); seen.add(f.id); });
    }
    assert.equal(seen.size, 15);
    for (let i = 0; i < 100; i++) checkPair(deck.next());
  }
});

test('途中保存から表示中の顔・一巡の残り・除外と解除を復元できる', () => {
  let deck = new FaceDeck(faces, 20, () => 0.5);
  deck.next();
  for (let i = 0; i < 100; i++) {
    const saved = JSON.parse(JSON.stringify(deck.snapshot()));
    const restored = FaceDeck.restore(faces, saved, 20, () => 0.5);
    assert.deepEqual(restored.snapshot(), saved);
    const op = i % 7 ? 'next' : 'skip';
    assert.deepEqual(restored[op](), deck[op]());
    deck = restored;
  }
});

test('壊れた保存状態・旧世代・同タイプの二択を復元しない', () => {
  const deck = new FaceDeck(faces); deck.next();
  for (const mutate of [
    s => { s.version = 1; }, s => { s.current = ['face_1','face_2']; },
    s => { s.current[0] = 'unknown'; }, s => { s.unseen.push(s.current[0]); },
    s => { s.rejectedTypes = ['unknown']; }, s => { s.allTypes = true; },
    s => { s.shownPairs = 0; }, s => { s.faceKeys.reverse(); }
  ]) { const saved = deck.snapshot(); mutate(saved); assert.throws(() => FaceDeck.restore(faces, saved), /無効/); }
  assert.throws(() => FaceDeck.restore(faces.map(f => ({ ...f, asset_version: 'v9' })), deck.snapshot()), /無効/);
});

test('40枚・8タイプ各5枚以外の入力を受け付けない', () => {
  for (const source of [[], faces.slice(0, 38), faces.map(f => ({ ...f, id: 'same' })), faces.map(f => ({ ...f, type: 'same' }))]) assert.throws(() => new FaceDeck(source));
});
