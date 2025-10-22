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
