import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  BarChart2,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
} from "lucide-react";

// Import service
import { assignmentService } from "../../service/assignmentService";
import { reviewService } from "../../service/reviewService";
import SubmissionGuideCard from "../../component/Submission/SubmissionGuideCard";
import SubmissionCard from "../../component/Submission/SubmissionCard";
import PeerReviewCard from "../../component/Submission/PeerReviewCard";
import RubricCard from "../../component/Submission/RubricCard";
import { studentReviewService } from "../../service/studentReviewService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

// Hàm helper để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

const StudentSubmitAssignmentPage = () => {
  const { courseId, assignmentId } = useParams();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.user);
  const userId = currentUser?.userId;

  const [hasSubmitted, setHasSubmitted] = useState(true); // Tạm thời

  const handleSubmissionSuccess = () => {
    // Invalidate tất cả các query liên quan để làm mới dữ liệu
    queryClient.invalidateQueries({ queryKey: ["assignmentDetails", assignmentId] });
    queryClient.invalidateQueries({ queryKey: ["submissionStatus", assignmentId, userId] });
    queryClient.invalidateQueries({ queryKey: ["reviewTracking", assignmentId] });
    setHasSubmitted(true);
  };

  const {
    data: assignment,
    isLoading: isLoadingAssignment,
    isError: isAssignmentError, // <-- FIX 1: Thêm isError và đổi tên nó thành isAssignmentError
  } = useQuery({
    queryKey: ["assignmentDetails", assignmentId],
    queryFn: () => assignmentService.getAssignmentDetailsById(assignmentId),
    enabled: !!assignmentId,
  });

  const { data: submission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ["submissionStatus", assignmentId, userId],
    queryFn: () =>
      studentReviewService.getSubmissionByUserAndAssignment({
        assignmentId,
        userId,
      }),
    enabled: !!assignmentId && !!userId,
  });

  // <-- FIX 2: Thêm lại query bị thiếu cho reviewTrackingData
  const { data: reviewTrackingData, isLoading: isLoadingReview } = useQuery({
    queryKey: ["reviewTracking", assignmentId],
    queryFn: () => reviewService.getStudentReviewTracking(assignmentId),
    enabled: !!assignmentId && !!assignment && assignment.peerWeight > 0,
  });


  if (isLoadingAssignment || isLoadingSubmission) {
    return <div className="text-center p-8">Đang tải dữ liệu...</div>;
  }

  if (isAssignmentError || !assignment) {
    return (
      <div className="text-center p-8 text-red-500">
        Không thể tải thông tin bài tập. Vui lòng thử lại.
      </div>
    );
  }

  const completedReviews = reviewTrackingData?.data?.completedReviewsCount ?? 0;
  const requiredReviews =
    reviewTrackingData?.data?.numPeerReviewsRequired ??
    assignment.numPeerReviewsRequired;

  const reviewDeadline =
    reviewTrackingData?.data?.reviewDeadline || assignment.reviewDeadline;

  const isReviewOpen = new Date() > new Date(assignment.deadline);

  
  const getStatusStyle = (daysLeft) => {
    if (daysLeft <= 5) {
      return {
        card: "bg-red-50 border-red-200",
        badge: "bg-red-100 text-red-700",
        badgeText: "Sắp hết hạn",
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      };
    }
    if (daysLeft > 7) {
      return {
        card: "bg-yellow-50 border-yellow-200",
        badge: "bg-yellow-100 text-yellow-700",
        badgeText: "Lưu ý thời gian",
        icon: <Clock className="w-6 h-6 text-yellow-500" />,
      };
    }
    return {
      card: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      badgeText: "Đang mở",
      icon: <Info className="w-6 h-6 text-blue-500" />,
    };
  };

  const statusStyle = getStatusStyle(assignment.daysUntilDeadline);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/my-assignments" className="hover:underline">
            My Assigment
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to={`/assignment/${courseId}`} className="hover:underline">
            {assignment.sectionCode}
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800 truncate max-w-xs">
            {assignment.title}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-600 font-semibold">
            {assignment.sectionCode}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {assignment.courseName}
          </h1>
          <p className="text-gray-500 mt-1">Instuctor: N/A</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Assignment Details */}
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-lg border ${statusStyle.card}`}>
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="mr-4">{statusStyle.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {assignment.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyle.badge}`}
                >
                  {statusStyle.badgeText}
                </div>
              </div>

              {/* Card Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4 ml-10">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Deadline:{" "}
                  <span className="font-semibold ml-1">
                    {formatDate(assignment.deadline)}
                  </span>
                  {assignment.daysUntilDeadline <= 5 && (
                    <span className="text-red-600 ml-2">
                      (Còn {assignment.daysUntilDeadline} ngày)
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1.5" />
                  Weight:{" "}
                  <span className="font-semibold ml-1">{`${
                    (assignment.instructorWeight + assignment.peerWeight) * 100
                  }%`}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="mt-4 ml-10 pt-4 border-t border-gray-300">
                <p className="font-semibold mb-2">Detail:</p>
                <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                  {assignment.guidelines}
                </p>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
                    <Info className="w-4 h-4 mr-2" />
                    View Detail
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download attach file
                  </button>
                </div>
              </div>
            </div>
            <RubricCard assignmentId={assignmentId} />
          </div>

          {/* Right Column: Submission Status */}
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              Submit and Grading
            </h2>
            <SubmissionGuideCard />

            {/* Truyền các props mới vào SubmissionCard */}
            {userId && (
              <SubmissionCard
                initialSubmission={submission} // Prop mới chứa thông tin bài nộp
                assignmentId={assignmentId}
                userId={userId}
                onSubmissionSuccess={handleSubmissionSuccess}
              />
            )}
            {assignment.peerWeight > 0 && (
              <>
                {isLoadingReview ? (
                  <p className="text-center p-4">
                    Đang tải trạng thái chấm chéo...
                  </p>
                ) : (
                  <PeerReviewCard
                    completed={completedReviews}
                    required={requiredReviews}
                    reviewDeadline={reviewDeadline}
                    isReviewOpen={isReviewOpen}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmitAssignmentPage;