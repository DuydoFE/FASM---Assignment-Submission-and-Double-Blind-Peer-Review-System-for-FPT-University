import api from "../config/axios";
const getEnrolledCoursesByStudentId = (studentId) => {
return api.get(`/CourseStudent/student/${studentId}`);
};

export const getStudentCourseRegistrations = async (studentId) => {
  try {
    const response = await api.get(`/CourseStudent/student/${studentId}`);
    return response.data;
  } catch (error)
  {
    console.error(`Lỗi khi lấy danh sách đăng ký lớp học của sinh viên ID ${studentId}:`, error);
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

export const removeStudentFromCourse = async (userId, courseInstanceId, courseStudentId) => {
  try {
    const response = await api.delete("/CourseStudent/delete", {
      params: {
        userId,
        courseInstanceId,
        courseStudentId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Remove Student Failed:", error.response?.data || error.message);
    throw error;
  }
};
export const courseService = {
getEnrolledCoursesByStudentId,
getStudentCourseRegistrations
};
