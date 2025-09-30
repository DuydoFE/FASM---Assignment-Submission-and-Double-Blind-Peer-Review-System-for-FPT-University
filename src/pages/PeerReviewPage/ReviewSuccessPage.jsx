import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, CheckCircle } from "lucide-react";

const ReviewSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reviewResult = location.state; // dữ liệu được truyền từ navigate

  if (!reviewResult) {
    return (
      <div className="p-8 text-center text-xl text-red-500">
        Không có dữ liệu để hiển thị.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle size={72} className="text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            Đã gửi điểm thành công!
          </h1>
          <p className="text-gray-600 mt-2">
            Điểm số đã được gửi tới giảng viên và thông báo cho sinh viên
          </p>
        </div>

        {/* Assignment Info */}
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {reviewResult.assignmentTitle}
          </h2>
          <p className="text-gray-600 mb-4">
            {reviewResult.studentName || "Sinh viên không xác định"}
          </p>

          <ul className="divide-y">
            {reviewResult.criteriaFeedbacks.map((c) => (
              <li key={c.criteriaId} className="py-2 flex justify-between">
                <span>{c.criteriaName}</span>
                <span className="font-semibold text-gray-800">
                  {c.score}/{c.maxScore}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4 p-4 bg-blue-50 rounded-lg">
            <span className="font-bold text-blue-800">Tổng điểm</span>
            <span className="text-2xl font-extrabold text-blue-600">
              {reviewResult.totalScore}/100
            </span>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-gray-800 mb-2">Nhận xét chung</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {reviewResult.generalFeedback || "Không có nhận xét"}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={16} className="mr-2" /> Quay lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Home size={16} className="mr-2" /> Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSuccessPage;
