import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2, AlertCircle, CheckCircle, FileCheck, XCircle } from "lucide-react";
import { Input, Button, Modal, Table } from "antd";

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

  // Get weights from the first student record (all students have the same weights)
  const peerWeight = filteredStudents && filteredStudents.length > 0 ? filteredStudents[0].peerWeight : null;
  const instructorWeight = filteredStudents && filteredStudents.length > 0 ? filteredStudents[0].instructorWeight : null;
  
  // Debug log
  console.log('Weights:', { peerWeight, instructorWeight, filteredStudents });

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: '8%',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Student Code',
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: '12%',
    },
    {
      title: 'Full Name',
      dataIndex: 'studentName',
      key: 'studentName',
      width: '18%',
      render: (name) => <span className="text-gray-800">{name}</span>,
    },
    {
      title: (
        <div className="text-center">
          <div>Average Peer Review Score</div>
          {peerWeight !== null && peerWeight !== undefined && (
            <div className="mt-1 text-sm font-medium text-gray-700">({peerWeight}%)</div>
          )}
        </div>
      ),
      dataIndex: 'peerReview',
      key: 'peerReview',
      width: '18%',
      align: 'center',
      render: (peerReview, student) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.status === "Not Submitted"
              ? "text-gray-400 bg-gray-50"
              : student.status === "Submitted" || student.status === "Graded"
              ? peerReview !== null && peerReview !== undefined
                ? getGradeColor(peerReview)
                : "text-gray-400 bg-gray-50"
              : isPeerReviewNotGraded(student)
              ? "text-gray-400 bg-gray-50"
              : getGradeColor(peerReview)
          }`}
        >
          {student.status === "Not Submitted"
            ? "--"
            : student.status === "Submitted" || student.status === "Graded"
            ? peerReview !== null && peerReview !== undefined
              ? peerReview.toFixed(1)
              : "--"
            : isPeerReviewNotGraded(student)
            ? "--"
            : peerReview !== null && peerReview !== undefined
            ? peerReview.toFixed(1)
            : "--"}
        </span>
      ),
    },
    {
      title: (
        <div className="text-center">
          <div>Instructor Score</div>
          {instructorWeight !== null && instructorWeight !== undefined && (
            <div className="mt-1 text-sm font-medium text-gray-700">({instructorWeight}%)</div>
          )}
        </div>
      ),
      dataIndex: 'instructorGrade',
      key: 'instructorGrade',
      width: '14%',
      align: 'center',
      render: (instructorGrade, student) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.status === "Not Submitted"
              ? "text-gray-400 bg-gray-50"
              : student.status === "Submitted" || student.status === "Graded"
              ? instructorGrade !== null && instructorGrade !== undefined
                ? getGradeColor(instructorGrade)
                : "text-gray-400 bg-gray-50"
              : "text-gray-400 bg-gray-50"
          }`}
        >
          {student.status === "Not Submitted"
            ? "--"
            : student.status === "Submitted" || student.status === "Graded"
            ? instructorGrade !== null && instructorGrade !== undefined
              ? instructorGrade.toFixed(1)
              : "--"
            : "--"}
        </span>
      ),
    },
    {
      title: 'Final Score',
      dataIndex: 'finalGrade',
      key: 'finalGrade',
      width: '12%',
      align: 'center',
      render: (finalGrade, student) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.status === "Not Submitted"
              ? "text-gray-400 bg-gray-50"
              : student.status === "Submitted" || student.status === "Graded"
              ? finalGrade !== null && finalGrade !== undefined
                ? getGradeColor(finalGrade)
                : "text-gray-400 bg-gray-50"
              : "text-gray-400 bg-gray-50"
          }`}
        >
          {student.status === "Not Submitted"
            ? "--"
            : student.status === "Submitted" || student.status === "Graded"
            ? finalGrade !== null && finalGrade !== undefined
              ? finalGrade.toFixed(1)
              : "--"
            : "--"}
        </span>
      ),
    },
    {
      title: (
        <div
          onClick={handleStatusClick}
          className="cursor-pointer hover:text-orange-600 select-none flex items-center justify-center gap-1"
        >
          Status <ChevronDown size={16} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '18%',
      align: 'center',
      render: (status) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(status)}`}
        >
          {status}
        </span>
      ),
    },
  ];

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
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">
                {assignmentInfo.notSubmitted || 0} not submitted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-medium">
                {assignmentInfo.submitted || 0} submitted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">
                {assignmentInfo.graded || 0} graded
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
      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="studentId"
        loading={loading.summary}
        pagination={false}
        locale={{
          emptyText: (
            <div className="px-6 py-12 text-center text-gray-500">
              No students found
            </div>
          ),
        }}
        className="bg-white rounded-lg border border-gray-200"
      />

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
