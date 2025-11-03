import React from 'react';

const CriterionForm = ({ criterion, score, onScoreChange, hasError }) => {
  // 👉 1. Lấy cả 'title' và 'criteriaName' từ prop.
  const { title, criteriaName, description, weight, maxScore, criteriaId } = criterion;

  const handleInputChange = (e) => {
    onScoreChange(criteriaId, e.target.value);
  };

  return (
    <div className="border-t py-4">
      <div className="flex justify-between items-start">
        <div>
          {/* 👉 2. Ưu tiên hiển thị 'title'. Nếu 'title' không tồn tại, sẽ hiển thị 'criteriaName'. */}
          <h4 className="font-bold text-gray-800">{title || criteriaName}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <span className="font-semibold text-blue-600">{weight}%</span>
          
          <input
            type="number" 
            min="0"
            max={maxScore}
            value={score === null ? '' : score} 
            onChange={handleInputChange}
            placeholder="0" 
            className={`w-20 text-center font-bold text-lg border-b-2 p-1 focus:outline-none focus:border-blue-500
              ${hasError ? 'border-red-500' : 'border-gray-300'}
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            `}
          />
          <span className="text-gray-500">/ {maxScore}</span>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max={maxScore}
        value={score === null ? 0 : score} // Range input cần một giá trị số
        onChange={handleInputChange}
        className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default CriterionForm;