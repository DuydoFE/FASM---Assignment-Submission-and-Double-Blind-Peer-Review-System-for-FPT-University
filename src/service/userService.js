import api from "../config/axios";

export const login = async (data) => {
  try {
    const response = await api.post("/account/login", data);
    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
export const getUserById = (userId) => {
  return api.get(`/Users/${userId}`);
};

export const logout = async () => {
  try {
    const response = await api.post("/account/logout");
    return response.data;
  } catch (error) {
    // If we get 401, it means token is already invalid, which is fine for logout
    // We should still consider this a successful logout
    if (error.response?.status === 401) {
      console.log("Token already invalid, proceeding with logout");
      return { success: true };
    }
    console.error("Logout error:", error);
    throw error;
  }
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  try {

    const response = await api.put(`/Users/${userId}/avatar`, avatarUrl, {
      headers: {
        'Content-Type': 'application/json-patch+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Update avatar error:", error);
    throw error;
  }
};
