import { Link, useNavigate } from "react-router-dom"; 
import { Search, Filter, User, LogOut, Home, LayoutDashboard, ClipboardList, History } from "lucide-react";
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { Dropdown, Menu, Avatar, Button } from "antd";
import { toast } from "react-toastify";
import { useState } from "react"; 
import NotificationPopover from "./NotificationPopover"; 

import fasmLogo from "../../assets/img/FASM.png"; 


const Header = () => {
  const user = getCurrentAccount();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [searchValue, setSearchValue] = useState(""); 

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login"); 
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const menu = (
    <Menu
      className="!rounded-xl !shadow-2xl !border !border-gray-200 !overflow-hidden"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        minWidth: '200px',
      }}
      items={[
        {
          key: "profile",
          label: (
            <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors py-2">
              <User className="w-5 h-5 mr-3 text-blue-500" />
              <span className="font-semibold">Profile</span>
            </Link>
          ),
          className: "!px-4 !py-3 hover:!bg-blue-50 !transition-all !duration-200",
        },
        {
          type: 'divider',
          className: '!bg-gray-200 !my-1',
        },
        {
          key: "logout",
          label: (
            <span onClick={handleLogout} className="flex items-center text-gray-700 hover:text-red-600 transition-colors py-2">
              <LogOut className="w-5 h-5 mr-3 text-red-500" />
              <span className="font-semibold">Log Out</span>
            </span>
          ),
          className: "!px-4 !py-3 hover:!bg-red-50 !transition-all !duration-200",
        },
      ]}
    />
  );

  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img 
                src={fasmLogo} 
                alt="FASM Logo" 
                className="h-16 w-auto object-contain"
              />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-zinc-300 hover:text-white flex items-center transition-colors">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
              <Link to="/studentdashboard" className="text-zinc-300 hover:text-white flex items-center transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-1" /> MiniDashBoard
              </Link>
              <Link to="/my-assignments" className="text-zinc-300 hover:text-white flex items-center transition-colors">
                <ClipboardList className="w-4 h-4 mr-1" /> My Assignments
              </Link>
              <Link to="/regrade-request" className="text-zinc-300 hover:text-white flex items-center transition-colors">
                <History className="w-4 h-4 mr-1" /> View Request History
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            
            {user && <NotificationPopover user={user} />}

            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-16 py-2 border border-white/20 rounded-lg bg-white/5 text-zinc-100 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-zinc-400"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
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
                  <span className="font-medium text-zinc-200 hover:text-white transition-colors">
                    {user.username}
                  </span>
                </Button>
              </Dropdown>
            ) : (
              <Link to="/login" className="px-6 py-2 border border-white/20 rounded-lg font-medium text-zinc-200 hover:bg-white/10 transition-colors">
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