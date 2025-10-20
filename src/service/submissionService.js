// src/service/submissionService.js

import api from "../config/axios";

const submitAssignment = async (submissionData) => {
  const formData = new FormData();
  formData.append("AssignmentId", submissionData.assignmentId);
  formData.append("UserId", submissionData.userId);
  formData.append("File", submissionData.file);
  formData.append("Keywords", submissionData.keywords || "");
  formData.append("IsPublic", true);

  try {
    const response = await api.post("/submission/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi mạng hoặc server không phản hồi");
  }
};

// Hàm để CẬP NHẬT bài nộp (PUT)
const updateSubmission = async (submissionId, updateData) => {
  const formData = new FormData();
  formData.append("SubmissionId", submissionId);
  
  if (updateData.file) {
    formData.append("File", updateData.file);
  }
  
  formData.append("Keywords", updateData.keywords || "");

  // FIX: Thêm trường Status theo yêu cầu của API
  // Chúng ta có thể mặc định là "Submitted" khi sinh viên nộp lại bài
  formData.append("Status", "Submitted"); 

  try {
    const response = await api.put("/Submission", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bài nộp:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi mạng hoặc server không phản hồi");
  }
};


export const submissionService = {
  submitAssignment,
  updateSubmission,
};