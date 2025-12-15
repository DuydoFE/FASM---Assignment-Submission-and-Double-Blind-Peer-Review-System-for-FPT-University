import React, { useState, useRef } from "react";
import {
  Upload,
  CheckCircle,
  RefreshCw,
  Loader2,
  FileText,
  Type,
  Download,
  Lock,
  ScanSearch,
} from "lucide-react";
import { submissionService } from "../../service/submissionService";
import { toast } from "react-toastify";
import ResubmitModal from "./ResubmitModal";
import PlagiarismResultModal from "./PlagiarismResultModal";

const SubmissionCard = ({
  initialSubmission,
  assignmentId,
  userId,
  assignmentStatus,
  onSubmissionSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [keywords, setKeywords] = useState("");
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [isCheckingSubmission, setIsCheckingSubmission] = useState(false);
  const [submissionCheckResult, setSubmissionCheckResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const isSubmissionActive = assignmentStatus === "Active";

  const handleCreate = async () => {
    if (!selectedFile) {
      toast.warn("Please select a file to submit.");
      return;
    }
    setIsSubmitting(true);
    try {
      const submissionData = {
        assignmentId,
        userId,
        file: selectedFile,
        keywords,
      };
      const result = await submissionService.submitAssignment(submissionData);
      if (result.statusCode === 201 || result.statusCode === 200) {
        toast.success(result.message || "Submission successful!");
        onSubmissionSuccess();
      } else {
        toast.error(result.message || "An error occurred.");
      }
    } catch (error) {
      toast.error(error.message || "Unable to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (updateData) => {
    setIsSubmitting(true);
    try {
      const result = await submissionService.updateSubmission(
        initialSubmission.submissionId,
        updateData
      );
      if (result.statusCode === 200) {
        toast.success(result.message || "Update submission successful!");
        setModalOpen(false);
        onSubmissionSuccess();
      } else {
        toast.error(result.message || "Update failed.");
      }
    } catch (error) {
      toast.error(error.message || "Unable to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckSubmission = async () => {
    if (!selectedFile) {
      toast.warn("Please select a file to check.");
      return;
    }

    setIsCheckingSubmission(true);
    try {
      const result = await submissionService.checkPlagiarism(
        assignmentId,
        selectedFile
      );

      if (result.statusCode === 200 || result.statusCode === 100) {
        setSubmissionCheckResult({
          ...result.data,
          errors: result.errors || [],
          warnings: result.warnings || [],
        });
        setIsResultModalOpen(true);
      } else {
        toast.error(result.message || "Unable to check submission.");
      }
    } catch (error) {
      toast.error(error.message || "ServerError: Unable to connect to server.");
    } finally {
      setIsCheckingSubmission(false);
    }
  };

  if (initialSubmission) {
    return (
      <>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-6 h-6 mr-3 text-green-700" />
            <h3 className="text-lg font-bold text-green-800">Submitted</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            You have submitted your work. You can resubmit to update it.
          </p>

          <div className="bg-white p-4 rounded-md space-y-3 border">
            <div className="flex items-start">
              <FileText className="w-5 h-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">File Name</p>
                <p className="font-semibold text-gray-800 break-all">
                  {initialSubmission.originalFileName}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Type className="w-5 h-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Keywords</p>
                <p className="font-semibold text-gray-800">
                  {initialSubmission.keywords}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-4">
            <a
              href={initialSubmission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>

            <button
              onClick={() => setModalOpen(true)}
              disabled={!isSubmissionActive}
              className={`flex-1 flex items-center justify-center px-4 py-2 text-white font-semibold rounded-md ${
                isSubmissionActive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmissionActive ? (
                <RefreshCw className="w-4 h-4 mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Resubmit
            </button>
          </div>
        </div>

        <ResubmitModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleUpdate}
          initialKeywords={initialSubmission.keywords}
          isSubmitting={isSubmitting}
          assignmentId={assignmentId}
        />
      </>
    );
  }

  // Giao diện khi CHƯA NỘP BÀI
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-3">
        <Upload className="w-6 h-6 mr-3 text-gray-700" />
        <h3 className="text-lg font-bold text-gray-800">Submit</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Upload your work. Supports PDF, DOC, ZIP (up to 25MB).
      </p>

      <div
        className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
          isSubmissionActive
            ? "border-gray-300 cursor-pointer hover:border-blue-500"
            : "border-gray-200 bg-gray-50"
        }`}
        onClick={
          isSubmissionActive ? () => fileInputRef.current.click() : undefined
        }
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="hidden"
          disabled={!isSubmissionActive}
        />
        {selectedFile ? (
          <div className="flex items-center justify-center text-gray-700">
            <FileText className="w-5 h-5 mr-2" />
            <span>{selectedFile.name}</span>
          </div>
        ) : (
          <p className="text-gray-500">
            {isSubmissionActive
              ? "Kéo thả hoặc nhấn để chọn tệp"
              : "Submission is not active"}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label
          htmlFor="keywords"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Keywords
        </label>
        <div className="relative">
          <Type className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="Ví dụ: react, redux, api,..."
            disabled={!isSubmissionActive}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCheckSubmission}
          disabled={
            !isSubmissionActive ||
            isSubmitting ||
            isCheckingSubmission ||
            !selectedFile
          }
          className={`flex-1 flex items-center justify-center px-4 py-2 text-indigo-700 bg-indigo-50 border border-indigo-200 font-semibold rounded-md transition-colors ${
            isSubmissionActive && selectedFile
              ? "hover:bg-indigo-100 hover:border-indigo-300"
              : "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200"
          }`}
        >
          {isCheckingSubmission ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ScanSearch className="w-4 h-4 mr-2" />
          )}
          {isCheckingSubmission ? "Checking..." : "Check Submission"}
        </button>

        <button
          onClick={handleCreate}
          disabled={
            !isSubmissionActive ||
            isSubmitting ||
            isCheckingSubmission ||
            !selectedFile
          }
          className={`flex-1 flex items-center justify-center px-4 py-2 text-white font-semibold rounded-md ${
            isSubmissionActive
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isSubmissionActive ? (
            <Upload className="w-4 h-4 mr-2" />
          ) : (
            <Lock className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      <PlagiarismResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        data={submissionCheckResult}
      />
    </div>
  );
};

export default SubmissionCard;
