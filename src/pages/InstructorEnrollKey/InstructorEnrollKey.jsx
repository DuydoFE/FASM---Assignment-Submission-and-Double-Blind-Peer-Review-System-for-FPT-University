import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const InstructorEnrollKey = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password requirements
  const passwordRequirements = [
    { text: 'At least 8 characters', check: password.length >= 8 },
    { text: 'Contains at least 1 uppercase letter', check: /[A-Z]/.test(password) },
    { text: 'Contains at least 1 number', check: /\d/.test(password) }
  ];

  const isValidPassword = passwordRequirements.every(req => req.check);

  const handleCreatePassword = () => {
    if (isValidPassword) {
      alert('Password has been created successfully!');
      // Password creation logic here
    }
  };

  const handleCancel = () => {
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <ArrowLeft size={20} className="mr-2 cursor-pointer hover:text-gray-800" />
          <span className="hover:text-gray-800 cursor-pointer">Class List</span>
          <span className="mx-2">›</span>
          <span className="hover:text-gray-800 cursor-pointer">WDU391 - SE1819</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-medium">Set Class Password</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Class Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Class Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-blue-600 text-sm font-medium mb-2">UI/UX Design</div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Class SE1819</h2>
              <p className="text-gray-600">WDU391</p>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <h3 className="text-yellow-800 font-semibold mb-1">Class Security</h3>
                  <p className="text-yellow-700 text-sm">
                    This password will be used to protect class information. Only students who have the password will be able to access the class.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Password Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Class Password
                </h1>
                <p className="text-gray-600">
                  Please create a strong password to secure your class information
                </p>
              </div>

              <div className="space-y-6">
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    {passwordRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          requirement.check 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Check size={12} />
                        </div>
                        <span className={`text-sm ${
                          requirement.check ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePassword}
                    disabled={!isValidPassword}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isValidPassword
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Create Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorEnrollKey;
