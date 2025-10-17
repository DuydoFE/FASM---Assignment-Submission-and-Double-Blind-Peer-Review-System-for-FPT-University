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

export const deleteCriterion = async (criterionId) => {
    try {
        const response = await api.delete(`/Criteria/${criterionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting criterion ${criterionId}:`, error);
        throw error;
    }
};

export const criteriaService = {
    getCriteriaByRubricId,
    deleteCriterion,
};