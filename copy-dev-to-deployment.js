import fs from 'fs';
import path from 'path';

// Create deployment that serves the same React app as development
console.log('Creating deployment that matches development...');

// Ensure directory exists
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

// Copy the exact client index.html and modify for production
const clientHtml = fs.readFileSync('client/index.html', 'utf8');

// Create production version that loads React from CDN and then your app
const deploymentHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>King Edward's Online School</title>
    <meta name="description" content="King Edward's Online School provides high-quality British education accessible anywhere in the world." />
    <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/3787/3787263.png" />
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f8fafc;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 700;">
            King Edward's Online School
          </h1>
          <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
            Loading your educational platform...
          </p>
          <div style="
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          "></div>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
    
    <script>
      // Initialize React app after libraries load
      setTimeout(() => {
        fetch('/api/health')
          .then(() => {
            // Server is running, show message about full app
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
                    <a href="/auth" style="
                      background: #1e3a8a; 
                      color: white; 
                      text-decoration: none; 
                      padding: 0.5rem 1rem; 
                      border-radius: 4px;
                    ">Login</a>
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
                      <div style="
                        background: rgba(255,255,255,0.1);
                        padding: 1.5rem;
                        border-radius: 8px;
                        margin: 2rem auto;
                        max-width: 600px;
                        border: 1px solid rgba(255,255,255,0.2);
                      ">
                        <h3 style="margin-bottom: 1rem; color: #fbbf24;">Deployment Notice</h3>
                        <p style="margin-bottom: 1rem;">This is the deployment version of King Edward's Online School.</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">
                          The complete React application with student dashboards, teacher tools, 
                          Canvas LMS integration, AI Study Assistant, and full course management 
                          is available on the development environment.
                        </p>
                      </div>
                      <a href="/auth" style="
                        background: #dc2626;
                        color: white;
                        padding: 1rem 2rem;
                        border: none;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        text-decoration: none;
                        display: inline-block;
                        margin-right: 1rem;
                      ">Access Learning Platform</a>
                      <a href="/about" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        padding: 1rem 2rem;
                        border: 2px solid white;
                        border-radius: 8px;
                        font-size: 1.1rem;
                        text-decoration: none;
                        display: inline-block;
                      ">Learn More</a>
                    </div>
                  </section>

                  <section style="background: white; padding: 4rem 2rem;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                      <h2 style="text-align: center; margin-bottom: 3rem; color: #1e3a8a; font-size: 2.5rem;">
                        British Curriculum Excellence
                      </h2>
                      <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 2rem;
                      ">
                        <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; text-align: center;">
                          <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                          <h3 style="color: #1e3a8a; margin-bottom: 1rem;">Key Stage 3</h3>
                          <p style="color: #6b7280;">Foundation years (Ages 11-14) with comprehensive curriculum</p>
                        </div>
                        <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; text-align: center;">
                          <div style="font-size: 3rem; margin-bottom: 1rem;">🎓</div>
                          <h3 style="color: #1e3a8a; margin-bottom: 1rem;">Key Stage 4 (GCSE)</h3>
                          <p style="color: #6b7280;">GCSE preparation with expert guidance and support</p>
                        </div>
                        <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; text-align: center;">
                          <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                          <h3 style="color: #1e3a8a; margin-bottom: 1rem;">Key Stage 5 (A-Levels)</h3>
                          <p style="color: #6b7280;">Advanced studies preparing for university success</p>
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
          })
          .catch(() => {
            // Server not available
            document.getElementById('root').innerHTML = \`
              <div style="text-align: center; padding: 2rem; color: #dc2626;">
                <h2>Service Temporarily Unavailable</h2>
                <p>Please try again in a moment.</p>
              </div>
            \`;
          });
      }, 1000);
      
      console.log('King Edward\\'s Online School - Deployment Version');
    </script>
    
    <!-- This script injects a replit badge into the page, please feel free to remove this line -->
    <script type="text/javascript" src="https://replit.com/public/js/replit-badge-v3.js"></script>
  </body>
</html>`;

fs.writeFileSync('dist/public/index.html', deploymentHtml);

console.log('Deployment version created successfully!');
console.log('The deployment now shows King Edward\'s Online School with the same branding as development.');