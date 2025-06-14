import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, AlertTriangle, Download, RefreshCw, LogOut, Activity, Wallet, Server, Users, Upload, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DeveloperDashboard = () => {
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCodeTab, setActiveCodeTab] = useState('node.js');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    degree: '',
    major: '',
    graduationDate: '',
    gpa: ''
  });
  const navigate = useNavigate();

  // Mock data for analytics
  const mockAnalyticsData = {
    totalRequests: 1250,
    successfulRequests: 1180,
    failedRequests: 70,
    walletBalance: 2500,
    credentialsIssued: 850,
    activeUsers: 120,
    requestHistory: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'API Requests',
          data: [150, 200, 180, 250, 220, 250],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    },
    credentialTypes: {
      labels: ['Bachelor', 'Master', 'PhD', 'Certificate'],
      datasets: [
        {
          label: 'Credentials Issued',
          data: [400, 250, 150, 50],
          backgroundColor: [
            'rgba(59, 130, 246, 0.5)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(239, 68, 68, 0.5)',
          ],
        },
      ],
    },
  };

  useEffect(() => {
    // Check if university is logged in
    const isLoggedIn = localStorage.getItem('universityAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/university/login');
      return;
    }
    fetchUniversityData();
  }, [navigate]);

  const fetchUniversityData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/university/profile', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch university data');
      const data = await response.json();
      setUniversity(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/university/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to logout');
      localStorage.removeItem('universityAdminLoggedIn');
      navigate('/university/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const handleRegenerateToken = async () => {
    if (!window.confirm('Are you sure you want to regenerate your API token? This will invalidate your current token.')) {
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/university/regenerate-token', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to regenerate token');
      const data = await response.json();
      setUniversity(prev => ({
        ...prev,
        api: {
          ...prev.api,
          token: data.api_token
        }
      }));
      toast.success('API token regenerated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('document', selectedFile);
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch('http://localhost:4000/api/nft/issue-credential', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to issue credential');
      }

      const result = await response.json();
      setMintResult(result.data);
      toast.success('Credential issued successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">{university?.university?.name}</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* University Info Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Wallet Address</h3>
              <div className="mt-2 flex items-center">
                <code className="text-sm text-gray-900 break-all">{university?.wallet?.address}</code>
                <button
                  onClick={() => copyToClipboard(university?.wallet?.address)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">Public Key</h3>
              <div className="mt-2 flex items-center">
                <code className="text-sm text-gray-900 break-all">{university?.wallet?.public_key}</code>
                <button
                  onClick={() => copyToClipboard(university?.wallet?.public_key)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">API Token</h3>
              <div className="mt-2 flex items-center">
                <code className="text-sm text-gray-900">
                  {university?.api?.token ? `${university.api.token.slice(0, 8)}...${university.api.token.slice(-8)}` : 'Not available'}
                </code>
                <div className="flex ml-2">
                  <button
                    onClick={() => copyToClipboard(university?.api?.token)}
                    className="text-gray-400 hover:text-gray-600 mr-2"
                    title="Copy Token"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={handleRegenerateToken}
                    className="text-gray-400 hover:text-gray-600"
                    title="Regenerate Token"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'analytics', 'playground'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick API Overview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick API Overview</h2>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/issue-credential</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">POST</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Issue new credentials</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">/api/verify-credential/:id</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GET</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Verify issued credentials</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Code Samples */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Samples</h2>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {['node.js', 'python', 'PHP', 'java', 'curl'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveCodeTab(tab)}
                        className={`${
                          activeCodeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="p-6">
                  {activeCodeTab === 'node.js' && (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(getNodeCode())}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                        {getNodeCode()}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {activeCodeTab === 'python' && (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(getPythonCode())}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <SyntaxHighlighter language="python" style={vscDarkPlus}>
                        {getPythonCode()}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {activeCodeTab === 'PHP' && (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(getPhpCode())}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <SyntaxHighlighter language="php" style={vscDarkPlus}>
                        {getPhpCode()}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {activeCodeTab === 'java' && (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(getJavaCode())}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <SyntaxHighlighter language="java" style={vscDarkPlus}>
                        {getJavaCode()}
                      </SyntaxHighlighter>
                    </div>
                  )}
                  {activeCodeTab === 'curl' && (
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(getCurlCode())}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <Copy size={16} />
                      </button>
                      <SyntaxHighlighter language="bash" style={vscDarkPlus}>
                        {getCurlCode()}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Reminder Panel */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Security Reminders</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Never share your private key or mnemonic</li>
                      <li>Keep your API Token confidential</li>
                      <li>Rotate API tokens regularly</li>
                      <li>Use HTTPS for all API calls</li>
                      <li>Test your integration in sandbox environment first</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Download SDK Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Download SDK</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center">
                    <Download className="h-6 w-6 text-blue-600" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Postman Collection</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Download our pre-built Postman collection for quick API testing</p>
                  <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Download Collection
                  </button>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center">
                    <Download className="h-6 w-6 text-blue-600" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Node.js Starter Kit</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Get started quickly with our Node.js integration starter kit</p>
                  <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Download Starter Kit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Server className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{mockAnalyticsData.totalRequests}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span>98% success rate</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Wallet className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Wallet Balance</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">₳{mockAnalyticsData.walletBalance}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span>Active</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Credentials Issued</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{mockAnalyticsData.credentialsIssued}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span>This month: 120</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{mockAnalyticsData.activeUsers}</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            <span>+12% this month</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* API Requests Chart */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Requests Over Time</h3>
                <div className="h-80">
                  <Line
                    data={mockAnalyticsData.requestHistory}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Credential Types Chart */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Credential Types Distribution</h3>
                <div className="h-80">
                  <Bar
                    data={mockAnalyticsData.credentialTypes}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="px-6 py-5">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {[
                      {
                        id: 1,
                        type: 'credential_issued',
                        content: 'Issued Bachelor degree credential for John Doe',
                        date: '2 hours ago',
                        status: 'success',
                      },
                      {
                        id: 2,
                        type: 'wallet_transaction',
                        content: 'Received 500 ADA from University Treasury',
                        date: '5 hours ago',
                        status: 'success',
                      },
                      {
                        id: 3,
                        type: 'api_request',
                        content: 'Failed to verify credential #12345',
                        date: '1 day ago',
                        status: 'error',
                      },
                    ].map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== 2 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  activity.status === 'success'
                                    ? 'bg-green-500'
                                    : activity.status === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                                }`}
                              >
                                {activity.status === 'success' ? (
                                  <Activity className="h-5 w-5 text-white" />
                                ) : activity.status === 'error' ? (
                                  <AlertTriangle className="h-5 w-5 text-white" />
                                ) : (
                                  <Wallet className="h-5 w-5 text-white" />
                                )}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {activity.content}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={activity.date}>{activity.date}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Playground Tab */}
        {activeTab === 'playground' && (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Issue Credential</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Test the credential issuance API directly from this interface
                </p>
              </div>
              <div className="px-6 py-5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Document Upload
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.png,.jpg,.jpeg"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                        {selectedFile && (
                          <p className="text-sm text-gray-500">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Credential Fields */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        id="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 12345"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="degree"
                        id="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Bachelor of Science"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                        Major
                      </label>
                      <input
                        type="text"
                        name="major"
                        id="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="graduationDate" className="block text-sm font-medium text-gray-700">
                        Graduation Date
                      </label>
                      <input
                        type="date"
                        name="graduationDate"
                        id="graduationDate"
                        value={formData.graduationDate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
                        GPA
                      </label>
                      <input
                        type="text"
                        name="gpa"
                        id="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 3.8"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Issue Credential'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Response Section */}
            {mintResult && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Response</h3>
                </div>
                <div className="px-6 py-5">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Credential Issued Successfully</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="font-medium">Transaction Hash:</span>
                              <code className="ml-2 text-xs bg-green-100 px-2 py-1 rounded">{mintResult.transactionHash}</code>
                              <button
                                onClick={() => copyToClipboard(mintResult.transactionHash)}
                                className="ml-2 text-green-600 hover:text-green-500"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">NFT ID:</span>
                              <code className="ml-2 text-xs bg-green-100 px-2 py-1 rounded">{mintResult.nftId}</code>
                              <button
                                onClick={() => copyToClipboard(mintResult.nftId)}
                                className="ml-2 text-green-600 hover:text-green-500"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">Asset ID:</span>
                              <code className="ml-2 text-xs bg-green-100 px-2 py-1 rounded">{mintResult.assetId}</code>
                              <button
                                onClick={() => copyToClipboard(mintResult.assetId)}
                                className="ml-2 text-green-600 hover:text-green-500"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getNodeCode = () => {
  return `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_TOKEN = 'your_api_token';
const API_URL = 'http://localhost:4000/api';

async function issueCredential() {
  try {
    const formData = new FormData();

    // Attach file
    formData.append('document', fs.createReadStream('./certificate.pdf'));

    // Attach metadata (credential data)
    formData.append('studentId', '12345');
    formData.append('name', 'John Doe');
    formData.append('degree', 'Bachelor of Science');
    formData.append('major', 'Computer Science');
    formData.append('graduationDate', '2024-05-15');
    formData.append('gpa', '3.8');

    const response = await axios.post(\`\${API_URL}/issue-credential\`, formData, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        ...formData.getHeaders()  // VERY important: form-data calculates proper multipart boundaries
      }
    });

    console.log('Credential issued:', response.data);
  } catch (error) {
    console.error('Error issuing credential:', error.response?.data || error.message);
  }
}

issueCredential();`;
};

const getPythonCode = () => {
  return `import requests
import os

API_TOKEN = 'your_api_token'
API_URL = 'http://localhost:4000/api'

def issue_credential():
    # Create form data
    files = {
        'document': ('certificate.pdf', open('./certificate.pdf', 'rb'), 'application/pdf')
    }
    
    data = {
        'studentId': '12345',
        'name': 'John Doe',
        'degree': 'Bachelor of Science',
        'major': 'Computer Science',
        'graduationDate': '2024-05-15',
        'gpa': '3.8'
    }
    
    headers = {
        'Authorization': f'Bearer {API_TOKEN}'
    }
    
    try:
        response = requests.post(
            f'{API_URL}/issue-credential',
            files=files,
            data=data,
            headers=headers
        )
        response.raise_for_status()
        print('Credential issued:', response.json())
    except requests.exceptions.RequestException as e:
        print('Error issuing credential:', e)
    finally:
        # Make sure to close the file
        files['document'][1].close()

issue_credential()`;
};

const getPhpCode = () => {
  return `<?php

$apiToken = 'your_api_token';
$apiUrl = 'http://localhost:4000/api';

function issueCredential() {
    global $apiToken, $apiUrl;
    
    // Create cURL file object
    $file = new CURLFile('./certificate.pdf', 'application/pdf', 'certificate.pdf');
    
    // Prepare form data
    $data = [
        'document' => $file,
        'studentId' => '12345',
        'name' => 'John Doe',
        'degree' => 'Bachelor of Science',
        'major' => 'Computer Science',
        'graduationDate' => '2024-05-15',
        'gpa' => '3.8'
    ];
    
    // Initialize cURL
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $apiUrl . '/issue-credential');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiToken
    ]);
    
    // Execute request
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo 'Error issuing credential: ' . curl_error($ch);
    } else {
        echo 'Credential issued: ' . $response;
    }
    
    curl_close($ch);
}

issueCredential();`;
};

const getJavaCode = () => {
  return `import java.io.File;
import java.io.IOException;
import okhttp3.*;

public class CredentialIssuer {
    private static final String API_TOKEN = "your_api_token";
    private static final String API_URL = "http://localhost:4000/api";
    private static final OkHttpClient client = new OkHttpClient();

    public static void issueCredential() {
        try {
            // Create multipart request body
            File file = new File("./certificate.pdf");
            RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("document", "certificate.pdf",
                    RequestBody.create(MediaType.parse("application/pdf"), file))
                .addFormDataPart("studentId", "12345")
                .addFormDataPart("name", "John Doe")
                .addFormDataPart("degree", "Bachelor of Science")
                .addFormDataPart("major", "Computer Science")
                .addFormDataPart("graduationDate", "2024-05-15")
                .addFormDataPart("gpa", "3.8")
                .build();

            // Create request
            Request request = new Request.Builder()
                .url(API_URL + "/issue-credential")
                .post(requestBody)
                .header("Authorization", "Bearer " + API_TOKEN)
                .build();

            // Execute request
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected response code: " + response);
                }
                System.out.println("Credential issued: " + response.body().string());
            }
        } catch (IOException e) {
            System.err.println("Error issuing credential: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        issueCredential();
    }
}`;
};

const getCurlCode = () => {
  return `curl -X POST http://localhost:4000/api/issue-credential \\
  -H "Authorization: Bearer your_api_token" \\
  -F "document=@./certificate.pdf" \\
  -F "studentId=12345" \\
  -F "name=John Doe" \\
  -F "degree=Bachelor of Science" \\
  -F "major=Computer Science" \\
  -F "graduationDate=2024-05-15" \\
  -F "gpa=3.8"`;
};

export default DeveloperDashboard; 