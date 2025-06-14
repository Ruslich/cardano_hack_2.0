const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class NFTService {
    constructor() {
        this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8001';
    }

    async uploadAndMint(filePath, metadata) {
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            // Add metadata to the request
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await axios.post(`${this.pythonServiceUrl}/upload`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error in uploadAndMint:', error.response?.data || error.message);
            throw error;
        }
    }

    async getWalletNFTs() {
        try {
            const response = await axios.get(`${this.pythonServiceUrl}/wallet-nfts`);
            return response.data;
        } catch (error) {
            console.error('Error in getWalletNFTs:', error.response?.data || error.message);
            throw error;
        }
    }

    async createCollection(assetIds) {
        try {
            const response = await axios.post(`${this.pythonServiceUrl}/create-collection`, {
                selected_assets: assetIds
            });
            return response.data;
        } catch (error) {
            console.error('NFT Service Error:', error);
            throw new Error(`Failed to create collection: ${error.message}`);
        }
    }

    async getCollection(collectionId) {
        try {
            const response = await axios.get(`${this.pythonServiceUrl}/collection/${collectionId}`);
            return response.data;
        } catch (error) {
            console.error('NFT Service Error:', error);
            throw new Error(`Failed to fetch collection: ${error.message}`);
        }
    }
}

module.exports = new NFTService(); 