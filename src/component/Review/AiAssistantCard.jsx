import React from 'react';
import { Bot, Sparkles, Zap } from 'lucide-react';

const AiAssistantCard = () => {
  return (
    // 'sticky top-8' giúp card này đứng yên khi cuộn trang
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
          AI sẽ phân tích và tóm tắt nội dung chính của bài làm, giúp bạn nắm bắt nhanh các điểm nổi bật trong bài.
        </p>
        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          <Zap className="w-4 h-4 mr-2" />
          Tạo tóm tắt
        </button>
      </div>
    </div>
  );
};

export default AiAssistantCard;