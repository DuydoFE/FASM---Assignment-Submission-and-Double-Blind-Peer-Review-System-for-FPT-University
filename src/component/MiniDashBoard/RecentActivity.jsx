import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import { assignmentService } from '../../service/assignmentService';

import { Clock, MessageSquare, XCircle, AlertCircle, FileText } from 'lucide-react';


const getActivityDetails = (activity) => {
  switch (activity.status) {
    case 'InReview':
      return {
        icon: <MessageSquare className="w-5 h-5 text-yellow-500 mt-1 mr-4" />,
        description: 'Đã nộp, đang chờ review: ',
      };
    case 'Active':
       return {
        icon: <Clock className="w-5 h-5 text-gray-800 mt-1 mr-4" />,
        description: 'Sắp đến hạn: ',
      };
    case 'Cancelled':
      return {
        icon: <XCircle className="w-5 h-5 text-gray-500 mt-1 mr-4" />,
        description: 'Đã hủy: ',
      };
    case 'Close':
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-500 mt-1 mr-4" />,
        description: 'Đã đóng: ',
      };
    default:
      return {
        icon: <FileText className="w-5 h-5 text-gray-400 mt-1 mr-4" />,
        description: `Trạng thái ${activity.status}: `,
      };
  }
};

const formatDeadline = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}


const RecentActivity = () => {
  const currentUser = useSelector(selectUser);
  const studentId = currentUser?.userId;

  const { data: activityData, isLoading, isError } = useQuery({
    queryKey: ['studentActivities', studentId],
    queryFn: () => assignmentService.getStudentAssignments(studentId),
    enabled: !!studentId,
  });

  const activities = activityData?.data || [];
  const displayedActivities = activities.slice(0, 3);

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading activities...</p>;
    }

    if (isError) {
      return <p className="text-red-500">Could not fetch recent activities.</p>;
    }

    if (displayedActivities.length === 0) {
      return <p>No recent activity.</p>;
    }

    return (
      <ul className="space-y-4">
        {displayedActivities.map((activity) => {
          const { icon, description } = getActivityDetails(activity);
          return (
            <li key={activity.assignmentId} className="flex items-start">
              {icon}
              <div>
                <p className="text-gray-800">
                  {description}
                  <span className="font-semibold">{activity.title}</span>
                </p>
             
                <p className="text-sm text-gray-500">
                  {activity.courseName} • Deadline: {formatDeadline(activity.deadline)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      {renderContent()}
    </div>
  );
};

export default RecentActivity;