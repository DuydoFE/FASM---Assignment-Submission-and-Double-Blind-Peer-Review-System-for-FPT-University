import api from "../config/axios";

// ✅ Lấy toàn bộ user
export const getAllUsers = async () => {
  const res = await api.get("/Users");
  return res.data;
};

// ✅ Lấy user theo campus
export const getUsersByCampus = async (campusId) => {
  const res = await api.get(`/Users/campus/${campusId}`);
  return res.data;
};

// ✅ Cập nhật thông tin user
export const updateUser = async (id, data) => {
  const res = await api.put(`/Users/${id}`, data);
  return res.data;
};

// ✅ Vô hiệu hóa user
export const deactivateUser = async (id) => {
  const res = await api.put(`/Users/${id}/deactivate`);
  return res.data;
};

// ✅ Kích hoạt user
export const activateUser = async (id) => {
  const res = await api.put(`/Users/${id}/activate`);
  return res.data;
};

// ✅ Tạo user mới
export const createUser = async (data) => {
  const res = await api.post("/Users", data);
  return res.data;
};
