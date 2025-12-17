import React from 'react';
import { Loader2, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import { Input, Button } from 'antd';

const { TextArea } = Input;

const GradingRightColumn = ({
    criteriaList,
    updateCriteriaScore,
    calculateTotalScore,
    handleSubmitGrade,
    submitting,
    submitButtonText,
    generalFeedback,
    setGeneralFeedback,
    handleAiSummary,
    isAiLoading,
    aiError 
}) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Grading Criteria */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <span className="text-xl mr-2">📋</span>
                        <h2 className="font-semibold text-gray-900 text-lg">Grading Criteria</h2>
                    </div>
                    <Button
                        onClick={handleAiSummary}
                        disabled={isAiLoading}
                        type="primary"
                        className="bg-purple-600 hover:!bg-purple-700"
                        icon={isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    >
                        Summary By AI
                    </Button>
                </div>

                <div className="space-y-6">
                    {(criteriaList || []).map((c) => {
                        const isErrorSummary = c.aiSummary && c.aiSummary.startsWith('⚠');

                        return (
                            <div key={c.criteriaId} className="border border-gray-200 rounded-lg p-5">
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
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            value={c.score === null ? '' : c.score}
                                            onChange={(e) => {
                                                let value = parseFloat(e.target.value);
                                                if (isNaN(value)) value = null;
                                                else value = Math.min(10, Math.max(0, value));
                                                updateCriteriaScore(c.criteriaId, 'score', value);
                                            }}
                                            className="w-full px-3 py-2 "
                                            placeholder="Enter score"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Feedback
                                        </label>
                                        <TextArea
                                            value={c.feedback}
                                            onChange={(e) => updateCriteriaScore(c.criteriaId, 'feedback', e.target.value)}
                                            rows={4}
                                            placeholder="Enter your detailed comment..."
                                            style={{
                                                borderRadius: '8px',
                                                fontSize: '15px',
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-left">
                                    {isAiLoading ? (
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            <span>Generating summary...</span>
                                        </div>
                                    ) : !aiError && !c.aiSummary ? (
                                        <div className="text-gray-500 text-center">
                                            <Zap className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                            <p className="font-semibold">No AI Summary yet.</p>
                                            <p className="text-xs mt-1">Press the 'Summary By AI' button to generate an automated analysis.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {aiError && (
                                                <div className="flex items-start text-red-700 bg-red-50 p-2 rounded-md">
                                                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm font-semibold">{aiError}</span>
                                                </div>
                                            )}
                                            {c.aiSummary && (
                                                isErrorSummary ? (
                                                    <div className="text-red-600">
                                                        <span className="text-sm font-medium">{c.aiSummary}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-800">{c.aiSummary}</p>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Auto Calculation */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <span className="text-xl mr-2">🧮</span>
                    <h2 className="font-semibold text-gray-900">Auto Score Calculation</h2>
                </div>
                <div className="space-y-2 text-sm mb-4">
                    {criteriaList.map((c) => (
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
                    <TextArea
                        value={generalFeedback}
                        onChange={(e) => setGeneralFeedback(e.target.value)}
                        rows={6}
                        placeholder="Enter a general comment on the student's submission..."
                        style={{
                            borderRadius: '8px',
                            fontSize: '15px',
                        }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        This comment will be displayed along with the student's overall grade.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    onClick={handleSubmitGrade}
                    disabled={submitting}
                    type="primary"
                    size="large"
                    className="flex-1 bg-orange-500 hover:!bg-orange-600"
                    icon={submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>📋</span>}
                >
                    {submitting ? "Submitting..." : submitButtonText}
                </Button>
            </div>
        </div>
    );
};

export default GradingRightColumn;