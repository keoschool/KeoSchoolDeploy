#!/usr/bin/env node
/**
 * This script fixes the vite.config.ts file and starts the server
 */
import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Fixing vite.config.ts for ES module compatibility...');
try {
  // Run the fix-vite-config script
  execSync('node fix-vite-config.js', { stdio: 'inherit' });
  
  console.log('Starting the server with fixed configuration...');
  
  // Start the server
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
  
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}