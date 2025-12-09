import React from "react";
import { X, AlertTriangle, CheckCircle, AlertOctagon } from "lucide-react";

const PlagiarismResultModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { maxSimilarity, isAboveThreshold, threshold } = data;
  
 
  const percentage = maxSimilarity <= 1 ? Math.round(maxSimilarity * 100) : Math.round(maxSimilarity);
  
  let statusColor = "text-green-600";
  let statusBg = "bg-green-100";
  let statusBorder = "border-green-200";
  let Icon = CheckCircle;
  let message = "Bài làm có độ trùng lặp thấp, an toàn để nộp.";

  if (isAboveThreshold) {
    statusColor = "text-red-600";
    statusBg = "bg-red-50";
    statusBorder = "border-red-200";
    Icon = AlertOctagon;
    message = `Cảnh báo: Độ trùng lặp vượt quá ngưỡng cho phép (${threshold}%). Hãy xem lại bài làm!`;
  } else if (percentage > 20) {
    statusColor = "text-yellow-600";
    statusBg = "bg-yellow-50";
    statusBorder = "border-yellow-200";
    Icon = AlertTriangle;
    message = "Lưu ý: Có phát hiện trùng lặp nhưng vẫn nằm trong ngưỡng cho phép.";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Kết quả kiểm tra đạo văn</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${statusBorder} ${statusBg}`}>
              <div className="text-center">
                 <span className={`text-3xl font-bold ${statusColor}`}>{percentage}%</span>
                 <p className="text-xs text-gray-500 font-medium uppercase mt-1">Similarity</p>
              </div>
            </div>
          </div>

          <div className={`flex items-start p-3 rounded-md mb-4 text-left ${statusBg} border ${statusBorder}`}>
            <Icon className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${statusColor}`} />
            <p className={`text-sm ${statusColor} font-medium`}>{message}</p>
          </div>

          <p className="text-sm text-gray-500">
            Ngưỡng cho phép tối đa của bài tập này là: <span className="font-semibold text-gray-700">{threshold}%</span>
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismResultModal;