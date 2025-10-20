import React, { useState, useRef } from "react";
import {
  Upload,
  CheckCircle,
  RefreshCw,
  Loader2,
  FileText,
  Type,
  Download,
  Lock
} from "lucide-react";
import { submissionService } from "../../service/submissionService";
import { toast } from "react-toastify";
import ResubmitModal from "./ResubmitModal"; // Import modal

const SubmissionCard = ({
  initialSubmission,
  assignmentId,
  userId,
  assignmentStatus,
  onSubmissionSuccess,
}) => {
  // State cho form nộp bài LẦN ĐẦU
  const [selectedFile, setSelectedFile] = useState(null);
  const [keywords, setKeywords] = useState("");
  const fileInputRef = useRef(null);
  // State chung
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);


  const isSubmissionActive = assignmentStatus === 'Active';
  // Hàm xử lý nộp bài LẦN ĐẦU (POST)
  const handleCreate = async () => {
    if (!selectedFile) {
      toast.warn("Vui lòng chọn một tệp để nộp.");
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
        toast.success(result.message || "Nộp bài thành công!");
        onSubmissionSuccess();
      } else {
        toast.error(result.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      toast.error(error.message || "Không thể kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý nộp LẠI bài (PUT), được gọi từ modal
  const handleUpdate = async (updateData) => {
    setIsSubmitting(true);
    try {
      const result = await submissionService.updateSubmission(
        initialSubmission.submissionId,
        updateData
      );
      if (result.statusCode === 200) {
        toast.success(result.message || "Cập nhật bài nộp thành công!");
        setModalOpen(false); // Đóng modal
        onSubmissionSuccess(); // Làm mới dữ liệu
      } else {
        toast.error(result.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      toast.error(error.message || "Không thể kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Giao diện khi ĐÃ NỘP BÀI
  if (initialSubmission) {
    return (
      <>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-6 h-6 mr-3 text-green-700" />
            <h3 className="text-lg font-bold text-green-800">Submitted</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Bạn đã nộp bài. Bạn có thể nộp lại để cập nhật.
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
             {/* 3. Vô hiệu hóa nút Resubmit nếu trạng thái không phải là Active */}
            <button
              onClick={() => setModalOpen(true)}
              disabled={!isSubmissionActive} // <-- THÊM ĐIỀU KIỆN
              className={`flex-1 flex items-center justify-center px-4 py-2 text-white font-semibold rounded-md ${
                isSubmissionActive
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
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
        Tải lên bài làm của bạn. Hỗ trợ PDF, DOC, ZIP (tối đa 50MB).
      </p>

      <div
        className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
            isSubmissionActive ? 'border-gray-300 cursor-pointer hover:border-blue-500' : 'border-gray-200 bg-gray-50'
        }`}
        onClick={isSubmissionActive ? () => fileInputRef.current.click() : undefined}
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
          <p className="text-gray-500">{isSubmissionActive ? 'Kéo thả hoặc nhấn để chọn tệp' : 'Submission is not active'}</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
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

      <button
        onClick={handleCreate}
        disabled={!isSubmissionActive || isSubmitting || !selectedFile} // <-- 4. Vô hiệu hóa nút Submit
        className={`w-full mt-4 flex items-center justify-center px-4 py-2 text-white font-semibold rounded-md ${
            isSubmissionActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
            isSubmissionActive ? <Upload className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />
        )}
        {isSubmitting ? "Đang nộp..." : "Submit"}
      </button>
    </div>
  );
};

export default SubmissionCard;
