import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../../service/reviewService";
import { 
    ChevronRight, Award, ArrowLeft, MessageSquare, 
    Users, UserCheck, CalendarCheck, ShieldQuestion // 👉 2. Import icon mới
} from 'lucide-react';
import RegradeRequestModal from '../../component/Modals/RegradeRequestModal'; 

// Hàm helper để format ngày tháng
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

const ViewScorePage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

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
        {/* Breadcrumbs */}
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
          <button
            onClick={() => navigate(`/assignment/${courseId}`)}
            className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>
        </div>

        {/* Score Display */}
        <div className="bg-white p-8 rounded-lg shadow-md border text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-50 rounded-full"></div>
          <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-blue-50 rounded-full"></div>

          <div className="relative z-10">
            <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Final Score
            </p>
            <p className="text-7xl font-extrabold text-blue-600 my-2">
              {scoreData.finalScore.toFixed(2)}
              <span className="text-4xl text-gray-400">/10.00</span>
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
              <CalendarCheck size={14} className="mr-2" />
              Ngày chấm: {formatDate(scoreData.gradedAt)}
            </div>
          </div>
        </div>

        {/* Score Breakdown & Feedback */}
        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4 text-gray-800">
           Score details
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
              <UserCheck className="w-6 h-6 mr-4 text-indigo-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-indigo-800">
                  Points from the instructor
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {scoreData.instructorScore.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-teal-50 rounded-lg">
              <Users className="w-6 h-6 mr-4 text-teal-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-teal-800">
                  Average score from Peer Review
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  {scoreData.peerAverageScore.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
            <MessageSquare className="mr-2 text-green-500" /> Comments from Instructors
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <p className="text-gray-600 italic">
              "{scoreData.feedback || "Không có nhận xét."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScorePage;
