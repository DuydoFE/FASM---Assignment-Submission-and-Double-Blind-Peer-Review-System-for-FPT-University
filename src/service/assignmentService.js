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

// Export service
export const assignmentService = {
  getAssignmentsByCourseInstanceId,
};