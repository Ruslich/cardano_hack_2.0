USE docverify;
CREATE TABLE universities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    country VARCHAR(100),
    accreditation_id VARCHAR(100),
    accreditation_file_path VARCHAR(255),
    authorization_file_path VARCHAR(255),
    authorized_confirmed TINYINT(1) NOT NULL DEFAULT 0,
    terms_accepted TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    public_key TEXT,
    private_key_encrypted TEXT,
    wallet_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE universities ADD COLUMN mnemonic_encrypted TEXT;