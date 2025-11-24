import React, { useState } from "react";
import { X, FileSpreadsheet, Download, Loader2 } from "lucide-react";
import * as XLSX from 'xlsx'; 
import { toast } from "react-toastify";
import { getCurrentAccount } from "../../utils/accountUtils"; 
import { getExportSubmissions } from "../../service/submissionService";

const ExportExcelModal = ({ isOpen, onClose, courseInfo, assignments, classId }) => {
  const user = getCurrentAccount(); 
  const [selectAll, setSelectAll] = useState(true);
  const [selectedAssignments, setSelectedAssignments] = useState(
    assignments.map(a => a.assignmentId)
  );
  const [isExporting, setIsExporting] = useState(false); 

  if (!isOpen) return null;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(assignments.map(a => a.assignmentId));
    }
    setSelectAll(!selectAll);
  };

  const handleToggleAssignment = (assignmentId) => {
    if (selectedAssignments.includes(assignmentId)) {
      setSelectedAssignments(selectedAssignments.filter(id => id !== assignmentId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedAssignments, assignmentId];
      setSelectedAssignments(newSelected);
      if (newSelected.length === assignments.length) {
        setSelectAll(true);
      }
    }
  };

 const handleExport = async () => {
    if (!user || !user.id) {
      toast.error("Không tìm thấy thông tin giảng viên.");
      return;
    }

    if (selectedAssignments.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một bài tập để xuất.");
      return;
    }

    setIsExporting(true);
    try {
      let allSubmissions = [];
      // vòng lặp for...of để chạy tuần tự từng cái một
      for (const assignmentId of selectedAssignments) {
        // Await từng request xong mới chạy cái tiếp theo
        const response = await getExportSubmissions(user.id, classId, assignmentId);
        
        // Xử lý dữ liệu gộp vào mảng tổng ngay sau khi nhận response
        const data = Array.isArray(response) ? response : (response.data || []);
        allSubmissions = [...allSubmissions, ...data];
      }

      if (allSubmissions.length === 0) {
        toast.info("Không có dữ liệu bài nộp nào để xuất.");
        setIsExporting(false);
        return;
      }

      const exportData = allSubmissions.map(item => ({
        "Username": item.username,
        "Student Code": item.studentCode,
        "Assignment Title": item.assignmentTitle,
        "Class Name": item.className,
        "Course Name": item.courseName,
        "Final Score": item.finalScore
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      const wscols = [
        { wch: 20 }, // Username
        { wch: 15 }, // Student Code
        { wch: 40 }, // Assignment Title
        { wch: 15 }, // Class Name
        { wch: 30 }, // Course Name
        { wch: 10 }  // Final Score
      ];
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

      const fileName = `${courseInfo?.courseCode || 'Course'}_${courseInfo?.sectionCode || 'Class'}_Grades_${new Date().toLocaleDateString('en-GB').replace(/\//g, '')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Xuất file Excel thành công!");
      onClose();

    } catch (error) {
      console.error("Export error:", error);
      toast.error("Có lỗi xảy ra khi xuất file Excel.");
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = selectedAssignments.length;
  const fileNameDisplay = `${courseInfo?.courseCode}_${courseInfo?.sectionCode}_Assignments_${new Date().toLocaleDateString('en-GB').replace(/\//g, '')}.xlsx`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Excel File</h2>
            <p className="text-sm text-gray-600 mt-1">Select assignments to export grades</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Course Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Course Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Course:</span>
                <span className="ml-2 font-medium text-blue-600">{courseInfo?.courseCode || 'N/A'}</span>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Class:</span>
                <span className="ml-2 font-medium text-green-600">{courseInfo?.sectionCode || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Select All */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Chọn assignments</h3>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">Chọn tất cả</span>
            </label>
          </div>

          {/* Assignment List */}
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <label
                key={assignment.assignmentId}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAssignments.includes(assignment.assignmentId)}
                  onChange={() => handleToggleAssignment(assignment.assignmentId)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900 flex-1">{assignment.title}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor}`}>
                  {assignment.status}
                </span>
              </label>
            ))}
          </div>

          {/* Export Summary */}
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Thống kê xuất file</h3>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>Đã chọn: <span className="font-medium text-gray-900">{selectedCount}/{assignments.length} assignments</span></p>
              <p>Dự kiến tên file: <span className="font-medium text-gray-900 break-all">{fileNameDisplay}</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={selectedAssignments.length === 0 || isExporting}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportExcelModal;