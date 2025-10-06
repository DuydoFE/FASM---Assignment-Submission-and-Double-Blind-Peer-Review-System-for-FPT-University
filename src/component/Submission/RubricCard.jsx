import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { assignmentService } from '../../service/assignmentService';

const RubricCard = ({ assignmentId }) => {
  const [rubric, setRubric] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRubric = async () => {
      if (!assignmentId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await assignmentService.getAssignmentRubric(assignmentId);
        setRubric(data);
      } catch (err) {
        setError("Không thể tải được tiêu chí chấm điểm. Vui lòng thử lại.");
        console.error("Error fetching rubric:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRubric();
  }, [assignmentId]);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        Đang tải tiêu chí chấm điểm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600 text-center">
        {error}
      </div>
    );
  }

  if (!rubric || !rubric.criteria || rubric.criteria.length === 0) {
    // Không hiển thị gì nếu không có rubric hoặc không có tiêu chí nào
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      {/* Tiêu đề card */}
      <div className="flex items-center mb-6">
        <ClipboardList className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">Tiêu chí chấm điểm</h2>
      </div>

      {/* Danh sách các tiêu chí */}
      <div className="space-y-6">
        {rubric.criteria.map((criterion, index) => (
          <div 
            key={criterion.criteriaId} 
            className="pt-6 border-t border-blue-200 first:pt-0 first:border-t-0"
          >
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {`${index + 1}. ${criterion.title}`}
              </h3>
              <span className="text-blue-600 font-bold text-lg whitespace-nowrap">
                {`${criterion.weight * 100}%`}
              </span>
            </div>
            
            {/* Mô tả chi tiết của tiêu chí */}
            {criterion.description && (
              <div className="mt-2 pl-1 text-gray-700 text-sm">
                {/* Tách description thành từng dòng để hiển thị dạng bullet list */}
                {criterion.description.split('\n').map((line, lineIndex) => (
                  line.trim() && (
                    <p key={lineIndex} className="flex items-start">
                      <span className="mr-2 mt-1.5 text-xs">●</span>
                      <span>{line.replace(/^- /, '')}</span>
                    </p>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RubricCard;