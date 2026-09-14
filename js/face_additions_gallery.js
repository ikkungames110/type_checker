/* 確認用の静的HTMLを拡張する。診断データ・セッションには触れない。 */
(() => {
  'use strict';
  const groups = [...document.querySelectorAll('.type-group')];
  const portraits = [...document.querySelectorAll('.portrait')];
  const typeFilter = document.getElementById('type-filter');
  const sourceFilter = document.getElementById('source-filter');
  const typeOptions = [...typeFilter.options].map(option => option.cloneNode(true));
  const dialog = document.getElementById('portrait-dialog');
  let gender = 'all';
  let activePortrait = null;

  function visiblePortraits() {
    return portraits.filter(p => !p.closest('.type-group').hidden && !p.closest('.cohort').hidden);
  }

  function updateVisibility() {
    for (const group of groups) {
      group.hidden = (gender !== 'all' && gender !== group.dataset.gender) ||
        (typeFilter.value !== 'all' && typeFilter.value !== group.dataset.type);
      group.querySelectorAll('.cohort').forEach(row => {
        row.hidden = sourceFilter.value !== 'all' && row.dataset.source !== sourceFilter.value;
      });
      group.querySelector('.group-count').textContent = sourceFilter.value === 'all' ? '既存5人 ＋ 追加5人' : sourceFilter.value === 'current' ? '既存5人' : '追加5人';
    }
    document.querySelectorAll('.gender-section').forEach(section => {
      const visibleGroups = [...section.querySelectorAll('.type-group')].filter(group => !group.hidden);
      section.hidden = visibleGroups.length === 0;
      const count = visibleGroups.length * (sourceFilter.value === 'all' ? 10 : 5);
      section.querySelector('h2 span').textContent = `${visibleGroups.length}タイプ · ${count}人`;
    });
    const visible = visiblePortraits();
    const current = visible.filter(p => p.closest('.cohort').dataset.source === 'current').length;
    document.getElementById('visible-count').textContent = `${visible.length}枚を表示 · 既存${current}枚 / 追加${visible.length - current}枚`;
  }

  document.querySelectorAll('button[data-gender]').forEach(button => {
    button.addEventListener('click', () => {
      gender = button.dataset.gender;
      document.querySelectorAll('button[data-gender]').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      const previousType = typeFilter.value;
      typeFilter.replaceChildren(...typeOptions.filter(option =>
        option.value === 'all' || gender === 'all' || option.dataset.gender === gender
      ).map(option => option.cloneNode(true)));
      typeFilter.value = [...typeFilter.options].some(option => option.value === previousType) ? previousType : 'all';
      updateVisibility();
    });
  });
  typeFilter.addEventListener('change', updateVisibility);
  sourceFilter.addEventListener('change', updateVisibility);
  document.getElementById('face-crop').addEventListener('change', event => {
    document.body.classList.toggle('face-crop', event.target.checked);
  });

  function showPortrait(portrait) {
    activePortrait = portrait;
    document.getElementById('detail-title').textContent = portrait.dataset.title;
    const image = document.getElementById('detail-image');
    image.src = portrait.href;
    image.alt = `${portrait.dataset.title}の顔写真`;
    document.getElementById('original-link').href = portrait.href;
  }
  portraits.forEach(portrait => portrait.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPortrait(portrait);
    dialog.showModal();
  }));
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  function advance(direction) {
    const visible = visiblePortraits();
    if (!visible.length) return;
    const index = visible.indexOf(activePortrait);
    showPortrait(visible[(index + direction + visible.length) % visible.length]);
  }
  document.getElementById('previous-image').addEventListener('click', () => advance(-1));
  document.getElementById('next-image').addEventListener('click', () => advance(1));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    advance(event.key === 'ArrowLeft' ? -1 : 1);
  });
  document.getElementById('gallery-controls').hidden = false;
})();
