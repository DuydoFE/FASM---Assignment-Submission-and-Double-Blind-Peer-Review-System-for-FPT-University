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

export const getClassesByUser = async (userId, courseId) => {
  if (!userId || !courseId) {
    throw new Error("userId and courseId are required");
  }

  try {
    const response = await api.get(
      `/CourseInstance/classes-by-user/${userId}?courseId=${courseId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Get Classes By User Failed:", error);
    throw error;
  }
};

export const getCourseInstanceById = async (courseInstanceId) => {
  try {
    const response = await api.get(`/CourseInstance/${courseInstanceId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Course Instance Failed:", error);
    throw error;
  }
};

