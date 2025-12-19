import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import FASMLogo from "../../assets/img/FASM.png";
import InstructorBg from "../../assets/img/Instructor.png";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center relative">
      {/* Background Image - Clear and Bright */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${InstructorBg})`
        }}
      />
      
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />

      {/* Content Container */}
      <div className={`relative z-10 max-w-md w-full mx-4 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 text-center border border-white/40">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <img 
                src={FASMLogo} 
                alt="FASM Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* 404 Error Code */}
          <div className="mb-4">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3 text-gray-800">
            Page Not Found
          </h2>
          
          {/* Explanation */}
          <div className="mb-6 px-2">
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Please check the URL or return to the homepage to find what you're looking for.
            </p>
          </div>

          {/* Search Icon Decoration */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-full p-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-300/50 hover:border-gray-400/50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;