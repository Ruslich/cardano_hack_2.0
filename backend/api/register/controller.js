const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../db');
const path = require('path');

exports.registerUniversity = async (req, res) => {
  try {
    const {
      institutionName,
      country,
      domain,
      accreditationId,
      adminName,
      adminEmail,
      adminPassword,
      adminPhone,
      authorizedAccepted,
      termsAccepted
    } = req.body;
    const letterFile = req.files['letterFile']?.[0];
    const certificateFile = req.files['certificateFile']?.[0];
    if (!institutionName || !country || !domain || !adminName || !adminEmail || !adminPassword || !letterFile || !certificateFile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    // Start transaction
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // Insert university
      const universityUuid = uuidv4();
      const [uniResult] = await conn.execute(
        `INSERT INTO universities (uuid, name, domain, country, accreditation_id, accreditation_file_path, authorization_file_path, authorized_confirmed, terms_accepted, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [
          universityUuid,
          institutionName,
          domain,
          country,
          accreditationId || null,
          path.join('backend', 'storage', letterFile.filename),
          path.join('backend', 'storage', certificateFile.filename),
          authorizedAccepted ? 1 : 0,
          termsAccepted ? 1 : 0
        ]
      );
      const universityId = uniResult.insertId;
      // Insert admin
      await conn.execute(
        `INSERT INTO admins (university_id, name, email, phone, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, 'owner', NOW())`,
        [universityId, adminName, adminEmail, adminPhone, passwordHash]
      );
      await conn.commit();
      res.json({ success: true, message: 'Registration successful. We will contact you by email.' });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.loginUniversity = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Find admin by email
    const [admins] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const admin = admins[0];
    // Find university
    const [unis] = await pool.execute('SELECT * FROM universities WHERE id = ?', [admin.university_id]);
    if (unis.length === 0) {
      return res.status(401).json({ error: 'University not found.' });
    }
    const university = unis[0];
    if (university.status !== 'approved') {
      return res.status(403).json({ error: 'Your university registration is pending. You will be notified once approved.' });
    }
    // Check password
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    // Success
    res.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email, university_id: admin.university_id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
}; 