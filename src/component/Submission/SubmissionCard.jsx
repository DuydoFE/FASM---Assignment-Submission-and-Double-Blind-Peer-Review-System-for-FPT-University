import React, { useState, useRef } from "react";
import {
  Upload,
  CheckCircle,
  RefreshCw,
  Loader2,
  FileText,
  Type,
} from "lucide-react";
import { submissionService } from "../../service/submissionService";
import { toast } from "react-toastify";

const SubmissionCard = ({
  hasSubmitted,
  assignmentId,
  userId,
  onSubmissionSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState("");
  const fileInputRef = useRef(null);

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

      // FIX: Thêm mã 201 (Created) vào điều kiện kiểm tra thành công.
      // API thường trả về 201 khi tạo mới một tài nguyên.
      if (result.statusCode === 200 || result.statusCode === 100 || result.statusCode === 201) {
        toast.success(result.message || "Nộp bài thành công!");
        onSubmissionSuccess();
      } else {
        // Xử lý lỗi validation từ server
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

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-3">
        <Upload className="w-6 h-6 mr-3 text-gray-700" />
        <h3 className="text-lg font-bold text-gray-800">Submit</h3>
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
          Keywords {/* Sửa lỗi chính tả từ "Tittle" */}
        </label>
        <div className="relative">
          <Type className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="keywords"
            value={keywords}
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
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        {isSubmitting ? "Đang nộp..." : "Submit"}
      </button>
    </div>
  );
};

export default SubmissionCard;