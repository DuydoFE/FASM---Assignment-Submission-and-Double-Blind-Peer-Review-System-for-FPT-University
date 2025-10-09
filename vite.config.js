import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // ✅ Luôn trỏ đến thư mục gốc dự án (process.cwd() là cách an toàn nhất)
  const env = loadEnv(mode, process.cwd(), "");

  console.log("🌍 Loaded ENV:", env); // Kiểm tra trong terminal

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: env,
    },
  };
});
