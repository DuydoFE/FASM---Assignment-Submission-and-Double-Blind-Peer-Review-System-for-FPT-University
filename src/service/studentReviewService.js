import api from "../config/axios";


const getSubmissionByUserAndAssignment = async ({ assignmentId, userId }) => {
  try {
    const response = await api.get(
      `/StudentReview/assignment/${assignmentId}/user/${userId}`
    );
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
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
    return response.data; 
  } catch (error) {
    throw error;
  }
};
const updatePeerReview = async (reviewId, payload) => {
  try {
    const response = await api.put(`/StudentReview/review/${reviewId}`, payload);
    return response.data;
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
  updatePeerReview,
};