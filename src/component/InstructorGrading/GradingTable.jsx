import React, { useState, useRef } from "react";
import { ChevronDown, Loader2, AlertCircle, Download, Upload } from "lucide-react";
import { Input, Button, Modal } from "antd";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { exportSubmissionsExcel, importSubmissionsExcel } from "../../service/instructorGrading";

const { Search } = Input;

const GradingTable = ({
  assignmentInfo,
  searchTerm,
  setSearchTerm,
  statusFilter,
  handleStatusClick,
  filteredStudents,
  loading,
  onGradeClick,
  onAutoGradeZero,
  students,
  assignmentId,
  currentUserId,
  onRefreshData,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);
  
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "--", time: "" };
    // Check for default/empty datetime value (0001-01-01T00:00:00)
    if (dateString === "0001-01-01T00:00:00" || dateString.startsWith("0001-01-01")) {
      return { date: "--", time: "" };
    }
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("vi-VN");
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: dateStr, time: timeStr };
  };

  const getScoreStyle = (instructorScore) => {
    if (instructorScore === null || instructorScore === undefined)
      return "border-gray-300 text-gray-400";
    return "border-green-400 text-green-500";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Graded":
        return "bg-green-100 text-green-700";
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "Not Submitted":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSubmissionTimeStyle = () => {
    return "text-gray-600";
  };

  // derive assignmentStatus from assignmentInfo or fallback to first student's assignmentStatus
  const assignmentStatus =
    assignmentInfo?.status ??
    assignmentInfo?.assignmentStatus ??
    (filteredStudents && filteredStudents.length > 0
      ? filteredStudents[0].assignmentStatus
      : undefined);

  const handleExportExcel = async () => {
    if (!assignmentId) {
      toast.error("Assignment ID is required");
      return;
    }

    try {
      setIsExporting(true);

      // Call API to get export data
      const response = await exportSubmissionsExcel(assignmentId);
      
      // Parse the API response - it returns JSON data as blob
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const apiData = JSON.parse(reader.result);
          
          if (!apiData.data || apiData.data.length === 0) {
            toast.error("No submissions to export");
            return;
          }

          const exportData = apiData.data;

          // Prepare Excel data
          const excelData = [];
          
          // Create header row
          const headers = ["UserName", "StudentCode", "SubmissionId", "ReviewSubmission", "InstructorId", "AssignmentName"];
          
          // Add dynamic criteria headers
          if (exportData[0]?.criteriaScores?.length > 0) {
            exportData[0].criteriaScores.forEach(criteria => {
              headers.push(`${criteria.criteriaName} (${criteria.weight}%)`);
              headers.push(`${criteria.criteriaName} Feedback`);
            });
          }
          
          headers.push("Final Feedback");
          
          excelData.push(headers);

          // Add data rows
          exportData.forEach(submission => {
            const row = [
              submission.userName || "",
              submission.studentCode || "",
              submission.submissionId || "",
              submission.fileUrl ? `https://docs.google.com/viewer?url=${submission.fileUrl}` : "",
              currentUserId || "",
              submission.assignmentName || ""
            ];

            // Add criteria scores and feedback
            if (submission.criteriaScores && submission.criteriaScores.length > 0) {
              submission.criteriaScores.forEach(criteria => {
                row.push(criteria.score !== null && criteria.score !== undefined ? criteria.score : "");
                row.push(criteria.feedback || "");
              });
            }

            // Add final feedback
            row.push(submission.feedback || "");

            excelData.push(row);
          });

          // Create workbook and worksheet
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(excelData);

          // Set column widths
          const columnWidths = [
            { wch: 15 }, // UserName
            { wch: 12 }, // StudentCode
            { wch: 12 }, // SubmissionId
            { wch: 50 }, // ReviewSubmission
            { wch: 12 }, // InstructorId
            { wch: 35 }, // AssignmentName
          ];

          // Add widths for criteria columns
          if (exportData[0]?.criteriaScores?.length > 0) {
            exportData[0].criteriaScores.forEach(() => {
              columnWidths.push({ wch: 18 }); // Criteria score
              columnWidths.push({ wch: 30 }); // Criteria feedback
            });
          }
          
          columnWidths.push({ wch: 30 }); // Final Feedback

          ws['!cols'] = columnWidths;

          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, "Grading Data");

          // Generate filename
          const assignmentName = exportData[0]?.assignmentName || assignmentInfo?.title || "Assignment";
          const className = assignmentInfo?.className || "Class";
          const fileName = `${assignmentName.replace(/[^a-z0-9]/gi, '_')}_${className.replace(/[^a-z0-9]/gi, '_')}.xlsx`;

          // Export file
          XLSX.writeFile(wb, fileName);
          
          toast.success("Excel file exported successfully");
        } catch (parseError) {
          console.error("Parse error:", parseError);
          toast.error("Failed to process export data");
        }
      };
      
      reader.readAsText(response);
      
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error.message || "Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    if (!assignmentId) {
      toast.error("Assignment ID is required");
      return;
    }

    try {
      setIsImporting(true);
      const response = await importSubmissionsExcel(assignmentId, file);
      
      // Display backend message if available
      const message = response?.message || response?.data?.message || "Grades imported successfully!";
      toast.success(message);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh data without reloading the page
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (error) {
      console.error("Error importing grades:", error);
      toast.error(error.message || "Failed to import grades");
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      {/* Assignment Info Card */}
      {assignmentInfo && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 relative">
          {/* STATUS - nằm góc trên phải */}
          {assignmentStatus && (
            <span
              className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${
                assignmentStatus === "Upcoming"
                  ? "bg-blue-100 text-blue-800"
                  : assignmentStatus === "Draft"
                  ? "bg-white-100 text-gray-800 border border-gray-300"
                  : assignmentStatus === "Active"
                  ? "bg-green-100 text-green-800"
                  : assignmentStatus === "GradesPublished"
                  ? "bg-green-100 text-green-800"
                  : assignmentStatus === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : assignmentStatus === "InReview"
                  ? "bg-yellow-100 text-yellow-800"
                  : assignmentStatus === "Closed"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {assignmentStatus}
            </span>
          )}

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {assignmentInfo.title}
            </h2>

            {assignmentInfo.description && (
              <p className="text-gray-600 mb-3">{assignmentInfo.description}</p>
            )}
          </div>

          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">
                ✓ {assignmentInfo.submitted || 0}/
                {assignmentInfo.totalStudents || 0} submitted
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-600 font-medium">
                ⭐ {assignmentInfo.graded || 0}/{assignmentInfo.submitted || 0}{" "}
                graded
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <Search
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          size="large"
          className="w-full"
          style={{ height: 38 }}
        />
      </div>

      {/* Export and Import Buttons - only show when assignment is Closed */}
      {assignmentStatus === 'Closed' && (
        <div className="mb-4 flex justify-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <Button
            onClick={handleImportClick}
            disabled={isImporting}
            icon={<Upload size={16} />}
            loading={isImporting}
            type="default"
            size="large"
            className="bg-blue-50 hover:!bg-blue-100 border-blue-300 text-blue-600"
          >
            {isImporting ? "Importing..." : "Import from Excel"}
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={isExporting || !filteredStudents || filteredStudents.length === 0}
            icon={<Download size={16} />}
            loading={isExporting}
            type="default"
            size="large"
            className="bg-green-50 hover:!bg-green-100 border-green-300 text-green-600"
          >
            {isExporting ? "Exporting..." : "Export to Excel"}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading.summary ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading students...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Student Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Feedback
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Submission Time
                </th>
                <th
                  onClick={handleStatusClick}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:text-orange-600 select-none flex items-center gap-1"
                >
                  Status <ChevronDown size={16} />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const submissionTime = formatDateTime(student.submittedAt);
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.studentCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center w-20 h-10 border-2 rounded-lg font-semibold ${getScoreStyle(
                            student.status === "Graded" ? student.instructorScore :
                            (student.instructorScore === 0 || student.instructorScore === 0.0) ? null : student.instructorScore
                          )}`}
                        >
                          {student.status === "Graded"
                            ? (student.instructorScore !== null &&
                               student.instructorScore !== undefined
                                ? `${student.instructorScore.toFixed(1)}`
                                : "--")
                            : ((student.status === "Submitted" || student.status === "Not Submitted") &&
                               (student.instructorScore === 0 || student.instructorScore === 0.0)
                                ? "--"
                                : (student.instructorScore !== null &&
                                   student.instructorScore !== undefined
                                    ? `${student.instructorScore.toFixed(1)}`
                                    : "--"))}{" "}
                          / {assignmentInfo?.maxScore || 10}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {student.feedback || "No feedback yet"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {student.submittedAt ? (
                          <div className={getSubmissionTimeStyle()}>
                            {submissionTime.date}
                            <br />
                            {submissionTime.time}
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {student.status === "Submitted" &&
                        student.assignmentStatus === "Closed" ? (
                          <Button
                            onClick={() =>
                              onGradeClick(student.submissionId, student.status)
                            }
                            type="primary"
                            className="bg-blue-500 hover:!bg-blue-600"
                          >
                            Grade
                          </Button>
                        ) : (student.status === "Graded" &&
                            student.assignmentStatus === "Closed") ||
                          (student.assignmentStatus === "GradesPublished" &&
                            student.regradeRequestStatus === "Approved") ? (
                          <Button
                            onClick={() =>
                              onGradeClick(student.submissionId, student.status)
                            }
                            type="primary"
                            className="bg-orange-500 hover:!bg-orange-600"
                          >
                            Re-grade
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Button: Auto Grade Zero - only show when assignment is Closed or Cancelled */}
      {assignmentStatus && ['Closed', 'Cancelled'].includes(assignmentStatus) && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={onAutoGradeZero}
            disabled={loading.autoGrading || (students && students.filter(s => s.status === 'Not Submitted').length === 0)}
            type="primary"
            danger
            size="large"
            icon={loading.autoGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
          >
            {loading.autoGrading ? "Grading..." : "Auto Grade Zero"}
          </Button>
        </div>
      )}
    </>
  );
};

export default GradingTable;
