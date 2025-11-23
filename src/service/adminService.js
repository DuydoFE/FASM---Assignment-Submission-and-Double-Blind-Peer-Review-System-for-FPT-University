import api from "../config/axios";
import axios from "axios";

const API_BASE_URL = "https://localhost:7104";

// Lấy thông tin user theo ID
export const getUserById = async (id) => {
  const res = await api.get(`/Users/${id}`);
  return res.data;
};

// Lấy thông tin chi tiết user theo ID (bao gồm lịch sử lớp học, điểm số,...)
export const getUserByIdDetail = async (id) => {
  const res = await api.get(`/Users/${id}/detail`);
  return res.data;
};

// Xóa người dùng (chỉ admin có quyền)
export const deleteUser = async (id) => {
  const res = await api.delete(`/Users/${id}`);
  return res.data;
};

// Tìm user theo email
export const getUserByEmail = async (email) => {
  const res = await api.get(`/Users/email/${encodeURIComponent(email)}`);
  return res.data;
};

// Tìm user theo username
export const getUserByUsername = async (username) => {
  const res = await api.get(`/Users/username/${encodeURIComponent(username)}`);
  return res.data;
};

// Lấy danh sách user theo role
export const getUsersByRole = async (roleName) => {
  const res = await api.get(`/Users/role/${encodeURIComponent(roleName)}`);
  return res.data;
};

// Cập nhật avatar người dùng
export const updateUserAvatar = async (id, avatarUrl) => {
  const res = await api.put(`/Users/${id}/avatar`, avatarUrl, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Đổi mật khẩu người dùng
export const changeUserPassword = async (id, requestData) => {
  const res = await api.put(`/Users/${id}/password`, requestData);
  return res.data;
};

// Lấy thống kê tài khoản
export const getAccountStatistics = async () => {
  const res = await api.get(`/Users/statistics`);
  return res.data;
};

// Tạo instructor qua email
export const addInstructorByEmail = async (email, firstName, lastName, campusId) => {
  const res = await api.post(
    `/Users/instructor-email?firstName=${encodeURIComponent(firstName)}&LastName=${encodeURIComponent(lastName)}&campus=${campusId}`,
    JSON.stringify(email),
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Gán vai trò cho user
export const assignUserRoles = async (userId, roles) => {
  const roleIds = roles.map((r) => {
    switch (r) {
      case "Admin": return 1;
      case "Student": return 2;
      case "Instructor": return 3;
      default: return null;
    }
  }).filter((id) => id !== null);

  const res = await api.post(`/Users/${userId}/roles`, { userId, roleIds });
  return res.data;
};

// Lấy danh sách vai trò của user
export const getUserRoles = async (id) => {
  const res = await api.get(`/Users/${id}/roles`);
  return res.data;
};

// Lấy toàn bộ user
export const getAllUsers = async () => {
  const res = await api.get("/Users");
  return res.data;
};

// Lấy user theo campus
export const getUsersByCampus = async (campusId) => {
  const res = await api.get(`/Users/campus/${campusId}`);
  return res.data;
};

// Cập nhật thông tin user
export const updateUser = async (id, data) => {
  const res = await api.put(`/Users/${id}`, data);
  return res.data;
};

// Vô hiệu hóa user
export const deactivateUser = async (id) => {
  const res = await api.put(`/Users/${id}/deactivate`);
  return res.data;
};

// Kích hoạt user
export const activateUser = async (id) => {
  const res = await api.put(`/Users/${id}/activate`);
  return res.data;
};

// Tạo user mới
export const createUser = async (userData) => {
  const res = await api.post("/Users", userData, {
    headers: { "Content-Type": "application/json-patch+json" },
  });
  return res.data;
};

// Lấy thông tin môn học theo ID
export const getCourseById = async (id) => {
  const res = await api.get(`/Course/${id}`);
  return res.data;
};

// Lấy danh sách toàn bộ môn học
export const getAllCourses = async () => {
  const res = await api.get("/Course");
  return res.data;
};

// Tạo môn học mới
export const createCourse = async (data) => {
  const res = await api.post("/Course", data);
  return res.data;
};

// Cập nhật môn học
export const updateCourse = async (data) => {
  const res = await api.put("/Course", data);
  return res.data;
};

// Xóa môn học (chỉ khi chưa có lớp học phần liên quan)
export const deleteCourse = async (id) => {
  const res = await api.delete(`/Course/${id}`);
  return res.data;
};

// Lấy danh sách môn học theo curriculum
export const getCoursesByCurriculum = async (curriculumId) => {
  const res = await api.get(`/Course/curriculum/${curriculumId}`);
  return res.data;
};

// Tìm kiếm môn học theo course code
export const getCoursesByCode = async (courseCode) => {
  const res = await api.get(`/Course/code/${encodeURIComponent(courseCode)}`);
  return res.data;
};

// Lấy danh sách môn học đang active
export const getActiveCourses = async () => {
  const res = await api.get("/Course/active");
  return res.data;
};

// Lấy môn học theo ngành
export const getCoursesByMajor = async (majorId) => {
  const res = await api.get(`/Course/major/${majorId}`);
  return res.data;
};

// Lấy chi tiết lớp học theo ID
export const getCourseInstanceById = async (id) => {
  const res = await api.get(`/CourseInstance/${id}`);
  return res.data;
};

// Lấy danh sách tất cả lớp học
export const getAllCourseInstances = async () => {
  const res = await api.get("/CourseInstance");
  return res.data;
};

// Lấy danh sách lớp học theo môn học
export const getCourseInstancesByCourseId = async (courseId) => {
  const res = await api.get(`/CourseInstance/course/${courseId}`);
  return res.data;
};

// Lấy danh sách lớp học theo kỳ học
export const getCourseInstancesBySemesterId = async (semesterId) => {
  const res = await api.get(`/CourseInstance/semester/${semesterId}`);
  return res.data;
};

// Lấy danh sách lớp học theo campus
export const getCourseInstancesByCampusId = async (campusId) => {
  const res = await api.get(`/CourseInstance/campus/${campusId}`);
  return res.data;
};

// Tạo lớp học mới
export const createCourseInstance = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/api/CourseInstance`, payload, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// Cập nhật lớp học
export const updateCourseInstance = async (data) => {
  const res = await api.put("/CourseInstance", data);
  return res.data;
};

// Xóa lớp học
export const deleteCourseInstance = async (id) => {
  const res = await api.delete(`/CourseInstance/${id}`);
  return res.data;
};

// Cập nhật Enroll Key cho lớp học
export const updateEnrollKey = async (courseInstanceId, data) => {
  const res = await api.put(`/CourseInstance/${courseInstanceId}/enroll-key`, data);
  return res.data;
};

// Tạo bài tập mới
export const createAssignment = async (formData) => {
  const res = await api.post(`/Assignment`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};

// Cập nhật bài tập
export const updateAssignment = async (formData) => {
  const res = await api.put(`/Assignment`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};

// Xóa bài tập
export const deleteAssignment = async (id) => {
  const res = await api.delete(`/Assignment/${id}`);
  return res.data;
};

// Lấy thông tin bài tập theo ID
export const getAssignmentById = async (id) => {
  const res = await api.get(`/Assignment/${id}`);
  return res.data;
};

// Lấy chi tiết bài tập kèm rubric
export const getAssignmentWithDetails = async (id) => {
  const res = await api.get(`/Assignment/${id}/details`);
  return res.data;
};

// Lấy danh sách bài tập theo lớp học phần
export const getAssignmentsByCourseInstance = async (courseInstanceId) => {
  const res = await api.get(`/Assignment/course-instance/${courseInstanceId}`);
  return res.data;
};

// Lấy danh sách bài tập theo giảng viên
export const getAssignmentsByInstructor = async (instructorId) => {
  const res = await api.get(`/Assignment/instructor/${instructorId}`);
  return res.data;
};

// Lấy danh sách bài tập theo sinh viên
export const getAssignmentsByStudent = async (studentId) => {
  const res = await api.get(`/Assignment/student/${studentId}`);
  return res.data;
};

// Lấy danh sách bài tập đang active
export const getActiveAssignments = async () => {
  const res = await api.get(`/Assignment/active`);
  return res.data;
};

// Lấy danh sách bài tập quá hạn
export const getOverdueAssignments = async () => {
  const res = await api.get(`/Assignment/overdue`);
  return res.data;
};

// Publish bài tập
export const publishAssignment = async (assignmentId) => {
  const res = await api.put(`/Assignment/${assignmentId}/publish`);
  return res.data;
};

// Gia hạn deadline bài tập
export const extendAssignmentDeadline = async (id, newDeadline) => {
  const res = await api.put(`/Assignment/${id}/extend-deadline`, JSON.stringify(newDeadline), {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Cập nhật rubric cho bài tập
export const updateAssignmentRubric = async (assignmentId, rubricId) => {
  const res = await api.put(`/Assignment/${assignmentId}/update-rubric/${rubricId}`);
  return res.data;
};

// Lấy Rubric Template theo ID
export const getRubricTemplateById = async (id) => {
  const res = await api.get(`/RubricTemplate/${id}`);
  return res.data;
};

// Lấy danh sách tất cả Rubric Template
export const getAllRubricTemplates = async () => {
  const res = await api.get("/RubricTemplate");
  return res.data;
};

// Lấy Rubric Template theo userId
export const getRubricTemplatesByUserId = async (userId) => {
  const res = await api.get(`/RubricTemplate/user/${userId}`);
  return res.data;
};

// Lấy Rubric Template public
export const getPublicRubricTemplates = async () => {
  const res = await api.get("/RubricTemplate/public");
  return res.data;
};

// Tạo Rubric Template mới
export const createRubricTemplate = async (requestData) => {
  const res = await api.post("/RubricTemplate", requestData);
  return res.data;
};

// Cập nhật Rubric Template
export const updateRubricTemplate = async (requestData) => {
  const res = await api.put("/RubricTemplate", requestData);
  return res.data;
};

// Xóa Rubric Template
export const deleteRubricTemplate = async (id) => {
  const res = await api.delete(`/RubricTemplate/${id}`);
  return res.data;
};

// Tìm kiếm Rubric Template theo từ khóa
export const searchRubricTemplates = async (searchTerm) => {
  const res = await api.get(`/RubricTemplate/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  return res.data;
};

// Lấy danh sách tất cả ngành học
export const getAllMajors = async () => {
  const res = await api.get("/Major");
  return res.data;
};

// Lấy thông tin ngành học theo ID
export const getMajorById = async (id) => {
  const res = await api.get(`/Major/${id}`);
  return res.data;
};

// Tạo ngành học mới
export const createMajor = async (data) => {
  const res = await api.post("/Major", data);
  return res.data;
};

// Cập nhật ngành học
export const updateMajor = async (data) => {
  const res = await api.put("/Major", data);
  return res.data;
};

// Xóa ngành học
export const deleteMajor = async (id) => {
  const res = await api.delete(`/Major/${id}`);
  return res.data;
};

// Lấy danh sách tất cả campus
export const getAllCampuses = async () => {
  const res = await api.get("/Campus");
  return res.data;
};

// Lấy thông tin campus theo ID
export const getCampusById = async (id) => {
  const res = await api.get(`/Campus/${id}`);
  return res.data;
};

// Tạo campus mới
export const createCampus = async (data) => {
  const res = await api.post("/Campus", data);
  return res.data;
};

// Cập nhật campus
export const updateCampus = async (data) => {
  const res = await api.put("/Campus", data);
  return res.data;
};

// Xóa campus
export const deleteCampus = async (id) => {
  const res = await api.delete(`/Campus/${id}`);
  return res.data;
};

//Import nhiều sinh viên vào nhiều lớp từ file Excel
export const importStudentsFromMultipleSheets = async (campusId, file, changedByUserId = null) => {
  if (!file) throw new Error("File is required");
  if (!campusId || campusId <= 0) throw new Error("CampusId is required");

  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams();
  params.append("campusId", campusId);
  if (changedByUserId) params.append("changedByUserId", changedByUserId);

  const res = await api.post(`/CourseStudent/import-multiple?${params.toString()}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

//Thêm một sinh viên vào lớp học
export const createCourseStudent = async (requestData) => {
  if (!requestData) throw new Error("Request data is required");

  const res = await api.post("/CourseStudent", requestData);
  return res.data;
};

//Xóa sinh viên khỏi lớp học
export const deleteCourseStudent = async (userId, courseInstanceId, courseStudentId) => {
  if (!userId || !courseInstanceId || !courseStudentId) {
    throw new Error("userId, courseInstanceId và courseStudentId là bắt buộc");
  }

  const res = await api.delete(
    `/CourseStudent/delete?userId=${userId}&courseInstanceId=${courseInstanceId}&courseStudentId=${courseStudentId}`
  );
  return res.data;
};

//Lấy danh sách sinh viên trong một lớp học
export const getCourseStudentsByCourseInstance = async (courseInstanceId) => {
  if (!courseInstanceId) {
    throw new Error("courseInstanceId là bắt buộc");
  }

  const res = await api.get(`/CourseStudent/course-instance/${courseInstanceId}`);
  return res.data;
};

//Import sinh viên vào lớp học từ file Excel
export const importStudentsFromExcel = async (courseInstanceId, file, changedByUserId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (changedByUserId) formData.append("changedByUserId", changedByUserId);

  const res = await api.post(`/CourseStudent/${courseInstanceId}/import`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

//Lấy chi tiết một submission (bao gồm review, AI summaries và regrade requests nếu có)
export const getSubmissionDetails = async (submissionId) => {
  const res = await api.get(`/instructor/InstructorSubmission/${submissionId}/details`);
  return res.data;
};

//Xem danh sách bài nộp trong Assignment
export const getSubmissionsByAssignmentSimple = async (assignmentId) => {
  const res = await api.get(`/instructor/InstructorSubmission/assignment/${assignmentId}/submissions`);
  return res.data;
};

// Lấy chi tiết 1 CourseInstructor theo ID
export const getCourseInstructorById = async (id) => {
  const res = await api.get(`/CourseInstructor/${id}`);
  return res.data;
};

// Lấy danh sách giảng viên trong một lớp học
export const getCourseInstructorsByCourseInstance = async (courseInstanceId) => {
  const res = await api.get(`/CourseInstructor/course-instance/${courseInstanceId}`);
  return res.data;
};

// Lấy danh sách lớp học mà 1 giảng viên đang dạy
export const getCourseInstructorsByInstructor = async (instructorId) => {
  const res = await api.get(`/CourseInstructor/instructor/${instructorId}`);
  return res.data;
};

// Gán 1 giảng viên vào lớp học
export const createCourseInstructor = async (requestData) => {
  const res = await api.post(`/CourseInstructor`, requestData);
  return res.data;
};

// Gán nhiều giảng viên vào lớp học
export const bulkAssignInstructors = async (requestData) => {
  const res = await api.post(`/CourseInstructor/bulk-assign`, requestData);
  return res.data;
};

// Cập nhật giảng viên chính
export const updateMainInstructor = async (courseInstanceId, mainInstructorId) => {
  const res = await api.put(`/CourseInstructor/${courseInstanceId}/main-instructor/${mainInstructorId}`);
  return res.data;
};

// Xóa giảng viên khỏi lớp học
export const deleteCourseInstructor = async (id) => {
  const res = await api.delete(`/CourseInstructor/${id}`);
  return res.data;
};

// 🧩 Lấy Criteria Template theo ID
export const getCriteriaTemplateById = async (id) => {
  const res = await api.get(`/CriteriaTemplate/${id}`);
  return res.data;
};

// 📋 Lấy danh sách tất cả Criteria Template
export const getAllCriteriaTemplates = async () => {
  const res = await api.get(`/CriteriaTemplate`);
  return res.data;
};

// 📂 Lấy danh sách Criteria Template theo TemplateId
export const getCriteriaTemplatesByTemplateId = async (templateId) => {
  const res = await api.get(`/CriteriaTemplate/template/${templateId}`);
  return res.data;
};

// ✏️ Tạo Criteria Template mới
export const createCriteriaTemplate = async (data) => {
  const res = await api.post(`/CriteriaTemplate`, data);
  return res.data;
};

// 🛠️ Cập nhật Criteria Template
export const updateCriteriaTemplate = async (data) => {
  const res = await api.put(`/CriteriaTemplate`, data);
  return res.data;
};

// ❌ Xóa Criteria Template theo ID
export const deleteCriteriaTemplate = async (id) => {
  const res = await api.delete(`/CriteriaTemplate/${id}`);
  return res.data;
};

// Lấy danh sách tất cả học kỳ
export const getAllSemesters = async () => {
  const res = await api.get("/Semester");
  return res.data;
};
