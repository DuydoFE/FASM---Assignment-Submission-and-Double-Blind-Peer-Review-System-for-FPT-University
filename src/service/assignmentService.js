import api from "../config/axios";

/**
 * Lấy danh sách tất cả assignment của một lớp học (course instance).
 * @param {number | string} courseInstanceId - ID của lớp học.
 * @returns {Promise<Array<Object>>} - Một promise trả về mảng các assignment.
 */
export const getAssignmentsByCourseInstanceId = async (courseInstanceId) => {
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
const getStudentAssignments = async (studentId) => {
  try {
    // 👉 SỬA Ở ĐÂY: Đã xóa "/api" ở đầu.
    const response = await api.get(`/Assignment/student/${studentId}`);
    return response.data; // Trả về toàn bộ object { message, statusCode, data }
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách assignment cho sinh viên ID ${studentId}:`, error);
    throw error;
  }
};

const getAssignmentRubric = async (assignmentId) => {
  try {
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/rubric`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy rubric cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

const extendDeadline = async (assignmentId, newDeadline) => {
  try {
    const response = await api.put(
      `/Assignment/${assignmentId}/extend-deadline`,
      `"${newDeadline}"`,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi gia hạn deadline cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};


// Export service
export const assignmentService = {
  getAssignmentDetailsById,
  getAssignmentRubric,
  getStudentAssignments,
  extendDeadline
};