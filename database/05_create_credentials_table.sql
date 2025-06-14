CREATE TABLE IF NOT EXISTS credentials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid CHAR(36) NOT NULL,
    nft_asset_name VARCHAR(255) NOT NULL,
    blockchain_tx_hash VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_uuid (uuid),
    INDEX idx_blockchain_tx (blockchain_tx_hash),
    INDEX idx_nft_asset (nft_asset_name),
    INDEX idx_status (status)
); 