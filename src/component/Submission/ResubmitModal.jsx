import React, { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, FileText, Type, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ResubmitModal = ({ isOpen, onClose, onSubmit, initialKeywords, isSubmitting }) => {
  const [newFile, setNewFile] = useState(null);
  const [newKeywords, setNewKeywords] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Cập nhật keywords ban đầu khi modal được mở
    if (isOpen) {
      setNewKeywords(initialKeywords || '');
      setNewFile(null); // Reset file mỗi khi mở modal
    }
  }, [isOpen, initialKeywords]);

  const handleFileChange = (event) => {
    setNewFile(event.target.files[0]);
  };

  const handleConfirmSubmit = () => {
    if (!newFile) {
      toast.warn("Vui lòng chọn một tệp mới để nộp lại.");
      return;
    }
    // Gọi hàm onSubmit được truyền từ cha
    onSubmit({ file: newFile, keywords: newKeywords });
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Lớp phủ (Overlay)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Nội dung Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Update Submission</h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Khu vực chọn file */}
        <div
          className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
          onClick={() => fileInputRef.current.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          {newFile ? (
            <div className="flex items-center justify-center text-gray-700">
              <FileText className="w-5 h-5 mr-2" />
              <span>{newFile.name}</span>
            </div>
          ) : (
            <p className="text-gray-500">Drag and drop or click to select files</p>
          )}
        </div>

        {/* Ô nhập liệu Keywords */}
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: react, redux, api,..."
            />
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSubmit}
            disabled={isSubmitting || !newFile}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Submit Update'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResubmitModal;