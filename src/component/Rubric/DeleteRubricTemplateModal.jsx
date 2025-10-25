import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteRubricTemplateModal = ({ 
  isOpen, 
  template, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Delete Rubric Template</h3>
          </div>

          {template && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete the template{' '}
                <span className="font-bold">{template.title}</span>?
              </p>
              {template.assignments && template.assignments.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This template is currently used in{' '}
                    <span className="font-semibold">{template.assignments.length}</span>{' '}
                    assignment{template.assignments.length > 1 ? 's' : ''}.
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-red-600 mb-6">
            <strong>Note:</strong> This action cannot be undone. All criteria templates 
            associated with this rubric template will also be deleted.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              Delete Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRubricTemplateModal;