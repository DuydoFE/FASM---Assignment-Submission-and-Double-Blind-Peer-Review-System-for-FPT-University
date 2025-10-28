import api from "../config/axios";

// ✅ Lấy toàn bộ user
export const getAllUsers = async () => {
  const res = await api.get("/Users");
  return res.data;
};

// ✅ Lấy user theo campus
export const getUsersByCampus = async (campusId) => {
  const res = await api.get(`/Users/campus/${campusId}`);
  return res.data;
};

// ✅ Cập nhật thông tin user
export const updateUser = async (id, data) => {
  const res = await api.put(`/Users/${id}`, data);
  return res.data;
};

// ✅ Vô hiệu hóa user
export const deactivateUser = async (id) => {
  const res = await api.put(`/Users/${id}/deactivate`);
  return res.data;
};

// ✅ Kích hoạt user
export const activateUser = async (id) => {
  const res = await api.put(`/Users/${id}/activate`);
  return res.data;
};

// ✅ Tạo user mới
export const createUser = async (data) => {
  const res = await api.post("/Users", data);
  return res.data;
};

// ✅ Lấy tất cả lớp học
export const getAllClasses = async () => {
  const res = await api.get("/CourseInstance");
  return res.data;
};

// ===============================
// 🔹 COURSE INSTANCE API
// ===============================

// 🔹 Lấy lớp học theo ID
export const getCourseInstanceById = async (id) => {
  const res = await api.get(`/CourseInstance/${id}`);
  return res.data;
};

// 🔹 Lấy lớp học theo CourseId
export const getCourseInstancesByCourseId = async (courseId) => {
  const res = await api.get(`/CourseInstance/course/${courseId}`);
  return res.data;
};

// 🔹 Lấy lớp học theo SemesterId
export const getCourseInstancesBySemesterId = async (semesterId) => {
  const res = await api.get(`/CourseInstance/semester/${semesterId}`);
  return res.data;
};

// 🔹 Lấy lớp học theo CampusId
export const getCourseInstancesByCampusId = async (campusId) => {
  const res = await api.get(`/CourseInstance/campus/${campusId}`);
  return res.data;
};

// 🔹 Tạo lớp học mới
export const createCourseInstance = async (data) => {
  const res = await api.post("/CourseInstance", data);
  return res.data;
};

// 🔹 Cập nhật lớp học
export const updateCourseInstance = async (data) => {
  const res = await api.put("/CourseInstance", data);
  return res.data;
};

// 🔹 Xóa lớp học
export const deleteCourseInstance = async (id) => {
  const res = await api.delete(`/CourseInstance/${id}`);
  return res.data;
};

// 🔹 Cập nhật Enroll Key
export const updateEnrollKey = async (courseInstanceId, newKey, userId) => {
  const res = await api.put(`/CourseInstance/${courseInstanceId}/enroll-key`, {
    newKey,
    userId,
  });
  return res.data;
};

// ===============================
// 🔹 COURSE STUDENT API
// ===============================

// 🔹 Lấy chi tiết 1 CourseStudent
export const getCourseStudentById = async (id) => {
  const res = await api.get(`/CourseStudent/${id}`);
  return res.data;
};

// 🔹 Lấy danh sách sinh viên trong 1 lớp học
export const getCourseStudentsByCourseInstance = async (courseInstanceId) => {
  const res = await api.get(`/CourseStudent/course-instance/${courseInstanceId}`);
  return res.data;
};

// 🔹 Lấy danh sách lớp học mà 1 sinh viên đã đăng ký
export const getCourseStudentsByStudent = async (studentId) => {
  const res = await api.get(`/CourseStudent/student/${studentId}`);
  return res.data;
};

// 🔹 Thêm sinh viên vào lớp học (Admin thêm trực tiếp)
export const createCourseStudent = async (data) => {
  const res = await api.post(`/CourseStudent`, data);
  return res.data;
};

// 🔹 Sinh viên tự enroll bằng key
export const enrollStudent = async (courseInstanceId, studentUserId, enrollKey) => {
  const res = await api.post(
    `/CourseStudent/${courseInstanceId}/enroll?studentUserId=${studentUserId}&enrollKey=${encodeURIComponent(
      enrollKey
    )}`
  );
  return res.data;
};

// 🔹 Import sinh viên từ Excel (1 lớp)
export const importStudentsFromExcel = async (courseInstanceId, file, changedByUserId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (changedByUserId) formData.append("changedByUserId", changedByUserId);

  const res = await api.post(`/CourseStudent/${courseInstanceId}/import`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🔹 Import sinh viên từ Excel nhiều lớp (nhiều sheet)
export const importStudentsFromMultipleSheets = async (campusId, file, changedByUserId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (changedByUserId) formData.append("changedByUserId", changedByUserId);

  const res = await api.post(`/CourseStudent/import-multiple?campusId=${campusId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🔹 Cập nhật trạng thái sinh viên trong lớp (Pending, Enrolled, Dropped,...)
export const updateCourseStudentStatus = async (id, status, changedByUserId) => {
  const res = await api.put(
    `/CourseStudent/${id}/status?status=${encodeURIComponent(status)}&changedByUserId=${changedByUserId}`
  );
  return res.data;
};

// 🔹 Cập nhật điểm cuối kỳ
export const updateCourseStudentGrade = async (id, finalGrade, isPassed, changedByUserId) => {
  const res = await api.put(
    `/CourseStudent/${id}/grade?finalGrade=${finalGrade}&isPassed=${isPassed}&changedByUserId=${changedByUserId}`
  );
  return res.data;
};

// 🔹 Xóa sinh viên khỏi lớp học
export const deleteCourseStudent = async (userId, courseInstanceId, courseStudentId) => {
  const res = await api.delete(
    `/CourseStudent/delete?userId=${userId}&courseInstanceId=${courseInstanceId}&courseStudentId=${courseStudentId}`
  );
  return res.data;
};

// ===============================
// 🔹 ASSIGNMENT API
// ===============================




// 🔹 Lấy toàn bộ assignment của 1 lớp học phần
export const getAssignmentsByCourseInstance = async (courseInstanceId) => {
  const res = await api.get(`/Assignment/course-instance/${courseInstanceId}`);
  return res.data;
};
