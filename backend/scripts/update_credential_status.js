const pool = require('../db');

async function updateCredentialStatus(uuid, transactionHash, status = 'completed') {
    try {
        const [result] = await pool.query(
            'UPDATE credentials SET blockchain_tx_hash = ?, status = ? WHERE uuid = ?',
            [transactionHash, status, uuid]
        );

        if (result.affectedRows === 0) {
            throw new Error('Credential not found');
        }

        return true;
    } catch (error) {
        console.error('Error updating credential status:', error);
        throw error;
    }
}

// Example usage:
// node update_credential_status.js <uuid> <transactionHash> [status]
if (require.main === module) {
    const [,, uuid, transactionHash, status] = process.argv;
    
    if (!uuid || !transactionHash) {
        console.error('Usage: node update_credential_status.js <uuid> <transactionHash> [status]');
        process.exit(1);
    }

    updateCredentialStatus(uuid, transactionHash, status)
        .then(() => {
            console.log('Credential status updated successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Failed to update credential status:', error);
            process.exit(1);
        });
}

module.exports = { updateCredentialStatus }; 