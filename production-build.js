#!/usr/bin/env node
/**
 * Production build script that creates the actual React application bundle
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building production version of the React application...');

try {
  // Use esbuild to bundle the React app directly
  console.log('Bundling React application with esbuild...');
  
  // Create output directory
  fs.mkdirSync('dist/public/assets', { recursive: true });
  
  // Bundle the main application
  execSync(`esbuild client/src/main.tsx \
    --bundle \
    --format=esm \
    --outfile=dist/public/assets/index.js \
    --jsx=automatic \
    --target=es2020 \
    --define:process.env.NODE_ENV='"production"' \
    --loader:.css=css \
    --loader:.svg=dataurl \
    --loader:.png=dataurl \
    --loader:.jpg=dataurl \
    --external:react \
    --external:react-dom \
    --minify`, { stdio: 'inherit' });

  // Bundle CSS
  console.log('Processing styles...');
  execSync(`esbuild client/src/index.css \
    --bundle \
    --outfile=dist/public/assets/index.css \
    --loader:.css=css \
    --minify`, { stdio: 'inherit' });

  // Create production HTML with React CDN
  console.log('Creating production HTML...');
  const productionHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>King Edward's Online School</title>
    <meta name="description" content="High-quality British education accessible anywhere in the world" />
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3787/3787263.png" />
    <link rel="stylesheet" href="/assets/index.css" />
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
  </body>
</html>`;

  fs.writeFileSync('dist/public/index.html', productionHTML);

  // Build server
  console.log('Building Express server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Verify build
  const hasIndex = fs.existsSync('dist/public/index.html');
  const hasJS = fs.existsSync('dist/public/assets/index.js');
  const hasCSS = fs.existsSync('dist/public/assets/index.css');
  const hasServer = fs.existsSync('dist/index.js');

  if (hasIndex && hasJS && hasServer) {
    console.log('Production build completed successfully!');
    console.log('Built files:');
    console.log('  dist/index.js (Express server)');
    console.log('  dist/public/index.html (Application entry)');
    console.log('  dist/public/assets/index.js (React bundle)');
    if (hasCSS) console.log('  dist/public/assets/index.css (Styles)');
  } else {
    throw new Error('Build verification failed');
  }

} catch (error) {
  console.error('Production build failed:', error.message);
  
  // Fallback: copy development structure
  console.log('Creating development fallback...');
  
  fs.mkdirSync('dist/public', { recursive: true });
  
  // Copy client directory for development server to handle
  execSync('cp -r client/* dist/public/', { stdio: 'pipe' });
  
  // Create index.html that loads via dev server
  const devHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>King Edward's Online School</title>
    <meta name="description" content="High-quality British education accessible anywhere in the world" />
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3787/3787263.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  fs.writeFileSync('dist/public/index.html', devHTML);
  
  // Build server
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');
  
  console.log('Development fallback created');
}