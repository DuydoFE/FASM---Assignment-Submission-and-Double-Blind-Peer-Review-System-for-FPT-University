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
    // 👉 THAY ĐỔI ENDPOINT API TẠI ĐÂY
    const response = await api.post(
      `/StudentReview/submission/${submissionId}/ai-criteria-feedback`
    );
    
    return response.data; 
   } catch (error){ // Thiếu { ở đây
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

export const reviewService = {
  getPeerReviewAssignment,
  submitPeerReview,
  getStudentReviewTracking,
  getAssignmentsWithTracking,
  generateAiReview, 
  getMyScoreDetails,
  submitRegradeRequest,
};
