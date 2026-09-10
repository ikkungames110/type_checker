/* 比較用ギャラリー。本番の診断・特徴量スコアとは独立した試作。 */
(() => {
  'use strict';
  const { records } = window.FACE_TYPE_PREVIEW_V7;
  const dialog = document.getElementById('portrait-dialog');
  const showLabels = document.getElementById('show-labels');
  let selectedGender = 'all';
  let activeRecord = null;
  const visibleRecords = () => records.filter(record => selectedGender === 'all' || record.gender === selectedGender);
  const imageUrl = record => `../${record.image}`;
  const portraitName = record => showLabels.checked ? `${record.label}（${record.id}）` : record.id;

  function updateDetail(record) {
    activeRecord = record;
    document.getElementById('detail-title').textContent = portraitName(record);
    const image = document.getElementById('detail-image');
    image.src = imageUrl(record);
    image.alt = `${portraitName(record)}のポートレート`;
    document.getElementById('original-link').href = imageUrl(record);
  }

  for (const record of records) {
    const figure = document.createElement('figure');
    figure.dataset.id = record.id;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portrait';
    button.setAttribute('aria-label', `${portraitName(record)}を拡大`);
    const image = document.createElement('img');
    image.src = imageUrl(record);
    image.alt = '';
    image.width = 1200;
    image.height = 1600;
    image.loading = 'lazy';
    image.decoding = 'async';
    button.append(image);
    button.addEventListener('click', () => {
      updateDetail(record);
      dialog.showModal();
    });
    const caption = document.createElement('figcaption');
    const heading = document.createElement('div');
    heading.className = 'card-heading';
    const title = document.createElement('h3');
    title.className = 'type-copy';
    title.textContent = record.label;
    const number = document.createElement('span');
    number.className = 'number';
    number.textContent = record.id;
    heading.append(title, number);
    const description = document.createElement('p');
    description.className = 'description type-copy';
    description.textContent = record.description;
    caption.append(heading, description);
    figure.append(button, caption);
    document.getElementById(`${record.gender}-grid`).append(figure);
  }

  document.querySelectorAll('[data-gender]').forEach(button => {
    button.addEventListener('click', () => {
      selectedGender = button.dataset.gender;
      document.querySelectorAll('[data-gender]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      document.querySelectorAll('[data-section]').forEach(section => { section.hidden = selectedGender !== 'all' && section.dataset.section !== selectedGender; });
      document.getElementById('visible-count').textContent = `${visibleRecords().length}枚を表示`;
    });
  });
  showLabels.addEventListener('change', () => {
    document.body.classList.toggle('hide-labels', !showLabels.checked);
    for (const record of records) {
      document.querySelector(`[data-id="${record.id}"] .portrait`).setAttribute('aria-label', `${portraitName(record)}を拡大`);
    }
    if (activeRecord) updateDetail(activeRecord);
  });
  document.getElementById('face-crop').addEventListener('change', event => {
    document.body.classList.toggle('face-crop', event.target.checked);
  });
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  function advance(direction) {
    const visible = visibleRecords();
    const index = visible.indexOf(activeRecord);
    updateDetail(visible[(index + direction + visible.length) % visible.length]);
  }
  document.getElementById('previous-image').addEventListener('click', () => advance(-1));
  document.getElementById('next-image').addEventListener('click', () => advance(1));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    advance(event.key === 'ArrowLeft' ? -1 : 1);
  });
})();
