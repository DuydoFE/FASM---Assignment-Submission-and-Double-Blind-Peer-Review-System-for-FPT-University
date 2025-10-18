import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, RefreshCw, Loader2, FileText } from 'lucide-react';
import { submissionService } from '../../service/submissionService'; // Import service mới
import { toast } from 'react-toastify'; // Dùng để hiển thị thông báo

// Thêm props mới: assignmentId, userId và một hàm callback onSubmissionSuccess
const SubmissionCard = ({ hasSubmitted, assignmentId, userId, onSubmissionSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null); // Ref để trigger input file ẩn

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Optional: Kiểm tra kích thước và loại tệp ở đây
      setSelectedFile(file);
    }
  };

  const handleSelectFileClick = () => {
    // Mở hộp thoại chọn tệp khi người dùng nhấn vào khu vực dropzone
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
      };

      const result = await submissionService.submitAssignment(submissionData);

      if (result.statusCode === 200 || result.statusCode === 100) { // Kiểm tra statusCode thành công
        toast.success(result.message || "Nộp bài thành công!");
        onSubmissionSuccess(); // Gọi callback để trang cha có thể làm mới dữ liệu
      } else {
        toast.error(result.message || "Đã xảy ra lỗi khi nộp bài.");
      }
    } catch (error) {
      toast.error("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Giao diện khi đã nộp bài (có thể cải tiến để hiển thị thông tin bài nộp)
  if (hasSubmitted && !selectedFile) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
         <div className="flex items-center mb-3">
            <Upload className="w-6 h-6 mr-3 text-green-700" />
            <h3 className="text-lg font-bold text-green-800">Submit</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Bạn đã nộp bài. Bạn có thể nộp lại để cập nhật bài làm của mình.
        </p>
        <div className="bg-white p-3 rounded-md flex items-center text-sm mb-4">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            <div>
                <p className="font-semibold text-green-700">Đã nộp bài thành công</p>
                <p className="text-gray-500">Chọn tệp mới để nộp lại.</p>
            </div>
        </div>
         {/* Khu vực chọn file để nộp lại */}
        <div 
            className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
            onClick={handleSelectFileClick}
        >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" // Ẩn input mặc định
            />
            {selectedFile ? (
                <div className="flex items-center justify-center text-gray-700">
                    <FileText className="w-5 h-5 mr-2" />
                    <span>{selectedFile.name}</span>
                </div>
            ) : (
                <p className="text-gray-500">Kéo thả hoặc nhấn để chọn tệp mới</p>
            )}
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedFile}
          className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {isSubmitting ? 'Đang nộp...' : 'Nộp lại'}
        </button>
      </div>
    );
  }

  // Giao diện khi chưa nộp bài hoặc đang trong quá trình chọn file để nộp lại
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
          <Upload className="w-6 h-6 mr-3 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-800">Submit</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Tải lên bài làm của bạn. Hỗ trợ PDF, DOC, ZIP (tối đa 50MB). Có thể nộp nhiều lần.
        </p>
        {/* Khu vực kéo thả và chọn file */}
        <div 
            className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
            onClick={handleSelectFileClick}
        >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" // Ẩn input mặc định
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
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedFile}
          className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {isSubmitting ? 'Đang nộp...' : 'Submit'}
        </button>
    </div>
  );
};

export default SubmissionCard;