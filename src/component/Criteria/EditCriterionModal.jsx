import React, { useState, useEffect, useMemo } from 'react';
import { X, Loader } from 'lucide-react';
import { Input } from "antd";
const { TextArea } = Input;

const EditCriterionModal = ({ isOpen, onClose, onSubmit, criterion, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        weight: '',
        maxScore: ''
    });

    const [errors, setErrors] = useState({});

    // Load criterion data when modal opens
    useEffect(() => {
        if (isOpen && criterion) {
            setFormData({
                title: criterion.title || '',
                description: criterion.description || '',
                weight: criterion.weight !== undefined && criterion.weight !== null ? criterion.weight : '',
                maxScore: criterion.maxScore !== undefined && criterion.maxScore !== null ? criterion.maxScore : ''
            });
            setErrors({});
        }
    }, [isOpen, criterion]);

    // Check if form has been modified and is valid
    const isFormValid = useMemo(() => {
        // Check required fields are not empty
        const hasTitle = formData.title.trim() !== '';
        const hasWeight = formData.weight !== '' && formData.weight !== null && formData.weight !== undefined;
        const hasMaxScore = formData.maxScore !== '' && formData.maxScore !== null && formData.maxScore !== undefined;

        // Validate weight and maxScore values
        const weightValue = Number(formData.weight);
        const maxScoreValue = Number(formData.maxScore);
        const isWeightValid = !isNaN(weightValue) && weightValue >= 0 && weightValue <= 100;
        const isMaxScoreValid = !isNaN(maxScoreValue) && maxScoreValue >= 0;

        return hasTitle && hasWeight && hasMaxScore && isWeightValid && isMaxScoreValid;
    }, [formData]);

    // Check if form has been modified from original values
    const hasChanges = useMemo(() => {
        if (!criterion) return false;

        const originalTitle = criterion.title || '';
        const originalDescription = criterion.description || '';
        const originalWeight = criterion.weight !== undefined && criterion.weight !== null ? String(criterion.weight) : '';
        const originalMaxScore = criterion.maxScore !== undefined && criterion.maxScore !== null ? String(criterion.maxScore) : '';

        return (
            formData.title !== originalTitle ||
            formData.description !== originalDescription ||
            String(formData.weight) !== originalWeight ||
            String(formData.maxScore) !== originalMaxScore
        );
    }, [formData, criterion]);

    // Button should be disabled if form is invalid, no changes made, or submitting
    const isButtonDisabled = !isFormValid || !hasChanges || isSubmitting;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const criterionData = {
            criteriaId: criterion.criteriaId,
            rubricId: criterion.rubricId,
            title: formData.title,
            description: formData.description,
            weight: parseInt(formData.weight),
            maxScore: parseInt(formData.maxScore),
            scoringType: 'Scale',
            scoreLabel: '0-10'
        };

        try {
            await onSubmit(criterionData);
        } catch (error) {
            console.error('Error updating criterion:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-white px-6 py-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Criterion</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-900/80 hover:text-gray-900 hover:bg-gray-900/20 transition-all rounded-lg p-1.5"
                            disabled={isSubmitting}
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6">
                    <div className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-4 py-2.5 ${errors.title ? 'border-red-500' : 'border-gray-300' }`}
                                placeholder="e.g., Code Quality"
                                disabled={isSubmitting}
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
                                className="w-full px-4 py-2.5"
                                placeholder="Describe what this criterion evaluates..."
                                rows="3"
                                disabled={isSubmitting}
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
                                    className={`w-full px-4 py-2.5 ${errors.weight ? 'border-red-500' : 'border-gray-300' }`}
                                    placeholder="0-100"
                                    min="0"
                                    max="100"
                                    disabled={isSubmitting}
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
                                    className={`w-full px-4 py-2.5 ${errors.maxScore ? 'border-red-500' : 'border-gray-300' }`}
                                    placeholder="Points"
                                    min="0"
                                    disabled={isSubmitting}
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
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isButtonDisabled}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Editing...
                                </>
                            ) : (
                                'Edit Criterion'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCriterionModal;