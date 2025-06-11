#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

// Set environment variables
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'king-edwards-online-school-secret';

// Run the server
console.log('Starting standalone server...');

// Run the simplified server without database functionality
exec('node simple-server.cjs', (error, stdout, stderr) => {
  if (error) {
    console.error(`Server error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Server stderr: ${stderr}`);
    return;
  }
  console.log(`Server stdout: ${stdout}`);
});