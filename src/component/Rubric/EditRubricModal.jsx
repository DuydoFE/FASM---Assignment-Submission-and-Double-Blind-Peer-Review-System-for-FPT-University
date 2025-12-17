import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from 'antd';

function EditRubricModal({ isOpen, onClose, onSubmit, rubric, isSubmitting }) {
    const [title, setTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');

    useEffect(() => {
        if (rubric) {
            setTitle(rubric.title || '');
            setOriginalTitle(rubric.title || '');
        }
    }, [rubric]);

    // Check if value has changed from original
    const hasChanged = title.trim() !== originalTitle.trim();
    const isValidTitle = title.trim().length > 0;
    const canSubmit = isValidTitle && hasChanged;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!canSubmit) {
            return;
        }

        onSubmit({
            rubricId: rubric.rubricId,
            title: title.trim()
        });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setTitle('');
            setOriginalTitle('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Rubric</h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rubric Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter rubric title"
                                disabled={isSubmitting}
                                required
                                size="large"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !canSubmit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!canSubmit ? (isValidTitle ? 'No changes made' : 'Title is required') : ''}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Rubric'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditRubricModal;