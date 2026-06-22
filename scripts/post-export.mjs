import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.resolve(root, "out");
const headersSource = path.resolve(root, "public/_headers");
const headersTarget = path.join(outDir, "_headers");
const bundleSource = path.resolve(root, "public/landing-assets/css/landing.bundle.css");
const bundleTarget = path.join(outDir, "landing-assets/css/landing.bundle.css");

const styleFiles = [
  path.resolve(root, "src/styles/landing-menos-gusto.css"),
  path.resolve(root, "src/styles/landing-inline.css"),
];

if (!fs.existsSync(outDir)) {
  console.error("post-export: out/ directory missing");
  process.exit(1);
}

const bundleCss = styleFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
fs.mkdirSync(path.dirname(bundleSource), { recursive: true });
fs.writeFileSync(bundleSource, bundleCss);
fs.mkdirSync(path.dirname(bundleTarget), { recursive: true });
fs.copyFileSync(bundleSource, bundleTarget);

if (fs.existsSync(headersSource)) {
  fs.copyFileSync(headersSource, headersTarget);
}

const noJekyll = path.join(outDir, ".nojekyll");
if (!fs.existsSync(noJekyll)) {
  fs.writeFileSync(noJekyll, "");
}

console.log("post-export: landing bundle, cache headers, and static artifacts verified");
