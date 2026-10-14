# Runway Furniture International — website

Cinematic, editorial website for **Runway Furniture International** — luxury hospitality, residential and bespoke furniture since 2009 (Montreal · Singapore · Worldwide).

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- Motion (Framer Motion) — reveals, layout transitions, menu, project pages
- GSAP + ScrollTrigger — pinned horizontal Hospitality sequence
- Lenis — smooth scroll (disabled automatically for `prefers-reduced-motion`)
- Raw WebGL — the hero "film": real-time sunlit sea seen through a structural glass floor
- Lucide icons, self-hosted fonts (Instrument Serif, Manrope, Mrs Saint Delafield)

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs the static site to /docs
```

## Editing content

All data — projects, collections, clients, materials, films — lives in **`src/data/site.ts`**.

- Copy is bilingual: every text field is `{ en: '…', es: '…' }`. Section headings use `t('English', 'Español')`
  from `useLang()` (`src/i18n.tsx`).
- `brand.contactEmail` — enquiries address (`info@runwayfurniture.com`), used by the contact form via `mailto:`.
- `projects` — real hospitality projects from the company profile and residential projects from the Vondom book.
- `kenkoon` — the Kenkoon outdoor collections; `clients` — the client list from the company profile.
- `heroVideo` — set to `{ src: './media/hero.mp4' }` (file in `/public/media`) to replace the WebGL hero with a filmed video.

## Languages (EN / ES)

One link for both languages: the opening screen asks the visitor to choose **English** or **Español**, and the
EN / ES switch in the header changes it at any time. `…/RunwayFurniture/?lang=es` still pre-selects Spanish.

## Design skills and Playwright MCP

`.claude/skills` holds the project's design skills (Emil Kowalski, Impeccable, Taste Skill) and `.mcp.json` starts the
Playwright MCP through `.claude/playwright-mcp.mjs`.

## Images

Photos in `src/assets/img/real` were extracted from the supplied PDFs (company profile, Vondom, Kenkoon); films in
`public/media` are the supplied videos, re-encoded for the web. Older photos in `src/assets/img` were supplied by the client and enhanced (denoise → EDSR ×2/×4 super-resolution → local
contrast → sharpen → subtle grade). Material textures in `src/assets/materials` are procedurally generated.
For the best result, replace them with the original high-resolution files.

## Deploy (GitHub Pages)

`/docs` contains the production build (run `npm run build` to regenerate it).

Settings → Pages → Build and deployment → Source: **Deploy from a branch** →
branch `claude/exciting-mendel-621i1t` (or `main` after merging), folder **`/docs`** → Save.
The repository must be public for GitHub Pages on a free plan. The old `gh-pages` branch holds an earlier build.

The site is then served at https://sebasaprojets.github.io/RunwayFurniture/
