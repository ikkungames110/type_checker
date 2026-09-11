// 3軸の両側を説明し、結果コードに含まれる側を強調する。
const AxisBreakdown = {
  render(container, result) {
    container.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = '結果の文字の意味';
    container.append(heading);
    result.codes.forEach(code => {
      const row = document.createElement('section');
      row.className = 'letter-meanings';
      row.dataset.code = code;
      const title = document.createElement('h3'); title.textContent = code;
      row.append(title);
      window.FACE_TYPE_AXES.forEach((axis, index) => {
        const name = document.createElement('h4'); name.textContent = axis.name;
        const list = document.createElement('dl');
        axis.options.forEach(option => {
          const selected = code[index] === option.letter;
          const item = document.createElement('div'); item.dataset.letter = option.letter;
          item.className = selected ? 'letter-option selected' : 'letter-option';
          const term = document.createElement('dt'); term.textContent = option.letter;
          const meaning = document.createElement('dd');
          const label = document.createElement('strong'); label.textContent = option.label;
          const description = document.createElement('p'); description.textContent = option.description;
          meaning.append(label, description);
          if (selected) {
            const badge = document.createElement('span'); badge.className = 'letter-selected-label';
            badge.textContent = 'あなたのタイプ'; term.append(badge);
          }
          item.append(term, meaning); list.append(item);
        });
        row.append(name, list);
      });
      container.append(row);
    });
    container.hidden = false;
  }
};
