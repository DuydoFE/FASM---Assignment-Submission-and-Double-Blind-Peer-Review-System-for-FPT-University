import api from "../config/axios";

/**
 * Lấy danh sách tất cả assignment của một lớp học (course instance).
 * @param {number | string} courseInstanceId - ID của lớp học.
 * @returns {Promise<Array<Object>>} - Một promise trả về mảng các assignment.
 */
export const getAssignmentsByCourseInstanceId = async (courseInstanceId) => {
  try {
    const response = await api.get(`/Assignment/course-instance/${courseInstanceId}`);
    return response.data.data; // Trả về mảng assignments
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách assignment cho lớp ID ${courseInstanceId}:`, error);
    throw error;
  }
};
const getAssignmentDetailsById = async (assignmentId) => {
  try {
    const response = await api.get(`/Assignment/${assignmentId}/details`);
    return response.data.data; // Trả về object chi tiết
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết assignment ID ${assignmentId}:`, error);
    throw error;
  }
};
const getStudentAssignments = async (studentId) => {
  try {
    const response = await api.get(`/Assignment/student/${studentId}`);
    return response.data; // Trả về toàn bộ object { message, statusCode, data }
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách assignment cho sinh viên ID ${studentId}:`, error);
    throw error;
  }
};

const getAssignmentRubric = async (assignmentId) => {
  try {
    const response = await api.get(`/StudentReview/assignment/${assignmentId}/rubric`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi lấy rubric cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

const extendDeadline = async (assignmentId, newDeadline) => {
  try {
    const response = await api.put(
      `/Assignment/${assignmentId}/extend-deadline`,
      `"${newDeadline}"`,
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi gia hạn deadline cho assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

export const createAssignment = async (assignmentData, file = null) => {
  try {
    const formData = new FormData();
    
    formData.append('CourseInstanceId', assignmentData.courseInstanceId);
    formData.append('RubricTemplateId', assignmentData.rubricTemplateId);
    formData.append('Title', assignmentData.title);
    
    if (assignmentData.description) {
      formData.append('Description', assignmentData.description);
    }
    if (assignmentData.guidelines) {
      formData.append('Guidelines', assignmentData.guidelines);
    }
    if (assignmentData.startDate) {
      formData.append('StartDate', assignmentData.startDate);
    }
    
    formData.append('Deadline', assignmentData.deadline);
    formData.append('ReviewDeadline', assignmentData.reviewDeadline);
    formData.append('FinalDeadline', assignmentData.finalDeadline);
    
    formData.append('NumPeerReviewsRequired', assignmentData.numPeerReviewsRequired);
    formData.append('MissingReviewPenalty', assignmentData.missingReviewPenalty);
    formData.append('InstructorWeight', assignmentData.instructorWeight);
    formData.append('PeerWeight', assignmentData.peerWeight);
    formData.append('PassThreshold', assignmentData.passThreshold);
    
    formData.append('AllowCrossClass', assignmentData.allowCrossClass);
    
    formData.append('CrossClassTag', assignmentData.crossClassTag);
    
    formData.append('GradingScale', assignmentData.gradingScale);
    
    if (file) {
      formData.append('File', file);
    }

    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await api.post('/Assignment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error response:', error.response?.data);
    throw error;
  }
};


export const deleteAssignment = async (assignmentId) => {
  try {
    const response = await api.delete(`/Assignment/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa assignment ID ${assignmentId}:`, error);
    throw error;
  }
};

export const updateAssignment = async (assignmentData, file = null) => {
  try {
    const formData = new FormData();
    
    formData.append('AssignmentId', assignmentData.assignmentId);
    formData.append('RubricTemplateId', assignmentData.rubricTemplateId);
    formData.append('Title', assignmentData.title);
    
    if (assignmentData.description) {
      formData.append('Description', assignmentData.description);
    }
    if (assignmentData.guidelines) {
      formData.append('Guidelines', assignmentData.guidelines);
    }
    if (assignmentData.startDate) {
      formData.append('StartDate', assignmentData.startDate);
    }
    
    formData.append('Deadline', assignmentData.deadline);
    formData.append('ReviewDeadline', assignmentData.reviewDeadline);
    formData.append('FinalDeadline', assignmentData.finalDeadline);
    
    formData.append('NumPeerReviewsRequired', assignmentData.numPeerReviewsRequired);
    formData.append('MissingReviewPenalty', assignmentData.missingReviewPenalty);
    formData.append('InstructorWeight', assignmentData.instructorWeight);
    formData.append('PeerWeight', assignmentData.peerWeight);
    formData.append('PassThreshold', assignmentData.passThreshold);
    
    formData.append('AllowCrossClass', assignmentData.allowCrossClass);
    formData.append('CrossClassTag', assignmentData.crossClassTag || '');
    formData.append('GradingScale', assignmentData.gradingScale);
    
    if (file) {
      formData.append('File', file);
    }

    console.log('Update FormData contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await api.put('/Assignment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật assignment:', error);
    throw error;
  }
};

const publishAssignment = async (assignmentId) => {
  try {
    const response = await api.put(`/Assignment/${assignmentId}/publish`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi publish assignment ID ${assignmentId}:`, error);
    throw error;
  }
};



export const assignmentService = {
  getAssignmentsByCourseInstanceId,
  getAssignmentDetailsById,
  getAssignmentRubric,
  getStudentAssignments,
  extendDeadline,
  createAssignment,
  deleteAssignment,
  updateAssignment,
  publishAssignment
};