
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import { X, Lock, Key, Eye, EyeOff, Info, Users } from 'lucide-react';

const JoinClassModal = ({ isOpen, onClose, course }) => {
  const currentUser = useSelector(selectUser);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !course) {
    return null;
  }

  const handleJoinClass = () => {
    console.log(`Joining class ${course.courseInstanceId} with password: ${password}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          {course.courseCode} - {course.courseInstanceName}
        </h2>
        <hr className="mb-6"/>
        
        <div className="text-center mb-6">
          <div className="mx-auto bg-indigo-100 text-indigo-600 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-3">
            <Users className="w-7 h-7" />
          </div>
          <p className="font-semibold text-gray-800">{course.courseInstanceName}</p>
          <p className="text-sm text-gray-600">{course.courseName}</p>
        </div>
        
        <div className="text-center mb-6">
            <div className="mx-auto bg-red-100 text-red-500 w-14 h-14 rounded-full flex items-center justify-center">
                <Lock className="w-7 h-7"/>
            </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Nhập mật khẩu lớp học</h3>
          <p className="text-gray-600 mb-6">Vui lòng nhập mật khẩu để tham gia lớp học <span className="font-semibold">{course.courseName}</span>.</p>
          
          <div className="relative">
            <label htmlFor="password" className="sr-only">Mật khẩu lớp học</label>
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-left">Mật khẩu được cung cấp bởi giảng viên trong buổi học đầu tiên</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-6 text-sm text-blue-800">
            <div className="flex">
                <Info className="w-5 h-5 mr-3 flex-shrink-0"/>
                <div>
                    <h4 className="font-bold mb-2">Lưu ý quan trọng</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Mật khẩu phân biệt chữ hoa và chữ thường</li>
                        <li>Liên hệ giảng viên nếu bạn chưa nhận được mật khẩu</li>
                        <li>Mỗi lớp học có mật khẩu riêng để bảo mật</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100 font-semibold">
            Hủy bỏ
          </button>
          <button onClick={handleJoinClass} className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold flex items-center">
            Tham gia lớp
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinClassModal;