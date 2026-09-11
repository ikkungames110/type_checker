// 旧共有URLの得点クエリは使わず、ページの結果コードの意味を表示する。
(() => {
  const codes = document.body.dataset.codes.split('-');
  AxisBreakdown.render(document.getElementById('shared-breakdown'), { codes });
})();
