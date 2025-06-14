const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticateUniversity } = require('../../middleware/auth');

// Apply authentication middleware to all routes except logout
router.use((req, res, next) => {
  if (req.path === '/logout') {
    next();
  } else {
    authenticateUniversity(req, res, next);
  }
});

// Get university profile
router.get('/profile', controller.getProfile);

// Regenerate API token
router.post('/regenerate-token', controller.regenerateToken);

// Logout
router.post('/logout', controller.logout);

module.exports = router; 