const assert = require('node:assert/strict');
const test = require('node:test');
const { FaceScoring } = require('../js/face_scoring.js');
const types = ['sweet','fresh','cool'].map(id => ({ id, label: id, copy: id }));
const faces = [{id:'a',type:'sweet'},{id:'b',type:'fresh'},{id:'c',type:'cool'},{id:'d',type:'sweet'}];

test('所属タイプへの整数票だけで結果を決め、最多タイプ内の選んだ写真を使う', () => {
  const {scores,winner,portrait} = FaceScoring.rank(faces, ['a','d','a','b','c'], types, {
    random: () => { throw new Error('単独1位で抽選してはいけない'); }
  });
  assert.deepEqual(scores.map(s => [s.id,s.value]), [['sweet',3],['fresh',1],['cool',1]]);
  assert.equal(winner.id, 'sweet');
  assert.equal(portrait.id, 'a');
  assert.equal(scores.reduce((sum,s) => sum+s.value,0),5);
});
test('同率1位だけを等確率の区間で抽選し、選んだ写真とタイプを一致させる', () => {
  for (const [random, expected] of [[0,'sweet'],[0.4999,'sweet'],[0.5,'fresh'],[0.9999,'fresh']]) {
    const result = FaceScoring.rank(faces,['a','b'],types,{random: () => random});
    assert.equal(result.winner.id, expected);
    assert.equal(result.portrait.type, expected);
  }
  for (const [random, expected] of [[0,'sweet'],[0.34,'fresh'],[0.67,'cool']]) {
    assert.equal(FaceScoring.rank(faces,['c','a','b'],types,{random: () => random}).winner.id, expected);
  }
});
test('保存済みの同率1位は再抽選せず、1位以外の保存値は採用しない', () => {
  assert.equal(FaceScoring.rank(faces,['a','b'],types,{
    winnerId: 'sweet', random: () => { throw new Error('再抽選してはいけない'); }
  }).winner.id,'sweet');
  assert.equal(FaceScoring.rank(faces,['a','b'],types,{winnerId:'cool',random:()=>0.99}).winner.id,'fresh');
});
test('同タイプの写真が同数なら最後の選択で決める', () => {
  assert.equal(FaceScoring.rank(faces,['a','d'],types).portrait.id,'d');
});
test('不明な顔は採点しない', () => assert.throws(() => FaceScoring.rank(faces,['unknown'],types), /不明/));
