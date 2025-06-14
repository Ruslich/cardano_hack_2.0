const NFTService = require('../../../services/nftService');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../../db');

exports.issueCredential = async (req, res) => {
    try {
        // Validate file upload
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Get university details from the request (set by middleware)
        const university = req.university;
        if (!university) {
            return res.status(401).json({ error: 'University not authenticated' });
        }

        // Calculate document hash
        const fileBuffer = fs.readFileSync(req.file.path);
        const documentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // Prepare basic metadata
        const metadata = {
            fileName: req.file.originalname,
            issuedAt: new Date().toISOString(),
            university: {
                id: university.id,
                name: university.name,
                walletAddress: university.wallet_address
            }
        };

        // Call NFT service to mint the credential
        const result = await NFTService.uploadAndMint(req.file.path, metadata);

        // Store credential information
        const [credentialResult] = await pool.execute(`
            INSERT INTO credentials (
                uuid,
                university_id,
                credential_type,
                document_hash,
                metadata,
                blockchain_tx_hash,
                nft_policy_id,
                nft_asset_name,
                wallet_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            uuidv4(),
            university.id,
            'Certificate', // Default type for now
            documentHash,
            JSON.stringify(metadata),
            result.mint?.transactionHash,
            result.mint?.policyId,
            result.mint?.assetName,
            university.wallet_address
        ]);

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'Credential issued successfully',
            data: {
                uuid: credentialResult.insertId,
                transactionHash: result.mint?.transactionHash,
                nftPolicyId: result.mint?.policyId,
                nftAssetName: result.mint?.assetName,
                documentHash,
                fileName: req.file.originalname,
                university: {
                    id: university.id,
                    name: university.name
                }
            }
        });
    } catch (error) {
        console.error('Error in issueCredential:', error);
        res.status(500).json({ 
            error: 'Failed to issue credential',
            details: error.response?.data || error.message 
        });
    }
};

exports.getWalletNFTs = async (req, res) => {
    try {
        const nfts = await NFTService.getWalletNFTs();
        res.json(nfts);
    } catch (error) {
        console.error('Error in getWalletNFTs:', error);
        res.status(500).json({ 
            error: 'Failed to fetch wallet NFTs',
            details: error.response?.data || error.message 
        });
    }
};

exports.createCollection = async (req, res) => {
    try {
        const { assetIds } = req.body;
        if (!Array.isArray(assetIds) || assetIds.length === 0) {
            return res.status(400).json({ error: 'Invalid asset IDs' });
        }

        const result = await NFTService.createCollection(assetIds);
        res.json(result);
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ error: 'Failed to create collection', details: error.message });
    }
};

exports.getCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const collection = await NFTService.getCollection(collectionId);
        res.json(collection);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ error: 'Failed to fetch collection', details: error.message });
    }
}; 