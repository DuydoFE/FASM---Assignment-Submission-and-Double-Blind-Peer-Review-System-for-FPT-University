import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useCurrentAccount } from "../../utils/accountUtils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FASMLogo from "../../assets/img/FASM.png";
import StudentBg from "../../assets/img/Student.png";

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


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-screen overflow-hidden flex items-center justify-center relative"
    >
      {/* Background Image - Clear and Bright with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${StudentBg})`
        }}
      />
      
      {/* Subtle Gradient Overlay with fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-teal-900/20"
      />

      {/* Content Container with slide and fade animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 max-w-md w-full mx-4"
      >
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}
          className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 text-center border border-white/40"
        >
          
          {/* Logo with bounce animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex justify-center mb-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 6 }}
              className="bg-white p-3 rounded-xl shadow-lg"
            >
              <img
                src={FASMLogo}
                alt="FASM Logo"
                className="w-16 h-16 object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Title with slide-in animation */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
          >
            Access Denied
          </motion.h1>
          
          {/* Explanation with fade-in animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mb-6 px-2"
          >
            <motion.p
              whileHover={{ scale: 1.05 }}
              className="text-sm text-gray-700 leading-relaxed mb-2"
            >
              You are attempting to access a restricted area that requires specific permissions.
            </motion.p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This page is only accessible to users with the appropriate role. Your current account does not have the necessary authorization to view this content.
            </p>
          </motion.div>

          {/* User Info Card with slide-up animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            className="bg-orange-50/60 backdrop-blur-sm border border-orange-200/50 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-gray-500 font-medium">Current User</p>
                <p className="text-sm text-gray-800 font-semibold truncate">{user?.email || "Unknown"}</p>
              </div>
            </div>
            
            {user && (
              <div className="mt-3 pt-3 border-t border-orange-200/50">
                <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm rounded-full font-semibold shadow-sm">
                  {user.roles[0]}
                </span>
              </div>
            )}
          </motion.div>

          {/* Action Button with fade-in animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </motion.button>
          </motion.div>

        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AccessDeniedPage;