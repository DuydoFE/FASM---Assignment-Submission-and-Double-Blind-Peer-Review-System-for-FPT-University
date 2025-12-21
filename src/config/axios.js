import axios from "axios";
import { toast } from "react-toastify";

// Lấy baseURL từ env
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  timeout: 3000000,
  withCredentials: true, // Required to send/receive cookies for cross-origin requests
});

// Thêm token vào header trước mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      // Get full message from backend
      const errorMessage = error.response.data?.message;
      
      if (errorMessage) {
        // Redirect to forbidden page with error message
        window.location.href = `/forbidden?message=${encodeURIComponent(errorMessage)}`;
      }
    }
    
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default api;