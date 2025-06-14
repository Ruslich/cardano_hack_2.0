import React from 'react';

const ReviewSubmitStep = ({ values, onEdit, onSubmit, submitting }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Review & Submit</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Institution Name:</span>
          <span>{values.institutionName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Country:</span>
          <span>{values.country}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Admin Contact Email:</span>
          <span>{values.adminEmail}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Authorization Letter:</span>
          <span>{values.letterFile ? '✅ Uploaded' : '❌ Not uploaded'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Accreditation Certificate:</span>
          <span>{values.certificateFile ? '✅ Uploaded' : '❌ Not uploaded'}</span>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => onEdit(0)}
          className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${submitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {submitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep; 