import React from "react";
import { Search, ChevronDown, Loader2, AlertCircle } from "lucide-react";

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
}) => {
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
    const normalizedScore = instructorScore / 10;
    if (normalizedScore >= 8) return "border-green-500 text-green-600";
    if (normalizedScore >= 6.5) return "border-green-400 text-green-500";
    return "border-red-400 text-red-500";
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
                  ? "bg-gray-100 text-gray-800"
                  : assignmentStatus === "GradesPublished"
                  ? "bg-green-100 text-green-800"
                  : assignmentStatus === "Cancelled"
                  ? "bg-gray-100 text-gray-800"
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
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

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
                          <button
                            onClick={() =>
                              onGradeClick(student.submissionId, student.status)
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Grade
                          </button>
                        ) : (student.status === "Graded" &&
                            student.assignmentStatus === "Closed") ||
                          (student.assignmentStatus === "GradesPublished" &&
                            student.regradeRequestStatus === "Approved") ? (
                          <button
                            onClick={() =>
                              onGradeClick(student.submissionId, student.status)
                            }
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                          >
                            Re-grade
                          </button>
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
          <button
            onClick={onAutoGradeZero}
            disabled={loading.autoGrading || (students && students.filter(s => s.status === 'Not Submitted').length === 0)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading.autoGrading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Auto Grade Zero
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default GradingTable;
