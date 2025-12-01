import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Popover, Badge, List, Spin, Empty, Button, ConfigProvider } from "antd";
import { toast } from "react-toastify";
import { getMyNotifications, markNotificationAsRead } from "../../service/notificationService";

const getTypeStyles = (type) => {
  switch (type) {
    case "DeadlineReminder":
      return "bg-red-500/10 text-red-400 border-red-500/20"; 
    case "GradesPublished":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20"; 
    case "AssignmentActive":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"; 
    case "RegradeStatusUpdate":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"; 
    case "AssignmentNew":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"; 
    case "MissingSubmission":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20"; 
    case "MissingReview":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20"; 
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"; 
  }
};

const formatType = (type) => {
  if (!type) return "";
  return type.replace(/([A-Z])/g, ' $1').trim();
};

const NotificationPopover = ({ user }) => {
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
      const unread = allNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const handleNotificationClick = useCallback(async (item) => {
    if (item.isRead) return;

    try {
      await markNotificationAsRead(item.notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((n) =>
          n.notificationId === item.notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      toast.error("Unable to mark notification as read.");
    }
  }, []);

  const handlePopoverVisibleChange = (visible) => {
    setPopoverVisible(visible);
    if (visible) {
      fetchNotifications();
    }
  };

  const notificationContent = (
    <div style={{ width: 400, maxHeight: 450, overflowY: "auto" }}>
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin />
        </div>
      ) : notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <div
              onClick={() => handleNotificationClick(item)}
              className={`p-3 border-b border-white/5 cursor-pointer transition-colors group
                ${!item.isRead ? "bg-white/10 hover:bg-white/15" : "bg-transparent hover:bg-white/5"}`}
            >
              {/* Header: Title + Type Badge */}
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className={`font-semibold text-sm ${!item.isRead ? "text-white" : "text-zinc-400"}`}>
                  {item.title}
                </span>
                
                {/* Hiển thị Type ở đây */}
                <span className={`
                  text-[10px] uppercase font-bold px-2 py-0.5 rounded border
                  whitespace-nowrap tracking-wide
                  ${getTypeStyles(item.type)}
                `}>
                  {formatType(item.type)}
                </span>
              </div>

              {/* Message */}
              <p className={`text-xs line-clamp-2 ${!item.isRead ? "text-zinc-300" : "text-zinc-500"}`}>
                {item.message}
              </p>
              
              {/* Optional: Time (nếu API có trả về createdDate) */}
              {/* <div className="text-[10px] text-zinc-500 mt-2 text-right">
                {new Date(item.createdDate).toLocaleString()}
              </div> */}
            </div>
          )}
        />
      ) : (
        <Empty description={<span className="text-zinc-400">No notification Yet</span>} />
      )}
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Popover: {
            colorBgElevated: "transparent",
            colorTextHeading: "white",
            padding: 0,
          },
          Empty: {
            colorText: "#a1a1aa",
          },
          Spin: {
            colorPrimary: "#22d3ee",
          },
        },
      }}
    >
      <Popover
        content={notificationContent}
        title={
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="text-white font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-cyan-400 font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
        }
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={handlePopoverVisibleChange}
        placement="bottomRight"
        overlayClassName="!mt-2 !bg-[#18181b] !backdrop-blur-xl !border !border-white/10 !rounded-xl !shadow-2xl"
        arrow={false}
      >
        <Badge count={unreadCount} offset={[-2, 2]} size="small" color="#06b6d4">
          <Button
            shape="circle"
            icon={<Bell className="text-zinc-300 hover:text-white transition-colors" size={20} />}
            type="text"
            className="flex items-center justify-center hover:bg-white/10"
          />
        </Badge>
      </Popover>
    </ConfigProvider>
  );
};

export default NotificationPopover;