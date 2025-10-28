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

export const createCriterion = async (criterionData) => {
    try {
        const response = await api.post('/Criteria', {
            rubricId: criterionData.rubricId,
            title: criterionData.title,
            description: criterionData.description,
            weight: criterionData.weight,
            maxScore: criterionData.maxScore,
            scoringType: criterionData.scoringType,
            scoreLabel: criterionData.scoreLabel
        });
        return response.data;
    } catch (error) {
        console.error('Error creating criterion:', error);
        throw error;
    }
};

export const updateCriterion = async (criteriaId, criterionData) => {
    try {
        const response = await api.put(`/Criteria`, {
            criteriaId: criteriaId,
            rubricId: criterionData.rubricId,
            title: criterionData.title,
            description: criterionData.description,
            weight: criterionData.weight,
            maxScore: criterionData.maxScore,
            scoringType: criterionData.scoringType,
            scoreLabel: criterionData.scoreLabel
        });
        return response.data;
    } catch (error) {
        console.error('Error updating criterion:', error);
        throw error;
    }
};

export const getCriteriaByTemplateId = async (templateId) => {
    try {
        const response = await api.get(`/CriteriaTemplate/template/${templateId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching criteria templates for template ${templateId}:`, error);
        throw error;
    }
};

export const deleteCriteriaTemplate = async (criteriaTemplateId) => {
    try {
        const response = await api.delete(`/CriteriaTemplate/${criteriaTemplateId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting criteria template ${criteriaTemplateId}:`, error);
        throw error;
    }
};

export const createCriteriaTemplate = async (criteriaData) => {
    try {
        const response = await api.post('/CriteriaTemplate', {
            templateId: criteriaData.templateId,
            title: criteriaData.title,
            description: criteriaData.description,
            weight: criteriaData.weight,
            maxScore: criteriaData.maxScore,
            scoringType: criteriaData.scoringType,
            scoreLabel: criteriaData.scoreLabel
        });
        return response.data;
    } catch (error) {
        console.error('Error creating criteria template:', error);
        throw error;
    }
};

export const updateCriteriaTemplate = async (criteriaTemplateId, criteriaData) => {
    try {
        const response = await api.put(`/CriteriaTemplate`, {
            criteriaTemplateId: criteriaTemplateId, 
            templateId: criteriaData.templateId, 
            title: criteriaData.title,
            description: criteriaData.description,
            weight: criteriaData.weight,
            maxScore: criteriaData.maxScore
        });
        return response.data;
    } catch (error) {
        console.error('Error updating criteria template:', error);
        throw error;
    }
};

export const criteriaService = {
    getCriteriaByRubricId,
    deleteCriterion,
    createCriterion,
    updateCriterion,
    getCriteriaByTemplateId,
    deleteCriteriaTemplate,
    createCriteriaTemplate,
    updateCriteriaTemplate
};