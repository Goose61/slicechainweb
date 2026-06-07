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
