import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Tag,
  Card,
  ConfigProvider,
  Descriptions,
} from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {
  getAssignmentsByCourseInstance,
  getCourseInstanceById,
} from "../../service/adminService";

// Custom theme for orange accent
const theme = {
  token: {
    colorPrimary: '#ea580c',
    colorLink: '#ea580c',
    borderRadius: 8,
  },
};

export default function AdminClassAssignments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [assignmentRes, classRes] = await Promise.all([
          getAssignmentsByCourseInstance(id),
          getCourseInstanceById(id),
        ]);

        if (
          assignmentRes?.statusCode === 200 &&
          Array.isArray(assignmentRes.data)
        ) {
          setAssignments(assignmentRes.data);
        } else {
          throw new Error(assignmentRes?.message || "Failed to fetch assignments");
        }

        if (classRes?.statusCode === 200 && classRes.data) {
          setClassInfo(classRes.data);
        } else {
          console.warn("No class info found or invalid data:", classRes);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Active":
        return {
          color: "success",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleOutlined />,
        };
      case "Upcoming":
        return {
          color: "processing",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <ClockCircleOutlined />,
        };
      case "Draft":
        return {
          color: "default",
          className: "bg-white text-gray-800 border-gray-300",
          icon: <FileTextOutlined />,
        };
      case "GradesPublished":
        return {
          color: "success",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleOutlined />,
        };
      case "Cancelled":
        return {
          color: "error",
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <CloseCircleOutlined />,
        };
      case "InReview":
        return {
          color: "warning",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <ClockCircleOutlined />,
        };
      case "Closed":
        return {
          color: "error",
          className: "bg-red-100 text-red-800 border-red-200",
          icon: <CloseCircleOutlined />,
        };
      default:
        return {
          color: "default",
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
        };
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <div className="font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <FileTextOutlined />
          </div>
          <span>{title}</span>
        </div>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => (
        <span className="text-gray-700">
          {deadline ? new Date(deadline).toLocaleString() : "-"}
        </span>
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
      title: "Submissions",
      dataIndex: "submissions",
      key: "submissions",
      align: "center",
      render: (submissions) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {submissions ?? "-"}
        </span>
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
            navigate(`/admin/classes/${id}/assignments/${record.assignmentId}`)
          }
        >
          View Submissions
        </Button>
      ),
    },
  ];

  if (loading && !classInfo)
    return <p className="p-6 text-gray-500">Loading assignments...</p>;

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        ❌ Error: {error}
      </div>
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
            Class Assignments
          </h2>
          <p className="text-gray-500">View all assignments for this class</p>
        </div>

        {/* Class Info Card */}
        {classInfo && (
          <Card
            className="mb-6 shadow-sm border-orange-100 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Descriptions
              title="Class Information"
              bordered
              column={{ xs: 1, sm: 2, md: 4 }}
            >
              <Descriptions.Item label="Class Name">
                <span className="font-semibold">
                  {classInfo.sectionCode || "-"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Course Name">
                <span className="font-semibold">
                  {classInfo.courseName || "-"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Semester">
                <span className="font-semibold">
                  {classInfo.semesterName || "-"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Campus">
                <span className="font-semibold">
                  {classInfo.campusName || "-"}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Assignments Table */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <FileTextOutlined className="text-orange-600" />
              <span>Assignments ({assignments.length})</span>
            </span>
          }
          className="shadow-sm border-orange-100 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <Table
            columns={columns}
            dataSource={assignments}
            rowKey="assignmentId"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} assignments`,
            }}
            locale={{
              emptyText: "No assignments found",
            }}
            className="assignments-table"
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
          .assignments-table .ant-table-thead > tr > th {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%) !important;
            color: #ea580c !important;
            font-weight: 600 !important;
            border-bottom: 2px solid #fed7aa !important;
            font-size: 13px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }

          /* Table Row Animation */
          .assignments-table .ant-table-tbody > tr {
            animation: slide-in-row 0.4s ease-out backwards;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .assignments-table .ant-table-tbody > tr:nth-child(1) { animation-delay: 0.05s; }
          .assignments-table .ant-table-tbody > tr:nth-child(2) { animation-delay: 0.1s; }
          .assignments-table .ant-table-tbody > tr:nth-child(3) { animation-delay: 0.15s; }
          .assignments-table .ant-table-tbody > tr:nth-child(4) { animation-delay: 0.2s; }
          .assignments-table .ant-table-tbody > tr:nth-child(5) { animation-delay: 0.25s; }
          .assignments-table .ant-table-tbody > tr:nth-child(6) { animation-delay: 0.3s; }
          .assignments-table .ant-table-tbody > tr:nth-child(7) { animation-delay: 0.35s; }
          .assignments-table .ant-table-tbody > tr:nth-child(8) { animation-delay: 0.4s; }
          .assignments-table .ant-table-tbody > tr:nth-child(9) { animation-delay: 0.45s; }
          .assignments-table .ant-table-tbody > tr:nth-child(10) { animation-delay: 0.5s; }

          /* Row Hover Effect */
          .assignments-table .ant-table-tbody > tr:hover {
            background: linear-gradient(90deg, #fff7ed 0%, #ffffff 100%) !important;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15) !important;
            transform: translateX(4px);
          }

          .assignments-table .ant-table-tbody > tr:hover td {
            border-color: #fed7aa !important;
          }

          /* Striped Rows */
          .assignments-table .ant-table-tbody > tr:nth-child(even) {
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
