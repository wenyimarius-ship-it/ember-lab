import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { experiments } from '../experiments.js';
import { validateExperiments, renderCard } from '../scripts/render.mjs';

test('project catalog has four distinct projects and CultureBridge featured', () => {
  validateExperiments(experiments);
  assert.equal(experiments.length, 4);
  assert.equal(experiments.find(item => item.featured).id, 'culturebridge');
  assert.equal(experiments.filter(item => item.status === 'in-development').length, 3);
});
test('unverified and unreleased projects never render launch links', () => {
  for (const [i, item] of experiments.entries()) {
    assert.equal(item.url, null);
    assert.doesNotMatch(renderCard(item, i), /<a\b/);
  }
});
test('live project requires URL; HTTPS and released status required for navigation', () => {
  for (const change of [{ status: 'live' }, { url: 'javascript:alert(1)' }, { url: 'https://example.com', status: 'planned' }, { url: 'https://user:pass@example.com' }]) {
    const items = structuredClone(experiments);
    Object.assign(items[0], change);
    assert.throws(() => validateExperiments(items));
  }
  const items = structuredClone(experiments);
  Object.assign(items[0], { status: 'live', url: 'https://example.com/app' });
  validateExperiments(items);
  assert.match(renderCard(items[0], 0), /href="https:\/\/example.com\/app"/);
});
test('duplicate IDs and unsupported statuses fail build validation', () => {
  const items = structuredClone(experiments);
  items[1].id = items[0].id;
  assert.throws(() => validateExperiments(items), /duplicate/);
  items[1].id = 'new-project';
  items[1].status = 'soon';
  assert.throws(() => validateExperiments(items), /Unknown status/);
});
test('project text is escaped instead of interpreted as HTML', () => {
  const item = { ...experiments[0], title: '<script>alert("x")</script>', tags: ['<img src=x>'] };
  const card = renderCard(item, 0);
  assert.doesNotMatch(card, /<script>|<img/);
  assert.match(card, /&lt;script&gt;/);
});
test('new catalog entries render with generic artwork fallback', () => {
  const item = { ...experiments[1], id: 'next-experiment', preview: 'custom', status: 'planned' };
  const html = renderCard(item, 4);
  assert.match(html, /art-generic/);
  assert.match(html, /Planned/);
  assert.match(html, /title-next-experiment/);
});
test('built HTML includes all content and metadata without needing client rendering', async () => {
  await import('../scripts/build.mjs');
  const html = await readFile('dist/index.html', 'utf8');
  assert.equal((html.match(/class="experiment-card"/g) || []).length, 4);
  for (const marker of ['<!-- FEATURED -->', '<!-- EXPERIMENTS -->', '<!-- COUNT -->', '<!-- YEAR -->']) assert.ok(!html.includes(marker));
  for (const item of experiments) assert.ok(html.includes(item.title));
  assert.match(html, /property="og:image"/);
  assert.match(html, /class="skip-link"/);
  assert.doesNotMatch(html, /href="#"|lab\.mariustang\.com/);
});

test('deployment build writes canonical and absolute sharing image from deployment host', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, ['scripts/build.mjs'], { env: { ...process.env, SITE_URL: 'https://lab.example.com', VERCEL_URL: '' } });
  const html = await readFile('dist/index.html', 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/lab.example.com\/"/);
  assert.match(html, /property="og:image" content="https:\/\/lab.example.com\/assets\/og.png"/);
  execFileSync(process.execPath, ['scripts/build.mjs'], { env: { ...process.env, SITE_URL: '', VERCEL_URL: '' } });
});
