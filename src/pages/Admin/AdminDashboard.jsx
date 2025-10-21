import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AdminDashboard() {
  // Mock data
  const stats = {
    totalUsers: 1200,
    students: 950,
    lecturers: 250,
    totalClasses: 85,
    assignmentsOnTime: 320,
    assignmentsLate: 45,
  };

  const submissionData = [
    { name: "On Time", value: stats.assignmentsOnTime },
    { name: "Late", value: stats.assignmentsLate },
  ];

  const COLORS = ["#F37021", "#FF8C42"]; // FPT Orange + lighter orange

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-orange-500">📊 Admin Dashboard</h2>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-orange-500">
          <p className="text-gray-500">Total Users</p>
          <h3 className="text-3xl font-bold text-orange-500">
            {stats.totalUsers}
          </h3>
        </div>

        {/* Students */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-green-500">
          <p className="text-gray-500">Students</p>
          <h3 className="text-3xl font-bold text-green-600">{stats.students}</h3>
        </div>

        {/* Lecturers */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-blue-500">
          <p className="text-gray-500">Lecturers</p>
          <h3 className="text-3xl font-bold text-blue-600">{stats.lecturers}</h3>
        </div>

        {/* Total Classes */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center border-t-4 border-orange-500">
          <p className="text-gray-500">Total Classes</p>
          <h3 className="text-3xl font-bold text-orange-500">
            {stats.totalClasses}
          </h3>
        </div>
      </div>

      {/* Chart: Assignment Submission */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Assignment Submission Status
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

          {/* Summary Numbers */}
          <div className="flex flex-col justify-center">
            <p className="text-gray-600 text-lg">
              Total submissions:{" "}
              <span className="font-bold text-orange-500">
                {stats.assignmentsOnTime + stats.assignmentsLate}
              </span>
            </p>
            <p className="text-green-600">
              ✅ On Time: {stats.assignmentsOnTime}
            </p>
            <p className="text-red-600">⚠️ Late: {stats.assignmentsLate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
