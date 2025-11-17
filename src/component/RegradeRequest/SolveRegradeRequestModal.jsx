import React, { useState } from 'react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { reviewRegradeRequest } from '../../service/regradeService';
import { getCurrentAccount } from '../../utils/accountUtils';

const SolveRegradeRequestModal = ({ request, onClose, onSubmit }) => {
    const currentUser = getCurrentAccount();
    const [decision, setDecision] = useState('approve'); // 'approve' or 'reject'
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            setShowError(true);
            return;
        }

        try {
            setIsSubmitting(true);
            setShowError(false);

            const data = {
                requestId: request.requestId,
                status: decision === 'approve' ? 'Approved' : 'Rejected',
                resolutionNotes: feedback.trim(),
                reviewedByUserId: currentUser?.id || 0
            };

            await reviewRegradeRequest(data);

            // Gọi callback để update UI
            onSubmit(decision, feedback);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Handle Regrade Request</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {request.name} - {request.courseName} - {request.className} - {request.assignmentTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Request Details */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2">Request Details</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Score:</span>
                                        <span className="font-semibold text-red-600">{request.currentGrade || 'N/A'}</span>
                                    </div>

                                    <div>
                                        <span className="text-gray-600 font-medium">Student's Reason:</span>
                                        <p className="text-gray-800 mt-1 leading-relaxed">
                                            {request.reason}
                                        </p>
                                    </div>

                                    <div className="flex justify-between pt-2 border-t border-blue-200">
                                        <span className="text-gray-600">Request Time:</span>
                                        <span className="text-gray-800">{request.requestTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decision */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Decision</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Approve */}
                            <button
                                onClick={() => setDecision('approve')}
                                disabled={isSubmitting}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${decision === 'approve'
                                    ? 'bg-green-50 border-green-500 shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-green-300'
                                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${decision === 'approve'
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-gray-300'
                                    }`}>
                                    {decision === 'approve' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">Approve Request</div>
                                    <div className="text-xs text-gray-600">Adjust score as requested</div>
                                </div>
                            </button>

                            {/* Reject */}
                            <button
                                onClick={() => setDecision('reject')}
                                disabled={isSubmitting}
                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${decision === 'reject'
                                    ? 'bg-red-50 border-red-500 shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-red-300'
                                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${decision === 'reject'
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300'
                                    }`}>
                                    {decision === 'reject' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">Reject Request</div>
                                    <div className="text-xs text-gray-600">Keep current score</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Reason for Student */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Reason for Student</h3>
                        <textarea
                            value={feedback}
                            onChange={(e) => {
                                setFeedback(e.target.value);
                                if (showError && e.target.value.trim()) {
                                    setShowError(false);
                                }
                            }}
                            disabled={isSubmitting}
                            placeholder="Enter detailed reason for the student about your decision..."
                            className={`w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${showError ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {showError && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>Please enter feedback for the student</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Confirm Decision'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolveRegradeRequestModal;