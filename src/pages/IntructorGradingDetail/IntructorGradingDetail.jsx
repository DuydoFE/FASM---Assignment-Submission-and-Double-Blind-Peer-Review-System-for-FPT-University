import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submissionService } from '../../service/submissionService';
import { getPeerReviewsBySubmissionId } from '../../service/instructorSubmission';
import { gradeSubmission } from '../../service/instructorGrading';
import { getCurrentAccount } from '../../utils/accountUtils';
import { getCriteriaByAssignmentId } from '../../service/criteriaService';
import SubmissionLeftColumn from '../../component/InstructorGrading/SubmissionLeftColumn';
import GradingRightColumn from '../../component/InstructorGrading/GradingRightColumn';

const InstructorGradingDetail = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = getCurrentAccount();

    const [criteriaList, setCriteriaList] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [submissionDetails, setSubmissionDetails] = useState(null);
    const [peerReviews, setPeerReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [generalFeedback, setGeneralFeedback] = useState('');

    useEffect(() => {
        if (submissionId) {
            fetchData();
        }
    }, [submissionId]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const detailsResponse = await submissionService.getSubmissionDetails(submissionId);

            if (!detailsResponse?.data) {
                throw new Error('Submission details not found');
            }

            const details = detailsResponse.data;
            setSubmissionDetails(details);
            const reviewsPromise = getPeerReviewsBySubmissionId(submissionId);
            const criteriaResponse = await getCriteriaByAssignmentId(details.assignmentId);
            let criteriaArray = [];
            if (Array.isArray(criteriaResponse)) {
                criteriaArray = criteriaResponse;
            } else if (criteriaResponse && Array.isArray(criteriaResponse.data)) {
                criteriaArray = criteriaResponse.data;
            } else if (criteriaResponse && Array.isArray(criteriaResponse.data?.data)) {
                criteriaArray = criteriaResponse.data.data;
            } else if (criteriaResponse?.data?.length) {
                criteriaArray = criteriaResponse.data;
            } else if (criteriaResponse?.length) {
                criteriaArray = criteriaResponse;
            } else {
                criteriaArray = criteriaResponse || [];
            }

            const formatted = (criteriaArray || []).map((c, index) => ({
                criteriaId: c.criteriaId ?? c.id ?? index,
                name: c.title ?? c.criteriaTitle ?? 'Untitled',
                description: c.description ?? '',
                weight: typeof c.weight === 'number' ? c.weight : parseFloat(c.weight) || 0,
                score: 0,
                feedback: '',
                order: index + 1
            }));

            if (details.criteriaFeedbacks && Array.isArray(details.criteriaFeedbacks)) {
                details.criteriaFeedbacks.forEach(saved => {
                    const idx = formatted.findIndex(f => f.criteriaId === saved.criteriaId);
                    if (idx >= 0) {
                        formatted[idx].score = typeof saved.scoreAwarded === 'number' ? saved.scoreAwarded : parseFloat(saved.scoreAwarded) || 0;
                        formatted[idx].feedback = saved.feedback ?? '';
                    }
                });
            }
            else if (details.criteriaGrades) {
                if (Array.isArray(details.criteriaGrades)) {
                    details.criteriaGrades.forEach(saved => {
                        const idx = formatted.findIndex(f => f.criteriaId === (saved.criteriaId ?? saved.id));
                        if (idx >= 0) {
                            formatted[idx].score = typeof saved.score === 'number' ? (saved.score / 10) : parseFloat(saved.score) / 10 || formatted[idx].score;
                            formatted[idx].feedback = saved.feedback ?? formatted[idx].feedback;
                        }
                    });
                } else if (typeof details.criteriaGrades === 'object') {
                    Object.values(details.criteriaGrades).forEach(saved => {
                        const savedId = saved.criteriaId ?? saved.id ?? null;
                        if (savedId) {
                            const idx = formatted.findIndex(f => f.criteriaId === savedId);
                            if (idx >= 0) {
                                formatted[idx].score = typeof saved.score === 'number' ? (saved.score / 10) : parseFloat(saved.score) / 10 || formatted[idx].score;
                                formatted[idx].feedback = saved.feedback ?? formatted[idx].feedback;
                            }
                        } else if (saved.name) {
                            const idx = formatted.findIndex(f => f.name === saved.name);
                            if (idx >= 0) {
                                formatted[idx].score = typeof saved.score === 'number' ? (saved.score / 10) : parseFloat(saved.score) / 10 || formatted[idx].score;
                                formatted[idx].feedback = saved.feedback ?? formatted[idx].feedback;
                            }
                        }
                    });
                }
            }

            setCriteriaList(formatted);

            const reviews = await reviewsPromise;
            if (reviews) setPeerReviews(reviews);

            if (details.feedback) {
                setGeneralFeedback(details.feedback);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load submission details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalScore = () => {
        const total = criteriaList.reduce((acc, c) => {
            const s = Number(c.score) || 0;
            const w = Number(c.weight) || 0;
            return acc + (s * w / 100);
        }, 0);
        return total.toFixed(1);
    };

    const updateCriteriaScore = (criteriaId, field, value) => {
        setCriteriaList(prev => prev.map(c => {
            if (c.criteriaId === criteriaId) {
                return { ...c, [field]: value };
            }
            return c;
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

        const hasEmptyFeedback = criteriaList.some(c => !String(c.feedback || '').trim());
        if (hasEmptyFeedback) {
            toast.error('Please enter feedback for all criteria');
            return;
        }

        setSubmitting(true);

        try {
            const totalScore = calculateTotalScore();
            
            // Map to match API structure: criteriaFeedbacks
            const criteriaFeedbacksPayload = criteriaList.map(c => ({
                criteriaId: c.criteriaId,
                score: Number(c.score) || 0, // API expects 0-10 scale
                feedback: c.feedback
            }));

            await gradeSubmission({
                submissionId: parseInt(submissionId, 10),
                instructorId: currentUser.id,
                feedback: generalFeedback || `Total Score: ${totalScore}/10`,
                criteriaFeedbacks: criteriaFeedbacksPayload
            });

            toast.success('Grading submitted successfully!');

            setTimeout(() => {
                const returnPath = location.pathname.includes('publish')
                    ? '/instructor/publish-mark'
                    : '/instructor/manage-grading';

                navigate(returnPath, {
                    state: location.state
                });
            }, 800);

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

    const assignment = submissionDetails.assignment || {};

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                    <SubmissionLeftColumn
                        submissionDetails={submissionDetails}
                        peerReviews={peerReviews}
                        showAllReviews={showAllReviews}
                        setShowAllReviews={setShowAllReviews}
                        formatDateTime={formatDateTime}
                        getFileNameFromUrl={getFileNameFromUrl}
                        getStatusBadge={getStatusBadge}
                        calculateAveragePeerScore={calculateAveragePeerScore}
                    />

                    {/* Right Column - Grading */}
                    <GradingRightColumn
                        criteriaList={criteriaList}
                        updateCriteriaScore={updateCriteriaScore}
                        calculateTotalScore={calculateTotalScore}
                        handleSubmitGrade={handleSubmitGrade}
                        submitting={submitting}
                        submitButtonText={submitButtonText}
                        generalFeedback={generalFeedback}
                        setGeneralFeedback={setGeneralFeedback}
                    />
                </div>
            </div>
        </div>
    );
}

export default InstructorGradingDetail;