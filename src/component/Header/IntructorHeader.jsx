import { Link } from "react-router-dom";
import { Bell, Book, Calendar } from 'lucide-react';

const FasmLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-orange-500 p-2 rounded-md">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4H20V18H4V4ZM6 8V16H18V8H6Z"
          fill="white"
        />
      </svg>
    </div>
    <span className="font-bold text-2xl text-gray-800">FASM</span>
  </div>
);

const InstructorHeader = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/instructordashboard">
              <FasmLogo />
            </Link>

            <nav className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 text-sm font-medium">Năm học:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  <option>2025</option>
                  <option>2026</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 text-sm font-medium">Học kỳ:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                  <option>FALL 2025</option>
                  <option>SPRING 2026</option>
                </select>
              </div>

              <Link
                to="/instructordashboard"
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/my-classes"
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                Lớp học của tôi
              </Link>
              <Link
                to="/regrade-request"
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                Đơn khiếu nại
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">QL</span>
              </div>
              <div className="text-sm">
                <div className="text-gray-900 font-medium">Quang Loc</div>
                <div className="text-gray-500">Instructor - HCM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default InstructorHeader;