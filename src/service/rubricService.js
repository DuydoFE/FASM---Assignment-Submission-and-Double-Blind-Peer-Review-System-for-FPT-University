// src/service/rubricService.js
import api from "../config/axios";

const getRubricByAssignmentId = async (assignmentId) => {
  try {
    const response = await api.get(`/Rubric/assignment/${assignmentId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy rubric cho assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const rubricService = {
  getRubricByAssignmentId,
};
