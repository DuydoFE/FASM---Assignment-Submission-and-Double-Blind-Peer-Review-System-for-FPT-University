import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, LogOut, Lock } from "lucide-react";
import { useCurrentAccount } from "../../utils/accountUtils";
import { useEffect, useState } from "react";
import FASMLogo from "../../assets/img/FASM.png";

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const user = useCurrentAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-2xl w-full relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/20">
          {/* Logo with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500 rounded-full animate-pulse"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={FASMLogo} 
                  alt="FASM Logo" 
                  className="w-24 h-24 object-contain animate-float"
                />
              </div>
            </div>
          </div>

          {/* Animated Shield Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 opacity-20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-5 rounded-full shadow-xl animate-bounce-slow">
                <ShieldAlert className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1">
                <Lock className="w-6 h-6 text-red-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title with Gradient */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient">
            Access Denied
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 font-medium">
            You don't have permission to access this page
          </p>

          {/* User Info Card with Animation */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-8 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {user?.email?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium">Current User</p>
                <p className="text-gray-800 font-semibold">{user?.email || "Unknown"}</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600 font-medium">Role:</span>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-md transform hover:scale-105 transition-transform">
                  <Lock className="w-4 h-4 mr-2" />
                  {user.roles[0]}
                </span>
              </div>
            )}
          </div>

          {/* Message Box */}
          <div className="bg-white border-l-4 border-red-500 rounded-lg p-6 mb-8 shadow-md">
            <p className="text-gray-700 text-base leading-relaxed">
              This page is restricted to <span className="font-bold text-red-600">Student</span> role only. 
              Please navigate back to your dashboard or sign out to switch to a different account.
            </p>
          </div>

          {/* Action Buttons with Animation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={handleGoHome}
              className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <Home className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
              <span className="relative">Go to Dashboard</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="group relative flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <LogOut className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Footer with subtle animation */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 animate-fade-in">
              If you believe this is an error, please contact the system administrator.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-red-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-400 rounded-full opacity-20 blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-in;
        }
      `}</style>
    </div>
  );
};

export default AccessDeniedPage;