import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook useNavigate để điều hướng
import { AlertTriangle, Calendar, BarChart2, FileText, Download, Upload, Eye } from 'lucide-react';

const AssignmentCard = ({ assignment, courseId }) => { // 2. Nhận prop courseId
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/assignment/${courseId}/${assignment.id}`);
  };

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
      icon: <div className="flex items-center justify-center w-6 h-6 text-yellow-600 bg-yellow-100 rounded-full font-bold text-lg">&lt;&gt;</div>
    },
  };

  const currentStatus = statusConfig[assignment.status];

  const ActionButtons = ({ status }) => {
    const isDue = status === 'due';
    const primaryButtonColor = isDue 
      ? "bg-red-600 hover:bg-red-700" 
      : "bg-blue-600 hover:bg-blue-700";
    const primaryButtonText = isDue ? "Nộp bài ngay" : "Xem assignment";
    const PrimaryButtonIcon = isDue ? Upload : Eye;

    return (
      <div className={`mt-4 ml-10 p-4 border-t ${isDue ? 'border-red-200' : 'border-gray-200'}`}>
        {isDue && (
          <>
            <p className="font-semibold mb-2">Mô tả chi tiết:</p>
            <p className="text-sm text-gray-700 mb-4">{assignment.details}</p>
          </>
        )}
        <div className="flex items-center space-x-3 justify-end">
          {isDue && (
             <button onClick={handleNavigate} className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Xem chi tiết
             </button>
          )}
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Tải liệu
          </button>
          <button onClick={handleNavigate} className={`flex items-center px-4 py-2 text-white font-semibold rounded-md text-sm ${primaryButtonColor}`}>
              <PrimaryButtonIcon className="w-4 h-4 mr-2" />
              {primaryButtonText}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-6 rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center cursor-pointer" onClick={handleNavigate}>
          <div className="mr-4">{currentStatus.icon}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600">{assignment.title}</h3>
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
          {assignment.timeLeft && <span className="text-red-600 ml-2">{assignment.timeLeft}</span>}
        </div>
        <div className="flex items-center">
          <BarChart2 className="w-4 h-4 mr-1.5" />
          Trọng số: <span className="font-semibold ml-1">{assignment.weight}</span>
        </div>
      </div>

      {(assignment.status === 'due' || assignment.status === 'open') && (
        <ActionButtons status={assignment.status} />
      )}
    </div>
  );
};

export default AssignmentCard;