import api from "../config/axios";

const getPeerReviewAssignment = async (assignmentId) => {
  try {
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/random-review`);
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
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/tracking`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin tracking review cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

const getAssignmentsWithTracking = async (courseInstanceId) => {
  try {
    const response = await api.get(`/StudentReview/course-instance/${courseInstanceId}/assignments-with-tracking`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách bài tập kèm tracking cho lớp ID ${courseInstanceId}:`, error);
    throw error;
  }
};

const generateAiReview = async (submissionId) => {
  try {
    const response = await api.post(
      `/StudentReview/submission/${submissionId}/ai-criteria-feedback`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data) {
      console.warn("AI Review Warning:", error.response.data.message);
      return error.response.data; 
    }
    
    console.error(
      `Lỗi khi tạo AI review cho submission ID ${submissionId}:`,
      error
    );
    throw error;
  }
};
const getMyScoreDetails = async (assignmentId) => {
  try {
    const response = await api.get(
      `/StudentReview/assignment/${assignmentId}/my-score-details`
    );
    return response.data; 
  } catch (error) {
    console.error(
      `Lỗi khi lấy chi tiết điểm cho assignment ID ${assignmentId}:`,
      error
    );
    throw error;
  }
};
const submitRegradeRequest = async (payload) => {
  try {
   
    const response = await api.post(`/RegradeRequests`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error submitting regrade request:`, error);
    throw error;
  }
};
const getRegradeRequestDetails = async (requestId) => {
  try {
    const response = await api.get(`/RegradeRequests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết yêu cầu phúc khảo ID ${requestId}:`, error);
    throw error;
  }
};
const getRandomCrossClassReview = async (assignmentId) => {
  try {
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/random-cross-class-review`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy bài chấm chéo khác lớp cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

export const reviewService = {
  getPeerReviewAssignment,
  getRandomCrossClassReview,
  submitPeerReview,
  getStudentReviewTracking,
  getAssignmentsWithTracking,
  generateAiReview, 
  getMyScoreDetails,
  submitRegradeRequest,
  getRegradeRequestDetails
};
