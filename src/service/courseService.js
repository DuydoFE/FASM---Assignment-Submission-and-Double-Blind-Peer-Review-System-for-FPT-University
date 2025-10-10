import api from "../config/axios";
// Hàm gọi API để lấy danh sách các lớp học mà sinh viên đã tham gia
const getEnrolledCoursesByStudentId = (studentId) => {
// Sử dụng template literal để chèn studentId vào URL
return api.get(`/CourseStudent/student/${studentId}`);
};
// Export tất cả các hàm service
export const courseService = {
getEnrolledCoursesByStudentId,
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
