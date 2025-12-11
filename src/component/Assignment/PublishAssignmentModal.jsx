import React from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';

const PublishAssignmentModal = ({ isOpen, onClose, onConfirm, assignment }) => {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Upload className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Publish Assignment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-gray-700">
            Are you sure you want to publish this assignment? Once published, students will be able to view and submit their work.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Assignment Title:
            </p>
            <p className="text-base font-semibold text-gray-900">
              {assignment.title}
            </p>
            
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Deadline:</span> {assignment.deadline} at {assignment.time}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Review Deadline:</span> {assignment.reviewDeadline}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> After publishing, you can still extend deadlines but cannot edit the assignment details.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(assignment.id || assignment.assignmentId)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Publish Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishAssignmentModal;