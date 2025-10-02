import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminClassAssignments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignments] = useState([
    { id: 1, title: "Assignment 1", deadline: "2025-03-15", submissions: 25 },
    { id: 2, title: "Assignment 2", deadline: "2025-04-10", submissions: 20 },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-500">
        📄 Assignments for Class {id}
      </h2>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Deadline</th>
              <th className="p-2 text-left">Submissions</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{a.title}</td>
                <td className="p-2">{a.deadline}</td>
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
    </div>
  );
}
