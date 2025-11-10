import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

const AutoGradeZeroModal = ({ isOpen, onClose, onConfirm, loading, notSubmittedCount }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Auto Grade with Zero Points
          </h3>
        </div>
        <p className="text-gray-600 mb-2">
          This will automatically assign <span className="font-semibold text-red-600">0 points</span> to all students with "Not Submitted" status.
        </p>
        <p className="text-gray-600 mb-6">
          <span className="font-semibold">{notSubmittedCount || 0} student(s)</span> will be affected. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center disabled:bg-gray-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Confirm Auto Grade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoGradeZeroModal;