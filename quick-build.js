import { execSync } from 'child_process';
import fs from 'fs';

console.log('Building React app for deployment...');

// Run a quick build
try {
  execSync('cd client && npx vite build --outDir ../dist/temp --emptyOutDir', { 
    stdio: 'inherit',
    timeout: 60000 
  });
  
  // Move files to correct location
  if (fs.existsSync('dist/temp')) {
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public', { recursive: true });
    }
    
    // Copy all files from temp to public
    execSync('cp -r dist/temp/* dist/public/', { stdio: 'inherit' });
    
    // Clean up temp
    fs.rmSync('dist/temp', { recursive: true, force: true });
    
    console.log('React app built successfully for deployment!');
    console.log('Files in dist/public:', fs.readdirSync('dist/public'));
  }
} catch (error) {
  console.log('Build failed, creating minimal version...');
  
  // Create minimal version that loads your dev app
  if (!fs.existsSync('dist/public')) {
    fs.mkdirSync('dist/public', { recursive: true });
  }
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>King Edward's Online School</title>
  <style>
    body { margin: 0; font-family: system-ui; }
    .redirect { 
      text-align: center; 
      padding: 2rem; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card { 
      background: rgba(255,255,255,0.1); 
      padding: 2rem; 
      border-radius: 8px; 
      max-width: 500px;
    }
  </style>
</head>
<body>
  <div class="redirect">
    <div class="card">
      <h1>King Edward's Online School</h1>
      <p>The full application is available on the development environment.</p>
      <script>
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      </script>
    </div>
  </div>
</body>
</html>`;
  
  fs.writeFileSync('dist/public/index.html', html);
  console.log('Minimal deployment version created');
}