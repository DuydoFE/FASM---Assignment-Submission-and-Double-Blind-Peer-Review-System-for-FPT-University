import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminClassAssignments() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Giả lập thông tin lớp học (sau này call API)
  const classInfo = {
    name: "SE101 - Group A",
    semester: "Spring 2025",
    major: "Software Engineering",
  };

  // Giả lập danh sách bài tập (sau này call API)
  const [assignments] = useState([
    {
      id: 1,
      title: "Assignment 1: Software Design",
      deadline: "2025-03-15",
      submissions: 25,
      status: "Ongoing",
    },
    {
      id: 2,
      title: "Assignment 2: System Analysis",
      deadline: "2025-04-10",
      submissions: 20,
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Assignment 3: Project Report",
      deadline: "2025-02-28",
      submissions: 30,
      status: "Closed",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "text-blue-500";
      case "Ongoing":
        return "text-green-500";
      case "Closed":
        return "text-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-orange-500">
        📄 Assignments for Class {id}
      </h2>

      {/* Thông tin lớp học */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Class Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Class:</span> {classInfo.name}
          </p>
          <p>
            <span className="font-medium">Semester:</span> {classInfo.semester}
          </p>
          <p>
            <span className="font-medium">Major:</span> {classInfo.major}
          </p>
        </div>
      </div>

      {/* Danh sách assignments */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Deadline</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Submissions</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{a.title}</td>
                <td className="p-2">{a.deadline}</td>
                <td className={`p-2 font-semibold ${getStatusColor(a.status)}`}>
                  {a.status}
                </td>
                <td className="p-2">{a.submissions}</td>
                <td className="p-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/classes/${id}/assignments/${a.id}`)
                    }
                    className="text-orange-500 hover:underline"
                  >
                    View Submissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gợi ý mô tả cho phần chi tiết bài nộp (để sau sẽ là 1 trang riêng) */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-gray-600 text-sm">
        <p className="mb-2 font-medium text-gray-700">📘 Notes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Click <span className="font-medium">“View Submissions”</span> to see
            all student submissions for that assignment.
          </li>
          <li>
            Each submission includes grade, submission time, and on-time status.
          </li>
          <li>
            You can view detailed feedback from instructors and peer reviews.
          </li>
          <li>There is also an option to download each student’s submission.</li>
        </ul>
      </div>
    </div>
  );
}
