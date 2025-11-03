import api from "../config/axios";

export const getSubmissionSummary = async ({ courseId, classId, assignmentId }) => {
  try {
    const queryParams = new URLSearchParams();

    if (courseId) queryParams.append("courseId", courseId);
    if (classId) queryParams.append("classId", classId);
    if (assignmentId) queryParams.append("assignmentId", assignmentId);

    const response = await api.get(`/instructor/InstructorSubmission/summary?${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Get Submission Summary Failed:", error);
    throw error;
  }
};

export const instructorService = {
  getSubmissionSummary
};