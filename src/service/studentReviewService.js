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
const updateSubmission = async (submissionId, updateData) => {
  const formData = new FormData();

  formData.append("SubmissionId", submissionId);

  if (updateData.file) {
    formData.append("File", updateData.file);
  }
  if (updateData.keywords) {
    formData.append("Keywords", updateData.keywords);
  }


  try {
    const response = await api.put("/Submission", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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