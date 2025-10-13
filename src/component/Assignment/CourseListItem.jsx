import React from "react";

const CourseListItem = ({
  icon: Icon,
  iconColor,
  title,
  code,
  status,
  onJoinClick,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-4 ${iconColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{code}</p>
        </div>
      </div>

      {status === "Pending" ? (
        <button
          onClick={onJoinClick}
          className="px-5 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors text-sm"
        >
          Join
        </button>
      ) : (
        <button
          className="px-5 py-2 bg-gray-300 text-gray-600 font-semibold rounded-md cursor-not-allowed text-sm"
          disabled
        >
          Enrolled
        </button>
      )}
    </div>
  );
};

export default CourseListItem;
