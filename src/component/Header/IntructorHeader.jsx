import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Search } from "lucide-react";
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { Dropdown, Menu, Avatar, Button } from "antd";
import { logout as logoutAction } from "../../redux/features/userSlice";
import { logout as logoutApi } from "../../service/userService";
import { toast } from "react-toastify";
import { useState } from "react";
// Import component NotificationPopover đã tách riêng
import NotificationPopover from "./NotificationPopover";
import fasmLogo from "../../assets/img/FASM.png";
import PillNav from "../../components/PillNav";

const FasmLogo = () => (
  <div className="flex items-center">
    <img
      src={fasmLogo}
      alt="FASM Logo"
      className="h-16 w-auto object-contain"
    />
  </div>
);

const InstructorHeader = () => {
  const user = getCurrentAccount();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  // Navigation items for PillNav
  const navItems = [
    { label: "Dashboard", href: "/instructor/dashboard" },
    { label: "My Classes", href: "/instructor/my-classes" },
    { label: "Regrade Requests", href: "/instructor/regrade-request" },
  ];

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(
        `/instructor/search?query=${encodeURIComponent(searchValue.trim())}`
      );
    }
  };

  const handleLogout = async () => {
    // Clear local storage first to prevent re-authentication with old tokens
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    try {
      // Call backend logout API to clear the HTTP-only cookie
      await logoutApi();
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      dispatch(logoutAction());
      toast.warning(
        "Logged out locally. Please clear browser cookies if issues persist."
      );
      navigate("/login");
    }
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
              <LogOut className="w-4 h-4 mr-2" /> Logout
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
          <div className="flex items-center space-x-8">
            <Link to="/instructor/dashboard">
              <FasmLogo />
            </Link>

            <nav className="flex items-center">
              <PillNav
                items={navItems}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
              />
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Component NotificationPopover được gọi ở đây */}
            {user && <NotificationPopover user={user} />}

            {user ? (
              <Dropdown className="p-3" overlay={menu} trigger={["hover"]}>
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
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default InstructorHeader;
