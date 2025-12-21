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

export const getAllRubrics = async () => {
  try {
    const response = await api.get('/Rubric');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all rubrics:', error);
    throw error;
  }
};

export const getPublicRubricTemplates = async () => {
  try {
    const response = await api.get('/RubricTemplate/public');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching public rubric templates:', error);
    throw error;
  }
};

export const updateRubric = async (rubricId, updateData) => {
  try {
    const response = await api.put(`/Rubric`, {
      rubricId: rubricId,
      title: updateData.title
    });
    return response.data;
  } catch (error) {
    console.error('Error updating rubric:', error);
    throw error;
  }
};

export const createRubric = async (rubricData) => {
  try {
    const response = await api.post('/Rubric', {
      title: rubricData.title
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating rubric:', error);
    throw error;
  }
};


export const deleteRubric = async (rubricId) => {
  try {
    const response = await api.delete(`/Rubric/${rubricId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rubric:', error);
    throw error;
  }
};

export const getRubricsTemplate = async () => {
  try {
    const response = await api.get('/RubricTemplate');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all rubrics:', error);
    throw error;
  }
};

export const getRubricTemplatesByUserId = async (userId, courseInstanceId) => {
  try {
    const response = await api.get(`/RubricTemplate/user/${userId}`, {
      params: { courseInstanceId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching rubric templates by user:', error);
    throw error;
  }
};

export const createRubricTemplate = async (templateData) => {
  try {
    const response = await api.post('/RubricTemplate', {
      title: templateData.title,
      createdByUserId: templateData.createdByUserId
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating rubric template:', error);
    throw error;
  }
};

export const deleteRubricTemplate = async (templateId) => {
  try {
    const response = await api.delete(`/RubricTemplate/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rubric template:', error);
    throw error;
  }
};

export const updateRubricTemplate = async (templateId, updateData) => {
  try {
    const response = await api.put(`/RubricTemplate`, {
      templateId: templateId,
      title: updateData.title
    });
    return response.data;
  } catch (error) {
    console.error('Error updating rubric template:', error);
    throw error;
  }
};

export const getRubricByUserId = async (userId, courseInstanceId) => {
  try {
    const response = await api.get(`/Rubric/user/${userId}`, {
      params: { courseInstanceId }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching rubrics by user:', error);
    throw error;
  }
};

export const getRubricById = async (id) => {
  try {
    const response = await api.get(`/Rubric/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching rubric with id ${id}:`, error);
    throw error;
  }
};

export const rubricService = {
  getRubricByAssignmentId,
  getAllRubrics,
  getPublicRubricTemplates,
  updateRubric,
  createRubric,
  deleteRubric,
  getRubricsTemplate,
  getRubricTemplatesByUserId,
  createRubricTemplate,
  deleteRubricTemplate,
  updateRubricTemplate,
  getRubricByUserId,
  getRubricById,
};