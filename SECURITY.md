# Security — Runway Furniture International website

## Architecture (what was audited)

| Item | Finding |
|---|---|
| Stack | React 18 + TypeScript, built with Vite 6 into static files (`docs/`) |
| Backend / API | **None.** No server code, no API routes, no Server Actions |
| Database | **None** |
| Authentication | **None** (public marketing site, no accounts or admin area) |
| Forms | Contact form validated in the browser and handed to the visitor's mail client via `mailto:` — nothing is sent to or stored on a server |
| Third parties | YouTube (`youtube-nocookie.com`), loaded only after the visitor presses play, inside a sandboxed iframe |
| Storage | `localStorage` holds only the chosen language (`en`/`es`), whitelisted on read |
| Hosting | GitHub Pages (`gh-pages` branch) and Vercel (`vercel.json`) |

Because there is no server, database or login, OWASP categories such as SQL/NoSQL injection, CSRF, SSRF,
IDOR/BOLA, mass assignment, session handling, password storage, rate limiting and MFA **do not apply** to
this codebase. They become relevant the moment a backend (form endpoint, CMS, admin) is added — see
"When a backend is added" below.

## Risks found

| Severity | Risk | Status |
|---|---|---|
| Medium | GitHub Pages cannot send HTTP security headers (no `frame-ancestors`, HSTS, `nosniff`) → clickjacking possible there | **Fixed on Vercel** (https://runway-furniture-6a75.vercel.app) — headers verified live with `curl -I` and framing blocked in a real browser. Residual on GitHub Pages (platform limit) |
| Medium | No automated security checks in CI | **Fixed**: `.github/workflows/security.yml` (build, static checks, npm audit, gitleaks, Semgrep, CodeQL) + Dependabot |
| Low | `style-src 'unsafe-inline'` in CSP | **Accepted**: the animation libraries (Motion, GSAP) write inline `style` attributes; scripts remain strictly `'self'` |
| Low | `.env` files not git-ignored | **Fixed** in `.gitignore` |
| Low | Earlier `gh-pages` publish accidentally contained `node_modules` and missed `media/` | **Fixed**: clean publish |
| Info | Contact form `maxLength` can be bypassed in DevTools | Accepted: data only goes to the visitor's own mail client |

## Protections in place (with evidence)

- **CSP** (meta tag in build + HTTP header on Vercel): `script-src 'self'`, no `unsafe-eval`, `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, only `youtube-nocookie.com` frames, `frame-ancestors 'none'` (header only).
- **Vercel headers**: HSTS (2 years), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy` (camera/mic/geo/payment off), COOP, CORP, immutable cache for hashed assets.
- **XSS**: no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` or `document.write`; React escaping kept.
  URL hash routing only accepts `[\w-]+` slugs looked up in a fixed list; `?lang=` and stored language are whitelisted.
- **External links**: every `target="_blank"` uses `rel="noopener noreferrer"`; the YouTube iframe is sandboxed.
- **No secrets** in the repository, its history, or the published bundle; no source maps published.
- **Dependencies**: lockfile + `npm ci`, `npm audit` = 0 vulnerabilities, Dependabot weekly.

## Vercel Firewall (project `runway-furniture-6a75`)

Configured through the Vercel API and verified live:

| Rule | Action | Verified |
|---|---|---|
| Firewall | Enabled | ✅ config version 4 active |
| Block vulnerability scanners (`.env`, `.git`, `wp-admin`, `phpmyadmin`, `.php`, `.sql`, `.bak`…) | Deny (403) | ✅ `/.env`, `/.git/config`, `/wp-admin/`, `/wp-login.php`, `/phpmyadmin/`, `/index.php` → 403; no real site file matches the pattern |
| Rate limit: 600 requests / 60 s per IP (a full visit uses ~120) | HTTP 429 | Configured; not load-tested against production |
| Bot Protection (managed) | Challenge | ✅ non-browser clients (`curl`) get the Vercel Security Checkpoint |

Not available on the Hobby plan: the OWASP Core Ruleset (XSS/SQLi/RCE blocking) — it needs a paid plan. For this
static site those attacks have nothing to hit, so the gap is small.

**To verify on a real device:** an automated test browser in a datacenter could not pass the Bot Protection
challenge (expected: Vercel flags automation). Real visitors on a normal phone/PC browser should pass invisibly.
If any visitor reports a "Vercel Security Checkpoint" loop, set Bot Protection to *Log* in
Vercel → Firewall → Bot Management.

## Tests

```bash
npm ci
npm run security          # build + 26 static checks + npm audit
semgrep scan --config p/react --config p/typescript --config p/javascript --config p/secrets src
```

Runtime browser checks (Playwright, run against `npx vite preview`) covered: no CSP violations or JS errors
while scrolling the whole page, no third-party requests before interaction, injected inline script blocked,
third-party script blocked, malicious URL hash / `?lang=` / poisoned `localStorage` handled safely, HTML in
form fields never rendered, invalid email rejected, `maxLength` on all inputs, safe external links.

## External settings still to do (owner)

1. GitHub → Settings → Pages: source `gh-pages` / root, and tick **Enforce HTTPS**.
2. GitHub → Settings → Code security: enable **Secret scanning**, **Push protection**, **Dependabot alerts**.
3. GitHub → Settings → Branches: protect the deployed branch (require the *Security* workflow to pass).
4. Vercel: delete the duplicate project `runway-furniture` (the live one is `runway-furniture-6a75`) at
   https://vercel.com/sebasprojects1/runway-furniture/settings/advanced → *Delete Project*.
5. Google Drive: set the source PDFs/videos to *Restricted* if they are not meant to be public.
6. Optional: put the site behind Cloudflare (WAF / DDoS) when a custom domain is added.

## When a backend is added

Validate every input on the server with a schema (e.g. Zod), rate-limit the endpoint per IP, add a CAPTCHA
or honeypot to the form, keep secrets in server-side environment variables only (never `VITE_*`), restrict
CORS to the site's origin, return generic error messages, and log requests without personal data.
