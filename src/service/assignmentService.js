import api from "../config/axios";

/**
 * Lấy danh sách tất cả assignment của một lớp học (course instance).
 * @param {number | string} courseInstanceId - ID của lớp học.
 * @returns {Promise<Array<Object>>} - Một promise trả về mảng các assignment.
 */
const getAssignmentsByCourseInstanceId = async (courseInstanceId) => {
  try {
    // SỬA Ở ĐÂY: Đã xóa "/api" ở đầu.
    const response = await api.get(`/Assignment/course-instance/${courseInstanceId}`);
    return response.data.data; // Trả về mảng assignments
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách assignment cho lớp ID ${courseInstanceId}:`, error);
    throw error;
  }
};
const getAssignmentDetailsById = async (assignmentId) => {
  try {
    const response = await api.get(`/Assignment/${assignmentId}/details`);
    return response.data.data; // Trả về object chi tiết
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

// Export service
export const assignmentService = {
  getAssignmentsByCourseInstanceId,
  getAssignmentDetailsById, // Thêm hàm mới vào export
};
export const getStudentAssignments = async (studentId) => {
  try {
    const response = await api.get(`/Assignment/student/${studentId}`);
    return response.data; // Trả về toàn bộ response data
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    throw error;
  }
};