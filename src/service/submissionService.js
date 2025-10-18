import api from "../config/axios";

const submitAssignment = async (submissionData) => {
  const formData = new FormData();

  formData.append("AssignmentId", submissionData.assignmentId);
  formData.append("UserId", submissionData.userId);
  formData.append("File", submissionData.file);
  formData.append("IsPublic", submissionData.isPublic ?? true);

  // SỬA Ở ĐÂY: Luôn gửi trường Keywords, kể cả khi giá trị là chuỗi rỗng
  // Thay vì `if (submissionData.keywords)`, hãy dùng cách này:
  formData.append("Keywords", submissionData.keywords || "");

  try {
    const response = await api.post(
      "/submission/submit",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
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