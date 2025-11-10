import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice.js";
import { reviewService } from "../../service/reviewService";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Award,
  ArrowLeft,
  MessageSquare,
  Users,
  BarChart,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  FileText,
  Eye,
  Download,
  CalendarCheck,
  ShieldQuestion,
  TrendingUp,
  Trophy,
} from "lucide-react";
import RegradeRequestModal from "../../component/Assignment/RegradeRequestModal.jsx";

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

const RegradeStatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <Clock size={14} className="mr-1.5" />,
      text: "Request Pending",
    },
    Approved: {
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: <CheckCircle size={14} className="mr-1.5" />,
      text: "Request Approved",
    },
    Rejected: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: <XCircle size={14} className="mr-1.5" />,
      text: "Request Rejected",
    },
  };

  const currentStatus = statusStyles[status];

  if (!currentStatus) {
    return null;
  }

  return (
    <div
      className={`flex items-center px-3 py-2 rounded-md font-semibold text-sm ${currentStatus.bgColor} ${currentStatus.textColor}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </div>
  );
};

const ViewScorePage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = useSelector(selectUser);

  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myScoreDetails", assignmentId],
    queryFn: () => reviewService.getMyScoreDetails(assignmentId),
    enabled: !!assignmentId,
  });

  const scoreData = responseData?.data;

  const handleRegradeSubmit = async ({ reason }) => {
    console.log("--- Step 1: handleRegradeSubmit function was called. ---");

    console.log("Step 2.1: Checking scoreData:", scoreData);
    console.log("Step 2.2: Checking currentUser:", currentUser);

    if (!scoreData?.submissionId) {
      toast.error("Submission ID not found. Cannot submit request.");
      console.error("ERROR: scoreData.submissionId is missing!", scoreData);
      return;
    }
    if (!currentUser?.userId) {
      toast.error("User information not found. Please log in again.");
      console.error("ERROR: currentUser.userId is missing!", currentUser);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        submissionId: scoreData.submissionId,
        reason: reason,
        requestedByUserId: currentUser.userId,
      };

      console.log("Step 3: Payload is ready to be sent:", payload);

      console.log(
        "Step 4: Attempting to call reviewService.submitRegradeRequest..."
      );
      await reviewService.submitRegradeRequest(payload);

      console.log("Step 5: API call successful!");
      toast.success("Your regrade request has been sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Step 6: API call failed!", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="p-8 text-center font-semibold text-lg">
        Loading your score...
      </div>
    );
  }

  if (isError || !scoreData) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold text-lg">
        Unable to load points. Please try again later.
      </div>
    );
  }

  const assignmentTitle =
    navigate.state?.assignmentTitle || `Assignment #${assignmentId}`;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/my-assignments" className="hover:underline">
            My Assignments
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link to={`/assignment/${courseId}`} className="hover:underline">
            Assignments
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">Final Score</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {assignmentTitle}
            </h1>
            <p className="text-gray-500">
              This is the final score and comments for this exercise.
            </p>
          </div>
          <div className="flex space-x-3">
            {scoreData.regradeStatus ? (
              <RegradeStatusBadge status={scoreData.regradeStatus} />
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
              >
                <ShieldQuestion size={16} className="mr-2" />
                Regrade Request
              </button>
            )}
            <button
              onClick={() => navigate(`/assignment/${courseId}`)}
              className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white p-8 rounded-lg shadow-md border text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-50 rounded-full"></div>
          <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-blue-50 rounded-full"></div>

          <div className="relative z-10">
            <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">Final Score</p>
            <p className="text-7xl font-extrabold text-blue-600 my-2">
              {scoreData.finalScore.toFixed(2)}
              <span className="text-4xl text-gray-400">/10.00</span>
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
              <CalendarCheck size={14} className="mr-2" />
              Date of score: {formatDate(scoreData.gradedAt)}
            </div>
          </div>
        </div>
        {scoreData.fileUrl && (
          <div className="mt-8">
            <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
              <FileText className="mr-2 text-gray-500" /> Submission Details
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <div className="flex items-center text-sm">
                <p className="font-semibold text-gray-700 mr-4 truncate flex-grow">
                  {scoreData.fileName || "Submission File"}
                </p>
                <div className="ml-auto flex space-x-2 flex-shrink-0">
                  <a
                    href={scoreData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview File"
                    className="flex items-center px-3 py-1.5 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    <Eye size={14} className="mr-1.5" />
                    Preview
                  </a>
                  <a
                    href={scoreData.fileUrl}
                    download={scoreData.fileName}
                    title="Download File"
                    className="flex items-center px-3 py-1.5 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    <Download size={14} className="mr-1.5" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            Score details
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
            <div className="flex items-center p-4 bg-indigo-50 rounded-lg">
              <div className="p-3 bg-white rounded-full mr-4">
                <UserCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-indigo-800">
                  Points from the instructor
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {scoreData.instructorScore.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-teal-50 rounded-lg">
              <div className="p-3 bg-white rounded-full mr-4">
                <Users className="w-6 h-6 text-teal-500" />
              </div>
              <div>
                <p className="font-semibold text-teal-800">
                  Average score from Peer Review
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  {scoreData.peerAverageScore.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Card Điểm trung bình */}
              <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center transition-transform hover:scale-105">
                <div className="p-3 bg-white/60 rounded-full mr-4 shadow-inner">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-purple-900">
                    Class Average Score
                  </p>
                  <p className="text-3xl font-bold text-purple-700">
                    {scoreData.classAverageScore.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center transition-transform hover:scale-105">
                <div className="p-3 bg-white/60 rounded-full mr-4 shadow-inner">
                  <Trophy className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-orange-900">
                    Class Highest Score
                  </p>
                  <p className="text-3xl font-bold text-orange-700">
                    {scoreData.classMaxScore.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
            <MessageSquare className="mr-2 text-green-500" /> Comments from
            Instructors
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <p className="text-gray-600 italic">
              "{scoreData.feedback || "Không có nhận xét."}"
            </p>
          </div>
        </div>
      </div>
      <RegradeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegradeSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ViewScorePage;
