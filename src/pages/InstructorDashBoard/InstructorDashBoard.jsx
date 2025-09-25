import React from 'react';
import { Search, ArrowUpDown, Book, Users, Calendar, AlertTriangle, Clock } from 'lucide-react';

// Dashboard Content Component
const InstructorDashboard = () => {
   return (
    <div className="max-w-7xl mx-auto px-6 py-8 ">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">FALL2025</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Tổng lớp học */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng lớp học</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        {/* Tổng sinh viên */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng sinh viên</p>
              <p className="text-3xl font-bold text-gray-900">91</p>
            </div>
          </div>
        </div>

        {/* Lớp đang dạy */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Lớp đang dạy</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        {/* Khiếu nại */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Khiếu nại</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lớp học trong kỳ Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Lớp học trong kỳ</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Tìm môn học..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sắp xếp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* PRO192 Card */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">PRO192 - SE1718</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Đang diễn ra</span>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-4 text-base">Lập trình JAVA cơ bản</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>30 sinh viên</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>FALL2025</span>
                </div>
              </div>
            </div>

            {/* CSI102 Card */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">CSI102 - SE1720</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Đang diễn ra</span>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-4 text-base">Cấu trúc dữ liệu</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>35 sinh viên</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>FALL2025</span>
                </div>
              </div>
            </div>

            {/* MAD201 Card */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">MAD201 - SE1810</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Sắp bắt đầu</span>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-4 text-base">Toán cao cấp</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>26 sinh viên</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>FALL2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Khiếu nại theo môn Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Khiếu nại theo môn</h2>
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* First CS101 Group */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-600">CS101</span>
                <span className="ml-2 text-sm text-gray-700">Lập trình cơ bản</span>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">2 khiếu nại</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Khiếu nại về điểm Assignment 1 - SE171155 - Nguyễn Chính Khương Duy- SE1710</p>
                  <p className="text-xs text-gray-500 mt-1">1 ngày trước</p>
                </div>
              </div>
              
              <div className="flex items-start bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Khiếu nại về điểm Assignment 2 - SE171488 - Trần Quang Lộc - SE1710</p>
                  <p className="text-xs text-gray-500 mt-1">1 ngày trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second CS101 Group */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-600">CS101</span>
                <span className="ml-2 text-sm text-gray-700">Lập trình cơ bản</span>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">2 khiếu nại</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Khiếu nại về điểm Assignment 1 - SE171155 - Nguyễn Chính Khương Duy- SE1710</p>
                  <p className="text-xs text-gray-500 mt-1">1 ngày trước</p>
                </div>
              </div>
              
              <div className="flex items-start bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">Khiếu nại về điểm Assignment 2 - SE171488 - Trần Quang Lộc - SE1710</p>
                  <p className="text-xs text-gray-500 mt-1">1 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default InstructorDashboard;