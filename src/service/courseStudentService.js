import api from "../config/axios";

export const getStudentsInCourse = async (courseInstanceId) => {
  try {
    const response = await api.get(`/CourseStudent/course-instance/${courseInstanceId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Course Students Failed:", error);
    throw error;
  }
};

export const removeStudentFromCourse = async (userId, courseInstanceId, courseStudentId) => {
  try {
    const response = await api.delete(`/CourseStudent/delete?userId=${userId}&courseInstanceId=${courseInstanceId}&courseStudentId=${courseStudentId}`);
    return response.data;
  } catch (error) {
    console.error("Remove Student Failed:", error.response?.data || error.message);
    throw error;
  }
};