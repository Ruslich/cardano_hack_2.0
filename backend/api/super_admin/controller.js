const pool = require('../../db');
const bcrypt = require('bcryptjs');
const WalletService = require('../../services/walletService');
const EncryptionService = require('../../services/encryptionService');
const TokenService = require('../../services/tokenService');

exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const [rows] = await pool.execute('SELECT * FROM super_admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // For now, just return success (add JWT/session later)
    res.json({ success: true, id: admin.id, name: admin.name, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.getUniversities = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.*, a.name AS contact_name, a.email AS contact_email, a.phone AS contact_phone
      FROM universities u
      LEFT JOIN admins a ON a.university_id = u.id AND a.role = 'owner'
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch universities', details: err.message });
  }
};

exports.verifyUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await pool.execute('UPDATE universities SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update university status', details: err.message });
  }
};

exports.approveUniversityFull = async (req, res) => {
  console.log('approveUniversityFull called with params:', req.params);
  try {
    // 1. Check super admin session (for MVP, check a header or skip for now)
    // Example: if (!req.session.superAdmin) return res.status(401).json({ error: 'Unauthorized' });

    const { uuid } = req.params;
    if (!uuid) {
      console.log('No uuid provided');
      return res.status(400).json({ error: 'Missing university uuid' });
    }
    // 2. Fetch university by uuid
    const [unis] = await pool.execute('SELECT * FROM universities WHERE uuid = ?', [uuid]);
    if (unis.length === 0) {
      console.log('University not found for uuid:', uuid);
      return res.status(404).json({ error: 'University not found' });
    }
    const university = unis[0];
    if (university.status !== 'pending') {
      console.log('University not pending, status:', university.status);
      return res.status(400).json({ error: 'University is not pending approval' });
    }

    // 3. Generate Cardano wallet
    console.log('Starting wallet generation...');
    const walletResult = await WalletService.generateWallet();
    console.log('Wallet generated:', walletResult);
    const { mnemonic, privateKey, publicKey, address } = walletResult;

    // 4. Encrypt sensitive keys
    console.log('Starting key encryption...');
    const [mnemonicEncrypted, privateKeyEncrypted] = await Promise.all([
      EncryptionService.encrypt(mnemonic),
      EncryptionService.encrypt(privateKey)
    ]);
    console.log('Keys encrypted successfully');

    // 5. Generate API token
    console.log('Generating API token...');
    const { rawToken, tokenHash } = await TokenService.generateToken();
    console.log('API token generated successfully');

    // 6. Update university record
    console.log('Updating university record...');
    const [updateResult] = await pool.execute(
      'UPDATE universities SET status = ?, public_key = ?, private_key_encrypted = ?, mnemonic_encrypted = ?, wallet_address = ?, updated_at = NOW() WHERE id = ?',
      ['approved', publicKey, privateKeyEncrypted, mnemonicEncrypted, address, university.id]
    );
    console.log('University DB update result:', updateResult);

    // 7. Store API token hash
    console.log('Storing API token...');
    const [tokenResult] = await pool.execute(
      'INSERT INTO api_tokens (university_id, token_hash) VALUES (?, ?)',
      [university.id, tokenHash]
    );
    console.log('API token DB insert result:', tokenResult);

    // 8. Return onboarding info
    console.log('Sending success response...');
    return res.json({
      message: 'University approved and provisioned',
      wallet_address: address,
      public_key: publicKey,
      api_token: rawToken,
      api_docs: 'https://yourapidocs.example.com/'
    });
  } catch (err) {
    console.error('Error in approveUniversityFull:', err);
    return res.status(500).json({ error: 'Failed to approve university', details: err.message });
  }
}; 