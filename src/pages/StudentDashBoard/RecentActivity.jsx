import React from 'react';
import { CheckCircle, MessageSquare, Clock } from 'lucide-react';

// Dữ liệu giả cho hoạt động gần đây
const mockActivities = [
  {
    id: 1,
    type: 'submission',
    icon: <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-4" />,
    description: 'Assignment submitted: ',
    title: 'Web Development Lab 5',
    time: '2 hours ago',
    course: 'PRN231',
  },
  {
    id: 2,
    type: 'feedback',
    icon: <MessageSquare className="w-5 h-5 text-blue-500 mt-1 mr-4" />,
    description: 'Get feedback from instructors ',
    title: 'Database Lab 3',
    time: '5 hours ago',
    course: 'DBI202',
    grade: '8.5/10',
  },
  {
    id: 3,
    type: 'reminder',
    icon: <Clock className="w-5 h-5 text-red-500 mt-1 mr-4" />,
    description: 'Deadline reminder: ',
    title: 'Mobile App Final Project',
    time: '1 day ago',
    course: 'PRN231',
  },
];

const RecentActivity = () => {
  // Sau này, bạn có thể dùng useQuery ở đây để lấy dữ liệu thật
  // const { data: activities, isLoading, isError } = useQuery(...)

  const activities = mockActivities; // Tạm thời dùng dữ liệu giả

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      {activities && activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start">
              {activity.icon}
              <div>
                <p className="text-gray-800">
                  {activity.description}
                  <span className="font-semibold">{activity.title}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {activity.time} • {activity.course}
                  {activity.grade && ` • Grade: ${activity.grade}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  );
};

export default RecentActivity;