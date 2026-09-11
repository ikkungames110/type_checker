// 共有URLの票数が、この静的ページの結果コードと一致するときだけ割合を表示する。
(() => {
  const gender = document.body.dataset.gender;
  const codes = document.body.dataset.codes.split('-');
  const result = FaceScoring.readSharedCounts(location.search, window.FACE_RESULT_TYPES[gender], window.FACE_TYPE_AXES, codes);
  if (!result) return;
  document.getElementById('shared-kind').textContent = `シェアされた診断結果 · ${gender === 'female' ? '女性' : '男性'}の顔`;
  AxisBreakdown.render(document.getElementById('shared-breakdown'), result);
})();
