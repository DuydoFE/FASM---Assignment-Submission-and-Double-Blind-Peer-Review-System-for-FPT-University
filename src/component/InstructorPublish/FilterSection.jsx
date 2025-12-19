import React from 'react';
import { Select, Button } from 'antd';
import { Eye, Loader2 } from 'lucide-react';

const FilterSection = ({
  assignments,
  selectedAssignmentId,
  setSelectedAssignmentId,
  loading,
  onViewGrades
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm text-gray-600 mb-2">Assignment</label>
        <Select
          value={selectedAssignmentId || undefined}
          onChange={(value) => setSelectedAssignmentId(value)}
          disabled={loading.assignments}
          placeholder="Select Assignment"
          className="w-full"
          size="large"
          options={assignments.map(assignment => ({
            value: assignment.assignmentId,
            label: assignment.title
          }))}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">&nbsp;</label>
        <Button
          onClick={onViewGrades}
          disabled={!selectedAssignmentId || loading.summary}
          type="primary"
          size="large"
          className="w-full bg-green-600 hover:!bg-green-700"
          icon={loading.summary ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
        >
          View Scores
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;