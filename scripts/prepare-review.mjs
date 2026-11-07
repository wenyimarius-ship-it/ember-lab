// Local-only comparison snapshot. Never included in the Production output.
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const baseline = "413146192fd07ddb38853882f15284bec4edfb21";
const root = resolve(".review/current");
await rm(root, { recursive: true, force: true });
await mkdir(root, { recursive: true });
const archive = execFileSync("git", ["archive", baseline]);
await writeFile(".review/baseline.tar", archive);
execFileSync("tar", ["-xf", resolve(".review/baseline.tar"), "-C", root]);
execFileSync(process.execPath, ["scripts/build.mjs"], {
  cwd: root,
  stdio: "inherit",
});
const html = await readFile(`${root}/dist/index.html`, "utf8");
await writeFile(
  `${root}/dist/index.html`,
  html.replaceAll('"/assets/', '"/review/current/assets/'),
);
await rm(".review/baseline.tar");
console.log(
  `Local comparison baseline: ${baseline}. Open /review/ on the dev server.`,
);
