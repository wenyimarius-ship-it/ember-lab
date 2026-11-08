import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { localizeHTML } from "./localize.mjs";
import { experiments } from "../experiments.js";
import {
  validateExperiments,
  renderCard,
  renderFeatured,
  renderDirectory,
  escapeHTML,
} from "./render.mjs";
process.chdir(fileURLToPath(new URL("..", import.meta.url)));
validateExperiments(experiments);
const templates = [
  ["index.html", "index.html"],
  ["pages/project-notes.html", "about/index.html"],
];
const pages = [];
for (const [source, destination] of templates) {
  const template = await readFile(source, "utf8");
  let html = template
    .replace(
      "<!-- FEATURED -->",
      renderFeatured(experiments.find((item) => item.featured)),
    )
    .replace("<!-- EXPERIMENTS -->", experiments.map(renderCard).join("\n"))
    .replace("<!-- DIRECTORY -->", renderDirectory(experiments))
    .replaceAll("<!-- COUNT -->", String(experiments.length))
    .replace("<!-- YEAR -->", String(new Date().getUTCFullYear()))
    .replace(
      "<!-- INDEX PROJECTS -->",
      experiments
        .map(
          (item) =>
            `<a href="${escapeHTML(item.url || `/about/#experiment-${item.id}`)}" data-project-id="${item.id}">${escapeHTML(item.title)}</a>`,
        )
        .join(""),
    );
  if (destination !== "index.html") html = localizeHTML(html, experiments);
  pages.push({ destination, html });
}
// Use the current Vercel deployment host, or an explicitly configured canonical origin.
const configuredOrigin =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
await rm("dist", { recursive: true, force: true });
await mkdir("dist/about", { recursive: true });
for (const page of pages) {
  let html = page.html;
  if (configuredOrigin) {
    const origin = new URL(configuredOrigin);
    if (
      origin.protocol !== "https:" ||
      origin.username ||
      origin.password ||
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash
    )
      throw new Error("SITE_URL must be an HTTPS origin");
    const pathname = page.destination === "index.html" ? "/" : "/about/";
    html = html
      .replace(
        'content="/assets/og.png"',
        `content="${origin.origin}/assets/og.png"`,
      )
      .replace(
        "</head>",
        `  <link rel="canonical" href="${origin.origin}${pathname}">\n  <meta property="og:url" content="${origin.origin}${pathname}">\n</head>`,
      );
  }
  await writeFile(`dist/${page.destination}`, html);
}
await cp("assets", "dist/assets", { recursive: true });
console.log(
  `Built ${experiments.length} experiments → dist/ (static HTML, no runtime dependencies)`,
);
