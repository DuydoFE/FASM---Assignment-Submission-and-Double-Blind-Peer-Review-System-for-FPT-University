import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  FileText,
  ShieldAlert,
  Copy,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";

const ResultCard = ({ title, subtitle, icon: Icon, colorClass, children, isLoading, isFinished }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-4 animate-pulse flex items-center">
        <div className={`w-12 h-12 rounded-full bg-gray-200 mr-4`} />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-4 animate-in slide-in-from-bottom-2 fade-in duration-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start">
          <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 mr-3`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-base">{title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {isFinished && (
          <div className="bg-green-500 rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <div className="pl-[52px]">{children}</div>
    </div>
  );
};

const CircularProgress = ({ score, threshold }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score, 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isHigh = score > threshold;
  const color = isHigh ? "text-red-500" : "text-green-500";

  return (
    <div className="relative w-40 h-40 mx-auto my-4">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-gray-100"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold ${color}`}>
          {score.toFixed(2)}%
        </span>
        <span className="text-xs text-gray-400 font-bold uppercase mt-1">
          Similarity
        </span>
      </div>
    </div>
  );
};

const PlagiarismResultModal = ({ isOpen, onClose, data }) => {
  
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen && data) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 600);  
      const timer2 = setTimeout(() => setStep(2), 1400); 
      const timer3 = setTimeout(() => setStep(3), 2200); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const score = parseFloat(data.plagiarismContent ?? 0);
  const threshold = parseFloat(data.threshold ?? 0);
  const isRelevant = data.relevantContent !== false;
  const hasAiAnalysis = data.contentChecking && data.contentChecking.length > 0;

  const relevantStatus = isRelevant
    ? { 
        bg: "bg-green-50", 
        border: "border-green-200", 
        text: "text-green-800", 
        label: "PASS", 
        title: "Status: Content is relevant", 
        desc: "The submission content matches the assignment requirements." 
      }
    : { 
        bg: "bg-red-50", 
        border: "border-red-200", 
        text: "text-red-800", 
        label: "FAIL", 
        title: "Status: Content irrelevant", 
        desc: "The content does not appear relevant to the assignment." 
      };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">
            Submission Check Results
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-gray-50/50 space-y-2">
          
          <ResultCard 
            title="Relevant Content Check" 
            subtitle="Checking content relevance against requirements"
            icon={FileText}
            colorClass="text-blue-600"
            isLoading={step < 1}
            isFinished={step >= 1}
          >
            <div className={`flex justify-between items-center p-4 rounded-lg border ${relevantStatus.bg} ${relevantStatus.border}`}>
               <div>
                  <h5 className={`font-bold ${relevantStatus.text}`}>{relevantStatus.title}</h5>
                  <p className={`text-sm ${relevantStatus.text} opacity-80`}>{relevantStatus.desc}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isRelevant ? 'bg-green-500' : 'bg-red-500'}`}>
                 {relevantStatus.label}
               </span>
            </div>
          </ResultCard>

          {step >= 1 && (
             <ResultCard 
              title="Content Integrity Check" 
              subtitle="Checking content integrity and validity"
              icon={ShieldAlert}
              colorClass="text-orange-500"
              isLoading={step < 2}
              isFinished={step >= 2}
            >
              {hasAiAnalysis ? (
                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-bold text-red-800 text-sm mb-1">AI Analysis Detail:</h5>
                    <p className="text-sm text-red-700 leading-relaxed italic">
                       "{data.contentChecking}"
                    </p>
                 </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                   <p className="text-sm text-green-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      No integrity issues detected.
                   </p>
                </div>
              )}
            </ResultCard>
          )}

          {step >= 2 && (
            <ResultCard 
              title="Plagiarism Detection" 
              subtitle="Checking for plagiarism and similarity"
              icon={Copy}
              colorClass="text-red-500"
              isLoading={step < 3}
              isFinished={step >= 3}
            >
              <div className="flex flex-col items-center">
                 <CircularProgress score={score} threshold={threshold} />
                 
                 <div className={`w-full p-3 rounded-lg border flex items-center justify-center text-sm font-medium
                    ${score > threshold ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-green-50 border-green-200 text-green-800'}
                 `}>
                    {score > threshold ? (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                        Exceeds threshold: {threshold}% | Current: {score.toFixed(2)}%
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Safe. Below allowed threshold ({threshold}%)
                      </>
                    )}
                 </div>
              </div>
            </ResultCard>
          )}

        </div>

        {step >= 3 && (
            <div className="p-4 border-t bg-white flex justify-end animate-in slide-in-from-bottom-5 duration-500">
            <button
                onClick={onClose}
                className="px-8 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Close Results
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PlagiarismResultModal;