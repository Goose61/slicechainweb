import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const outDir = path.resolve("out");
const publicDir = path.resolve("public");
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
    console.warn("post-export: WARNING - no index.html in out/; GitHub Pages will 404 at /");
  }
}

// Keep CNAME for custom domain
const cnameSource = path.resolve("public/CNAME");
const cnameTarget = path.join(outDir, "CNAME");
if (fs.existsSync(cnameSource) && !fs.existsSync(cnameTarget)) {
  fs.copyFileSync(cnameSource, cnameTarget);
}

/** Build agent-skills index with SHA-256 digests from public SKILL.md files. */
function buildAgentSkillsIndex() {
  const skillDefs = [
    {
      name: "gateway-api",
      description: "SlicePay Gateway REST API - invoices, payment status, hosted checkout",
      relPath: ".well-known/agent-skills/gateway-api/SKILL.md",
    },
    {
      name: "website-pay-widget",
      description: "Embed SlicePay crypto checkout on e-commerce sites via script tag or hosted URL",
      relPath: ".well-known/agent-skills/website-pay-widget/SKILL.md",
    },
  ];

  const skills = skillDefs.map((def) => {
    const filePath = path.join(publicDir, def.relPath);
    if (!fs.existsSync(filePath)) {
      console.warn(`post-export: missing skill file ${def.relPath}`);
      return null;
    }
    const content = fs.readFileSync(filePath);
    const digest = crypto.createHash("sha256").update(content).digest("hex");
    return {
      name: def.name,
      type: "skill-md",
      description: def.description,
      url: `https://slicechain.io/${def.relPath}`,
      digest: `sha256:${digest}`,
    };
  }).filter(Boolean);

  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills,
  };

  const indexRel = ".well-known/agent-skills/index.json";
  for (const base of [publicDir, outDir]) {
    const target = path.join(base, indexRel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(index, null, 2)}\n`);
  }
  console.log(`post-export: wrote agent-skills index (${skills.length} skills)`);
}

buildAgentSkillsIndex();

console.log("post-export: cache headers and static export artifacts verified");
