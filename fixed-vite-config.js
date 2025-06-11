import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@assets': resolve(__dirname, './attached_assets'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html'),
        ai: resolve(__dirname, 'client/ai.html'),
        aiStudent: resolve(__dirname, 'client/ai-student.html'),
        aiTeacher: resolve(__dirname, 'client/ai-teacher.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['client'],
  },
  root: 'client',
})