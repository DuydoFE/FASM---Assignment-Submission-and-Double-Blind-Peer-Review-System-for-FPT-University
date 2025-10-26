import React from 'react';
import { Trash2, X } from 'lucide-react';

const DeleteStudentModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  student, 
  deleting,
  courseInfo 
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Remove Student</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to remove{' '}
            <span className="font-semibold">{student.name}</span> from Course{' '}
            {courseInfo?.courseCode} - Class {courseInfo?.className}?
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentModal;