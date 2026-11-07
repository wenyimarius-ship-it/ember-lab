import { statuses } from '../experiments.js';

export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export function validateExperiments(items) {
  const ids = new Set();
  for (const item of items) {
    if (!/^[a-z][a-z0-9-]*$/.test(item.id) || ids.has(item.id)) throw new Error(`Invalid or duplicate id: ${item.id}`);
    ids.add(item.id);
    for (const field of ['title', 'description', 'preview']) if (!item[field]) throw new Error(`Missing ${field}: ${item.id}`);
    for (const field of ['category', 'tags']) if (!Array.isArray(item[field]) || !item[field].length) throw new Error(`Missing ${field}: ${item.id}`);
    if (!Object.hasOwn(statuses, item.status)) throw new Error(`Unknown status: ${item.status}`);
    if (item.url !== null) {
      const url = new URL(item.url);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Unsafe URL: ${item.id}`);
      if (!['live', 'existing'].includes(item.status)) throw new Error(`Unreleased project cannot have a URL: ${item.id}`);
    }
    if (item.status === 'live' && !item.url) throw new Error(`Live project needs a URL: ${item.id}`);
  }
  if (items.filter(item => item.featured).length !== 1) throw new Error('Exactly one featured experiment is required');
}

function artwork(item, featured) {
  const kind = ['bridge', 'puzzle', 'cinema', 'city'].includes(item.preview) ? item.preview : 'generic';
  const inner = {
    bridge: '<span class="bridge-ring ring-one"></span><span class="bridge-ring ring-two"></span><span class="bridge-core">文<span>↔</span>A</span><span class="art-label label-left">CONTEXT</span><span class="art-label label-right">CONNECTION</span>',
    puzzle: '<span class="idea idea-one">What if?</span><span class="idea idea-two">Connect.</span><span class="idea idea-three">Try it ↗</span>',
    cinema: '<span class="screen"><span>FRAME / 001</span><i></i><span>WHAT MOVES YOU?</span></span>',
    city: '<span class="city-grid"></span><span class="route route-one"></span><span class="route route-two"></span><span class="map-point point-one">A</span><span class="map-point point-two">B</span>',
    generic: '<span class="generic-symbol">↗</span>',
  }[kind];
  return `<div class="art art-${kind}${featured ? ' art-featured' : ''}" aria-hidden="true">${inner}<span class="art-caption">${featured ? 'CULTURE → CONVERSATION' : 'CONCEPT STUDY / ' + escapeHTML(item.id.toUpperCase())}</span></div>`;
}
function action(item) {
  return item.url && ['live', 'existing'].includes(item.status)
    ? `<a class="text-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">体验 ${escapeHTML(item.title)} <span aria-hidden="true">↗</span><span class="sr-only">（新窗口打开）</span></a>`
    : `<p class="unavailable">${escapeHTML(item.connectionNote || (item.status === 'planned' ? '正在规划 · 尚未上线' : '开发中 · 尚未上线'))}<span aria-hidden="true">↗</span></p>`;
}
export function renderCard(item, index) {
  return `<article id="experiment-${item.id}" class="experiment-card" data-status="${escapeHTML(item.status)}" aria-labelledby="title-${item.id}">
    ${artwork(item, false)}
    <div class="card-body"><div class="card-meta"><span class="mono">${String(index + 1).padStart(2, '0')} / EXPERIMENT</span><span class="status status-${item.status}">${statuses[item.status]}</span></div>
    <p class="category mono">${item.category.map(escapeHTML).join(' / ')}</p>
    <h3 id="title-${item.id}">${escapeHTML(item.title)}</h3>${item.subtitle ? `<p class="subtitle">${escapeHTML(item.subtitle)}</p>` : ''}
    <p class="description">${escapeHTML(item.description)}</p>
    <ul class="tags" aria-label="项目标签">${item.tags.map(tag => `<li>${escapeHTML(tag)}</li>`).join('')}</ul>
    ${action(item)}</div></article>`;
}
export function renderFeatured(item) {
  return `<article class="featured-card" aria-labelledby="featured-title"><div class="featured-copy"><span class="status status-${item.status}">${statuses[item.status]}</span><p class="category mono">${item.category.map(escapeHTML).join(' / ')}</p><h3 id="featured-title">${escapeHTML(item.title)}<span>.</span></h3><p class="description">${escapeHTML(item.description)}</p><ol class="workflow"><li><span>01</span>生成</li><li><span>02</span>核验</li><li><span>03</span>反馈</li></ol>${action(item)}</div>${artwork(item, true)}</article>`;
}
