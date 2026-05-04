import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/vehiculos': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/ordenes': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/reportes': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})