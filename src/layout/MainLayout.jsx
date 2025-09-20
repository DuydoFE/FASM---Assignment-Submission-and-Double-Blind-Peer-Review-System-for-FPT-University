import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";
import { Outlet } from "react-router-dom";
function Layout() {
  return (
    <div>
      <Header />
      <div
        className="main-content"
        style={{
        
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
export default Layout;