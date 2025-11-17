import api from "../config/axios";

export const getRegradeRequestsByStudentId = async (
  studentId,
  { pageNumber, pageSize }
) => {
  try {
    const response = await api.get(`/RegradeRequests/student/${studentId}`, {
      params: {
        pageNumber,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách yêu cầu chấm lại cho sinh viên ID ${studentId}:`,
      error
    );
    throw error;
  }
};

export const getRegradeRequestsForInstructor = async (userId) => {
  try {
    const response = await api.get(`/instructor/regrade-requests/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Lỗi khi lấy danh sách yêu cầu chấm lại cho giảng viên ID ${userId}:`,
      error
    );
    throw error;
  }
};

export const reviewRegradeRequest = async (data) => {
  try {
    const response = await api.put(`/instructor/regrade-requests/review`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi review yêu cầu chấm lại:", error);
    throw error;
  }
};

export const completeRegradeRequest = async (data) => {
  try {
    const response = await api.put(`/instructor/regrade-requests/complete`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi complete regrade request:", error);
    throw error;
  }
};
