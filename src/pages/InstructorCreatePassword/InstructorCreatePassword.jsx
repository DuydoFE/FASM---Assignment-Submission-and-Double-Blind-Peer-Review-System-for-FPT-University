import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const InstructorCreatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kiểm tra yêu cầu mật khẩu
  const passwordRequirements = [
    { text: 'Ít nhất 8 ký tự', check: password.length >= 8 },
    { text: 'Chứa ít nhất 1 chữ hoa', check: /[A-Z]/.test(password) },
    { text: 'Chứa ít nhất 1 số', check: /\d/.test(password) }
  ];

  const isValidPassword = passwordRequirements.every(req => req.check);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleCreatePassword = () => {
    if (isValidPassword && passwordsMatch) {
      alert('Mật khẩu đã được tạo thành công!');
      // Logic tạo mật khẩu ở đây
    }
  };

  const handleCancel = () => {
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <ArrowLeft size={20} className="mr-2 cursor-pointer hover:text-gray-800" />
          <span className="hover:text-gray-800 cursor-pointer">Danh sách lớp học</span>
          <span className="mx-2">›</span>
          <span className="hover:text-gray-800 cursor-pointer">WDU391 - SE1819</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-medium">Thiết lập mật khẩu</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Class Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Class Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-blue-600 text-sm font-medium mb-2">Thiết kế UI/UX</div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Lớp SE1819</h2>
              <p className="text-gray-600">WDU391</p>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <h3 className="text-yellow-800 font-semibold mb-1">Bảo mật lớp học</h3>
                  <p className="text-yellow-700 text-sm">
                    Mật khẩu này sẽ được sử dụng để bảo vệ thông tin lớp học và chỉ những sinh viên có mật khẩu mới có thể truy cập.
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
                  Tạo mật khẩu cho lớp học
                </h1>
                <p className="text-gray-600">
                  Vui lòng tạo mật khẩu an toàn để bảo vệ thông tin lớp học của bạn
                </p>
              </div>

              <div className="space-y-6">
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu lớp học
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
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

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-600 text-sm mt-2">Mật khẩu không khớp</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Yêu cầu mật khẩu:</p>
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
                    Hủy
                  </button>
                  <button
                    onClick={handleCreatePassword}
                    disabled={!isValidPassword || !passwordsMatch}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isValidPassword && passwordsMatch
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Tạo mật khẩu
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

export default InstructorCreatePassword;