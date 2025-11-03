import api from "../config/axios";

export const getInstructorCourses = async (instructorId) => {
  try {
    const response = await api.get(`/CourseInstructor/instructor/${instructorId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Instructor Courses Failed:", error);
    throw error;
  }
};

export const getCoursesByUser = async (userId) => {
  try {
    const response = await api.get(`/Course/by-user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Courses By User Failed:", error);
    throw error;
  }
};



