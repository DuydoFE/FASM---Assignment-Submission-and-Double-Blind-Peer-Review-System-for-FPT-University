import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  BookCopy,
  CheckCircle,
  AlertTriangle,
  Filter,
} from "lucide-react";
import StatCard from "../../component/Assignment/StatCard";
import AssignmentCard from "../../component/Assignment/AssignmentCard";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../../service/reviewService";

import PeerReviewInfoCard from "../../component/Assignment/PeerReviewInfoCard";

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

  const courseInfo =
    assignments.length > 0
      ? {
          code: assignments[0].sectionCode,
          title: assignments[0].courseName,
          subject: assignments[0].courseCode,
          campus: assignments[0].campusName,
          year: new Date(assignments[0].createdAt).getFullYear().toString(),
          instructor: assignments[0].fullName,
        }
      : null;

  const stats = {
    total: assignments.length,
    submitted: assignments.filter((a) => a.submissionStatus === "Submitted").length,
    dueSoon: assignments.filter((a) => a.daysUntilDeadline <= 3 && !a.isOverdue).length,
    warning: assignments.filter((a) => a.daysUntilDeadline > 3 && a.daysUntilDeadline <= 7).length,
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading class data...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        The exercise list could not be loaded.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/my-assignments" className="hover:underline">
            My Assignments
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">
            {courseInfo?.code || courseId}
          </span>
        </div>

        {/* Header */}
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
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>Years: {courseInfo.year}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
                <CheckCircle size={14} className="mr-1.5" />
                Participated
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BookCopy}
            value={stats.total}
            label="All assignments"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            value={stats.submitted}
            label="Submitted"
            color="green"
          />
          <StatCard
            icon={Clock}
            value={stats.dueSoon}
            label="About to expire"
            color="red"
          />
          <StatCard
            icon={AlertTriangle}
            value={stats.warning}
            label="Note the time"
            color="yellow"
          />
        </div>

        {/* Filter Section Updated */}
        <div className="bg-white p-4 rounded-lg border flex flex-col md:flex-row justify-between items-center mb-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-700">Filter Assignments</h3>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <div className="flex items-center">
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Status:
              </label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-64 pl-3 pr-10 py-2 text-base text-gray-900 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
              >
                {ASSIGNMENT_STATUSES.map((statusItem) => (
                  <option key={statusItem.value} value={statusItem.value}>
                    {statusItem.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-500 whitespace-nowrap">
              Result: <span className="font-medium text-gray-900">{filteredAssignments.length}</span> / {assignments.length}
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <div key={assignment.assignmentId}>
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
            <div className="text-center bg-white p-12 rounded-lg border">
              <h3 className="text-xl font-semibold">No assignments found</h3>
              <p className="text-gray-600">
                {assignments.length > 0 
                  ? `No assignments found with status "${ASSIGNMENT_STATUSES.find(s => s.value === filterStatus)?.label}".`
                  : "There are currently no assignments assigned to this class."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;