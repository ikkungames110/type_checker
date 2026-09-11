const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { FaceScoring } = require('../js/face_scoring.js');
const context = {window:{}};
for(const file of ['result_types','type_axes','female_faces','male_faces']) vm.runInNewContext(fs.readFileSync(path.join(__dirname,`../data/${file}.js`),'utf8'),context);
const data = JSON.parse(JSON.stringify(context.window));
const axes = data.FACE_TYPE_AXES;
const codes = ['ASQ','ASV','ACQ','ACV','RSQ','RSV','RCQ','RCV'];
const types = data.FACE_RESULT_TYPES.female;
const faces = data.FEMALE_FACE_ASSETS;
const faceFor = code => faces.find(face => face.type === types.find(type => type.code === code).id).id;
const answers = entries => entries.flatMap(([code,count]) => Array(count).fill(faceFor(code)));
const rank = entries => FaceScoring.rank(faces,answers(entries),types,axes);

test('タイプごとに1票を加え、未選択タイプを結果にしない', () => {
 const r = rank([['ASQ',8],['ACV',6],['RCQ',6]]);
 assert.deepEqual(r.codes,['ASQ']); assert.equal(r.total,20);
 assert.equal(r.counts[types.find(t=>t.code==='ASQ').id],8);
 assert.equal(Object.values(r.counts).reduce((a,b)=>a+b,0),20);
 assert.equal(Object.keys(r.counts).length,8);
});
test('文字が異なる同票でも、実際に最多のタイプだけを表示する', () => {
 for (const second of ['ACQ','RCQ','RCV']) assert.deepEqual(rank([['ASQ',10],[second,10]]).codes,['ASQ',second]);
 assert.deepEqual(rank([['ASQ',6],['ACV',6],['RSQ',6],['RCV',2]]).codes,['ASQ','ACV','RSQ']);
 assert.deepEqual(rank(codes.map(code=>[code,2])).codes,codes);
});
test('僅差の最多タイプを選び、回答順で結果を変えない', () => {
 const chosen = answers([['ASQ',11],['RCV',9]]);
 const first = FaceScoring.rank(faces,chosen,types,axes);
 assert.deepEqual(first.codes,['ASQ']);
 assert.deepEqual(FaceScoring.rank(faces,[...chosen].reverse(),types,axes),first);
});
test('男女それぞれ8タイプに正しく加算する', () => {
 for (const gender of ['female','male']) {
  const records=data[gender==='female'?'FEMALE_FACE_ASSETS':'MALE_FACE_ASSETS'];
  const group=data.FACE_RESULT_TYPES[gender];
  for (const type of group) {
   const face=records.find(face=>face.type===type.id);
   const r=FaceScoring.rank(records,Array(20).fill(face.id),group,axes);
   assert.deepEqual(r.codes,[type.code]); assert.equal(r.counts[type.id],20);
  }
 }
});
test('不明な顔・空の回答・不正な型対応を拒否する', () => {
 assert.throws(()=>FaceScoring.rank(faces,['unknown'],types,axes),/不明/);
 assert.throws(()=>FaceScoring.rank(faces,[],types,axes),/ありません/);
 assert.throws(()=>FaceScoring.rank(faces,[faceFor('ASQ')],types.slice(1),axes),/対応/);
});
test('共有URLは最多タイプだけを含む', () => {
 assert.equal(FaceScoring.sharePath('female',rank([['ASQ',10],['RCV',10]])),'share/letters/female/ASQ-RCV/');
 assert.throws(()=>FaceScoring.sharePath('unknown',rank([['ASQ',20]])),/不正/);
});
