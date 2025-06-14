const express = require('express');
const multer = require('multer');
const path = require('path');
const { registerUniversity } = require('./controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../storage'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'));
    }
    cb(null, true);
  }
});

router.post(
  '/register-university',
  upload.fields([
    { name: 'letterFile', maxCount: 1 },
    { name: 'certificateFile', maxCount: 1 }
  ]),
  registerUniversity
);

module.exports = router;
