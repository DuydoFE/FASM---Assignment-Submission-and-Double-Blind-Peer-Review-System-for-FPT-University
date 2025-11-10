import api from "./api"; // Import aaxios instance đã cấu hình

const getRegradeRequestByStudentId = (studentId, params) => {
  const url = `/RegradeRequests/student/${studentId}`;
  return api.get(url, { params });
};

export default getRegradeRequestByStudentId;