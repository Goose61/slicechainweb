# SliceChain Web

Marketing site for [SlicePay](https://slicechain.io) — built with Next.js.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3069](http://localhost:3069).

## GitHub Pages (slicechain.io)

Static export is enabled via `GITHUB_PAGES=true`.

```bash
npm run build:pages
```

The `out/` directory contains the static site. GitHub Actions deploys automatically on push to `main` or `master`.

### Custom domain DNS

Point `slicechain.io` to GitHub Pages:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `goose61.github.io` |

Then in the repo **Settings → Pages**, set the custom domain to `slicechain.io` and enable HTTPS.

`public/CNAME` is included for GitHub Pages.

### Portal links → live demo app

Marketing CTAs point to **`https://app.slicechain.io`** (self-hosted via Cloudflare tunnel), not relative `/portal` on GitHub Pages. Built automatically when `GITHUB_PAGES=true` (`npm run build:pages`).

Do **not** route `slicechain.io` / `www` through your Cloudflare tunnel — only `app`, `api`, and `qr` subdomains. See `app/docs/DEMO_HOSTING.md`.
