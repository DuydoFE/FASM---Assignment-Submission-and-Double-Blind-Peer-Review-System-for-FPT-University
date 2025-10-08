import api from "../config/axios";

export const updateEnrollKey = async (courseInstanceId, newKey, userId) => {
  try {
    const response = await api.put(`/CourseInstance/${courseInstanceId}/enroll-key`, {
      newKey,
      userId
    });
    return response.data;
  } catch (error) {
    console.error("Update Enroll Key Failed:", error);
    throw error;
  }
};
