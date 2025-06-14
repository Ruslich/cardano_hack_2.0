const pool = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

exports.validateUniversityToken = async (req, res, next) => {
  try {
    const apiToken = req.headers['x-api-token'];
    console.log('Validating token:', apiToken);

    if (!apiToken) {
      return res.status(401).json({ error: 'API token is required' });
    }

    // Query to get university info using the token
    const [rows] = await pool.execute(`
      SELECT u.* 
      FROM universities u
      JOIN api_tokens at ON at.university_id = u.id
      WHERE at.token_hash = ?
    `, [apiToken]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API token' });
    }

    const university = rows[0];
    if (university.status !== 'approved') {
      return res.status(403).json({ error: 'University is not approved' });
    }

    // Attach university info to request
    req.university = university;
    console.log('Token validation successful for university:', university.id);
    next();
  } catch (err) {
    console.error('Error in validateUniversityToken:', err);
    res.status(500).json({ error: 'Failed to validate token' });
  }
}; 