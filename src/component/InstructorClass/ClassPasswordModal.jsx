import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Spin } from 'antd';
import { Eye, EyeOff } from 'lucide-react';
import { getEnrollKey } from '../../service/courseInstanceService';
import { toast } from 'react-toastify';

const ClassPasswordModal = ({
  isOpen,
  onClose,
  selectedClass,
  initialPassword = '',
  onSave,
  userId
}) => {
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalPassword, setOriginalPassword] = useState('');

  useEffect(() => {
    const fetchEnrollKey = async () => {
      if (isOpen && selectedClass?.courseInstanceId && userId) {
        setIsLoading(true);
        try {
          const response = await getEnrollKey(selectedClass.courseInstanceId, userId);
          const enrollKey = response?.data || '';
          setPassword(enrollKey);
          setOriginalPassword(enrollKey);
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch enrollment key';
          setPassword(initialPassword);
          setOriginalPassword(initialPassword);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEnrollKey();
  }, [isOpen, selectedClass?.courseInstanceId, userId, initialPassword]);

  const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-3">
    <svg
      className={`w-5 h-5 ${met ? 'text-green-500' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span className={`text-sm ${met ? 'text-gray-700' : 'text-gray-500'}`}>
      {text}
    </span>
  </div>
);

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLowercase && hasUppercase && hasNumber;
  const hasPasswordChanged = password !== originalPassword;

  const handleSave = () => {
    if (isPasswordValid) {
      onSave(password);
      handleClose();
    }
  };

  const handleClose = () => {
    setPassword(originalPassword);
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          disabled={!isPasswordValid || isLoading || !hasPasswordChanged}
          className="bg-orange-500 hover:!bg-orange-600"
        >
          Update Password
        </Button>
      ]}
      closable={false}
    >
      <Spin spinning={isLoading} tip="Loading enrollment key...">
        <div className="flex overflow-hidden -mx-6 -my-5">
        {/* Left Side - Class Info */}
        <div className="w-2/5 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex flex-col">
          <div className="mb-6">
            <div className="text-blue-600 text-sm font-semibold mb-2">
              {selectedClass?.code}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Class {selectedClass?.name}
            </h2>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mt-auto">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Class Security</h3>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  This password will be used to protect class information. Only students who have the password will be able to access the class.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Password Form */}
        <div className="w-3/5 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Class Password</h2>

          <p className="text-gray-600 mb-6">
            Please change a strong password to secure your class information
          </p>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Class Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3"
                placeholder="Enter password..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Password Requirements:</h3>
            <div className="space-y-2">
              <PasswordRequirement met={hasMinLength} text="At least 8 characters" />
              <PasswordRequirement met={hasLowercase} text="Contains at least 1 lowercase letter" />
              <PasswordRequirement met={hasUppercase} text="Contains at least 1 uppercase letter" />
              <PasswordRequirement met={hasNumber} text="Contains at least 1 number" />
            </div>
          </div>
        </div>
      </div>
      </Spin>
    </Modal>
  );
};

export default ClassPasswordModal;