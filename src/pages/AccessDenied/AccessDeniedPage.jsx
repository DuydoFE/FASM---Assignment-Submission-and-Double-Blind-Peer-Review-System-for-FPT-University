import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, LogOut } from "lucide-react";
import { useCurrentAccount } from "../../utils/accountUtils";

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const user = useCurrentAccount();

  const handleGoHome = () => {
    if (user?.roles[0] === "Instructor") {
      navigate("/instructor/dashboard");
    } else if (user?.roles[0] === "Admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 opacity-20 blur-3xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-6 rounded-full">
                <ShieldAlert className="w-16 h-16 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-2">
            Truy cập bị từ chối
          </p>

          {/* Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 text-lg mb-4">
              Bạn không có quyền truy cập trang này.
            </p>
            {user && (
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold">Tài khoản:</span> {user.email}
                </p>
                <p>
                  <span className="font-semibold">Vai trò:</span>{" "}
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {user.roles[0]}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <p className="text-gray-500 mb-8">
            Trang này chỉ dành cho sinh viên. Vui lòng quay lại trang chủ hoặc đăng xuất để chuyển sang tài khoản khác.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 transition-all duration-200 hover:border-gray-400"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;