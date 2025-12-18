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
  MessageSquare,
} from "lucide-react";

import { reviewService } from "../../service/reviewService";
import { getCurrentAccount } from "../../utils/accountUtils";
import { toast } from "react-toastify";

const PeerReviewPage = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);
  const [scores, setScores] = useState({});
  const [criteriaFeedbacks, setCriteriaFeedbacks] = useState({});

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

          const initialFeedbacks = data.rubric.criteria.reduce(
            (acc, criterion) => {
              acc[criterion.criteriaId] = "";
              return acc;
            },
            {}
          );
          setCriteriaFeedbacks(initialFeedbacks);
        } else {
          throw new Error("Invalid grading data returned.");
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (
          err.message &&
          err.message !== "Invalid grading data returned."
        ) {
          setError(err.message);
        } else {
          setError("Unable to load assignment for grading. Please try again.");
        }
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

  const handleCriteriaFeedbackChange = (criteriaId, value) => {
    setCriteriaFeedbacks((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
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
    const isAllScoresFilled = Object.values(scores).every(
      (score) => score !== null
    );
    if (!isAllScoresFilled) {
      const errorMessage = "Please enter scores for all criteria.";
      setValidationError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    setValidationError(null);

    try {
      if (!reviewData) return;

      const payload = {
        reviewAssignmentId: reviewData.reviewAssignmentId,
        reviewerUserId: user?.userId,
        generalFeedback: comment,
        criteriaFeedbacks: reviewData.rubric.criteria.map((c) => ({
          criteriaId: c.criteriaId,
          score: scores[c.criteriaId] || 0,
          feedback: criteriaFeedbacks[c.criteriaId] || "",
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
            feedback: criteriaFeedbacks[c.criteriaId] || "",
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
            <h1 className="text-3xl font-bold text-gray-900">
              Peer Review - {reviewData.assignmentTitle}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </button>
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
                    href={reviewData.previewUrl || reviewData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-700"
                  >
                    <Eye size={18} />
                  </a>
                  <a
                    href={reviewData.fileUrl}
                    download={reviewData.fileName}
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
                className="flex items-center px-4 py-2 border rounded-md font-semibold text-sm text-blue-600 border-blue-200 hover:bg-blue-50 disabled:text-gray-400 disabled:border-gray-200"
              >
                <Sparkles size={14} className="mr-2" /> Auto Score
              </button>
              <button
                onClick={handleGenerateAiSummary}
                disabled={isGeneratingAi}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 text-sm disabled:bg-green-400"
              >
                {isGeneratingAi ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : (
                  <Bot size={14} className="mr-2" />
                )}{" "}
                Create Summary AI
              </button>
              <button
                onClick={() => {
                  setScores({});
                  setComment("");
                  setAiSummaryData(null);
                  setCriteriaFeedbacks({});
                }}
                className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm"
              >
                <RotateCcw size={14} className="mr-2" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b font-bold text-gray-600">
              <div className="col-span-5">Form Grading</div>
              <div className="col-span-5">AI Summary</div>
              <div className="col-span-2 text-center">Score</div>
            </div>

            <div className="divide-y">
              {reviewData?.rubric?.criteria?.map((criterion) => {
                const aiFeedbackForItem = aiSummaryData?.data?.feedbacks?.find(
                  (f) => f.criteriaId === criterion.criteriaId
                );
                return (
                  <div
                    key={criterion.criteriaId}
                    className="grid grid-cols-12 gap-4 p-4"
                  >
                    <div className="col-span-5 flex flex-col">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {criterion.title || criterion.criteriaName}
                        </h4>
                        <p className="text-sm text-gray-700 mt-1 font-medium">
                          {criterion.description}
                        </p>
                        <div className="mt-2 flex items-center mb-3">
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

                      <div className="mt-auto pt-2">
                        <label className="flex items-center text-xs font-bold text-gray-800 mb-1">
                          <MessageSquare size={12} className="mr-1" />
                          Specific Feedback
                        </label>
                        <textarea
                          rows={3}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Your feedback for this criterion..."
                          value={criteriaFeedbacks[criterion.criteriaId] || ""}
                          onChange={(e) =>
                            handleCriteriaFeedbackChange(
                              criterion.criteriaId,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Middle Column: AI */}
                    <div className="col-span-5 border-l pl-4">
                      {isGeneratingAi ? (
                        <div className="flex items-center text-gray-700 font-medium mt-2">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Analyzing...</span>
                        </div>
                      ) : aiFeedbackForItem ? (
                        <div className="mt-1">
                          <div className="flex items-center mb-1">
                            <Bot size={14} className="text-blue-600 mr-2" />
                            <span className="font-bold text-gray-900 text-sm">
                              AI Suggestions
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              aiSummaryData.statusCode === 400 ||
                              aiFeedbackForItem.summary.includes("⚠")
                                ? "text-red-700 bg-red-50 p-2 rounded border border-red-200"
                                : "text-gray-800 bg-blue-50 p-2 rounded border border-blue-100"
                            }`}
                          >
                            {aiFeedbackForItem.summary}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <p className="text-xs italic">
                            No AI summary available
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Score */}
                    <div className="col-span-2 flex flex-col items-center justify-start pt-2">
                      <span className="text-xs font-bold text-gray-500 mb-1">
                        Score
                      </span>
                      <div className="flex items-center">
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
                          className={`w-20 text-center font-bold text-lg text-gray-900 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationError &&
                            scores[criterion.criteriaId] === null
                              ? "border-red-500 ring-red-200"
                              : "border-gray-400"
                          }`}
                        />
                        <span className="text-gray-500 text-sm font-bold ml-2">
                          / {criterion.maxScore}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {aiSummaryData && (
            <div className="bg-white p-6 rounded-lg border animate-fade-in">
              <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                <Bot className="w-6 h-6 mr-3 text-blue-600" /> AI Overview
              </h3>
              <div
                className={`p-4 rounded-lg border ${
                  aiSummaryData.statusCode === 400
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <p className="text-gray-700">
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
                General Feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Enter general feedback for the student..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmitReview}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              <Send size={18} className="mr-2" /> Send Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerReviewPage;
