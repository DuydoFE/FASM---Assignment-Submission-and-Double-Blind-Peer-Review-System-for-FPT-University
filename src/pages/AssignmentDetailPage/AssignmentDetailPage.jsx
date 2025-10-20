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
import { assignmentService } from "../../service/assignmentService";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../../service/reviewService";

import PeerReviewInfoCard from "../../component/Assignment/PeerReviewInfoCard";

const AssignmentDetailPage = () => {
  const { courseId } = useParams();

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

  const courseInfo =
    assignments.length > 0
      ? {
          code: assignments[0].sectionCode,
          title: assignments[0].courseName,
          subject: assignments[0].courseCode,
          campus: assignments[0].campusName,
          year: new Date(assignments[0].createdAt).getFullYear().toString(),
          instructor: "N/A",
        }
      : null;

  const stats = {
    total: assignments.length,
    submitted: assignments.filter((a) => a.submissionStatus === "Submitted")
      .length,
    dueSoon: assignments.filter((a) => a.daysUntilDeadline <= 3 && !a.isOverdue)
      .length,
    warning: assignments.filter(
      (a) => a.daysUntilDeadline > 3 && a.daysUntilDeadline <= 7
    ).length,
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
                  <span>Intructor: {courseInfo.instructor}</span>
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

        {/* Stats Grid - Dùng dữ liệu động */}
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

        {/* Filter and Sort */}
        <div className="bg-white p-4 rounded-lg border flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Status:
              </label>
              <select
                id="status-filter"
                className="p-2 border border-gray-300 rounded-md"
              >
                <option>All</option>
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
