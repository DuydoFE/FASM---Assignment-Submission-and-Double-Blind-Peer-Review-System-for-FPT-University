import api from "../config/axios"; 


export const getMyNotifications = async (unreadOnly = false) => {
  try {
    const response = await api.get("/Notifications/my-notifications", {
      params: {
        unreadOnly,
      },
    });
 
    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    throw error;
  }
};
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/Notifications/${notificationId}/mark-as-read`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi đánh dấu đã đọc cho thông báo ID ${notificationId}:`, error);
    throw error;
  }
};