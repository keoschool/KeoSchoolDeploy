#!/usr/bin/env node

// A standalone Express server with minimal database functionality
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const session = require('express-session');
const connectPgSimple = require('connect-pg-simple');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Session setup
const PostgresStore = connectPgSimple(session);
const sessionStore = new PostgresStore({
  pool,
  createTableIfMissing: true,
});

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'king-edwards-online-school-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${derivedKey.toString('hex')}.${salt}`);
    });
  });
}

async function comparePasswords(supplied, stored) {
  const [hash, salt] = stored.split('.');
  return new Promise((resolve, reject) => {
    crypto.scrypt(supplied, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        derivedKey
      ));
    });
  });
}

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    const user = userResult.rows[0];
    
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect password' });
    }
    
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    const user = userResult.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, name, type } = req.body;
    
    // Check if user already exists
    const existingUserResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = await hashPassword(password);
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, password, email, name, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, hashedPassword, email, name, type || 'student']
    );
    
    const newUser = result.rows[0];
    
    // Log in the new user
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after registration' });
      }
      return res.status(201).json(newUser);
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  }
  return res.status(401).json({ message: 'Not authenticated' });
});

// Basic API routes
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Standalone server running at http://0.0.0.0:${PORT}`);
});