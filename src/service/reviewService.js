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
    const response = await api.post(
      `/StudentReview/submission/${submissionId}/generate-review`
    );
    
    return response.data; 
  } catch (error) {
    console.error(
      `Lỗi khi tạo AI review cho submission ID ${submissionId}:`,
      error
    );
    throw error;
  }
};

export const reviewService = {
  getPeerReviewAssignment,
  submitPeerReview,
  getStudentReviewTracking,
  getAssignmentsWithTracking,
  generateAiReview, 
};
