import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Input } from 'antd';
import { completeRegradeRequest } from '../../service/regradeService';
import { toast } from 'react-toastify';
import { getCurrentAccount } from '../../utils/accountUtils';

const { TextArea } = Input;

const CompleteRegradeRequestModal = ({ request, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentUser = getCurrentAccount();

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a completion reason');
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = {
                requestId: request.requestId,
                status: 'Completed',
                resolutionNotes: reason,
                reviewedByUserId: currentUser?.id || 0
            };
            
            await completeRegradeRequest(submitData);
            setReason('');
            onSubmit(reason);
        } catch (error) {
            console.error('Error submitting completion:', error);
            toast.error('Failed to mark request as complete');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Mark as Complete</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Student Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Student Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="text-sm font-medium text-gray-900">{request.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Student Code</p>
                                <p className="text-sm font-medium text-gray-900">{request.mssv}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-500">Assignment</p>
                                <p className="text-sm font-medium text-gray-900">{request.assignmentTitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Original Request */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Request Reason</h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">{request.reason}</p>
                        </div>
                    </div>

                    {/* Resolution Notes (if any) */}
                    {request.resolutionNotes && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Resolution Notes</h3>
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700">{request.resolutionNotes}</p>
                            </div>
                        </div>
                    )}

                    {/* Completion Reason */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Completion Reason <span className="text-red-500">*</span>
                        </label>
                        <TextArea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide details about how this request was completed..."
                            rows={5}
                            style={{
                                borderRadius: '8px',
                                fontSize: '15px',
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Describe what actions were taken to complete this regrade request
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim() || isSubmitting}
                            className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isSubmitting ? 'Completing...' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteRegradeRequestModal;