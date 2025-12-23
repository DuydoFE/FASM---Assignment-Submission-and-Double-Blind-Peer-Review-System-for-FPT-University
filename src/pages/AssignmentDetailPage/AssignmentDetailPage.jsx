import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RightOutlined,
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FilterOutlined,
  HomeOutlined,
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

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
    inReview: assignments.filter((a) => a.status === "InReview").length,
    active: assignments.filter((a) => a.status === "Active").length,
    closed: assignments.filter((a) => a.status === "Closed").length,
  };

  if (isLoading || isLoadingCourseInstance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-lg font-semibold text-gray-700">Loading class data...</p>
        </motion.div>
      </div>
    );
  }

  if (isError || isErrorCourseInstance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-2xl border-2 border-red-300"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WarningOutlined className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">The exercise list could not be loaded.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center text-sm"
        >
          <Link
            to="/my-assignments"
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 font-medium group"
          >
            <HomeOutlined className="text-base group-hover:scale-110 transition-transform" />
            <span className="text-sm">My Assignments</span>
          </Link>
          <RightOutlined className="text-gray-400 mx-2 text-xs" />
          <span className="font-medium text-gray-700 text-sm">
            {courseInstanceData?.courseCode || courseId} - {courseInstanceData?.courseName}
          </span>
        </motion.div>

        {/* Header */}
        {courseInstanceData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 overflow-hidden relative"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -ml-32 -mb-32"></div>

              <div className="relative z-10 flex justify-between items-start flex-wrap gap-6">
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-blue-600 font-semibold text-base flex items-center gap-2">
                        {courseInstanceData.courseCode}
                        {courseInstanceData.campusName && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400 text-sm font-medium">{courseInstanceData.campusName}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-medium text-gray-900 mb-3"
                  >
                    {courseInstanceData.courseName}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center gap-3 flex-wrap"
                  >
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      {courseInstanceData.courseCode}
                    </span>
                    <div className="flex items-center gap-2">
                      <ClockCircleOutlined className="text-gray-500 text-sm" />
                      <span className="text-sm text-gray-600">
                        Year: {new Date(courseInstanceData.startDate).getFullYear()}
                      </span>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full border border-green-200 shadow-sm"
                >
                  <CheckCircleOutlined className="text-lg" />
                  <span className="font-semibold">Enrolled</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Grid */}
       <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatCard
              icon={BookOutlined}
              value={stats.total}
              label="All assignments"
              color="blue"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatCard
              icon={CheckCircleOutlined}
              value={stats.inReview}
              label="In Review"
              color="green"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatCard
              icon={ClockCircleOutlined}
              value={stats.closed}
              label="Closed"
              color="red"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatCard
              icon={WarningOutlined}
              value={stats.active}
              label="Active"
              color="yellow"
            />
          </motion.div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-blue-50 rounded-lg"
              >
                <FilterOutlined className="text-xl text-blue-600" />
              </motion.div>
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
        </motion.div>

        {/* Assignments List */}
        <AnimatePresence mode="wait">
          {filteredAssignments.length > 0 ? (
            <div className="space-y-6">
              {filteredAssignments.map((assignment, index) => (
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
              ))}
            </div>
          ) : (
            <div className="text-center bg-gray-50 p-16 rounded-xl border-2 border-dashed border-gray-300 scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOutlined className="text-4xl text-gray-400" />
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
        </AnimatePresence>
      </div>

      <style jsx>{`
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

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

export default AssignmentDetailPage;
