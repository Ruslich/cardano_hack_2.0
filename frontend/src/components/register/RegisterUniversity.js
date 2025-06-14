import React, { useState } from 'react';
import InstitutionDetailsStep from './InstitutionDetailsStep';
import AdminDetailsStep from './AdminDetailsStep';
import VerificationDocumentsStep from './VerificationDocumentsStep';
import LegalAgreementStep from './LegalAgreementStep';
import ReviewSubmitStep from './ReviewSubmitStep';

const steps = [
  'Institution Details',
  'Admin Details',
  'Verification Documents',
  'Legal Agreement',
  'Review & Submit'
];

const API_URL = 'http://localhost:4000/api/register-university';

const RegisterUniversity = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    institutionName: '',
    country: '',
    domain: '',
    accreditationId: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
    letterFile: null,
    certificateFile: null,
    termsAccepted: false,
    authorizedAccepted: false
  });
  const [uploadProgress, setUploadProgress] = useState({ letterFile: 0, certificateFile: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Stepper UI
  const Stepper = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= idx ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
          {idx < steps.length - 1 && <div className={`w-10 h-1 ${step > idx ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
        </div>
      ))}
    </div>
  );

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (type, file) => {
    setForm((prev) => ({ ...prev, [type]: file }));
    // Simulate upload progress
    setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress((prev) => ({ ...prev, [type]: Math.min(progress, 100) }));
      if (progress >= 100) clearInterval(interval);
    }, 100);
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const goToStep = (idx) => setStep(idx);

  // Validation for each step
  const isStepValid = () => {
    switch (step) {
      case 0:
        return form.institutionName && form.country && form.domain;
      case 1:
        return form.adminName && form.adminEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail) && form.adminPassword && form.adminPassword.length >= 8;
      case 2:
        return form.letterFile && form.certificateFile;
      case 3:
        return form.termsAccepted && form.authorizedAccepted;
      default:
        return true;
    }
  };

  // Submit handler (real API call)
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('institutionName', form.institutionName);
      formData.append('country', form.country);
      formData.append('domain', form.domain);
      formData.append('accreditationId', form.accreditationId);
      formData.append('adminName', form.adminName);
      formData.append('adminEmail', form.adminEmail);
      formData.append('adminPassword', form.adminPassword);
      formData.append('adminPhone', form.adminPhone);
      formData.append('letterFile', form.letterFile);
      formData.append('certificateFile', form.certificateFile);
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Render step
  const renderStep = () => {
    switch (step) {
      case 0:
        return <InstitutionDetailsStep values={form} onChange={handleChange} />;
      case 1:
        return <AdminDetailsStep values={form} onChange={handleChange} />;
      case 2:
        return <VerificationDocumentsStep values={form} onFileChange={handleFileChange} uploadProgress={uploadProgress} />;
      case 3:
        return <LegalAgreementStep values={form} onChange={handleChange} />;
      case 4:
        return <ReviewSubmitStep values={form} onEdit={goToStep} onSubmit={handleSubmit} submitting={submitting} />;
      default:
        return null;
    }
  };

  if (success) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Registration Submitted!</h2>
          <p className="text-lg text-gray-700 mb-4">Thank you for registering your institution.</p>
          <p className="text-gray-700 mb-2">Your account will undergo a verification process. You will be contacted via email for the next steps, including API key delivery and admin login instructions.</p>
          <div className="flex justify-center gap-4 mt-8">
            <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Go to Home</a>
            <a href="/contact" className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors">Contact Us</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">University Registration</h1>
        <p className="text-gray-600 mb-8 text-center">Register your institution to issue and verify credentials on DocVerify</p>
        <Stepper />
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
        {renderStep()}
        {step < steps.length - 1 && (
          <div className="flex justify-between mt-10">
            <button
              onClick={prevStep}
              disabled={step === 0 || submitting}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${step === 0 || submitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!isStepValid() || submitting}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${!isStepValid() || submitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        )}
        <div className="mt-8">
          <div className="w-full border-t border-gray-200 mb-2"></div>
          <div className="flex justify-center">
            <a href="/login" className="text-blue-600 font-semibold hover:underline text-lg transition-colors">
              Already Registered? Login here.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterUniversity; 