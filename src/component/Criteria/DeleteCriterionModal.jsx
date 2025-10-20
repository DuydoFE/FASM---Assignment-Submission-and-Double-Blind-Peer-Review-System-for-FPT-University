import React from 'react';
import { X, Loader, AlertTriangle } from 'lucide-react';

const DeleteCriterionModal = ({ isOpen, onClose, onConfirm, criterionTitle, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray">Delete Criterion</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 transition-all rounded-lg p-1.5"
                            disabled={isDeleting}
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 text-base leading-relaxed">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-gray-900">{criterionTitle}</span>{' '}
                            criterion?
                        </p>
                        <p className="text-sm text-gray-600 mt-3">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCriterionModal;