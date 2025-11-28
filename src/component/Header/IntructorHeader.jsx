import { Link, useNavigate } from "react-router-dom";
import { Bell, Book, Calendar, LogOut, User } from 'lucide-react';
import { getCurrentAccount } from "../../utils/accountUtils";
import { useDispatch } from "react-redux";
import { Dropdown, Menu, Avatar, Button, Popover, Badge, List, Spin, Empty, ConfigProvider } from "antd";
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback } from "react";
import { getMyNotifications, markNotificationAsRead } from "../../service/notificationService";

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

   const handleNotificationClick = useCallback(async (item) => {
    try {
      // Only call the API if the notification is not already read
      if (!item.isRead) {
        await markNotificationAsRead(item.notificationId);

        setNotifications(currentNotifications =>
          currentNotifications.map(n =>
            n.notificationId === item.notificationId ? { ...n, isRead: true } : n
          )
        );

        setUnreadCount(prevCount => prevCount - 1);
      }

      // You can add navigation logic here based on the notification type
      console.log("Processing notification:", item);
      
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
              className={`p-2 rounded-md transition-colors cursor-pointer ${!item.isRead ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-50'}`}
            >
              <List.Item.Meta
                title={<span className="font-semibold text-gray-800">{item.title}</span>}
                description={<p className="text-gray-600 text-sm">{item.message}</p>}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty description={<span className="text-gray-500">No notification Yet</span>} />
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
                Dashboard
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

          <div className="flex items-center space-x-4">
            {user && (
              <ConfigProvider
                theme={{
                  components: {
                    Popover: {
                      colorBgElevated: '#ffffff', // White background for popover
                      colorText: '#374151', // Gray text color
                      colorTextHeading: '#1f2937', // Darker heading text
                      padding: 0,
                    },
                    Empty: {
                      colorText: '#9ca3af' // Gray-400
                    },
                    Spin: {
                      colorPrimary: '#f97316' // Orange color to match instructor theme
                    },
                    List: {
                      colorBgContainer: '#ffffff',
                      colorText: '#374151',
                      colorTextHeading: '#1f2937'
                    }
                  },
                }}
              >
                <Popover
                  content={notificationContent}
                  title={<div className="p-4 border-b border-gray-200 text-gray-800 font-semibold">Notification</div>}
                  trigger="click"
                  visible={popoverVisible}
                  onVisibleChange={handlePopoverVisibleChange}
                  placement="bottom"
                  overlayClassName="!mt-2 !bg-white !border !border-gray-200 !rounded-lg !shadow-lg"
                  arrow={false}
                >
                  <Badge count={unreadCount}>
                    <Button shape="circle" icon={<Bell className="text-gray-600 hover:text-orange-500" />} type="text" />
                  </Badge>
                </Popover>
              </ConfigProvider>
            )}

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
