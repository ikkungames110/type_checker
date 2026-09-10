/* 全員25歳・男女各8タイプ×5人の写真比較。 */
(() => {
  'use strict';
  const { records } = window.FACE_TYPE_PREVIEW_V8;
  const dialog = document.getElementById('portrait-dialog');
  const showLabels = document.getElementById('show-labels');
  const typeFilter = document.getElementById('type-filter');
  const groups = new Map();
  let selectedGender = 'all';
  let activeRecord = null;
  const groupKey = record => `${record.gender}:${record.type}`;
  const visibleRecords = () => records.filter(record =>
    (selectedGender === 'all' || record.gender === selectedGender) &&
    (typeFilter.value === 'all' || groupKey(record) === typeFilter.value));
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
    const key = groupKey(record);
    if (!groups.has(key)) {
      const section = document.createElement('section');
      section.className = 'type-group';
      section.dataset.type = key;
      const heading = document.createElement('div');
      heading.className = 'type-heading';
      const title = document.createElement('h3');
      title.id = `type-${record.gender}-${record.type}`;
      const typeName = document.createElement('span');
      typeName.className = 'type-copy';
      typeName.textContent = record.label;
      const groupNumber = document.createElement('span');
      groupNumber.className = 'group-number';
      groupNumber.textContent = `グループ ${String(groups.size % 8 + 1).padStart(2, '0')}`;
      title.append(typeName, groupNumber);
      section.setAttribute('aria-labelledby', title.id);
      const description = document.createElement('p');
      description.className = 'type-copy';
      description.textContent = record.description;
      heading.append(title, description);
      const grid = document.createElement('div');
      grid.className = 'grid';
      section.append(heading, grid);
      document.getElementById(`${record.gender}-groups`).append(section);
      groups.set(key, { section, grid, record });
    }
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
    button.addEventListener('click', () => { updateDetail(record); dialog.showModal(); });
    const caption = document.createElement('figcaption');
    caption.className = 'number';
    caption.textContent = record.id;
    figure.append(button, caption);
    groups.get(key).grid.append(figure);
  }

  function updateVisibility() {
    const visible = visibleRecords();
    const visibleGroups = new Set(visible.map(groupKey));
    for (const [key, { section }] of groups) section.hidden = !visibleGroups.has(key);
    document.querySelectorAll('[data-section]').forEach(section => {
      section.hidden = !visible.some(record => record.gender === section.dataset.section);
    });
    document.getElementById('visible-count').textContent = `${visible.length}枚を表示`;
  }

  function updateTypeOptions() {
    typeFilter.replaceChildren(new Option('全タイプ', 'all'));
    for (const [key, { record }] of groups) {
      if (selectedGender !== 'all' && record.gender !== selectedGender) continue;
      const prefix = selectedGender === 'all' ? `${record.gender === 'female' ? '女性' : '男性'} · ` : '';
      typeFilter.add(new Option(prefix + record.label, key));
    }
  }
  updateTypeOptions();
  document.querySelectorAll('[data-gender]').forEach(button => {
    button.addEventListener('click', () => {
      selectedGender = button.dataset.gender;
      document.querySelectorAll('[data-gender]').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      updateTypeOptions();
      updateVisibility();
    });
  });
  typeFilter.addEventListener('change', updateVisibility);
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
