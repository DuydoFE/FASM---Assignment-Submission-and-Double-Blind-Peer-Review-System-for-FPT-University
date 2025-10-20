import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';

const AddCriterionModal = ({ isOpen, onClose, onSubmit, rubricId, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        weight: '',
        maxScore: '',
        scoringType: 'Scale',
        scoreLabel: '0-10'
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.weight) {
            newErrors.weight = 'Weight is required';
        } else if (isNaN(formData.weight) || formData.weight < 0 || formData.weight > 100) {
            newErrors.weight = 'Weight must be between 0 and 100';
        }
        if (!formData.maxScore) {
            newErrors.maxScore = 'Max Score is required';
        } else if (isNaN(formData.maxScore) || formData.maxScore < 0) {
            newErrors.maxScore = 'Max Score must be a positive number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            weight: '',
            maxScore: '',
            scoringType: 'Scale',
            scoreLabel: '0-10'
        });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const criterionData = {
            ...formData,
            rubricId: parseInt(rubricId),
            weight: parseInt(formData.weight),
            maxScore: parseInt(formData.maxScore)
        };

        try {
            await onSubmit(criterionData);
            resetForm(); // Reset form after successful submission
        } catch (error) {
            console.error('Error submitting criterion:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Criterion</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter criterion title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter criterion description"
                                rows="3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (%) *
                            </label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className={`w-full px-3 py-2 border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter weight percentage"
                                min="0"
                                max="100"
                            />
                            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Score *
                            </label>
                            <input
                                type="number"
                                value={formData.maxScore}
                                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                                className={`w-full px-3 py-2 border ${errors.maxScore ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Enter max score"
                                min="0"
                            />
                            {errors.maxScore && <p className="text-red-500 text-xs mt-1">{errors.maxScore}</p>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Criterion'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCriterionModal;