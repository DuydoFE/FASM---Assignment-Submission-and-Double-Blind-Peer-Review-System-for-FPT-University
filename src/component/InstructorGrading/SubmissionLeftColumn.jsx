import React, { useState } from 'react';
import { Download, Eye, Star, ChevronDown } from 'lucide-react';
import PeerReviewDetailModal from './PeerReviewDetailModal';

const SubmissionLeftColumn = ({
    submissionDetails,
    peerReviews,
    showAllReviews,
    setShowAllReviews,
    formatDateTime,
    getFileNameFromUrl,
    getStatusBadge,
    calculateAveragePeerScore
}) => {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const statusBadge = getStatusBadge(submissionDetails.status);
    const assignment = submissionDetails.assignment || {};
    const visibleReviews = showAllReviews ? peerReviews : peerReviews.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        👤
                    </div>
                    <h2 className="font-semibold text-gray-900">Student Information</h2>
                </div>
                <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Full Name:</span> <span className="font-medium">{submissionDetails.studentName || 'N/A'}</span></p>
                    <p><span className="text-gray-600">Student Code:</span> <span className="font-medium">{submissionDetails.studentCode || 'N/A'}</span></p>
                    <p><span className="text-gray-600">Course:</span> <span className="font-medium">{submissionDetails.courseName || 'N/A'}</span></p>
                    <p><span className="text-gray-600">Class:</span> <span className="font-medium">{submissionDetails.className || 'N/A'}</span></p>
                </div>
            </div>

            {/* Submission Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h2 className="font-semibold text-gray-900">Submission Status</h2>
                </div>
                <div className="flex gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.class}`}>
                        {statusBadge.text}
                    </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>Submitted At: {formatDateTime(submissionDetails.submittedAt)}</p>
                    <p>Deadline: {formatDateTime(assignment.deadline)}</p>
                    {submissionDetails.gradedAt && (
                        <p>Graded At: {formatDateTime(submissionDetails.gradedAt)}</p>
                    )}
                </div>
            </div>

            {/* Submitted Files */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-gray-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <h2 className="font-semibold text-gray-900">Submitted File</h2>
                </div>
                {submissionDetails.fileUrl ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                                📄
                            </div>
                            <div>
                                <p className="font-medium text-sm text-gray-900">{submissionDetails.fileName || getFileNameFromUrl(submissionDetails.fileUrl)}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={submissionDetails.fileUrl}
                                download
                                className="p-2 hover:bg-blue-100 rounded"
                            >
                                <Download className="w-4 h-4 text-blue-600" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No file submitted</p>
                )}
            </div>

            {/* Peer Reviews */}
            {peerReviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            <h2 className="font-semibold text-gray-900">Peer Reviews</h2>
                        </div>
                        <button
                            onClick={() => setIsDetailModalOpen(true)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            View Detail
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                        Average Score: <span className="font-semibold text-blue-600">{parseFloat(calculateAveragePeerScore()).toFixed(1)}/10</span>
                    </p>

                    <div className="space-y-3">
                        {visibleReviews.map((review, index) => {
                            const score10 = review.overallScore ? parseFloat(review.overallScore).toFixed(1) : "0.0";
                            return (
                                <div key={review.reviewId || index} className="p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">
                                                    {review.reviewerName || "Anonymous"}
                                                </p>
                                                <p className="text-xs text-gray-500">{formatDateTime(review.reviewedAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-semibold text-gray-800">{score10}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">{review.generalFeedback || "No feedback provided"}</p>
                                </div>
                            );
                        })}
                    </div>

                    {!showAllReviews && peerReviews.length > 3 && (
                        <button
                            onClick={() => setShowAllReviews(true)}
                            className="w-full mt-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                            Show More ({peerReviews.length - 3} reviews)
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    )}

                    {/* Peer Review Detail Modal */}
                    <PeerReviewDetailModal
                        isOpen={isDetailModalOpen}
                        onClose={() => setIsDetailModalOpen(false)}
                        peerReviews={peerReviews}
                        formatDateTime={formatDateTime}
                    />
                </div>
            )}
        </div>
    );
};

export default SubmissionLeftColumn;