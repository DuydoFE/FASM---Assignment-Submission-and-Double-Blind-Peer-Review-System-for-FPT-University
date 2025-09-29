import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Calendar, BarChart2, FileText, Download, Upload, Eye, Clock } from 'lucide-react';

// Hàm helper để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

// Hàm helper để xác định trạng thái dựa trên deadline
const getAssignmentStatus = (assignment) => {
  if (assignment.isOverdue) return 'overdue';
  if (assignment.daysUntilDeadline <= 3) return 'due';
  if (assignment.daysUntilDeadline <= 7) return 'warning';
  return 'open';
};

const AssignmentCard = ({ assignment, courseId }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/assignment/${courseId}/${assignment.assignmentId}`);
  };

  const statusConfig = {
    due: { // Deadline < 3 ngày
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badgeColor: 'bg-red-100 text-red-700',
      badgeText: 'Sắp hết hạn',
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />
    },
    warning: { // Deadline < 7 ngày
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-700',
      badgeText: 'Sắp tới hạn',
      icon: <Clock className="w-6 h-6 text-yellow-500" />
    },
    open: { // Còn nhiều thời gian
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      badgeColor: 'bg-blue-100 text-blue-700',
      badgeText: 'Đang mở',
      icon: <div className="flex items-center justify-center w-6 h-6 text-blue-600 bg-blue-100 rounded-full font-bold text-lg">&lt;&gt;</div>
    },
    overdue: { // Đã quá hạn
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      badgeColor: 'bg-gray-200 text-gray-600',
      badgeText: 'Đã quá hạn',
      icon: <AlertTriangle className="w-6 h-6 text-gray-500" />
    }
  };
  
  // Xác định trạng thái hiện tại
  const statusKey = getAssignmentStatus(assignment);
  const currentStatus = statusConfig[statusKey];

  return (
    <div className={`rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
      <div className="p-6">
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

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-4 ml-10">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5" />
            Ngày mở: <span className="font-semibold ml-1">{formatDate(assignment.startDate)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-red-500" />
            Deadline: <span className="font-semibold ml-1">{formatDate(assignment.deadline)}</span>
            {statusKey === 'due' && <span className="text-red-600 ml-2">(Còn {assignment.daysUntilDeadline} ngày)</span>}
          </div>
           <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-purple-500" />
            Hạn review: <span className="font-semibold ml-1">{formatDate(assignment.reviewDeadline)}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons and Guidelines */}
      <div className={`p-4 border-t ${currentStatus.borderColor}`}>
        <div className="ml-10">
            <p className="font-semibold mb-2">Hướng dẫn:</p>
            <p className="text-sm text-gray-700 mb-4">{assignment.guidelines || "Không có hướng dẫn chi tiết."}</p>
        </div>
        <div className="flex items-center space-x-3 justify-end">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Tài liệu
          </button>
          <button onClick={handleNavigate} className={`flex items-center px-4 py-2 text-white font-semibold rounded-md text-sm bg-blue-600 hover:bg-blue-700`}>
              <Eye className="w-4 h-4 mr-2" />
              Xem & Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;