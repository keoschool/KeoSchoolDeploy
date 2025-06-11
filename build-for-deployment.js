#!/usr/bin/env node
/**
 * Deployment-ready build script that creates the correct directory structure
 * This replaces the default build command for deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building application for deployment...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('Cleaned previous build');
  }

  // Run vite build (outputs to dist/)
  console.log('Building client assets...');
  execSync('vite build', { stdio: 'inherit' });

  // Create dist/public directory and move client files there
  const distDir = path.resolve('dist');
  const publicDir = path.join(distDir, 'public');
  
  console.log('Setting up deployment directory structure...');
  
  // Create public directory
  fs.mkdirSync(publicDir, { recursive: true });
  
  // Move all current dist contents to dist/public
  const distContents = fs.readdirSync(distDir);
  for (const item of distContents) {
    if (item === 'public') continue;
    
    const srcPath = path.join(distDir, item);
    const destPath = path.join(publicDir, item);
    
    fs.renameSync(srcPath, destPath);
  }
  
  console.log('Client assets moved to dist/public');

  // Build server
  console.log('Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Verify the structure
  console.log('\nBuild completed! Directory structure:');
  console.log('dist/');
  console.log('├── index.js (server)');
  console.log('└── public/ (client assets)');
  
  const publicContents = fs.readdirSync(publicDir);
  publicContents.forEach(file => {
    console.log(`    ├── ${file}`);
  });

  console.log('\n✅ Deployment build ready!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}