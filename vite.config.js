import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ✅ Xác định đường dẫn tuyệt đối tới thư mục chứa vite.config.js
const root = path.resolve(__dirname, ".");

export default defineConfig(({ mode }) => {
  // ✅ Ép Vite load .env trong thư mục gốc dự án
  const env = loadEnv(mode, root, "");

  console.log("🌍 Loaded ENV from vite.config.js:", env);

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: env,
    },
  };
});
