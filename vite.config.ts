import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the build works on GitHub Pages, sub-paths and static CDNs.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
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
