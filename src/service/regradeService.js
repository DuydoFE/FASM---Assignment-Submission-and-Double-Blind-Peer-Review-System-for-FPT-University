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
