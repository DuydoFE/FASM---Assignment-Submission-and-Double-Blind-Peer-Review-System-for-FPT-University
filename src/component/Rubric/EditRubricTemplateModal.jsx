import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';

const EditRubricTemplateModal = ({ 
  isOpen, 
  template,
  onConfirm, 
  onCancel 
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (template) {
      setTitle(template.title || '');
    }
  }, [template]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(title);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Edit2 className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Edit Template</h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter template name..."
              autoFocus
            />
            {template && template.assignments && template.assignments.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> This template is used in{' '}
                  <span className="font-semibold">{template.assignments.length}</span>{' '}
                  assignment{template.assignments.length > 1 ? 's' : ''}. Changes will affect all assignments using this template.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!title.trim()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRubricTemplateModal;