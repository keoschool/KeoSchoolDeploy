import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy the ESM-compatible vite config
fs.copyFileSync(
  path.join(__dirname, 'temp-vite.config.js'),
  path.join(__dirname, 'vite.config.ts')
);

// Start the server using tsx
const serverProcess = spawn('tsx', ['server/index.ts'], { stdio: 'inherit' });

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