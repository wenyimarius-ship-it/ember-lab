// Progressive enhancement: all project content and navigation work without JS.
const filters = document.querySelector('.filters');
const cards = [...document.querySelectorAll('.experiment-card')];
const result = document.querySelector('#filter-result');
const empty = document.querySelector('.empty-state');
function filterProjects(value) {
  let visible = 0;
  for (const card of cards) {
    card.hidden = value !== 'all' && card.dataset.status !== value;
    if (!card.hidden) visible++;
  }
  for (const button of filters.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === value));
  }
  empty.hidden = visible !== 0;
  result.textContent = `显示 ${visible} 个项目，共 ${cards.length} 个。`;
}
filters.hidden = false;
filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (button) filterProjects(button.dataset.filter);
});
document.querySelector('#reset-filter').addEventListener('click', () => {
  filterProjects('all');
  filters.querySelector('[data-filter="all"]').focus();
});
