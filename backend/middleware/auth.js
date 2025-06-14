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
        
        if (!apiToken) {
            return res.status(401).json({ error: 'API token is required' });
        }

        // Check if the token is already a hash (64 characters)
        const tokenHash = apiToken.length === 64 ? apiToken : crypto
            .createHash('sha256')
            .update(apiToken)
            .digest('hex');

        console.log('Validating token hash:', tokenHash);

        // Query to get university details using the hashed API token
        const [rows] = await pool.execute(`
            SELECT u.*, at.token_hash 
            FROM universities u
            JOIN api_tokens at ON u.id = at.university_id
            WHERE at.token_hash = ?
            AND u.status = 'approved'
        `, [tokenHash]);

        if (rows.length === 0) {
            console.log('Token validation failed: No matching token found');
            return res.status(401).json({ error: 'Invalid API token' });
        }

        console.log('Token validation successful for university:', rows[0].id);
        // Attach university info to request for use in controllers
        req.university = rows[0];
        next();
    } catch (error) {
        console.error('Error validating university token:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}; 