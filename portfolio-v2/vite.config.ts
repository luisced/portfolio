import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@features': '/src/features',
      '@contexts': '/src/contexts',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@types': '/src/types',
      '@assets': '/src/assets'
    }
  },
  server: {
    cors: {
      origin: ['https://luiscedillo.com', 'http://luiscedillo.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
  },
  build: {
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          spline: ['@splinetool/react-spline']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@splinetool/react-spline']
  }
});
