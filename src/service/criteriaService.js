import api from "../config/axios";

export const getCriteriaByRubricId = async (rubricId) => {
  try {
    const response = await api.get(`/Criteria/rubric/${rubricId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching criteria for rubric ${rubricId}:`, error);
    throw error;
  }
};

export const criteriaService = {
  getCriteriaByRubricId,
};
