import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RightOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  StopOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { assignmentService } from "../../service/assignmentService";
import { reviewService } from "../../service/reviewService";
import { studentReviewService } from "../../service/studentReviewService";

import SubmissionGuideCard from "../../component/Submission/SubmissionGuideCard";
import SubmissionCard from "../../component/Submission/SubmissionCard";
import PeerReviewCard from "../../component/Submission/PeerReviewCard";
import RubricCard from "../../component/Submission/RubricCard";
import CrossClassReviewCard from "@/component/Submission/CrossClassReviewCard";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

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

const getAssignmentStyles = (status) => {
  switch (status) {
    case "Active":
      return {
        card: "bg-green-50 border-green-200",
        badge: "bg-green-100 text-green-700",
        icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#22c55e' }} />,
      };
    case "Closed":
      return {
        card: "bg-red-50 border-red-200",
        badge: "bg-red-100 text-red-700",
        icon: <CloseCircleOutlined style={{ fontSize: '24px', color: '#ef4444' }} />,
      };
    case "InReview":
      return {
        card: "bg-yellow-50 border-yellow-200",
        badge: "bg-yellow-100 text-yellow-700",
        icon: <EyeOutlined style={{ fontSize: '24px', color: '#eab308' }} />,
      };
    case "Upcoming":
      return {
        card: "bg-blue-50 border-blue-200",
        badge: "bg-blue-100 text-blue-700",
        icon: <InfoCircleOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      };
    case "Cancelled":
      return {
        card: "bg-gray-100 border-gray-300",
        badge: "bg-gray-200 text-gray-600",
        icon: <StopOutlined style={{ fontSize: '24px', color: '#6b7280' }} />,
      };
    case "Draft":
      return {
        card: "bg-gray-100 border-gray-300",
        badge: "bg-gray-200 text-gray-600",
        icon: <EditOutlined style={{ fontSize: '24px', color: '#6b7280' }} />,
      };
    default:
      return {
        card: "bg-gray-50 border-gray-200",
        badge: "bg-gray-100 text-gray-700",
        icon: <InfoCircleOutlined style={{ fontSize: '24px', color: '#6b7280' }} />,
      };
  }
};

const StudentSubmitAssignmentPage = () => {
  const { courseId, assignmentId } = useParams();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.user);
  const userId = currentUser?.userId;

  const handleSubmissionSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["assignmentDetails", assignmentId],
    });
    queryClient.invalidateQueries({
      queryKey: ["submissionStatus", assignmentId, userId],
    });
    queryClient.invalidateQueries({
      queryKey: ["reviewTracking", assignmentId],
    });
  };

  const {
    data: assignment,
    isLoading: isLoadingAssignment,
    isError: isAssignmentError,
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

  const { data: reviewTrackingData, isLoading: isLoadingReview } = useQuery({
    queryKey: ["reviewTracking", assignmentId],
    queryFn: () => reviewService.getStudentReviewTracking(assignmentId),
    enabled: !!assignmentId && !!assignment && assignment.peerWeight > 0,
  });

  if (isLoadingAssignment || isLoadingSubmission) {
    return <div className="text-center p-8">Loading data...</div>;
  }

  if (isAssignmentError || !assignment) {
    return (
      <div className="text-center p-8 text-red-500">
        The assignment information could not be loaded. Please try again.
      </div>
    );
  }

  const statusStyle = getAssignmentStyles(assignment.status);

  const completedReviews = reviewTrackingData?.data?.completedReviewsCount ?? 0;
  const requiredReviews =
    reviewTrackingData?.data?.numPeerReviewsRequired ??
    assignment.numPeerReviewsRequired;
  const reviewDeadline =
    reviewTrackingData?.data?.reviewDeadline || assignment.reviewDeadline;

  const isReviewOpen = reviewTrackingData?.data?.status === "InReview";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breadcrumbs */}
        <motion.div
          className="mb-6 flex items-center text-sm text-gray-600"
          variants={itemVariants}
        >
          <Link to="/my-assignments" className="hover:underline">
            My Assignments
          </Link>
          <RightOutlined style={{ fontSize: '16px', margin: '0 4px' }} />
          <Link to={`/assignment/${courseId}`} className="hover:underline">
            {assignment.sectionCode}
          </Link>
          <RightOutlined style={{ fontSize: '16px', margin: '0 4px' }} />
          <span className="font-semibold text-gray-800 truncate max-w-xs">
            {assignment.title}
          </span>
        </motion.div>

        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <p className="text-blue-600 font-semibold">
            {assignment.sectionCode}
          </p>
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 typing-animation">
            {assignment.courseName}
          </h1>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <motion.div
              className={`p-6 rounded-lg border ${statusStyle.card}`}
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
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
                {assignment.status && (
                  <div
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyle.badge}`}
                  >
                    {assignment.status}
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-4 ml-10">
                <div className="flex items-center">
                  <ClockCircleOutlined style={{ fontSize: '16px', marginRight: '6px' }} />
                  Deadline:{" "}
                  <span className="font-semibold ml-1">
                    {formatDate(assignment.deadline)}
                  </span>
                </div>
                <div className="flex items-center">
                  <BarChartOutlined style={{ fontSize: '16px', marginRight: '6px' }} />
                  Weight:{" "}
                  <span className="font-semibold ml-1">{`${
                    assignment.instructorWeight + assignment.peerWeight
                  }%`}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="mt-4 ml-10 pt-4 border-t border-gray-300">
                <p className="font-semibold mb-2 text-gray-800">Detail:</p>
                <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
                  {assignment.guidelines}
                </p>
                
                {/* File Information */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Attach file: </span>
                    {assignment.fileName ? (
                      <span className="text-blue-600">{assignment.fileName}</span>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {assignment.previewUrl ? (
                    <a
                      href={assignment.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm"
                    >
                      <InfoCircleOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                      View Detail
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-400 font-semibold rounded-md cursor-not-allowed text-sm"
                    >
                      <InfoCircleOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                      View Detail
                    </button>
                  )}
                  {assignment.fileUrl ? (
                    <a
                      href={assignment.fileUrl}
                      download={assignment.fileName || 'attachment'}
                      className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm"
                    >
                      <DownloadOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                      Download
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 text-gray-400 font-semibold rounded-md cursor-not-allowed text-sm"
                    >
                      <DownloadOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <RubricCard assignmentId={assignmentId} />
            </motion.div>
          </motion.div>

          {/* Right Column: Submission Status */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.h2
              className="text-xl font-bold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Submit and Grading
            </motion.h2>
            <motion.div variants={cardVariants}>
              <SubmissionGuideCard />
            </motion.div>
            {userId && (
              <motion.div variants={cardVariants}>
                <SubmissionCard
                  initialSubmission={submission}
                  assignmentId={assignmentId}
                  userId={userId}
                  assignmentStatus={assignment.status}
                  onSubmissionSuccess={handleSubmissionSuccess}
                />
              </motion.div>
            )}
            {assignment.peerWeight > 0 && (
              <>
                {isLoadingReview ? (
                  <p className="text-center p-4">
                    Loading cross-marking status...
                  </p>
                ) : (
                  <motion.div className="space-y-6" variants={containerVariants}>
                    <motion.div variants={cardVariants}>
                      <PeerReviewCard
                        completed={completedReviews}
                        required={requiredReviews}
                        reviewDeadline={reviewDeadline}
                        isReviewOpen={isReviewOpen}
                      />
                    </motion.div>

                    {isReviewOpen && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <CrossClassReviewCard
                          assignmentId={assignmentId}
                          courseId={courseId}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
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

export default StudentSubmitAssignmentPage;
