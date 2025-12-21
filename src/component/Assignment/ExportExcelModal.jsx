import React, { useState } from "react";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { getCurrentAccount } from "../../utils/accountUtils";
import { getExportSubmissions } from "../../service/submissionService";
import { Checkbox, Modal, Button } from "antd";

const ExportExcelModal = ({
  isOpen,
  onClose,
  courseInfo,
  assignments,
  classId,
}) => {
  const user = getCurrentAccount();
  const [selectAll, setSelectAll] = useState(true);
  const [selectedAssignments, setSelectedAssignments] = useState(
    assignments.map((a) => a.assignmentId)
  );
  const [isExporting, setIsExporting] = useState(false);


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(assignments.map((a) => a.assignmentId));
    }
    setSelectAll(!selectAll);
  };

  const handleToggleAssignment = (assignmentId) => {
    if (selectedAssignments.includes(assignmentId)) {
      setSelectedAssignments(
        selectedAssignments.filter((id) => id !== assignmentId)
      );
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
      toast.error("No instructor information found. Please log in again.");
      return;
    }

    if (selectedAssignments.length === 0) {
      toast.warning(" Please select at least one assignment to export.");
      return;
    }

    setIsExporting(true);
    try {
      let allSubmissions = [];
      // vòng lặp for...of để chạy tuần tự từng cái một
      for (const assignmentId of selectedAssignments) {
        // Await từng request xong mới chạy cái tiếp theo
        const response = await getExportSubmissions(
          user.id,
          classId,
          assignmentId
        );

        // Xử lý dữ liệu gộp vào mảng tổng ngay sau khi nhận response
        const data = Array.isArray(response) ? response : response.data || [];
        allSubmissions = [...allSubmissions, ...data];
      }

      if (allSubmissions.length === 0) {
        toast.info("No submission data found for the selected assignments.");
        setIsExporting(false);
        return;
      }

      // Group submissions by student
      const studentMap = new Map();
      
      allSubmissions.forEach((item) => {
        const studentKey = item.studentCode;
        
        if (!studentMap.has(studentKey)) {
          studentMap.set(studentKey, {
            Username: item.username,
            "Student Code": item.studentCode,
            "Course Name": item.courseName,
            "Class Name": item.className,
            assignments: {}
          });
        }
        
        // Add assignment score to student's record
        const student = studentMap.get(studentKey);
        student.assignments[item.assignmentTitle] = item.finalScore;
      });

      // Get all unique assignment titles for column headers
      const assignmentTitles = [...new Set(allSubmissions.map(item => item.assignmentTitle))];
      
      // Transform data into pivot table format
      const exportData = Array.from(studentMap.values()).map(student => {
        const row = {
          Username: student.Username,
          "Student Code": student["Student Code"],
          "Course Name": student["Course Name"],
          "Class Name": student["Class Name"]
        };
        
        // Add each assignment score as a separate column
        assignmentTitles.forEach(title => {
          row[title] = student.assignments[title] !== undefined ? student.assignments[title] : 0;
        });
        
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths dynamically
      const wscols = [
        { wch: 20 }, // Username
        { wch: 15 }, // Student Code
        { wch: 30 }, // Course Name
        { wch: 15 }, // Class Name
        ...assignmentTitles.map(() => ({ wch: 15 })) // Dynamic assignment columns
      ];
      worksheet["!cols"] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

      const fileName = `${courseInfo?.courseCode || "Course"}_${
        courseInfo?.sectionCode || "Class"
      }_Grades_${new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "")}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Excel file exported successfully.");
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error(" An error occurred during export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = selectedAssignments.length;
  const fileNameDisplay = `${courseInfo?.courseCode}_${
    courseInfo?.sectionCode
  }_Assignments_${new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "")}.xlsx`;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={700}
      title={
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Export Excel File
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Select assignments to export grades
          </p>
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleExport}
            disabled={selectedAssignments.length === 0 || isExporting}
            icon={isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            loading={isExporting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>
        </div>
      }
      styles={{
        body: { maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }
      }}
    >
      <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Course Information
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Course:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {courseInfo?.courseCode || "N/A"} 
                </span>
              </div>

              <div>
                <span className="text-sm text-gray-600">Class:</span>
                <span className="ml-2 font-medium text-green-600">
                  {courseInfo?.sectionCode || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Select All */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Select assignments
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
              >
                <span className="font-medium text-gray-900"> Select All</span>
              </Checkbox>
            </div>
          </div>

          {/* Assignment List */}
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.assignmentId}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={selectedAssignments.includes(
                    assignment.assignmentId
                  )}
                  onChange={() =>
                    handleToggleAssignment(assignment.assignmentId)
                  }
                >
                  <span className="text-gray-900">{assignment.title}</span>
                </Checkbox>
                <span
                  className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${assignment.statusColor}`}
                >
                  {assignment.status}
                </span>
              </div>
            ))}
          </div>

          {/* Export Summary */}
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">
                File export statistics
              </h3>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                Selected:{" "}
                <span className="font-medium text-gray-900">
                  {selectedCount}/{assignments.length} assignments
                </span>
              </p>
              <p>
                Expected file name:{" "}
                <span className="font-medium text-gray-900 break-all">
                  {fileNameDisplay}
                </span>
              </p>
            </div>
          </div>
      </div>
    </Modal>
  );
};

export default ExportExcelModal;
