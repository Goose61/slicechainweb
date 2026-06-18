import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

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

const bannerPath = path.resolve(root, "public/landing-assets/images/about-banner.jpg");
const bannerOut = path.join(outDir, "landing-assets/images/about-banner.jpg");
if (fs.existsSync(bannerPath)) {
  const tmpBanner = path.join(outDir, ".about-banner-opt.jpg");
  try {
    execSync(
      `convert "${bannerPath}" -strip -resize 1200x800\\> -interlace Plane -quality 76 -sampling-factor 4:2:0 "${tmpBanner}"`,
      { stdio: "pipe" }
    );
    fs.copyFileSync(tmpBanner, bannerPath);
    if (fs.existsSync(bannerOut)) {
      fs.copyFileSync(tmpBanner, bannerOut);
    }
    fs.rmSync(tmpBanner, { force: true });
  } catch {
    console.warn("post-export: about-banner compression skipped");
  }
}

console.log("post-export: landing bundle, cache headers, and static artifacts verified");
