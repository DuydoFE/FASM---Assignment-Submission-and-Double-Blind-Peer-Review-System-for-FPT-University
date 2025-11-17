import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, BookCopy, Eye, Info } from 'lucide-react';

const EnrolledCourseCard = ({
  subjectCode,
  title,
  classCode,
  lecturer,
  studentCount, 
  schedule,
  assignmentCount,
  status,
  instructorNames, 
  enrolledAt, 
}) => {
  const navigate = useNavigate();

  const handleViewAssignments = () => {
    navigate(`/assignment/${classCode}`);
  };

  return (
    <div className="p-6 rounded-lg shadow-md border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center font-bold rounded-full text-lg ${
              status === 'Enrolled' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {subjectCode}
          </div>
          <div className="ml-4">
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-500">{classCode}</p>
          </div>
        </div>

        {status === 'Enrolled' ? (
          <div className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
            Enrolled
          </div>
        ) : (
          <div className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 rounded-full">
            Pending Approval
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 text-gray-600 text-sm mb-6">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          Instructor: {instructorNames ? instructorNames.join(', ') : 'N/A'}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          {studentCount} Students
        </div>
       
        <div className="flex items-center">
          <BookCopy className="w-4 h-4 mr-2 text-gray-400" />
          {assignmentCount} assignments
        </div>
        {enrolledAt && (
          <div className="flex items-center">
            <Info className="w-4 h-4 mr-2 text-gray-400" />
            Joined At: {new Date(enrolledAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleViewAssignments}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={status !== 'Enrolled'}
        >
          <Eye className="w-4 h-4 mr-2" />
          View assignments
        </button>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors">
          <Info className="w-4 h-4 mr-2" />
          Detail
        </button>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;