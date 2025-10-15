import React from 'react';
import { Search, Users, FileText, BarChart3, Upload } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

const InstructorSideBar = () => {
  const location = useLocation();
  const params = useParams();

  // ✅ Lấy lại id từ state nếu URL không còn param
  const courseInstanceId = params.id || location.state?.courseInstanceId;

  const menuItems = [
    {
      id: 'manage-class',
      label: 'Class List',
      icon: Users,
      path: `/instructor/manage-class/${courseInstanceId}`,
    },
    {
      id: 'assignment',
      label: 'Assignment',
      icon: FileText,
      path: `/instructor/manage-assignment/${courseInstanceId}`,
    },
    {
      id: 'rubric',
      label: 'Rubric',
      icon: FileText,
      path: '/instructor/manage-rubric', // API không cần id
    },
    {
      id: 'grading',
      label: 'Grading',
      icon: BarChart3,
      path: courseInstanceId
        ? `/instructor/manage-grading/${courseInstanceId}`
        : '/instructor/manage-grading',
    },
    {
      id: 'publish',
      label: 'Publish Mark',
      icon: Upload,
      path: courseInstanceId
        ? `/instructor/publish-mark/${courseInstanceId}`
        : '/instructor/publish-mark',
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-20 z-40">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Class Management</h1>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              state={{ courseInstanceId }} // ✅ Giữ lại id khi đổi URL
              className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default InstructorSideBar;
