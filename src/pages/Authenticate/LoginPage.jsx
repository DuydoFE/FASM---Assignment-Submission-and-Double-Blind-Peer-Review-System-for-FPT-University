import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import logo from "../../assets/img/Logo_FPT_Education.png";
import backgroundImage from "../../assets/img/daihocfpt.png";
import { getCampus } from "../../service/campusService";
import { toast } from "react-toastify";
import { login } from "../../service/userService";
import { loginRedux } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../config/axios";
import axios from "axios";

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
  const [campuses, setCampuses] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [campusId, setCampusId] = useState("");

  const fetchCampus = async () => {
    const response = await getCampus();
    setCampuses(response);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchCampus();
  }, []);

  const handleLogin = async () => {
    const data = {
      username,
      password,
      campusId,
    };
    try {
      const result = await login(data);
      console.log("Login success:", result);
      dispatch(loginRedux(result));
      toast.success("Login successful!");
      // TODO: Lưu token, chuyển trang, vv.
      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // TODO: show thông báo lỗi cho user
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
      const isGoogleCallback = params.get("google"); // check param
      const accessToken = params.get("accessToken"); // check param
      const refreshToken = params.get("refreshToken"); // check param
      if (isGoogleCallback) {
        try {
          console.log("Detected Google callback, fetching user info...");

          const res = await api.get("/account/me", {
            withCredentials: true
          });
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          dispatch(loginRedux(res.data.data));
          toast.success("Google Login successful!");
          navigate("/instructor/dashboard");
        } catch (err) {
          console.error("Failed to fetch user after Google callback:", err);
          toast.error("Google Login failed.");
          navigate("/login"); 
        }
      }
    };

    handleGoogleCallback();
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg flex w-full max-w-4xl">
        <div className="w-1/2 flex flex-col items-center pr-10">
          <img src={logo} alt="FPT Education Logo" className="w-40 mb-4" />
          <h1 className="text-xl font-bold text-orange-600 mb-6">
            TRƯỜNG ĐẠI HỌC FPT
          </h1>

          <div className="w-full">
            <select
              defaultValue=""
              onChange={(e) => setCampusId(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-500"
            >
              <option value="" disabled>
                Select Campus
              </option>
              {campuses?.map((campus) => (
                <option
                  key={campus.campusId}
                  value={campus.campusId}
                  className="text-black"
                >
                  {campus.address}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Nhập tài khoản wifi Student"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition-colors mb-4"
            >
              Log in
            </button>
          </div>

          <a href="#" className="text-sm text-blue-600 hover:underline">
            Lost password?
          </a>
        </div>

        <div className="w-px bg-gray-200"></div>

        <div className="w-1/2 flex flex-col justify-center pl-10">
          <p className="text-gray-600 mb-4">Sign in with</p>

          <button onClick={handleLoginGoogle} className="w-full flex items-center justify-center py-2.5 px-4 mb-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <GoogleIcon className="w-5 h-5 mr-3 text-red-500" />
            <span className="text-sm text-gray-700">
              @fpt.edu.vn (For lecturer only)
            </span>
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
