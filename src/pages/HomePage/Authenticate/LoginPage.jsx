import React from "react";
import { AlertCircle } from "lucide-react"; // Import icon từ lucide-react

// Import hình ảnh
import logo from "../../assets/img/Logo_FPT_Education.png";
import backgroundImage from "../../assets/img/daihocfpt.png";

// SVG cho logo Google vì lucide-react không có icon thương hiệu
const GoogleIcon = (props) => (
  <svg
    {...props}
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="google"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8S109.8 11.8 244 11.8c70.3 0 132.3 28.1 176.4 73.2l-68.2 66.3C324.7 122.3 287.4 96 244 96c-82.6 0-149.3 67.2-149.3 150.1s66.7 150.1 149.3 150.1c96.4 0 128.8-68.9 133.4-105.1H244V261.8h244z"
    ></path>
  </svg>
);


const LoginPage = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg flex w-full max-w-4xl">
        {/* Phần Form Đăng Nhập (Bên Trái) */}
        <div className="w-1/2 flex flex-col items-center pr-10">
          <img src={logo} alt="FPT Education Logo" className="w-40 mb-4" />
          <h1 className="text-xl font-bold text-orange-600 mb-6">
            TRƯỜNG ĐẠI HỌC FPT
          </h1>
          
          <div className="w-full">
            <input
              type="text"
              placeholder="duynckse171155"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="password"
              placeholder="•••••••••"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="w-full py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition-colors mb-4">
              Log in
            </button>
          </div>
          
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Lost password?
          </a>
        </div>

        {/* Đường kẻ phân cách */}
        <div className="w-px bg-gray-200"></div>

        {/* Phần Đăng Nhập Mạng Xã Hội (Bên Phải) */}
        <div className="w-1/2 flex flex-col justify-center pl-10">
          <p className="text-gray-600 mb-4">Sign in with</p>
          
          <button className="w-full flex items-center justify-center py-2.5 px-4 mb-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <GoogleIcon className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-sm text-gray-700">@fpt.edu.vn (For lecturer only)</span>
          </button>

          <div className="flex items-center text-red-600">
             <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">Cookies notice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;