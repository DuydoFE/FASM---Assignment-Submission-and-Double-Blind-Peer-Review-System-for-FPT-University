// src/component/Header/Header.jsx
import { Link } from "react-router-dom";
import { Search, Filter, User, LogOut, Home, LayoutDashboard, ClipboardList, History } from "lucide-react";
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { Dropdown, Menu, Avatar, Button } from "antd";
import { toast } from "react-toastify";

const Header = () => {
  const user = getCurrentAccount();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };
  
  const menu = (
    <Menu
      items={[
        { key: "profile", label: <Link to="/profile" className="flex items-center"><User className="w-4 h-4 mr-2" /> Profile</Link> },
        { key: "logout", label: <span onClick={handleLogout} className="flex items-center"><LogOut className="w-4 h-4 mr-2" /> Log Out</span> },
      ]}
    />
  );

  return (
    // Đổi sang hiệu ứng glassmorphism màu KEM
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-orange-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <span className="font-bold text-2xl text-zinc-900">FASM</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {/* Đổi màu chữ sang xám ấm */}
              <Link to="/" className="text-zinc-600 hover:text-orange-500 flex items-center transition-colors">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
              <Link to="/studentdashboard" className="text-zinc-600 hover:text-orange-500 flex items-center transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-1" /> MiniDashBoard
              </Link>
              <Link to="/my-assignments" className="text-zinc-600 hover:text-orange-500 flex items-center transition-colors">
                <ClipboardList className="w-4 h-4 mr-1" /> My Assignments
              </Link>
              <Link to="/regrade-request" className="text-zinc-600 hover:text-orange-500 flex items-center transition-colors">
                <History className="w-4 h-4 mr-1" /> View Request History
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-16 py-2 border border-orange-200 rounded-lg bg-white text-zinc-900 focus:ring-orange-500 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2 text-zinc-400 text-sm">
                <Filter className="h-4 w-4" />
                <span>Ctrl+K</span>
              </div>
            </div>

            {user ? (
              <Dropdown overlay={menu} trigger={["hover"]}>
                <Button type="text" className="flex items-center space-x-2 !h-auto !p-0">
                  <Avatar src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                  <span className="font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                    {user.username}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Link to="/login" className="px-6 py-2 border border-orange-200 rounded-lg font-medium text-zinc-700 hover:bg-orange-100 transition-colors">
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;