import React from 'react';
import { BookOpen, ExternalLink, ChevronRight } from 'lucide-react';

const SubmissionGuideCard = ({ onSeeInstructions }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">See submission instructions</h3>
            <p className="text-xs text-gray-500 mt-0.5">Get guidelines and requirements</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 ml-11">
        Detailed instructions on how to submit, file format and requirements for this assignment.
      </p>
      <button 
        onClick={onSeeInstructions}
        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all gap-2 shadow-md hover:shadow-lg">
        <ExternalLink className="w-4 h-4" />
        See instructions
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SubmissionGuideCard;