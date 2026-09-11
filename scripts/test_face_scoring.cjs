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

test('ASQを選ぶとA・S・Qに各1点、各軸の割合が100%になる',()=>{
 const r=rank([['ASQ',20]]);assert.deepEqual(r.codes,['ASQ']);assert.equal(r.total,20);
 assert.deepEqual(r.axes.map(a=>a.options.map(o=>[o.letter,o.count,o.percentage])),[[['A',20,100],['R',0,0]],[['S',20,100],['C',0,0]],[['Q',20,100],['V',0,0]]]);
});
test('最多タイプではなく各文字の多数決を使い、未選択タイプも結果になる',()=>{
 const r=rank([['ASQ',8],['ACV',6],['RCQ',6]]);assert.deepEqual(r.codes,['ACQ']);assert.equal(r.winners[0].id,'fresh');
 assert.deepEqual(r.axes.map(a=>a.options.map(o=>o.count)),[[14,6],[8,12],[14,6]]);
 assert.deepEqual(r.axes.map(a=>a.options.map(o=>o.percentage)),[[70,30],[40,60],[70,30]]);
});
test('1軸同点ならASQとACQの2タイプを表示する',()=>{
 const r=rank([['ASQ',10],['ACQ',10]]);assert.deepEqual(r.codes,['ASQ','ACQ']);assert.deepEqual(r.axes[1].leaders,['S','C']);
});
test('2軸同点なら4タイプ、3軸同点なら8タイプを全て表示する',()=>{
 assert.deepEqual(rank([['ASQ',10],['RCQ',10]]).codes,['ASQ','ACQ','RSQ','RCQ']);
 assert.deepEqual(rank([['ASQ',10],['RCV',10]]).codes,codes);
});
test('回答順と乱数によって同点結果が変わらない',()=>{
 const chosen=answers([['ASQ',10],['RCV',10]]);
 const first=FaceScoring.rank(faces,chosen,types,axes);
 assert.deepEqual(FaceScoring.rank(faces,[...chosen].reverse(),types,axes),first);
 assert.deepEqual(chosen,answers([['ASQ',10],['RCV',10]]));
});
test('男女8タイプのすべてが同じコード規則に対応する',()=>{
 for(const gender of ['female','male']){
  const records=data[gender==='female'?'FEMALE_FACE_ASSETS':'MALE_FACE_ASSETS'];const group=data.FACE_RESULT_TYPES[gender];
  for(const type of group){const face=records.find(face=>face.type===type.id);const result=FaceScoring.rank(records,Array(20).fill(face.id),group,axes);assert.deepEqual(result.codes,[type.code]);assert.equal(result.winners[0].id,type.id);}
 }
});
test('僅差でも多数の文字を選び、比率は各軸で100%になる',()=>{
 const r=rank([['ASQ',11],['RCV',9]]);assert.deepEqual(r.codes,['ASQ']);
 r.axes.forEach(a=>{assert.deepEqual(a.options.map(o=>o.percentage),[55,45]);assert.equal(a.options.reduce((sum,o)=>sum+o.count,0),20);});
});
test('不明な顔・空の回答・不正な型対応や得点は拒否する',()=>{
 assert.throws(()=>FaceScoring.rank(faces,['unknown'],types,axes),/不明/);
 assert.throws(()=>FaceScoring.rank(faces,[],types,axes),/ありません/);
 assert.throws(()=>FaceScoring.rank(faces,[faceFor('ASQ')],types.slice(1),axes),/対応/);
 assert.throws(()=>FaceScoring.fromCounts({A:10,R:10,S:5,C:5,Q:20,V:0},types,axes),/合計/);
 assert.throws(()=>FaceScoring.fromCounts({A:10,R:10,S:-1,C:21,Q:20,V:0},types,axes),/得点/);
});
test('共有URLは同点コードと票数を復元し、型と矛盾する値を表示しない',()=>{
 const r=rank([['ASQ',10],['ACQ',10]]);assert.equal(FaceScoring.sharePath('female',r),'share/letters/female/ASQ-ACQ/');
 const query=FaceScoring.shareQuery(r);assert.equal(query,'a=20&s=10&q=20');
 assert.deepEqual(FaceScoring.readSharedCounts(query,types,axes,r.codes),r);
 for(const query of ['', 'a=20&s=10&q=21','a=-1&s=10&q=20','a=20&s=10.5&q=20','a=20&s=11&q=20','a=20&a=10&s=10&q=20','a=20&s=10&q=NaN'])assert.equal(FaceScoring.readSharedCounts(query,types,axes,r.codes),null);
});
