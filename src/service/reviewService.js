import api from "../config/axios";


const getPeerReviewAssignment = async (assignmentId) => {
  try {
    
    const response = await api.get(`/StudentReview/review-assignment/${assignmentId}/details`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bài chấm chéo cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

export const reviewService = {
  getPeerReviewAssignment,
};