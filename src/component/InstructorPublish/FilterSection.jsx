import React from 'react';
import { ChevronDown, Eye, Loader2 } from 'lucide-react';

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
        <div className="relative">
          <select 
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loading.courses}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">Class</label>
        <div className="relative">
          <select 
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            disabled={!selectedCourseId || loading.classes}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.courseInstanceId} value={cls.courseInstanceId}>
                {cls.sectionCode}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">Assignment</label>
        <div className="relative">
          <select 
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            disabled={!selectedClassId || loading.assignments}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Assignment</option>
            {assignments.map(assignment => (
              <option key={assignment.assignmentId} value={assignment.assignmentId}>
                {assignment.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
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