import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `vite build --mode pages` gera a versão do GitHub Pages, servida em /textory/.
// Qualquer outro build (Vercel, dev) continua na raiz "/".
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/textory/' : '/',
  plugins: [react(), tailwindcss()],
}))
