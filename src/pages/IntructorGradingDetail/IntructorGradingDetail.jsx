import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Eye, Star, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submissionService } from '../../service/submissionService';
import { getPeerReviewsBySubmissionId } from '../../service/instructorSubmission';
import { gradeSubmission } from '../../service/instructorGrading';
import { getCurrentAccount } from '../../utils/accountUtils';

const InstructorGradingDetail = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = getCurrentAccount();

    const [criteriaScores, setCriteriaScores] = useState({
        wireframe: {
            score: 0,
            feedback: '',
            weight: 40,
            name: 'Wireframe Design',
            icon: '📱',
            description: 'Detail and accuracy of the wireframe',
            color: 'bg-blue-50 border-blue-200'
        },
        prototype: {
            score: 0,
            feedback: '',
            weight: 30,
            name: 'Interactive Prototype',
            icon: '⚡',
            description: 'Level of interaction and screen transitions',
            color: 'bg-amber-50 border-amber-200'
        },
        uxReport: {
            score: 0,
            feedback: '',
            weight: 30,
            name: 'UX Analysis Report',
            icon: '📊',
            description: 'Depth and quality of analysis',
            color: 'bg-green-50 border-green-200'
        }
    });

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

                // Load existing criteria scores if available
                if (details.criteriaGrades) {
                    setCriteriaScores(prev => ({
                        wireframe: { ...prev.wireframe, ...details.criteriaGrades.wireframe },
                        prototype: { ...prev.prototype, ...details.criteriaGrades.prototype },
                        uxReport: { ...prev.uxReport, ...details.criteriaGrades.uxReport }
                    }));
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

    const calculateTotalScore = () => {
        const total = Object.values(criteriaScores).reduce((acc, criteria) => {
            return acc + (criteria.score * criteria.weight / 100);
        }, 0);
        return total.toFixed(2);
    };

    const updateCriteriaScore = (criteriaKey, field, value) => {
        setCriteriaScores(prev => ({
            ...prev,
            [criteriaKey]: {
                ...prev[criteriaKey],
                [field]: value
            }
        }));
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

        const hasEmptyFeedback = Object.values(criteriaScores).some(c => !c.feedback.trim());
        if (hasEmptyFeedback) {
            toast.error('Please enter feedback for all criteria');
            return;
        }

        setSubmitting(true);

        try {
            const totalScore = calculateTotalScore();

            await gradeSubmission({
                submissionId: parseInt(submissionId),
                instructorId: currentUser.id,
                instructorScore: Math.round(totalScore * 10),
                criteriaGrades: criteriaScores,
                feedback: `Total Score: ${totalScore}/10`
            });

            toast.success('Grading submitted successfully!');

            setTimeout(() => {
                const returnPath = location.pathname.includes('publish')
                    ? '/instructor/publish-mark'
                    : '/instructor/manage-grading';

                navigate(returnPath, {
                    state: location.state
                });
            }, 1500);

        } catch (error) {
            console.error('Error submitting grade:', error);
            toast.error('Failed to submit grade. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackClick = () => {
        const returnPath = location.pathname.includes('publish')
            ? '/instructor/publish-mark'
            : '/instructor/manage-grading';

        navigate(returnPath, {
            state: location.state
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        // Using common English locale format
        const dateStr = date.toLocaleDateString('en-US');
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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
    const submitButtonText = submissionDetails?.instructorScore !== null ? 'Update Grade' : 'Submit Grade';

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
                        onClick={handleBackClick}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    if (!submissionDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Submission details not found.</p>
            </div>
        );
    }

    const statusBadge = getStatusBadge(submissionDetails.status);
    const assignment = submissionDetails.assignment || {};
    const user = submissionDetails.user || {};

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Fixed and Translated */}
            <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={handleBackClick}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Back to submission list"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">Submission Details</h1>
                        <p className="text-sm text-gray-500">Assignment: {assignment.title || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
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
                                <p><span className="text-gray-600">Student ID:</span> <span className="font-medium">{submissionDetails.studentCode || 'N/A'}</span></p>
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
                                            <p className="text-xs text-gray-500">2.4 MB • PDF File</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={submissionDetails.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-gray-200 rounded"
                                            aria-label="View file"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </a>
                                        <a
                                            href={submissionDetails.fileUrl}
                                            download
                                            className="p-2 hover:bg-blue-100 rounded"
                                            aria-label="Download file"
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
                                </div>
                                <p className="text-sm text-gray-500 mb-3">
                                    Average Score: <span className="font-semibold text-blue-600">{(calculateAveragePeerScore() / 10).toFixed(1)}/10</span>
                                </p>

                                <div className="space-y-3">
                                    {visibleReviews.map((review, index) => {
                                        const score10 = review.overallScore ? (review.overallScore / 10).toFixed(1) : "0.0";
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
                            </div>
                        )}
                    </div>

                    {/* Right Column - Grading */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Grading Criteria */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center mb-6">
                                <span className="text-xl mr-2">📋</span>
                                <h2 className="font-semibold text-gray-900 text-lg">Grading Criteria</h2>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(criteriaScores).map(([key, criteria]) => (
                                    <div key={key} className={`border-2 rounded-lg p-4 ${criteria.color}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{criteria.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{criteria.name}</h3>
                                                    <p className="text-sm text-gray-600">{criteria.description}</p>
                                                </div>
                                            </div>
                                            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                                                {criteria.weight}%
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Score
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={criteria.score}
                                                    onChange={(e) => {
                                                        let value = parseFloat(e.target.value);
                                                        if (isNaN(value)) value = 0;
                                                        value = Math.round(value * 10) / 10;
                                                        updateCriteriaScore(key, 'score', Math.min(10, Math.max(0, value)));
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Feedback
                                                </label>
                                                <textarea
                                                    value={criteria.feedback}
                                                    onChange={(e) => updateCriteriaScore(key, 'feedback', e.target.value)}
                                                    rows="3"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                    placeholder="Enter detailed feedback..."
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
                                {Object.entries(criteriaScores).map(([key, criteria]) => (
                                    <div key={key} className="flex justify-between text-gray-700">
                                        <span>{criteria.name} ({criteria.weight}%):</span>
                                        <span className="font-medium">
                                            {criteria.score} × {(criteria.weight / 100).toFixed(2)} = {(criteria.score * criteria.weight / 100).toFixed(2)}
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

                        {/* Action Button */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleBackClick}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
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
                </div>
            </div>
        </div>
    );
}

export default InstructorGradingDetail;