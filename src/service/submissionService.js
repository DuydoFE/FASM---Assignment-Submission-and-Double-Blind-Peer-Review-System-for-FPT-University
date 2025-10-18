
import api from "../config/axios"; 

/**
 * Gửi bài tập lên server.
 * @param {object} submissionData - Dữ liệu bài nộp.
 * @param {number} submissionData.assignmentId - ID của bài tập.
 * @param {number} submissionData.userId - ID của người dùng.
 * @param {File} submissionData.file - Tệp bài nộp.
 * @param {string} [submissionData.keywords] - (Tùy chọn) Các từ khóa.
 * @param {boolean} [submissionData.isPublic] - (Tùy chọn) Trạng thái công khai.
 * @returns {Promise<object>} 
 */
const submitAssignment = async (submissionData) => {
  const formData = new FormData();

  formData.append("AssignmentId", submissionData.assignmentId);
  formData.append("UserId", submissionData.userId);
  formData.append("File", submissionData.file);

  if (submissionData.keywords) {
    formData.append("Keywords", submissionData.keywords);
  }
  
  formData.append("IsPublic", submissionData.isPublic ?? true);
  try {
    const response = await api.post(
      "/submission/submit", 
      formData,
      {
        headers: {
       
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi mạng hoặc server không phản hồi");
  }
};

export const submissionService = {
  submitAssignment,
};