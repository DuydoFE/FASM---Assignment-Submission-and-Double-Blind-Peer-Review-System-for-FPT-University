import React, { useState } from "react";
import { Bot, Sparkles, Zap, Loader2, RotateCcw } from "lucide-react";
import { reviewService } from "../../service/reviewService"; 
import { toast } from "react-toastify";

const AiAssistantCard = ({ submissionId, criteria = [] }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const [aiFeedback, setAiFeedback] = useState(null);

  const handleGenerateFeedback = async () => {
    if (!submissionId) {
      toast.error("Submission ID not found to create analysis.");
      return;
    }

    setIsGenerating(true);
    setAiFeedback(null); 
    try {
      const response = await reviewService.generateAiReview(submissionId);
      
      if (response.statusCode === 200 && response.data?.feedbacks) {
        setAiFeedback(response.data.feedbacks);
        toast.success("AI has finished analyzing by criteria!");
      } else {
        throw new Error("Returned data is invalid.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Analysis creation failed. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to find criteria weight
  const getCriterionWeight = (criteriaId) => {
    const criterion = criteria.find(c => c.criteriaId === criteriaId);
    return criterion ? criterion.weight : null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-8">
      <div className="flex items-center mb-4">
        <Bot className="w-6 h-6 mr-3 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">AI support for grading</h3>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center font-semibold text-blue-800 mb-2">
          <Sparkles size={18} className="mr-2" />
          Quick summary by criteria using AI
        </div>
        <p className="text-sm text-gray-600 mb-4">
         AI will analyze the essay and give feedback suggestions for each criterion.
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
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Create a summary
            </>
          )}
        </button>
      </div>

      {/* 👉 NEW RESULT DISPLAY BLOCK */}
      {aiFeedback && (
        <div className="mt-6 animate-fade-in">
          <h4 className="font-bold text-gray-800 mb-3">Summary by criteria</h4>
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
              <RotateCcw className="w-3 h-3 mr-1.5" /> Recreate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantCard;