import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bot, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  Button,
  Input,
  Progress,
  Tag,
  Space,
  Breadcrumb,
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Typography,
  Alert,
  Collapse,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { reviewService } from "../../service/reviewService";
import { getCurrentAccount } from "../../utils/accountUtils";
import { toast } from "react-toastify";

import LoadingAnimation from "../../component/Review/LoadingAnimation";
import AIAnalyzingAnimation from "../../component/Review/AIAnalyzingAnimation";
import AIOverviewCard from "../../component/Review/AIOverviewCard";
import AnimatedScoreInput from "../../component/Review/AnimatedScoreInput";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

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
  const [animationTrigger, setAnimationTrigger] = useState({});

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
    if (value === null || value === "") {
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
    const newTriggers = {};
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
        newTriggers[fb.criteriaId] = Date.now(); // Trigger animation
      }
    });

    setAnimationTrigger(newTriggers);
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

      const response = await reviewService.submitPeerReview(payload);

      // Show success message from API if available
      if (response?.message) {
        toast.success(response.message);
      }

      navigate("/review-success", {
        state: {
          assignmentTitle: reviewData.assignmentTitle,
          studentName: reviewData.studentName,
          criteriaFeedbacks: reviewData.rubric.criteria.map((c) => ({
            criteriaId: c.criteriaId,
            criteriaName: c.title || c.criteriaName || "Criteria",
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
      // Display error message from API response
      const errorMessage = err.response?.data?.message || err.message || "Error sending score, please try again!";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <LoadingAnimation message="Finding Assignment..." />;

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8"
      >
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="max-w-2xl mx-auto"
        />
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <Link to={`/assignment/${courseId}/${assignmentId}`}>
                <HomeOutlined className="mr-1" />
                Dashboard
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FileTextOutlined className="mr-1" />
              Peer Review
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex justify-between items-center">
            <Title level={2} className="!mb-0">
              <Bot className="inline-block mr-3 text-blue-600" size={32} />
              Peer Review - {reviewData.assignmentTitle}
            </Title>
            <Button
              icon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
              size="large"
            >
              Back
            </Button>
          </div>
        </motion.div>

        <Space direction="vertical" size="large" className="w-full">
          {/* Student Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <Space size="large">
                  <Avatar
                    size={64}
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<UserOutlined />}
                  >
                    {(reviewData.studentName ?? "S").charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Title level={4} className="!mb-1">
                      Assignment - {reviewData.studentName ?? "Unknown user"}
                    </Title>
                    {reviewData.fileUrl && (
                      <>
                        <Text type="secondary" className="block mb-2">
                          <FileTextOutlined className="mr-2" />
                          {reviewData.fileName ?? "submission.pdf"}
                        </Text>
                        <Space size="small">
                          <Tooltip title="Preview">
                            <Button
                              type="text"
                              size="small"
                              icon={<EyeOutlined />}
                              href={reviewData.previewUrl || reviewData.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          </Tooltip>
                          <Tooltip title="Download">
                            <Button
                              type="text"
                              size="small"
                              icon={<DownloadOutlined />}
                              href={reviewData.fileUrl}
                              download={reviewData.fileName}
                            />
                          </Tooltip>
                        </Space>
                      </>
                    )}
                  </div>
                </Space>
                <Badge status="warning" text="Not Reviewed" />
              </div>
            </Card>
          </motion.div>

          {/* AI Tools Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md bg-gradient-to-r from-blue-50 to-green-50">
              <Space wrap>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  onClick={handleAutoScore}
                  disabled={!aiSummaryData}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Auto Score
                </Button>
                <Button
                  type="primary"
                  icon={
                    isGeneratingAi ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RobotOutlined />
                    )
                  }
                  onClick={handleGenerateAiSummary}
                  disabled={isGeneratingAi}
                  loading={isGeneratingAi}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Summary AI
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setScores({});
                    setComment("");
                    setAiSummaryData(null);
                    setCriteriaFeedbacks({});
                  }}
                >
                  Reset
                </Button>
              </Space>
            </Card>
          </motion.div>

          {/* Grading Criteria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              title={
                <Title level={4} className="!mb-0">
                  <FileTextOutlined className="mr-2" />
                  Grading Criteria
                </Title>
              }
              className="shadow-md"
            >
              <Collapse
                defaultActiveKey={reviewData?.rubric?.criteria?.map(
                  (_, index) => index.toString()
                )}
                ghost
              >
                {reviewData?.rubric?.criteria?.map((criterion, index) => {
                  const aiFeedbackForItem =
                    aiSummaryData?.data?.feedbacks?.find(
                      (f) => f.criteriaId === criterion.criteriaId
                    );
                  return (
                    <Panel
                      header={
                        <div className="flex justify-between items-center pr-4">
                          <Space>
                            <Badge
                              count={index + 1}
                              style={{ backgroundColor: "#1890ff" }}
                            />
                            <Text strong>
                              {criterion.title || criterion.criteriaName}
                            </Text>
                          </Space>
                          <Space>
                            <Tag color="blue">{criterion.weight}%</Tag>
                            <Text type="secondary">
                              Max: {criterion.maxScore}
                            </Text>
                          </Space>
                        </div>
                      }
                      key={index}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-12 gap-6">
                          {/* Left Column - Criterion Details */}
                          <div className="col-span-5">
                            {criterion.description && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <Text strong className="block mb-2">
                                  Description:
                                </Text>
                                {criterion.description.split("\n").map(
                                  (line, lineIndex) =>
                                    line.trim() && (
                                      <div
                                        key={lineIndex}
                                        className="flex items-start mb-1"
                                      >
                                        <span className="mr-2 text-blue-500">
                                          •
                                        </span>
                                        <Text>
                                          {line.replace(/^- /, "").trim()}
                                        </Text>
                                      </div>
                                    )
                                )}
                              </div>
                            )}

                            <div className="mb-3">
                              <Text type="secondary" className="block mb-2">
                                Weight Distribution:
                              </Text>
                              <Progress
                                percent={criterion.weight}
                                strokeColor={{
                                  "0%": "#108ee9",
                                  "100%": "#87d068",
                                }}
                              />
                            </div>
                          </div>

                          {/* Middle Column - AI Summary & Specific Feedback */}
                          <div className="col-span-5 border-l pl-6">
                            <AIAnalyzingAnimation
                              isAnalyzing={isGeneratingAi}
                              aiFeedback={aiFeedbackForItem}
                              aiSummaryData={aiSummaryData}
                            />

                            <Divider className="my-3" />

                            <div>
                              <Text strong className="block mb-2">
                                <MessageSquare
                                  size={14}
                                  className="inline mr-1"
                                />
                                Specific Feedback
                              </Text>
                              <TextArea
                                rows={4}
                                placeholder="Your feedback for this criterion..."
                                value={
                                  criteriaFeedbacks[criterion.criteriaId] || ""
                                }
                                onChange={(e) =>
                                  handleCriteriaFeedbackChange(
                                    criterion.criteriaId,
                                    e.target.value
                                  )
                                }
                                className="rounded-lg"
                              />
                            </div>
                          </div>

                          {/* Right Column - Score Input */}
                          <div className="col-span-2 flex flex-col items-center justify-start">
                            <Text strong className="mb-2">
                              Score
                            </Text>
                            <AnimatedScoreInput
                              min={0}
                              max={criterion.maxScore}
                              step={0.25}
                              value={scores[criterion.criteriaId]}
                              onChange={(value) =>
                                handleScoreChange(criterion.criteriaId, value)
                              }
                              onBlur={() =>
                                handleScoreBlur(criterion.criteriaId)
                              }
                              status={
                                validationError &&
                                scores[criterion.criteriaId] === null
                                  ? "error"
                                  : ""
                              }
                              addonAfter={`/ ${criterion.maxScore}`}
                              size="large"
                              criteriaId={criterion.criteriaId}
                              animationTrigger={
                                animationTrigger[criterion.criteriaId]
                              }
                            />
                          </div>
                        </div>
                      </motion.div>
                    </Panel>
                  );
                })}
              </Collapse>
            </Card>
          </motion.div>

          {/* Total Score & General Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-md">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg mb-6 text-white">
                <div className="flex justify-between items-center">
                  <Title level={3} className="!mb-0 !text-white">
                    Total Score
                  </Title>
                  <Title level={1} className="!mb-0 !text-white">
                    {weightedTotalScore} / 10
                  </Title>
                </div>
              </div>

              <div>
                <Text strong className="block mb-3 text-lg">
                  General Feedback
                </Text>
                <TextArea
                  rows={6}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter general feedback for the student..."
                  className="rounded-lg"
                  size="large"
                />
              </div>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-end"
          >
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              onClick={handleSubmitReview}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
            >
              Send Review
            </Button>
          </motion.div>
        </Space>
      </div>
    </div>
  );
};

export default PeerReviewPage;
