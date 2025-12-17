import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Search } from "lucide-react";
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { Dropdown, Menu, Avatar, Button, Input } from "antd";
import { logout as logoutAction } from "../../redux/features/userSlice";
import { logout as logoutApi } from "../../service/userService";
import { toast } from "react-toastify";
import { useState } from "react";
import NotificationPopover from "./NotificationPopover";
import fasmLogo from "../../assets/img/FASM.png";

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

  const navItems = [
    { key: "/instructor/dashboard", label: "Dashboard" },
    { key: "/instructor/my-classes", label: "My Classes" },
    { key: "/instructor/regrade-request", label: "Regrade Requests" },
  ];

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const matchedItem = navItems.find(item =>
      currentPath === item.key || currentPath.startsWith(item.key)
    );
    return matchedItem ? matchedItem.key : currentPath;
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      navigate(
        `/instructor/search?query=${encodeURIComponent(searchValue.trim())}`
      );
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    try {
      await logoutApi();
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
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

            <Menu
              mode="horizontal"
              selectedKeys={[getSelectedKey()]}
              items={navItems}
              onClick={handleMenuClick}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                minWidth: '500px',
                fontSize: '16px',
                lineHeight: '64px',
              }}
              className="text-lg font-medium"
              disabledOverflow={true}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search..."
              prefix={<Search className="w-5 h-5 text-gray-700" />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              size="large"
              className="w-80"
              style={{
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />

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
