const pool = require('../../db');
const bcrypt = require('bcryptjs');

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