// Export the local comparison as self-contained files for offline review.
import { readFile, writeFile, mkdir } from "node:fs/promises";
const output = ".review/preview";
await mkdir(output, { recursive: true });
async function inlinePage(source, assetsRoot, destination) {
  let html = await readFile(source, "utf8");
  const tokens = await readFile(`${assetsRoot}/ember-tokens.css`, "utf8");
  const styles = await readFile(`${assetsRoot}/lab.css`, "utf8");
  const script = await readFile(`${assetsRoot}/lab.js`, "utf8");
  const icon = await readFile(`${assetsRoot}/favicon.svg`, "utf8");
  html = html
    .replace(/<link rel="stylesheet"[^>]+>/g, "")
    .replace(/<script src="[^"]+" defer><\/script>/g, "")
    .replace(
      /<link rel="icon"[^>]+>/,
      `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(icon)}" type="image/svg+xml">`,
    )
    .replace("</head>", `<style>${tokens}\n${styles}</style></head>`)
    .replaceAll('href="/about/#', 'href="notes.html#')
    .replaceAll('href="/about/"', 'href="notes.html"')
    .replaceAll('href="/"', 'href="directory.html"')
    .replace("</body>", `<script>${script}</script></body>`);
  // Offline files do not have an HTTP history origin or /about/ pathname.
  html = html.replace(
    'history.replaceState(null, "", url);',
    'try { history.replaceState(null, "", url); } catch {}',
  );
  if (destination === "notes.html")
    html = html.replace('location.pathname.startsWith("/about")', "true");
  await writeFile(`${output}/${destination}`, html);
}
await inlinePage("dist/index.html", "dist/assets", "directory.html");
await inlinePage("dist/about/index.html", "dist/assets", "notes.html");
await inlinePage(
  ".review/current/dist/index.html",
  ".review/current/dist/assets",
  "before.html",
);
let comparison = await readFile("scripts/review.html", "utf8");
comparison = comparison
  .replaceAll('href="/review/current/"', 'href="before.html"')
  .replaceAll('src="/review/current/"', 'src="before.html"')
  .replaceAll('href="/"', 'href="directory.html"')
  .replaceAll('src="/"', 'src="directory.html"');
await writeFile(`${output}/index.html`, comparison);
console.log(
  `Offline review: ${output}/index.html. Links to experiments keep their real destinations.`,
);
