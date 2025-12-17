import React from 'react';
import { Select } from 'antd';
import { Eye, Loader2 } from 'lucide-react';

const FilterSection = ({
  courses,
  classes,
  assignments,
  selectedCourseId,
  selectedClassId,
  selectedAssignmentId,
  setSelectedCourseId,
  setSelectedClassId,
  setSelectedAssignmentId,
  loading,
  onViewGrades
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div>
        <label className="block text-sm text-gray-600 mb-2">Course</label>
        <Select
          value={selectedCourseId || undefined}
          onChange={(value) => setSelectedCourseId(value)}
          disabled={loading.courses}
          placeholder="Select Course"
          className="w-full"
          size="large"
          options={courses.map(course => ({
            value: course.courseId,
            label: course.courseName
          }))}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">Class</label>
        <Select
          value={selectedClassId || undefined}
          onChange={(value) => setSelectedClassId(value)}
          disabled={!selectedCourseId || loading.classes}
          placeholder="Select Class"
          className="w-full"
          size="large"
          options={classes.map(cls => ({
            value: cls.courseInstanceId,
            label: cls.sectionCode
          }))}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">Assignment</label>
        <Select
          value={selectedAssignmentId || undefined}
          onChange={(value) => setSelectedAssignmentId(value)}
          disabled={!selectedClassId || loading.assignments}
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
        <button 
          onClick={onViewGrades}
          disabled={!selectedCourseId || !selectedClassId || !selectedAssignmentId || loading.summary}
          className="w-full px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading.summary ? (
            <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Eye className="inline w-4 h-4 mr-2" />
          )}
          View Grades
        </button>
      </div>
    </div>
  );
};

export default FilterSection;