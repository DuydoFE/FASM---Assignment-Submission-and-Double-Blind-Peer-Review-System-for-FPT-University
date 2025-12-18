import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  ConfigProvider,
  Descriptions,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import { getSubmissionDetails } from "../../service/adminService";

// Custom theme for orange accent
const theme = {
  token: {
    colorPrimary: '#ea580c',
    colorLink: '#ea580c',
    borderRadius: 8,
  },
};

export default function AdminSubmissionDetails() {
  const { assignmentId, submissionId, id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      case "Submitted":
        return {
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleOutlined />,
        };
      case "Not Submitted":
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <CloseCircleOutlined />,
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
        const res = await getSubmissionDetails(submissionId);
        const data = res?.data;
        if (!data) throw new Error("No submission data found");
        setSubmission(data);
      } catch (err) {
        console.error("Error loading submission:", err);
        setError("Failed to load submission data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [submissionId]);

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");

  if (loading && !submission)
    return <p className="p-6 text-gray-500">Loading submission details...</p>;

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
            Submission Details
          </h2>
          <p className="text-gray-500">View detailed submission information</p>
        </div>

        {/* Submission Overview Card */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <UserOutlined className="text-orange-600" />
              <span>Submission Overview</span>
            </span>
          }
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
          extra={
            submission?.fileUrl && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download File
              </Button>
            )
          }
        >
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
            <Descriptions.Item label="Student Email">
              <span className="font-semibold">{submission?.user?.email || "-"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="File Name">
              <span className="font-mono text-sm">{submission?.originalFileName || "-"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Keywords" span={2}>
              {submission?.keywords || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted At">
              {formatDate(submission?.submittedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Graded At">
              {formatDate(submission?.gradedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {(() => {
                const config = getStatusConfig(submission?.status);
                return (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
                  >
                    {config.icon && <span className="text-sm">{config.icon}</span>}
                    {submission?.status || "N/A"}
                  </span>
                );
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Public">
              <Tag color={submission?.isPublic ? "success" : "default"}>
                {submission?.isPublic ? "Yes" : "No"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Scores Card */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <FileTextOutlined className="text-orange-600" />
              <span>Scores & Feedback</span>
            </span>
          }
          className="mb-6 shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Instructor Score">
              <span className="font-bold text-lg text-blue-600">
                {submission?.instructorScore ?? "-"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Peer Average Score">
              <span className="font-bold text-lg text-green-600">
                {submission?.peerAverageScore ?? "-"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Final Score">
              <span className="font-bold text-lg text-orange-600">
                {submission?.finalScore ?? "-"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Feedback" span={3}>
              <div className="bg-gray-50 p-3 rounded-md">
                {submission?.feedback || "No feedback provided"}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Assignment Info Card */}
        {submission?.assignment && (
          <Card
            title={
              <span className="flex items-center gap-2">
                <FileTextOutlined className="text-orange-600" />
                <span>Assignment Information</span>
              </span>
            }
            className="shadow-sm border-orange-100 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
              <Descriptions.Item label="Title" span={2}>
                <span className="font-semibold">{submission.assignment.title}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {submission.assignment.description}
              </Descriptions.Item>
              <Descriptions.Item label="Deadline">
                {formatDate(submission.assignment.deadline)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

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

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out backwards;
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
