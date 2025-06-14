const pool = require('../db');

exports.authenticateUniversity = async (req, res, next) => {
  try {
    console.log('Session state:', {
      sessionExists: !!req.session,
      universityId: req.session?.universityId,
      sessionID: req.session?.id
    });

    // Check if session exists
    if (!req.session || !req.session.universityId) {
      console.log('Authentication failed: No session or universityId');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify university exists and is approved
    const [universities] = await pool.execute(
      'SELECT id, status FROM universities WHERE id = ?',
      [req.session.universityId]
    );

    if (universities.length === 0) {
      console.log('Authentication failed: University not found');
      return res.status(401).json({ error: 'University not found' });
    }

    const university = universities[0];
    if (university.status !== 'approved') {
      console.log('Authentication failed: University not approved');
      return res.status(403).json({ error: 'University not approved' });
    }

    console.log('Authentication successful for university:', university.id);
    // Add university info to request
    req.university = university;
    next();
  } catch (err) {
    console.error('Error in authenticateUniversity:', err);
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
}; 