#!/usr/bin/env node
/**
 * Quick fix for deployment directory structure
 * Creates dist/public structure that the server expects
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Fixing deployment directory structure...');

// First, run a quick build to create basic structure
try {
  // Clean existing dist
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }

  // Create minimal structure first
  fs.mkdirSync('dist/public', { recursive: true });

  // Create a basic index.html for immediate deployment
  const basicIndex = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Online School Platform</title>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

  fs.writeFileSync('dist/public/index.html', basicIndex);

  // Create assets directory
  fs.mkdirSync('dist/public/assets', { recursive: true });

  // Create minimal CSS and JS files
  fs.writeFileSync('dist/public/assets/index.css', '/* App styles will be built here */');
  fs.writeFileSync('dist/public/assets/index.js', '// App will be built here');

  // Build server
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  console.log('✅ Basic deployment structure created!');
  console.log('dist/');
  console.log('├── index.js (server)');
  console.log('└── public/');
  console.log('    ├── index.html');
  console.log('    └── assets/');

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}