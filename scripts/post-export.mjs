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

// Ensure GitHub Pages root has index.html (required for slicechain.io /)
const indexHtml = path.join(outDir, "index.html");
if (!fs.existsSync(indexHtml)) {
  const candidates = [
    path.join(outDir, "landing.html"),
    path.join(outDir, "landing", "index.html"),
  ];
  const source = candidates.find((p) => fs.existsSync(p));
  if (source) {
    fs.copyFileSync(source, indexHtml);
    console.log(`post-export: created index.html from ${path.basename(source)}`);
  } else {
    console.warn("post-export: WARNING — no index.html in out/; GitHub Pages will 404 at /");
  }
}

// Keep CNAME for custom domain
const cnameSource = path.resolve("public/CNAME");
const cnameTarget = path.join(outDir, "CNAME");
if (fs.existsSync(cnameSource) && !fs.existsSync(cnameTarget)) {
  fs.copyFileSync(cnameSource, cnameTarget);
}

console.log("post-export: cache headers and static export artifacts verified");
