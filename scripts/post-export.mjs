import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const headersSource = path.resolve("public/_headers");
const headersTarget = path.join(outDir, "_headers");

if (!fs.existsSync(outDir)) {
  console.error("post-export: out/ directory missing");
  process.exit(1);
}

if (fs.existsSync(headersSource)) {
  fs.copyFileSync(headersSource, headersTarget);
}

const noJekyll = path.join(outDir, ".nojekyll");
if (!fs.existsSync(noJekyll)) {
  fs.writeFileSync(noJekyll, "");
}

console.log("post-export: cache headers and static export artifacts verified");
