import React from 'react';
import { AlertTriangle, Calendar, BarChart2, FileText, Download, Upload } from 'lucide-react';

const AssignmentCard = ({ assignment }) => {
    const statusConfig = {
    due: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-700',
      badgeText: 'Sắp hết hạn',
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />
    },
    open: {
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      badgeText: 'Đang mở',
      icon: <div className="w-6 h-6 text-yellow-500 font-bold text-lg">&lt;&gt;</div>
    },
  };

  const currentStatus = statusConfig[assignment.status];

  return (
    <div className={`p-6 rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="mr-4">{currentStatus.icon}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{assignment.title}</h3>
            <p className="text-sm text-gray-600">{assignment.description}</p>
          </div>
        </div>
        <div className={`px-3 py-1 text-sm font-semibold rounded-full ${currentStatus.badgeColor}`}>
          {currentStatus.badgeText}
        </div>
      </div>

      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4 ml-10">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1.5" />
          Deadline: <span className="font-semibold ml-1">{assignment.deadline}</span>
          <span className="text-red-600 ml-2">{assignment.timeLeft}</span>
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-4 h-4 mr-1.5" />
          Trọng số: <span className="font-semibold ml-1">{assignment.weight}</span>
        </div>
      </div>

      {assignment.status === 'due' && (
         <div className="mt-4 ml-10 p-4 border-t border-red-200">
           <p className="font-semibold mb-2">Mô tả chi tiết:</p>
           <p className="text-sm text-gray-700 mb-4">{assignment.details}</p>
           <div className="flex items-center space-x-3">
             <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Xem chi tiết
             </button>
             <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
                <Download className="w-4 h-4 mr-2" />
                Tải liệu
             </button>
             <button className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 text-sm">
                <Upload className="w-4 h-4 mr-2" />
                Nộp bài ngay
             </button>
           </div>
         </div>
      )}
    </div>
  );
};

export default AssignmentCard;