import { spawnSync } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import { cp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const localNodeModules = path.join(root, "node_modules");
const sharedDependencies = path.resolve(root, "..", "node_modules", "next", "package.json");
let turbopackRoot = root;

if (!existsSync(path.join(localNodeModules, "next", "package.json")) && existsSync(sharedDependencies)) {
  turbopackRoot = path.dirname(root);
} else if (existsSync(localNodeModules) && lstatSync(localNodeModules).isSymbolicLink()) {
  turbopackRoot = path.dirname(root);
}

const build = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: root,
  env: { ...process.env, GITHUB_PAGES: "true", NEXT_TURBOPACK_ROOT: turbopackRoot },
  stdio: "inherit",
});

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

await cp(path.join(root, "out"), root, { recursive: true, force: true });
await writeFile(path.join(root, ".nojekyll"), "");
console.log("GitHub Pages files are ready in the repository root.");
