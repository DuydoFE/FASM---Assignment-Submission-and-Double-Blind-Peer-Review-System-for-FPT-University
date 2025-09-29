// src/component/Submission/PeerReviewCard.jsx
import React from 'react';
import { Users, Shuffle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'; // Import hooks

const PeerReviewCard = ({ completed, required }) => {
  const remaining = required - completed;
  const progressPercentage = required > 0 ? (completed / required) * 100 : 0;

  const navigate = useNavigate();
  const { courseId, assignmentId } = useParams(); // Lấy ID từ URL
  const handleStartReview = () => {
    // Điều hướng đến trang chấm chéo
    navigate(`/assignment/${courseId}/${assignmentId}/review`);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Users className="w-6 h-6 mr-3 text-yellow-700" />
          <h3 className="text-lg font-bold text-yellow-900">Chấm chéo bất kì</h3>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
          Bắt buộc
        </span>
      </div>
      <p className="text-sm text-yellow-800 mb-4">
        Chấm và đánh giá bài làm của đồng môn. Sinh viên cần chấm tối thiểu {required} bài.
      </p>

      <div className="flex justify-between items-center text-sm font-medium mb-1">
        <span className="text-gray-700">Đã chấm: {completed}/{required} bài</span>
        <span className="text-red-600">Còn lại: {remaining} bài</span>
      </div>
      <div className="w-full bg-yellow-200 rounded-full h-2 mb-4">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

    <button 
        onClick={handleStartReview} // Thêm sự kiện onClick
        className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Chấm bài ngẫu nhiên
      </button>
    </div>
  );
};

export default PeerReviewCard;