#!/usr/bin/env node

// A simplified Express server in CommonJS format
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic API route for testing
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Serve static client files
const clientPath = path.join(__dirname, 'client');
app.use(express.static(clientPath));

// AI Routes
app.get('/ai', (req, res) => {
  res.sendFile(path.join(clientPath, 'ai.html'));
});

app.get('/ai/student', (req, res) => {
  res.sendFile(path.join(clientPath, 'ai-student.html'));
});

app.get('/ai/teacher', (req, res) => {
  res.sendFile(path.join(clientPath, 'ai-teacher.html'));
});

// Simple catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simplified server running at http://0.0.0.0:${PORT}`);
});