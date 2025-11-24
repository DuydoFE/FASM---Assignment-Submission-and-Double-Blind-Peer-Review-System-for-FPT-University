import { Link } from "react-router-dom";
import { Search, Filter, User, LogOut, Home, LayoutDashboard, ClipboardList, History, Bell } from "lucide-react";
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { Dropdown, Menu, Avatar, Button, Popover, Badge, List, Spin, Empty, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback } from "react";
import { getMyNotifications, markNotificationAsRead } from "../../service/notificationService";

const Header = () => {
  const user = getCurrentAccount();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allNotifications = await getMyNotifications(false);
      setNotifications(allNotifications);
      const unread = allNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

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

   const handleNotificationClick = useCallback(async (item) => {
    if (item.isRead) {
      console.log("Navigating for notification:", item);
      return;
    }

    try {
      await markNotificationAsRead(item.notificationId);

      setNotifications(currentNotifications =>
        currentNotifications.map(n =>
          n.notificationId === item.notificationId ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount(prevCount => prevCount - 1);

    } catch (error) {
      toast.error("Unable to mark notification as read.");
    }
  }, []);

  
 const notificationContent = (
    <div style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}>
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin />
        </div>
      ) : notifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item 
              onClick={() => handleNotificationClick(item)}
              className={`p-2 rounded-md transition-colors cursor-pointer ${!item.isRead ? 'bg-white/10 hover:bg-white/20' : 'hover:bg-white/5'}`}
            >
              <List.Item.Meta
                title={<span className="font-semibold text-zinc-100">{item.title}</span>}
                description={<p className="text-zinc-300 text-sm">{item.message}</p>}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description={<span className="text-zinc-400">No notification Yet</span>} />
      )}
    </div>
  );
  
  const handlePopoverVisibleChange = (visible) => {
    setPopoverVisible(visible);
    if (visible) {
      fetchNotifications();
    }
  };


  return (
    
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <span className="font-bold text-2xl text-white">FASM</span>
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
           
            {user && (
              
              <ConfigProvider
                theme={{
                  components: {
                    Popover: {
                      
                      colorBgElevated: 'transparent',
                      colorTextHeading: 'white',
                      padding: 0, 
                    },
                    Empty: {
                      colorText: '#a1a1aa' 
                    },
                    Spin: {
                      colorPrimary: '#22d3ee' 
                    }
                  },
                }}
              >
                 <Popover
                  content={notificationContent}
                  title={<div className="p-4 border-b border-white/10 text-white font-semibold">Notification</div>}
                  trigger="click"
                  visible={popoverVisible}
                  onVisibleChange={handlePopoverVisibleChange}
                  placement="bottom"
                  overlayClassName="!mt-2 !bg-black/50 !backdrop-blur-md !border !border-white/10 !rounded-lg !shadow-lg"
                  arrow={false}
                >
                  <Badge count={unreadCount}>
                    <Button shape="circle" icon={<Bell className="text-zinc-300 hover:text-white" />} type="text" />
                  </Badge>
                </Popover>
              </ConfigProvider>
            )}

            {/* Thanh tìm kiếm */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-16 py-2 border border-white/20 rounded-lg bg-white/5 text-zinc-100 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-zinc-400"
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
