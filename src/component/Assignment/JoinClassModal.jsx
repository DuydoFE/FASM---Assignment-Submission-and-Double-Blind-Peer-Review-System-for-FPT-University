// src/component/Assignment/JoinClassModal.jsx
import React, { useState } from 'react';
import { X, LockKeyhole, KeyRound, Eye, EyeOff, Info, User } from 'lucide-react';

const JoinClassModal = ({ isOpen, onClose, course }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  if (!isOpen || !course) return null;

  const handleJoin = () => {
    
    alert(`Đang tham gia lớp ${course.title} với mật khẩu: ${password}`);
    onClose(); 
  };

  return (
    // Lớp phủ toàn màn hình
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose} 
    >
      
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} 
      >
      
        <div className="text-center border-b pb-4 mb-4">
          <div className="absolute top-0 left-0 bg-blue-600 text-white font-bold py-1 px-3 rounded-br-lg rounded-tl-lg">
            {course.code}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          <p className="font-bold text-lg mt-6">{`${course.code} - ${course.subjectCode}`}</p>
          <p className="text-sm text-gray-500">{course.title}</p>
        </div>

      
        <div className="flex flex-col items-center my-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
            NT
          </div>
          <p className="font-semibold">Nguyễn Minh Sang</p>
          <p className="text-sm text-gray-500">sangnm18@fe.edu.vn</p>
        </div>

       
        <div className="text-center">
          <div className="inline-block p-3 bg-red-100 rounded-full mb-3">
            <LockKeyhole className="text-red-500" size={28} />
          </div>
          <h2 className="text-xl font-bold">Nhập mật khẩu lớp học</h2>
          <p className="text-sm text-gray-500 mt-1">Vui lòng nhập mật khẩu do giảng viên cung cấp để tham gia lớp học này.</p>
        </div>

        {/* Input */}
        <div className="my-6">
          <label className="font-semibold text-sm mb-2 block">Mật khẩu lớp học *</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Mật khẩu được cung cấp bởi giảng viên trong buổi học đầu tiên</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          <div className="flex">
            <Info className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-bold mb-2">Lưu ý quan trọng</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mật khẩu phân biệt chữ hoa và chữ thường</li>
                <li>Liên hệ giảng viên nếu bạn chưa nhận được mật khẩu</li>
                <li>Mỗi lớp học có mật khẩu riêng để bảo mật</li>
              </ul>
            </div>
          </div>
        </div>
        
        
        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={onClose} className="px-6 py-2.5 rounded-md border border-gray-300 font-semibold hover:bg-gray-100">
            Hủy bỏ
          </button>
          <button onClick={handleJoin} className="flex items-center px-6 py-2.5 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600">
            <User className="mr-2" size={18} />
            Tham gia lớp
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinClassModal;

