import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssignmentsByCourseInstance,
  getCourseInstanceById,
} from "../../service/adminService";

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

  if (loading)
    return <div className="text-center text-gray-500 mt-10">⏳ Loading...</div>;

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        ❌ Error: {error}
      </div>
    );

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-orange-500">
        📄 Assignments for Class {id}
      </h2>

      {/* 🔹 Thông tin lớp học */}
      {classInfo && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Class Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Class Name:</span>{" "}
              {classInfo.sectionCode || "-"}
            </p>
            <p>
              <span className="font-medium">Course Name:</span>{" "}
              {classInfo.courseName || "-"}
            </p>
            <p>
              <span className="font-medium">Semester:</span>{" "}
              {classInfo.semesterName || "-"}
            </p>
            <p>
              <span className="font-medium">Campus:</span>{" "}
              {classInfo.campusName || "-"}
            </p>
          </div>
        </div>
      )}

      {/* 🔹 Bảng assignments */}
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
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{a.title}</td>
                  <td className="p-2">
                    {a.deadline
                      ? new Date(a.deadline).toLocaleString()
                      : "-"}
                  </td>
                  <td
                    className={`p-2 font-semibold ${getStatusColor(a.status)}`}
                  >
                    {a.status || "N/A"}
                  </td>
                  <td className="p-2">{a.submissions ?? "-"}</td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/classes/${id}/assignments/${a.assignmentId}`)
                      }
                      className="text-orange-500 hover:underline"
                    >
                      View Submissions
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
