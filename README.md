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

All copy, images, projects and materials live in **`src/data/site.ts`**.

- `brand.contactEmail` — **replace with the real enquiries address** (used by the contact form via `mailto:`).
- `heroVideo` — set to `{ src: './media/hero.mp4' }` (file in `/public/media`) to replace the WebGL hero with a filmed video.
- `projects` — every project has `isConcept: true` because they are demonstration studies built from the supplied imagery.
  Replace them with real commissions (and set `location`) when available.

## Images

Photos in `src/assets/img` were supplied by the client and enhanced (denoise → EDSR ×2/×4 super-resolution → local
contrast → sharpen → subtle grade). Material textures in `src/assets/materials` are procedurally generated.
For the best result, replace them with the original high-resolution files.

## Deploy (GitHub Pages)

`/docs` contains the production build (run `npm run build` to regenerate it).

Settings → Pages → Build and deployment → Source: **Deploy from a branch** →
branch `claude/peaceful-mccarthy-q9z9bm` (or `main` after merging), folder **`/docs`** → Save.

The site is then served at https://sebasaprojets.github.io/RunwayFurniture/
