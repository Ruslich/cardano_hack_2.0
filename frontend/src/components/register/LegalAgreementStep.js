import React from 'react';

const LegalAgreementStep = ({ values, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Terms of Use</label>
        <div className="h-40 overflow-y-scroll bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 mb-2">
          <p><strong>DocVerify Terms of Use (Summary):</strong></p>
          <ul className="list-disc ml-4">
            <li>Only authorized university representatives may register institutions.</li>
            <li>All information provided must be accurate and verifiable.</li>
            <li>Uploaded documents must be official and unaltered.</li>
            <li>Misuse of the platform may result in legal action.</li>
            <li>By registering, you agree to our privacy policy and data processing terms.</li>
          </ul>
          <p className="mt-2">Full terms available upon request.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="authorizedAccepted"
          name="authorizedAccepted"
          checked={values.authorizedAccepted}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="authorizedAccepted" className="text-sm text-gray-700">I confirm I am authorized to submit this institution registration.</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="termsAccepted"
          name="termsAccepted"
          checked={values.termsAccepted}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-700">I agree to the platform's Terms of Use.</label>
      </div>
    </div>
  );
};

export default LegalAgreementStep; 