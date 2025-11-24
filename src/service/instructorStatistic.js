import api from "../config/axios";

export const getAssignmentsOverview = async (userId, courseInstanceId) => {
  try {
    const response = await api.get("/Statistics/assignments/overview", {
      params: { userId, courseInstanceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching assignments overview:", error);
    throw error;
  }
};

export const getSubmissionStatistics = async (userId, courseInstanceId) => {
  try {
    const response = await api.get("/Statistics/assignments/submissions", {
      params: { userId, courseInstanceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching submission statistics:", error);
    throw error;
  }
};

export const getAssignmentsDistribution = async (userId, courseInstanceId) => {
  try {
    const response = await api.get("/Statistics/assignments/distribution", {
      params: { userId, courseInstanceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching assignments distribution:", error);
    throw error;
  }
};