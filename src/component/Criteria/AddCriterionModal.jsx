import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Input } from 'antd';

const { TextArea } = Input;

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
            // Only reset form if submission was successful
            resetForm();
        } catch (error) {
            // Don't reset form on error - keep user's input
            console.error('Error submitting criterion:', error);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-white px-6 py-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-black">Add New Criterion</h2>
                        
                    </div>
                </div>


                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Code Quality"
                                disabled={isSubmitting}
                                status={errors.title ? 'error' : ''}
                                size="large"
                            />
                            {errors.title && (
                                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <TextArea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what this criterion evaluates..."
                                rows={3}
                                disabled={isSubmitting}
                                size="large"
                            />
                        </div>

                        {/* Weight and Max Score Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Weight */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Weight (%) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    placeholder="0-100"
                                    min={0}
                                    max={100}
                                    disabled={isSubmitting}
                                    status={errors.weight ? 'error' : ''}
                                    size="large"
                                />
                                {errors.weight && (
                                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                        {errors.weight}
                                    </p>
                                )}
                            </div>

                            {/* Max Score */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Max Score <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    value={formData.maxScore}
                                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                                    placeholder="Points"
                                    min={0}
                                    disabled={isSubmitting}
                                    status={errors.maxScore ? 'error' : ''}
                                    size="large"
                                />
                                {errors.maxScore && (
                                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                                        {errors.maxScore}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
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
                </form>
            </div>
        </div>
    );
};

export default AddCriterionModal;