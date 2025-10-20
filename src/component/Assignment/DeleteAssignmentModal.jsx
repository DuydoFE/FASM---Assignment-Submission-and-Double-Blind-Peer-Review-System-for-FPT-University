import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteAssignmentModal = ({ isOpen, onClose, onConfirm, assignment }) => {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Assignment</h2>
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
            Are you sure you want to delete this assignment? This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Assignment Title:
            </p>
            <p className="text-base font-semibold text-gray-900">
              {assignment.title}
            </p>
            
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Deadline:</span> {assignment.deadline} at {assignment.time}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Submissions:</span> {assignment.submitted}/{assignment.total}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Warning:</span> All student submissions and reviews associated with this assignment will also be deleted.
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
            onClick={() => onConfirm(assignment.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Delete Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAssignmentModal;