import React, { useState } from "react";
import { AlertCircle, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import fasmLogo from "../../assets/img/FASM.png";
import Aurora from "@/components/Aurora";
import api from "../../config/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/account/forgot-password", { email });
      
      if (response.data.statusCode === 200) {
        setIsSuccess(true);
        toast.success("Password reset link has been sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black text-zinc-200 overflow-hidden font-sans">
      {/* Aurora Background */}
      <Aurora
        className="absolute top-0 left-0 w-full h-full z-0"
        colorStops={['#0055FF', '#FF8C00', '#20BF55']}
        blend={0.5}
        amplitude={1.0}
        speed={0.2}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden p-[2px] shadow-2xl animate-fade-in-up group">
        {/* Animated Border */}
        <div className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF8C00_0%,#0055FF_50%,#20BF55_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative h-full w-full bg-zinc-950/90 backdrop-blur-xl rounded-2xl p-8 md:p-12">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="absolute top-6 left-6 flex items-center text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Login</span>
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center mt-8 mb-8">
            <img 
              src={fasmLogo} 
              alt="FASM Logo" 
              className="h-24 w-auto object-contain mb-6 drop-shadow-lg" 
            />
            
            {!isSuccess ? (
              <>
                <h1 className="text-2xl font-bold text-white mb-2 text-center">
                  Forgot Password?
                </h1>
                <p className="text-zinc-400 text-sm text-center max-w-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 text-center">
                  Check Your Email
                </h1>
                <p className="text-zinc-400 text-sm text-center max-w-sm">
                  We've sent a password reset link to <span className="text-orange-400 font-medium">{email}</span>
                </p>
              </>
            )}
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-lg shadow-orange-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Info Message */}
              <div className="flex items-start p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                  The system will generate a new password (with letters, numbers, and special characters) and send it to your email.
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Info */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-300 mb-2">
                  ✓ A password reset email has been sent successfully
                </p>
                <p className="text-xs text-zinc-400">
                  Please check your inbox and spam folder. The email contains your new password.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-lg shadow-orange-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  Return to Login
                </button>
                
                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full py-3 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-lg border border-white/10 transition-all"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center justify-center text-zinc-500">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-xs">Need help? Contact support@fasm.site</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;