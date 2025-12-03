import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  FileText,
  Calendar,
  Tag,
  ExternalLink,
  ChevronLeft,
  Clock,
  Edit,
} from "lucide-react";

import { studentReviewService } from "../../service/studentReviewService";
import { assignmentService } from "../../service/assignmentService";
import GradingModal from "@/component/MiniDashBoard/GradingModal";

const PeerReviewHistoryPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = useSelector((state) => state.user);
  const userId = currentUser?.userId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["completedReviewsHistory", assignmentId],
    queryFn: () =>
      studentReviewService.getCompletedReviewsByAssignment(assignmentId),
    enabled: !!assignmentId,
  });

  const { data: assignmentInfo, isLoading: isLoadingAssignment } = useQuery({
    queryKey: ["assignmentDetails", assignmentId],
    queryFn: () => assignmentService.getAssignmentDetailsById(assignmentId),
    enabled: !!assignmentId,
  });

  const displayInfo = {
    courseCode:
      historyData?.data?.[0]?.courseCode ||
      assignmentInfo?.courseCode ||
      assignmentInfo?.courseName ||
      "N/A",
    sectionCode:
      historyData?.data?.[0]?.sectionCode || assignmentInfo?.sectionCode || "N/A",
    assignmentTitle:
      historyData?.data?.[0]?.assignmentTitle || assignmentInfo?.title || "N/A",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegradeClick = (reviewAssignmentId) => {
    setSelectedReviewId(reviewAssignmentId);
    setIsModalOpen(true);
  };

  const handleRegradeSuccess = () => {
    queryClient.invalidateQueries(["completedReviewsHistory", assignmentId]);
    setIsModalOpen(false);
    setSelectedReviewId(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-orange-600 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Assignment
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <Clock className="w-7 h-7 mr-3 text-orange-600" />
            Peer Review History
          </h1>

          {isLoadingAssignment && !historyData ? (
            <div className="h-12 w-full max-w-2xl bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm w-fit">
              
              <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">Course:</span>
                <span className="text-blue-700 font-bold text-base">
                  {displayInfo.courseCode}
                </span>
              </div>

              <div className="hidden sm:block h-5 w-px bg-gray-300"></div>

              <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">Section:</span>
                <span className="text-gray-900 font-bold text-base">
                  {displayInfo.sectionCode}
                </span>
              </div>

              <div className="hidden sm:block h-5 w-px bg-gray-300"></div>

              <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">Assignment:</span>
                <span 
                  className="text-gray-800 font-semibold text-base truncate max-w-xs sm:max-w-md" 
                  title={displayInfo.assignmentTitle}
                >
                  {displayInfo.assignmentTitle}
                </span>
              </div>

            </div>
          )}
        </div>
       
        {isLoadingHistory && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-3 text-gray-500">Loading history...</p>
          </div>
        )}

        {isHistoryError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            Failed to load review history. Please try again later.
          </div>
        )}

        {!isLoadingHistory && !isHistoryError && historyData?.data?.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              You haven't completed any reviews for this assignment yet.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {historyData?.data?.map((item) => (
            <div
              key={item.reviewAssignmentId}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3 min-w-[40px]">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="overflow-hidden">
                    <h3
                      className="font-semibold text-gray-800 line-clamp-2 break-words"
                      title={item.fileName}
                    >
                      {item.fileName || "Untitled Document"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <Tag className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium truncate max-w-full">
                    {item.keywords || "No keywords"}
                  </span>
                </div>

                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>Assigned: {formatDate(item.assignedAt)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    File
                  </a>
                ) : (
                  <button
                    disabled
                    className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed text-center"
                  >
                    No File
                  </button>
                )}

                <button
                  onClick={() => handleRegradeClick(item.reviewAssignmentId)}
                  className="flex items-center justify-center px-3 py-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Regrade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedReviewId && (
        <GradingModal
          reviewAssignmentId={selectedReviewId}
          reviewerId={userId}
          status="Completed"
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleRegradeSuccess}
        />
      )}
    </div>
  );
};

export default PeerReviewHistoryPage;