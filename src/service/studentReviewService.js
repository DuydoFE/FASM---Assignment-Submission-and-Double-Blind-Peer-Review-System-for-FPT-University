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

export const studentReviewService = {
  getSubmissionByUserAndAssignment,
};