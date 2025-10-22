import React, { useState } from "react";
import { Bot, Sparkles, Zap, Loader2, AlertCircle } from "lucide-react";
import { reviewService } from "../../service/reviewService"; 
import { toast } from "react-toastify";

const AiAssistantCard = ({ submissionId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);

  const handleGenerateSummary = async () => {
    if (!submissionId) {
      toast.error("Không tìm thấy ID bài nộp để tạo tóm tắt.");
      return;
    }

    setIsGenerating(true);
    try {
      const data = await reviewService.generateAiReview(submissionId);

      
      const summaryContent = data.data || data;

      setAiSummary(summaryContent);
      toast.success("Đã tạo tóm tắt thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Tạo tóm tắt thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
      <div className="flex items-center mb-4">
        <Bot className="w-6 h-6 mr-3 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Hỗ trợ AI chấm bài</h3>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center font-semibold text-blue-800 mb-2">
          <Sparkles size={18} className="mr-2" />
          Tóm tắt nhanh bằng AI
        </div>

        {!aiSummary ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              AI sẽ phân tích và tóm tắt nội dung chính của bài làm, giúp bạn
              nắm bắt nhanh các điểm nổi bật trong bài.
            </p>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating || !submissionId}
              className={`w-full flex items-center justify-center px-4 py-2 font-semibold rounded-md text-white transition-all
                ${
                  isGenerating || !submissionId
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Tạo tóm tắt
                </>
              )}
            </button>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="text-sm text-gray-800 bg-white p-3 rounded border border-blue-100 mb-3 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {typeof aiSummary === "string"
                ? aiSummary
                : JSON.stringify(aiSummary)}
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="w-full flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 text-sm"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Tạo lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Icon reload nhỏ nếu cần
const RotateCcw = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default AiAssistantCard;
