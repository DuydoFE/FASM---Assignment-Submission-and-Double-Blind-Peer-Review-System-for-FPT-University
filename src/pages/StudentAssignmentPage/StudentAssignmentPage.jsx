import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // 1. Import useSelector
import { BookOpen, Plus, ChevronRight, HelpCircle, Smartphone, Server, Globe, Code } from 'lucide-react';
import CourseListItem from '../../component/Assignment/CourseListItem';
import EnrolledCourseCard from '../../component/Assignment/EnrolledCourseCard';
import JoinClassModal from '../../component/Assignment/JoinClassModal';

// Import service và selector
import { courseService } from '../../service/courseService'; // 2. Import courseService
import { selectUser } from '../../redux/features/userSlice'; // 3. Import selector user

const coursesData = [
  { id: 1, icon: Smartphone, iconColor: 'text-red-500', title: 'Programming Mobile Devices', code: 'SE1715', subjectCode: 'PRM391' },
  { id: 2, icon: Server, iconColor: 'text-blue-500', title: 'Cross-Platform Back-End with .NET', code: 'SE1721', subjectCode: 'PRN231' },
  { id: 3, icon: Globe, iconColor: 'text-purple-500', title: 'Front-End Web Development with React', code: 'SE1712', subjectCode: 'FER201' },
  { id: 4, icon: Code, iconColor: 'text-yellow-600', title: 'Programming Fundamentals using Java', code: 'SE1712', subjectCode: 'PRF192' },
];

const StudentAssignmentPage = () => {
   // 4. Lấy thông tin user đang đăng nhập từ Redux
    const currentUser = useSelector(selectUser);
     console.log("Current User from Redux:", currentUser);

    // 5. Thêm state để lưu danh sách lớp đã tham gia, trạng thái loading và lỗi
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);



   // State để quản lý modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

// 6. Sử dụng useEffect để gọi API khi component được mount
    useEffect(() => {
        // Chỉ gọi API nếu đã có thông tin người dùng và ID của họ
        if (currentUser && currentUser.userId) {
            const fetchEnrolledCourses = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const response = await courseService.getEnrolledCoursesByStudentId(currentUser.userId);
                    // Dữ liệu trả về nằm trong response.data.data
                    setEnrolledCourses(response.data.data);
                } catch (err) {
                    console.error("Lỗi khi tải danh sách lớp học:", err);
                    setError("Không thể tải danh sách lớp học. Vui lòng thử lại.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchEnrolledCourses();
        } else {
            // Nếu không có user, dừng loading và có thể set enrolledCourses là mảng rỗng
            setIsLoading(false);
            setEnrolledCourses([]);
        }
    }, [currentUser]); // Dependency là currentUser, để hook chạy lại nếu user thay đổi (login/logout)


  // Hàm để mở modal
  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Hàm để đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // 7. Render giao diện dựa trên trạng thái loading, error và dữ liệu
    const renderEnrolledCourses = () => {
        if (isLoading) {
            return <p className="text-center py-12">Đang tải danh sách lớp học...</p>;
        }

        if (error) {
            return <p className="text-center py-12 text-red-500">{error}</p>;
        }

        if (enrolledCourses.length === 0) {
            return (
                <div className="text-center flex flex-col items-center py-12 border-b">
                    <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa tham gia lớp học nào</h2>
                    <p className="text-gray-600 mb-6">Hãy tham gia các lớp học để xem assignments và bắt đầu học tập</p>
                    <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                        <Plus className="w-5 h-5 mr-2" />
                        Chọn môn học để tham gia
                    </button>
                </div>
            );
        }

        return enrolledCourses.map(course => (
           <EnrolledCourseCard
        key={course.courseStudentId}
        subjectCode={course.courseCode}
        title={`${course.courseName} - ${course.courseCode}`}
        
        // SỬA Ở ĐÂY: Truyền vào ID thay vì Name/Code
        // Prop `classCode` của component sẽ nhận giá trị là ID
        classCode={course.courseInstanceId} 

        // Hiển thị classCode thật sự (courseInstanceName) ở một prop khác nếu cần,
        // hoặc giữ nguyên vì nó đã có trong title hoặc một nơi khác.
        // Ví dụ:
        // displayCode={course.courseInstanceName} // Thêm một prop mới nếu cần hiển thị

        lecturer="N/A"
                studentCount={0}
                schedule="N/A"
                assignmentCount={0}
            />
        ));
    };


  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <span>Assignment của tôi</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">Assignment của tôi</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Lớp Của Tôi</h1>
         {renderEnrolledCourses()}
          {/* <div className="text-center flex flex-col items-center py-12 border-b">
            <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa tham gia lớp học nào</h2>
            <p className="text-gray-600 mb-6">Hãy tham gia các lớp học để xem assignments và bắt đầu học tập</p>
            <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              Chọn môn học để tham gia
            </button>
          </div> */}

          <div className="py-8">
            <h3 className="text-lg font-bold text-gray-800">Chọn mã lớp để tham gia</h3>
            <p className="text-sm text-gray-600 mb-4">Chọn mã lớp học phù hợp để tham gia vào lớp học được chỉ định</p>
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Học kỳ *</label>
                <select id="semester" className="w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Fall 2025</option>
                  <option>Spring 2026</option>
                  <option>Summer 2026</option>
                </select>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Năm học *</label>
                <select id="year" className="w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                </select>
              </div>
              <div className="self-end">
                <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                  Lọc kết quả
                </button>
              </div>
            </div>
          </div>
              <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Kết quả tìm kiếm</h3>
              <div className="border rounded-lg">
                {coursesData.map(course => (
                  <CourseListItem 
                    key={course.id}
                    icon={course.icon}
                    iconColor={course.iconColor}
                    title={course.title}
                    code={course.code}
                    // Truyền hàm vào đây
                    onJoinClick={() => handleOpenModal(course)}
                  />
                ))}
              </div>
            </div>

        </div>

        {/* Help Link */}
        <div className="text-center mt-8">
          <a href="#" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600">
            <HelpCircle className="w-4 h-4 mr-2" />
            Cần hỗ trợ?
          </a>
        </div>
         {/* Render Modal ở đây */}
      <JoinClassModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
      />
      </div>
    </div>
  );
};

export default StudentAssignmentPage;