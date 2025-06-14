import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UniversityEmulator() {
  const [certificates, setCertificates] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [apiToken, setApiToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch university profile to get API token
    const fetchUniversityProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/university/profile', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch university profile');
        const data = await response.json();
        if (data.api?.token) {
          setApiToken(data.api.token);
          localStorage.setItem('universityApiToken', data.api.token);
        }
      } catch (error) {
        console.error('Error fetching university profile:', error);
      }
    };

    fetchUniversityProfile();
  }, []);

  // Certificate data with PDF paths
  const certificatesData = [
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

  const handleExportAsNFT = async (certificate) => {
    setLoadingStates(prev => ({ ...prev, [certificate.id]: true }));
    
    try {
      // 1. Get the PDF data to send to API
      const response = await fetch(certificate.pdfPath);
      const pdfBlob = await response.blob();
      
      // 2. Prepare form data for API
      const formData = new FormData();
      formData.append('document', pdfBlob, `${certificate.type.replace(/\s+/g, '_')}.pdf`);
      formData.append('studentId', certificate.studentId);
      formData.append('name', certificate.studentName);

      // Get API token from state or localStorage
      const token = "93eba6ca6865c236ca98169d2dec06d40f1d6f4918c9eb7ca96dbb0a804dd963" || localStorage.getItem('universityApiToken');
      if (!token) {
        throw new Error('API token not found. Please log in again.');
      }

      // 3. Make API call to our backend
      const apiResponse = await fetch('http://localhost:4000/api/issue-credential', {
        method: 'POST',
        headers: {
          'x-api-token': token
        },
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to issue credential');
      }

      const result = await apiResponse.json();
      
      alert(`Successfully issued ${certificate.type} as NFT!\nTransaction Hash: ${result.data.transactionHash}\nNFT Asset: ${result.data.nftAssetName}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export certificate: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [certificate.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">
            Ingolstadt University of Alchemy
          </h1>
          <p className="text-blue-600 italic text-sm mt-1">
            "From leaden ignorance to golden knowledge"
          </p>
        </div>
        
        <div className="space-y-6">
          {certificatesData.map((cert) => (
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
                  onClick={() => handleExportAsNFT(cert)}
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