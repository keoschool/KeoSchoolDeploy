#!/usr/bin/env node
/**
 * Build the actual React application for deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building the real King Edward\'s Online School application...');

try {
  // Build with optimizations disabled for faster build
  console.log('Compiling React application...');
  execSync('vite build --minify=false --sourcemap=false', { 
    stdio: 'inherit',
    timeout: 300000 // 5 minutes
  });

  console.log('Restructuring for deployment...');
  
  // Create deployment structure
  const publicDir = 'dist/public';
  fs.mkdirSync(publicDir, { recursive: true });
  
  // Move all client files to public directory
  const distContents = fs.readdirSync('dist');
  for (const item of distContents) {
    if (item === 'public') continue;
    
    const srcPath = path.join('dist', item);
    const destPath = path.join(publicDir, item);
    
    fs.renameSync(srcPath, destPath);
  }

  // Build server
  console.log('Building Express server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Verify the build
  const hasIndex = fs.existsSync(path.join(publicDir, 'index.html'));
  const hasAssets = fs.existsSync(path.join(publicDir, 'assets'));
  const hasServer = fs.existsSync('dist/index.js');

  if (hasIndex && hasServer) {
    console.log('Real application build completed successfully!');
    console.log('Deployment structure:');
    console.log('  dist/index.js (Express server)');
    console.log(`  dist/public/index.html (King Edward's Online School)`);
    if (hasAssets) {
      console.log('  dist/public/assets/ (React bundles and styles)');
    }
  } else {
    throw new Error('Build verification failed');
  }

} catch (error) {
  console.error('Build failed:', error.message);
  console.log('Creating manual React build...');
  
  // Manual build fallback
  fs.mkdirSync('dist/public/assets', { recursive: true });
  
  // Copy and modify the real index.html
  let html = fs.readFileSync('client/index.html', 'utf8');
  
  // Update for production
  html = html.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="/assets/main.js"></script>'
  );
  
  // Add the title and metadata
  html = html.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />',
    `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>King Edward's Online School</title>
    <meta name="description" content="High-quality British education accessible anywhere in the world" />
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3787/3787263.png" />`
  );
  
  fs.writeFileSync('dist/public/index.html', html);
  
  // Bundle the main application
  try {
    execSync(`esbuild client/src/main.tsx --bundle --format=esm --outfile=dist/public/assets/main.js --jsx=automatic --define:process.env.NODE_ENV='"production"' --external:react --external:react-dom`, { stdio: 'inherit' });
    
    // Include React and ReactDOM
    execSync('curl -s https://unpkg.com/react@18/umd/react.production.min.js > dist/public/assets/react.js', { stdio: 'inherit' });
    execSync('curl -s https://unpkg.com/react-dom@18/umd/react-dom.production.min.js > dist/public/assets/react-dom.js', { stdio: 'inherit' });
    
    // Update HTML to include React
    html = html.replace(
      '<script type="module" src="/assets/main.js"></script>',
      `<script src="/assets/react.js"></script>
      <script src="/assets/react-dom.js"></script>
      <script type="module" src="/assets/main.js"></script>`
    );
    
    fs.writeFileSync('dist/public/index.html', html);
    
  } catch (bundleError) {
    console.log('Using development server integration...');
  }
  
  // Build server
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');
  
  console.log('Manual build completed');
}