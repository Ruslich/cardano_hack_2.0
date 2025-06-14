const express = require('express');
const router = express.Router();
const { updateCredentialStatus } = require('../scripts/update_credential_status');

router.post('/', async (req, res) => {
    try {
        const { uuid, transaction_hash, status } = req.body;

        if (!uuid || !transaction_hash) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        await updateCredentialStatus(uuid, transaction_hash, status);

        res.json({
            success: true,
            message: 'Credential status updated successfully'
        });
    } catch (error) {
        console.error('Error updating credential status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 