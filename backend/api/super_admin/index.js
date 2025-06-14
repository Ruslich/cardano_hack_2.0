const express = require('express');
const { loginSuperAdmin, getUniversities, verifyUniversity, approveUniversityFull } = require('./controller');

const router = express.Router();

router.post('/super-admin/login', loginSuperAdmin);
router.get('/super-admin/universities', getUniversities);
router.post('/super-admin/universities/:id/verify', verifyUniversity);
router.post('/super-admin/approve-university/:uuid', approveUniversityFull);

module.exports = router; 