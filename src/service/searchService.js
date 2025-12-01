import api from "../config/axios";

export const searchStudent = async (query) => {
  try {
    const response = await api.get("/Search/search/student", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    throw error;
  }
};

export const searchInstructor = async (query) => {
  try {
    const response = await api.get("/Search/search/instructor", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm instructor:", error);
    throw error;
  }
};