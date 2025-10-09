import { ChevronRight } from 'lucide-react';

const AssignmentCard = ({ subject, title, dueDate, remaining, color }) => {
  const colorVariants = {
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    green: 'border-green-500',
  };

  return (
    <div className={`flex items-center p-4 mb-3 bg-white rounded-lg border-l-4 ${colorVariants[color]} shadow-sm`}>
      <div className="flex-grow">
        <p className="font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subject} • Deadline: {dueDate}</p>
      </div>
      <div className="text-center mx-4">
        <p className={`font-semibold text-${color}-600`}>{remaining}</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};

export default AssignmentCard;