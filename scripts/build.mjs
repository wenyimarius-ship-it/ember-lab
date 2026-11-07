import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { localizeHTML } from './localize.mjs';
import { experiments } from '../experiments.js';
import { validateExperiments, renderCard, renderFeatured, escapeHTML } from './render.mjs';
process.chdir(fileURLToPath(new URL('..', import.meta.url)));
validateExperiments(experiments);
const template = await readFile('index.html', 'utf8');
let html = template.replace('<!-- FEATURED -->', renderFeatured(experiments.find(item => item.featured)))
  .replace('<!-- EXPERIMENTS -->', experiments.map(renderCard).join('\n'))
  .replaceAll('<!-- COUNT -->', String(experiments.length))
  .replace('<!-- YEAR -->', String(new Date().getUTCFullYear()))
  .replace('<!-- INDEX PROJECTS -->', experiments.map(item => `<a href="#experiment-${item.id}" data-project-id="${item.id}">${escapeHTML(item.title)}</a>`).join(''));
html = localizeHTML(html, experiments);
// Use the current Vercel deployment host, or an explicitly configured canonical origin.
const configuredOrigin = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
if (configuredOrigin) {
  const origin = new URL(configuredOrigin);
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('SITE_URL must be an HTTPS origin');
  html = html.replace('content="/assets/og.png"', `content="${origin.origin}/assets/og.png"`)
    .replace('</head>', `  <link rel="canonical" href="${origin.origin}/">\n  <meta property="og:url" content="${origin.origin}/">\n</head>`);
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await writeFile('dist/index.html', html);
await cp('assets', 'dist/assets', { recursive: true });
console.log(`Built ${experiments.length} experiments → dist/ (static HTML, no runtime dependencies)`);
