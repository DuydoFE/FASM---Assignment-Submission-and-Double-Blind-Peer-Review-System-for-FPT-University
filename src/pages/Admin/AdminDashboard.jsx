import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminDashboard() {
  const stats = {
    activeUsers: 1085,
    totalClasses: 92,
    activeAssignments: 150,
    ongoingReviews: 310,
    systemErrors: 3,
    ruleViolations: 5,
    onTimeSubmissions: 420,
    lateSubmissions: 60,
    reviewsCompleted: 280,
    reviewsPending: 30,
  };

  const submissionData = [
    { name: "On Time", value: stats.onTimeSubmissions },
    { name: "Late", value: stats.lateSubmissions },
  ];

  const reviewData = [
    { name: "Completed", value: stats.reviewsCompleted },
    { name: "Pending", value: stats.reviewsPending },
  ];

  const COLORS = ["#F37021", "#FF8C42"];

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-orange-500">
        📊 System Activity Dashboard
      </h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-green-500">
          <p className="text-gray-500">Active Users</p>
          <h3 className="text-3xl font-bold text-green-600">
            {stats.activeUsers}
          </h3>
        </div>

        {/* Active Classes */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-blue-500">
          <p className="text-gray-500">Active Classes</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {stats.totalClasses}
          </h3>
        </div>

        {/* Ongoing Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-orange-500">
          <p className="text-gray-500">Active Assignments</p>
          <h3 className="text-3xl font-bold text-orange-500">
            {stats.activeAssignments}
          </h3>
        </div>

        {/* Ongoing Reviews */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-yellow-500">
          <p className="text-gray-500">Ongoing Reviews</p>
          <h3 className="text-3xl font-bold text-yellow-600">
            {stats.ongoingReviews}
          </h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Submission Status Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={submissionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {submissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Summary */}
            <div className="flex flex-col justify-center">
              <p className="text-gray-600 text-lg">
                Total Submissions:{" "}
                <span className="font-bold text-orange-500">
                  {stats.onTimeSubmissions + stats.lateSubmissions}
                </span>
              </p>
              <p className="text-green-600">
                ✅ On Time: {stats.onTimeSubmissions}
              </p>
              <p className="text-red-600">
                ⚠️ Late: {stats.lateSubmissions}
              </p>
            </div>
          </div>
        </div>

        {/* Review Progress Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Review Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-review-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Summary */}
            <div className="flex flex-col justify-center">
              <p className="text-gray-600 text-lg">
                Total Reviews:{" "}
                <span className="font-bold text-orange-500">
                  {stats.reviewsCompleted + stats.reviewsPending}
                </span>
              </p>
              <p className="text-green-600">
                ✅ Completed: {stats.reviewsCompleted}
              </p>
              <p className="text-yellow-600">
                ⏳ Pending: {stats.reviewsPending}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">⚠️ System Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <p className="text-red-700 font-medium">
              System Errors Detected: {stats.systemErrors}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Includes API timeout, data sync issues, or server disruptions.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <p className="text-yellow-700 font-medium">
              Process Violations: {stats.ruleViolations}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Includes late reviews or invalid grading formats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
