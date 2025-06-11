import { spawn } from 'child_process';

console.log('Starting simplified server...');

// Start the simple server using Node
const serverProcess = spawn('node', ['simple-server.cjs'], { stdio: 'inherit' });

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