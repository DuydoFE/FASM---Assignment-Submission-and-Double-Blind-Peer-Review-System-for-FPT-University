import React, { useState, useEffect } from "react";
import { X, Save, Eye, Download, Star, ChevronDown, Loader2, ExternalLink } from "lucide-react";
import { Modal, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { submissionService } from "../../service/submissionService";
import { instructorService } from "../../service/instructorSubmission";
import { getCriteriaByAssignmentId } from "../../service/criteriaService";
import { overrideFinalScore } from "../../service/instructorGrading";
import { getCurrentAccount } from "../../utils/accountUtils";
import { toast } from "react-toastify";
import PeerReviewDetailModal from "../InstructorGrading/PeerReviewDetailModal";

const OverrideFinalScoreModal = ({ isOpen, onClose, request, onSubmit }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentAccount();
  const [overrideScore, setOverrideScore] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [peerReviews, setPeerReviews] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && request?.submissionId) {
      fetchSubmissionData();
    }
  }, [isOpen, request]);

  const fetchSubmissionData = async () => {
    setLoading(true);
    try {
      // Fetch submission details
      const detailsResponse = await submissionService.getSubmissionDetails(request.submissionId);
      if (detailsResponse?.data) {
        setSubmissionDetails(detailsResponse.data);

        // Fetch peer reviews
        const reviewsResponse = await instructorService.getPeerReviewsBySubmissionId(request.submissionId);
        if (reviewsResponse) {
          setPeerReviews(reviewsResponse);
        }

        // Fetch criteria
        const criteriaResponse = await getCriteriaByAssignmentId(detailsResponse.data.assignmentId);
        let criteriaArray = [];
        if (Array.isArray(criteriaResponse)) {
          criteriaArray = criteriaResponse;
        } else if (criteriaResponse?.data) {
          criteriaArray = Array.isArray(criteriaResponse.data) ? criteriaResponse.data : [];
        }

        const formatted = (criteriaArray || []).map((c, index) => ({
          criteriaId: c.criteriaId ?? c.id ?? index,
          name: c.title ?? c.criteriaTitle ?? 'Untitled',
          description: c.description ?? '',
          weight: typeof c.weight === 'number' ? c.weight : parseFloat(c.weight) || 0,
          order: index + 1,
        }));

        setCriteriaList(formatted);
      }
    } catch (error) {
      console.error('Error fetching submission data:', error);
    } finally {
      setLoading(false);
    }
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

  const calculateAveragePeerScore = () => {
    if (peerReviews.length === 0) return 0;
    const sum = peerReviews.reduce((acc, review) => acc + (review.overallScore || 0), 0);
    return (sum / peerReviews.length).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!overrideScore) {
      newErrors.overrideScore = "Score is required";
    } else if (isNaN(overrideScore)) {
      newErrors.overrideScore = "Score must be a number";
    } else if (parseFloat(overrideScore) < 0 || parseFloat(overrideScore) > 10) {
      newErrors.overrideScore = "Score must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await overrideFinalScore({
        submissionId: request.submissionId,
        newFinalScore: parseFloat(overrideScore),
        instructorId: currentUser?.id
      });

      // Display message from backend
      const successMessage = response?.message || `Final score overridden successfully to ${overrideScore}/10`;
      toast.success(successMessage);
      
      // Call parent onSubmit to update the UI
      if (onSubmit) {
        onSubmit({
          regradeRequestId: request.requestId,
          overrideScore: parseFloat(overrideScore),
        });
      }
      
      handleClose();
    } catch (error) {
      console.error('Error overriding final score:', error);
      toast.error(error.message || 'Failed to override final score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOverrideScore("");
    setErrors({});
    setSubmissionDetails(null);
    setPeerReviews([]);
    setCriteriaList([]);
    setShowAllReviews(false);
    onClose();
  };

  const visibleReviews = showAllReviews ? peerReviews : peerReviews.slice(0, 3);

  return (
    <Modal
      title={
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Override Final Score
          </h2>
          <div className="text-sm text-gray-600 mt-1 space-y-1">
            <p>Course: <span className="font-medium">{submissionDetails?.courseName || 'N/A'}</span></p>
            <p>Class: <span className="font-medium">{submissionDetails?.className || 'N/A'}</span></p>
            <p>Assignment: <span className="font-medium">{request?.assignmentTitle || 'N/A'}</span></p>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      width={1200}
      centered
      footer={
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleClose}
            size="large"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={loading || submitting}
            size="large"
            className="bg-orange-500 hover:!bg-orange-600"
            icon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            {submitting ? 'Saving...' : 'Override Score'}
          </Button>
        </div>
      }
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading submission details...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Student Submission */}
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Student Submission</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p className="font-medium">{submissionDetails?.fileName || getFileNameFromUrl(submissionDetails?.fileUrl)}</p>
                  </div>
                </div>

                {/* Submitted File */}
                {submissionDetails?.fileUrl && (
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                          📄
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {submissionDetails.fileName || getFileNameFromUrl(submissionDetails.fileUrl)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(submissionDetails.previewUrl || submissionDetails.previewURL) && (
                          <a
                            href={submissionDetails.previewUrl || submissionDetails.previewURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-blue-100 rounded"
                            title="Preview file"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </a>
                        )}
                        <a
                          href={submissionDetails.fileUrl}
                          download
                          className="p-2 hover:bg-blue-100 rounded"
                          title="Download file"
                        >
                          <Download className="w-4 h-4 text-blue-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Peer Reviews */}
                {peerReviews.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        <h3 className="font-semibold text-gray-900">Peer Reviews</h3>
                      </div>
                      <Button
                        onClick={() => setIsDetailModalOpen(true)}
                        type="primary"
                        size="small"
                        className="bg-blue-600 hover:!bg-blue-700"
                        icon={<Eye className="w-4 h-4" />}
                      >
                        View Detail
                      </Button>
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
                  </div>
                )}
              </div>

              {/* Right Column - Rubric Criteria & Override */}
              <div className="lg:col-span-2 space-y-6">
                {/* Rubric Criteria */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h2 className="font-semibold text-gray-900 text-lg mb-4">Rubric Criteria</h2>
                  
                  <div className="space-y-4">
                    {criteriaList.map((c) => (
                      <div key={c.criteriaId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {c.name}
                        </h3>
                        {c.description && (
                          <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                        )}
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {c.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Override Score Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h2 className="font-semibold text-gray-900 text-lg mb-4">Override Final Score</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Scores Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Peer Average Score:</span>
                          <p className="text-blue-900 font-semibold text-lg">
                            {submissionDetails?.peerAverageScore !== undefined && submissionDetails?.peerAverageScore !== null
                              ? `${parseFloat(submissionDetails.peerAverageScore).toFixed(2)}/10`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Instructor Score:</span>
                          <p className="text-blue-900 font-semibold text-lg">
                            {submissionDetails?.instructorScore !== undefined && submissionDetails?.instructorScore !== null
                              ? `${parseFloat(submissionDetails.instructorScore).toFixed(2)}/10`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Final Score:</span>
                          <p className="text-blue-900 font-semibold text-lg">
                            {submissionDetails?.finalScore !== undefined && submissionDetails?.finalScore !== null
                              ? `${parseFloat(submissionDetails.finalScore).toFixed(2)}/10`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Override Score Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Final Score <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={overrideScore}
                        onChange={(e) => setOverrideScore(e.target.value)}
                        className={`w-full px-4 py-2 border ${
                          errors.overrideScore ? "border-red-500" : "border-gray-300"
                        } rounded-lg `}
                        placeholder="Enter score (0-10)"
                      />
                      {errors.overrideScore && (
                        <p className="mt-1 text-sm text-red-600">{errors.overrideScore}</p>
                      )}
                    </div>

                  </form>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Peer Review Detail Modal */}
      <PeerReviewDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        peerReviews={peerReviews}
        formatDateTime={formatDateTime}
      />
    </Modal>
  );
};

export default OverrideFinalScoreModal;