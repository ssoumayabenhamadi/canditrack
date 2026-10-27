import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Redirige les appels /api vers Laravel : pas de problème de CORS en local
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
