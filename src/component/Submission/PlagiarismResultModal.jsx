import React from "react";
import { X, CheckCircle, AlertTriangle, FileWarning, Info } from "lucide-react";

const PlagiarismResultModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const score = parseFloat(data.plagiarismContent ?? 0);
  const threshold = parseFloat(data.threshold ?? 0);

  const isOverThreshold = score > threshold;
  const isIrrelevant = data.relevantContent === false;

  let statusColor = "text-green-600";
  let circleColor = "border-green-400 bg-green-50";
  let statusBg = "bg-green-100 border-green-200";

  if (isIrrelevant) {
    statusColor = "text-red-600";
    circleColor = "border-red-400 bg-red-50";
    statusBg = "bg-red-50 border-red-200";
  } else if (isOverThreshold) {
    statusColor = "text-orange-600";
    circleColor = "border-orange-400 bg-orange-50";
    statusBg = "bg-orange-50 border-orange-200";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            Submission Check Results
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`${
                    isIrrelevant
                      ? "text-red-500"
                      : isOverThreshold
                      ? "text-orange-500"
                      : "text-green-500"
                  } transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-extrabold ${statusColor}`}>
                  {score.toFixed(2)}%
                </span>
                <span className="text-xs text-gray-500 font-semibold uppercase mt-1">
                  Similarity
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border ${statusBg} mb-4 flex items-start`}
          >
            {isIrrelevant ? (
              <FileWarning className="w-6 h-6 mr-3 text-red-600 flex-shrink-0 mt-0.5" />
            ) : isOverThreshold ? (
              <AlertTriangle className="w-6 h-6 mr-3 text-orange-600 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
            )}

            <div>
              <h4 className={`font-bold text-sm ${statusColor} mb-1`}>
                {isIrrelevant
                  ? "Submission Content Issue Detected"
                  : isOverThreshold
                  ? "High Similarity Detected"
                  : "Safe to Submit"}
              </h4>
              <p className="text-xs text-gray-700">
                {isIrrelevant
                  ? "The content appears unrelated to the assignment or contains anomalies."
                  : `Your similarity score is ${
                      isOverThreshold ? "above" : "within"
                    } the allowed limit.`}
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-6">
            The maximum allowable threshold for this exercise is:{" "}
            <span className="font-bold text-gray-800">{threshold}%</span>
          </div>

          {data.contentChecking && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
              <div className="flex items-center mb-2 text-gray-800 font-bold">
                <Info className="w-4 h-4 mr-2 text-blue-500" />
                AI Analysis Detail:
              </div>
              <p className="text-gray-700 italic leading-relaxed text-justify">
                "{data.contentChecking}"
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
export default PlagiarismResultModal;
