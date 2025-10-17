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

export const rubricService = {
  getRubricByAssignmentId,
  getAllRubrics,
  updateRubric,
  createRubric,
  deleteRubric,
};