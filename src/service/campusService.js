import api from "../config/axios";

export const getCampus = async () => {
  try {
    const response = await api.get("/Campus")
    return response.data.data;
  } catch (error) {
    console.error("Get Campus Fail:", error);
    throw error;
  }
};
