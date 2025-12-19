import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
          backgroundImage: `url(${InstructorBg})`
        }}
      />
      
      {/* Subtle Gradient Overlay with fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"
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

          {/* 404 Error Code with scale-in animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <motion.h1
              whileHover={{ scale: 1.1 }}
              className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              404
            </motion.h1>
          </motion.div>

          {/* Title with slide-in animation */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="text-2xl font-bold mb-3 text-gray-800"
          >
            Page Not Found
          </motion.h2>
          
          {/* Explanation with fade-in animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="mb-6 px-2"
          >
            <motion.p
              whileHover={{ scale: 1.05 }}
              className="text-sm text-gray-700 leading-relaxed mb-2"
            >
              The page you are looking for doesn't exist or has been moved.
            </motion.p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Please check the URL or return to the homepage to find what you're looking for.
            </p>
          </motion.div>

          {/* Search Icon Decoration with pulse animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.1, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 12 }}
              className="bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-full p-4"
            >
              <Search className="w-8 h-8 text-blue-600" />
            </motion.div>
          </motion.div>

          {/* Action Buttons with staggered fade-in animation */}
          <div className="flex flex-col gap-3 mb-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700 font-semibold px-6 py-3 rounded-lg border border-gray-300/50 hover:border-gray-400/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Go Back</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;