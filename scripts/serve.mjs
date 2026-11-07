import "./build.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    // Comparison routes exist only in this local server, never in dist/.
    if (pathname === "/review/" || pathname === "/review") {
      const body = await readFile("scripts/review.html");
      res
        .writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        .end(body);
      return;
    }
    const baseline = pathname.startsWith("/review/current/");
    const activeRoot = baseline ? resolve(".review/current/dist") : root;
    const relativePath = baseline
      ? pathname.slice("/review/current".length)
      : pathname;
    let path = resolve(activeRoot, "." + relativePath);
    if (path !== activeRoot && !path.startsWith(activeRoot + sep)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
    const body = await readFile(path);
    res.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
server.listen(Number(process.env.PORT || 4173), "0.0.0.0", () =>
  console.log(`Ember Lab server listening on port ${server.address().port}`),
);
