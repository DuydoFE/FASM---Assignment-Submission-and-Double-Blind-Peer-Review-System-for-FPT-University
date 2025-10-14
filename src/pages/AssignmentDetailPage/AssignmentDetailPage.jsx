import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  BookCopy,
  CheckCircle,
  AlertTriangle,
  Award,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import StatCard from "../../component/Assignment/StatCard";
import AssignmentCard from "../../component/Assignment/AssignmentCard";
import { assignmentService } from "../../service/assignmentService"; // 1. Import service

// Dữ liệu giả lập
const courseData = {
  SE1715: {
    code: "SE1741",
    title: "PRM391 Mobile Development Lab",
    subject: "Programming Mobile Devices",
    instructor: "Nguyễn Minh Sang",
    year: "2025",
    semester: "Fall 2025",
  },
};

const AssignmentDetailPage = () => {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const course = courseData[courseId] || {
    code: courseId,
    title: "Unknown Course",
  };

  // 2. Thêm state để quản lý dữ liệu, loading và lỗi
  const [assignments, setAssignments] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Sử dụng useEffect để gọi API
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await assignmentService.getAssignmentsByCourseInstanceId(
          courseId
        );

        // Luôn set assignments là một mảng để tránh lỗi
        setAssignments(data || []);

        if (data && data.length > 0) {
          const firstAssignment = data[0];
          setCourseInfo({
            code: firstAssignment.sectionCode,
            title: firstAssignment.courseName,
            subject: firstAssignment.courseCode,
            campus: firstAssignment.campusName,
            year: new Date(firstAssignment.createdAt).getFullYear().toString(),
            instructor: "N/A", // Cần API riêng để lấy thông tin này
          });
        } else {
          // Xử lý trường hợp không có assignment nào
          // Bạn có thể cần gọi một API khác để lấy thông tin lớp học ở đây
          setCourseInfo({ code: courseId, title: `Lớp học ${courseId}` });
        }
      } catch (err) {
        setError("Không thể tải được danh sách bài tập. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId]);
  // 4. Render giao diện dựa trên trạng thái
  if (isLoading) {
    return <div className="text-center p-8">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to="/my-assignments" className="hover:underline">
            My Assignmnent
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">{course.code}</span>
        </div>

        {courseInfo && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-600 font-semibold">
                  {courseInfo.code}{" "}
                  {courseInfo.campus ? `- ${courseInfo.campus}` : ""}
                </p>
                <h1 className="text-3xl font-bold text-gray-900">
                  {courseInfo.title}
                </h1>
                <div className="flex items-center text-gray-500 mt-2 space-x-2">
                  <span>{courseInfo.subject}</span>
                  <span>•</span>
                  <span>Giảng viên: {courseInfo.instructor}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>Năm học: {courseInfo.year}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
                <CheckCircle size={14} className="mr-1.5" />
                Đã tham gia
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={BookCopy}
            value="1"
            label="All assignments"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            value="0"
            label="Submitted"
            color="green"
          />
          <StatCard
            icon={Clock}
            value="0"
            label="About to expire"
            color="red"
          />
          <StatCard
            icon={AlertTriangle}
            value="1"
            label="Note the time"
            color="yellow"
          />
        </div>

        {/* Filter and Sort */}
        <div className="bg-white p-4 rounded-lg border flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Trạng thái:
              </label>
              <select
                id="status-filter"
                className="p-2 border border-gray-300 rounded-md"
              >
                <option>Tất cả</option>
                <option>Đang mở</option>
                <option>Sắp hết hạn</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="deadline-filter"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Deadline:
              </label>
              <select
                id="deadline-filter"
                className="p-2 border border-gray-300 rounded-md"
              >
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
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.assignmentId}
                assignment={assignment}
                courseId={courseId}
              />
            ))
          ) : (
            <div className="text-center bg-white p-12 rounded-lg border">
              <h3 className="text-xl font-semibold">Chưa có bài tập nào</h3>
              <p className="text-gray-600">
                Hiện tại chưa có bài tập nào được giao cho lớp học này.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
