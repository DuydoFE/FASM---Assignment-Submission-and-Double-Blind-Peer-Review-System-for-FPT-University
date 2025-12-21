import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  RightOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import StatCard from "../../component/Assignment/StatCard";
import AssignmentCard from "../../component/Assignment/AssignmentCard";
import PeerReviewInfoCard from "../../component/Assignment/PeerReviewInfoCard";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../../service/reviewService";
import { getCourseInstanceById } from "../../service/courseInstanceService";

const ASSIGNMENT_STATUSES = [
  { value: "All", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "InReview", label: "InReview" },
  { value: "GradesPublished", label: "GradesPublished" },
  { value: "Closed", label: "Closed" },
  { value: "Cancelled", label: "Cancelled" },
];

const AssignmentDetailPage = () => {
  const { courseId } = useParams();
  const [filterStatus, setFilterStatus] = useState("All");

  const {
    data: courseInstanceData,
    isLoading: isLoadingCourseInstance,
    isError: isErrorCourseInstance,
  } = useQuery({
    queryKey: ["courseInstance", courseId],
    queryFn: () => getCourseInstanceById(courseId),
    enabled: !!courseId,
  });

  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignmentsWithTracking", courseId],
    queryFn: () => reviewService.getAssignmentsWithTracking(courseId),
    enabled: !!courseId,
  });

  const assignments = responseData?.data || [];

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === "All") return true;
    return assignment.status === filterStatus;
  });

  const stats = {
    total: assignments.length,
    submitted: assignments.filter((a) => a.submissionStatus === "Submitted").length,
    dueSoon: assignments.filter((a) => a.daysUntilDeadline <= 3 && !a.isOverdue).length,
    warning: assignments.filter((a) => a.daysUntilDeadline > 3 && a.daysUntilDeadline <= 7).length,
  };

  if (isLoading || isLoadingCourseInstance) {
    return <div className="text-center p-8">Loading class data...</div>;
  }

  if (isError || isErrorCourseInstance) {
    return (
      <div className="text-center p-8 text-red-500">
        The exercise list could not be loaded.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-600 fade-in-down">
          <Link
            to="/my-assignments"
            className="hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            My Assignments
          </Link>
          <RightOutlined style={{ fontSize: '16px', margin: '0 8px', color: '#9ca3af' }} />
          <span className="font-semibold text-gray-800">
            {courseInstanceData?.courseCode || courseId} - {courseInstanceData?.courseName}
          </span>
        </div>

        {/* Header */}
        {courseInstanceData && (
          <div className="mb-8 scale-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                    <p className="text-blue-600 font-semibold text-lg">
                      {courseInstanceData.courseCode}
                      {courseInstanceData.campusName && <span className="text-gray-400 ml-2">• {courseInstanceData.campusName}</span>}
                    </p>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-3 typing-animation">
                    {courseInstanceData.courseName}
                  </h1>
                  <div className="flex items-center text-gray-600 space-x-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                      {courseInstanceData.courseCode}
                    </span>
                    <div className="flex items-center">
                      <ClockCircleOutlined style={{ fontSize: '16px', marginRight: '6px', color: '#9ca3af' }} />
                      <span className="text-sm">Year: {new Date(courseInstanceData.startDate).getFullYear()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full border border-green-200 shadow-sm">
                  <CheckCircleOutlined style={{ fontSize: '18px' }} />
                  <span className="font-semibold">Enrolled</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="fade-in-up" style={{ animationDelay: "0.15s" }}>
            <StatCard
              icon={BookOutlined}
              value={stats.total}
              label="All assignments"
              color="blue"
            />
          </div>
          <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            <StatCard
              icon={CheckCircleOutlined}
              value={stats.submitted}
              label="Submitted"
              color="green"
            />
          </div>
          <div className="fade-in-up" style={{ animationDelay: "0.25s" }}>
            <StatCard
              icon={ClockCircleOutlined}
              value={stats.dueSoon}
              label="About to expire"
              color="red"
            />
          </div>
          <div className="fade-in-up" style={{ animationDelay: "0.3s" }}>
            <StatCard
              icon={WarningOutlined}
              value={stats.warning}
              label="Note the time"
              color="yellow"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm mb-6 slide-in-left" style={{ animationDelay: "0.35s" }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FilterOutlined style={{ fontSize: '20px', color: '#2563eb' }} />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Filter Assignments</h3>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center flex-1 md:flex-initial">
                <label
                  htmlFor="status-filter"
                  className="text-sm font-medium text-gray-700 mr-3 whitespace-nowrap"
                >
                  Status:
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full md:w-64 pl-4 pr-10 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {ASSIGNMENT_STATUSES.map((statusItem) => (
                    <option key={statusItem.value} value={statusItem.value}>
                      {statusItem.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg whitespace-nowrap">
                Result: <span className="font-semibold text-blue-600">{filteredAssignments.length}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="font-medium">{assignments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment, index) => (
              <div
                key={assignment.assignmentId}
                className="fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.08}s` }}
              >
                <AssignmentCard assignment={assignment} courseId={courseId} />
                {assignment.peerWeight > 0 && (
                  <PeerReviewInfoCard
                    completed={assignment.completedReviewsCount}
                    required={assignment.numPeerReviewsRequired}
                    courseId={courseId}
                    assignmentId={assignment.assignmentId}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center bg-gray-50 p-16 rounded-xl border-2 border-dashed border-gray-300 scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOutlined style={{ fontSize: '32px', color: '#9ca3af' }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No assignments found</h3>
                <p className="text-gray-600">
                  {assignments.length > 0
                    ? `No assignments found with status "${ASSIGNMENT_STATUSES.find(s => s.value === filterStatus)?.label}".`
                    : "There are currently no assignments assigned to this class."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fade-in-down {
          animation: fadeInDown 0.5s ease-out;
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out backwards;
        }

        .slide-in-left {
          animation: slideInLeft 0.5s ease-out backwards;
        }

        @keyframes typing {
          0% {
            width: 0;
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          50% {
            width: 100%;
            opacity: 1;
          }
          90% {
            width: 100%;
            opacity: 1;
          }
          100% {
            width: 0;
            opacity: 0;
          }
        }

        .typing-animation {
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
          animation: typing 6s steps(40, end) infinite;
        }
      `}</style>
    </div>
  );
};

export default AssignmentDetailPage;