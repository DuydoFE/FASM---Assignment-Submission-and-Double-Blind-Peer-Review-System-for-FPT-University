import React, { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import StudentImage from "../../assets/img/Student.png";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get message from URL query params or location state
  const errorMessage = searchParams.get("message") || location.state?.message || "Access Denied";

  useEffect(() => {
    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-red-100"
        >
          <div className="grid md:grid-cols-5 gap-0">
            {/* Left side - Image - Takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 md:h-auto md:col-span-3"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10"></div>
              <img
                src={StudentImage}
                alt="Access Denied"
                className="w-full h-full object-contain p-4"
              />
            </motion.div>

            {/* Right side - Content - Takes 2 columns */}
            <div className="p-8 md:p-12 flex flex-col justify-center md:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-lg">
                  <ShieldX className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              >
                403
                <span className="block text-2xl md:text-3xl text-red-600 mt-2">
                  Access Forbidden
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 text-lg mb-2"
              >
                You don't have permission to access this resource.
              </motion.p>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
                >
                  <p className="text-red-700 font-medium">{errorMessage}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-50 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-sm text-gray-500 mt-6"
              >
                You will be redirected to the home page in 10 seconds...
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600">
            If you believe this is an error, please contact your instructor or administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForbiddenPage;