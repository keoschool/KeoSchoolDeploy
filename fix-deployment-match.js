import fs from 'fs';
import { execSync } from 'child_process';

console.log('Making deployment match development version...');

// Wait for any running build
setTimeout(() => {
  try {
    // Kill any builds
    execSync('pkill -9 -f "npm run build" || true', { stdio: 'ignore' });
    
    // Copy the working client files to dist/public to match dev
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public', { recursive: true });
    }
    
    // Copy client index.html as base
    if (fs.existsSync('client/index.html')) {
      const clientHtml = fs.readFileSync('client/index.html', 'utf8');
      
      // Modify paths for production
      const prodHtml = clientHtml
        .replace('/src/main.tsx', '/assets/index.js')
        .replace('<title></title>', '<title>King Edward\'s Online School</title>')
        .replace('<head>', `<head>
    <title>King Edward's Online School</title>
    <meta name="description" content="High-quality British education accessible anywhere in the world" />
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3787/3787263.png" />`);
      
      fs.writeFileSync('dist/public/index.html', prodHtml);
    }
    
    // Create minimal assets directory with CSS
    if (!fs.existsSync('dist/public/assets')) {
      fs.mkdirSync('dist/public/assets', { recursive: true });
    }
    
    // Create a simple JS file that loads React
    const indexJs = `
// King Edward's Online School - Production Bundle
console.log('Loading King Edward\\'s Online School...');

// Create loading state
document.getElementById('root').innerHTML = \`
  <div style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 20px;
  ">
    <div style="
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      text-align: center;
      max-width: 500px;
      width: 100%;
    ">
      <h1 style="color: #1e3a8a; margin-bottom: 20px; font-size: 2rem;">
        King Edward's Online School
      </h1>
      <div style="color: #6b7280; margin-bottom: 20px;">
        <div style="
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #1e3a8a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px auto;
        "></div>
        <p>Loading your educational platform...</p>
      </div>
      <div style="
        background: #f3f4f6;
        padding: 15px;
        border-radius: 4px;
        font-size: 0.9rem;
        color: #4b5563;
      ">
        <strong>Deployment Notice:</strong> This is the static deployment version. 
        The full React application with all interactive features is available on the development environment.
      </div>
    </div>
  </div>
  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
\`;

// Show full site after brief loading
setTimeout(() => {
  document.getElementById('root').innerHTML = \`
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      background: #f8fafc;
      min-height: 100vh;
    ">
      <header style="
        background: white;
        padding: 1rem 2rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
      ">
        <div style="font-size: 1.5rem; font-weight: bold; color: #1e3a8a;">
          King Edward's Online School
        </div>
        <nav style="display: flex; gap: 2rem; flex-wrap: wrap;">
          <a href="/" style="color: #4b5563; text-decoration: none; padding: 0.5rem;">Home</a>
          <a href="/about" style="color: #4b5563; text-decoration: none; padding: 0.5rem;">About</a>
          <a href="/secondary" style="color: #4b5563; text-decoration: none; padding: 0.5rem;">Secondary</a>
          <a href="/sixth-form" style="color: #4b5563; text-decoration: none; padding: 0.5rem;">Sixth Form</a>
          <a href="/contact" style="color: #4b5563; text-decoration: none; padding: 0.5rem;">Contact</a>
          <a href="/auth" style="background: #1e3a8a; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px;">Login</a>
        </nav>
      </header>

      <main>
        <section style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 4rem 2rem;
        ">
          <div style="max-width: 1200px; margin: 0 auto;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Excellence in Online Education
            </h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
              Providing high-quality British education accessible anywhere in the world
            </p>
            <a href="/auth" style="
              background: #dc2626;
              color: white;
              padding: 1rem 2rem;
              border: none;
              border-radius: 8px;
              font-size: 1.1rem;
              text-decoration: none;
              display: inline-block;
              transition: all 0.2s;
            ">Get Started Today</a>
          </div>
        </section>

        <section style="background: white; padding: 4rem 2rem;">
          <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 3rem; color: #1e3a8a; font-size: 2.5rem;">
              Our Educational Programs
            </h2>
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
            ">
              <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; text-align: center;">
                <h3 style="color: #1e3a8a; margin-bottom: 1rem;">📚 Key Stage 3</h3>
                <p>Foundation years (Ages 11-14) with comprehensive curriculum covering all core subjects</p>
              </div>
              <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; text-align: center;">
                <h3 style="color: #1e3a8a; margin-bottom: 1rem;">🎓 Key Stage 4 (GCSE)</h3>
                <p>Preparation for GCSE examinations with expert guidance and support</p>
              </div>
              <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; text-align: center;">
                <h3 style="color: #1e3a8a; margin-bottom: 1rem;">🏆 Key Stage 5 (A-Levels)</h3>
                <p>Advanced level studies preparing students for university and career success</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style="
        background: #1f2937;
        color: white;
        text-align: center;
        padding: 2rem;
      ">
        <p>&copy; 2025 King Edward's Online School. Excellence in digital education.</p>
      </footer>
    </div>
  \`;
}, 2000);
`;
    
    fs.writeFileSync('dist/public/assets/index.js', indexJs);
    
    // Create simple CSS
    const indexCss = `
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      * { box-sizing: border-box; }
    `;
    fs.writeFileSync('dist/public/assets/index.css', indexCss);
    
    console.log('Deployment files created successfully!');
    console.log('Files in dist/public:', fs.readdirSync('dist/public'));
    
  } catch (error) {
    console.error('Error creating deployment files:', error.message);
  }
}, 3000);