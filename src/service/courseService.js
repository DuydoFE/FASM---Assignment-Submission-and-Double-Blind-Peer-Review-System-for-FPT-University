import api from "../config/axios";
// Hàm gọi API để lấy danh sách các lớp học mà sinh viên đã tham gia
const getEnrolledCoursesByStudentId = (studentId) => {
// Sử dụng template literal để chèn studentId vào URL
return api.get(`/CourseStudent/student/${studentId}`);
};
// Export tất cả các hàm service
export const courseService = {
getEnrolledCoursesByStudentId,
};