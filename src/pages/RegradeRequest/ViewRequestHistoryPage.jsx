import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Scale,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  Calendar,
  MessageSquare,
  Edit,
  Eye,
  EyeOff,
  FileSearch,
} from "lucide-react";
import { Tag, Spin, Alert, Empty, Pagination, Card, Button } from "antd";
import { toast } from "react-toastify";

import { selectUser } from "../../redux/features/userSlice";
import { getRegradeRequestsByStudentId } from "../../service/regradeService";

import RequestRegradeDetailModal from "../../component/Assignment/RequestRegradeDetailModal";

export const StatusTag = ({ status }) => {
  switch (status) {
    case "Approved":
      return (
        <Tag icon={<CheckCircle className="w-4 h-4" />} color="success">
          Approved
        </Tag>
      );
    case "Rejected":
      return (
        <Tag icon={<XCircle className="w-4 h-4" />} color="error">
          Rejected
        </Tag>
      );
    case "Pending":
      return (
        <Tag icon={<Clock className="w-4 h-4" />} color="processing">
          Pending
        </Tag>
      );
    default:
      return (
        <Tag icon={<HelpCircle className="w-4 h-4" />} color="default">
          Unknown
        </Tag>
      );
  }
};

const StatCard = ({ count }) => (
  <Card className="shadow-lg border-l-4 border-orange-500 mb-8">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-orange-100 rounded-full">
        <Scale className="w-8 h-8 text-orange-600" />
      </div>
      <div>
        <p className="text-gray-500 font-medium">Total Regrade Requests</p>
        <p className="text-3xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  </Card>
);

const ViewRequestHistoryPage = () => {
  const user = useSelector(selectUser);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [visibilityState, setVisibilityState] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async (studentId, page = 1, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const apiResponse = await getRegradeRequestsByStudentId(studentId, {
        pageNumber: page,
        pageSize: size,
      });

      if (apiResponse && apiResponse.data) {
        setRequests(apiResponse.data.requests);
        setPagination({
          pageNumber: apiResponse.data.pageNumber,
          pageSize: apiResponse.data.pageSize,
          totalCount: apiResponse.data.totalCount,
        });
      } else {
        setRequests([]);
        setPagination((prev) => ({ ...prev, totalCount: 0 }));
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const studentId = user?.userId;
    if (studentId) {
      fetchRequests(studentId, pagination.pageNumber, pagination.pageSize);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handlePageChange = (page, pageSize) => {
    const studentId = user?.userId;
    if (studentId) {
      fetchRequests(studentId, page, pageSize);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const toggleVisibility = (requestId, field) => {
    setVisibilityState((prev) => {
      const currentVisibility = prev[requestId] || {
        fileName: false,
        reason: false,
      };
      return {
        ...prev,
        [requestId]: {
          ...currentVisibility,
          [field]: !currentVisibility[field],
        },
      };
    });
  };

  const showDetailModal = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center p-12">
          <Spin size="large" />
        </div>
      );
    }
    if (error) {
      return (
        <Alert message="Error" description={error} type="error" showIcon />
      );
    }
    if (!requests || requests.length === 0) {
      return (
        <Empty description="You have not made any regrade requests yet." />
      );
    }
    return (
      <>
        <div className="space-y-6">
          {requests.map((request) => {
            const isFileNameVisible =
              visibilityState[request.requestId]?.fileName || false;
            const isReasonVisible =
              visibilityState[request.requestId]?.reason || false;

            return (
              <div
                key={request.requestId}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 mr-2 text-gray-500" />
                      <p className="text-lg font-semibold text-gray-800 mr-2">
                        File:
                      </p>
                      <span
                        className={`text-orange-600 transition-opacity duration-300 ${
                          isFileNameVisible ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        {isFileNameVisible
                          ? request.submission?.fileName
                          : "•••••••••••••••••"}
                      </span>
                      <button
                        onClick={() =>
                          toggleVisibility(request.requestId, "fileName")
                        }
                        className="ml-2 p-1 rounded-full hover:bg-gray-200"
                        aria-label={
                          isFileNameVisible
                            ? "Hide file name"
                            : "Show file name"
                        }
                      >
                        {isFileNameVisible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Requested on: {formatDate(request.requestedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <StatusTag status={request.status} />
                    <Button
                      type="primary"
                      icon={<FileSearch className="w-4 h-4" />}
                      onClick={() => showDetailModal(request)}
                      className="flex items-center justify-center font-semibold"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-700 flex items-center mr-2">
                        <Edit className="w-4 h-4 mr-2" />
                        Your Reason:
                      </h4>
                      <button
                        onClick={() =>
                          toggleVisibility(request.requestId, "reason")
                        }
                        className="p-1 rounded-full hover:bg-gray-200"
                        aria-label={
                          isReasonVisible ? "Hide reason" : "Show reason"
                        }
                      >
                        {isReasonVisible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p
                      className={`text-gray-600 pl-6 italic bg-gray-50 p-3 rounded-md mt-1 transition-opacity duration-300 ${
                        isReasonVisible ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {isReasonVisible
                        ? `"${request.reason}"`
                        : "••••••••••••••••••••••••••••••"}
                    </p>
                  </div>

                  {request.resolutionNotes && (
                    <div>
                      <h4 className="font-semibold text-gray-700 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Instructor's Response:
                      </h4>
                      <p className="text-gray-600 pl-6 bg-green-50 p-3 rounded-md mt-1">
                        {request.resolutionNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Pagination
            current={pagination.pageNumber}
            pageSize={pagination.pageSize}
            total={pagination.totalCount}
            onChange={handlePageChange}
            showSizeChanger
          />
        </div>

        {/* MODIFIED: Using the new component name here */}
        <RequestRegradeDetailModal
          visible={isModalVisible}
          onClose={handleCancelModal}
          request={selectedRequest}
        />
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Regrade Request History
      </h1>

      {!loading && !error && requests && requests.length > 0 && (
        <StatCard count={pagination.totalCount} />
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">{renderContent()}</div>
    </div>
  );
};

export default ViewRequestHistoryPage;