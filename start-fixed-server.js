// This script fixes the vite.config.ts file and starts the server
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Print a message
console.log('Fixing vite.config.ts for ESM compatibility...');

// ESM-compatible vite config
const esmCompatibleConfig = `
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

// Create a backup of the original vite.config.ts
try {
  if (fs.existsSync('vite.config.ts')) {
    fs.copyFileSync('vite.config.ts', 'vite.config.ts.bak');
  }
  
  // Write the ESM-compatible config
  fs.writeFileSync('vite.config.ts', esmCompatibleConfig);
  console.log('Successfully updated vite.config.ts');
  
  // Start the server using simple-server.cjs
  console.log('Starting the simple server...');
  const serverProcess = spawn('node', ['simple-server.cjs'], { stdio: 'inherit' });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle termination signals
  process.on('SIGINT', () => {
    serverProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    serverProcess.kill('SIGTERM');
  });
  
} catch (error) {
  console.error('Error:', error);
}