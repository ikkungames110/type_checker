// 診断結果と共有先で共用する割合表示。投票数の合計は各軸で回答数と等しい。
const AxisBreakdown = {
  render(container, result) {
    container.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = 'あなたの「好き」の内訳';
    const intro = document.createElement('p');
    intro.className = 'axis-intro';
    intro.textContent = `${result.total}回の選択を、3つの軸で見てみました。`;
    container.append(heading, intro);
    result.axes.forEach(axis => {
      const row = document.createElement('section');
      row.className = 'axis-row';
      row.dataset.axis = axis.id;
      const title = document.createElement('h3');title.textContent = axis.name;
      const labels = document.createElement('div');labels.className = 'axis-labels';
      const bar = document.createElement('div');bar.className = 'axis-bar';bar.setAttribute('aria-hidden','true');
      axis.options.forEach((option,index) => {
        const label = document.createElement('div');label.className = 'axis-option';label.dataset.letter = option.letter;label.dataset.count = option.count;
        const letter = document.createElement('b');letter.textContent = option.letter;
        const name = document.createElement('span');name.textContent = option.label;
        const percent = document.createElement('strong');percent.textContent = `${Math.round(option.percentage * 10) / 10}%`;
        const count = document.createElement('small');count.textContent = `${option.count} / ${result.total}票`;
        label.append(letter,name,percent,count);labels.append(label);
        const segment = document.createElement('span');segment.className = index === 0 ? 'axis-left' : 'axis-right';segment.style.width = `${option.percentage}%`;bar.append(segment);
      });
      row.append(title,labels,bar);
      if (axis.leaders.length > 1) {const tie = document.createElement('p');tie.className = 'axis-tie';tie.textContent = `${axis.leaders.join('・')}は同じ割合です。`;row.append(tie);}
      container.append(row);
    });
    const note = document.createElement('p');note.className = 'axis-note';note.textContent = '1枚選ぶたびに、その顔の3文字へ1票ずつ。各軸で多かった文字を組み合わせ、同点の文字は両方を結果に残しています。';container.append(note);
    container.hidden = false;
  }
};
