// src/pages/AssignmentDetailPage/AssignmentDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, BookCopy, CheckCircle, AlertTriangle, Award, Filter, ArrowUpDown } from 'lucide-react';
import StatCard from '../../component/Assignment/StatCard';
import AssignmentCard from '../../component/Assignment/AssignmentCard';


// Dữ liệu giả lập
const courseData = {
  SE1715: {
    code: 'SE1741',
    title: 'PRM391 Mobile Development Lab',
    subject: 'Programming Mobile Devices',
    instructor: 'Nguyễn Minh Sang',
    year: '2025',
    semester: 'Fall 2025'
  }
};

const assignments = [
  { 
    id: 1, 
    title: 'Assignment 1: Mobile UI/UX Design Fundamentals',
    description: 'Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng mobile',
    deadline: '25/12/2024 - 23:59',
    timeLeft: 'Còn 1 ngày 14 giờ',
    weight: '20%',
    status: 'due',
    details: 'Sinh viên cần thiết kế wireframe cho 5 màn hình chính, tạo prototype tương tác và viết báo cáo phân tích UX tối thiểu 1000 từ. Định dạng nộp bài: PDF + Figma link.'
  },
  {
    id: 2,
    title: 'Assignment 2: Android Development with Kotlin',
    description: 'Phát triển ứng dụng Android cơ bản sử dụng ngôn ngữ Kotlin',
    deadline: '05/10/2025 - 23:59',
    timeLeft: 'Còn 11 ngày',
    weight: '20%',
    status: 'open',
  },
];


const AssignmentDetailPage = () => {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const course = courseData[courseId] || { code: courseId, title: 'Unknown Course' }; // Tìm dữ liệu khóa học

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/my-assignments" className="hover:underline">Assignment của tôi</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">{course.code}</span>
        </div>

        {/* Course Header */}
        <div className="mb-8">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-blue-600 font-semibold">{course.code}</p>
                    <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                    <div className="flex items-center text-gray-500 mt-2">
                        <span>{course.subject}</span>
                        <span className="mx-2">•</span>
                        <span>{course.instructor}</span>
                        <span className="mx-2">•</span>
                        <Clock size={14} className="mr-1" />
                        <span>{course.year}</span>
                        <span className="mx-2">•</span>
                        <span>{course.semester}</span>
                    </div>
                </div>
                <div className="flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
                    <CheckCircle size={14} className="mr-1.5" />
                    Đã tham gia
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard icon={BookCopy} value="8" label="Tổng assignments" color="blue" />
            <StatCard icon={CheckCircle} value="3" label="Đã nộp" color="green" />
            <StatCard icon={Clock} value="2" label="Sắp hết hạn" color="red" />
            <StatCard icon={AlertTriangle} value="1" label="Quá hạn" color="yellow" />
            <StatCard icon={Award} value="2" label="Đã chấm điểm" color="purple" />
        </div>

        {/* Filter and Sort */}
        <div className="bg-white p-4 rounded-lg border flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
                <div>
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">Trạng thái:</label>
                    <select id="status-filter" className="p-2 border border-gray-300 rounded-md">
                        <option>Tất cả</option>
                        <option>Đang mở</option>
                        <option>Sắp hết hạn</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="deadline-filter" className="text-sm font-medium text-gray-700 mr-2">Deadline:</label>
                    <select id="deadline-filter" className="p-2 border border-gray-300 rounded-md">
                        <option>Sắp hết hạn</option>
                        <option>Mới nhất</option>
                    </select>
                </div>
            </div>
            <button className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100">
                <ArrowUpDown size={16} className="mr-2" />
                Sắp xếp
            </button>
        </div>

       <div className="space-y-6">
    {assignments.map(assignment => (
        <AssignmentCard 
          key={assignment.id} 
          assignment={assignment} 
          courseId={courseId} // Truyền courseId vào đây
        />
    ))}
</div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;