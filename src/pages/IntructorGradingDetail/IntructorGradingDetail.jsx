import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Eye, Star, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submissionService } from '../../service/submissionService';
import { getPeerReviewsBySubmissionId } from '../../service/instructorSubmission';
import { gradeSubmission } from '../../service/instructorGrading';
import { getCurrentAccount } from '../../utils/accountUtils';

const InstructorGradingDetail = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const currentUser = getCurrentAccount();

    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [peerReviews, setPeerReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (submissionId) {
            fetchData();
        }
    }, [submissionId]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [detailsResponse, reviewsResponse] = await Promise.all([
                submissionService.getSubmissionDetails(submissionId),
                getPeerReviewsBySubmissionId(submissionId)
            ]);

            if (detailsResponse?.data) {
                const details = detailsResponse.data;
                setSubmissionDetails(details);

                // Convert score from 0-100 to 0-10 for display
                if (details.instructorScore !== null && details.instructorScore !== undefined) {
                    setScore(details.instructorScore / 10);
                } else if (details.finalScore !== null && details.finalScore !== undefined) {
                    setScore(details.finalScore / 10);
                }

                if (details.feedback) {
                    setFeedback(details.feedback);
                }
            }

            if (reviewsResponse) {
                setPeerReviews(reviewsResponse);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load submission details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateAveragePeerScore = () => {
        if (peerReviews.length === 0) return 0;
        const sum = peerReviews.reduce((acc, review) => acc + (review.overallScore || 0), 0);
        return (sum / peerReviews.length).toFixed(2);
    };

    const handleSubmitGrade = async () => {
        if (!currentUser || !currentUser.id) {
            toast.error('User not authenticated');
            return;
        }

        if (score < 0 || score > 10) {
            toast.error('Score must be between 0 and 10');
            return;
        }

        if (!feedback.trim()) {
            toast.error('Please provide feedback for the student');
            return;
        }

        setSubmitting(true);
        
        try {
            // Convert score from 0-10 to 0-100 for API
            const instructorScore = Math.round(score * 10);
            
            await gradeSubmission({
                submissionId: parseInt(submissionId),
                instructorId: currentUser.id,
                instructorScore: instructorScore,
                feedback: feedback.trim()
            });

            toast.success('Grade submitted successfully!');
            
            await fetchData();
            
            setTimeout(() => {
                navigate('/instructor/manage-grading');
            }, 1500);
            
        } catch (error) {
            console.error('Error submitting grade:', error);
            toast.error('Failed to submit grade. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('vi-VN');
        const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return `${dateStr} - ${timeStr}`;
    };

    const getFileNameFromUrl = (url) => {
        if (!url) return 'submission-file.pdf';
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'graded':
                return { class: 'bg-green-100 text-green-700', text: 'Graded' };
            case 'submitted':
                return { class: 'bg-blue-100 text-blue-700', text: 'Submitted' };
            default:
                return { class: 'bg-gray-100 text-gray-600', text: 'Not Submitted' };
        }
    };

    const visibleReviews = showAllReviews ? peerReviews : peerReviews.slice(0, 3);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading submission details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-gray-800 font-semibold mb-2">Error Loading Data</p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/instructor/manage-grading')}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Grading List
                    </button>
                </div>
            </div>
        );
    }

    if (!submissionDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">No submission details found.</p>
            </div>
        );
    }

    const statusBadge = getStatusBadge(submissionDetails.status);
    const assignment = submissionDetails.assignment || {};
    const user = submissionDetails.user || {};

    return (
        <div className="min-h-screen bg-white-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate('/instructor/manage-grading')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">Submission Details</h1>
                        <p className="text-sm text-gray-500">Assignment: {assignment.title || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="col-span-2 space-y-6">
                        {/* Student Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3">Student Information</h2>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-800">Full Name: <span className="font-medium">{submissionDetails.studentName || user.fullName || 'N/A'}</span></p>
                                <p className="text-gray-600">Student ID: {submissionDetails.studentCode || user.studentId || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Submission Status */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3">Submission Status</h2>
                            <div className="flex items-start gap-3">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusBadge.class}`}>
                                    {statusBadge.text}
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-gray-600 space-y-1">
                                <p>Submission Time: <span className="font-medium">{formatDateTime(submissionDetails.submittedAt)}</span></p>
                                <p>Deadline: <span className="font-medium">{formatDateTime(assignment.deadline)}</span></p>
                                {submissionDetails.gradedAt && (
                                    <p>Graded Time: <span className="font-medium">{formatDateTime(submissionDetails.gradedAt)}</span></p>
                                )}
                            </div>
                        </div>

                        {/* File Submission */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-3">Submitted File</h2>
                            {submissionDetails.fileUrl ? (
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{submissionDetails.fileName || getFileNameFromUrl(submissionDetails.fileUrl)}</p>
                                            <p className="text-xs text-gray-500">Uploaded: {formatDateTime(submissionDetails.submittedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={submissionDetails.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600" />
                                            <span className="text-xs text-gray-600">Preview</span>
                                        </a>
                                        <a
                                            href={submissionDetails.fileUrl}
                                            download
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No file submitted</p>
                            )}
                        </div>

                        {/* Peer Reviews */}
                        {peerReviews.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                        <h2 className="text-sm font-semibold text-gray-700">Peer Review (Classmate Evaluations)</h2>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Average Score:{" "}
                                        <span className="font-semibold text-blue-600">
                                            {(calculateAveragePeerScore() / 10).toFixed(1)} / 10
                                        </span>
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">{peerReviews.length} evaluations from classmates</p>

                                <div className="space-y-4">
                                    {visibleReviews.map((review, index) => {
                                        const score10 = review.overallScore ? (review.overallScore / 10).toFixed(1) : "0.0";
                                        const display10 = review.displayScore != null ? (review.displayScore / 10).toFixed(1) : null;

                                        return (
                                            <div key={review.reviewId || index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 text-sm">
                                                                {review.reviewerName || "Anonymous"}
                                                                {review.studentCode && <span className="text-gray-400"> ({review.studentCode})</span>}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Evaluated: {formatDateTime(review.reviewedAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm font-semibold text-gray-800">{score10}</span>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 leading-relaxed mb-2">{review.generalFeedback || "No comment provided"}</p>

                                                {display10 !== null && (
                                                    <p className="text-xs text-gray-500">Display Score: {display10} / 10</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {!showAllReviews && peerReviews.length > 3 && (
                                    <button
                                        onClick={() => setShowAllReviews(true)}
                                        className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                                    >
                                        View More Reviews ({peerReviews.length - 3} more)
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* AI Feedback */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                <h2 className="text-sm font-semibold text-gray-700">AI Feedback</h2>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Automatic Analysis by AI</p>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Strengths:</h3>
                                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                        <li>Clear and intuitive wireframe structure</li>
                                        <li>Good use of color scheme and typography</li>
                                        <li>Smooth user journey and logical flow</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Areas for Improvement:</h3>
                                    <ul className="list-disc pl-4 space-y-1 text-gray-600">
                                        <li>Improve visual hierarchy</li>
                                        <li>Optimize spacing between elements</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4">Instructor Score</h2>
                            <div className="flex items-center justify-center mb-4">
                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#10b981"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(score / 10) * 251.2} 251.2`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-green-600">{score.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Score Input */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">📊</span>
                                <h3 className="text-sm font-semibold text-gray-700">Instructor Score</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setScore(Math.max(0, score - 0.5))}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold transition-colors"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={score}
                                    onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (isNaN(value)) value = 0;
                                        value = Math.round(value * 10) / 10;
                                        setScore(Math.min(10, Math.max(0, value)));
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                />
                                <button
                                    onClick={() => setScore(Math.min(10, score + 0.5))}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">Maximum Score: 10</p>
                        </div>

                        {/* Detailed Feedback */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">📋</span>
                                <h3 className="text-sm font-semibold text-gray-700">Instructor Feedback</h3>
                            </div>
                            <textarea
                                placeholder="Enter detailed comments on the student's work..."
                                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 resize-y"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-2">Suggestion: Clearly state strengths, areas for improvement, and overall evaluation</p>
                        </div>

                        {/* Grading Criteria */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Grading Criteria</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">Wireframe Design</p>
                                        <span className="text-xs font-semibold text-gray-600">40%</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Wireframe structure and layout, clarity and coherence in design, layout feasibility</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">Interactive Prototype</p>
                                        <span className="text-xs font-semibold text-gray-600">30%</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Level of interaction, smoothness of transitions, correct logical functionality, user experience</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium text-gray-800">UX Analysis Report</p>
                                        <span className="text-xs font-semibold text-gray-600">30%</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Depth and quality of user feedback analysis, specific user journey research, proposed solutions</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitGrade}
                                disabled={submitting}
                                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    submissionDetails.instructorScore !== null ? 'Update Grade' : 'Submit Grade'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorGradingDetail;