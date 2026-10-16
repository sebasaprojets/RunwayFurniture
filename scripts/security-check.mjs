// Static security checks for the production build and the source tree. No dependencies.
// Run after `npm run build`:  node scripts/security-check.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

// --- Build output -----------------------------------------------------------
const html = readFileSync('docs/index.html', 'utf8')
const decode = (s) => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
const csp = decode(html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] ?? '')
const directive = (n) => csp.split(';').map((s) => s.trim()).find((s) => s.startsWith(n + ' ')) ?? ''
check('CSP meta tag present in build', !!csp)
check("CSP has no 'unsafe-eval'", !csp.includes('unsafe-eval'))
check("script-src has no 'unsafe-inline' or wildcard", /^script-src 'self'$/.test(directive('script-src')), directive('script-src'))
check("object-src 'none'", directive('object-src') === "object-src 'none'")
check("base-uri restricted", directive('base-uri') === "base-uri 'self'")
// JSON-LD blocks are inert data (never executed), so they are allowed.
check('No inline executable <script> in index.html', ![...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].some((m) => !/\bsrc=/.test(m[1]) && !/application\/ld\+json/.test(m[1]) && m[2].trim()))
check('Only same-origin scripts', ![...html.matchAll(/<script[^>]+src="([^"]+)"/g)].some((m) => /^(https?:)?\/\//.test(m[1])))
check('Referrer policy meta present', /name="referrer" content="strict-origin-when-cross-origin"/.test(html))

const files = walk('docs')
check('No source maps published', !files.some((f) => f.endsWith('.map')))
const text = files.filter((f) => ['.js', '.css', '.html', '.json', '.txt', '.svg'].includes(extname(f)))
const secretPatterns = [
  [/AKIA[0-9A-Z]{16}/, 'AWS key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/gh[pousr]_[A-Za-z0-9]{36,}/, 'GitHub token'],
  [/sk-[A-Za-z0-9_-]{32,}/, 'API secret key'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/AIza[0-9A-Za-z_-]{35}/, 'Google API key'],
  [/vercel_[A-Za-z0-9]{20,}/i, 'Vercel token'],
]
const leaks = []
for (const f of text) {
  const body = readFileSync(f, 'utf8')
  for (const [re, label] of secretPatterns) if (re.test(body)) leaks.push(`${label} in ${f}`)
}
check('No secrets in published files', leaks.length === 0, leaks.join(', '))

// --- Source tree ------------------------------------------------------------
const src = walk('src').filter((f) => /\.(tsx?|jsx?)$/.test(f))
const grepSrc = (re) => src.filter((f) => re.test(readFileSync(f, 'utf8')))
check('No dangerouslySetInnerHTML / innerHTML writes', grepSrc(/dangerouslySetInnerHTML|\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML/).length === 0)
check('No eval / new Function / string timers', grepSrc(/\beval\(|new Function\(|set(Timeout|Interval)\(\s*['"`]/).length === 0)
check('No document.write', grepSrc(/document\.write/).length === 0)
const blankWithoutRel = src.filter((f) => {
  const s = readFileSync(f, 'utf8')
  return [...s.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].some((m) => !/rel="[^"]*noopener[^"]*noreferrer|rel="[^"]*noreferrer[^"]*noopener/.test(m[0]))
})
check('target="_blank" links use rel="noopener noreferrer"', blankWithoutRel.length === 0, blankWithoutRel.join(', '))
const iframes = src.filter((f) => /<iframe\b/.test(readFileSync(f, 'utf8')))
check('Every <iframe> is sandboxed', iframes.every((f) => [...readFileSync(f, 'utf8').matchAll(/<iframe\b[\s\S]*?\/>/g)].every((m) => /sandbox=/.test(m[0]))))
check('No VITE_ env secrets referenced in client code', grepSrc(/import\.meta\.env\.VITE_[A-Z_]*(SECRET|TOKEN|KEY|PASSWORD)/).length === 0)

// --- Repository hygiene -----------------------------------------------------
const gitignore = readFileSync('.gitignore', 'utf8')
check('.env files are git-ignored', /^\.env/m.test(gitignore))
const tracked = existsSync('.git') ? walk('.').filter((f) => !f.includes('node_modules') && !f.startsWith('.git/') && /(^|\/)\.env(\.|$)/.test(f)) : []
check('No .env file in the working tree', tracked.length === 0, tracked.join(', '))

// --- Hosting headers (Vercel) -----------------------------------------------
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'))
const hdr = Object.fromEntries((vercel.headers?.find((h) => h.source === '/(.*)')?.headers ?? []).map((h) => [h.key.toLowerCase(), h.value]))
check('vercel.json: CSP with frame-ancestors none', /frame-ancestors 'none'/.test(hdr['content-security-policy'] ?? ''))
check('vercel.json: CSP matches the build CSP (plus frame-ancestors)', (hdr['content-security-policy'] ?? '').replace(/ frame-ancestors 'none';/, '') === csp)
for (const k of ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy'])
  check(`vercel.json: ${k}`, !!hdr[k])

// --- Report -----------------------------------------------------------------
let failed = 0
for (const r of results) {
  if (!r.ok) failed++
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${!r.ok && r.detail ? `  →  ${r.detail}` : ''}`)
}
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
