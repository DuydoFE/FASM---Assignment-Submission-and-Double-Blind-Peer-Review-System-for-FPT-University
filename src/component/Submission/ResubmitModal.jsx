import React, { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, FileText, Type, X, ScanSearch } from 'lucide-react';
import { toast } from 'react-toastify';
import { submissionService } from "../../service/submissionService";
import PlagiarismResultModal from "./PlagiarismResultModal";

const ResubmitModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialKeywords, 
  isSubmitting, 
  assignmentId 
}) => {
  const [newFile, setNewFile] = useState(null);
  const [newKeywords, setNewKeywords] = useState('');
  const fileInputRef = useRef(null);

  const [isCheckingSubmission, setIsCheckingSubmission] = useState(false);
  const [submissionCheckResult, setSubmissionCheckResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewKeywords(initialKeywords || '');
      setNewFile(null); 
      setSubmissionCheckResult(null); 
    }
  }, [isOpen, initialKeywords]);

  const handleFileChange = (event) => {
    setNewFile(event.target.files[0]);
    setSubmissionCheckResult(null); 
  };

  const handleConfirmSubmit = () => {
    if (!newFile) {
      toast.warn("Please select a new file to resubmit.");
      return;
    }
    onSubmit({ file: newFile, keywords: newKeywords });
  };


  const handleCheckSubmission = async () => {
    if (!newFile) {
      toast.warn("Please upload a new file to check.");
      return;
    }

    setIsCheckingSubmission(true);
    try {
      const result = await submissionService.checkPlagiarism(assignmentId, newFile);
      
      if (result.statusCode === 200 || result.statusCode === 100) {
   
        setSubmissionCheckResult({
            ...result.data,
            errors: result.errors || [],
            warnings: result.warnings || []
        });
        setIsResultModalOpen(true);
      } else {
        toast.error(result.message || "Unable to check submission.");
      }
    } catch (error) {
      toast.error(error.message || "Server connection error.");
    } finally {
      setIsCheckingSubmission(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Update Submission</h3>
            <button onClick={onClose} disabled={isSubmitting} className="text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>

           <div
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              newFile 
                ? "border-blue-300 bg-blue-50" 
                : "border-gray-300 cursor-pointer hover:border-blue-500"
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            {newFile ? (
              <div className="flex items-center justify-center text-blue-700 font-medium">
                <FileText className="w-5 h-5 mr-2" />
                <span>{newFile.name}</span>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Drag and drop or click to select files</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="resubmit-keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <div className="relative">
              <Type className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="resubmit-keywords"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
                placeholder="Ví dụ: react, redux, api,..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
             <div>
              {newFile && (
                <button
                  onClick={handleCheckSubmission}
                  disabled={isCheckingSubmission || isSubmitting}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors bg-indigo-50 px-3 py-2 rounded-md hover:bg-indigo-100"
                  title="Check for validity and duplicates"
                >
                  {isCheckingSubmission ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ScanSearch className="w-4 h-4 mr-2" />
                  )}
                  {/* Đổi text hiển thị */}
                  {isCheckingSubmission ? "Checking..." : "Check Submission"}
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting || !newFile || isCheckingSubmission}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[60]">
        <PlagiarismResultModal 
          isOpen={isResultModalOpen} 
          onClose={() => setIsResultModalOpen(false)} 
          data={submissionCheckResult} 
        />
      </div>
    </>
  );
};

export default ResubmitModal;