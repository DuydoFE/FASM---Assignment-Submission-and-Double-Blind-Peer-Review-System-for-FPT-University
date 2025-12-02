import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { selectUser } from "../../redux/features/userSlice";
import { assignmentService } from "../../service/assignmentService";
import { studentReviewService } from "../../service/studentReviewService";

import { Link } from "react-router-dom";
import {
  ChevronRight,
  Link as LinkIcon,
  Upload,
  FileText,
  Calendar,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import AssignmentCard from "../../component/MiniDashBoard/AssignmentCard";
import CourseCard from "../../component/MiniDashBoard/CourseCard";
import RecentActivity from "../../component/MiniDashBoard/RecentActivity";

const getAssignmentColor = (days) => {
  if (days <= 3) return "red";
  if (days <= 7) return "yellow";
  return "green";
};

const formatDueDate = (dateString) => {
  if (!dateString) return "";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

const formatHistoryDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month} • ${hours}:${minutes}`;
};

const StudentDashBoard = () => {
  const currentUser = useSelector(selectUser);
  const studentId = currentUser?.userId;

  const {
    data: assignmentData,
    isLoading: isLoadingAssign,
    isError: isErrorAssign,
  } = useQuery({
    queryKey: ["studentAssignments", studentId],
    queryFn: () => assignmentService.getStudentAssignments(studentId),
    enabled: !!studentId,
  });

  const { data: reviewHistoryData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["completedReviews", studentId],
    queryFn: () => studentReviewService.getCompletedReviews(studentId),
    enabled: !!studentId,
  });

  const assignments = assignmentData?.data || [];
  const reviewHistory = reviewHistoryData?.data || [];

  const MAX_ASSIGNMENTS_TO_SHOW = 5;
  const displayedAssignments = assignments.slice(0, MAX_ASSIGNMENTS_TO_SHOW);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {currentUser?.firstName}!{" "}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Assignments are about to expire
                </h2>
                {assignments.length > MAX_ASSIGNMENTS_TO_SHOW && (
                  <Link
                    to="/my-assignments"
                    className="text-sm font-semibold text-orange-600 flex items-center"
                  >
                    Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                )}
              </div>
              <div>
                {isLoadingAssign && (
                  <p className="text-gray-500 text-sm">
                    Loading assignments...
                  </p>
                )}
                {isErrorAssign && (
                  <p className="text-red-500 text-sm">
                    Could not fetch assignments.
                  </p>
                )}

                {!isLoadingAssign &&
                !isErrorAssign &&
                displayedAssignments.length > 0
                  ? displayedAssignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.assignmentId}
                        color={getAssignmentColor(assignment.daysUntilDeadline)}
                        title={assignment.title}
                        subject={assignment.courseName}
                        dueDate={formatDueDate(assignment.deadline)}
                        remaining={`${assignment.daysUntilDeadline} days`}
                      />
                    ))
                  : !isLoadingAssign && (
                      <p className="text-gray-500 text-sm">
                        No upcoming assignments.
                      </p>
                    )}
              </div>
            </div>

            <RecentActivity />
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick action
              </h2>
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
                <h2 className="text-xl font-bold text-gray-800">
                  Peer Review History
                </h2>
                <Bell className="text-orange-600 w-5 h-5 cursor-pointer hover:text-orange-700" />
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {isLoadingHistory ? (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-gray-500">
                      Loading history...
                    </span>
                  </div>
                ) : reviewHistory.length > 0 ? (
                  reviewHistory.map((review) => (
                    <div
                      key={review.reviewAssignmentId}
                      className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="font-semibold text-gray-800 text-sm truncate pr-2 w-3/4"
                          title={review.assignmentTitle}
                        >
                          {review.assignmentTitle}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center ${
                            review.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit mb-1">
                            {review.sectionCode}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatHistoryDate(review.assignedAt)}
                          </div>
                        </div>

                        {/* Icon trạng thái góc phải dưới */}
                        <div>
                          {review.status === "Completed" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">
                      No review history found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800">Your class</h2>
          <p className="text-gray-600 mb-4">The classes you are taking</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              title="Mobile App Development"
              code="PRM391"
              teacher="Nguyễn Văn A"
              students={45}
              campus="Hồ Chí Minh"
            />
            <CourseCard
              title="Database Design"
              code="DBI202"
              teacher="Trần Thị B"
              students={38}
              campus="Hồ Chí Minh"
            />
            <CourseCard
              title="Software Engineering"
              code="SWE201"
              teacher="Lê Văn C"
              students={42}
              campus="Hồ Chí Minh"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashBoard;
