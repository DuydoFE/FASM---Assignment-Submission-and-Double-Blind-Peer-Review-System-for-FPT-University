import api from "../config/axios";

const getPeerReviewAssignment = async (assignmentId) => {
  try {
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/random-pending`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bài chấm chéo cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

const submitPeerReview = async (reviewPayload) => {
  try {
    const response = await api.post(`/StudentReview/submit-review`, reviewPayload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi điểm review:", error);
    throw error;
  }
};

const getStudentReviewTracking = async (assignmentId) => {
  try {
    // API endpoint như bạn cung cấp, đã bỏ "/api"
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/tracking`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin tracking review cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

export const reviewService = {
  getPeerReviewAssignment,
  submitPeerReview,
  getStudentReviewTracking,
};
