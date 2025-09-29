// src/component/Submission/SubmissionCard.jsx
import React from 'react';
import { Upload, CheckCircle, RefreshCw } from 'lucide-react';

const SubmissionCard = ({ hasSubmitted }) => {
  if (hasSubmitted) {
    // Giao diện khi đã nộp bài
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center mb-3">
          <Upload className="w-6 h-6 mr-3 text-green-700" />
          <h3 className="text-lg font-bold text-green-800">Nộp bài</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload file bài làm của bạn. Hỗ trợ PDF, DOC, ZIP (tối đa 50MB). Có thể nộp lại nhiều lần.
        </p>
        <div className="bg-white p-3 rounded-md flex items-center text-sm">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            <div>
                <p className="font-semibold text-green-700">Đã nộp thành công</p>
                <p className="text-gray-500">Bạn có thể nộp lại để cập nhật bài làm</p>
            </div>
        </div>
        <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Nộp lại bài
        </button>
      </div>
    );
  }

  // Giao diện mặc định khi chưa nộp bài
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
          <Upload className="w-6 h-6 mr-3 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-800">Nộp bài</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload file bài làm của bạn. Hỗ trợ PDF, DOC, ZIP (tối đa 50MB). Có thể nộp lại nhiều lần.
        </p>
        {/* Thêm khu vực kéo thả hoặc chọn file ở đây */}
        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Kéo và thả file của bạn vào đây</p>
        </div>
        <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Nộp bài
        </button>
    </div>
  );
};

export default SubmissionCard;