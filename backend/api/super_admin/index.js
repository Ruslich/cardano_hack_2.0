const express = require('express');
const { loginSuperAdmin, getUniversities, verifyUniversity } = require('./controller');

const router = express.Router();

router.post('/super-admin/login', loginSuperAdmin);
router.get('/super-admin/universities', getUniversities);
router.post('/super-admin/universities/:id/verify', verifyUniversity);

module.exports = router; 