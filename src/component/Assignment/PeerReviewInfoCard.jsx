import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shuffle } from 'lucide-react';

const PeerReviewInfoCard = ({ completed, required, courseId, assignmentId }) => {
  const navigate = useNavigate();

  const remaining = required - completed;
  const progressPercentage = required > 0 ? (completed / required) * 100 : 0;

  const handleStartReview = () => {
    navigate(`/assignment/${courseId}/${assignmentId}/review`);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg mt-[-1px] rounded-t-none">
     
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Users className="w-6 h-6 mr-3 text-yellow-700" />
          <h3 className="text-lg font-bold text-yellow-900">Random Peers Review</h3>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
          Obligatory
        </span>
      </div>
      <p className="text-sm text-yellow-800 mb-4">
        Mark and evaluate the work of peers. Students are required to mark at least {required} Assigment.
      </p>

      <div className="flex justify-between items-center text-sm font-medium mb-1">
        <span className="text-gray-700">Scored: {completed}/{required} Assigment</span>
        <span className="text-red-600">Remaining: {remaining} Assigment</span>
      </div>
      <div className="w-full bg-yellow-200 rounded-full h-2 mb-4">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <button 
        onClick={handleStartReview}
        className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Peers Review
      </button>
    </div>
  );
};

export default PeerReviewInfoCard;