import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Upload,
  FileText,
  Calendar,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  PlayCircle,
  RefreshCw,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

import { selectUser } from "../../redux/features/userSlice";
import { assignmentService } from "../../service/assignmentService";
import { studentReviewService } from "../../service/studentReviewService";

import AssignmentCard from "../../component/MiniDashBoard/AssignmentCard";
import RecentActivity from "../../component/MiniDashBoard/RecentActivity";
import GradingModal from "../../component/MiniDashBoard/GradingModal";
import ViewAllScore from "../../component/MiniDashBoard/ViewAllScore";
import AssignmentSchedule from "../../component/MiniDashBoard/AssignmentSchedule";

const calculateDaysRemaining = (deadlineStr) => {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const diffTime = deadline - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const StudentDashBoard = () => {
  const currentUser = useSelector(selectUser);
  const studentId = currentUser?.userId;
  const queryClient = useQueryClient();

  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [selectedReviewStatus, setSelectedReviewStatus] = useState(null);

  const handleOpenModal = (reviewId, status) => {
    setSelectedReviewId(reviewId);
    setSelectedReviewStatus(status);
  };

  const handleCloseModal = () => {
    setSelectedReviewId(null);
    setSelectedReviewStatus(null);
  };

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

  const displayedAssignments = useMemo(() => {
    const now = new Date();

    return assignments
      .filter((assignment) => {
        const deadlineDate = new Date(assignment.deadline);

        return assignment.status === "Active" && deadlineDate > now;
      })
      .map((assignment) => {
        const daysLeft = calculateDaysRemaining(assignment.deadline);
        return {
          ...assignment,
          calculatedDays: daysLeft,
        };
      })
      .sort((a, b) => a.calculatedDays - b.calculatedDays)
      .slice(0, 5);
  }, [assignments]);

  const handleRefreshData = () => {
    queryClient.invalidateQueries(["completedReviews", studentId]);
  };

  // Calculate stats
  const completedReviews = reviewHistory.filter(r => r.status === "Completed").length;
  const pendingReviews = reviewHistory.filter(r => r.status === "Assigned").length;
  const activeAssignments = displayedAssignments.length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20 min-h-screen relative"
    >
      <main className="p-8">
        {/* Welcome Header with Animation */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2"
          >
            Welcome back, {currentUser?.firstName}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600"
          >
            Here's what's happening with your assignments today.
          </motion.p>
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Assignments Section */}
            <motion.div
              variants={cardVariants}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Assignments are about to expire
                </h2>
                {assignments.filter(
                  (a) =>
                    a.status === "Active" && new Date(a.deadline) > new Date()
                ).length > 5 && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/my-assignments"
                      className="text-sm font-semibold text-orange-600 flex items-center hover:text-orange-700 transition-colors"
                    >
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </motion.div>
                )}
              </div>
              <motion.div variants={containerVariants}>
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
                  ? displayedAssignments.map((assignment, index) => (
                      <motion.div
                        key={assignment.assignmentId}
                        variants={itemVariants}
                        custom={index}
                      >
                        <AssignmentCard
                          color={getAssignmentColor(assignment.calculatedDays)}
                          title={assignment.title}
                          subject={assignment.courseName}
                          dueDate={formatDueDate(assignment.deadline)}
                          remaining={`${assignment.calculatedDays} days`}
                        />
                      </motion.div>
                    ))
                  : !isLoadingAssign && (
                      <p className="text-gray-500 text-sm">
                        No upcoming active assignments.
                      </p>
                    )}
              </motion.div>
            </motion.div>

            <RecentActivity />
          </div>

          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              variants={cardVariants}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Quick action
              </h2>
              <div className="space-y-3">
                <ViewAllScore />
                <AssignmentSchedule studentId={studentId} />
              </div>
            </motion.div>

            {/* Peer Review History */}
            <motion.div
              variants={cardVariants}
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Peer Review History
                </h2>
                <motion.div whileHover={{ rotate: 15, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Bell className="text-orange-600 w-5 h-5 cursor-pointer" />
                </motion.div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {isLoadingHistory ? (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-gray-500">
                      Loading history...
                    </span>
                  </div>
                ) : reviewHistory.length > 0 ? (
                  reviewHistory.map((review, index) => (
                    <motion.div
                      key={review.reviewAssignmentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                      className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="font-semibold text-gray-800 text-sm truncate pr-2 w-3/4"
                          title={review.assignmentTitle}
                        >
                          {review.assignmentTitle}
                        </h3>
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center ${
                            review.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.status}
                        </motion.span>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit mb-1">
                            {review.sectionCode}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatHistoryDate(review.assignedAt)}
                          </div>
                        </div>

                        <div className="flex items-center">
                          {review.status === "Assigned" ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleOpenModal(
                                  review.reviewAssignmentId,
                                  "Assigned"
                                )
                              }
                              className="flex items-center text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors font-semibold"
                            >
                              <PlayCircle className="w-3 h-3 mr-1" />
                              Continue Grading
                            </motion.button>
                          ) : review.status === "Completed" ? (
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleOpenModal(
                                    review.reviewAssignmentId,
                                    "Completed"
                                  )
                                }
                                className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors font-semibold border border-gray-200"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Regrade
                              </motion.button>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                              >
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </motion.div>
                            </div>
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">
                      No review history found.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {selectedReviewId && (
          <GradingModal
            reviewAssignmentId={selectedReviewId}
            reviewerId={studentId}
            status={selectedReviewStatus}
            onClose={handleCloseModal}
            onSuccess={handleRefreshData}
          />
        )}
      </main>
    </motion.div>
  );
};

export default StudentDashBoard;
