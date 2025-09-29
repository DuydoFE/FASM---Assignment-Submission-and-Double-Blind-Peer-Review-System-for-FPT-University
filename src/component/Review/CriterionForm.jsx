import React from 'react';

const CriterionForm = ({ criterion, score, onScoreChange }) => {
  const progressPercentage = (score / criterion.maxScore) * 100;

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    if (value > criterion.maxScore) value = criterion.maxScore;
    if (value < 0) value = 0;
    onScoreChange(criterion.criteriaId, value);
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-gray-800">{criterion.title}</h4>
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-semibold">{criterion.weight}%</span>
          <div className="flex items-baseline">
             <input 
                type="number"
                value={score}
                onChange={handleInputChange}
                className="w-16 text-right font-bold text-lg border-b-2 focus:outline-none focus:border-blue-500"
             />
             <span className="text-gray-500">/{criterion.maxScore}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{criterion.description}</p>
      
      {/* Thanh progress/slider */}
      <div className="relative h-2 bg-gray-200 rounded-full">
         <div 
            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
         ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0</span>
        <span>{criterion.maxScore}</span>
      </div>
    </div>
  );
};

export default CriterionForm;