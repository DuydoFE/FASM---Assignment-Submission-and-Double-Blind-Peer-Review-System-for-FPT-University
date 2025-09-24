import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react"; // Giả sử bạn đang dùng lucide-react cho icons

// Bạn có thể tạo một component SVG riêng cho logo hoặc dùng thẻ img
const FasmLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-orange-500 p-2 rounded-md">
      {/* Icon đơn giản giống logo */}
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


const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Phần bên trái: Logo và Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <FasmLogo />
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                
                Home
              </Link>
                <Link
                to="/studentdashboard"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                
                MiniDashBoard
              </Link>
              <Link
                to="/my-assignments"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Assignment của tôi
              </Link>
            </nav>
          </div>

          {/* Phần bên phải: Search và Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài tập, khóa học..."
                className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2 text-gray-400 text-sm">
                 <Filter className="h-4 w-4" />
                 <span>Ctrl+K</span>
              </div>
            </div>

            {/* Auth Buttons */}
            <Link
              to="/login"
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;