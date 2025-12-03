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

const getCompletedReviews = async (studentId) => {
  try {
    const response = await api.get(
      `/StudentReview/completed-reviews/${studentId}`
    );
 
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getReviewAssignmentDetails = async (reviewAssignmentId) => {
  try {
    const response = await api.get(
      `/StudentReview/review-assignment/${reviewAssignmentId}/details`
    );
    return response.data; 
  } catch (error) {
    throw error;
  }
};

const submitPeerReview = async (payload) => {
    const response = await api.post(`/StudentReview/submit-review`, payload); 
    return response.data;
};

const getReviewDetails = async (reviewAssignmentId) => {
  try {
    const response = await api.get(
      `/StudentReview/review-assignment/${reviewAssignmentId}/review-details`
    );
    return response.data; // Trả về cục data JSON bạn cung cấp
  } catch (error) {
    throw error;
  }
};
export const studentReviewService = {
  getSubmissionByUserAndAssignment,
  getCompletedReviews,
  getReviewAssignmentDetails,
  submitPeerReview,
  getReviewDetails,
};