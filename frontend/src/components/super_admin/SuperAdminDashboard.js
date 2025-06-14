import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/api/super-admin/universities';
const VERIFY_URL = id => `http://localhost:4000/api/super-admin/universities/${id}/verify`;

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const SuperAdminDashboard = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if super admin is logged in
    const isLoggedIn = localStorage.getItem('superAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/super-admin/login');
      return;
    }
    fetchUniversities();
  }, [navigate]);

  const fetchUniversities = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      console.log('Response status:', res.status);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch universities');
      }
      const data = await res.json();
      setUniversities(data);
    } catch (err) {
      console.error('Error fetching universities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    setActionLoading(id + status);
    try {
      const res = await fetch(VERIFY_URL(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to update status');
      await fetchUniversities();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('superAdminLoggedIn');
    navigate('/super-admin/login');
  };

  const handleViewMore = (university) => {
    setSelectedUniversity(university);
  };

  const handleClosePopup = () => {
    setSelectedUniversity(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900">Super Admin Dashboard</h2>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
          >
            Sign Out
          </button>
        </div>
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-500">Loading universities...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-3">Domain</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {universities.map(u => (
                <tr key={u.id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.country}</td>
                  <td className="py-2 px-3">{u.domain}</td>
                  <td className="py-2 px-3 font-semibold capitalize">{u.status}</td>
                  <td className="py-2 px-3">
                    {u.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(u.id, 'approved')}
                          disabled={actionLoading === u.id + 'approved'}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-semibold text-sm"
                        >
                          {actionLoading === u.id + 'approved' ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleVerify(u.id, 'rejected')}
                          disabled={actionLoading === u.id + 'rejected'}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-semibold text-sm"
                        >
                          {actionLoading === u.id + 'rejected' ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                    <button
                      onClick={() => handleViewMore(u)}
                      className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-semibold text-sm"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">{selectedUniversity.name}</h3>
            <p><strong>Country:</strong> {selectedUniversity.country}</p>
            <p><strong>Domain:</strong> {selectedUniversity.domain}</p>
            <p><strong>Status:</strong> {selectedUniversity.status}</p>
            <p><strong>Accreditation ID:</strong> {selectedUniversity.accreditation_id || 'N/A'}</p>
            <p><strong>Authorized Confirmed:</strong> {selectedUniversity.authorized_confirmed ? 'Yes' : 'No'}</p>
            <p><strong>Terms Accepted:</strong> {selectedUniversity.terms_accepted ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {formatDate(selectedUniversity.created_at)}</p>
            <p><strong>Updated At:</strong> {formatDate(selectedUniversity.updated_at)}</p>
            <div className="mt-4">
              <strong>Contact Person:</strong>
              <ul className="ml-6 mt-2">
                <li><strong>Name:</strong> {selectedUniversity.contact_name || 'N/A'}</li>
                <li><strong>Email:</strong> {selectedUniversity.contact_email || 'N/A'}</li>
                <li><strong>Phone:</strong> {selectedUniversity.contact_phone || 'N/A'}</li>
              </ul>
            </div>
            <div className="mt-4">
              <strong>Uploaded Files:</strong>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  Accreditation File: {selectedUniversity.accreditation_file_path ? (
                    <a
                      href={`http://localhost:4000/${selectedUniversity.accreditation_file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View PDF
                    </a>
                  ) : 'N/A'}
                </li>
                <li>
                  Authorization File: {selectedUniversity.authorization_file_path ? (
                    <a
                      href={`http://localhost:4000/${selectedUniversity.authorization_file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View PDF
                    </a>
                  ) : 'N/A'}
                </li>
              </ul>
            </div>
            <button
              onClick={handleClosePopup}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard; 