
import React from 'react';

// 👉 1. Thêm prop `hasError` để nhận biết trạng thái lỗi từ component cha
const CriterionForm = ({ criterion, score, onScoreChange, hasError }) => {
  const { criteriaName, description, weight, maxScore, criteriaId } = criterion;

  const handleInputChange = (e) => {
    // Chỉ truyền giá trị chuỗi lên component cha để xử lý logic
    onScoreChange(criteriaId, e.target.value);
  };

  return (
    <div className="border-t py-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-800">{criteriaName}</h4>
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
      {/* Slider có thể bị ẩn hoặc xóa đi nếu bạn không muốn dùng nó nữa */}
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