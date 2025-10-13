import api from "../config/axios";
const getEnrolledCoursesByStudentId = (studentId) => {
  return api.get(`/CourseStudent/student/${studentId}`);
};

export const getStudentCourseRegistrations = async (studentId) => {
  try {
    const response = await api.get(`/CourseStudent/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách đăng ký lớp học của sinh viên ID ${studentId}:`,
      error
    );
    throw error;
  }
};
export const getStudentsInCourse = async (courseInstanceId) => {
  try {
    const response = await api.get(
      `/CourseStudent/course-instance/${courseInstanceId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Get Course Students Failed:", error);
    throw error;
  }
};

export const removeStudentFromCourse = async (
  userId,
  courseInstanceId,
  courseStudentId
) => {
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
    console.error(
      "Remove Student Failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addStudentToCourse = async (courseInstanceId, studentCode, changedByUserId) => {
  try {
    const response = await api.post('/CourseStudent', {
      courseInstanceId: courseInstanceId,
      studentCode: studentCode,
      changedByUserId: changedByUserId
    });
    return response.data;
  } catch (error) {
    console.error('Add Student Failed:', error.response?.data || error.message);
    throw error;
  }
};

const enrollInCourse = async ({ courseInstanceId, studentUserId, enrollKey }) => {
  try {
    const url = `/CourseStudent/${courseInstanceId}/enroll`;
    const params = {
      studentUserId,
      enrollKey,
    };
    // Dữ liệu POST có thể là null, các tham số được truyền qua query params
    const response = await api.post(url, null, { params });
    return response.data;
  } catch (error) {
    // Không ném lỗi ra ngoài ngay mà trả về để useMutation có thể xử lý
    console.error("Lỗi khi ghi danh vào lớp học:", error.response);
    throw error.response?.data || new Error("An unknown error occurred");
  }
};


export const courseService = {
  getEnrolledCoursesByStudentId,
  getStudentCourseRegistrations,
  enrollInCourse,
  addStudentToCourse
};
