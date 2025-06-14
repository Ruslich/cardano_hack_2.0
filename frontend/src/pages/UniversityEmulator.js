import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UniversityEmulator() {
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

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

  const handleExportAsNFT = async (certificate) => {
    setLoadingStates(prev => ({ ...prev, [certificate.id]: true }));
    
    try {
      // 1. Get the PDF data to send to API
      const response = await fetch(certificate.pdfPath);
      const pdfBlob = await response.blob();
      
      // 2. Prepare form data for API
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `${certificate.type.replace(/\s+/g, '_')}.pdf`);
      formData.append('metadata', JSON.stringify({
        studentName: certificate.studentName,
        studentId: certificate.studentId,
        program: certificate.program
      }));

      // 3. Simulate API call (replace with actual fetch to your endpoint)
      console.log('Submitting to API:', certificate);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`${certificate.type} submitted for NFT conversion!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export certificate');
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