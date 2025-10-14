// src/component/Submission/PeerReviewCard.jsx
import React from 'react';
import { Users, Shuffle, Calendar } from 'lucide-react'; 
import { useNavigate, useParams } from 'react-router-dom'; // Import hooks

const PeerReviewCard = ({ completed, required, reviewDeadline, isReviewOpen }) => {
  const remaining = required - completed;
  const progressPercentage = required > 0 ? (completed / required) * 100 : 0;

  const navigate = useNavigate();
  const { courseId, assignmentId } = useParams();
  
  const handleStartReview = () => {
    navigate(`/assignment/${courseId}/${assignmentId}/review`);
  };

  // Hàm helper để định dạng ngày tháng (có thể đưa ra file utils chung)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Users className="w-6 h-6 mr-3 text-yellow-700" />
          <h3 className="text-lg font-bold text-yellow-900">Random Peers Review</h3>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
          Obligatory
        </span>
      </div>
      <p className="text-sm text-yellow-800 mb-4">
        Mark and evaluate the work of peers. Students are required to mark at least {required} Assigment.
      </p>


      <div className="flex items-center text-sm text-purple-700 font-semibold mb-4 bg-purple-100 p-2 rounded-md">
        <Calendar className="w-4 h-4 mr-2" />
        Review Deadline: {formatDate(reviewDeadline)}
      </div>

      <div className="flex justify-between items-center text-sm font-medium mb-1">
        <span className="text-gray-700">Scored: {completed}/{required} Assigment</span>
        <span className="text-red-600">Remaining: {remaining} Assigment</span>
      </div>
      <div className="w-full bg-yellow-200 rounded-full h-2 mb-4">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* 👉 3. Logic hóa nút bấm */}
      <button 
        onClick={handleStartReview}
        // Vô hiệu hóa nút nếu review chưa mở HOẶC đã chấm đủ bài
        disabled={!isReviewOpen || completed >= required} 
        className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        {/* Thay đổi text của nút dựa trên trạng thái */}
        {!isReviewOpen ? 'Review has not started' : (completed >= required ? 'Completed' : 'Peers Review')}
      </button>

      {/* 👉 4. (Tùy chọn) Hiển thị thông báo khi review chưa mở */}
      {!isReviewOpen && (
          <p className="text-xs text-center text-gray-600 mt-2">
              Peer review will be available after the submission deadline.
          </p>
      )}
    </div>
  );
};

export default PeerReviewCard;