import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Calendar,
  Tag,
  ExternalLink,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { studentReviewService } from "../../service/studentReviewService";

const PeerReviewHistoryPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const {
    data: historyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedReviewsHistory", assignmentId],
    queryFn: () =>
      studentReviewService.getCompletedReviewsByAssignment(assignmentId),
    enabled: !!assignmentId,
  });

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

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Assignment
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="w-7 h-7 mr-3 text-orange-600" />
          Peer Review History
        </h1>

        {isLoading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-3 text-gray-500">Loading history...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            Failed to load review history. Please try again later.
          </div>
        )}

        {!isLoading && !isError && historyData?.data?.length === 0 && (
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
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-gray-800 line-clamp-2"
                      title={item.fileName}
                    >
                      {item.fileName || "Untitled Document"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium truncate max-w-[200px]">
                    {item.keywords || "No keywords"}
                  </span>
                </div>

                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Assigned: {formatDate(item.assignedAt)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Submission File
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed"
                  >
                    File Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeerReviewHistoryPage;
