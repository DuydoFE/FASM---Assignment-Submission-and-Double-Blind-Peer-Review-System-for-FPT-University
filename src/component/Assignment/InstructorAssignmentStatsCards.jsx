import React from "react";

const InstructorAssignmentStatsCards = ({ assignments }) => {
  // Count assignments by status
  const statusCounts = {
    Draft: assignments.filter(a => a.status === "Draft").length,
    Upcoming: assignments.filter(a => a.status === "Upcoming").length,
    Active: assignments.filter(a => a.status === "Active").length,
    InReview: assignments.filter(a => a.status === "InReview").length,
    Closed: assignments.filter(a => a.status === "Closed").length,
    GradesPublished: assignments.filter(a => a.status === "GradesPublished").length,
    Cancelled: assignments.filter(a => a.status === "Cancelled").length,
  };

  // Card configuration for each status
  const statusCards = [
    {
      label: "Total Assignments",
      count: assignments.length,
      bgColor: "bg-gray-50",
      labelColor: "text-gray-700",
      countColor: "text-gray-800"
    },
    {
      label: "Draft",
      count: statusCounts.Draft,
      bgColor: "bg-gray-50",
      labelColor: "text-gray-700",
      countColor: "text-gray-800"
    },
    {
      label: "Upcoming",
      count: statusCounts.Upcoming,
      bgColor: "bg-blue-50",
      labelColor: "text-blue-700",
      countColor: "text-blue-800"
    },
    {
      label: "Active",
      count: statusCounts.Active,
      bgColor: "bg-green-50",
      labelColor: "text-green-700",
      countColor: "text-green-800"
    },
    {
      label: "InReview",
      count: statusCounts.InReview,
      bgColor: "bg-yellow-50",
      labelColor: "text-yellow-700",
      countColor: "text-yellow-800"
    },
    {
      label: "Closed",
      count: statusCounts.Closed,
      bgColor: "bg-red-50",
      labelColor: "text-red-700",
      countColor: "text-red-800"
    },
    {
      label: "GradesPublished",
      count: statusCounts.GradesPublished,
      bgColor: "bg-emerald-50",
      labelColor: "text-green-700",
      countColor: "text-green-800"
    },
    {
      label: "Cancelled",
      count: statusCounts.Cancelled,
      bgColor: "bg-red-50",
      labelColor: "text-red-700",
      countColor: "text-red-800"
    }
  ];

  return (
    <div className="grid grid-cols-8 gap-6 mb-8">
      {statusCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow-sm p-6`}
        >
          <div className={`text-sm ${card.labelColor} mb-1`}>
            {card.label}
          </div>
          <div className={`text-3xl font-bold ${card.countColor}`}>
            {card.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstructorAssignmentStatsCards;