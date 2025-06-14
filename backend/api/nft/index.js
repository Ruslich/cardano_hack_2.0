const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { validateUniversityToken } = require('../../middleware/auth');
const controller = require('./controller');

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
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, PNG, and JPG files are allowed.'));
        }
    }
});

// Issue credential (mint NFT) using university API token
router.post('/issue-credential', validateUniversityToken, upload.single('document'), controller.issueCredential);

// Get wallet NFTs
router.get('/wallet-nfts', validateUniversityToken, controller.getWalletNFTs);

// Create collection
router.post('/create-collection', validateUniversityToken, controller.createCollection);

// Get collection
router.get('/collection/:collectionId', validateUniversityToken, controller.getCollection);

module.exports = router; 