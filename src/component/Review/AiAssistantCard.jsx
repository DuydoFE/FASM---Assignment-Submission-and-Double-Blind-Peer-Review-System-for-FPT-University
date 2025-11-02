import React, { useState } from "react";
import { Bot, Sparkles, Zap, Loader2, RotateCcw } from "lucide-react";
import { reviewService } from "../../service/reviewService"; 
import { toast } from "react-toastify";

const AiAssistantCard = ({ submissionId, criteria = [] }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  // 👉 State mới để lưu danh sách feedback theo tiêu chí
  const [aiFeedback, setAiFeedback] = useState(null);

  const handleGenerateFeedback = async () => {
    if (!submissionId) {
      toast.error("Không tìm thấy ID bài nộp để tạo phân tích.");
      return;
    }

    setIsGenerating(true);
    setAiFeedback(null); // Xóa kết quả cũ khi tạo mới
    try {
      const response = await reviewService.generateAiReview(submissionId);
      
      if (response.statusCode === 200 && response.data?.feedbacks) {
        setAiFeedback(response.data.feedbacks);
        toast.success("AI đã phân tích xong theo tiêu chí!");
      } else {
        throw new Error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo phân tích thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Hàm helper để tìm trọng số của tiêu chí
  const getCriterionWeight = (criteriaId) => {
    const criterion = criteria.find(c => c.criteriaId === criteriaId);
    return criterion ? criterion.weight : null;
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
        <p className="text-sm text-gray-600 mb-4">
          AI sẽ phân tích bài làm và đưa ra gợi ý nhận xét cũng như điểm số cho từng tiêu chí.
        </p>
        <button
          onClick={handleGenerateFeedback}
          disabled={isGenerating || !submissionId}
          className={`w-full flex items-center justify-center px-4 py-2 font-semibold rounded-md text-white transition-all ${
            isGenerating || !submissionId
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
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
      </div>

      {/* 👉 KHỐI HIỂN THỊ KẾT QUẢ MỚI */}
      {aiFeedback && (
        <div className="mt-6 animate-fade-in">
          <h4 className="font-bold text-gray-800 mb-3">Tóm tắt theo tiêu chí</h4>
          <div className="space-y-3">
            {aiFeedback.map((item) => {
              const weight = getCriterionWeight(item.criteriaId);
              return (
                <div key={item.criteriaId} className="bg-gray-50 p-3 rounded-md border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-700 text-sm">{item.title}</span>
                    {weight !== null && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                        {weight}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.summary}</p>
                </div>
              );
            })}
             <button
              onClick={handleGenerateFeedback}
              disabled={isGenerating}
              className="w-full mt-4 flex items-center justify-center px-3 py-1.5 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 text-sm"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" /> Tạo lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantCard;