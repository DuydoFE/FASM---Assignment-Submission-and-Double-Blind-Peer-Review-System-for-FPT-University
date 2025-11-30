import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Download,
  Eye,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Bot,
  Loader2,
  Zap,
} from "lucide-react";

import { reviewService } from "../../service/reviewService";
import { getCurrentAccount } from "../../utils/accountUtils";
import { toast } from "react-toastify";

const PeerReviewPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const user = getCurrentAccount();

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!assignmentId) {
        setError("Assignment ID not found.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await reviewService.getPeerReviewAssignment(assignmentId);
        if (data && data.rubric && Array.isArray(data.rubric.criteria)) {
          setReviewData(data);
          const initialScores = data.rubric.criteria.reduce(
            (acc, criterion) => {
              acc[criterion.criteriaId] = null;
              return acc;
            },
            {}
          );
          setScores(initialScores);
        } else {
          throw new Error("Invalid grading data returned.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load assignment for grading. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewData();
  }, [assignmentId]);

  const handleScoreChange = (criteriaId, value) => {
    if (value === "") {
      setScores((prev) => ({ ...prev, [criteriaId]: null }));
      return;
    }

    let newScore = parseFloat(value);

    const maxScore = reviewData.rubric.criteria.find(
      (c) => c.criteriaId === criteriaId
    )?.maxScore;

    if (!isNaN(newScore) && maxScore !== undefined) {
      newScore = Math.max(0, Math.min(newScore, maxScore));
      setScores((prevScores) => ({ ...prevScores, [criteriaId]: newScore }));
    }
  };

  const handleScoreBlur = (criteriaId) => {
    let currentScore = scores[criteriaId];

    if (currentScore === null || currentScore === "") return;

    let roundedScore = Math.round(currentScore * 4) / 4;

    const maxScore = reviewData.rubric.criteria.find(
      (c) => c.criteriaId === criteriaId
    )?.maxScore;

    if (maxScore !== undefined) {
      roundedScore = Math.max(0, Math.min(roundedScore, maxScore));
    }

    if (roundedScore !== currentScore) {
      setScores((prevScores) => ({
        ...prevScores,
        [criteriaId]: roundedScore,
      }));
    }
  };

  const weightedTotalScore = useMemo(() => {
    const criteria = reviewData?.rubric?.criteria;
    if (!criteria || Object.keys(scores).length === 0) return 0;

    const totalPercent = criteria.reduce((acc, criterion) => {
      const score = scores[criterion.criteriaId] || 0;
      const maxScore = criterion.maxScore || 1;
      const weight = criterion.weight || 0;
      const weightedContribution = (score / maxScore) * weight;
      return acc + weightedContribution;
    }, 0);

    const scoreOnScale10 = totalPercent / 10;
    return parseFloat(scoreOnScale10.toFixed(2));
  }, [scores, reviewData]);

  const handleAutoScore = () => {
    if (!aiSummaryData || !aiSummaryData.data?.feedbacks) {
      toast.error("No AI data available. Please generate a summary first.");
      return;
    }

    const newScores = { ...scores };
    const isErrorCase = aiSummaryData.statusCode === 400;

    aiSummaryData.data.feedbacks.forEach((fb) => {
      const criteria = reviewData.rubric.criteria.find(
        (c) => c.criteriaId === fb.criteriaId
      );

      if (criteria) {
        let aiScore = 0;
        if (isErrorCase) {
          aiScore = 0;
        } else {
          aiScore = fb.score || 0;
        }

        // Đảm bảo AI cũng trả về đúng step 0.25 (phòng hờ)
        aiScore = Math.round(aiScore * 4) / 4;

        if (aiScore > criteria.maxScore) aiScore = criteria.maxScore;
        if (aiScore < 0) aiScore = 0;

        newScores[fb.criteriaId] = aiScore;
      }
    });

    setScores(newScores);

    if (isErrorCase) {
      toast.info("Submission is off-topic. System auto-filled 0 score.");
    } else {
      toast.success("Scores filled based on AI suggestions!");
    }
  };

  const handleGenerateAiSummary = async () => {
    if (!reviewData?.submissionId) {
      toast.error("Submission ID not found for analysis.");
      return;
    }
    setIsGeneratingAi(true);
    setAiSummaryData(null);
    try {
      const response = await reviewService.generateAiReview(
        reviewData.submissionId
      );

      if (response.statusCode === 200 || response.statusCode === 400) {
        setAiSummaryData(response);
        if (response.statusCode === 400) {
          toast.warn(
            response.message || "The assignment does not meet the requirements."
          );
        } else {
          toast.success("AI has finished analyzing. See details below.");
        }
      } else {
        throw new Error("AI data returned invalid.");
      }
    } catch (error) {
      console.error(error);
      toast.error("AI analysis generation failed. Please try again.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmitReview = async () => {
  // 1. Validation điểm số (giữ nguyên logic cũ của bạn)
  const isAllScoresFilled = Object.values(scores).every((score) => score !== null);
  if (!isAllScoresFilled) {
    const errorMessage = "Please enter scores for all criteria.";
    setValidationError(errorMessage);
    toast.error(errorMessage);
    return;
  }
  setValidationError(null);

  try {
    if (!reviewData) return;

    // 2. Gọi API submit (giữ nguyên logic cũ)
    const payload = {
      reviewAssignmentId: reviewData.reviewAssignmentId,
      reviewerUserId: user?.userId,
      generalFeedback: comment,
      criteriaFeedbacks: reviewData.rubric.criteria.map((c) => ({
        criteriaId: c.criteriaId,
        score: scores[c.criteriaId] || 0,
        feedback: "",
      })),
    };
    await reviewService.submitPeerReview(payload);

    
    navigate("/review-success", {
      state: {
        assignmentTitle: reviewData.assignmentTitle,
        studentName: reviewData.studentName,
        criteriaFeedbacks: reviewData.rubric.criteria.map((c) => ({
          criteriaId: c.criteriaId,
          criteriaName: c.title || c.criteriaName || "Tiêu chí", 
          score: scores[c.criteriaId] || 0,
          maxScore: c.maxScore,
        })),
        totalScore: weightedTotalScore, 
        generalFeedback: comment, 
      },
    });

  } catch (err) {
    console.error(err);
    toast.error("Error sending score, please try again!");
  }
};

  if (isLoading)
    return <div className="p-8 text-center text-xl">Finding Assignment...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Link
              to={`/assignment/${courseId}/${assignmentId}`}
              className="hover:underline"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-gray-800">Peer Review</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Peer Review - {reviewData.assignmentTitle}
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <Star size={16} className="mr-2" /> Review
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-600 text-white flex items-center justify-center rounded-full font-bold text-xl mr-4">
                  {(reviewData.studentName ?? "S").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    Assignment - {reviewData.studentName ?? "Unknown user"}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                Not Reviewed
              </div>
            </div>
            {reviewData.fileUrl && (
              <div className="mt-4 pt-4 border-t flex items-center text-sm">
                <p className="font-bold text-gray-900 mr-4 truncate text-base">
                  {reviewData.fileName ?? "submission.pdf"}
                </p>

                <div className="ml-auto flex space-x-2">
                  <a
                    href={reviewData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview file"
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-700"
                  >
                    <Eye size={18} />
                  </a>
                  <a
                    href={reviewData.fileUrl}
                    download={reviewData.fileName}
                    title="Download file"
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-700"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-6 p-3 bg-gray-50 rounded-lg border">
              <button
                onClick={handleAutoScore}
                disabled={!aiSummaryData}
                className={`flex items-center px-4 py-2 border rounded-md font-semibold text-sm ${
                  !aiSummaryData
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-blue-600 border-blue-200 hover:bg-blue-50"
                }`}
              >
                <Sparkles size={14} className="mr-2" />
                Auto Score
              </button>
              <button
                onClick={handleGenerateAiSummary}
                disabled={isGeneratingAi}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 text-sm disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isGeneratingAi ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : (
                  <Bot size={14} className="mr-2" />
                )}
                Create Summary AI
              </button>
              <button
                onClick={() => {
                  setScores({});
                  setComment("");
                  setAiSummaryData(null);
                }}
                className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm"
              >
                <RotateCcw size={14} className="mr-2" />
                Reset
              </button>
            </div>

            <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b font-bold text-gray-600">
              <div className="col-span-7">Form Grading</div>
              <div className="col-span-3">AI Summary</div>
              <div className="col-span-2 text-center">Score Input</div>
            </div>

            <div className="divide-y">
              {reviewData?.rubric?.criteria?.map((criterion) => {
                const aiFeedbackForItem = aiSummaryData?.data?.feedbacks?.find(
                  (f) => f.criteriaId === criterion.criteriaId
                );
                return (
                  <div
                    key={criterion.criteriaId}
                    className="grid grid-cols-12 gap-4 p-4 items-center"
                  >
                    <div className="col-span-5">
                      <h4 className="font-bold text-gray-900">
                        {criterion.title || criterion.criteriaName}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1 font-medium">
                        {criterion.description}
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${criterion.weight}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm font-bold text-blue-700">
                          {criterion.weight}%
                        </span>
                      </div>
                    </div>

                    <div className="col-span-5">
                      {isGeneratingAi ? (
                        <div className="flex items-center text-gray-700 font-medium">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : aiFeedbackForItem ? (
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-gray-900 text-sm">
                              {aiFeedbackForItem.title}
                            </span>
                            <span className="ml-2 text-xs font-bold text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">
                              {criterion.weight}%
                            </span>
                          </div>

                          <p
                            className={`text-sm ${
                              aiSummaryData.statusCode === 400 ||
                              aiFeedbackForItem.summary.includes("⚠") ||
                              aiFeedbackForItem.summary.includes(
                                "Unable to evaluate"
                              )
                                ? "text-red-700 font-medium bg-red-50 p-2 rounded border border-red-200"
                                : "text-gray-900 font-medium"
                            }`}
                          >
                            {aiFeedbackForItem.summary}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-900">
                          <Zap
                            size={24}
                            className="mx-auto mb-1 text-gray-700"
                          />
                          <p className="text-sm font-bold">No AI summary yet</p>
                          <p className="text-xs font-medium text-gray-600">
                            Click 'Create Summary AI' to analyze
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        step="0.25"
                        value={
                          scores[criterion.criteriaId] === null
                            ? ""
                            : scores[criterion.criteriaId]
                        }
                        onChange={(e) =>
                          handleScoreChange(
                            criterion.criteriaId,
                            e.target.value
                          )
                        }
                        onBlur={() => handleScoreBlur(criterion.criteriaId)}
                        placeholder="0"
                        className={`w-20 text-center font-bold text-lg text-gray-900 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
                          validationError &&
                          scores[criterion.criteriaId] === null
                            ? "border-red-500 ring-red-200"
                            : "border-gray-400"
                        } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />

                      <span className="text-gray-900 text-lg font-bold ml-2">
                        / {criterion.maxScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {aiSummaryData && (
            <div className="bg-white p-6 rounded-lg border animate-fade-in">
              <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                <Bot className="w-6 h-6 mr-3 text-blue-600" />
                AI Overview
              </h3>
              <div
                className={`p-4 rounded-lg border ${
                  aiSummaryData.statusCode === 400
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                {aiSummaryData.statusCode === 200 && (
                  <p className="font-semibold">
                    Suggested Total Score:{" "}
                    <span className="text-blue-600 font-bold text-xl">
                      {aiSummaryData.data?.totalScore}
                    </span>{" "}
                    / 100
                  </p>
                )}

                <p
                  className={`mt-2 ${
                    aiSummaryData.statusCode === 400
                      ? "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {aiSummaryData.data?.overallComment || aiSummaryData.message}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <span className="text-xl font-bold text-blue-800">
                Total Score
              </span>
              <span className="text-3xl font-extrabold text-blue-600">
                {weightedTotalScore} / 10
              </span>
            </div>
            <div className="mt-6">
              <label className="font-bold text-gray-800 mb-2 block">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter feedback for the student..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmitReview}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              <Send size={18} className="mr-2" />
              Send Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerReviewPage;
