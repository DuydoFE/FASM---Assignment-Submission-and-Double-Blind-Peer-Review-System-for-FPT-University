import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { Input, Modal, Button } from "antd";
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

    return (
        <Modal
            open={isOpen}
            onCancel={handleClose}
            width={600}
            title={
                <h2 className="text-2xl font-bold text-black">Add New Criterion</h2>
            }
            footer={
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        icon={isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : null}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Criterion'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit}>
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
                                    placeholder="Scores"
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
                </form>
        </Modal>
    );
};

export default AddCriterionModal;