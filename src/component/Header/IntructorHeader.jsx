import { Link, useNavigate } from "react-router-dom";
import { Bell, Book, Calendar, LogOut, User } from 'lucide-react';
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { Avatar, Button, Dropdown, Menu } from "antd";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";

const FasmLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="bg-orange-500 p-2 rounded-md">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4H20V18H4V4ZM6 8V16H18V8H6Z"
          fill="white"
        />
      </svg>
    </div>
    <span className="font-bold text-2xl text-gray-800">FASM</span>
  </div>
);

const InstructorHeader = () => {
  const user = getCurrentAccount();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/");
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

            <nav className="flex items-center space-x-6">
              
              

              <Link
                to="/instructor/dashboard"
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/instructor/my-classes"
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                My Classes
              </Link>
              <Link
                to="/instructor/regrade-request"
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                Regrade Requests
              </Link>
            </nav>
          </div>

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
    </header>
  );
};

export default InstructorHeader;
