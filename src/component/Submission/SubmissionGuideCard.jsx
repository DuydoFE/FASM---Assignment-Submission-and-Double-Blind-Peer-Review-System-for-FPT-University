// src/component/Submission/SubmissionGuideCard.jsx
import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

const SubmissionGuideCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Xem hướng dẫn nộp bài</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Hướng dẫn chi tiết về cách thức nộp bài, định dạng file và yêu cầu cần thiết cho assignment này.
      </p>
      <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
        <ExternalLink className="w-4 h-4 mr-2" />
        Xem hướng dẫn
      </button>
    </div>
  );
};

export default SubmissionGuideCard;