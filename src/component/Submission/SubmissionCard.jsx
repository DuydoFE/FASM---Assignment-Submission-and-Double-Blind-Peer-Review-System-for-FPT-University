import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  CheckCircle,
  RefreshCw,
  Loader2,
  FileText,
  Type,
  Download, // <-- Import icon Download
} from "lucide-react";
import { submissionService } from "../../service/submissionService";
import { toast } from "react-toastify";

const SubmissionCard = ({
  initialSubmission, // <-- Prop mới
  assignmentId,
  userId,
  onSubmissionSuccess,
}) => {
  // State để quyết định có hiển thị form upload hay không
  // Mặc định, nếu có bài nộp sẵn thì không hiển thị form
  const [isUploadMode, setUploadMode] = useState(!initialSubmission);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUploadMode(!initialSubmission);
    if (initialSubmission) {
      setKeywords(initialSubmission.keywords || "");
    }
  }, [initialSubmission]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.warn("Vui lòng chọn một tệp để nộp.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        assignmentId: assignmentId,
        userId: userId,
        file: selectedFile,
        keywords: keywords,
      };

      const result = await submissionService.submitAssignment(submissionData);

      
      if (result.statusCode === 200 || result.statusCode === 100 || result.statusCode === 201) {
        toast.success(result.message || "Nộp bài thành công!");
        onSubmissionSuccess();
      } else {
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
          toast.error(errorMessages.join("\n"));
        } else {
          toast.error(result.message || "Đã xảy ra lỗi khi nộp bài.");
        }
      }
    } catch (error) {
      const errorMessage =
        error.title || error.message || "Không thể kết nối tới máy chủ.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
if (!isUploadMode && initialSubmission) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center mb-3">
          <CheckCircle className="w-6 h-6 mr-3 text-green-700" />
          <h3 className="text-lg font-bold text-green-800">Submitted</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You have submitted this assignment. You can resubmit to update your work.
        </p>
        
        {/* Hiển thị thông tin file và keywords đã nộp */}
        <div className="bg-white p-4 rounded-md space-y-3 border">
           <div className="flex items-start">
              <FileText className="w-5 h-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                  <p className="text-sm font-medium text-gray-500">File Name</p>
                  <p className="font-semibold text-gray-800 break-all">{initialSubmission.originalFileName}</p>
              </div>
           </div>
           <div className="flex items-start">
              <Type className="w-5 h-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                  <p className="text-sm font-medium text-gray-500">Keywords</p>
                  <p className="font-semibold text-gray-800">{initialSubmission.keywords}</p>
              </div>
           </div>
        </div>

        <div className="flex space-x-3 mt-4">
             {/* Nút Download */}
             <a
              href={initialSubmission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
            {/* Nút Resubmit */}
            <button
              onClick={() => setUploadMode(true)} // <-- Chuyển sang chế độ upload
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resubmit
            </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-3">
        <Upload className="w-6 h-6 mr-3 text-gray-700" />
        <h3 className="text-lg font-bold text-gray-800">{initialSubmission ? "Resubmit New Version" : "Submit"}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Upload your file. Supports PDF, DOC, ZIP (up to 50MB).
      </p>

      {/* Khu vực chọn file */}
      <div
        className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
        onClick={handleSelectFileClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {selectedFile ? (
          <div className="flex items-center justify-center text-gray-700">
            <FileText className="w-5 h-5 mr-2" />
            <span>{selectedFile.name}</span>
          </div>
        ) : (
          <p className="text-gray-500">Kéo thả hoặc nhấn để chọn tệp</p>
        )}
      </div>

      {/* Ô nhập liệu cho Keywords */}
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
            value={keywords} // <-- Sẽ tự điền keywords cũ nếu có
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="example: react, redux, api,..."
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedFile}
        className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
          {isSubmitting ? "Submitting..." : (initialSubmission ? "Submit New Version" : "Submit")}
      </button>
    </div>
  );
};

export default SubmissionCard;