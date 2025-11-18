// vite.config.js
import path from "path" // Thêm dòng này
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Thêm đoạn này
    },
  },
})