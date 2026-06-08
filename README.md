# slicechainweb

Source for [slicechain.io](https://slicechain.io) (SlicePay marketing site).

The live site is the **built Next.js export** (`out/`), deployed by GitHub Actions — not this README.

## GitHub Pages settings (required once)

In the repo **Settings → Pages**:

1. **Source:** Deploy from a branch
2. **Branch:** `gh-pages` / `/ (root)`
3. **Custom domain:** `slicechain.io` (CNAME is in `public/CNAME`)

After each push to `main`, the workflow builds and updates `gh-pages` with `index.html` and assets only.

If you see this README on slicechain.io, Pages is pointed at `main` instead of `gh-pages` — change the branch above.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3069

## Build static export

```bash
npm run build:pages
```

Output in `out/` (gitignored). Portal links target `https://app.slicechain.io` when `GITHUB_PAGES=true`.

See `../app/docs/DEMO_HOSTING.md` for the full demo stack (app / api / qr on your server).
