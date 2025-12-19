import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

const getAssignmentStyles = (assignment) => {
  switch (assignment.status) {
    case "GradesPublished":
      return {
        cardBg: "bg-blue-50",
        borderColor: "border-blue-200",
        badgeClasses: "bg-green-100 text-green-700",
        icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      };
      case "Upcoming":
      return {
        cardBg: "bg-blue-50",
        borderColor: "border-blue-200",
        badgeClasses: "bg-blue-100 text-blue-700",
        icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />,
      };
      case "Active":
      return {
        cardBg: "bg-green-50",
        borderColor: "border-blue-200",
        badgeClasses: "bg-green-100 text-green-700",
        icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#22c55e' }} />,
      };
    case "Closed":
      return {
        cardBg: "bg-red-50",
        borderColor: "border-red-200",
        badgeClasses: "bg-red-100 text-red-700",
        icon: <CloseCircleOutlined style={{ fontSize: '24px', color: '#ef4444' }} />,
      };
    case "InReview":
      return {
        cardBg: "bg-yellow-50",
        borderColor: "border-yellow-200",
        badgeClasses: "bg-yellow-100 text-yellow-700",
        icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#eab308' }} />,
      };

    default:
      return {
        cardBg: "bg-white",
        borderColor: "border-gray-200",
        badgeClasses: "bg-gray-100 text-gray-700",
        icon: <InfoCircleOutlined style={{ fontSize: '24px', color: '#6b7280' }} />,
      };
  }
};

const AssignmentCard = ({ assignment, courseId }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/assignment/${courseId}/${assignment.assignmentId}`);
  };

  const handleViewScore = () => {
    navigate(`/assignment/${courseId}/${assignment.assignmentId}/scores`);
  };

  const styles = getAssignmentStyles(assignment);

  return (
    <div className={`rounded-lg border ${styles.cardBg} ${styles.borderColor}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-4">{styles.icon}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600">{assignment.description}</p>
            </div>
          </div>
          {assignment.status && (
            <div
              className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.badgeClasses}`}
            >
              {assignment.status}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-4 ml-10">
          <div className="flex items-center">
            <CalendarOutlined style={{ fontSize: '16px', marginRight: '6px' }} />
            Start Date:{" "}
            <span className="font-semibold ml-1">
              {formatDate(assignment.startDate)}
            </span>
          </div>
          <div className="flex items-center text-red-600">
            <ClockCircleOutlined style={{ fontSize: '16px', marginRight: '6px' }} />
            Deadline:{" "}
            <span className="font-semibold ml-1">
              {formatDate(assignment.deadline)}
            </span>
          </div>
          <div className="flex items-center text-purple-600">
            <EyeOutlined style={{ fontSize: '16px', marginRight: '6px' }} />
            Review:{" "}
            <span className="font-semibold ml-1">
              {formatDate(assignment.reviewDeadline)}
            </span>
          </div>
        </div>

        <div className="mt-4 ml-10">
          <p className="font-semibold text-gray-700">Guideline:</p>
          <p className="text-sm text-gray-600">
            {assignment.guidelines || "Không có hướng dẫn chi tiết."}
          </p>
        </div>
      </div>

      <div
        className={`p-4 border-t ${styles.borderColor} flex justify-end items-center space-x-3`}
      >
        <button
          onClick={handleViewScore}
          disabled={assignment.status !== "GradesPublished"}
          className={`flex items-center px-4 py-2 font-semibold rounded-md text-sm transition-colors
            ${
              assignment.status === "GradesPublished"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          <BarChartOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
          View Final Score
        </button>

        <button
          onClick={handleNavigate}
          className="flex items-center px-4 py-2 text-white font-semibold rounded-md text-sm bg-blue-600 hover:bg-blue-700"
        >
          <EyeOutlined style={{ fontSize: '16px', marginRight: '8px' }} />
          Detail and Submit
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
