const express = require('express');
const multer = require('multer');
const path = require('path');
const { validateUniversityToken } = require('../middleware/auth');
const pool = require('../db');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', validateUniversityToken, upload.single('document'), async (req, res) => {
  try {
    console.log('Received request:', {
      file: req.file,
      university: req.university
    });

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.university) {
      return res.status(401).json({ error: 'University not authenticated' });
    }

    // Prepare form data for Python service
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));
    formData.append('wallet_address', req.university.wallet_address);

    // Call the Python service
    const pythonServiceUrl = 'http://localhost:8001/upload';
    const response = await fetch(pythonServiceUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process document with Python service');
    }

    const result = await response.json();
    console.log('Python service response:', result);

    // Generate a temporary transaction hash if none is provided
    const tempTxHash = result.transaction_hash || `pending_${Date.now()}`;

    // Save credential information to database
    const [credentialResult] = await pool.execute(
      `INSERT INTO credentials 
       (uuid, nft_asset_name, blockchain_tx_hash, file_name, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        result.nft_asset_name,
        tempTxHash,
        req.file.originalname,
        result.transaction_hash ? 'completed' : 'pending'
      ]
    );

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      status: 'success',
      data: {
        nftAssetName: result.nft_asset_name,
        transactionHash: tempTxHash,
        documentPath: req.file.path,
        status: result.transaction_hash ? 'completed' : 'pending'
      }
    });

  } catch (error) {
    console.error('Error in issue-credential:', error);
    if (req.file) {
      // Clean up the uploaded file in case of error
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 