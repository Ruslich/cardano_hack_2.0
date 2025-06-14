const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Generate a secure key if not provided in environment
const KEY = process.env.MASTER_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
console.log(KEY);

function encrypt(text) {
  try {
    console.log('Starting encryption...');
    const iv = crypto.randomBytes(IV_LENGTH);
    const keyBuffer = Buffer.from(KEY, 'hex');
    
    if (keyBuffer.length !== 32) {
      throw new Error(`Invalid key length: ${keyBuffer.length} bytes. Expected 32 bytes.`);
    }
    
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log('Encryption completed successfully');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

function decrypt(encrypted) {
  try {
    console.log('Starting decryption...');
    const [ivHex, encryptedText] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const keyBuffer = Buffer.from(KEY, 'hex');
    
    if (keyBuffer.length !== 32) {
      throw new Error(`Invalid key length: ${keyBuffer.length} bytes. Expected 32 bytes.`);
    }
    
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('Decryption completed successfully');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

module.exports = { encrypt, decrypt }; 