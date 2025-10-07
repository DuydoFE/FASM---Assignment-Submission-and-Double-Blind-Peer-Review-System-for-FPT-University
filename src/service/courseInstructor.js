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

export const getStudentsInCourse = async (courseInstanceId) => {
  try {
    const response = await api.get(`/CourseStudent/course-instance/${courseInstanceId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Course Students Failed:", error);
    throw error;
  }
};

export const getAssignments = async (courseInstanceId) => {
  try {
    const response = await api.get(`/Assignment/course-instance/${courseInstanceId}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Assignments Failed:", error);
    throw error;
  }
};
