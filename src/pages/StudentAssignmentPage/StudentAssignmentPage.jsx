import React, { useState } from 'react';
import { BookOpen, Plus, ChevronRight, HelpCircle, Smartphone, Server, Globe, Code } from 'lucide-react';
import CourseListItem from '../../component/Assignment/CourseListItem';
import EnrolledCourseCard from '../../component/Assignment/EnrolledCourseCard';
import JoinClassModal from '../../component/Assignment/JoinClassModal';

const coursesData = [
  { id: 1, icon: Smartphone, iconColor: 'text-red-500', title: 'Programming Mobile Devices', code: 'SE1715', subjectCode: 'PRM391' },
  { id: 2, icon: Server, iconColor: 'text-blue-500', title: 'Cross-Platform Back-End with .NET', code: 'SE1721', subjectCode: 'PRN231' },
  { id: 3, icon: Globe, iconColor: 'text-purple-500', title: 'Front-End Web Development with React', code: 'SE1712', subjectCode: 'FER201' },
  { id: 4, icon: Code, iconColor: 'text-yellow-600', title: 'Programming Fundamentals using Java', code: 'SE1712', subjectCode: 'PRF192' },
];

const StudentAssignmentPage = () => {

   // State để quản lý modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
            <EnrolledCourseCard 
            subjectCode="SE"
            title="Programming Mobile Devices - PRM391"
            classCode="SE1715"
            lecturer="TS. Nguyễn Văn Minh"
            studentCount={42}
            schedule="Thứ 2, 7:30-11:00"
            assignmentCount={8}
          />
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