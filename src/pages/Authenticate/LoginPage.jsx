import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import fasmLogo from "../../assets/img/FASM.png"; 
import Aurora from "@/components/Aurora"; 

import { login } from "../../service/userService";
import { loginRedux } from "../../redux/features/userSlice";
import api from "../../config/axios";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async () => {
    const data = {
      username,
      password,
    };
    try {
      const result = await login(data);
      console.log("Login success:", result);
      dispatch(loginRedux(result));
      toast.success("Login successful!");
      
      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      if (result.roles?.includes("Admin")) navigate("/admin/dashboard");
      else if (result.roles?.includes("Instructor")) navigate("/instructor/dashboard");
      else navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleLoginGoogle = () => {
    window.location.href =
      "https://localhost:7104/api/account/google-login?returnUrl=http://localhost:5173/login?google=true";
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const fullUrl = window.location.href;
      const query = fullUrl.split('?').slice(1).join('&')
      const params = new URLSearchParams(query);
      const isGoogleCallback = params.get("google"); 
      const accessToken = params.get("accessToken"); 
      const refreshToken = params.get("refreshToken"); 
      
      if (isGoogleCallback) {
        try {
          console.log("Detected Google callback, fetching user info...");

          const res = await api.get('/account/me', {
            withCredentials: true
          });
          
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          
          dispatch(loginRedux(res.data.data));
          toast.success("Google Login successful!");
          
          const roles = res.data.data.roles || [];
          if (roles.includes("Admin")) navigate("/admin/dashboard");
          else if (roles.includes("Instructor")) navigate("/instructor/dashboard");
          else navigate("/");
        } catch (err) {
          console.error("Failed to fetch user after Google callback:", err);
          toast.error("Google Login failed.");
          navigate("/login");
        }
      }
    };

    handleGoogleCallback();
  }, []);

  // --- PHẦN GIAO DIỆN MỚI (NEW UI) ---
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black text-zinc-200 overflow-hidden font-sans">
      
      {/* Background Aurora */}
      <Aurora
        className="absolute top-0 left-0 w-full h-full z-0"
        colorStops={['#0055FF', '#FF8C00', '#20BF55']}
        blend={0.5}
        amplitude={1.0}
        speed={0.2}
      />

      {/* --- WRAPPER HIỆU ỨNG VIỀN --- */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden p-[2px] shadow-2xl animate-fade-in-up group">
        
        {/* Layer Gradient Xoay (Chỉnh 10s cho chậm) */}
        <div className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF8C00_0%,#0055FF_50%,#20BF55_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* --- NỘI DUNG --- */}
        <div className="relative h-full w-full bg-zinc-950/90 backdrop-blur-xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
          
          {/* Cột Trái: Form Login Username/Password */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/5">
            <img 
              src={fasmLogo} 
              alt="FASM Logo" 
              className="h-24 w-auto object-contain mb-6 drop-shadow-lg" 
            />
            
            <h1 className="text-2xl font-bold text-white mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-zinc-400 text-sm mb-8 text-center">
              Fpt Assignment Submission & Management
            </p>

            <div className="w-full space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nhập tài khoản wifi Student"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
              </div>
              
              <div className="flex justify-end">
                <a href="#" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                  Lost password?
                </a>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-lg shadow-orange-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Log in
              </button>
            </div>
          </div>

          {/* Cột Phải: Login Google */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-900/30">
            <h2 className="text-xl font-semibold text-white mb-6 text-center md:text-left">
              Alternative Login
            </h2>
            
            <p className="text-zinc-400 mb-6 text-sm">
              Use your organizational account to sign in securely.
            </p>

            <button 
              onClick={handleLoginGoogle} 
              className="w-full flex items-center justify-center py-3 px-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-zinc-200 transition-all shadow-md group"
            >
              <GoogleIcon className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Sign in with Google</span>
            </button>
            
            <p className="text-xs text-zinc-500 mt-3 text-center">
              @fpt.edu.vn (For lecturer only)
            </p>

            <div className="mt-auto pt-8 flex items-center justify-center md:justify-start text-orange-400/80">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-xs">This site uses cookies for authentication.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;