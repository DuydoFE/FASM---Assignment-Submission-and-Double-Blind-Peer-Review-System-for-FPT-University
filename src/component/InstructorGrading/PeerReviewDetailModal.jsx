import React from 'react';
import { X, Star, User, Calendar, FileText } from 'lucide-react';

const PeerReviewDetailModal = ({ isOpen, onClose, peerReviews, formatDateTime }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Peer Review Details</h2>
                            <p className="text-sm text-gray-500">{peerReviews.length} review(s) submitted</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                    {peerReviews.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500">No peer reviews available</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {peerReviews.map((review, index) => (
                                <div 
                                    key={review.reviewId || index} 
                                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                                >
                                    {/* Review Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {review.reviewerName || "Anonymous"}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                                            {review.studentCode || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="font-bold text-gray-800">
                                                        {review.overallScore ? parseFloat(review.overallScore).toFixed(1) : "0.0"}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">/10</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDateTime(review.reviewedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* General Feedback */}
                                    <div className="px-5 py-4 border-b border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            General Feedback
                                        </h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {review.generalFeedback || "No general feedback provided"}
                                        </p>
                                    </div>

                                    {/* Criteria Feedbacks */}
                                    {review.criteriaFeedbacks && review.criteriaFeedbacks.length > 0 && (
                                        <div className="px-5 py-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <Star className="w-4 h-4 text-gray-500" />
                                                Criteria Scores
                                            </h4>
                                            <div className="space-y-3">
                                                {review.criteriaFeedbacks.map((criteria, criteriaIndex) => (
                                                    <div 
                                                        key={criteria.criteriaFeedbackId || criteriaIndex}
                                                        className="bg-gray-50 rounded-lg p-4"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-gray-800">
                                                                {criteria.criteriaTitle || "Untitled Criteria"}
                                                            </h5>
                                                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-gray-200">
                                                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                                <span className="text-sm font-semibold text-gray-700">
                                                                    {criteria.scoreAwarded ? parseFloat(criteria.scoreAwarded).toFixed(1) : "0.0"}
                                                                </span>
                                                                <span className="text-xs text-gray-500">/10</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {criteria.feedback || "No feedback provided"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PeerReviewDetailModal;