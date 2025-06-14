const pool = require('../../db');
const TokenService = require('../../services/tokenService');

exports.getProfile = async (req, res) => {
  try {
    // Get university ID from the authenticated session
    const universityId = req.session.universityId;
    if (!universityId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Fetch university data with wallet and API information
    const [universities] = await pool.execute(`
      SELECT 
        u.id,
        u.name,
        u.domain,
        u.wallet_address,
        u.public_key,
        u.status,
        u.created_at,
        u.updated_at,
        at.token_hash as api_token
      FROM universities u
      LEFT JOIN api_tokens at ON at.university_id = u.id
      WHERE u.id = ?
    `, [universityId]);

    if (universities.length === 0) {
      return res.status(404).json({ error: 'University not found' });
    }

    const university = universities[0];

    // API Documentation
    const apiDocs = {
      endpoints: [
        {
          path: '/api/issue-credential',
          method: 'POST',
          purpose: 'Issue new credentials',
          description: 'Create and issue a new credential on the blockchain',
          headers: {
            'Authorization': 'Bearer YOUR_API_TOKEN',
            'Content-Type': 'application/json'
          },
          requestBody: {
            studentId: 'string',
            name: 'string',
            degree: 'string',
            major: 'string',
            graduationDate: 'string (YYYY-MM-DD)',
            gpa: 'string'
          },
          response: {
            credentialId: 'string',
            transactionHash: 'string',
            status: 'string'
          }
        },
        {
          path: '/api/verify-credential/:id',
          method: 'GET',
          purpose: 'Verify issued credentials',
          description: 'Verify the authenticity of an issued credential',
          headers: {
            'Authorization': 'Bearer YOUR_API_TOKEN'
          },
          response: {
            isValid: 'boolean',
            credential: {
              studentId: 'string',
              name: 'string',
              degree: 'string',
              major: 'string',
              graduationDate: 'string',
              gpa: 'string',
              issuedAt: 'string'
            }
          }
        }
      ],
      errorCodes: [
        { code: 400, message: 'Bad Request - Invalid input data' },
        { code: 401, message: 'Unauthorized - Invalid or missing API token' },
        { code: 403, message: 'Forbidden - Insufficient permissions' },
        { code: 404, message: 'Not Found - Resource not found' },
        { code: 429, message: 'Too Many Requests - Rate limit exceeded' },
        { code: 500, message: 'Internal Server Error' }
      ]
    };

    // Code Samples
    const codeSamples = {
      node: {
        language: 'javascript',
        code: `const axios = require('axios');

const API_TOKEN = '${university.api_token}';
const API_URL = 'http://localhost:4000/api';

async function issueCredential(studentData) {
  try {
    const response = await axios.post(\`\${API_URL}/issue-credential\`, studentData, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error issuing credential:', error.response?.data || error.message);
    throw error;
  }
}

// Example usage
const studentData = {
  studentId: "12345",
  name: "John Doe",
  degree: "Bachelor of Science",
  major: "Computer Science",
  graduationDate: "2024-05-15",
  gpa: "3.8"
};

issueCredential(studentData)
  .then(credential => console.log('Credential issued:', credential))
  .catch(error => console.error('Failed to issue credential:', error));`
      },
      python: {
        language: 'python',
        code: `import requests

API_TOKEN = '${university.api_token}'
API_URL = 'http://localhost:4000/api'

def issue_credential(student_data):
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(f'{API_URL}/issue-credential', 
                               json=student_data,
                               headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error issuing credential: {e}')
        raise

# Example usage
student_data = {
    'studentId': '12345',
    'name': 'John Doe',
    'degree': 'Bachelor of Science',
    'major': 'Computer Science',
    'graduationDate': '2024-05-15',
    'gpa': '3.8'
}

try:
    credential = issue_credential(student_data)
    print('Credential issued:', credential)
except Exception as e:
    print('Failed to issue credential:', e)`
      },
      curl: {
        language: 'bash',
        code: `curl -X POST http://localhost:4000/api/issue-credential \\
  -H "Authorization: Bearer ${university.api_token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "studentId": "12345",
    "name": "John Doe",
    "degree": "Bachelor of Science",
    "major": "Computer Science",
    "graduationDate": "2024-05-15",
    "gpa": "3.8"
  }'`
      }
    };

    // SDK Downloads
    const sdkDownloads = {
      postman: {
        name: 'Postman Collection',
        description: 'Pre-built Postman collection for quick API testing',
        url: 'https://api.example.com/downloads/postman-collection.json'
      },
      nodejs: {
        name: 'Node.js Starter Kit',
        description: 'Get started quickly with our Node.js integration starter kit',
        url: 'https://api.example.com/downloads/nodejs-starter-kit.zip'
      }
    };

    // Security Guidelines
    const securityGuidelines = [
      'Never share your private key or mnemonic',
      'Keep your API Token confidential',
      'Rotate API tokens regularly',
      'Use HTTPS for all API calls',
      'Test your integration in sandbox environment first',
      'Implement proper error handling',
      'Use environment variables for sensitive data',
      'Monitor API usage and set up alerts'
    ];

    // Format the response
    const response = {
      // University Information
      university: {
        id: university.id,
        name: university.name,
        domain: university.domain,
        status: university.status,
        created_at: university.created_at,
        updated_at: university.updated_at
      },
      // Wallet Information
      wallet: {
        address: university.wallet_address,
        public_key: university.public_key
      },
      // API Information
      api: {
        token: university.api_token,
        base_url: 'http://localhost:4000/api',
        documentation: apiDocs,
        code_samples: codeSamples,
        sdk_downloads: sdkDownloads,
        security_guidelines: securityGuidelines
      }
    };

    res.json(response);
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({ error: 'Failed to fetch university profile', details: err.message });
  }
};

exports.regenerateToken = async (req, res) => {
  try {
    const universityId = req.session.universityId;
    if (!universityId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Generate new token
    const { rawToken, tokenHash } = await TokenService.generateToken();

    // Update token in database
    await pool.execute(
      'UPDATE api_tokens SET token_hash = ? WHERE university_id = ?',
      [tokenHash, universityId]
    );

    res.json({ api_token: rawToken });
  } catch (err) {
    console.error('Error in regenerateToken:', err);
    res.status(500).json({ error: 'Failed to regenerate token', details: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  } catch (err) {
    console.error('Error in logout:', err);
    res.status(500).json({ error: 'Failed to logout', details: err.message });
  }
};

exports.getUniversityInfo = async (req, res) => {
  try {
    // University info is already attached by the validateUniversityToken middleware
    const university = req.university;
    
    if (!university) {
      return res.status(401).json({ error: 'University not found' });
    }

    res.json({
      id: university.id,
      name: university.name,
      wallet_address: university.wallet_address,
      status: university.status
    });
  } catch (err) {
    console.error('Error in getUniversityInfo:', err);
    res.status(500).json({ error: 'Failed to fetch university info', details: err.message });
  }
}; 