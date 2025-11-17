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
      className="!bg-[#1c1c1c] !border !border-gray-700"
      items={[
        {
          key: "profile",
          label: (
            <Link to="/profile" className="flex items-center !text-gray-300 hover:!text-white">
              <User className="w-4 h-4 mr-2" /> Profile
            </Link>
          ),
        },
        {
          key: "logout",
          label: (
            <span onClick={handleLogout} className="flex items-center !text-gray-300 hover:!text-white">
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </span>
          ),
        },
      ]}
    />
  );

  return (
    // Hiệu ứng glassmorphism
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <span className="font-bold text-2xl text-white">FASM</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white flex items-center transition-colors">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
              <Link to="/studentdashboard" className="text-gray-300 hover:text-white flex items-center transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-1" /> MiniDashBoard
              </Link>
              <Link to="/my-assignments" className="text-gray-300 hover:text-white flex items-center transition-colors">
                <ClipboardList className="w-4 h-4 mr-1" /> My Assignments
              </Link>
              <Link to="/regrade-request" className="text-gray-300 hover:text-white flex items-center transition-colors">
                <History className="w-4 h-4 mr-1" /> View Request History
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-16 py-2 border border-gray-700 rounded-lg bg-[#1c1c1c] text-white focus:ring-orange-500 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2 text-gray-500 text-sm">
                <Filter className="h-4 w-4" />
                <span>Ctrl+K</span>
              </div>
            </div>

            {user ? (
              <Dropdown overlay={menu} trigger={["hover"]}>
                <Button type="text" className="flex items-center space-x-2 !h-auto !p-0">
                  <Avatar src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                  <span className="font-medium text-gray-200 hover:text-white transition-colors">
                    {user.username}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Link to="/login" className="px-6 py-2 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-gray-800 transition-colors">
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