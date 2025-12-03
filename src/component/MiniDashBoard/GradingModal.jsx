import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, Send, Download, Eye, RefreshCw } from "lucide-react";

import { studentReviewService } from "../../service/studentReviewService";

const GradingModal = ({ reviewAssignmentId, onClose, onSuccess, reviewerId, status }) => {
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState("");

  const { data: detailResponse, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["reviewAssignmentDetails", reviewAssignmentId],
    queryFn: () => studentReviewService.getReviewAssignmentDetails(reviewAssignmentId),
    enabled: !!reviewAssignmentId,
  });

  const { data: resultResponse, isLoading: isLoadingResult } = useQuery({
    queryKey: ["reviewResult", reviewAssignmentId],
    queryFn: () => studentReviewService.getReviewDetails(reviewAssignmentId),
    enabled: !!reviewAssignmentId && status === "Completed",
  });

  const reviewData = detailResponse?.data;
  const oldResult = resultResponse?.data; 

  useEffect(() => {
    if (reviewData?.rubric?.criteria) {
      const initialScores = {};
      if (status === "Completed" && oldResult?.criteriaFeedbacks) {
        oldResult.criteriaFeedbacks.forEach((fb) => {
          initialScores[fb.criteriaId] = fb.scoreAwarded;
        });
        if (oldResult.generalFeedback) setComment(oldResult.generalFeedback);
      } else {
        reviewData.rubric.criteria.forEach((c) => {
          initialScores[c.criteriaId] = null;
        });
      }
      setScores(initialScores);
    }
  }, [reviewData, oldResult, status]);

  const handleScoreChange = (criteriaId, value) => {
    if (value === "") {
      setScores((prev) => ({ ...prev, [criteriaId]: null }));
      return;
    }
    let newScore = parseFloat(value);
    const maxScore = reviewData.rubric.criteria.find(c => c.criteriaId === criteriaId)?.maxScore;
    if (!isNaN(newScore) && maxScore !== undefined) {
      newScore = Math.max(0, Math.min(newScore, maxScore));
      setScores((prev) => ({ ...prev, [criteriaId]: newScore }));
    }
  };

  const weightedTotalScore = useMemo(() => {
    const criteria = reviewData?.rubric?.criteria;
    if (!criteria || Object.keys(scores).length === 0) return 0;
    const totalPercent = criteria.reduce((acc, criterion) => {
      const score = scores[criterion.criteriaId] || 0;
      const maxScore = criterion.maxScore || 1;
      const weight = criterion.weight || 0;
      return acc + (score / maxScore) * weight;
    }, 0);
    return parseFloat((totalPercent / 10).toFixed(2));
  }, [scores, reviewData]);

  const submitMutation = useMutation({
    mutationFn: (payload) => {
      if (status === "Completed") {
 
        return studentReviewService.updatePeerReview(payload.reviewId, payload);
      } else {
        return studentReviewService.submitPeerReview(payload);
      }
    },
    onSuccess: () => {
      toast.success(status === "Completed" ? "Review updated successfully!" : "Grading completed!");
      onSuccess();
      onClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error(status === "Completed" ? "Failed to update review." : "Failed to submit review.");
    },
  });

  const handleSubmit = () => {
    const isAllFilled = Object.values(scores).every((s) => s !== null);
    if (!isAllFilled) {
      toast.error("Please enter scores for all criteria.");
      return;
    }

    const criteriaFeedbacks = reviewData.rubric.criteria.map((c) => ({
      criteriaId: c.criteriaId,
      score: scores[c.criteriaId] || 0,
      feedback: "", 
    }));

    let payload;

    if (status === "Completed") {
      if (!oldResult?.reviewId) {
        toast.error("Cannot find Review ID to update.");
        return;
      }
      payload = {
        reviewId: oldResult.reviewId, 
        reviewerUserId: reviewerId,
        generalFeedback: comment,
        criteriaFeedbacks: criteriaFeedbacks
      };
    } else {
      payload = {
        reviewAssignmentId: reviewData.reviewAssignmentId,
        reviewerUserId: reviewerId,
        generalFeedback: comment,
        criteriaFeedbacks: criteriaFeedbacks
      };
    }

    submitMutation.mutate(payload);
  };

  if (!reviewAssignmentId) return null;
  const isLoading = isLoadingDetails || (status === "Completed" && isLoadingResult);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {status === "Completed" ? "Regrade Assignment" : "Quick Grading"}
            </h2>
            {reviewData && (
              <p className="text-sm text-gray-500">
                Assignment: {reviewData.assignmentTitle}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : reviewData ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
                <div>
                  <p className="text-sm text-gray-500">Student Submission</p>
                  <p className="font-semibold text-gray-800">{reviewData.fileName}</p>
                </div>
                <div className="flex space-x-2">
                  <a href={reviewData.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-50">
                    <Eye size={18} />
                  </a>
                  <a href={reviewData.fileUrl} download className="p-2 bg-white text-blue-600 rounded shadow hover:bg-blue-50">
                    <Download size={18} />
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">Rubric Criteria</h3>
                {reviewData.rubric?.criteria?.map((criterion) => (
                  <div key={criterion.criteriaId} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="mb-2 sm:mb-0 sm:mr-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-800">{criterion.title}</h4>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{criterion.weight}%</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{criterion.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        step="0.25"
                        value={scores[criterion.criteriaId] ?? ""}
                        onChange={(e) => handleScoreChange(criterion.criteriaId, e.target.value)}
                        className="w-20 p-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold text-gray-900 placeholder-gray-400"
                        placeholder="0"
                      />
                      <span className="text-gray-900 font-medium">/ {criterion.maxScore}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-800">Total Score</span>
                  <span className="text-2xl font-bold text-orange-600">{weightedTotalScore} / 10</span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="General feedback for the student..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none h-24 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          ) : (
            <p className="text-center text-red-500">Failed to load assignment details.</p>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button onClick={onClose} className="px-5 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending || isLoading}
            className="px-5 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 flex items-center transition-colors disabled:opacity-50"
          >
            {submitMutation.isPending ? (
              "Saving..."
            ) : (
              <>
                {status === "Completed" ? <RefreshCw className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {status === "Completed" ? "Update Grade" : "Submit Review"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradingModal;