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
