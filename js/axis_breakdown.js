// 結果コードに含まれる文字の意味だけを表示する。
const AxisBreakdown = {
  render(container, result) {
    container.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = '結果の文字の意味';
    container.append(heading);
    const options = window.FACE_TYPE_AXES.flatMap(axis => axis.options);
    result.codes.forEach(code => {
      const row = document.createElement('section');
      row.className = 'letter-meanings';
      row.dataset.code = code;
      const title = document.createElement('h3'); title.textContent = code;
      const list = document.createElement('dl');
      for (const letter of code) {
        const option = options.find(option => option.letter === letter);
        const item = document.createElement('div'); item.dataset.letter = letter;
        const term = document.createElement('dt'); term.textContent = letter;
        const meaning = document.createElement('dd'); meaning.textContent = option.label;
        item.append(term, meaning); list.append(item);
      }
      row.append(title, list); container.append(row);
    });
    container.hidden = false;
  }
};
