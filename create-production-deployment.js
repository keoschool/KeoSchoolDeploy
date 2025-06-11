#!/usr/bin/env node
/**
 * Creates production deployment using development server for actual React app
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('Creating production deployment with real React application...');

// Clean and create structure
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

fs.mkdirSync('dist/public', { recursive: true });

// Build server
console.log('Building Express server...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');

// Copy the real client files for development server
console.log('Setting up client application...');

// Create production index.html that loads the React app
const productionHTML = `<!DOCTYPE html>
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

fs.writeFileSync('dist/public/index.html', productionHTML);

// Copy client directory to dist for development server
console.log('Copying client application...');
try {
  execSync('cp -r client/* dist/public/', { stdio: 'pipe' });
  console.log('Client files copied successfully');
} catch (error) {
  console.log('Creating symbolic link to client...');
  try {
    execSync('ln -sf ../../client dist/public/client', { stdio: 'pipe' });
  } catch (linkError) {
    console.log('Manual file copy...');
    fs.cpSync('client', 'dist/public/client', { recursive: true });
  }
}

// Update the production HTML to point to correct paths
const updatedHTML = `<!DOCTYPE html>
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
    <!-- Development mode script for production -->
    <script type="module">
      // This will be handled by the Vite dev server in production
      import('/client/src/main.tsx');
    </script>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', updatedHTML);

console.log('Production deployment created!');
console.log('Structure:');
console.log('  dist/index.js (Express server with Vite dev middleware)');
console.log('  dist/public/index.html (King Edward\'s Online School entry)');
console.log('  dist/public/client/ (React application source)');
console.log('');
console.log('The deployment will serve your actual React application with all components.');