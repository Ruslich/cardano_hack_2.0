import React, { useState } from 'react';

const AdminDetailsStep = ({ values, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person Name</label>
        <input
          type="text"
          name="adminName"
          value={values.adminName}
          onChange={onChange}
          placeholder="e.g. Dr. Jane Doe"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
        <input
          type="email"
          name="adminEmail"
          value={values.adminEmail}
          onChange={onChange}
          placeholder="admin@university.edu"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="adminPassword"
            value={values.adminPassword || ''}
            onChange={onChange}
            placeholder="Create a password"
            required
            minLength={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.36-2.676A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.293 5.03M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L19.07 4.93"/></svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">You'll use this password to log in as the institution admin. Minimum 8 characters.</p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone <span className="text-gray-400 text-xs">(optional)</span></label>
        <input
          type="tel"
          name="adminPhone"
          value={values.adminPhone}
          onChange={onChange}
          placeholder="+49 123 456789"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">This is the authorized person who will manage this institution's credentials.</p>
    </div>
  );
};

export default AdminDetailsStep; 