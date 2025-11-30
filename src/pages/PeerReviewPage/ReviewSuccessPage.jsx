import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, CheckCircle, List, MessageSquare } from "lucide-react";

const ReviewSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const reviewResult = location.state;

  if (!reviewResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500 mb-2">No result data found</h2>
          <button 
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="bg-green-50 p-8 text-center border-b border-green-100">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            Review submitted successfully!
          </h1>
          <p className="text-gray-600 mt-2">
            You have completed the cross-marking for the assignment:
          </p>
          <p className="font-semibold text-lg text-green-700 mt-1">
            {reviewResult.assignmentTitle}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Sinh viên: {reviewResult.studentName || "Ẩn danh"}
          </p>
        </div>

        <div className="p-8 space-y-6">
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
              <List size={20} className="mr-2 text-blue-600" />
              Detail
            </h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {reviewResult.criteriaFeedbacks.map((item, index) => (
                  <li key={index} className="p-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700 font-medium text-sm">
                      {item.criteriaName}
                    </span>
                    <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded border border-gray-300 shadow-sm">
                      {item.score} <span className="text-gray-400 text-xs font-normal">/ {item.maxScore}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 flex flex-col justify-center items-center text-center">
              <span className="text-blue-800 font-semibold mb-1">TotalScore</span>
              <span className="text-4xl font-extrabold text-blue-600">
                {reviewResult.totalScore}<span className="text-xl text-blue-400">/10</span>
              </span>
            </div>

            {/* Comment */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center text-sm">
                <MessageSquare size={16} className="mr-2" />
                Nhận xét chung
              </h4>
              <p className="text-gray-600 text-sm italic h-24 overflow-y-auto whitespace-pre-line">
                "{reviewResult.generalFeedback || "Không có nhận xét bổ sung."}"
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Review Page
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm font-medium transition-all"
          >
            <Home size={16} className="mr-2" /> Go to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReviewSuccessPage;