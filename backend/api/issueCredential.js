const express = require('express');
const multer = require('multer');
const path = require('path');
const { validateUniversityToken } = require('../middleware/auth');
const pool = require('../db');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF, PNG, and JPG files are allowed.'));
    }
    cb(null, true);
  }
});

router.post('/issue-credential', validateUniversityToken, upload.single('document'), async (req, res) => {
  console.log('Received request:', {
    file: req.file,
    university: req.university
  });

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.university) {
      return res.status(401).json({ error: 'University not authenticated' });
    }

    // Prepare form data for Python service
    const formData = new FormData();
    formData.append('document', fs.createReadStream(req.file.path));
    formData.append('studentId', req.body.studentId);
    formData.append('name', req.body.name);
    formData.append('universityId', req.university.id);
    formData.append('universityName', req.university.name);
    formData.append('walletAddress', req.university.wallet_address);

    // Send to Python service
    const pythonResponse = await fetch('http://localhost:8001/upload', {
      method: 'POST',
      body: formData
    });

    if (!pythonResponse.ok) {
      throw new Error('Failed to process document with Python service');
    }

    const result = await pythonResponse.json();

    // Save NFT information to database
    const [insertResult] = await pool.execute(
      'INSERT INTO credentials (university_id, student_id, student_name, document_path, nft_asset_id, transaction_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [req.university.id, req.body.studentId, req.body.name, req.file.path, result.nft_asset_id, result.transaction_hash]
    );

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: {
        nftAssetId: result.nft_asset_id,
        transactionHash: result.transaction_hash
      }
    });
  } catch (error) {
    console.error('Error in issue-credential:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 