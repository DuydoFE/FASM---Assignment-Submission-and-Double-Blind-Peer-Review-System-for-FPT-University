import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { Input, Button } from "antd";

const { Search } = Input;

const GradesTable = ({
  assignmentInfo,
  searchTerm,
  setSearchTerm,
  statusFilter,
  handleStatusClick,
  filteredStudents,
  loading,
  onAutoGradeZero,
  onPublishGrades,
}) => {
  const getGradeColor = (grade) => {
    if (grade === null || grade === undefined)
      return "text-gray-400 bg-gray-50";
    const normalizedGrade = grade;
    if (normalizedGrade >= 8) return "text-green-600 bg-green-50";
    if (normalizedGrade >= 5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
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
        return "bg-gray-100 text-gray-800";
    }
  };

  const isPeerReviewNotGraded = (student) => {
    if (student.status !== "Graded") return false;
    if (
      student.instructorGrade !== null &&
      student.instructorGrade !== undefined &&
      student.finalGrade !== null &&
      student.finalGrade !== undefined &&
      student.instructorGrade === student.finalGrade
    ) {
      return true;
    }
    return false;
  };

  const assignmentStatus =
    assignmentInfo?.status ??
    assignmentInfo?.assignmentStatus ??
    (filteredStudents && filteredStudents.length > 0
      ? filteredStudents[0].assignmentStatus
      : undefined);

  const initiallyAutoGraded = Boolean(
    assignmentInfo?.autoGraded ??
      assignmentInfo?.autoGradeApplied ??
      assignmentInfo?.isAutoGraded
  );
  const initiallyPublished = Boolean(
    assignmentInfo?.isPublished ??
      assignmentInfo?.gradesPublished ??
      assignmentInfo?.publishedAt
  );

  const [autoGradedOnce, setAutoGradedOnce] = useState(initiallyAutoGraded);
  const [publishedOnce, setPublishedOnce] = useState(initiallyPublished);

  useEffect(() => {
    setAutoGradedOnce(initiallyAutoGraded);
    setPublishedOnce(initiallyPublished);
  }, [initiallyAutoGraded, initiallyPublished, assignmentInfo]);

  const handleAutoGradeZero = () => {
    try {
      const result = onAutoGradeZero && onAutoGradeZero();
      if (result && typeof result.then === "function") {
        result.then(() => setAutoGradedOnce(true)).catch(() => {});
      } else {
        setAutoGradedOnce(true);
      }
    } catch (e) {}
  };

  const handlePublishGrades = () => {
    try {
      const result = onPublishGrades && onPublishGrades();
      if (result && typeof result.then === "function") {
        result.then(() => setPublishedOnce(true)).catch(() => {});
      } else {
        setPublishedOnce(true);
      }
    } catch (e) {}
  };

  return (
    <>
      {/* Assignment Info Card */}
      {assignmentInfo && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 relative">
          {/* Assignment status badge (top-right) */}
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

          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {assignmentInfo.title}
              </h2>
              <p className="text-gray-600">{assignmentInfo.description}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">
                ✓ {assignmentInfo.graded || 0} graded
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">
                📝 {assignmentInfo.submitted || 0} submitted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">
                ⚠ {assignmentInfo.notSubmitted || 0} not submitted
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-700 font-semibold">
                Total: {assignmentInfo.totalStudents || 0} students
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <Search
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
        size="large"
        className="w-full"
        style={{ height: 60 }}
      />

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading.summary ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading grades...</span>
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
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                  Average Peer Review Score
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                  Instructor Score
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                  Final Score
                </th>
                <th
                  onClick={handleStatusClick}
                  className="px-6 py-3 text-center text-sm font-medium text-gray-600 cursor-pointer hover:text-orange-600 select-none"
                >
                  <div className="flex items-center justify-center gap-1">
                    Status <ChevronDown size={16} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
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
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === "Not Submitted" ||
                          student.status === "Submitted" ||
                          isPeerReviewNotGraded(student)
                            ? "text-gray-400 bg-gray-50"
                            : getGradeColor(student.peerReview)
                        }`}
                      >
                        {student.status === "Not Submitted" ||
                        student.status === "Submitted" ||
                        isPeerReviewNotGraded(student)
                          ? "--"
                          : student.peerReview !== null &&
                            student.peerReview !== undefined
                          ? student.peerReview.toFixed(1)
                          : "--"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === "Not Submitted" ||
                          student.status === "Submitted"
                            ? "text-gray-400 bg-gray-50"
                            : getGradeColor(student.instructorGrade)
                        }`}
                      >
                        {student.status === "Not Submitted" ||
                        student.status === "Submitted"
                          ? "--"
                          : student.instructorGrade !== null &&
                            student.instructorGrade !== undefined
                          ? student.instructorGrade.toFixed(1)
                          : "--"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === "Not Submitted" ||
                          student.status === "Submitted"
                            ? "text-gray-400 bg-gray-50"
                            : getGradeColor(student.finalGrade)
                        }`}
                      >
                        {student.status === "Not Submitted" ||
                        student.status === "Submitted"
                          ? "--"
                          : student.finalGrade !== null &&
                            student.finalGrade !== undefined
                          ? student.finalGrade.toFixed(1)
                          : "--"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
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

      {/* Action Button: Publish Grades - only show when assignment is Closed or Cancelled */}
      {["Closed", "Cancelled"].includes(assignmentStatus) && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={onPublishGrades}
            disabled={loading.publishing}
            title={"Assignment is closed or cancelled"}
            type="primary"
            size="large"
            className="bg-orange-500 hover:!bg-orange-600"
            icon={loading.publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          >
            {loading.publishing ? "Publishing..." : "Publish Scores"}
          </Button>
        </div>
      )}
    </>
  );
};

export default GradesTable;
