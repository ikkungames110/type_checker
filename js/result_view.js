// 診断結果と顔の例、全タイプのキャラクター一覧を表示する。
const ResultView = {
  createCard(type, character, heading = 'h2', lazy = false) {
    const card = document.createElement('article');card.className = 'letter-type';card.dataset.code = type.code;
    const image = document.createElement('img');image.className = 'result-character';
    image.src = `${character.image}?v=${character.sha256.slice(0,12)}`;
    if (lazy) image.loading = 'lazy';
    image.width = 1254;image.height = 1254;image.alt = `${type.code}・${type.classification_label}タイプのキャラクター`;
    const summary = document.createElement('div');
    const code = document.createElement('div');code.className = 'type-code';code.textContent = type.code;
    const title = document.createElement(heading);title.className = 'result-title';title.textContent = type.label;
    const classification = document.createElement('p');classification.className = 'result-classification';classification.textContent = `(${type.classification_label}タイプ)`;
    const copy = document.createElement('p');copy.className = 'result-copy';copy.textContent = type.copy;
    summary.append(code,title,classification,copy);card.append(image,summary);return card;
  },
  renderCatalog(gender, characters) {
    const catalog = document.querySelector('#resultCatalog');
    catalog.replaceChildren();
    const otherGender = gender === 'female' ? 'male' : 'female';
    [gender,otherGender].forEach((target,index) => {
      const group = document.createElement(index ? 'details' : 'section');
      group.className = 'catalog-group';group.dataset.gender = target;
      const heading = document.createElement(index ? 'summary' : 'h3');
      const label = target === 'female' ? '女性' : '男性';
      heading.textContent = index ? `${label}の8タイプも見る` : `${label}の8タイプ`;
      const grid = document.createElement('div');grid.className = 'character-catalog-grid';
      window.FACE_RESULT_TYPES[target].forEach(type => {
        const character = characters.find(item => item.gender === target && item.type === type.id);
        grid.append(this.createCard(type,character,'h4',true));
      });
      group.append(heading,grid);catalog.append(group);
    });
  },
  render(result, gender, faces, characters) {
    const codes = document.querySelector('#resultCodes');
    codes.replaceChildren(...result.codes.flatMap((code, index) => {
      const label = document.createElement('span'); label.textContent = code; label.dataset.code = code;
      if (!index) return [label];
      const separator = document.createElement('i'); separator.className = 'code-separator'; separator.textContent = '/';
      return [separator,label];
    }));
    codes.classList.toggle('single',result.codes.length === 1);
    const tieNote = document.querySelector('#resultTieNote');
    tieNote.hidden = result.codes.length === 1;
    tieNote.textContent = `${result.codes.length}つのタイプに同じくらい惹かれています。`;
    const types = document.querySelector('#resultTypes');
    const examples = document.querySelector('#resultExamples');
    types.classList.toggle('multiple',result.codes.length > 1);
    types.replaceChildren(); examples.replaceChildren();
    result.winners.forEach((type,typeIndex) => {
      const presentation = TypePresentation.resolve(gender,type.id,faces,characters);
      types.append(this.createCard(type,presentation.character));
      const group = document.createElement(result.codes.length > 1 ? 'details' : 'div');group.className = 'example-group';group.dataset.code = type.code;
      if (result.codes.length > 1) {
        group.open = typeIndex === 0;
        const heading = document.createElement('summary');heading.textContent = `${type.code} · ${type.classification_label}の顔5枚`;group.append(heading);
      }
      const grid = document.createElement('div');grid.className = 'example-grid';
      presentation.examples.forEach((face,index) => {
        const figure = document.createElement('figure');const photo = document.createElement('img');
        photo.src = `${face.image}?v=${face.asset_version}`;photo.width = 1200;photo.height = 1600;photo.loading = 'lazy';photo.alt = `${type.code}・${type.classification_label}タイプの顔の例 ${index + 1}`;photo.dataset.faceId = face.id;
        figure.append(photo);grid.append(figure);
      });
      group.append(grid);examples.append(group);
    });
    AxisBreakdown.render(document.querySelector('#resultBreakdown'),result);
    this.renderCatalog(gender,characters);
  }
};
