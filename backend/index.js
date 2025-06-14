const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./db');
require('dotenv').config();

const app = express();

// Session configuration
const sessionStore = new MySQLStore({
  expiration: 24 * 60 * 60 * 1000, // 24 hours
  createDatabaseTable: true
}, pool);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/backend/storage', express.static(path.join(__dirname, 'storage')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const registerRouter = require('./api/register');
const superAdminRouter = require('./api/super_admin');
const universityRouter = require('./api/university');

app.use('/api', registerRouter);
app.use('/api', superAdminRouter);
app.use('/api/university', universityRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 