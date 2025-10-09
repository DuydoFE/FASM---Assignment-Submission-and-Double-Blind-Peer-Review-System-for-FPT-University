import { Link } from "react-router-dom";
import { Search, Filter, User, LogOut } from "lucide-react";
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
        {
          key: "profile",
          label: (
            <Link to="/profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" /> Profile
            </Link>
          ),
        },
        {
          key: "logout",
          label: (
            <span onClick={handleLogout} className="flex items-center">
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </span>
          ),
        },
      ]}
    />
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <span className="font-bold text-2xl text-gray-800">FASM</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-orange-500">
                Home
              </Link>
              <Link
                to="/studentdashboard"
                className="text-gray-600 hover:text-orange-500"
              >
                MiniDashBoard
              </Link>
              <Link
                to="/my-assignments"
                className="text-gray-600 hover:text-orange-500"
              >
                My Assignments
              </Link>
            </nav>
          </div>

          {/* Right: Search + Auth */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài tập, khóa học..."
                className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2 text-gray-400 text-sm">
                <Filter className="h-4 w-4" />
                <span>Ctrl+K</span>
              </div>
            </div>

            {/* Auth / User Menu */}
            {user ? (
              <Dropdown className="pb-2" overlay={menu} trigger={["hover"]}>
                <Button type="text" className="flex items-center space-x-2">
                  <Avatar
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.username}`
                    }
                  />
                  <span className="font-medium text-gray-700">
                    {user.username}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Log in
                </Link>
             
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
