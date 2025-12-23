import React from "react";
import { Dropdown, Table } from "antd";
import {
  FileText,
  Calendar,
  Trash2,
  Edit,
  MoreVertical,
  Upload,
  Eye,
} from "lucide-react";

const InstructorManageAssignmentTable = ({
  assignments,
  loading,
  onUpdateDeadline,
  onDelete,
  onEdit,
  onViewSubmissions,
  onPublish,
  onViewDetail,
}) => {
  const getDeadlineColor = (deadline) => {
    if (!deadline) return "text-gray-900";
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-500";
    if (diffDays <= 3) return "text-orange-500";
    return "text-gray-900";
  };

  const formatDisplayDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return { date: "", time: "" };
    try {
      const cleanStr = dateTimeStr.replace("Z", "").split(".")[0];
      const [datePart, timePart] = cleanStr.split("T");
      if (!datePart || !timePart) return { date: "", time: "" };

      const [year, month, day] = datePart.split("-");
      const [hours, minutes] = timePart.split(":");
      return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}`,
      };
    } catch (error) {
      console.error("Error formatting datetime:", error, dateTimeStr);
      return { date: "", time: "" };
    }
  };

  const getDropdownItems = (assignment) => [
    {
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <Eye className="w-4 h-4 text-purple-600" />
          <span>View Detail</span>
        </div>
      ),
      onClick: () => onViewDetail(assignment),
    },
    ...(assignment.status === "Draft"
      ? [
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Upload className="w-4 h-4 text-yellow-600" />
                <span>Publish Assignment</span>
              </div>
            ),
            onClick: () => onPublish(assignment),
          },
        ]
      : []),
    ...(assignment.status === "Active"
      ? [
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Extend Deadline</span>
              </div>
            ),
            onClick: () => onUpdateDeadline(assignment),
          },
        ]
      : []),
    ...(assignment.status === "Draft"
      ? [
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Edit className="w-4 h-4 text-green-600" />
                <span>Edit Assignment</span>
              </div>
            ),
            onClick: () => onEdit(assignment),
          },
        ]
      : []),
    {
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <FileText className="w-4 h-4 text-gray-600" />
          <span>View Submissions</span>
        </div>
      ),
      onClick: () => onViewSubmissions(assignment),
    },
    ...(assignment.status === "Draft" 
      ? [
          {
            type: "divider",
          },
          {
            label: (
              <div className="flex items-center gap-2 px-2 py-1">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete Assignment</span>
              </div>
            ),
            onClick: () => onDelete(assignment),
          },
        ]
      : []),
  ];

  const columns = [
    {
      title: "Assignment Name",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text) => (
        <h3 className="font-semibold text-gray-900 text-base truncate">
          {text}
        </h3>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: "20%",
      align: "center",
      render: (deadline) => {
        const { date, time } = formatDisplayDateTime(deadline);
        return (
          <div className="space-y-1">
            <div
              className={`font-medium text-base ${getDeadlineColor(deadline)}`}
            >
              {date}
            </div>
            <div className="text-sm text-gray-500">{time}</div>
          </div>
        );
      },
    },
    {
      title: "Review Deadline",
      dataIndex: "reviewDeadline",
      key: "reviewDeadline",
      width: "20%",
      align: "center",
      render: (reviewDeadline) => {
        const { date, time } = formatDisplayDateTime(reviewDeadline);
        return (
          <div className="space-y-1">
            <div
              className={`font-medium text-base ${getDeadlineColor(
                reviewDeadline
              )}`}
            >
              {date}
            </div>
            <div className="text-sm text-gray-500">{time}</div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center",
      render: (status, record) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${record.statusColor}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getDropdownItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={assignments}
      rowKey="id"
      loading={loading}
      pagination={false}
      className="bg-white rounded-xl border border-gray-200"
    />
  );
};

export default InstructorManageAssignmentTable;