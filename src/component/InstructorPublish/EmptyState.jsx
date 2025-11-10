import React from 'react';
import { Eye, BookOpen, Users, FileText, ArrowRight, CheckCircle2, Search } from 'lucide-react';

const EmptyState = ({ selectedCourseId, selectedClassId, selectedAssignmentId }) => {
  return (
    <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-100">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <Eye className="w-10 h-10 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          View Published Grades
        </h2>
        <p className="text-gray-600 mb-8">
          Select a course, class, and assignment above to view and manage published grades
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${selectedCourseId ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">1. Select Course</span>
            {selectedCourseId && <CheckCircle2 className="w-5 h-5" />}
          </div>

          <ArrowRight className={`w-5 h-5 ${selectedCourseId ? 'text-blue-500' : 'text-gray-300'}`} />

          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${selectedClassId ? 'bg-purple-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>
            <Users className="w-5 h-5" />
            <span className="font-medium">2. Select Class</span>
            {selectedClassId && <CheckCircle2 className="w-5 h-5" />}
          </div>

          <ArrowRight className={`w-5 h-5 ${selectedClassId ? 'text-purple-500' : 'text-gray-300'}`} />

          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${selectedAssignmentId ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'}`}>
            <FileText className="w-5 h-5" />
            <span className="font-medium">3. Select Assignment</span>
            {selectedAssignmentId && <CheckCircle2 className="w-5 h-5" />}
          </div>
        </div>

        {/* Features list */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Search & Filter</h3>
            <p className="text-sm text-gray-600">Quickly find students and filter by submission status</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Manage Grades</h3>
            <p className="text-sm text-gray-600">Review and edit grades before publishing to students</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Publication Control</h3>
            <p className="text-sm text-gray-600">Publish final grades to students when ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;