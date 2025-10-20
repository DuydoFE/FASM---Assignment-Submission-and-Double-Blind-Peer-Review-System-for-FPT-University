import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Download,
  Eye,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { reviewService } from "../../service/reviewService";
import CriterionForm from "../../component/Review/CriterionForm";
import AiAssistantCard from "../../component/Review/AiAssistantCard";
import { getCurrentAccount } from "../../utils/accountUtils";
import { toast } from 'react-toastify';

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

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!assignmentId) {
        setError("Không tìm thấy ID của assignment.");
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
            }, {}
          );
          setScores(initialScores);
        } else {
          throw new Error("Dữ liệu chấm điểm trả về không hợp lệ.");
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải bài làm để chấm. Vui lòng thử lại.");
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
    let newScore = parseInt(value, 10);
    const maxScore = reviewData.rubric.criteria.find(c => c.criteriaId === criteriaId)?.maxScore;
    if (!isNaN(newScore) && maxScore !== undefined) {
      newScore = Math.max(0, Math.min(newScore, maxScore));
      setScores((prevScores) => ({ ...prevScores, [criteriaId]: newScore }));
    }
  };

  const totalScore = useMemo(() => {
    const criteria = reviewData?.rubric?.criteria;
    if (!criteria || Object.keys(scores).length === 0) return 0;
    const total = criteria.reduce((acc, criterion) => {
      const score = scores[criterion.criteriaId] || 0;
      const weightedScore = (score / criterion.maxScore) * (criterion.weight / 100);
      return acc + weightedScore;
    }, 0);
    return Math.round(total * 100);
  }, [scores, reviewData]);

  const handleSubmitReview = async () => {
    const isAllScoresFilled = Object.values(scores).every(score => score !== null);
    if (!isAllScoresFilled) {
      const errorMessage = "Vui lòng nhập điểm cho tất cả các tiêu chí.";
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
        criteriaFeedbacks: reviewData.rubric.criteria.map(c => ({
          criteriaId: c.criteriaId,
          score: scores[c.criteriaId] || 0,
          feedback: ""
        }))
      };
      await reviewService.submitPeerReview(payload);
      const totalScoreValue = reviewData.rubric.criteria.reduce((acc, c) => {
        const score = scores[c.criteriaId] || 0;
        return acc + (score / c.maxScore) * (c.weight / 100);
      }, 0);
      navigate("/review-success", {
        state: {
          assignmentTitle: reviewData.assignmentTitle,
          studentName: reviewData.studentName,
          criteriaFeedbacks: reviewData.rubric.criteria.map((c) => ({
            criteriaId: c.criteriaId,
            criteriaName: c.criteriaName,
            score: scores[c.criteriaId] || 0,
            maxScore: c.maxScore,
          })),
          totalScore: Math.round(totalScoreValue * 100),
          generalFeedback: comment,
        },
      });
    } catch (err) {
      alert("Có lỗi khi gửi điểm, vui lòng thử lại!");
    }
  };

  if (isLoading) return <div className="p-8 text-center text-xl">Đang tìm bài làm để chấm...</div>;
  if (error) return <div className="p-8 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Link to={`/assignment/${courseId}/${assignmentId}`} className="hover:underline">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-semibold text-gray-800">Peer Review</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Peers Review - {reviewData.assignmentTitle}
              </h1>
              <p className="text-gray-500 mt-1">
                Mobile UI/UX Design Fundamentals
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                Quay lại
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <Star size={16} className="mr-2" /> Review
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-600 text-white flex items-center justify-center rounded-full font-bold text-xl mr-4">
                    {(reviewData.studentName ?? "S").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">
                      Assigment - {reviewData.studentName ?? "Sinh viên không xác định"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Subimitted: (4h) • ID bài làm: {reviewData.submissionId}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                  Not Reviewed
                </div>
              </div>
              {reviewData.fileUrl && (
                <div className="mt-4 pt-4 border-t flex items-center text-sm">
                  <p className="font-semibold mr-4 truncate">
                    {reviewData.fileName ?? "submission.pdf"}
                  </p>
                  <span className="text-gray-500 flex-shrink-0">2.3 MB • 4 trang</span>
                  <div className="ml-auto flex space-x-2">
                    <a
                      href={reviewData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Xem trước file"
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Eye size={18} />
                    </a>
                    <a
                      href={reviewData.fileUrl}
                      download={reviewData.fileName}
                      title="Tải file"
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Form Grading</h3>
                <div className="flex space-x-2">
                  <button className="flex items-center px-4 py-2 border rounded-md font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 text-sm">
                    <Sparkles size={14} className="mr-2" />
                    Auto Score
                  </button>
                  <button className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm">
                    <RotateCcw size={14} className="mr-2" />
                    Reset
                  </button>
                </div>
              </div>
              {validationError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-center mb-4 font-semibold">
                  {validationError}
                </div>
              )}
              {reviewData?.rubric?.criteria?.map((criterion) => (
                <CriterionForm
                  key={criterion.criteriaId}
                  criterion={criterion}
                  score={scores[criterion.criteriaId]}
                  onScoreChange={handleScoreChange}
                  hasError={validationError && scores[criterion.criteriaId] === null}
                />
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <span className="text-xl font-bold text-blue-800">
                  Total Score
                </span>
                <span className="text-3xl font-extrabold text-blue-600">
                  {totalScore}/100
                </span>
              </div>
              <div className="mt-6">
                <label className="font-bold text-gray-800 mb-2 block">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nhận xét cho sinh viên..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                onClick={handleSubmitReview}
              >
                <Send size={18} className="mr-2" />
                Send Review
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <AiAssistantCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerReviewPage;