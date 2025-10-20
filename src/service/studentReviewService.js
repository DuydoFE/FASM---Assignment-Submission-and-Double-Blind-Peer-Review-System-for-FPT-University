import api from "../config/axios";


const getSubmissionByUserAndAssignment = async ({ assignmentId, userId }) => {
  try {
    const response = await api.get(
      `/StudentReview/assignment/${assignmentId}/user/${userId}`
    );
    // API trả về thành công (200), nghĩa là có bài nộp. Trả về phần data.
    return response.data.data;
  } catch (error) {
    // API trả về lỗi, kiểm tra xem có phải lỗi 404 (Không tìm thấy) không.
    if (error.response && error.response.status === 404) {
      // Đây là trường hợp mong đợi khi user chưa nộp bài.
      return null;
    }
    // Ném các lỗi khác (500, lỗi mạng,...) để useQuery xử lý.
    throw error;
  }
};

export const studentReviewService = {
  getSubmissionByUserAndAssignment,
};