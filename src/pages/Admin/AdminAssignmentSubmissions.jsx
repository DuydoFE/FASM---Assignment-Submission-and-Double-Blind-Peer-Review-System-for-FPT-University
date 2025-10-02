import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminAssignmentSubmissions() {
  const { id, assignmentId } = useParams();

  // Fake submissions
  const [submissions] = useState([
    {
      id: 1,
      student: "Nguyen Van A",
      studentId: "SE12345",
      submittedAt: "2025-03-14 21:00",
      status: "On time",
      grade: 85,
    },
    {
      id: 2,
      student: "Le Van B",
      studentId: "SE12346",
      submittedAt: "2025-03-16 09:30",
      status: "Late",
      grade: 72,
    },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">
        📑 Submissions for Assignment {assignmentId} (Class {id})
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Submitted At</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Grade</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{s.student}</td>
                  <td className="p-2">{s.studentId}</td>
                  <td className="p-2">{s.submittedAt}</td>
                  <td
                    className={`p-2 ${
                      s.status === "On time"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {s.status}
                  </td>
                  <td className="p-2">{s.grade ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
