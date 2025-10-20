import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Download, Eye, Clock, 
  CheckCircle, // Xanh lá
  XCircle,     // Đỏ
  FilePenLine, // Không màu (Draft)
  Slash,       // Không màu (Cancelled)
  Info,        // Xanh dương (Upcoming)
} from 'lucide-react';


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const getAssignmentStyles = (assignment) => {
  switch (assignment.status) {
    case 'Active':
      return {
        cardBg: 'bg-green-50',
        borderColor: 'border-green-200',
        badgeClasses: 'bg-green-100 text-green-700',
        icon: <CheckCircle className="w-6 h-6 text-green-500" />
      };
    case 'Closed':
      return {
        cardBg: 'bg-red-50',
        borderColor: 'border-red-200',
        badgeClasses: 'bg-red-100 text-red-700',
        icon: <XCircle className="w-6 h-6 text-red-500" />
      };
    case 'InReview':
      return {
        cardBg: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        badgeClasses: 'bg-yellow-100 text-yellow-700',
        icon: <Eye className="w-6 h-6 text-yellow-500" />
      };
    case 'Upcoming':
      return {
        cardBg: 'bg-blue-50',
        borderColor: 'border-blue-200',
        badgeClasses: 'bg-blue-100 text-blue-700',
        icon: <Info className="w-6 h-6 text-blue-500" />
      };
    case 'Cancelled':
      return {
        cardBg: 'bg-gray-100',
        borderColor: 'border-gray-300',
        badgeClasses: 'bg-gray-200 text-gray-600',
        icon: <Slash className="w-6 h-6 text-gray-500" />
      };
    case 'Draft':
        return {
          cardBg: 'bg-gray-100',
          borderColor: 'border-gray-300',
          badgeClasses: 'bg-gray-200 text-gray-600',
          icon: <FilePenLine className="w-6 h-6 text-gray-500" />
        };
    default: 
      return {
        cardBg: 'bg-white',
        borderColor: 'border-gray-200',
        badgeClasses: 'bg-gray-100 text-gray-700',
        icon: <Info className="w-6 h-6 text-gray-500" />
      };
  }
};

const AssignmentCard = ({ assignment, courseId }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/assignment/${courseId}/${assignment.assignmentId}`);
  };

  const styles = getAssignmentStyles(assignment);

  return (
    <div className={`rounded-lg border ${styles.cardBg} ${styles.borderColor}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center cursor-pointer" onClick={handleNavigate}>
            <div className="mr-4">{styles.icon}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600">{assignment.title}</h3>
              <p className="text-sm text-gray-600">{assignment.description}</p>
            </div>
          </div>
          {assignment.status && (
            <div className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.badgeClasses}`}>
              {assignment.status}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-4 ml-10">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5" />
            Start Date: <span className="font-semibold ml-1">{formatDate(assignment.startDate)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-red-500" />
            Deadline: <span className="font-semibold ml-1">{formatDate(assignment.deadline)}</span>
          </div>
           <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1.5 text-purple-500" />
            Review: <span className="font-semibold ml-1">{formatDate(assignment.reviewDeadline)}</span>
          </div>
        </div>
      </div>
      
      <div className={`p-4 border-t ${styles.borderColor}`}>
        <div className="ml-10">
            <p className="font-semibold mb-2">Guideline:</p>
            <p className="text-sm text-gray-700 mb-4">{assignment.guidelines || "Không có hướng dẫn chi tiết."}</p>
        </div>
        <div className="flex items-center space-x-3 justify-end">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 mr-2" />
              Document
          </button>
          <button onClick={handleNavigate} className={`flex items-center px-4 py-2 text-white font-semibold rounded-md text-sm bg-blue-600 hover:bg-blue-700`}>
              <Eye className="w-4 h-4 mr-2" />
              Detail and Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;