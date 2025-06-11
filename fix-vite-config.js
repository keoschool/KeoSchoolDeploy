#!/usr/bin/env node
/**
 * This script fixes the vite.config.ts file to work with ES Modules
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The fixed ESM-compatible version of vite.config.ts
const fixedConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['client'],
  },
  root: 'client',
});
`;

// Create a backup of the original file
try {
  console.log('Creating backup of original vite.config.ts...');
  if (fs.existsSync('vite.config.ts')) {
    fs.copyFileSync('vite.config.ts', 'vite.config.ts.bak');
    console.log('Backup created as vite.config.ts.bak');
  }

  // Write the fixed version
  console.log('Writing ES module compatible version of vite.config.ts...');
  fs.writeFileSync('vite.config.ts', fixedConfig);
  console.log('Done! vite.config.ts has been fixed for ES module compatibility.');
} catch (error) {
  console.error('Error:', error.message);
}