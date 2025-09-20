
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left Section: Logo and Nav */}
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-orange-500">
              FASM
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-orange-500">Xem danh sách Assignment</a>
              <a href="#" className="text-gray-600 hover:text-orange-500">Assignment của tôi</a>
            </nav>
          </div>

          {/* Right Section: Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài tập, khóa học..."
                className="pl-10 pr-4 py-2 w-64 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 border rounded px-1.5 py-0.5">Ctrl+K</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Đăng nhập
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-blue-500"></div>
    </header>
  );
};

export default Header;