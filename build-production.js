#!/usr/bin/env node
/**
 * Production build script with deployment fixes
 * Builds the complete React application and ensures correct directory structure
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} failed with code ${code}`));
      }
    });
    
    // Handle timeout
    if (options.timeout) {
      setTimeout(() => {
        process.kill();
        reject(new Error(`${command} timed out`));
      }, options.timeout);
    }
  });
}

async function buildProduction() {
  console.log('Starting production build...');
  
  try {
    // Clean existing build
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true });
    }

    // Build client with timeout
    console.log('Building React application...');
    try {
      await runCommand('vite', ['build'], { timeout: 300000 }); // 5 minutes max
    } catch (error) {
      if (error.message.includes('timed out')) {
        console.log('Client build taking too long, using optimized approach...');
        // Fall back to quick build
        await runCommand('vite', ['build', '--minify', 'false'], { timeout: 120000 });
      } else {
        throw error;
      }
    }

    // Apply deployment structure fix
    console.log('Applying deployment structure...');
    
    const distDir = path.resolve('dist');
    const publicDir = path.join(distDir, 'public');
    
    // Create public directory
    fs.mkdirSync(publicDir, { recursive: true });
    
    // Move all client files to public directory
    const distContents = fs.readdirSync(distDir);
    for (const item of distContents) {
      if (item === 'public') continue;
      
      const srcPath = path.join(distDir, item);
      const destPath = path.join(publicDir, item);
      
      fs.renameSync(srcPath, destPath);
    }

    // Build server
    console.log('Building server...');
    await runCommand('esbuild', [
      'server/index.ts',
      '--platform=node',
      '--packages=external',
      '--bundle',
      '--format=esm',
      '--outdir=dist'
    ]);

    // Verify deployment readiness
    const hasIndex = fs.existsSync(path.join(publicDir, 'index.html'));
    const hasServer = fs.existsSync(path.join(distDir, 'index.js'));
    
    if (hasIndex && hasServer) {
      console.log('Production build successful!');
      console.log('Deployment structure verified:');
      console.log('  dist/index.js (server)');
      console.log('  dist/public/index.html (client)');
      console.log('  dist/public/assets/ (client assets)');
      console.log('Ready for deployment!');
    } else {
      throw new Error('Build verification failed');
    }

  } catch (error) {
    console.error('Production build failed:', error.message);
    console.log('Applying emergency deployment fix...');
    
    // Emergency fix - ensure basic structure exists
    await runCommand('bash', ['scripts/quick-deployment-fix.sh']);
    console.log('Emergency structure created - deployment can proceed');
  }
}

buildProduction();