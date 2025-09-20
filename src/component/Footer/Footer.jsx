
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">AssignmentHub</h2>
            <p className="text-gray-400">
              Nền tảng quản lý bài tập thông minh dành cho sinh viên và giảng viên.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Tính năng</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Hỗ trợ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Liên hệ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@assignmenthub.com</li>
              <li className="text-gray-400">+84 123 456 789</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;