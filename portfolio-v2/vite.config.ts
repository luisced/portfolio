import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: ['https://luiscedillo.com', 'http://luiscedillo.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  },
  build: {
    // Target modern browsers for smaller bundle size
    target: 'es2018',
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          spline: ['@splinetool/react-spline']
        }
      }
    },
    // Optimize asset handling
    assetsInlineLimit: 4096, // 4kb - smaller assets will be inlined
    chunkSizeWarningLimit: 1000, // Increase warning limit for chunks
  },
  // Optimize asset handling
  optimizeDeps: {
    include: ['react', 'react-dom', '@splinetool/react-spline']
  }
})
