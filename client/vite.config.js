import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
})
