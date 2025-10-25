import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const CreateRubricTemplateModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel 
}) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(title);
    setTitle('');
  };

  const handleCancel = () => {
    onCancel();
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Create New Template</h3>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter template name..."
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              Create a reusable template that can be used across multiple assignments
            </p>
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
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRubricTemplateModal;