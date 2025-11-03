import api from "../config/axios";
import axios from "axios";

const API_BASE_URL = "https://localhost:7104";

// 🔹 Lấy thông tin user theo ID
export const getUserById = async (id) => {
  const res = await api.get(`/Users/${id}`);
  return res.data;
};

// 🔹 Xóa người dùng (Admin-only)
export const deleteUser = async (id) => {
  const res = await api.delete(`/Users/${id}`);
  return res.data;
};

// 🔹 Tìm user theo email
export const getUserByEmail = async (email) => {
  const res = await api.get(`/Users/email/${encodeURIComponent(email)}`);
  return res.data;
};

// 🔹 Tìm user theo username
export const getUserByUsername = async (username) => {
  const res = await api.get(`/Users/username/${encodeURIComponent(username)}`);
  return res.data;
};

// 🔹 Lấy danh sách user theo role
export const getUsersByRole = async (roleName) => {
  const res = await api.get(`/Users/role/${encodeURIComponent(roleName)}`);
  return res.data;
};

// 🔹 Cập nhật avatar người dùng
export const updateUserAvatar = async (id, avatarUrl) => {
  const res = await api.put(`/Users/${id}/avatar`, avatarUrl, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// 🔹 Đổi mật khẩu người dùng
export const changeUserPassword = async (id, requestData) => {
  const res = await api.put(`/Users/${id}/password`, requestData);
  return res.data;
};

// 🔹 Lấy thống kê tài khoản
export const getAccountStatistics = async () => {
  const res = await api.get(`/Users/statistics`);
  return res.data;
};

// 🔹 Tạo instructor qua email
export const addInstructorByEmail = async (email, firstName, lastName, campusId) => {
  const res = await api.post(
    `/Users/instructor-email?firstName=${encodeURIComponent(firstName)}&LastName=${encodeURIComponent(
      lastName
    )}&campus=${campusId}`,
    JSON.stringify(email),
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// ✅ Gán vai trò cho user
export const assignUserRoles = async (userId, roles) => {
  // Ánh xạ role name -> roleId tương ứng với DB
  const roleIds = roles.map((r) => {
    switch (r) {
      case "Admin":
        return 1;
      case "Student":
        return 2;
      case "Instructor":
        return 3;
      default:
        return null;
    }
  }).filter((id) => id !== null); // loại bỏ null

  console.log("🛰 Gửi lên API:", { userId, roleIds });

  const res = await api.post(`/Users/${userId}/roles`, {
    userId,
    roleIds, // 👈 Đúng key mà BE yêu cầu
  });

  return res.data;
};

// 🔹 Lấy danh sách vai trò của user
export const getUserRoles = async (id) => {
  const res = await api.get(`/Users/${id}/roles`);
  return res.data;
};

// ✅ Lấy toàn bộ user
export const getAllUsers = async () => {
  const res = await api.get("/Users");
  return res.data;
};

// ✅ Lấy user theo campus
export const getUsersByCampus = async (campusId) => {
  const res = await api.get(`/Users/campus/${campusId}`);
  console.log("getUsersByCampus API response:", res.data);
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
export const createUser = async (userData) => {
  const res = await api.post("/Users", userData, {
    headers: {
      "Content-Type": "application/json-patch+json",
    },
  });
  return res.data;
};

// ✅ Lấy tất cả lớp học
export const getAllClasses = async () => {
  const res = await api.get("/CourseInstance");
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

// ===============================
// 🔹 MAJOR API (Ngành học)
// ===============================

// 🔹 Lấy danh sách tất cả ngành học
export const getAllMajors = async () => {
  const res = await api.get("/Major");
  return res.data;
};

// 🔹 Lấy thông tin ngành học theo ID
export const getMajorById = async (id) => {
  const res = await api.get(`/Major/${id}`);
  return res.data;
};

// 🔹 Tạo ngành học mới
export const createMajor = async (data) => {
  const res = await api.post("/Major", data);
  return res.data;
};

// 🔹 Cập nhật thông tin ngành học
export const updateMajor = async (data) => {
  const res = await api.put("/Major", data);
  return res.data;
};

// 🔹 Xóa ngành học
export const deleteMajor = async (id) => {
  const res = await api.delete(`/Major/${id}`);
  return res.data;
};


// ===============================
// 🔹 CAMPUS API (Cơ sở - Campus)
// ===============================

// 🔹 Lấy danh sách tất cả campus
export const getAllCampuses = async () => {
  const res = await api.get("/Campus");
  return res.data;
};

// 🔹 Lấy thông tin campus theo ID
export const getCampusById = async (id) => {
  const res = await api.get(`/Campus/${id}`);
  return res.data;
};

// 🔹 Tạo campus mới
export const createCampus = async (data) => {
  const res = await api.post("/Campus", data);
  return res.data;
};

// 🔹 Cập nhật thông tin campus
export const updateCampus = async (data) => {
  const res = await api.put("/Campus", data);
  return res.data;
};

// 🔹 Xóa campus
export const deleteCampus = async (id) => {
  const res = await api.delete(`/Campus/${id}`);
  return res.data;
};

// ===============================
// 📘 COURSE API (Môn học - Course)
// ===============================

/**
 * Lấy thông tin môn học theo ID
 * @param {number} id - ID của môn học
 * @returns {Promise<object>} Thông tin chi tiết môn học
 */
export const getCourseById = async (id) => {
  const res = await api.get(`/Course/${id}`);
  return res.data;
};

/**
 * Lấy danh sách toàn bộ môn học
 * @returns {Promise<Array>} Danh sách tất cả môn học trong hệ thống
 */
export const getAllCourses = async () => {
  const res = await api.get("/Course");
  return res.data;
};

/**
 * Tạo môn học mới
 * @param {object} data - Thông tin môn học mới (curriculumId, courseCode, courseName, credits, ...)
 * @returns {Promise<object>} Môn học vừa được tạo
 */
export const createCourse = async (data) => {
  const res = await api.post("/Course", data);
  return res.data;
};

/**
 * Cập nhật thông tin môn học
 * @param {object} data - Dữ liệu cập nhật (bao gồm courseId và các thuộc tính mới)
 * @returns {Promise<object>} Môn học sau khi được cập nhật
 */
export const updateCourse = async (data) => {
  const res = await api.put("/Course", data);
  return res.data;
};

/**
 * Xóa môn học theo ID
 * ⚠️ Chỉ có thể xóa nếu môn học chưa có course instance nào
 * @param {number} id - ID môn học cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteCourse = async (id) => {
  const res = await api.delete(`/Course/${id}`);
  return res.data;
};

/**
 * Lấy danh sách môn học theo chương trình đào tạo (Curriculum)
 * @param {number} curriculumId - ID của chương trình đào tạo
 * @returns {Promise<Array>} Danh sách các môn học thuộc chương trình đó
 */
export const getCoursesByCurriculum = async (curriculumId) => {
  const res = await api.get(`/Course/curriculum/${curriculumId}`);
  return res.data;
};

/**
 * Tìm kiếm môn học theo mã môn học (courseCode)
 * @param {string} courseCode - Mã môn học cần tìm (có thể tìm partial)
 * @returns {Promise<Array>} Danh sách môn học phù hợp
 */
export const getCoursesByCode = async (courseCode) => {
  const res = await api.get(`/Course/code/${encodeURIComponent(courseCode)}`);
  return res.data;
};

/**
 * Lấy danh sách môn học đang hoạt động (IsActive = true)
 * @returns {Promise<Array>} Danh sách môn học đang hoạt động
 */
export const getActiveCourses = async () => {
  const res = await api.get("/Course/active");
  return res.data;
};

/**
 * Lấy danh sách môn học theo ngành (Major)
 * @param {number} majorId - ID của ngành học
 * @returns {Promise<Array>} Danh sách môn học thuộc ngành đó
 */
export const getCoursesByMajor = async (majorId) => {
  const res = await api.get(`/Course/major/${majorId}`);
  return res.data;
};

// ===========================================
// 📗 COURSE INSTANCE API (Lớp học - CourseInstance)
// ===========================================

/**
 * Lấy thông tin chi tiết lớp học theo ID
 * @param {number} id - ID của lớp học
 * @returns {Promise<object>} Thông tin lớp học bao gồm giảng viên, sinh viên, assignment,...
 */
export const getCourseInstanceById = async (id) => {
  const res = await api.get(`/CourseInstance/${id}`);
  return res.data;
};

/**
 * Lấy danh sách tất cả lớp học
 * @returns {Promise<Array>} Danh sách toàn bộ lớp học trong hệ thống
 */
export const getAllCourseInstances = async () => {
  const res = await api.get("/CourseInstance");
  return res.data;
};

/**
 * Lấy danh sách lớp học theo môn học (CourseId)
 * @param {number} courseId - ID của môn học
 * @returns {Promise<Array>} Danh sách lớp học thuộc môn học đó
 */
export const getCourseInstancesByCourseId = async (courseId) => {
  const res = await api.get(`/CourseInstance/course/${courseId}`);
  return res.data;
};

/**
 * Lấy danh sách lớp học theo kỳ học (SemesterId)
 * @param {number} semesterId - ID của kỳ học
 * @returns {Promise<Array>} Danh sách lớp học thuộc kỳ học được chỉ định
 */
export const getCourseInstancesBySemesterId = async (semesterId) => {
  const res = await api.get(`/CourseInstance/semester/${semesterId}`);
  return res.data;
};

/**
 * Lấy danh sách lớp học theo campus
 * @param {number} campusId - ID của campus
 * @returns {Promise<Array>} Danh sách lớp học tại campus đó
 */
export const getCourseInstancesByCampusId = async (campusId) => {
  const res = await api.get(`/CourseInstance/campus/${campusId}`);
  return res.data;
};

/**
 * Tạo mới một lớp học
 * @param {object} data - Thông tin lớp học (courseId, semesterId, instructorId, campusId, ...)
 * @returns {Promise<object>} Lớp học vừa được tạo
 */
export const createCourseInstance = async (payload) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/CourseInstance`,
      payload,
      {
        headers: {
          "Content-Type": "application/json", // ✅ Đổi từ json-patch+json thành json
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ createCourseInstance error:", error);
    throw error;
  }
};


/**
 * Cập nhật thông tin lớp học
 * @param {object} data - Dữ liệu cập nhật (bao gồm courseInstanceId và thông tin cần thay đổi)
 * @returns {Promise<object>} Lớp học sau khi cập nhật
 */
export const updateCourseInstance = async (data) => {
  const res = await api.put("/CourseInstance", data);
  return res.data;
};

/**
 * Xóa lớp học
 * ⚠️ Chỉ admin có quyền, và chỉ khi lớp chưa có dữ liệu liên quan
 * @param {number} id - ID lớp học cần xóa
 * @returns {Promise<object>} Kết quả xóa
 */
export const deleteCourseInstance = async (id) => {
  const res = await api.delete(`/CourseInstance/${id}`);
  return res.data;
};

/**
 * Cập nhật mã Enroll Key cho lớp học
 * ⚙️ Dành cho giảng viên của lớp, hệ thống sẽ kiểm tra quyền trước khi cập nhật
 * @param {number} courseInstanceId - ID của lớp học
 * @param {object} data - Dữ liệu cập nhật ({ newKey, userId })
 * @returns {Promise<object>} Kết quả cập nhật mã Enroll Key
 */
export const updateEnrollKey = async (courseInstanceId, data) => {
  const res = await api.put(`/CourseInstance/${courseInstanceId}/enroll-key`, data);
  return res.data;
};

