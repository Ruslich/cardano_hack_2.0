const express = require('express');
const router = express.Router();
const { validateUniversityToken } = require('../middleware/auth');
const { getUniversityInfo } = require('./controller');

// Get university info using API token
router.get('/info', validateUniversityToken, getUniversityInfo);

// ... existing routes ...

module.exports = router; 