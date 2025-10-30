import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { selectUser } from '../../redux/features/userSlice';
import { assignmentService } from '../../service/assignmentService'; 

import { ChevronRight, Link, Upload, FileText, Calendar, Bell } from 'lucide-react';
import AssignmentCard from '../../component/MiniDashBoard/AssignmentCard';
import CourseCard from '../../component/MiniDashBoard/CourseCard';
// 👉 1. Import component RecentActivity mới
import RecentActivity from '../../component/StudentDashBoard/RecentActivity';

const getAssignmentColor = (days) => {
  if (days <= 3) return 'red';
  if (days <= 7) return 'yellow';
  return 'green';
};

const formatDueDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}

const StudentDashBoard = () => {
  const currentUser = useSelector(selectUser);
  const studentId = currentUser?.userId;

  const { data: assignmentData, isLoading, isError } = useQuery({
    queryKey: ['studentAssignments', studentId],
    queryFn: () => assignmentService.getStudentAssignments(studentId),
    enabled: !!studentId,
  });

  const assignments = assignmentData?.data || [];
  const MAX_ASSIGNMENTS_TO_SHOW = 5;
  const displayedAssignments = assignments.slice(0, MAX_ASSIGNMENTS_TO_SHOW);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser?.firstName}! </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Assignments are about to expire</h2>
                {assignments.length > MAX_ASSIGNMENTS_TO_SHOW && (
                   <Link to="/my-assignments" className="text-sm font-semibold text-orange-600 flex items-center">
                    Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
              <div>
                {isLoading && <p>Loading assignments...</p>}
                {isError && <p className="text-red-500">Could not fetch assignments.</p>}
                {!isLoading && !isError && displayedAssignments.length > 0 ? (
                  displayedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.assignmentId}
                      color={getAssignmentColor(assignment.daysUntilDeadline)}
                      title={assignment.title}
                      subject={assignment.courseName}
                      dueDate={formatDueDate(assignment.deadline)}
                      remaining={`${assignment.daysUntilDeadline} days`}
                    />
                  ))
                ) : (
                  !isLoading && <p>No upcoming assignments.</p>
                )}
              </div>
            </div>

            {/* 👉 2. Xóa bỏ code cũ và thay bằng component mới */}
            <RecentActivity />

          </div>

          <div className="space-y-8">
            {/* Thao tác nhanh */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick action</h2>
              <div className="space-y-3">
                 <button className="w-full flex items-center justify-center p-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
                   <Upload className="w-5 h-5 mr-2" /> Submit new assignment
                 </button>
                 <button className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                   <FileText className="w-5 h-5 mr-2" /> View scores
                 </button>
                 <button className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                   <Calendar className="w-5 h-5 mr-2" /> Submission schedule
                 </button>
              </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Peer Review</h2>
                    <Bell className="text-orange-600" />
                </div>
                <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg flex items-start">
                        <div className="text-center mr-3">
                            <p className="font-bold text-red-700 text-lg">25</p>
                            <p className="text-xs text-red-600">T12</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">PRM391</p>
                            <p className="text-xs text-gray-500">PRN231 • 14:00</p>
                        </div>
                    </div>
                     <div className="bg-yellow-50 p-3 rounded-lg flex items-start">
                        <div className="text-center mr-3">
                            <p className="font-bold text-yellow-700 text-lg">28</p>
                            <p className="text-xs text-yellow-600">T12</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Database Report Due</p>
                            <p className="text-xs text-gray-500">DBI202 • 23:59</p>
                        </div>
                    </div>
                     <div className="bg-green-50 p-3 rounded-lg h-16" />
                </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800">Your class</h2>
            <p className="text-gray-600 mb-4">The classes you are taking</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseCard title="Mobile App Development" code="PRM391" teacher="Nguyễn Văn A" students={45} campus="Hồ Chí Minh" />
                <CourseCard title="Database Design" code="DBI202" teacher="Trần Thị B" students={38} campus="Hồ Chí Minh" />
                <CourseCard title="Software Engineering" code="SWE201" teacher="Lê Văn C" students={42} campus="Hồ Chí Minh" />
            </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashBoard;