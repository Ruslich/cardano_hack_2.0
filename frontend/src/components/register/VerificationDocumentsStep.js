import React, { useRef } from 'react';

const VerificationDocumentsStep = ({ values, onFileChange, uploadProgress }) => {
  const letterInput = useRef();
  const certInput = useRef();

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      onFileChange(type, file);
    }
  };

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      onFileChange(type, file);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Official Authorization Letter (PDF)</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-blue-50 transition"
          onClick={() => letterInput.current.click()}
          onDrop={e => handleDrop(e, 'letterFile')}
          onDragOver={e => e.preventDefault()}
        >
          {values.letterFile ? (
            <div className="flex flex-col items-center">
              <span className="text-green-600 font-semibold">{values.letterFile.name}</span>
              {uploadProgress.letterFile > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.letterFile}%` }}></div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">Drag & drop or click to upload (PDF, max 10MB)</span>
          )}
          <input
            type="file"
            accept="application/pdf"
            ref={letterInput}
            style={{ display: 'none' }}
            onChange={e => handleFile(e, 'letterFile')}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Accreditation Certificate (PDF)</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-blue-50 transition"
          onClick={() => certInput.current.click()}
          onDrop={e => handleDrop(e, 'certificateFile')}
          onDragOver={e => e.preventDefault()}
        >
          {values.certificateFile ? (
            <div className="flex flex-col items-center">
              <span className="text-green-600 font-semibold">{values.certificateFile.name}</span>
              {uploadProgress.certificateFile > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress.certificateFile}%` }}></div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">Drag & drop or click to upload (PDF, max 10MB)</span>
          )}
          <input
            type="file"
            accept="application/pdf"
            ref={certInput}
            style={{ display: 'none' }}
            onChange={e => handleFile(e, 'certificateFile')}
          />
        </div>
      </div>
    </div>
  );
};

export default VerificationDocumentsStep; 