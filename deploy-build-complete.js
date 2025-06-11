#!/usr/bin/env node
/**
 * Complete deployment build script
 * Builds both client and server with correct directory structure
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building complete application for deployment...');

try {
  // Clean existing build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }

  console.log('Building client application...');
  
  // Build client - this creates dist/ with client files
  execSync('vite build', { stdio: 'inherit' });

  console.log('Restructuring for deployment...');
  
  // Create dist/public and move client files there
  const distDir = path.resolve('dist');
  const publicDir = path.join(distDir, 'public');
  
  // Get all current dist contents
  const distContents = fs.readdirSync(distDir);
  
  // Create public directory
  fs.mkdirSync(publicDir, { recursive: true });
  
  // Move all client files to public
  for (const item of distContents) {
    if (item === 'public') continue;
    
    const srcPath = path.join(distDir, item);
    const destPath = path.join(publicDir, item);
    
    fs.renameSync(srcPath, destPath);
  }

  console.log('Building server...');
  
  // Build server into dist root
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Verify deployment structure
  const hasClientIndex = fs.existsSync(path.join(publicDir, 'index.html'));
  const hasServerIndex = fs.existsSync(path.join(distDir, 'index.js'));
  
  console.log('\nDeployment build completed!');
  console.log(`Client files: ${hasClientIndex ? '✅' : '❌'}`);
  console.log(`Server files: ${hasServerIndex ? '✅' : '❌'}`);
  
  if (hasClientIndex && hasServerIndex) {
    console.log('\n🚀 Ready for deployment!');
    console.log('Structure:');
    console.log('dist/');
    console.log('├── index.js (server)');
    console.log('└── public/');
    console.log('    ├── index.html');
    console.log('    └── assets/');
  } else {
    throw new Error('Build verification failed');
  }

} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}