import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const GradingRightColumn = ({
    criteriaList,
    criteriaFeedbacks, 
    updateCriteriaScore,
    calculateTotalScore,
    handleSubmitGrade,
    submitting,
    submitButtonText,
    generalFeedback,
    setGeneralFeedback
}) => {
    const mergedCriteria = criteriaList.map(criteria => {
        const feedback = criteriaFeedbacks?.find(f => f.criteriaId === criteria.criteriaId);
        return {
            ...criteria,
            score: feedback?.scoreAwarded || criteria.score || 0,
            feedback: feedback?.feedback || criteria.feedback || ''
        };
    });

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Grading Criteria */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                    <span className="text-xl mr-2">📋</span>
                    <h2 className="font-semibold text-gray-900 text-lg">Grading Criteria</h2>
                </div>

                <div className="space-y-6">
                    {mergedCriteria.map((c) => (
                        <div key={c.criteriaId} className="border border-gray-300 rounded-lg p-5">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {c.order}. {c.name}
                                </h3>
                                {c.description && (
                                    <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                                )}
                                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                    Weight: {c.weight}%
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Score (0-10)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={c.score}
                                        onChange={(e) => {
                                            let value = parseFloat(e.target.value);
                                            if (isNaN(value)) value = 0;
                                            value = Math.round(value);
                                            updateCriteriaScore(c.criteriaId, 'score', Math.min(10, Math.max(0, value)));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Feedback
                                    </label>
                                    <textarea
                                        value={c.feedback}
                                        onChange={(e) => updateCriteriaScore(c.criteriaId, 'feedback', e.target.value)}
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        placeholder="Nhập nhận xét chi tiết..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Auto Calculation */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <span className="text-xl mr-2">🧮</span>
                    <h2 className="font-semibold text-gray-900">Auto Score Calculation</h2>
                </div>

                <div className="space-y-2 text-sm mb-4">
                    {mergedCriteria.map((c) => (
                        <div key={c.criteriaId} className="flex justify-between text-gray-700">
                            <span>{c.order}. {c.name} ({c.weight}%):</span>
                            <span className="font-medium">
                                {((Number(c.score) || 0) * (Number(c.weight) || 0) / 100).toFixed(1)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total Score:</span>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-green-600">
                            {calculateTotalScore()}
                        </span>
                        <span className="text-gray-500">/ 10</span>
                    </div>
                </div>
            </div>

            {/* General Feedback */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <span className="text-xl mr-2">💬</span>
                    <h2 className="font-semibold text-gray-900">General Feedback</h2>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overall Comments for Student
                    </label>
                    <textarea
                        value={generalFeedback}
                        onChange={(e) => setGeneralFeedback(e.target.value)}
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Nhập nhận xét tổng quan về bài làm của sinh viên..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Nhận xét này sẽ được hiển thị cùng với điểm tổng kết cho sinh viên
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleSubmitGrade}
                    disabled={submitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <span>📋</span>
                            <span>{submitButtonText}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default GradingRightColumn;