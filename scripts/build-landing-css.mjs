import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const styleFiles = [
  path.resolve(root, "src/styles/landing-menos-gusto.css"),
  path.resolve(root, "src/styles/landing-inline.css"),
];
const bundleTarget = path.resolve(root, "public/landing-assets/css/landing.bundle.css");

const bundleCss = styleFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
fs.mkdirSync(path.dirname(bundleTarget), { recursive: true });
fs.writeFileSync(bundleTarget, bundleCss);
console.log("build-landing-css: wrote", bundleTarget);
