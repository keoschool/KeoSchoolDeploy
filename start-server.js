// Script to start the server without vite config issues
import { spawn } from 'child_process';

console.log('Starting modified server without vite dependencies...');

// Start the server
const serverProcess = spawn('tsx', ['server/index-mod.ts'], { stdio: 'inherit' });

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});