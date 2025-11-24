import React from 'react';

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
      
      <p className="text-2xl font-bold mt-2 text-gray-900">{value}</p>
      
      <p className="text-sm text-gray-700 font-medium">{label}</p>
    </div>
  );
};

export default StatCard;