import React from "react";
import { Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CrossClassReviewCard = ({ assignmentId, courseId }) => {
  const navigate = useNavigate();

  const handleStartReview = () => {
    // Điều hướng đến trang CrossClassReviewPage mới tạo
    navigate(`/assignment/${courseId}/${assignmentId}/cross-review`);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-indigo-200 bg-indigo-50 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <Globe className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              Across-class Review
            </h3>
            <p className="text-sm text-gray-600">
              Review submissions from other classes.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-700">
          You can review students from other sections to gain extra perspective.
        </p>
      </div>

      <button
        onClick={handleStartReview}
        className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
      >
        <Globe className="w-4 h-4 mr-2" />
        Across-class Peer Review
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};

export default CrossClassReviewCard;