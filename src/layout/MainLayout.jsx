// src/pages/Layout.jsx
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer"; // Bạn có thể muốn tạo Footer theme tối
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    // Nền tối cho toàn bộ ứng dụng
    <div className="bg-[#0a0a0a] text-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;