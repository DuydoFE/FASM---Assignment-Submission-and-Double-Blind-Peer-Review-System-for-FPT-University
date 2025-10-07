import React from 'react';

const CourseListItem = ({ icon: Icon, iconColor, title, code, onJoinClick }) => {
  const colorClass = iconColor || 'text-gray-500';

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mr-4 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">Class Code: {code}</p>
        </div>
      </div>
      {/* Sử dụng onJoinClick ở đây */}
      <button 
        onClick={onJoinClick} 
        className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors text-sm"
      >
        Join
      </button>
    </div>
  );
};

export default CourseListItem;