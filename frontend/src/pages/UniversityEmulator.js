import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UniversityEmulator() {
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Certificate data with PDF paths
  const certificates = [
    {
      id: 1,
      type: "Enrollment Certificate",
      studentName: "Max Mustermann",
      program: "Transmutation Arts",
      studentId: "AUR-789",
      issueDate: new Date().toLocaleDateString(),
      description: "is enrolled in the Transmutation Arts program",
      pdfPath: "/certificates/Ingolstadt_Cert_1.pdf"
    },
    {
      id: 2,
      type: "Grade Transcript",
      studentName: "Anna Schmidt",
      program: "Elixir Synthesis",
      studentId: "ELX-456",
      issueDate: new Date().toLocaleDateString(),
      description: "has completed all required courses with excellent results",
      pdfPath: "/certificates/Ingolstadt_Cert_2.pdf"
    },
    {
      id: 3,
      type: "Diploma",
      studentName: "John Doe",
      program: "Pyromantic Studies",
      studentId: "PYR-123",
      issueDate: new Date().toLocaleDateString(),
      description: "has successfully completed all degree requirements",
      pdfPath: "/certificates/Ingolstadt_Cert_3.pdf"
    }
  ];

  const handleExportClick = (certificate) => {
    setCurrentCertificate(certificate);
    setShowWalletPopup(true);
  };

  const handleExportAsNFT = async () => {
    if (!currentCertificate) return;
    
    setLoadingStates(prev => ({ ...prev, [currentCertificate.id]: true }));
    setShowWalletPopup(false);
    
    try {
      // 1. Get the PDF data to send to API
      const response = await fetch(currentCertificate.pdfPath);
      const pdfBlob = await response.blob();
      
      // 2. Prepare form data for API
      const formData = new FormData();
      formData.append('document', pdfBlob, `${currentCertificate.type.replace(/\s+/g, '_')}.pdf`);
      formData.append('student_id', currentCertificate.studentId);
      formData.append('student_name', currentCertificate.studentName);

      // Use the hardcoded token
      const token = '93eba6ca6865c236ca98169d2dec06d40f1d6f4918c9eb7ca96dbb0a804dd963';

      // 3. Make API call to our backend
      const apiResponse = await fetch('http://localhost:4000/api', {
        method: 'POST',
        headers: {
          'x-api-token': token
        },
        body: formData
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to export certificate');
      }

      const result = await apiResponse.json();
      
      // Show beautiful success message
      setSuccessMessage(`
        ${currentCertificate.type} successfully exported as NFT!
        Transaction Hash: ${result.data.transactionHash}
      `);
      setShowSuccess(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export certificate');
    } finally {
      setLoadingStates(prev => ({ ...prev, [currentCertificate.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Beautiful Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 w-64">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Successfully exported!</h3>
                <div className="mt-1 text-xs text-green-700">
                  <p>{successMessage.split('\n')[0].trim()}</p>
                  <p className="font-mono mt-1">{successMessage.split('\n')[1].trim()}</p>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="text-xs text-green-600 hover:text-green-500"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Export as NFT</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to export this certificate as an NFT? The certificate will be minted and sent to your university's wallet.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowWalletPopup(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportAsNFT}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm & Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">
            University Dashboard
          </h1>
        </div>
        
        <div className="space-y-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-50 py-3 px-6 border-t-4 border-blue-200">
                <h2 className="text-lg font-semibold text-blue-800">
                  {cert.type}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-gray-600">This certifies that</p>
                  <p className="text-xl font-bold my-2 text-blue-900">
                    {cert.studentName}
                  </p>
                  <p className="text-gray-700">{cert.description}</p>
                </div>
                
                {/* PDF Preview Section */}
                <div className="mt-4 mb-6 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-blue-800">Document Preview:</p>
                      <a 
                        href={cert.pdfPath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View {cert.type} (PDF)
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <p>Student ID: {cert.studentId}</p>
                  <p>Issued: {cert.issueDate}</p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => handleExportClick(cert)}
                  disabled={loadingStates[cert.id]}
                  className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                    loadingStates[cert.id] ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {loadingStates[cert.id] ? 'Processing...' : 'Export as NFT'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}