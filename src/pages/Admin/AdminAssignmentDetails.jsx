import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import {
  getAssignmentById,
  getCourseInstanceById,
  getSubmissionsByAssignmentSimple,
} from "../../service/adminService";

// Custom theme for orange accent
const theme = {
  token: {
    colorPrimary: '#ea580c',
    colorLink: '#ea580c',
    borderRadius: 8,
  },
};

export default function AdminAssignmentDetails() {
  const { id, assignmentId } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "-";

  const getStatusConfig = (status) => {
    switch (status) {
      case "Active":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleOutlined />,
        };
      case "Upcoming":
        return {
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <ClockCircleOutlined />,
        };
      case "Draft":
        return {
          className: "bg-white text-gray-800 border-gray-300",
          icon: <FileTextOutlined />,
        };
      case "GradesPublished":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleOutlined />,
        };
      case "Cancelled":
        return {
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <CloseCircleOutlined />,
        };
      case "InReview":
        return {
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <ClockCircleOutlined />,
        };
      case "Closed":
        return {
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <CloseCircleOutlined />,
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
        };
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [courseInstanceRes, assignmentRes, submissionsRes] =
          await Promise.all([
            getCourseInstanceById(id),
            getAssignmentById(assignmentId),
            getSubmissionsByAssignmentSimple(assignmentId),
          ]);

        const courseInstance = courseInstanceRes?.data;
        const assignmentData = assignmentRes?.data;
        const submissionsData = submissionsRes?.data?.submissions || [];

        if (!courseInstance || !assignmentData) {
          throw new Error("Invalid data from API");
        }

        setClassInfo({
          className: courseInstance?.sectionCode || "-",
          semester: courseInstance?.semesterName || "-",
          major: courseInstance?.campusName || "-",
          course: courseInstance?.courseName || "-",
        });

        setAssignment({
          title: assignmentData?.title || "-",
          description: assignmentData?.description || "-",
          guidelines: assignmentData?.guidelines || "-",
          criteria: assignmentData?.rubric?.criteria || [],
          startDate: assignmentData?.startDate,
          deadline: assignmentData?.deadline,
          reviewDeadline: assignmentData?.reviewDeadline,
          finalDeadline: assignmentData?.finalDeadline,
          status: assignmentData?.status || "-",
          submissions: assignmentData?.submissionCount || 0,
        });

        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load assignment data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, assignmentId]);

  const criteriaColumns = [
    {
      title: "Criteria",
      dataIndex: "title",
      key: "title",
      render: (title) => <span className="font-semibold">{title || "-"}</span>,
    },
    {
      title: "Max Score",
      dataIndex: "maxScore",
      key: "maxScore",
      align: "center",
      render: (maxScore, record) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {maxScore || record.max || "-"}
        </span>
      ),
    },
  ];

  const submissionColumns = [
    {
      title: "Student Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (email) => (
        <span className="text-gray-700">{email || "-"}</span>
      ),
    },
    {
      title: "File",
      dataIndex: "fileUrl",
      key: "file",
      render: (fileUrl, record) =>
        fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <DownloadOutlined />
            {record.originalFileName || record.fileName}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date) => (
        <span className="text-gray-700">{formatDate(date)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
          >
            {config.icon && <span className="text-sm">{config.icon}</span>}
            {status || "N/A"}
          </span>
        );
      },
    },
    {
      title: "Instructor Score",
      dataIndex: "instructorScore",
      key: "instructorScore",
      align: "center",
      render: (score) => (
        <span className="font-semibold">{score ?? "-"}</span>
      ),
    },
    {
      title: "Peer Average",
      dataIndex: "peerAverageScore",
      key: "peerAverageScore",
      align: "center",
      render: (score) => (
        <span className="font-semibold">{score ?? "-"}</span>
      ),
    },
    {
      title: "Final Score",
      dataIndex: "finalScore",
      key: "finalScore",
      align: "center",
      render: (score) => (
        <span className="font-bold text-blue-600">{score ?? "-"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(
              `/admin/classes/${id}/assignments/${assignmentId}/submissions/${record.submissionId}`
            )
          }
        >
          Detail
        </Button>
      ),
    },
  ];

  if (loading && !assignment)
    return <p className="p-6 text-gray-500">Loading assignment details...</p>;

  if (error)
    return (
      <div className="p-6 text-center text-red-500">❌ {error}</div>
    );

  return (
    <ConfigProvider theme={theme}>
      <div className="p-6 bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 min-h-screen">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back
          </Button>

          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Assignment Details
          </h2>
          <p className="text-gray-500">View assignment information and submissions</p>
        </div>

        {/* Class Info Card */}
        {classInfo && (
          <Card
            className="mb-6 shadow-sm border-orange-100 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Descriptions
              title="Class Overview"
              bordered
              column={{ xs: 1, sm: 2, md: 4 }}
            >
              <Descriptions.Item label="Class">
                <span className="font-semibold">{classInfo.className}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Semester">
                <span className="font-semibold">{classInfo.semester}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Major">
                <span className="font-semibold">{classInfo.major}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Course">
                <span className="font-semibold">{classInfo.course}</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Assignment Info Card */}
        {assignment && (
          <Card
            title={
              <span className="flex items-center gap-2">
                <FileTextOutlined className="text-orange-600" />
                <span>Assignment Details</span>
              </span>
            }
            className="mb-6 shadow-sm border-orange-100 animate-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
              <Descriptions.Item label="Title" span={2}>
                <span className="font-semibold">{assignment.title}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {assignment.description}
              </Descriptions.Item>
              <Descriptions.Item label="Guidelines" span={2}>
                {assignment.guidelines}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const config = getStatusConfig(assignment.status);
                  return (
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
                    >
                      {config.icon && <span className="text-sm">{config.icon}</span>}
                      {assignment.status}
                    </span>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Submissions">
                <span className="font-semibold">{assignment.submissions}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {formatDate(assignment.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Deadline">
                {formatDate(assignment.deadline)}
              </Descriptions.Item>
              <Descriptions.Item label="Review Deadline">
                {formatDate(assignment.reviewDeadline)}
              </Descriptions.Item>
              <Descriptions.Item label="Final Deadline">
                {formatDate(assignment.finalDeadline)}
              </Descriptions.Item>
            </Descriptions>

            {/* Criteria Table */}
            {assignment.criteria.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Grading Criteria</h4>
                <Table
                  columns={criteriaColumns}
                  dataSource={assignment.criteria}
                  rowKey={(record, index) => record.criteriaId || index}
                  pagination={false}
                  size="small"
                  className="criteria-table"
                />
              </div>
            )}
          </Card>
        )}

        {/* Submissions Table */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <FileTextOutlined className="text-orange-600" />
              <span>Submissions ({submissions.length})</span>
            </span>
          }
          className="shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Table
            columns={submissionColumns}
            dataSource={submissions}
            rowKey="submissionId"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} submissions`,
            }}
            locale={{
              emptyText: "No submissions found",
            }}
            className="submissions-table"
          />
        </Card>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-in-row {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out backwards;
          }

          /* Table Header Styling */
          .submissions-table .ant-table-thead > tr > th,
          .criteria-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
            color: #ea580c !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #fed7aa !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }

          /* Table Row Animation */
          .submissions-table .ant-table-tbody > tr,
          .criteria-table .ant-table-tbody > tr {
            animation: slide-in-row 0.4s ease-out backwards;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .submissions-table .ant-table-tbody > tr:nth-child(1),
          .criteria-table .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
          .submissions-table .ant-table-tbody > tr:nth-child(2),
          .criteria-table .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.1s; }
          .submissions-table .ant-table-tbody > tr:nth-child(3),
          .criteria-table .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.15s; }
          .submissions-table .ant-table-tbody > tr:nth-child(4),
          .criteria-table .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.2s; }
          .submissions-table .ant-table-tbody > tr:nth-child(5),
          .criteria-table .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.25s; }
          .submissions-table .ant-table-tbody > tr:nth-child(6),
          .criteria-table .ant-table-tbody > tr:nth-child(6) { animation-delay: 0.3s; }
          .submissions-table .ant-table-tbody > tr:nth-child(7),
          .criteria-table .ant-table-tbody > tr:nth-child(7) { animation-delay: 0.35s; }
          .submissions-table .ant-table-tbody > tr:nth-child(8),
          .criteria-table .ant-table-tbody > tr:nth-child(8) { animation-delay: 0.4s; }
          .submissions-table .ant-table-tbody > tr:nth-child(9),
          .criteria-table .ant-table-tbody > tr:nth-child(9) { animation-delay: 0.45s; }
          .submissions-table .ant-table-tbody > tr:nth-child(10),
          .criteria-table .ant-table-tbody > tr:nth-child(10) { animation-delay: 0.5s; }

          /* Row Hover Effect */
          .submissions-table .ant-table-tbody > tr:hover,
          .criteria-table .ant-table-tbody > tr:hover {
            background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%) !important;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15) !important;
            transform: translateX(4px);
          }

          .submissions-table .ant-table-tbody > tr:hover td,
          .criteria-table .ant-table-tbody > tr:hover td {
            border-color: #fed7aa !important;
          }

          /* Striped Rows */
          .submissions-table .ant-table-tbody > tr:nth-child(even),
          .criteria-table .ant-table-tbody > tr:nth-child(even) {
            background-color: #fafafa;
          }

          /* Pagination Styling */
          .ant-pagination-item-active {
            border-color: #ea580c !important;
            background-color: #fff7ed !important;
          }

          .ant-pagination-item-active a {
            color: #ea580c !important;
          }

          /* Descriptions Styling */
          .ant-descriptions-item-label {
            font-weight: 600;
            color: #6b7280;
          }

          .ant-descriptions-item-content {
            color: #1f2937;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
