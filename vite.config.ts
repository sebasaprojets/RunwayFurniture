import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Security headers for the static build. GitHub Pages cannot send HTTP headers, so the policy ships as
 * <meta> tags. Only applied to the production build: the dev server relies on inline scripts for HMR.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  'frame-src https://www.youtube-nocookie.com',
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

function securityMeta(): Plugin {
  return {
    name: 'security-meta',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
      { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
    ],
  }
}

/**
 * Points the boot script at the opening film's 3D chunk, so a first visit starts downloading it
 * straight away (in parallel with the rest of the site) instead of after the main script runs.
 */
function preloadIntro(): Plugin {
  return {
    name: 'preload-intro',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const chunk = Object.values(ctx.bundle ?? {}).find((c) => c.type === 'chunk' && c.name === 'IntroScene')
        if (!chunk) return html
        return html.replace('<script src="./boot.js"></script>', `<script src="./boot.js" data-intro="./${chunk.fileName}"></script>`)
      },
    },
  }
}

// Relative base so the build works on GitHub Pages, sub-paths and static CDNs.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), securityMeta(), preloadIntro()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['motion/react'],
          gsap: ['gsap', 'gsap/ScrollTrigger', 'lenis'],
        },
      },
    },
  },
})
