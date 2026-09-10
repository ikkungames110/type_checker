const assert = require('node:assert/strict');
const test = require('node:test');
const { FaceScoring } = require('../js/face_scoring.js');
const types = ['sweet','fresh','cool'].map(id => ({ id, label: id, copy: id }));
const faces = [{id:'a',type:'sweet'},{id:'b',type:'fresh'},{id:'c',type:'cool'},{id:'d',type:'sweet'}];

test('所属タイプへの整数票だけで結果を決め、最多タイプ内の選んだ写真を使う', () => {
  const {scores,portrait} = FaceScoring.rank(faces, ['a','d','a','b','c'], types);
  assert.deepEqual(scores.map(s => [s.id,s.value]), [['sweet',3],['cool',1],['fresh',1]]);
  assert.equal(portrait.id, 'a');
  assert.equal(scores.reduce((sum,s) => sum+s.value,0),5);
});
test('同票は最後に選んだタイプ、同タイプの写真も最後の選択で決める', () => {
  assert.equal(FaceScoring.rank(faces,['a','b'],types).scores[0].id,'fresh');
  assert.equal(FaceScoring.rank(faces,['a','d'],types).portrait.id,'d');
});
test('不明な顔は採点しない', () => assert.throws(() => FaceScoring.rank(faces,['unknown'],types), /不明/));
