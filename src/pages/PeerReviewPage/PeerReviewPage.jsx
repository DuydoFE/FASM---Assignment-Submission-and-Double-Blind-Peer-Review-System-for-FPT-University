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
  Zap
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

  // === 1. State được chuyển từ AiAssistantCard vào đây ===
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState(null); // Sẽ chứa cả điểm và feedback từ AI

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
            },
            {}
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
    const maxScore = reviewData.rubric.criteria.find(
      (c) => c.criteriaId === criteriaId
    )?.maxScore;
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
      const weightedScore =
        (score / criterion.maxScore) * (criterion.weight / 100);
      return acc + weightedScore;
    }, 0);
    return Math.round(total * 100);
  }, [scores, reviewData]);

  // === 2. Logic tạo tóm tắt AI được chuyển vào đây ===
  const handleGenerateAiSummary = async () => {
    if (!reviewData?.submissionId) {
      toast.error("Không tìm thấy ID bài nộp để tạo phân tích.");
      return;
    }
    setIsGeneratingAi(true);
    setAiSummaryData(null); // Reset dữ liệu cũ
    try {
      const response = await reviewService.generateAiReview(reviewData.submissionId);
      if (response.statusCode === 200 && response.data) {
        setAiSummaryData(response.data); // Lưu toàn bộ data từ AI
        toast.success("AI đã phân tích và gợi ý điểm xong!");
      } else {
        throw new Error("Dữ liệu AI trả về không hợp lệ.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo phân tích AI thất bại. Vui lòng thử lại.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmitReview = async () => {
    const isAllScoresFilled = Object.values(scores).every(
      (score) => score !== null
    );
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
        criteriaFeedbacks: reviewData.rubric.criteria.map((c) => ({
          criteriaId: c.criteriaId,
          score: scores[c.criteriaId] || 0,
          feedback: "",
        })),
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

  if (isLoading)
    return (
      <div className="p-8 text-center text-xl">Đang tìm bài làm để chấm...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500 text-xl">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header (Không đổi) */}
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
              <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100">
                <ArrowLeft size={16} className="mr-2" />
                Quay lại
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                <Star size={16} className="mr-2" /> Review
              </button>
            </div>
          </div>
        </div>

        {/* === THAY ĐỔI: Bỏ đi grid layout, dùng container mới để nội dung rộng ra === */}
        <div className="space-y-8">
          {/* Thông tin bài nộp */}
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
                <span className="text-gray-500 flex-shrink-0">
                  2.3 MB • 4 trang
                </span>
                <div className="ml-auto flex space-x-2">
                  <a href={reviewData.fileUrl} target="_blank" rel="noopener noreferrer" title="Xem trước file" className="p-2 hover:bg-gray-100 rounded-full">
                    <Eye size={18} />
                  </a>
                  <a href={reviewData.fileUrl} download={reviewData.fileName} title="Tải file" className="p-2 hover:bg-gray-100 rounded-full">
                    <Download size={18} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bảng chấm điểm */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-6 p-3 bg-gray-50 rounded-lg border">
              <button className="flex items-center px-4 py-2 border rounded-md font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 text-sm">
                <Sparkles size={14} className="mr-2" />
                Auto Score
              </button>
              <button onClick={handleGenerateAiSummary} disabled={isGeneratingAi} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 text-sm disabled:bg-green-400 disabled:cursor-not-allowed">
                {isGeneratingAi ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Bot size={14} className="mr-2" />}
                Create Summary AI
              </button>
              <button className="flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700 hover:bg-gray-100 text-sm">
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
                const aiFeedbackForItem = aiSummaryData?.feedbacks?.find(f => f.criteriaId === criterion.criteriaId);
                return (
                  <div key={criterion.criteriaId} className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-5">
                      <h4 className="font-bold text-gray-800">{criterion.title || criterion.criteriaName}</h4>
                      <p className="text-sm text-gray-500 mt-1">{criterion.description}</p>
                      <div className="mt-2 flex items-center">
                         <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${criterion.weight}%` }}></div>
                         </div>
                         <span className="ml-3 text-sm font-semibold text-blue-600">{criterion.weight}%</span>
                      </div>
                    </div>
                    <div className="col-span-5">
                      {isGeneratingAi ? (
                         <div className="flex items-center text-gray-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" /><span>Analyzing...</span></div>
                      ) : aiFeedbackForItem ? (
                        <div>
                          <div className="flex items-center mb-1"><span className="font-semibold text-gray-700 text-sm">{aiFeedbackForItem.title}</span><span className="ml-2 text-xs font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">{criterion.weight}%</span></div>
                          <p className="text-sm text-gray-600">{aiFeedbackForItem.summary}</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400"><Zap size={24} className="mx-auto mb-1" /><p className="text-sm font-semibold">No AI summary yet</p><p className="text-xs">Click 'Generate AI summary' to analyzes</p></div>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                       <input type="number" min="0" max={criterion.maxScore} value={scores[criterion.criteriaId] === null ? '' : scores[criterion.criteriaId]} onChange={(e) => handleScoreChange(criterion.criteriaId, e.target.value)} placeholder="0" className={`w-20 text-center font-bold text-lg border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationError && scores[criterion.criteriaId] === null ? 'border-red-500 ring-red-200' : 'border-gray-300'} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
                       <span className="text-gray-500 text-lg font-semibold ml-2">/ {criterion.maxScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Gợi ý điểm từ AI */}
          {aiSummaryData && (
              <div className="bg-white p-6 rounded-lg border animate-fade-in">
                <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4"><Bot className="w-6 h-6 mr-3 text-blue-600" />Gợi ý chấm điểm từ AI</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                   <p className="font-semibold">Tổng điểm: <span className="text-blue-600 font-bold text-xl">{aiSummaryData.totalScore}</span> / 100 ≈ {aiSummaryData.totalScore / 10} / 10</p>
                   <p className="text-gray-700 mt-2">{aiSummaryData.overallComment}</p>
                </div>
              </div>
          )}

          {/* Total Score và Comment */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <span className="text-xl font-bold text-blue-800">Total Score</span>
              <span className="text-3xl font-extrabold text-blue-600">{totalScore}/100</span>
            </div>
            <div className="mt-6">
              <label className="font-bold text-gray-800 mb-2 block">Comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập nhận xét cho sinh viên..."/>
            </div>
          </div>

          {/* Nút gửi bài */}
          <div className="flex justify-end">
            <button onClick={handleSubmitReview} className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
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